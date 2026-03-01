#!/usr/bin/env python3
"""
Generate synthetic resort data for the SPI Beach Resort Analytics case study.

Produces:
  - data/case-studies/spi-beach-resort/occupancy-heatmap.json
  - data/case-studies/spi-beach-resort/sentiment-trend.json
  - data/case-studies/spi-beach-resort/pricing-simulation.json
  - data/case-studies/spi-beach-resort/revpar-decomposition.json

Usage:
  cd datasalt-ai
  python scripts/generate_resort_data.py
"""

import json
from pathlib import Path

import numpy as np

# ── Reproducibility ──────────────────────────────────────────────────────────
RNG = np.random.default_rng(123)

# ── Paths ────────────────────────────────────────────────────────────────────
ROOT = Path(__file__).resolve().parent.parent
if (ROOT / "datasalt-ai").exists():
    ROOT = ROOT / "datasalt-ai"

JSON_DIR = ROOT / "data" / "case-studies" / "spi-beach-resort"
JSON_DIR.mkdir(parents=True, exist_ok=True)

# ── Constants ────────────────────────────────────────────────────────────────
MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

ROOM_TYPES = ["Standard", "Ocean View", "Suite", "Beachfront"]

# Seasonal occupancy base rates (0-1) — SPI patterns
# Spring Break (Mar) peak, Summer (Jun-Aug), Winter Texan (Oct-Feb)
SEASONAL_OCC = {
    "Jan": 0.62, "Feb": 0.68, "Mar": 0.92, "Apr": 0.78, "May": 0.72, "Jun": 0.88,
    "Jul": 0.91, "Aug": 0.82, "Sep": 0.55, "Oct": 0.65, "Nov": 0.70, "Dec": 0.60,
}

# Room type occupancy multiplier (premium rooms harder to fill)
ROOM_MULT = {"Standard": 1.05, "Ocean View": 1.0, "Suite": 0.85, "Beachfront": 0.92}

# Base ADR by room type
BASE_ADR = {"Standard": 139, "Ocean View": 189, "Suite": 279, "Beachfront": 349}

# Seasonal ADR multiplier
SEASONAL_ADR_MULT = {
    "Jan": 0.85, "Feb": 0.90, "Mar": 1.45, "Apr": 1.10, "May": 1.05, "Jun": 1.30,
    "Jul": 1.35, "Aug": 1.20, "Sep": 0.75, "Oct": 0.88, "Nov": 0.92, "Dec": 0.80,
}


# ── Chart 1: Occupancy Heatmap ───────────────────────────────────────────────
def make_occupancy_heatmap() -> list:
    """Monthly occupancy % by room type → generalized heatmap format."""
    rows = []
    for month in MONTHS:
        for rt in ROOM_TYPES:
            base = SEASONAL_OCC[month] * ROOM_MULT[rt]
            occ = min(0.99, max(0.30, base + RNG.normal(0, 0.03)))
            rows.append({
                "column": month,
                "row": rt,
                "value": round(occ * 100, 1),
            })
    return rows


# ── Chart 2: Sentiment Trend ────────────────────────────────────────────────
def make_sentiment_trend() -> list:
    """Monthly sentiment scores with topic breakdown for TrendWithOverlays."""
    data = []
    base_sentiment = 3.8  # out of 5

    for year in [2022, 2023, 2024]:
        for i, month in enumerate(MONTHS):
            m = i + 1
            # Sentiment dips in peak season (overcrowding) and improves off-season
            seasonal_adj = {3: -0.3, 6: -0.15, 7: -0.2, 8: -0.1, 12: 0.15, 1: 0.2, 2: 0.15}
            adj = seasonal_adj.get(m, 0)
            # Gradual improvement over years (resort responding to feedback)
            year_adj = (year - 2022) * 0.08
            sentiment = base_sentiment + adj + year_adj + RNG.normal(0, 0.1)
            sentiment = round(min(5.0, max(2.5, sentiment)), 2)

            # Topic scores (sub-components)
            cleanliness = round(min(5, sentiment + RNG.normal(0.2, 0.15)), 2)
            service = round(min(5, sentiment + RNG.normal(-0.1, 0.2)), 2)
            amenities = round(min(5, sentiment + RNG.normal(-0.3, 0.15)), 2)

            data.append({
                "date": f"{year}-{m:02d}",
                "sentiment": sentiment,
                "cleanliness": cleanliness,
                "service": service,
                "amenities": amenities,
            })
    return data


