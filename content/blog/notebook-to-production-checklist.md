---
title: "From Jupyter Notebook to Production: A Deployment Checklist"
slug: "notebook-to-production-checklist"
description: "The model works in your notebook. Now what? A practical checklist for deploying ML models — based on what we've actually shipped, not what the textbooks recommend."
date: "2026-04-14"
readTime: "5 min read"
tags:
  - MLOps
  - Production AI
  - Deployment
  - Best Practices
hero: "/images/blog/notebook-to-production-hero.png"
---

Your model works in a Jupyter notebook. The metrics look good. The stakeholder is excited. Now someone has to turn it into something that runs reliably, returns predictions on demand, and doesn't silently break three months from now.

This is where most ML projects die. Not because the model was wrong, but because the gap between "it works on my laptop" and "it works in production" is wider than most teams expect — especially teams that haven't done it before.

In our [first blog post](/blog/getting-started-with-mlops), we covered the conceptual framework of MLOps. This is the operational follow-up: a concrete checklist for moving a model from notebook to production, based on what we've actually shipped across [ten client deployments](/blog/10-pipelines-10-industries). It's opinionated. Not everything here is necessary for every project. But skipping any of these steps should be a deliberate decision, not an oversight.

## Phase 1: Code Extraction

### 1.1 Move out of the notebook

The notebook is for exploration. Production code lives in `.py` files with clear separation of concerns. At a minimum, you need three modules:

```
project/
├── data/
│   └── pipeline.py        # Data loading and feature engineering
├── model/
│   └── train.py           # Training and evaluation
├── serve/
│   └── app.py             # Prediction API
├── config.py              # Hyperparameters, file paths, constants
└── requirements.txt
```

The temptation is to keep the notebook around as the "real" code and just call it from a script. Don't. Notebooks have a hidden state, a non-linear execution order, and no clean way to handle errors. Extract the code and delete the notebook from the production repo. Keep it in a separate `/notebooks` directory for exploration only.

### 1.2 Pin your dependencies

```
# requirements.txt — pin exact versions
pandas==2.2.1
scikit-learn==1.4.1
xgboost==2.0.3
fastapi==0.110.0
uvicorn==0.29.0
```

"Latest" is not a version. The model you validated was trained with specific library versions, and a minor update to scikit-learn or XGBoost can change the model's predictions. We've seen XGBoost minor versions produce different results on identical data due to changes in default hyperparameters.

### 1.3 Parameterize everything

Hardcoded file paths, magic numbers, and inline hyperparameters all become problems when someone else (or future-you) needs to retrain or debug.

```python
# config.py
DATA_PATH = "data/transactions.csv"
MODEL_PATH = "model/pipeline.pkl"
TARGET_COLUMN = "sale_price"
TRAIN_TEST_SPLIT = 0.2
RANDOM_STATE = 42

# XGBoost hyperparameters
XGB_PARAMS = {
    'n_estimators': 200,
    'max_depth': 3,
    'learning_rate': 0.05,
    'min_child_weight': 10,
}
```

## Phase 2: Validation Hardening

### 2.1 Add a holdout set you never touch

Your cross-validation scores are your development metric. Your holdout set is your deployment gate. If the model doesn't meet a predefined threshold on the holdout set, it doesn't ship.

For the [Valley Auto Exchange](/case-studies/valley-auto-exchange) pricing model, our deployment gate was MAE under $1,200 on the holdout set. The first model iteration missed by $300. Feature engineering closed the gap — but having the gate prevented us from shipping a model that looked good on CV but underperformed on truly unseen data.

### 2.2 Test on the right distribution

If your model will serve predictions for next month's data, your holdout set should be the most recent data, not a random sample of all data. This is obvious for time-series but applies to any setting where the data distribution might shift over time.

For the [South Texas Urgent Care](/case-studies/south-texas-urgent-care) patient volume model, we trained on 2023-2024 data and held out Q1 2025 as the deployment gate. The model performed well — but it would have performed *better* on a random holdout, which would have been misleading.

### 2.3 Define failure modes

Before deployment, write down: "If the model is wrong, what happens?" The answer determines how conservative your deployment should be.

For pricing models, a bad prediction means a unit is overpriced (it sits) or underpriced (you lose margin). Both are costly but recoverable. For the urgent care staffing model, a bad prediction means patients wait too long or staff are idle. The first is worse than the second. We biased the model toward overstaffing rather than understaffing — a deliberate choice that slightly increased labor costs but protected patient experience.

## Phase 3: Serving Infrastructure

### 3.1 Serialize the full pipeline

Save the entire pipeline — preprocessing and model together — as a single artifact.

```python
import joblib
from sklearn.pipeline import Pipeline

# After training
joblib.dump(pipeline, 'model/pipeline.pkl')

# At serving time
pipeline = joblib.load('model/pipeline.pkl')
prediction = pipeline.predict(new_data)
```

Serializing the pipeline rather than just the model eliminates an entire class of bugs: mismatched feature transformations between training and serving. If your training pipeline applies log transforms, encodes categoricals, and scales features — all of that needs to happen identically at serving time. The pipeline object guarantees it.

### 3.2 Add input validation

The API will receive bad data. Plan for it.

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, validator

