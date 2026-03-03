---
title: "The Data Science Stack for Small and Mid-Size Businesses"
slug: "data-science-stack-smb"
description: "You don't need Databricks, Snowflake, or a 10-person data team to get value from ML. Here's the practical stack we use for small-business deployments — and what you can skip."
date: "2026-03-31"
readTime: "5 min read"
tags:
  - MLOps
  - Small Business
  - Production AI
  - Architecture
hero: "/images/blog/ds-stack-smb-hero.png"
---

Most content about data science infrastructure is written for companies with dedicated platform teams, seven-figure cloud budgets, and data measured in terabytes. The recommended stacks reflect that: Databricks for compute, Snowflake for storage, Airflow for orchestration, dbt for transformation, and a half-dozen monitoring tools on top.

That's a reasonable architecture for a Fortune 500 company. It's wildly inappropriate for a boat dealership, a law firm, or a five-clinic urgent care network.

Over the past year, DataSalt deployed ML systems across [ten different industries](/blog/10-pipelines-10-industries) — and every single client was a small or mid-size business. None of them had a data team. Most of them had data in spreadsheets, CRMs, or legacy systems that hadn't been touched in years. Here's the stack that actually works at that scale.

## The Core Principle: Minimize Moving Parts

Every component in your stack can break, needs updating, and requires someone to understand it. For an SMB deployment, the goal isn't architectural elegance — it's reliability with minimal ongoing maintenance.

The stack we've converged on has four layers:

**Data layer:** Python + Pandas (or Polars for larger datasets)
**Model layer:** scikit-learn and XGBoost
**Serving layer:** FastAPI on a managed endpoint
**Interface layer:** React dashboard with Recharts

That's it. No orchestration framework. No feature store. No model registry. Not because those tools aren't useful — they are, at scale — but because for a business with 2,000-10,000 rows of data and a single model in production, the overhead of maintaining those tools exceeds the value they provide.

## Data Layer: Just Use Pandas

The urge to set up a proper data warehouse is strong. Resist it.

For SMB-scale data, a Python script that reads from a CSV, an API, or a database connection and loads into a Pandas DataFrame is the right starting point. It's debuggable, it's portable, and your client's next hire who knows some Python can understand it.

```python
import pandas as pd

# Most SMB data fits in one of these patterns
df = pd.read_csv('data/transactions.csv')          # File export
df = pd.read_sql(query, connection)                 # Database
df = pd.DataFrame(requests.get(api_url).json())     # API
```

When we built the [Gulf Shrimping Operations](/case-studies/gulf-shrimping-operations) pipeline, the fleet's historical data lived in handwritten logbooks that had been partially digitized into a spreadsheet. The entire dataset — years of trip records — fit in a single CSV. Setting up a Snowflake instance for that would have been absurd.

For the [South Texas Urgent Care](/case-studies/south-texas-urgent-care) network, the data came from three different EMR systems. The "data engineering" work was writing extraction scripts for each system and a reconciliation step that merged them into a unified DataFrame. Total infrastructure: a Python script that runs on a cron job.

**When to upgrade:** If your data exceeds what fits in memory (roughly 1-2 GB of CSV), or if you need real-time streaming ingestion, then you've outgrown Pandas. But most SMB datasets are nowhere near that threshold.

## Model Layer: scikit-learn and XGBoost Cover 90% of Use Cases

We used XGBoost as the primary model in seven of our ten case studies. scikit-learn handled preprocessing, cross-validation, and pipeline construction in all ten. Together, they cover the vast majority of tabular prediction problems.

```python
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler, OrdinalEncoder
from sklearn.compose import ColumnTransformer
from xgboost import XGBRegressor

preprocessor = ColumnTransformer([
    ('num', StandardScaler(), numeric_features),
    ('cat', OrdinalEncoder(handle_unknown='use_encoded_value', unknown_value=-1), 
     categorical_features),
])

pipeline = Pipeline([
    ('preprocessor', preprocessor),
    ('model', XGBRegressor(n_estimators=200, max_depth=5, learning_rate=0.05))
])

pipeline.fit(X_train, y_train)
```

The pipeline abstraction matters for deployment — it packages preprocessing and prediction into a single object that you can serialize and load without worrying about feature transformation mismatches between training and serving.