# ── Chart 3: Pricing Simulation ──────────────────────────────────────────────
def make_pricing_simulation() -> list:
    """Actual vs optimal pricing over 24 months for DualLineComparison."""
    data = []
    for year in [2023, 2024]:
        for i, month in enumerate(MONTHS):
            m = i + 1
            # Weighted average ADR across room types
            actual_adr = sum(
                BASE_ADR[rt] * SEASONAL_ADR_MULT[month] * (1 + RNG.normal(0, 0.03))
                for rt in ROOM_TYPES
            ) / len(ROOM_TYPES)

            # Optimal is higher in peak, lower in trough (more aggressive dynamic pricing)
            peak_factor = SEASONAL_ADR_MULT[month]
            if peak_factor > 1.2:
                optimal_adr = actual_adr * (1 + RNG.uniform(0.08, 0.18))
            elif peak_factor < 0.85:
                optimal_adr = actual_adr * (1 - RNG.uniform(0.03, 0.08))
            else:
                optimal_adr = actual_adr * (1 + RNG.uniform(0.02, 0.07))

            data.append({
                "label": f"{month} {year}",
                "actual": round(actual_adr, 0),
                "recommended": round(optimal_adr, 0),
            })
    return data


# ── Chart 4: RevPAR Decomposition ───────────────────────────────────────────
def make_revpar_decomposition() -> list:
    """Monthly RevPAR broken into ADR and occupancy contributions for DecompositionBar."""
    data = []
    for month in MONTHS:
        # Average across room types
        avg_adr = sum(
            BASE_ADR[rt] * SEASONAL_ADR_MULT[month]
            for rt in ROOM_TYPES
        ) / len(ROOM_TYPES)

        avg_occ = sum(
            SEASONAL_OCC[month] * ROOM_MULT[rt]
            for rt in ROOM_TYPES
        ) / len(ROOM_TYPES)
        avg_occ = min(0.99, avg_occ)

        revpar = avg_adr * avg_occ
        # Decompose: how much RevPAR comes from rate vs occupancy
        # ADR contribution = (ADR - baseline) * occupancy
        # Occupancy contribution = baseline * (occupancy - baseline_occ)
        baseline_adr = 200  # annual average
        baseline_occ = 0.75  # annual average

        adr_contribution = round((avg_adr - baseline_adr) * avg_occ, 0)
        occ_contribution = round(baseline_adr * (avg_occ - baseline_occ), 0)
        base_revpar = round(baseline_adr * baseline_occ, 0)

        data.append({
            "label": month,
            "Base RevPAR": base_revpar,
            "Rate Effect": adr_contribution,
            "Occupancy Effect": occ_contribution,
        })
    return data


# ── Main ─────────────────────────────────────────────────────────────────────
def main():
    print("Generating SPI Beach Resort data...")

    heatmap = make_occupancy_heatmap()
    _write_json(heatmap, "occupancy-heatmap.json")

    sentiment = make_sentiment_trend()
    _write_json(sentiment, "sentiment-trend.json")

    pricing = make_pricing_simulation()
    _write_json(pricing, "pricing-simulation.json")

    revpar = make_revpar_decomposition()
    _write_json(revpar, "revpar-decomposition.json")

    print("\nDone! All chart data written to data/case-studies/spi-beach-resort/")


def _write_json(data, filename: str):
    path = JSON_DIR / filename
    with open(path, "w") as f:
        json.dump(data, f, indent=2)
    print(f"  ✓ {filename}")


if __name__ == "__main__":
    main()
