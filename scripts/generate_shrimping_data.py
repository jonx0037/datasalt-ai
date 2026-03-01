#!/usr/bin/env python3
"""
Generate synthetic data for the Gulf Shrimping Operations case study.

Produces:
  - data/case-studies/gulf-shrimping-operations/trip-profitability.json
  - data/case-studies/gulf-shrimping-operations/seasonal-catch.json
  - data/case-studies/gulf-shrimping-operations/captain-radar.json
  - data/case-studies/gulf-shrimping-operations/price-forecast.json

Usage:
  cd datasalt-ai
  python scripts/generate_shrimping_data.py
"""

import json
from pathlib import Path

import numpy as np

# ── Reproducibility ──────────────────────────────────────────────────────────
RNG = np.random.default_rng(456)

# ── Paths ────────────────────────────────────────────────────────────────────
ROOT = Path(__file__).resolve().parent.parent
if (ROOT / "datasalt-ai").exists():
    ROOT = ROOT / "datasalt-ai"

JSON_DIR = ROOT / "data" / "case-studies" / "gulf-shrimping-operations"
JSON_DIR.mkdir(parents=True, exist_ok=True)

# ── Constants ────────────────────────────────────────────────────────────────
MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

AREAS = ["Laguna Madre", "Port Isabel", "Brownsville Ship Channel",
         "Baffin Bay", "Aransas Pass"]

CAPTAINS = ["Capt. Martinez", "Capt. Nguyen", "Capt. Williams",
            "Capt. Garcia", "Capt. Johnson"]

SHRIMP_TYPES = ["Brown", "White", "Pink"]

# Seasonal catch multiplier by month (Gulf TX patterns)
# Peak: May-Jul (brown), Aug-Nov (white), year-round (pink, lower volume)
SEASONAL_CATCH = {
    "Jan": 0.35, "Feb": 0.40, "Mar": 0.55, "Apr": 0.70, "May": 0.95,
    "Jun": 1.00, "Jul": 0.92, "Aug": 0.88, "Sep": 0.80, "Oct": 0.72,
    "Nov": 0.55, "Dec": 0.38,
}

# Area productivity multiplier
AREA_MULT = {
    "Laguna Madre": 1.15, "Port Isabel": 1.0, "Brownsville Ship Channel": 0.80,
    "Baffin Bay": 1.10, "Aransas Pass": 0.95,
}

# Captain skill multiplier (CPUE efficiency)
CAPTAIN_SKILL = {
    "Capt. Martinez": 1.20, "Capt. Nguyen": 1.05, "Capt. Williams": 0.85,
    "Capt. Garcia": 1.12, "Capt. Johnson": 0.92,
}


# ── Chart 1: Trip Profitability Scatter ──────────────────────────────────────
def make_trip_profitability() -> list:
    """Scatter: revenue vs fuel cost, colored by area, for ColoredScatter."""
    points = []
    for _ in range(180):
        area = RNG.choice(AREAS)
        month_idx = RNG.integers(0, 12)
        month = MONTHS[month_idx]
        captain = RNG.choice(CAPTAINS)

        base_catch = 450  # lbs per trip baseline
        catch = base_catch * SEASONAL_CATCH[month] * AREA_MULT[area] * CAPTAIN_SKILL[captain]
        catch *= (1 + RNG.normal(0, 0.15))
        catch = max(50, catch)

        price_per_lb = RNG.uniform(3.5, 6.5)
        revenue = catch * price_per_lb

        # Fuel cost depends on area distance
        base_fuel = {"Laguna Madre": 180, "Port Isabel": 150, "Brownsville Ship Channel": 120,
                     "Baffin Bay": 220, "Aransas Pass": 280}
        fuel = base_fuel[area] * (1 + RNG.normal(0, 0.1))
        fuel = max(60, fuel)

        points.append({
            "x": round(fuel, 0),
            "y": round(revenue, 0),
            "category": area,
        })
    return points


# ── Chart 2: Seasonal Catch Heatmap ──────────────────────────────────────────
def make_seasonal_catch() -> list:
    """Area x Month catch volumes for SeasonalHeatmap (generalized format)."""
    rows = []
    for month in MONTHS:
        for area in AREAS:
            base = 12000 * SEASONAL_CATCH[month] * AREA_MULT[area]
            catch = base * (1 + RNG.normal(0, 0.08))
            catch = max(500, catch)
            rows.append({
                "column": month,
                "row": area,
                "value": round(catch / 1000, 1),  # thousands of lbs
            })
    return rows


# ── Chart 3: Captain Radar ───────────────────────────────────────────────────
def make_captain_radar() -> list:
    """Captain performance metrics for RadarComparison."""
    metrics = ["CPUE", "Fuel Efficiency", "Trip ROI", "Consistency", "Season Coverage"]
    data = []
    for metric in metrics:
        row = {"axis": metric}
        for captain in CAPTAINS:
            skill = CAPTAIN_SKILL[captain]
            if metric == "CPUE":
                val = 40 + skill * 45 + RNG.normal(0, 5)
            elif metric == "Fuel Efficiency":
                val = 35 + skill * 40 + RNG.normal(0, 6)
            elif metric == "Trip ROI":
                val = 30 + skill * 50 + RNG.normal(0, 7)
            elif metric == "Consistency":
                # Inverse relationship with skill variance
                val = 50 + (1.1 - abs(skill - 1.0)) * 40 + RNG.normal(0, 4)
            else:  # Season Coverage
                val = 55 + skill * 30 + RNG.normal(0, 5)
            row[captain] = round(min(100, max(10, val)), 0)
        data.append(row)
    return data


# ── Chart 4: Price Forecast Trend ────────────────────────────────────────────
def make_price_forecast() -> list:
    """Monthly shrimp price with hold/sell zone annotations for TrendWithOverlays."""
    data = []
    base_price = 4.80

    for year in [2022, 2023, 2024]:
        for i, month in enumerate(MONTHS):
            m = i + 1
            # Seasonal price pattern: higher in winter (lower supply), lower in summer (peak catch)
            seasonal = {1: 0.3, 2: 0.25, 3: 0.1, 4: -0.05, 5: -0.2, 6: -0.35,
                        7: -0.30, 8: -0.15, 9: 0.05, 10: 0.15, 11: 0.25, 12: 0.35}
            # Gradual price trend up over years
            year_adj = (year - 2022) * 0.15
            noise = RNG.normal(0, 0.15)
            price = base_price + seasonal[m] + year_adj + noise
            price = round(max(3.0, min(7.0, price)), 2)

            # Forecast (slightly smoothed version + forward bias)
            forecast = base_price + seasonal[m] * 0.85 + year_adj + 0.05
            forecast = round(max(3.0, min(7.0, forecast + RNG.normal(0, 0.08))), 2)

            data.append({
                "date": f"{year}-{m:02d}",
                "price": price,
                "forecast": forecast,
            })
    return data


# ── Main ─────────────────────────────────────────────────────────────────────
def main():
    print("Generating Gulf Shrimping Operations data...")

    profitability = make_trip_profitability()
    _write_json(profitability, "trip-profitability.json")

    catch = make_seasonal_catch()
    _write_json(catch, "seasonal-catch.json")

    radar = make_captain_radar()
    _write_json(radar, "captain-radar.json")

    price = make_price_forecast()
    _write_json(price, "price-forecast.json")

    print("\nDone! All chart data written to data/case-studies/gulf-shrimping-operations/")


def _write_json(data, filename: str):
    path = JSON_DIR / filename
    with open(path, "w") as f:
        json.dump(data, f, indent=2)
    print(f"  > {filename}")


if __name__ == "__main__":
    main()
