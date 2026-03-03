---
title: "When Your Client Has 500 Rows, Not 500 Million"
slug: "small-data-ml"
description: "Most real-world ML happens on small datasets. Here's how to make it work — feature engineering, strong priors, validation strategy, and knowing when to stop."
date: "2026-04-07"
readTime: "5 min read"
tags:
  - Machine Learning
  - Small Business
  - Feature Engineering
  - Best Practices
hero: "/images/blog/small-data-ml-hero.png"
---

Open any ML tutorial, and the dataset has 100,000 rows. Open a Kaggle competition, and it has 1 million. Read a research paper, and it has 10 million. The implicit message is clear: more data is always better, and if you don't have enough, go get more.

Now talk to a real small business. The boat dealer has 1,800 historical sales. The shrimping fleet has 900 trip records. The law firm has 3,200 classified intakes. The urgent care network has 14,000 patient visits across five clinics — which sounds like a lot until you realize you're predicting per-clinic-per-day volume, and suddenly each prediction has a few dozen comparable data points.

This is the reality of applied ML outside of Big Tech: the data is small, it's messy, and you can't just collect more. The techniques that work here are fundamentally different from the ones that dominate the literature.

Over the past year, we built ML systems for [ten different clients](/blog/10-pipelines-10-industries) — and small data was the rule, not the exception. Here's what works.

## Rule 1: Feature Engineering Is Your Model

When you have 500 rows, you don't have enough data for the model to discover complex relationships on its own. You have to encode your domain knowledge *into the features* and let the model learn the simpler mapping from the engineered features to the target.

For [Gulf Coast Boat Sales](/case-studies/gulf-coast-boat-sales), raw features included engine hours, model year, make, and asking price. An XGBoost model using raw features yielded decent accuracy. But when we added `hours_per_year` (a single derived feature that captures usage intensity), MAE dropped by 11%.

That feature didn't come from automated feature generation. It came from a conversation with the dealer: "A boat with 600 hours in three years is a completely different story than 600 hours in ten years." That's domain knowledge expressed as a column in a DataFrame.

The same pattern repeated across every engagement. For [Valley Citrus & Agriculture](/case-studies/valley-citrus-agriculture), encoding the interaction between cumulative chill hours and bloom timing was the key feature for yield prediction. For [Rio Grande Builders](/case-studies/rio-grande-builders), the ratio of active permits to available lots in a ZIP code was more predictive than any individual feature. In each case, a 30-minute conversation with the domain expert was worth more than any amount of hyperparameter tuning.

**Practical approach:** Before touching a model, spend an hour with the client asking one question: "When you make this decision without data, what factors are you weighing in your head?" Then encode each factor as a feature. You'll cover 80% of the signal before the model even trains.

## Rule 2: Validation Strategy Matters More Than Model Selection

With large datasets, a random 80/20 train-test split is usually fine. With small datasets, it can be catastrophically misleading.

Consider the urgent care forecasting problem. If you randomly split patient visits into train and test sets, you'll leak temporal information — the model will "know" about flu season patterns from test-set dates that appear in the training set's time neighborhood. Your validation accuracy will be inflated, and the model will underperform in production when it encounters genuinely unseen time periods.

For any small-dataset project with a time component, we use **temporal cross-validation** — training on data up to a cutoff point and testing on data after it, then sliding the window forward.

```python
from sklearn.model_selection import TimeSeriesSplit

tscv = TimeSeriesSplit(n_splits=5, test_size=30)

scores = []
for train_idx, test_idx in tscv.split(X):
    model.fit(X.iloc[train_idx], y.iloc[train_idx])
    score = model.score(X.iloc[test_idx], y.iloc[test_idx])
    scores.append(score)

# Report mean and std — the variance tells you as much as the mean
print(f"Mean R²: {np.mean(scores):.3f} ± {np.std(scores):.3f}")
```

For classification problems without a time dimension, **stratified k-fold with k=5** is the minimum. With very small datasets (under 500 rows), **leave-one-out cross-validation** can give more stable estimates — though it's computationally expensive and sensitive to outliers.

The validation variance is as important as the validation score. If your model scores 0.89 ± 0.02 across folds, it is reliable. If it scores 0.89 ± 0.15, you have a model that works great on some subsets and fails on others — and you need to understand why before deploying.

## Rule 3: Regularize Aggressively

Small datasets are overfitting traps. A model with too much capacity will memorize the training data and generalize poorly. The defense is aggressive regularization.

