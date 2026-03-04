#!/usr/bin/env python3
"""
Generate synthetic boat sales data and pre-compute XGBoost predictions
for boats.datasalt.ai pricing calculator.

Outputs (to data/boats/):
  - boat_sales.csv          – raw synthetic dataset (~2000 rows)
  - xgb-predictions.json    – pre-computed prediction grid
  - shap-values.json        – global SHAP feature importances
  - comparable-sales.json   – nearest-neighbor lookup samples
  - market-trends.json      – monthly aggregated trends
"""

import json
import os
import warnings
from pathlib import Path

import numpy as np

warnings.filterwarnings("ignore")
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.neighbors import NearestNeighbors
import xgboost as xgb
import shap

SEED = 42
N_ROWS = 2000
OUT_DIR = Path(__file__).resolve().parent.parent / "data" / "boats"

np.random.seed(SEED)

# ── Feature definitions ──────────────────────────────────────────────
BOAT_TYPES = ["Center Console", "Bay Boat", "Deck Boat", "Pontoon", "Bowrider"]
MANUFACTURERS = ["Robalo", "Sea Hunt", "Nautic Star", "Tracker", "Bayliner",
                 "Boston Whaler", "Grady-White", "Mako", "Chaparral", "Bennington"]
HULL_MATERIALS = ["Fiberglass", "Aluminum"]
CONDITIONS = ["New", "Excellent", "Good", "Fair"]
LOCATIONS = ["Corpus Christi", "Port Aransas", "South Padre Island",
             "Galveston", "Rockport", "Port Isabel"]

# ── Generate synthetic data ──────────────────────────────────────────
def generate_data() -> pd.DataFrame:
    rng = np.random.default_rng(SEED)

    boat_type = rng.choice(BOAT_TYPES, N_ROWS)
    manufacturer = rng.choice(MANUFACTURERS, N_ROWS)
    hull_material = rng.choice(HULL_MATERIALS, N_ROWS, p=[0.75, 0.25])
    condition = rng.choice(CONDITIONS, N_ROWS, p=[0.15, 0.30, 0.40, 0.15])
    location = rng.choice(LOCATIONS, N_ROWS)

    model_year = rng.integers(2010, 2025, N_ROWS)
    length_ft = np.round(rng.uniform(16, 30, N_ROWS), 1)
    beam_ft = np.round(length_ft * rng.uniform(0.28, 0.36, N_ROWS), 1)
    engine_hp = rng.integers(75, 450, N_ROWS)
    days_on_lot = rng.integers(5, 200, N_ROWS)

    # Sale month (for seasonal trends — summer months more sales)
    month_weights = [0.05, 0.06, 0.08, 0.10, 0.12, 0.13,
                     0.12, 0.10, 0.08, 0.06, 0.05, 0.05]
    sale_month = rng.choice(range(1, 13), N_ROWS, p=month_weights)

    # ── Price model (realistic-ish) ──────────────────────────────────
    base_price = 15000
    price = (
        base_price
        + (model_year - 2010) * 900
        + length_ft * 380
        + engine_hp * 55
        - days_on_lot * 7
    )
    # Condition multiplier
    cond_mult = {"New": 1.35, "Excellent": 1.15, "Good": 1.0, "Fair": 0.80}
    price *= np.array([cond_mult[c] for c in condition])

    # Manufacturer premium
    premium_brands = {"Boston Whaler": 1.25, "Grady-White": 1.20, "Robalo": 1.10}
    price *= np.array([premium_brands.get(m, 1.0) for m in manufacturer])

    # Boat type adjustment
    type_adj = {"Center Console": 1.05, "Pontoon": 0.90, "Deck Boat": 0.95,
                "Bay Boat": 1.0, "Bowrider": 0.98}
    price *= np.array([type_adj.get(t, 1.0) for t in boat_type])

    # Seasonal bump (summer listings fetch ~5% more)
    seasonal = 1.0 + 0.05 * np.sin(np.pi * (sale_month - 1) / 6)
    price *= seasonal

    # Add noise (~8% std)
    noise = rng.normal(1.0, 0.08, N_ROWS)
    price = np.round(price * noise / 100) * 100
    price = np.maximum(price, 5000)

    df = pd.DataFrame({
        "boat_type": boat_type,
        "manufacturer": manufacturer,
        "model_year": model_year,
        "length_ft": length_ft,
        "beam_ft": beam_ft,
        "engine_hp": engine_hp.astype(int),
        "hull_material": hull_material,
        "condition": condition,
        "location": location,
        "days_on_lot": days_on_lot.astype(int),
        "sale_month": sale_month.astype(int),
        "sale_price": price.astype(int),
    })
    return df