class PricingInput(BaseModel):
    make: str
    model_year: int
    engine_hours: float
    condition: str
    
    @validator('model_year')
    def year_in_range(cls, v):
        if v < 1990 or v > 2027:
            raise ValueError('model_year must be between 1990 and 2027')
        return v
    
    @validator('engine_hours')
    def hours_non_negative(cls, v):
        if v < 0:
            raise ValueError('engine_hours must be non-negative')
        return v

@app.post('/predict')
async def predict(input: PricingInput):
    df = pd.DataFrame([input.dict()])
    prediction = pipeline.predict(df)[0]
    return {'predicted_price': round(float(prediction), 2)}
```

Pydantic validation catches bad inputs before they reach the model. Without it, a negative engine hours value would silently produce a prediction — and it might even be a reasonable-looking number, which is worse than an obvious error.

### 3.3 Log predictions

Every prediction the model makes should be logged with its inputs and timestamp. This isn't for debugging — it's for monitoring.

```python
import logging
import json
from datetime import datetime

logger = logging.getLogger('predictions')

@app.post('/predict')
async def predict(input: PricingInput):
    df = pd.DataFrame([input.dict()])
    prediction = pipeline.predict(df)[0]
    
    logger.info(json.dumps({
        'timestamp': datetime.utcnow().isoformat(),
        'input': input.dict(),
        'prediction': float(prediction),
    }))
    
    return {'predicted_price': round(float(prediction), 2)}
```

Three months from now, when someone asks, "Has the model's behavior changed?" — the prediction log is how you answer that question.

## Phase 4: Monitoring

### 4.1 Input drift detection

The simplest form of model monitoring is to check whether today's inputs resemble the training data. If the distribution of incoming features shifts significantly, the model is extrapolating — and its predictions may no longer be reliable.

For SMB deployments, you don't need a real-time drift detection service. A weekly script that compares recent prediction inputs against the training set distribution is sufficient.

```python
from scipy import stats

def check_drift(training_data, recent_data, threshold=0.05):
    alerts = []
    for col in training_data.select_dtypes(include='number').columns:
        stat, p_value = stats.ks_2samp(training_data[col], recent_data[col])
        if p_value < threshold:
            alerts.append(f"Drift detected in {col} (p={p_value:.4f})")
    return alerts
```

For the [Valley Citrus & Agriculture](/case-studies/valley-citrus-agriculture) yield model, we set up a monthly drift check that compared incoming weather data against the training distribution. When an unusually warm winter shifted the chill-hour distribution outside the training range, the drift alert fired, and we retrained with the updated data before the model's predictions degraded.

### 4.2 Prediction distribution monitoring

Separately from input drift, monitor whether the model's *outputs* are shifting. If the pricing model that used to recommend $25K-$45K for center consoles suddenly starts recommending $15K-$30K, something has changed — even if the inputs look normal.

### 4.3 Outcome tracking

The gold standard: compare predictions to actual outcomes once the ground truth is available. For pricing models, that's the actual sale price vs. the recommended price. For forecasting models, it's predicted volume vs. actual volume. For classification, it's the predicted class vs. the actual outcome.

This isn't always immediate — a boat might take weeks to sell, and a case classification might take months to resolve. Build the feedback loop with the appropriate time delay, and run it automatically.

## Phase 5: Retraining

### 5.1 Schedule-based retraining

For most SMB models, monthly or quarterly retraining is sufficient. The schedule depends on how fast the underlying data distribution changes.

The [Gulf Coast Boat Sales](/case-studies/gulf-coast-boat-sales) pricing model trains monthly with the latest transaction data. The [Market Regime Detector](/case-studies/market-regime-detector) retrains weekly because financial sentiment shifts rapidly. The [HarliBot](/case-studies/harlibot) chatbot model is retrained quarterly because municipal service patterns change slowly.

### 5.2 Automated comparison

Every retrain should automatically compare the new model against the current production model on the holdout set. If the new model is better, swap it in. If it's worse, keep the current one and investigate.

```python
current_model = joblib.load('model/current_pipeline.pkl')
new_model = train_new_model(updated_data)

current_score = evaluate(current_model, holdout_X, holdout_y)
new_score = evaluate(new_model, holdout_X, holdout_y)

if new_score > current_score:
    joblib.dump(new_model, 'model/current_pipeline.pkl')
    notify("Model updated. New score: {new_score:.3f}")
else:
    notify(f"New model ({new_score:.3f}) did not beat current ({current_score:.3f}). Keeping current.")
```

This is the simplest possible model registry — and for a single-model deployment, it's all you need.

---

This checklist isn't exhaustive. Large-scale deployments need A/B testing, canary releases, feature stores, and proper CI/CD pipelines. But for SMB deployments, which make up the majority of real-world ML work, these five phases cover the critical path from notebook to production.

The common thread: every step exists to prevent a specific failure mode. Code extraction prevents hidden state bugs. Validation hardening prevents overconfident deployment. Input validation prevents garbage predictions. Monitoring prevents silent degradation. And automated retraining prevents model staleness.

Skip any of these deliberately, not accidentally.

*This is the companion piece to [Getting Started with MLOps](/blog/getting-started-with-mlops). Browse our [case studies](/case-studies) to see these practices in production, or [start with a discovery call](/contact).*
