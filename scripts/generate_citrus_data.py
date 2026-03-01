#!/usr/bin/env python3
"""
Generate synthetic data for the Valley Citrus & Agriculture case study.

Produces:
  - data/case-studies/valley-citrus-agriculture/yield-weather.json
  - data/case-studies/valley-citrus-agriculture/irrigation-frontier.json
  - data/case-studies/valley-citrus-agriculture/freeze-risk.json
  - data/case-studies/valley-citrus-agriculture/grower-radar.json

Usage:
  cd datasalt-ai
  python scripts/generate_citrus_data.py
"""

import json
from pathlib import Path

import numpy as np

# ── Reproducibility ──────────────────────────────────────────────────────────
RNG = np.random.default_rng(789)

# ── Paths ────────────────────────────────────────────────────────────────────
ROOT = Path(__file__).resolve().parent.parent
if (ROOT / "datasalt-ai").exists():
    ROOT = ROOT / "datasalt-ai"

JSON_DIR = ROOT / "data" / "case-studies" / "valley-citrus-agriculture"
JSON_DIR.mkdir(parents=True, exist_ok=True)

# ── Constants ────────────────────────────────────────────────────────────────
CROPS = ["Grapefruit", "Oranges", "Lemons"]
GROWERS = ["Ramirez Family", "Delta Groves", "Rio Citrus Co-op", "Mission Ag", "Valley Fresh"]

# Yield per acre by crop (boxes/acre baseline)
BASE_YIELD = {"Grapefruit": 420, "Oranges": 380, "Lemons": 350}

# Temperature ranges by month (Rio Grande Valley)
MONTHLY_TEMPS = {
    1: (6, 20), 2: (8, 22), 3: (12, 26), 4: (16, 30), 5: (20, 33),
    6: (23, 36), 7: (24, 37), 8: (24, 37), 9: (22, 34), 10: (16, 30),
    11: (10, 25), 12: (7, 21),
}

# Grower efficiency multiplier
GROWER_EFF = {
    "Ramirez Family": 1.15, "Delta Groves": 1.05, "Rio Citrus Co-op": 0.90,
    "Mission Ag": 1.00, "Valley Fresh": 0.95,
}


# ── Chart 1: Yield vs Low Temp (ColoredScatter) ─────────────────────────────
def make_yield_weather() -> list:
    """Scatter: minimum temp vs yield, colored by crop, with freeze events."""
    points = []
    for year in [2020, 2021, 2022, 2023, 2024]:
        for month in [11, 12, 1, 2, 3]:  # Harvest/freeze season
            for crop in CROPS:
                temp_range = MONTHLY_TEMPS[month]
                temp_low = RNG.uniform(temp_range[0] - 5, temp_range[0] + 8)

                # Freeze damage: below 0°C causes significant yield loss
                base = BASE_YIELD[crop]
                if temp_low < -2:
                    yld = base * RNG.uniform(0.15, 0.40)  # Heavy freeze
                elif temp_low < 0:
                    yld = base * RNG.uniform(0.40, 0.65)  # Light freeze
                elif temp_low < 3:
                    yld = base * RNG.uniform(0.65, 0.85)  # Cold stress
                else:
                    yld = base * RNG.uniform(0.80, 1.10)  # Normal

                points.append({
                    "x": round(temp_low, 1),
                    "y": round(yld, 0),
                    "category": crop,
                })

    return points


# ── Chart 2: Irrigation Frontier (ColoredScatter) ───────────────────────────
def make_irrigation_frontier() -> list:
    """Scatter: water usage vs yield by grower, for efficiency frontier."""
    points = []
    for _ in range(120):
        grower = RNG.choice(GROWERS)
        crop = RNG.choice(CROPS)
        eff = GROWER_EFF[grower]

        # Water usage (acre-inches per season)
        base_water = 36  # baseline
        water = base_water * (1 / eff) * (1 + RNG.normal(0, 0.12))
        water = max(20, min(55, water))

        # Yield depends on water + efficiency
        optimal_water = 34
        water_factor = 1 - 0.3 * ((water - optimal_water) / optimal_water) ** 2
        yld = BASE_YIELD[crop] * eff * water_factor * (1 + RNG.normal(0, 0.08))
        yld = max(100, yld)

        points.append({
            "x": round(water, 1),
            "y": round(yld, 0),
            "category": grower,
        })
    return points


