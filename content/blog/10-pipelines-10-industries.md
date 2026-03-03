---
title: "10 ML Pipelines for 10 Different Industries: What We Learned"
slug: "10-pipelines-10-industries"
description: "We built ML systems for boat dealers, shrimp fleets, law firms, hospitals, and more. Here's what actually transfers across industries — and what doesn't."
date: "2026-03-03"
readTime: "5 min read"
tags:
  - Machine Learning
  - Case Studies
  - Small Business
  - Production AI
hero: "/images/blog/10-pipelines-hero.png"
---

Over the past year, DataSalt built and deployed ML systems across ten different industries — from a family-owned boat dealership to a bilingual municipal chatbot, from a commercial shrimping fleet to a personal injury law firm. Every engagement started with a different problem. Most of them ended up using overlapping techniques.

That's the quiet truth about applied ML: the hard part is rarely the algorithm. It's understanding the domain well enough to ask the right question, then engineering a pipeline that survives contact with real data. The model is just the middle part.

Here's what we built, what we learned, and what actually transfers.

## The Portfolio at a Glance

Our ten case studies break down into four problem types. Recognizing which type you're dealing with is more than half the battle.

**Pricing & Valuation**: [Gulf Coast Boat Sales](/case-studies/gulf-coast-boat-sales), [Valley Auto Exchange](/case-studies/valley-auto-exchange)

**Demand Forecasting**: [SPI Beach Resort](/case-studies/spi-beach-resort), [South Texas Urgent Care](/case-studies/south-texas-urgent-care), [Valley Citrus & Agriculture](/case-studies/valley-citrus-agriculture)

**Operational Optimization**: [Gulf Shrimping Operations](/case-studies/gulf-shrimping-operations), [Rio Grande Builders](/case-studies/rio-grande-builders)

**NLP & Text Intelligence**: [Garza, Robles & Cantu Law](/case-studies/grc-law), [HarliBot](/case-studies/harlibot), [Market Regime Detector](/case-studies/market-regime-detector)

Notice there's no "AI for AI's sake" category. Every pipeline exists because a business had a specific, measurable problem. That matters more than it sounds.

## Pricing: Boats and Used Cars Are the Same Problem

The boat dealership and the used-car lot looked like different worlds — different inventory cycles, different buyer psychology, different margin structures. But the underlying ML problem was nearly identical: predict fair market value from a sparse feature set, then optimize when to buy and when to discount.

Both pipelines landed on XGBoost for pricing prediction. Not because it's trendy, but because it handles mixed feature types cleanly, tolerates missing data, and produces models that a dealership owner can actually interrogate with SHAP values. When a dealer asks, "Why did the model price this boat at $34K?" — you need to have an answer that isn't "the neural network said so."

The key lesson: **feature engineering mattered more than model selection.** For boats, encoding the interaction between engine hours and model year was worth more than any hyperparameter sweep. For cars, days-on-lot, as a decaying weight in comparable sales, was the single biggest accuracy gain.

Both systems significantly reduced aged inventory — 23% faster turnover for boats and 37% fewer days on lot for cars. The models weren't exotic. The feature engineering was specific.

## Forecasting: Seasonality Is the Great Equalizer

A beach resort, an urgent care clinic, and a citrus cooperative don't have much in common — until you look at their data. All three are dominated by seasonal patterns, making naive ML models useless.

Prophet handled the baseline for all three. It's not the most sophisticated time-series tool, but it decomposes trend, seasonality, and holidays in a way that's interpretable by non-technical stakeholders. When a resort GM can look at the forecast and say "that Thanksgiving spike looks about right" — that's trust you can't engineer with a better RMSE score.

Where things diverged was in the external regressors. The resort needed weather data and local event calendars. The clinic needed flu season indices and school schedules. The citrus growers needed freeze probability curves and irrigation sensor data. Same forecasting framework, completely different feature pipelines feeding into it.

The urgent care network added a no-show prediction layer (XGBoost again) to inform staffing optimization. The resort added NLP-driven guest sentiment analysis using BERTopic on review data. Both were downstream enrichments to the core forecasting pipeline — not separate projects.

Lesson: **start with a solid forecasting baseline before adding complexity. In every case, the Prophet with domain-specific regressors achieved 85-90% accuracy. The last 5% came from stacking additional models, and that last 5% isn't always worth the engineering overhead for a small business.

## Operations: Optimization for People Who Don't Call It Optimization

The shrimping fleet and the home builder were our most operationally complex engagements. Neither client would describe their problem as "optimization" — the shrimpers wanted to know when to sell their catch, and the builder wanted to know where to buy land.

