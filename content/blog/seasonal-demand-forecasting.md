---
title: "Forecasting Demand When Your Data Is Seasonal: Resort Occupancy and Healthcare Visits"
slug: "seasonal-demand-forecasting"
description: "A beach resort and an urgent care network face the same core problem: demand that swings hard by season. Here's how we built forecasting systems for both — and why Prophet was only the starting point."
date: "2026-03-24"
readTime: "5 min read"
tags:
  - Forecasting
  - Time Series
  - Prophet
  - Healthcare
  - Hospitality
hero: "/images/blog/seasonal-forecasting-hero.png"
---

A South Padre Island beach resort and a multi-clinic urgent care network in South Texas don't compete for the same customers. But they share a problem that keeps their operators up at night: demand that swings dramatically by season, and staffing decisions that have to be made weeks before that demand materializes.

Overstaff and you burn money. Understaffed, and you burn reputation. The window to get it right is narrow, and gut feel stops being reliable when you're managing multiple locations or revenue streams.

We built demand forecasting systems for both — [SPI Beach Resort](/case-studies/spi-beach-resort) and [South Texas Urgent Care](/case-studies/south-texas-urgent-care) — and the parallels were instructive. Here's what worked, where the approaches diverged, and why getting the forecast right was only half the battle.

## Why Seasonal Data Breaks Naive Models

Before getting into the solutions, it's worth understanding why seasonal demand is hard to forecast with standard ML approaches.

If you feed a resort's historical occupancy data into a random forest or a linear regression model, you'll get a model that learns the average. It won't capture the fact that Spring Break occupancy is 3x the January baseline, that hurricane season creates a predictable but variable dip, or that a long weekend following a holiday creates a spike that a regular weekend doesn't.

Seasonality isn't a single pattern — it's layered. Weekly patterns (weekends vs. weekdays), monthly patterns (school schedules), annual patterns (holidays, weather seasons), and irregular events (Spring Break dates shift year to year) all stack on top of each other. A model that captures one layer but misses another will look accurate in aggregate while being consistently wrong at the moments that matter most.

This is exactly the problem that Facebook's Prophet was designed to solve.

## Prophet as the Foundation

Prophet decomposes a time series into trend, seasonality (multiple periods), holidays, and residual. For both the resort and the clinic, this decomposition was the right starting framework.

```python
from prophet import Prophet
import pandas as pd

df = pd.DataFrame({
    'ds': date_column,
    'y': demand_column
})

model = Prophet(
    yearly_seasonality=True,
    weekly_seasonality=True,
    daily_seasonality=False,
    changepoint_prior_scale=0.05
)

# Add custom seasonalities if needed
model.add_seasonality(
    name='spring_break',
    period=365.25,
    fourier_order=3
)

model.fit(df)
future = model.make_future_dataframe(periods=90)
forecast = model.predict(future)
```

The appeal of Prophet for client-facing work isn't just accuracy — it's interpretability. When a resort GM looks at the forecast plot and sees distinct seasonal components, they immediately understand *why* the model predicts a spike in March. That "why" is what converts a forecast from a curiosity into an operational tool.

Both systems hit 89% forecast accuracy with Prophet alone. Getting from 89% to higher required external data — and that's where the two projects diverged.

## Resort: Weather, Events, and Dynamic Pricing

For SPI Beach Resort, the core forecast was room-night demand by week. But the resort doesn't just need to know *how many* guests are coming — it also needs to know *when* to adjust rates and *where* to allocate marketing spend.

**External regressors that moved the needle:**

Weather forecasts for the upcoming 10-day window had a measurable impact on short-term booking behavior. We didn't use raw temperature — we created a "beach day probability" composite feature that combined temperature, precipitation chance, and wind speed into a single score that correlated with last-minute booking volume.

Local event calendars — SpaceX launches from nearby Boca Chica, fishing tournaments, SPI conventions — created spikes in demand that weren't captured by standard seasonality. We encoded these as binary regressors with a lead-time window (bookings start increasing 2-3 weeks before a major event).

```python
model.add_regressor('beach_day_score')
model.add_regressor('major_event_upcoming')
model.add_regressor('spacex_launch_window')

df['beach_day_score'] = compute_beach_score(df)
df['major_event_upcoming'] = flag_events(df, events_calendar)
```

**The sentiment layer:** Beyond forecasting volume, we ran BERTopic on the resort's guest reviews to identify recurring complaint themes. This wasn't demand forecasting per se — it was demand *quality* analysis. The resort discovered that pool maintenance complaints spiked during shoulder season (when the pool was the main draw) and that noise complaints correlated with specific room blocks. That intelligence fed into operational decisions, not the pricing model.