**What about deep learning?** We used BERT-family models for the three NLP-heavy projects ([GRC Law](/case-studies/grc-law), [HarliBot](/case-studies/harlibot), [Market Regime Detector](/case-studies/market-regime-detector)). For everything else — pricing, forecasting, classification on tabular data — gradient-boosted trees outperformed neural approaches at SMB data volumes.

**What about AutoML?** Tools like AutoGluon or H2O can be useful for initial exploration, but they obscure the feature engineering decisions that drive most of the accuracy gains in practice. We'd rather spend time on domain-specific feature engineering with a simple model than let AutoML search over architectures with default features.

## Serving Layer: FastAPI on a Managed Endpoint

The model needs to be callable from whatever system the client uses. For most SMB deployments, that means a REST API that accepts input features and returns a prediction.

FastAPI is our default for this. It's fast, it generates OpenAPI docs automatically, and it's simple enough that a single file handles most use cases:

```python
from fastapi import FastAPI
import joblib

app = FastAPI()
model = joblib.load('model/pipeline.pkl')

@app.post('/predict')
async def predict(features: dict):
    df = pd.DataFrame([features])
    prediction = model.predict(df)[0]
    return {'prediction': float(prediction)}
```

For hosting, we typically deploy on AWS — either a SageMaker endpoint for clients already in the AWS ecosystem, or a simple EC2 instance with Docker for simpler deployments. The [Valley Auto Exchange](/case-studies/valley-auto-exchange) pricing model runs on a SageMaker endpoint, which costs less than $50/month for their query volume.

**What about serverless?** Lambda works for lightweight models with infrequent calls. But cold starts can add 5-10 seconds for models that need to load sklearn/XGBoost into memory, which is too slow for real-time pricing. If the model is called more than a few times per hour, a persistent endpoint is cheaper and faster.

## Interface Layer: React + Recharts

A model that returns predictions via API is useful for developers. It's useless for a dealership owner, a resort GM, or a clinic administrator. Every production deployment needs a visual interface that puts predictions in front of the decision-maker.

We build these as React frontends with Recharts for data visualization. The combination is lightweight, responsive, and produces clean dashboards that non-technical users can navigate.

The interface typically includes three components:

**Prediction view** — the current model output for the thing the client cares about. For [Gulf Coast Boat Sales](/case-studies/gulf-coast-boat-sales), that's a recommended listing price for each unit. For the urgent care network, it's a 7-day patient volume forecast per clinic.

**Explanation view** — SHAP values or feature importance breakdowns that show *why* the model made a specific prediction. This is the trust-building layer.

**Historical performance view** — a running comparison of model predictions vs. actual outcomes. This is what turns a skeptical client into a committed user — when they can see that the model has been right 89% of the time for three months straight.

## What We Deliberately Skip

**Feature stores.** At SMB data volumes, feature computation runs in seconds. There's no need to precompute and cache features in a separate system. The pipeline handles feature engineering at prediction time.

**Model registries.** With a single model in production, version control lives in Git, and the serialized model file lives in S3. When we retrain, we compare metrics and swap the file. A formal registry adds complexity without adding value at this scale.

**Orchestration frameworks.** Airflow and Prefect are powerful but operationally heavy for a pipeline that runs once a day. A cron job that triggers a Python script, with error notifications via email or Slack webhook, is sufficient and dramatically simpler to maintain.

**Monitoring dashboards (the MLOps kind).** Evidently, AI, and similar tools, are excellent for tracking data drift at scale. For an SMB model retrained monthly on a slowly changing dataset, a scheduled script that compares this month's input distributions to last month's and sends an alert if anything looks off does the job.

## When to Scale Up

The stack described above has a ceiling. You'll know you've hit it when:

Your data no longer fits in memory, and Pandas becomes a bottleneck. Move to Polars or a proper warehouse.

You're running multiple models that share features. A feature store starts making sense.

Your model is called thousands of times per minute. Managed endpoints with autoscaling become necessary.

You have multiple team members deploying models. A model registry prevents "which version is in production?" confusion.

None of our ten case study clients has hit these thresholds. Most SMBs won't. Build for where you are, not where a blog post tells you you should be.

---

The gap between "data science in blog posts" and "data science for real small businesses" is mostly a gap in assumptions about infrastructure. The algorithms are the same. The math is the same. The stack just needs to be smaller, simpler, and more maintainable by people who have other things to do besides babysit a Kubernetes cluster.

*See how this stack works in practice across [ten case studies](/case-studies), or [start with a discovery call](/contact).*