For tree-based models (XGBoost, LightGBM, Random Forest), this means:

```python
from xgboost import XGBRegressor

model = XGBRegressor(
    n_estimators=200,
    max_depth=3,           # Shallow trees — resist going deeper
    min_child_weight=10,   # Require more samples per leaf
    learning_rate=0.05,    # Slow learning rate
    subsample=0.8,         # Row subsampling
    colsample_bytree=0.7,  # Feature subsampling
    reg_alpha=0.1,         # L1 regularization
    reg_lambda=1.0,        # L2 regularization
)
```

`max_depth=3` feels restrictive. It is. That's the point. With 1,000 rows, a depth-8 tree can create leaf nodes with single-digit samples, and those leaves will overfit to noise. Shallow trees with ensemble averaging are more robust.

For the [Gulf Shrimping Operations](/case-studies/gulf-shrimping-operations) trip profitability model, we tested `max_depth` values from 2 to 8. Depth 3 and depth 4 performed identically on validation; depth 6+ showed clear overfitting (training error dropped while validation error increased). We went with 3.

## Rule 4: Bootstrapping and Confidence Intervals

One underused technique for small data is **bootstrapped prediction intervals**. Instead of giving the client a single point prediction ("this boat should be listed at $34,200"), give them a range ("$31,500 - $36,800, with $34,200 as the best estimate").

```python
from sklearn.utils import resample

def bootstrap_prediction(model, X, X_train, y_train, n_iterations=100):
    predictions = []
    for _ in range(n_iterations):
        X_boot, y_boot = resample(X_train, y_train)
        model.fit(X_boot, y_boot)
        pred = model.predict(X)
        predictions.append(pred)
    
    predictions = np.array(predictions)
    return {
        'point': np.median(predictions, axis=0),
        'lower': np.percentile(predictions, 5, axis=0),
        'upper': np.percentile(predictions, 95, axis=0),
    }
```

This does two things. First, it gives the client honest uncertainty bounds, which builds more trust than false precision. Second, it reveals where the model is confident and where it isn't. A prediction with tight bounds ("$33K - $35K") means the model has seen many similar units. A prediction with wide bounds ("$28K - $42K") indicates the model is extrapolating, and the client should place greater weight on their own judgment.

For the [Valley Auto Exchange](/case-studies/valley-auto-exchange) pricing system, we surfaced confidence intervals in the dashboard. The dealer quickly learned to trust tight-interval predictions and double-check wide-interval ones — exactly the behavior we wanted.

## Rule 5: Know When More Data Won't Help

There's a tempting assumption that if the model isn't performing well, you need more data. Sometimes that's true. But with small-data clients, collecting more data often isn't feasible — and even when it is, the marginal return can be near zero.

The diagnostic is a **learning curve**: plot model performance as a function of training set size.

```python
from sklearn.model_selection import learning_curve

train_sizes, train_scores, val_scores = learning_curve(
    model, X, y, 
    train_sizes=np.linspace(0.2, 1.0, 10),
    cv=5, scoring='neg_mean_absolute_error'
)
```

If the training and validation curves have converged, more data won't help — you need better features or a different model structure. If the validation curve is still rising, more data would help — but you need to decide whether collecting it is worth the cost.

In practice, for most of our SMB clients, the learning curve flattened well before the full dataset was used. Feature engineering had a much larger impact than dataset size.

## Rule 6: Simple Baselines First, Always

Before training any ML model, establish a baseline that a non-technical person would consider "the obvious approach." For pricing, that's the average sale price of comparable units. For forecasting, it's last year's numbers for the same period. For classification, it's the majority-class rate.

If your ML model doesn't meaningfully beat the simple baseline, you don't have an ML problem — you have a data problem or a feature problem. And it's better to discover that before you've built a deployment pipeline.

For [SPI Beach Resort](/case-studies/spi-beach-resort), the "same week last year" baseline was surprisingly hard to beat for occupancy forecasting. Prophet with external regressors beat it by about 8 percentage points in accuracy — meaningful, but a reminder that simple approaches can be strong on seasonal data.

---

Small-data ML isn't a lesser version of big-data ML. It's a different discipline with different priorities: feature engineering over architecture search, validation discipline over raw performance, interpretability over marginal accuracy, and honest uncertainty over false precision.

Most real-world businesses operate in the small-data regime. The techniques here aren't workarounds — they're the right approach for the problem at hand.

*See these techniques in practice across [ten case studies](/case-studies), or [start with a discovery call](/contact).*
