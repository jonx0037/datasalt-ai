#!/usr/bin/env python3
"""
Generate synthetic resort data for the SPI Beach Resort Analytics case study.

Produces:
  Case-study charts (data/case-studies/spi-beach-resort/):
    - occupancy-heatmap.json
    - sentiment-trend.json
    - pricing-simulation.json
    - revpar-decomposition.json

  Dashboard app (data/resort/):
    - forecast-grid.json          — prediction grid (month × room × events)
    - occupancy-forecast-timeseries.json — 36-month time-series for ForecastLine
    - review-explorer.json        — 200 synthetic reviews with sentiment + topics
    - staffing-levels.json        — monthly FTE by department
    - room-comparison.json        — radar chart (5 dims × 4 room types)
    - checkin-patterns.json       — day × hour heatmap

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

RESORT_DIR = ROOT / "data" / "resort"
RESORT_DIR.mkdir(parents=True, exist_ok=True)

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


# ═══════════════════════════════════════════════════════════════════════════
# Dashboard data generators  (data/resort/)
# ═══════════════════════════════════════════════════════════════════════════

EVENT_SCENARIOS = [
    "none",
    "spring_break",
    "summer_peak",
    "holiday",
    "fishing_tournament",
    "music_festival",
]

# Event → month affinity and occupancy boost
EVENT_BOOST = {
    "none": {},
    "spring_break":       {3: 0.12, 4: 0.05},
    "summer_peak":        {6: 0.08, 7: 0.10, 8: 0.06},
    "holiday":            {11: 0.07, 12: 0.10, 1: 0.05},
    "fishing_tournament": {5: 0.09, 6: 0.06, 10: 0.08},
    "music_festival":     {3: 0.06, 4: 0.04, 10: 0.05},
}

DEPARTMENTS = ["Front Desk", "Housekeeping", "F&B", "Maintenance", "Activities"]


# ── Dashboard 1: Forecast Grid ────────────────────────────────────────────
def make_forecast_grid() -> dict:
    """Pre-computed occupancy predictions: month × room_type × event scenario.

    Also includes model-level metrics.  Shape matches the API contract.
    """
    grid = []
    for m_idx, month in enumerate(MONTHS):
        month_num = m_idx + 1
        for rt in ROOM_TYPES:
            for event in EVENT_SCENARIOS:
                base_occ = SEASONAL_OCC[month] * ROOM_MULT[rt]
                boost = EVENT_BOOST.get(event, {}).get(month_num, 0)
                occ = min(0.99, max(0.30, base_occ + boost + RNG.normal(0, 0.02)))

                # Rate recommendation: higher occ → higher rate multiplier
                base_rate = BASE_ADR[rt] * SEASONAL_ADR_MULT[month]
                rate_mult = 1.0 + max(0, (occ - 0.70)) * 0.6  # aggressive above 70%
                recommended_rate = round(base_rate * rate_mult, 0)
                actual_rate = round(base_rate * (1 + RNG.normal(0, 0.03)), 0)

                # Revenue opportunity = (recommended - actual) × rooms × occ × 30 days
                rooms_for_type = {"Standard": 40, "Ocean View": 30, "Suite": 15, "Beachfront": 10}
                rev_opp = round(
                    max(0, (recommended_rate - actual_rate))
                    * rooms_for_type[rt] * occ * 30,
                    0,
                )

                # Confidence band
                noise = RNG.uniform(0.03, 0.06)
                grid.append({
                    "month": month_num,
                    "month_label": month,
                    "room_type": rt,
                    "event": event,
                    "predicted_occupancy": round(occ * 100, 1),
                    "occupancy_low": round(max(0, (occ - noise)) * 100, 1),
                    "occupancy_high": round(min(1, (occ + noise)) * 100, 1),
                    "recommended_rate": recommended_rate,
                    "actual_rate": actual_rate,
                    "revenue_opportunity": rev_opp,
                })

    return {
        "grid": grid,
        "model_metrics": {
            "mape": 11,
            "accuracy_14d": 89,
            "revenue_uplift": 340000,
        },
    }


# ── Dashboard 2: Occupancy Forecast Time-Series ──────────────────────────
def make_occupancy_forecast_timeseries() -> list:
    """36-month occupancy time-series for ForecastLine chart.

    Shaped: {label, actual, forecast, upper, lower}.
    First 24 months have actual; last 12 are forecast-only.
    """
    data = []
    for y_offset, year in enumerate([2023, 2024, 2025]):
        for m_idx, month in enumerate(MONTHS):
            label = f"{month} {year}"
            base = SEASONAL_OCC[month]
            # Slight year-over-year improvement
            base += y_offset * 0.02

            actual_val = round(min(99, max(30, (base + RNG.normal(0, 0.04)) * 100)), 1)
            forecast_val = round(min(99, max(30, (base + RNG.normal(0, 0.02)) * 100)), 1)
            noise = RNG.uniform(3, 7)

            row = {
                "label": label,
                "forecast": forecast_val,
                "upper": round(min(99, forecast_val + noise), 1),
                "lower": round(max(20, forecast_val - noise), 1),
            }
            # Only first 24 months get actual values
            if y_offset < 2:
                row["actual"] = actual_val
            else:
                row["actual"] = None

            data.append(row)
    return data


# ── Dashboard 3: Review Explorer ─────────────────────────────────────────
REVIEW_TOPICS = ["Cleanliness", "Service", "Amenities", "Location", "Value", "Food"]
REVIEW_SNIPPETS = {
    "Cleanliness": [
        "Room was spotless when we arrived.",
        "Bathroom could have been cleaner.",
        "Housekeeping did an excellent job daily.",
        "Found sand everywhere — expected at a beach resort but still.",
        "Pristine pool area, well-maintained.",
    ],
    "Service": [
        "Front desk staff were incredibly welcoming.",
        "Had to wait 20 minutes for check-in.",
        "Concierge gave great restaurant recommendations.",
        "Room service was prompt and friendly.",
        "Staff went above and beyond for our anniversary.",
    ],
    "Amenities": [
        "Pool area is beautiful with great views.",
        "Wish there were more beach chairs available.",
        "Kids loved the splash pad and game room.",
        "Fitness center needs updated equipment.",
        "The spa treatments were absolutely worth it.",
    ],
    "Location": [
        "Perfect beachfront location, steps from the water.",
        "Great proximity to local restaurants and shops.",
        "Loved watching the sunrise from our balcony.",
        "A bit far from the main strip but shuttle helped.",
        "Best location on the island, hands down.",
    ],
    "Value": [
        "Great value for a beachfront property.",
        "Pricey during spring break but worth it.",
        "Compared to similar resorts, very competitive rates.",
        "Felt overpriced for what we got during off-season.",
        "The package deal made it an excellent value.",
    ],
    "Food": [
        "Breakfast buffet had amazing variety.",
        "Poolside bar makes the best frozen drinks.",
        "Restaurant prices were a bit steep.",
        "Room service menu was limited but quality was good.",
        "The seafood dinner was a highlight of our stay.",
    ],
}


def make_review_explorer() -> list:
    """200 synthetic reviews with sentiment, topics, and snippets."""
    reviews = []
    for i in range(200):
        # Pick 1-3 topics
        n_topics = RNG.integers(1, 4)
        topics = list(RNG.choice(REVIEW_TOPICS, size=n_topics, replace=False))

        # Generate date spread over 2023-2025
        year = int(RNG.choice([2023, 2024, 2025], p=[0.25, 0.40, 0.35]))
        month = int(RNG.integers(1, 13))
        day = int(RNG.integers(1, 29))

        # Sentiment: seasonal pattern + noise
        month_name = MONTHS[month - 1]
        base_sent = 3.6 + (year - 2023) * 0.1
        seasonal_adj = {3: -0.2, 7: -0.15, 8: -0.1}.get(month, 0.05)
        sentiment = round(min(5.0, max(1.0, base_sent + seasonal_adj + RNG.normal(0, 0.5))), 1)

        # Pick a snippet from primary topic
        primary_topic = topics[0]
        snippet = str(RNG.choice(REVIEW_SNIPPETS[primary_topic]))

        reviews.append({
            "id": i + 1,
            "date": f"{year}-{month:02d}-{day:02d}",
            "sentiment": sentiment,
            "topics": topics,
            "snippet": snippet,
            "room_type": str(RNG.choice(ROOM_TYPES)),
            "rating": int(min(5, max(1, round(sentiment + RNG.normal(0, 0.3))))),
        })

    return reviews


# ── Dashboard 4: Staffing Levels ─────────────────────────────────────────
def make_staffing_levels() -> list:
    """Monthly staffing by department: current vs recommended FTE."""
    base_fte = {
        "Front Desk": 8, "Housekeeping": 15, "F&B": 12,
        "Maintenance": 6, "Activities": 5,
    }
    data = []
    for m_idx, month in enumerate(MONTHS):
        occ = SEASONAL_OCC[month]
        for dept in DEPARTMENTS:
            base = base_fte[dept]
            # Recommended scales with occupancy
            recommended = round(base * (0.6 + occ * 0.6) + RNG.normal(0, 0.3), 1)
            # Current is flatter (under-staffed in peak, over-staffed in trough)
            current = round(base * (0.75 + occ * 0.35) + RNG.normal(0, 0.3), 1)
            data.append({
                "month": month,
                "month_num": m_idx + 1,
                "department": dept,
                "current_fte": max(1, current),
                "recommended_fte": max(1, recommended),
            })
    return data


# ── Dashboard 5: Room Comparison (Radar) ─────────────────────────────────
def make_room_comparison() -> list:
    """5-dimension radar chart data for RadarComparison component.

    Shaped: {axis, Standard, "Ocean View", Suite, Beachfront}
    """
    dimensions = {
        "Occupancy Rate":   {"Standard": 88, "Ocean View": 82, "Suite": 71, "Beachfront": 78},
        "Guest Satisfaction":{"Standard": 72, "Ocean View": 81, "Suite": 90, "Beachfront": 88},
        "Revenue/Room":     {"Standard": 65, "Ocean View": 78, "Suite": 92, "Beachfront": 95},
        "Repeat Bookings":  {"Standard": 60, "Ocean View": 72, "Suite": 85, "Beachfront": 80},
        "Maintenance Cost":  {"Standard": 40, "Ocean View": 55, "Suite": 75, "Beachfront": 70},
    }
    data = []
    for axis, values in dimensions.items():
        row = {"axis": axis}
        for rt in ROOM_TYPES:
            row[rt] = values[rt] + int(RNG.integers(-3, 4))
        data.append(row)
    return data


# ── Dashboard 6: Check-in Patterns (Heatmap) ─────────────────────────────
def make_checkin_patterns() -> list:
    """Day × hour check-in volume for DayHourHeatmap component.

    Shaped: {day, hour, value}
    """
    days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    hours = list(range(8, 22))  # 8 AM to 9 PM

    # Base patterns: weekends heavier, afternoon peak
    day_weight = {"Mon": 0.5, "Tue": 0.4, "Wed": 0.5, "Thu": 0.7,
                  "Fri": 1.4, "Sat": 1.6, "Sun": 0.9}
    hour_weight = {}
    for h in hours:
        if 14 <= h <= 17:
            hour_weight[h] = 1.5  # peak check-in
        elif 10 <= h <= 13:
            hour_weight[h] = 1.0
        elif 18 <= h <= 20:
            hour_weight[h] = 0.8
        else:
            hour_weight[h] = 0.3

    data = []
    for day in days:
        for hour in hours:
            base = 12 * day_weight[day] * hour_weight[hour]
            value = max(0, round(base + RNG.normal(0, 1.5)))
            data.append({"day": day, "hour": hour, "value": value})
    return data


# ── Main ─────────────────────────────────────────────────────────────────────
def main():
    print("Generating SPI Beach Resort data...")

    # ── Case-study charts ──
    print("\n  Case-study charts → data/case-studies/spi-beach-resort/")
    heatmap = make_occupancy_heatmap()
    _write_json(heatmap, "occupancy-heatmap.json")

    sentiment = make_sentiment_trend()
    _write_json(sentiment, "sentiment-trend.json")

    pricing = make_pricing_simulation()
    _write_json(pricing, "pricing-simulation.json")

    revpar = make_revpar_decomposition()
    _write_json(revpar, "revpar-decomposition.json")

    # ── Dashboard app data ──
    print("\n  Dashboard app → data/resort/")
    forecast = make_forecast_grid()
    _write_json_to(forecast, "forecast-grid.json", RESORT_DIR)

    timeseries = make_occupancy_forecast_timeseries()
    _write_json_to(timeseries, "occupancy-forecast-timeseries.json", RESORT_DIR)

    reviews = make_review_explorer()
    _write_json_to(reviews, "review-explorer.json", RESORT_DIR)

    staffing = make_staffing_levels()
    _write_json_to(staffing, "staffing-levels.json", RESORT_DIR)

    room_comp = make_room_comparison()
    _write_json_to(room_comp, "room-comparison.json", RESORT_DIR)

    checkin = make_checkin_patterns()
    _write_json_to(checkin, "checkin-patterns.json", RESORT_DIR)

    print("\nDone! All data generated.")


def _write_json(data, filename: str):
    path = JSON_DIR / filename
    with open(path, "w") as f:
        json.dump(data, f, indent=2)
    print(f"    ✓ {filename}")


def _write_json_to(data, filename: str, directory: Path):
    path = directory / filename
    with open(path, "w") as f:
        json.dump(data, f, indent=2)
    print(f"    ✓ {filename}")


if __name__ == "__main__":
    main()