But both problems reduced to the same structure: given constrained resources (boats and fuel, or capital and construction crews), allocate them across options (fishing zones and market windows, or neighborhoods and buyer segments) to maximize return.

For the shrimping fleet, we built a trip profitability model that combined catch-per-unit-effort predictions with wholesale price forecasting. The fleet saved $127K in fuel costs — not by changing where they fished, but by changing *when* they returned to port based on real-time price signals.

For Rio Grande Builders, lead scoring was the entry point — ranking prospective buyers by likelihood to close — but the real value came from neighborhood demand forecasting. By combining permit data, school enrollment trends, and MLS activity, we built a model that predicted where demand would form 6-12 months out. Their unsold inventory dropped 62%.

Lesson: **The client's description of the problem is usually one layer above the actual ML problem.** "Help me sell more houses" is really "help me predict where demand is forming." "Help me make more money shrimping" is really "help me time the market."

## NLP: Where Domain Specificity Wins

Our three NLP-heavy projects were the most technically varied — and the ones where generic off-the-shelf solutions would have failed the hardest.

**GRC Law** needed bilingual document triage for a personal injury practice. Intake forms, medical records, and police reports arrive in English and Spanish, and the firm needed to classify case viability within hours, not days. We fine-tuned a BERT model on legal intake documents and paired it with AWS Textract for OCR. Classification accuracy hit 94.2%, and intake-to-assessment time dropped 73%. The bilingual requirement wasn't an afterthought — it was the core technical challenge, and it's one that most NLP vendors handle poorly for legal Spanish.

**HarliBot** was a different kind of NLP problem: building a bilingual municipal chatbot for the City of Harlingen that could handle everything from utility bill questions to pothole reports in both English and Spanish. The challenge wasn't model sophistication — it was integration. The bot needed to connect to five different city systems and handle conversational context across languages without forcing residents to restart in a single language.

**Market Regime Detector** was our most research-oriented project — a cross-asset sentiment classification system that processes financial news, earnings calls, and SEC filings to detect market regime shifts 2-5 days before they show up in price action. This one used FinBERT for domain-specific sentiment encoding and required careful handling of temporal leakage in the training pipeline. It's the kind of project where the validation methodology matters as much as the model architecture.

Lesson: **NLP projects live or die on domain-specific data handling.** Legal Spanish is not conversational Spanish. Municipal service requests are not customer support tickets. Financial sentiment is not social media sentiment. The model architecture is table stakes — the data pipeline is where the value is.

## What Transfers Across All Ten

After building across this range of industries, a few patterns held true everywhere:

**XGBoost is the workhorse of small-data ML.** When your client has 2,000 rows, not 2 million, gradient-boosted trees outperform everything else for tabular prediction. We used it in seven of ten projects.

**SHAP values are non-negotiable.** Every client wanted to understand *why* the model made a prediction. Explainability isn't a nice-to-have — it's a deployment requirement. If the stakeholder doesn't trust the model, it won't be used.

**Prophet is a reasonable default for time-series forecasting.** Not always the final model, but always a good starting point that produces interpretable baselines.

**Feature engineering beats model complexity.** In every single project, the biggest accuracy gains came from domain-specific feature engineering, not from trying fancier architectures.

**The last mile is a dashboard, not a notebook.** Every deployment included a visualization layer — usually Recharts in a React frontend. A model that lives in a Jupyter notebook isn't used.

## What Doesn't Transfer

**Domain knowledge.** Every industry has implicit rules that don't appear in the data. Shrimpers know that certain weather patterns mean the catch will be low-quality regardless of quantity. Citrus growers know that a 28°F freeze for two hours is survivable, but four hours isn't. Lawyers know which case types settle fast. You can't learn this from a Kaggle dataset.

**Data quality assumptions.** The boat dealership had clean CRM data. The shrimping fleet had handwritten logbooks. The urgent care network had three different EMR systems that didn't talk to each other. The data engineering work ranged from 10% to 60% of the project.

**Stakeholder readiness.** Some clients were ready to act on model outputs immediately. Others needed months of "the model said X, and X happened" before they trusted it enough to change their behavior. Building trust is part of the deployment.

---

Ten industries. Four problem types. One consistent takeaway: production ML is less about the model and more about everything around the model — the features, the data pipeline, the explainability layer, and the interface that puts predictions in front of the person who needs them.

If your business has a prediction problem, a classification problem, or a "we're drowning in unstructured text" problem, it probably looks a lot like one of these ten. That's not a limitation. That's the point.

*Browse all ten case studies at [datasalt.ai/case-studies](/case-studies), or [start with a discovery call](/contact).*
