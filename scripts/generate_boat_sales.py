#!/usr/bin/env python3
"""
Generate synthetic boat sales data for the Gulf Coast Boat Sales case study.

Produces:
  - data/raw/boat_sales.csv           (~3,000 transactions)
  - data/raw/inventory_snapshot.csv   (current inventory)
  - data/case-studies/gulf-coast-boat-sales/seasonal-heatmap.json
  - data/case-studies/gulf-coast-boat-sales/shap-waterfall.json
  - data/case-studies/gulf-coast-boat-sales/survival-curves.json
  - data/case-studies/gulf-coast-boat-sales/pricing-features.json
  - data/case-studies/gulf-coast-boat-sales/monthly-sales-trend.json

Usage:
  cd datasalt-ai
  pip install -r scripts/requirements.txt
  python scripts/generate_boat_sales.py
"""

import json
import os
import warnings
from pathlib import Path

import numpy as np
import pandas as pd
from scipy import stats

warnings.filterwarnings("ignore")

# ── Reproducibility ──────────────────────────────────────────────────────────
RNG = np.random.default_rng(42)

# ── Paths ────────────────────────────────────────────────────────────────────
ROOT = Path(__file__).resolve().parent.parent / "datasalt-ai"
if not ROOT.exists():
    ROOT = Path(__file__).resolve().parent.parent  # running from datasalt-ai/

RAW_DIR = ROOT / "data" / "raw"
JSON_DIR = ROOT / "data" / "case-studies" / "gulf-coast-boat-sales"
RAW_DIR.mkdir(parents=True, exist_ok=True)
JSON_DIR.mkdir(parents=True, exist_ok=True)


# ── Constants ────────────────────────────────────────────────────────────────
BOAT_TYPES = ["Center Console", "Bay Boat", "Pontoon", "Bass Boat", "Deck Boat"]
MANUFACTURERS = {
    "Center Console": ["Robalo", "Sea Fox", "Sportsman", "NauticStar"],
    "Bay Boat": ["Shallow Sport", "Shoalwater", "Dargel", "Blue Wave"],
    "Pontoon": ["Bennington", "Sun Tracker", "Crest", "Godfrey"],
    "Bass Boat": ["Tracker", "Nitro", "Skeeter", "Ranger"],
    "Deck Boat": ["Hurricane", "Bayliner", "Tahoe", "Starcraft"],
}
CONDITIONS = ["New", "Used - Excellent", "Used - Good", "Used - Fair"]

# Seasonal multipliers by month (1-indexed); peaks in spring/early summer and Oct
SEASONAL_WEIGHTS = {
    1: 0.6, 2: 0.7, 3: 1.3, 4: 1.5, 5: 1.6, 6: 1.4,
    7: 1.0, 8: 0.8, 9: 0.7, 10: 1.2, 11: 1.1, 12: 0.5,
}

N_SALES = 3000
YEARS = range(2014, 2025)  # 2014-2024 inclusive


# ── Helper: base price ──────────────────────────────────────────────────────
def base_price(boat_type: str, length_ft: float, engine_hp: int, condition: str, model_year: int) -> float:
    """Compute a realistic base asking price."""
    type_mult = {
        "Center Console": 1.3, "Bay Boat": 1.1, "Pontoon": 0.9,
        "Bass Boat": 1.0, "Deck Boat": 0.85,
    }
    cond_mult = {
        "New": 1.0, "Used - Excellent": 0.78,
        "Used - Good": 0.62, "Used - Fair": 0.45,
    }
    age_factor = max(0.4, 1 - 0.04 * (2024 - model_year))
    price = (
        8000
        + length_ft * 600
        + engine_hp * 35
    ) * type_mult[boat_type] * cond_mult[condition] * age_factor
    return round(price + RNG.normal(0, price * 0.05), -2)  # round to nearest 100