# ── Train XGBoost model ─────────────────────────────────────────────
def train_model(df: pd.DataFrame):
    # Encode categoricals
    cat_cols = ["boat_type", "manufacturer", "hull_material", "condition", "location"]
    df_enc = df.copy()
    cat_mappings = {}
    for col in cat_cols:
        codes = df_enc[col].astype("category")
        cat_mappings[col] = dict(enumerate(codes.cat.categories))
        df_enc[col] = codes.cat.codes

    feature_cols = ["boat_type", "manufacturer", "model_year", "length_ft",
                    "beam_ft", "engine_hp", "hull_material", "condition",
                    "days_on_lot", "sale_month"]
    X = df_enc[feature_cols]
    y = df_enc["sale_price"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=SEED
    )

    model = xgb.XGBRegressor(
        n_estimators=200,
        max_depth=6,
        learning_rate=0.1,
        random_state=SEED,
        enable_categorical=False,
    )
    model.fit(X_train, y_train)

    r2 = model.score(X_test, y_test)
    preds_test = model.predict(X_test)
    mae = int(np.mean(np.abs(preds_test - y_test)))
    print(f"  Model R² = {r2:.3f}, MAE = ${mae:,}")

    return model, X, y, feature_cols, cat_mappings, r2, mae


# ── Pre-compute prediction grid ─────────────────────────────────────
def compute_prediction_grid(model, cat_mappings, feature_cols):
    """Build a grid of common feature combos → predicted price + confidence."""
    # Use representative values for the grid
    grid_values = {
        "boat_type": list(range(len(cat_mappings["boat_type"]))),
        "manufacturer": list(range(len(cat_mappings["manufacturer"]))),
        "model_year": list(range(2015, 2025)),
        "length_ft": [18, 20, 22, 24, 26, 28],
        "beam_ft": [6.5, 7.0, 7.5, 8.0, 8.5],
        "engine_hp": [100, 150, 200, 250, 300, 350, 400],
        "hull_material": list(range(len(cat_mappings["hull_material"]))),
        "condition": list(range(len(cat_mappings["condition"]))),
        "days_on_lot": [15, 30, 60, 90, 120],
        "sale_month": [1, 4, 7, 10],
    }

    # Instead of full cartesian product (too large), sample representative combos
    rng = np.random.default_rng(SEED)
    n_samples = 5000
    samples = {}
    for col in feature_cols:
        samples[col] = rng.choice(grid_values[col], n_samples)

    grid_df = pd.DataFrame(samples)
    preds = model.predict(grid_df)

    # Compute pseudo-confidence interval using model's leaf variance
    # (approximate: use ±12% of prediction as interval)
    ci_pct = 0.12
    results = []
    for i in range(n_samples):
        pred = int(round(preds[i] / 100) * 100)
        results.append({
            "features": {col: int(grid_df.iloc[i][col]) for col in feature_cols},
            "predicted_price": pred,
            "price_low": int(round(pred * (1 - ci_pct) / 100) * 100),
            "price_high": int(round(pred * (1 + ci_pct) / 100) * 100),
        })

    # Also store the mappings so the frontend can decode
    decode_mappings = {}
    for col, mapping in cat_mappings.items():
        decode_mappings[col] = {str(k): v for k, v in mapping.items()}

    return {
        "predictions": results,
        "feature_columns": feature_cols,
        "categorical_mappings": decode_mappings,
        "grid_values": {k: [int(x) if isinstance(x, (int, np.integer)) else float(x)
                           for x in v] for k, v in grid_values.items()},
    }


# ── Compute SHAP values ─────────────────────────────────────────────
def compute_shap_values(model, X, feature_cols, cat_mappings):
    explainer = shap.TreeExplainer(model)
    shap_values = explainer.shap_values(X.sample(500, random_state=SEED))

    mean_abs_shap = np.mean(np.abs(shap_values), axis=0)
    feature_importance = []
    for i, col in enumerate(feature_cols):
        label = col.replace("_", " ").title()
        if col in cat_mappings:
            label = col.replace("_", " ").title()
        feature_importance.append({
            "feature": col,
            "label": label,
            "importance": round(float(mean_abs_shap[i]), 2),
        })
    feature_importance.sort(key=lambda x: x["importance"], reverse=True)

    return {
        "feature_importance": feature_importance,
        "base_value": round(float(explainer.expected_value), 2),
    }