The combined system — Prophet forecast plus dynamic pricing simulation — estimated an annual revenue uplift of $340K from better rate timing. The biggest gains weren't from raising prices during peak periods (the resort was already doing that). They came from *not* dropping rates as aggressively during shoulder periods when the model showed sufficient demand at higher price points.

## Urgent Care: Flu Season, No-Shows, and Staffing

The South Texas Urgent Care network operates five clinics. Their forecasting needs were different: predict daily patient volume per clinic, then use that forecast to optimize staffing.

**External regressors for healthcare:**

Flu season indices from CDC ILINet data were the most impactful external signal. Patient volume at urgent care clinics tracks regional influenza activity with a 1-2 week lag. By incorporating weekly ILI (influenza-like illness) rates as a regressor, the model captured flu-season ramp-ups weeks before they appeared in the clinic's own data.

School calendars mattered in ways that weren't obvious. School closures (holidays, teacher in-service days) correlated with *increased* pediatric urgent care visits — not because kids get sicker on days off, but because parents who can't get same-day appointments with their pediatrician bring kids to urgent care instead.

```python
model.add_regressor('ili_rate_lagged')
model.add_regressor('school_closure')
model.add_regressor('pollen_index')
```

**The no-show prediction layer:** Forecasting how many patients will show up isn't the same as forecasting how many will schedule. The clinic network had a persistent no-show problem — roughly 19% of scheduled appointments resulted in no-shows, and the rate varied by clinic, day of the week, and patient demographics.

We built a separate XGBoost classifier to predict the no-show probability for each appointment, trained on historical scheduling and attendance data. Features included day of week, lead time between scheduling and appointment, patient history of prior no-shows, weather, and distance from the patient's zip code to the clinic.

```python
no_show_features = [
    'day_of_week', 'lead_time_days', 'prior_no_shows',
    'distance_miles', 'rain_probability', 'is_monday'
]

no_show_model = XGBClassifier(
    n_estimators=200,
    max_depth=4,
    learning_rate=0.05
)
no_show_model.fit(X_train[no_show_features], y_train)
```

The no-show model didn't eliminate no-shows — but it let the clinics overbook intelligently. Instead of blanket overbooking (which creates wait time problems when everyone shows up), the system recommended targeted overbooking in slots with high predicted no-show rates.

**Staffing optimization:** The demand forecast and no-show predictions were fed into a staffing model that recommended nurse and provider schedules for each clinic per day. The system reduced average patient wait times by 31% and saved an estimated $215K in annual labor costs — primarily by eliminating overstaffing on low-volume days rather than understaffing during surges.

## What Transfers Between the Two

**Prophet is a strong default for any business with seasonal demand.** The decomposition into trend + seasonality + holidays handles the base case well, and the external regressor API makes it straightforward to layer on domain-specific signals.

**The external regressors are where domain expertise lives.** The model architecture was nearly identical for both projects. The difference was entirely in *what external data we fed it* — and choosing the right regressors required deep conversations with the operators, not just access to more data.

**Downstream enrichment creates the most business value.** The resort got more value from the sentiment analysis layer than from a marginal accuracy improvement in the base forecast. The clinic gained more value from the no-show prediction layer than from a better patient-volume model. In both cases, the core forecast served as the foundation for a more valuable system built on top of it.

**Interpretability drives adoption.** Both clients needed to see *why* the model was predicting a spike or a dip. Prophet's component plots make this natural — you can show the holiday effect, the seasonal effect, and the trend separately, and the stakeholder immediately grasps the logic.

## What Doesn't Transfer

**The definition of "accuracy" varies by industry.** For the resort, being off by 5% on a Tuesday forecast doesn't matter — but being off by 15% on a holiday weekend is catastrophic. For the clinic, being off by 5% on any day directly impacts wait times and staffing costs. We evaluated model performance using weighted error metrics that penalized the predictions that mattered most, rather than uniform RMSE.

**Feedback loop speed is different.** The resort gets booking data days to weeks in advance. The clinic gets the same-day walk-in volume that can't be predicted until the morning. This meant the clinic system needed a real-time adjustment mechanism that the resort system didn't.

**Regulatory context shapes deployment.** Healthcare data handling required a HIPAA-compliant infrastructure and careful de-identification. The resort data was commercially sensitive but didn't carry the same regulatory overhead. The ML work was similar; the engineering around the ML was very different.

---

Seasonal demand forecasting isn't a solved problem — but it's a well-understood one. Prophet gives you a strong baseline. Domain-specific external regressors get you most of the way to actionable accuracy. And the real value usually comes from what you build on top of the forecast, not from the forecast itself.

*Read the full case studies: [SPI Beach Resort](/case-studies/spi-beach-resort) and [South Texas Urgent Care](/case-studies/south-texas-urgent-care). Explore the [live resort dashboard](https://resort.datasalt.ai) to see Prophet forecasting in action — or [start with a discovery call](/contact).*