# ── Generate transactions ───────────────────────────────────────────────────
def generate_sales() -> pd.DataFrame:
    records = []
    sale_id = 1000

    for _ in range(N_SALES):
        sale_id += 1
        year = RNG.choice(list(YEARS), p=_year_weights())
        month = _pick_month()
        day = RNG.integers(1, 29)  # safe for all months
        sale_date = f"{year}-{month:02d}-{day:02d}"

        boat_type = RNG.choice(BOAT_TYPES, p=[0.28, 0.22, 0.20, 0.18, 0.12])
        manufacturer = RNG.choice(MANUFACTURERS[boat_type])
        condition = RNG.choice(CONDITIONS, p=[0.35, 0.25, 0.25, 0.15])

        model_year = int(year - abs(RNG.normal(2, 3)))
        model_year = max(model_year, year - 15)
        if condition == "New":
            model_year = year

        length_ft = round(_length_for_type(boat_type), 1)
        engine_hp = _engine_for_type(boat_type, length_ft)

        asking = base_price(boat_type, length_ft, engine_hp, condition, model_year)
        asking = max(asking, 5000)

        # Negotiation: 2-12% discount depending on days on lot
        days_on_lot = int(max(3, RNG.exponential(45) + 5))
        days_on_lot = min(days_on_lot, 365)

        discount_pct = 0.02 + 0.10 * (days_on_lot / 365) + RNG.uniform(-0.01, 0.02)
        sale_price = round(asking * (1 - max(0, discount_pct)), -2)

        buyer_zip = RNG.choice(["78550", "78501", "78520", "78539", "78552",
                                "78503", "78537", "78572", "78504", "78516"])
        financing = RNG.choice(["Cash", "Dealer Finance", "Bank/CU"], p=[0.3, 0.35, 0.35])
        trade_in = bool(RNG.choice([True, False], p=[0.25, 0.75]))
        salesperson = f"SP-{RNG.integers(1, 8):03d}"

        records.append({
            "sale_id": sale_id,
            "sale_date": sale_date,
            "boat_type": boat_type,
            "manufacturer": manufacturer,
            "model_year": model_year,
            "length_ft": length_ft,
            "engine_hp": engine_hp,
            "condition": condition,
            "asking_price": asking,
            "sale_price": sale_price,
            "days_on_lot": days_on_lot,
            "buyer_zip": buyer_zip,
            "financing": financing,
            "trade_in": trade_in,
            "salesperson_id": salesperson,
        })

    df = pd.DataFrame(records)
    df["sale_date"] = pd.to_datetime(df["sale_date"])
    return df.sort_values("sale_date").reset_index(drop=True)


def _year_weights():
    """Slight upward trend in sales volume."""
    w = np.array([0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1.0, 0.8, 1.05, 1.1, 1.15])
    return w / w.sum()


def _pick_month() -> int:
    weights = np.array([SEASONAL_WEIGHTS[m] for m in range(1, 13)])
    return int(RNG.choice(range(1, 13), p=weights / weights.sum()))


def _length_for_type(boat_type: str) -> float:
    ranges = {
        "Center Console": (18, 28), "Bay Boat": (18, 24),
        "Pontoon": (20, 26), "Bass Boat": (16, 21), "Deck Boat": (18, 24),
    }
    lo, hi = ranges[boat_type]
    return RNG.uniform(lo, hi)


def _engine_for_type(boat_type: str, length_ft: float) -> int:
    hp_per_ft = {"Center Console": 12, "Bay Boat": 10, "Pontoon": 5,
                 "Bass Boat": 11, "Deck Boat": 8}
    base = hp_per_ft[boat_type] * length_ft
    return int(round(base + RNG.normal(0, base * 0.1), -1))


# ── Chart JSON Generators ───────────────────────────────────────────────────

def make_seasonal_heatmap(df: pd.DataFrame) -> list:
    """Monthly sales volume by boat type → heatmap grid."""
    month_names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                   "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    pivot = df.groupby([df["sale_date"].dt.month, "boat_type"]).size().unstack(fill_value=0)

    rows = []
    for month_num in range(1, 13):
        for bt in BOAT_TYPES:
            count = int(pivot.loc[month_num, bt]) if month_num in pivot.index and bt in pivot.columns else 0
            rows.append({
                "month": month_names[month_num - 1],
                "boatType": bt,
                "sales": count,
            })
    return rows


def make_shap_waterfall(df: pd.DataFrame) -> list:
    """Feature importance contributions from XGBoost pricing model."""
    # Train a quick XGBoost model on sale_price
    from xgboost import XGBRegressor
    import shap

    features = df[["length_ft", "engine_hp", "model_year", "days_on_lot"]].copy()
    features["boat_type_enc"] = df["boat_type"].astype("category").cat.codes
    features["condition_enc"] = df["condition"].astype("category").cat.codes
    features["is_trade_in"] = df["trade_in"].astype(int)

    model = XGBRegressor(n_estimators=100, max_depth=4, learning_rate=0.1, random_state=42)
    model.fit(features, df["sale_price"])

    explainer = shap.TreeExplainer(model)
    shap_values = explainer.shap_values(features)
    mean_abs = np.abs(shap_values).mean(axis=0)

    feature_labels = [
        "Length (ft)", "Engine HP", "Model Year", "Days on Lot",
        "Boat Type", "Condition", "Trade-In",
    ]
    items = sorted(zip(feature_labels, mean_abs.tolist()), key=lambda x: x[1], reverse=True)
    return [{"feature": f, "importance": round(v, 0)} for f, v in items]