# ── Chart 3: Freeze Risk Curves (SurvivalCurves) ────────────────────────────
def make_freeze_risk() -> list:
    """Probability curves: P(freeze) by date for different severity levels."""
    data = []
    severity_levels = ["Light Freeze (<0°C)", "Hard Freeze (<-3°C)", "Severe Freeze (<-6°C)"]
    # Base probabilities by month (RGV historical patterns)
    base_probs = {
        "Light Freeze (<0°C)": {11: 0.15, 12: 0.45, 1: 0.55, 2: 0.40, 3: 0.10},
        "Hard Freeze (<-3°C)": {11: 0.03, 12: 0.15, 1: 0.22, 2: 0.12, 3: 0.02},
        "Severe Freeze (<-6°C)": {11: 0.00, 12: 0.04, 1: 0.08, 2: 0.03, 3: 0.00},
    }

    for severity in severity_levels:
        probs = base_probs[severity]
        # Generate daily-ish points across Nov-Mar (day 1 = Nov 1)
        for day in range(1, 152, 3):  # ~every 3 days, Nov 1 to Mar 31
            if day <= 30:
                month = 11
                frac = day / 30
            elif day <= 61:
                month = 12
                frac = (day - 30) / 31
            elif day <= 92:
                month = 1
                frac = (day - 61) / 31
            elif day <= 120:
                month = 2
                frac = (day - 92) / 28
            else:
                month = 3
                frac = (day - 120) / 31

            # Interpolate between months
            next_month = month + 1 if month < 3 else 3
            if next_month == 13:
                next_month = 1
            p1 = probs.get(month, 0)
            p2 = probs.get(next_month, 0)
            prob = p1 + (p2 - p1) * frac + RNG.normal(0, 0.02)
            prob = max(0, min(1, prob))

            data.append({
                "x": day,
                "series": severity,
                "y": round(prob, 3),
            })
    return data


# ── Chart 4: Grower Radar ───────────────────────────────────────────────────
def make_grower_radar() -> list:
    """Grower benchmarking for RadarComparison."""
    metrics = ["Yield/Acre", "Water Efficiency", "Grade A %", "Cost/Ton", "Harvest Timing"]
    data = []
    for metric in metrics:
        row = {"axis": metric}
        for grower in GROWERS:
            eff = GROWER_EFF[grower]
            if metric == "Yield/Acre":
                val = 35 + eff * 50 + RNG.normal(0, 5)
            elif metric == "Water Efficiency":
                val = 30 + eff * 45 + RNG.normal(0, 6)
            elif metric == "Grade A %":
                val = 40 + eff * 40 + RNG.normal(0, 4)
            elif metric == "Cost/Ton":
                # Inverse: lower cost = higher score
                val = 30 + (2.2 - eff) * 50 + RNG.normal(0, 5)
            else:  # Harvest Timing
                val = 50 + eff * 30 + RNG.normal(0, 6)
            row[grower] = round(min(100, max(10, val)), 0)
        data.append(row)
    return data


# ── Main ─────────────────────────────────────────────────────────────────────
def main():
    print("Generating Valley Citrus & Agriculture data...")

    yield_weather = make_yield_weather()
    _write_json(yield_weather, "yield-weather.json")

    irrigation = make_irrigation_frontier()
    _write_json(irrigation, "irrigation-frontier.json")

    freeze_risk = make_freeze_risk()
    _write_json(freeze_risk, "freeze-risk.json")

    grower_radar = make_grower_radar()
    _write_json(grower_radar, "grower-radar.json")

    print("\nDone! All chart data written to data/case-studies/valley-citrus-agriculture/")


def _write_json(data, filename: str):
    path = JSON_DIR / filename
    with open(path, "w") as f:
        json.dump(data, f, indent=2)
    print(f"  > {filename}")


if __name__ == "__main__":
    main()
