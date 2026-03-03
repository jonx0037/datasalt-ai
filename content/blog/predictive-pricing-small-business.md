---
title: "Predictive Pricing for Small Business: Lessons from Boats and Used Cars"
slug: "predictive-pricing-small-business"
description: "We built ML pricing models for a boat dealer and a used-car lot. The industries are different. The models are surprisingly similar — and the real gains came from feature engineering, not algorithms."
date: "2026-03-10"
readTime: "5 min read"
tags:
  - Pricing
  - XGBoost
  - Small Business
  - Feature Engineering
hero: "/images/blog/predictive-pricing-hero.png"
---

Pricing inventory is one of the oldest problems in retail. It's also one of the most undertooled. Most small dealers — whether they sell boats, cars, equipment, or anything else with variable condition and uncertain demand — price by gut feel, adjusted by how long something has been sitting on the lot.

That works until it doesn't. And it usually stops working quietly: margins erode by a few hundred dollars per unit, inventory ages a few extra weeks, and the owner can't point to exactly when things shifted.

We built ML-powered pricing systems for two South Texas dealerships — [Gulf Coast Boat Sales](/case-studies/gulf-coast-boat-sales), and [Valley Auto Exchange](/case-studies/valley-auto-exchange) — and the overlap between the two projects was striking. Here's what we found.

## The Setup: Two Businesses, One Problem

Gulf Coast Boat Sales is a family-owned marine dealership. Their inventory ranges from $8K bay boats to $85K center consoles, with a wide variation in condition, engine hours, and optional equipment. The owner had been pricing based on years of experience and periodic checks of competitor listings.

Valley Auto Exchange is a used-car lot moving 40-60 vehicles a month. Their inventory is higher-volume, lower-margin, and more sensitive to market timing. The general manager priced based on KBB, auction data, and a healthy dose of intuition.

Both businesses had the same fundamental question: **What should this unit be listed at, and when should I adjust the price?**

## Why XGBoost, Not Deep Learning

For both projects, we chose XGBoost as the core pricing model. This wasn't a default choice — it was a deliberate one based on the realities of small-business data.

**Row counts are modest.** Gulf Coast Boat Sales had roughly 1,800 historical transactions. Valley Auto had about 4,200. At these volumes, deep learning doesn't have enough data to learn generalizable representations. Gradient-boosted trees handle this scale naturally.

**Features are mixed-type.** Both datasets include continuous variables (mileage, engine hours, age), categorical variables (make, model, body type, hull material), and ordinal variables (condition rating). XGBoost ingests all of these without elaborate preprocessing.

**Missing data is the norm.** Not every boat listing records engine hours. Not every car record includes service history. XGBoost handles missingness natively — it learns optimal split directions for missing values during training. With smaller datasets, imputation introduces more noise than it removes.

**Explainability is a deployment requirement.** When you hand a pricing recommendation to a dealer, the first thing they ask is "why?" SHAP values provide a per-prediction breakdown: this boat is priced at $34K because of the engine hours (which push the price down), the brand (which pushes the price up), and the trailer inclusion (which pushes the price up). That transparency is what gets the model actually used.

```python
import shap

explainer = shap.TreeExplainer(model)
shap_values = explainer(X_test)

# Per-prediction explanation for a specific unit
shap.waterfall_plot(shap_values[0])
```

If the dealer disagrees with the model, the SHAP plot gives them concrete grounds to push back. "The model doesn't know this boat has a brand-new trolling motor" is actionable feedback. "The neural network says $34K" is a dead end.

## Where the Real Gains Were: Feature Engineering

Both projects followed the same arc: the first model with raw features was decent. The model with engineered features was significantly better. The model with a fancier algorithm was barely different.

### Boats: Engine Hours × Model Year Interaction

For boats, the single biggest accuracy gain came from encoding the interaction between engine hours and model year. A 2018 boat with 600 hours is in a completely different market position than a 2018 boat with 50 hours — but the relationship between hours and value isn't linear, and it depends on the age of the boat. Low hours on a 10-year-old boat can signal neglect as much as gentle use.

We created binned interaction features that captured these non-linear relationships:

```python
df['hours_per_year'] = df['engine_hours'] / (current_year - df['model_year'] + 1)
df['hours_bin'] = pd.cut(df['hours_per_year'], bins=[0, 30, 75, 150, 500], labels=['low', 'moderate', 'high', 'very_high'])
```

This single feature family dropped MAE by 11% compared to using raw engine hours and model year independently.

### Cars: Days-on-Lot Decay Weighting

For used cars, the most impactful feature was a recency-weighted comparable sale metric. Instead of treating all historical sales of a similar vehicle equally, we weighted recent sales exponentially higher:

```python
import numpy as np

def weighted_comps(row, history, decay_rate=0.03):
    comps = history[
        (history['make'] == row['make']) &
        (history['model'] == row['model']) &
        (abs(history['mileage'] - row['mileage']) < 15000)
    ].copy()
    days_ago = (pd.Timestamp.now() - comps['sale_date']).dt.days
    comps['weight'] = np.exp(-decay_rate * days_ago)
    return np.average(comps['sale_price'], weights=comps['weight'])
```

This matters because the used-car market moves faster than the boat market. A comparable sale from 90 days ago is already stale for a Civic, but still relevant for a center console. The decay rate itself became a tunable parameter per vehicle segment.

## The Discount Timing Problem

Pricing the initial listing is only half the problem. The other half is knowing when to cut the price — and by how much.

Both dealerships had the same bad pattern: they'd hold firm on price for too long, then slash it aggressively when they needed floor space. The optimal strategy in both cases was to make more frequent, smaller adjustments triggered by market signals rather than by desperation.

For boats, we built a simple time-in-inventory decay curve calibrated to the local market. If a unit hasn't generated a lead within the expected window for its category, the model recommends a 3-5% adjustment. This is less dramatic than the 10-15% panic cuts the dealer was making, but it triggers earlier, and the net effect on turnover was substantial.

For cars, the signal was denser: we could track page views and inquiry rates from the dealer's listing platform. When a vehicle's engagement rate dropped below the segment average, the model flagged it for repricing. This real-time feedback loop was the difference between Valley Auto's 37% reduction in days-on-lot and a more modest improvement.

## Results in Context

| Metric | Gulf Coast Boats | Valley Auto |
|--------|-----------------|-------------|
| Inventory Turnover | +23% faster | -37% days on lot |
| Per-Unit Margin | +$2,800 avg uplift | +$840 avg gross |
| Aged Inventory | Reduced significantly | -71% units over 60 days |

The boat dealership saw larger per-unit gains because the price points are higher and the margins are wider. The car lot saw faster turnover improvements because the data feedback loop was tighter and the market moved more quickly.

Neither result came from a breakthrough algorithm. Both came from encoding domain knowledge into features, building explainable models, and giving the dealer a tool they trusted enough to act on.

## The Takeaway for Other Small Businesses

If you sell variable-condition inventory — boats, cars, equipment, real estate, anything with a "this one is a little different" problem — the pattern is the same:

Start with XGBoost on your historical transaction data. Engineer features that capture the relationships your experienced salespeople already know intuitively. Use SHAP values to make the model transparent. Build a discount-timing layer that triggers on market signals, not calendar dates.

The model won't replace the dealer's expertise. It will make that expertise systematic and consistent — which is where the margin improvement actually comes from.

*Read the full case studies: [Gulf Coast Boat Sales](/case-studies/gulf-coast-boat-sales) and [Valley Auto Exchange](/case-studies/valley-auto-exchange). Or [start with a discovery call](/contact).*