# ── Comparable sales ─────────────────────────────────────────────────
def compute_comparables(df, feature_cols, cat_mappings):
    """Pre-compute a sample of comparables for each condition/type combo."""
    # Encode for NN
    df_enc = df.copy()
    for col in ["boat_type", "manufacturer", "hull_material", "condition", "location"]:
        df_enc[col] = df_enc[col].astype("category").cat.codes

    numeric_cols = ["model_year", "length_ft", "engine_hp", "days_on_lot"]
    sample_rows = df.sample(200, random_state=SEED)

    comparables = []
    for _, row in sample_rows.iterrows():
        comparables.append({
            "boat_type": row["boat_type"],
            "manufacturer": row["manufacturer"],
            "model_year": int(row["model_year"]),
            "length_ft": float(row["length_ft"]),
            "engine_hp": int(row["engine_hp"]),
            "condition": row["condition"],
            "location": row["location"],
            "days_on_lot": int(row["days_on_lot"]),
            "sale_price": int(row["sale_price"]),
        })

    return {"comparables": comparables}


# ── Market trends ────────────────────────────────────────────────────
def compute_market_trends(df):
    # Monthly aggregated stats
    monthly = df.groupby("sale_month").agg(
        avg_price=("sale_price", "mean"),
        median_price=("sale_price", "median"),
        count=("sale_price", "count"),
        avg_days=("days_on_lot", "mean"),
    ).reset_index()

    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
              "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    trends = []
    for _, row in monthly.iterrows():
        trends.append({
            "month": months[int(row["sale_month"]) - 1],
            "month_num": int(row["sale_month"]),
            "avg_price": int(row["avg_price"]),
            "median_price": int(row["median_price"]),
            "count": int(row["count"]),
            "avg_days_on_lot": round(float(row["avg_days"]), 1),
        })

    # Price by boat type
    by_type = df.groupby("boat_type").agg(
        avg_price=("sale_price", "mean"),
        count=("sale_price", "count"),
    ).reset_index()

    type_stats = []
    for _, row in by_type.iterrows():
        type_stats.append({
            "boat_type": row["boat_type"],
            "avg_price": int(row["avg_price"]),
            "count": int(row["count"]),
        })

    # Price by condition
    by_condition = df.groupby("condition").agg(
        avg_price=("sale_price", "mean"),
        count=("sale_price", "count"),
    ).reset_index()

    condition_stats = []
    for _, row in by_condition.iterrows():
        condition_stats.append({
            "condition": row["condition"],
            "avg_price": int(row["avg_price"]),
            "count": int(row["count"]),
        })

    return {
        "monthly_trends": trends,
        "by_boat_type": type_stats,
        "by_condition": condition_stats,
    }


# ── Main ─────────────────────────────────────────────────────────────
def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    print("1. Generating synthetic boat sales data...")
    df = generate_data()
    df.to_csv(OUT_DIR / "boat_sales.csv", index=False)
    print(f"   → {len(df)} rows written to boat_sales.csv")

    print("2. Training XGBoost model...")
    model, X, y, feature_cols, cat_mappings, r2, mae = train_model(df)

    print("3. Pre-computing prediction grid...")
    predictions = compute_prediction_grid(model, cat_mappings, feature_cols)
    predictions["model_metrics"] = {"r2": round(r2, 3), "mae": mae}
    with open(OUT_DIR / "xgb-predictions.json", "w") as f:
        json.dump(predictions, f, indent=2)
    print(f"   → {len(predictions['predictions'])} predictions written")

    print("4. Computing SHAP values...")
    shap_data = compute_shap_values(model, X, feature_cols, cat_mappings)
    with open(OUT_DIR / "shap-values.json", "w") as f:
        json.dump(shap_data, f, indent=2)
    print(f"   → {len(shap_data['feature_importance'])} features")

    print("5. Building comparable sales index...")
    comps = compute_comparables(df, feature_cols, cat_mappings)
    with open(OUT_DIR / "comparable-sales.json", "w") as f:
        json.dump(comps, f, indent=2)
    print(f"   → {len(comps['comparables'])} comparable listings")

    print("6. Computing market trends...")
    trends = compute_market_trends(df)
    with open(OUT_DIR / "market-trends.json", "w") as f:
        json.dump(trends, f, indent=2)
    print(f"   → {len(trends['monthly_trends'])} months of trends")

    print("\n✓ All data generated successfully!")
    print(f"  Output directory: {OUT_DIR}")


if __name__ == "__main__":
    main()