def make_survival_curves(df: pd.DataFrame) -> list:
    """Kaplan-Meier days-on-lot curves by boat type."""
    from lifelines import KaplanMeierFitter

    curves = []
    kmf = KaplanMeierFitter()
    for bt in BOAT_TYPES:
        subset = df[df["boat_type"] == bt]
        durations = subset["days_on_lot"].values
        # All observed (sold), so event_observed = 1
        events = np.ones(len(durations))
        kmf.fit(durations, event_observed=events, label=bt)
        timeline = kmf.survival_function_
        for day, row in timeline.iterrows():
            curves.append({
                "day": int(day),
                "boatType": bt,
                "probability": round(float(row.iloc[0]), 3),
            })
    return curves


def make_pricing_features(df: pd.DataFrame) -> dict:
    """Coefficients for interactive pricing calculator."""
    from sklearn.linear_model import LinearRegression

    features = df[["length_ft", "engine_hp", "model_year", "days_on_lot"]].copy()
    features["is_new"] = (df["condition"] == "New").astype(int)

    model = LinearRegression()
    model.fit(features, df["sale_price"])

    coef_names = ["length_ft", "engine_hp", "model_year", "days_on_lot", "is_new"]
    coefficients = {name: round(float(c), 2) for name, c in zip(coef_names, model.coef_)}
    coefficients["intercept"] = round(float(model.intercept_), 2)

    return {
        "coefficients": coefficients,
        "r2": round(float(model.score(features, df["sale_price"])), 3),
        "ranges": {
            "length_ft": {"min": 16, "max": 28, "default": 22},
            "engine_hp": {"min": 75, "max": 400, "default": 200},
            "model_year": {"min": 2010, "max": 2024, "default": 2021},
            "days_on_lot": {"min": 5, "max": 180, "default": 30},
        },
    }


def make_monthly_trend(df: pd.DataFrame) -> list:
    """Monthly sales totals for time series chart."""
    monthly = df.set_index("sale_date").resample("ME").agg(
        sales_count=("sale_id", "count"),
        avg_price=("sale_price", "mean"),
        total_revenue=("sale_price", "sum"),
    ).reset_index()

    return [
        {
            "date": row["sale_date"].strftime("%Y-%m"),
            "salesCount": int(row["sales_count"]),
            "avgPrice": round(float(row["avg_price"]), 0),
            "totalRevenue": round(float(row["total_revenue"]), 0),
        }
        for _, row in monthly.iterrows()
    ]


# ── Main ─────────────────────────────────────────────────────────────────────
def main():
    print("Generating synthetic boat sales data...")
    df = generate_sales()

    # Save raw CSVs
    df.to_csv(RAW_DIR / "boat_sales.csv", index=False)
    print(f"  ✓ {len(df):,} sales → data/raw/boat_sales.csv")

    # Inventory snapshot: unsold boats (sample from recent listings)
    inventory = df.tail(50).copy()
    inventory["status"] = "In Stock"
    inventory.to_csv(RAW_DIR / "inventory_snapshot.csv", index=False)
    print(f"  ✓ {len(inventory)} inventory rows → data/raw/inventory_snapshot.csv")

    # Chart-ready JSON
    print("\nGenerating chart data...")

    heatmap = make_seasonal_heatmap(df)
    _write_json(heatmap, "seasonal-heatmap.json")

    shap_data = make_shap_waterfall(df)
    _write_json(shap_data, "shap-waterfall.json")

    survival = make_survival_curves(df)
    _write_json(survival, "survival-curves.json")

    pricing = make_pricing_features(df)
    _write_json(pricing, "pricing-features.json")

    trend = make_monthly_trend(df)
    _write_json(trend, "monthly-sales-trend.json")

    print("\nDone! All chart data written to data/case-studies/gulf-coast-boat-sales/")


def _write_json(data, filename: str):
    path = JSON_DIR / filename
    with open(path, "w") as f:
        json.dump(data, f, indent=2)
    print(f"  ✓ {filename}")


if __name__ == "__main__":
    main()
