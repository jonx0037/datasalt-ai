#!/usr/bin/env python3
"""
Generate synthetic data for the South Texas Urgent Care Network case study.

Produces:
  - data/case-studies/south-texas-urgent-care/volume-heatmap.json
  - data/case-studies/south-texas-urgent-care/noshow-features.json
  - data/case-studies/south-texas-urgent-care/noshow-roc.json
  - data/case-studies/south-texas-urgent-care/clinic-radar.json
  - data/case-studies/south-texas-urgent-care/staffing-optimization.json

Usage:
  cd datasalt-ai
  python scripts/generate_urgent_care_data.py
"""

import json
from pathlib import Path

import numpy as np

# ── Reproducibility ──────────────────────────────────────────────────────────
RNG = np.random.default_rng(321)

# ── Paths ────────────────────────────────────────────────────────────────────
ROOT = Path(__file__).resolve().parent.parent
if (ROOT / "datasalt-ai").exists():
    ROOT = ROOT / "datasalt-ai"

JSON_DIR = ROOT / "data" / "case-studies" / "south-texas-urgent-care"
JSON_DIR.mkdir(parents=True, exist_ok=True)

# ── Constants ────────────────────────────────────────────────────────────────
CLINICS = ["McAllen Central", "Edinburg", "Mission", "Pharr", "Weslaco"]
DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
HOURS = list(range(7, 22))  # 7am to 9pm


# ── Chart 1: Patient Volume Heatmap (DayHourHeatmap) ────────────────────────
def make_volume_heatmap() -> list:
    """Day-of-week × hour-of-day patient volume heatmap."""
    data = []
    for day_idx, day in enumerate(DAYS):
        for hour in HOURS:
            # Base volume with realistic patterns
            base = 12

            # Morning surge (8-11am)
            if 8 <= hour <= 11:
                base += 18
            # Afternoon steady (12-5pm)
            elif 12 <= hour <= 17:
                base += 12
            # Evening taper (6-9pm)
            elif hour >= 18:
                base += 5

            # Monday spike (post-weekend)
            if day_idx == 0:
                base *= 1.35
            # Weekend drop
            elif day_idx >= 5:
                base *= 0.70
            # Friday slight bump
            elif day_idx == 4:
                base *= 1.10

            # Add noise
            volume = max(2, int(base + RNG.normal(0, 3)))
            data.append({"day": day, "hour": hour, "value": volume})

    return data


# ── Chart 2: No-Show Feature Importance (SHAPWaterfall) ─────────────────────
def make_noshow_features() -> list:
    """Feature importance for no-show prediction model."""
    features = [
        ("Prior No-Shows", 0.24),
        ("Appointment Lead Time", 0.18),
        ("Insurance Type", 0.14),
        ("Day of Week", 0.11),
        ("Distance to Clinic", 0.09),
        ("Patient Age", 0.07),
        ("Time of Day", 0.06),
        ("Provider", 0.04),
    ]
    data = []
    for feature, importance in features:
        # Add small noise to make it look empirical
        noisy = max(0.01, importance + RNG.normal(0, 0.01))
        data.append({
            "feature": feature,
            "importance": round(noisy, 3),
        })
    # Sort descending by importance
    data.sort(key=lambda x: x["importance"], reverse=True)
    return data


# ── Chart 3: ROC Curve (ROCCurve) ───────────────────────────────────────────
def make_noshow_roc() -> dict:
    """ROC curve data for no-show classifier."""
    # Generate smooth ROC curve for AUC ~0.82
    n_points = 50
    fpr = np.sort(np.concatenate([
        [0.0],
        np.sort(RNG.beta(1.5, 4, n_points - 2)),
        [1.0],
    ]))

    # TPR follows a concave curve above the diagonal
    tpr = []
    for fp in fpr:
        # Model with AUC ~0.82: TPR = 1 - (1-FPR)^k with some noise
        base_tpr = 1 - (1 - fp) ** 0.35
        noisy = min(1.0, max(fp, base_tpr + RNG.normal(0, 0.02)))
        tpr.append(noisy)

    # Ensure monotonically increasing
    tpr = list(np.maximum.accumulate(tpr))
    tpr[0] = 0.0
    tpr[-1] = 1.0

    # Calculate AUC
    auc = float(np.trapezoid(tpr, fpr))

    points = [{"fpr": round(float(f), 4), "tpr": round(float(t), 4)}
              for f, t in zip(fpr, tpr)]

    return {"points": points, "auc": round(auc, 3)}


# ── Chart 4: Clinic Radar Comparison (RadarComparison) ──────────────────────
def make_clinic_radar() -> list:
    """Clinic benchmarking for RadarComparison."""
    metrics = ["Patient Volume", "Avg Wait Time", "Satisfaction", "No-Show Rate", "Winter Texan %"]
    # Clinic strengths/weaknesses
    clinic_profiles = {
        "McAllen Central": {"Patient Volume": 85, "Avg Wait Time": 55, "Satisfaction": 72, "No-Show Rate": 60, "Winter Texan %": 45},
        "Edinburg": {"Patient Volume": 70, "Avg Wait Time": 75, "Satisfaction": 80, "No-Show Rate": 70, "Winter Texan %": 30},
        "Mission": {"Patient Volume": 55, "Avg Wait Time": 80, "Satisfaction": 85, "No-Show Rate": 75, "Winter Texan %": 65},
        "Pharr": {"Patient Volume": 65, "Avg Wait Time": 60, "Satisfaction": 65, "No-Show Rate": 55, "Winter Texan %": 40},
        "Weslaco": {"Patient Volume": 50, "Avg Wait Time": 70, "Satisfaction": 78, "No-Show Rate": 80, "Winter Texan %": 70},
    }

    data = []
    for metric in metrics:
        row = {"axis": metric}
        for clinic in CLINICS:
            base = clinic_profiles[clinic][metric]
            val = base + RNG.normal(0, 4)
            row[clinic] = round(min(100, max(10, val)), 0)
        data.append(row)
    return data


# ── Chart 5: Staffing Optimization (DualLineComparison) ─────────────────────
def make_staffing_optimization() -> list:
    """Current vs recommended staffing by time slot."""
    data = []
    for hour in HOURS:
        # Current staffing (flat, inefficient)
        if 7 <= hour <= 8:
            current = 4
        elif 9 <= hour <= 17:
            current = 6
        elif hour >= 18:
            current = 4
        else:
            current = 3

        # Recommended staffing (follows demand curve)
        if 8 <= hour <= 11:
            recommended = 8
        elif 12 <= hour <= 14:
            recommended = 7
        elif 15 <= hour <= 17:
            recommended = 6
        elif 7 <= hour <= 7:
            recommended = 3
        elif hour >= 18:
            recommended = 3
        else:
            recommended = 4

        data.append({
            "label": f"{hour}:00",
            "current": current + round(RNG.normal(0, 0.3)),
            "recommended": recommended + round(RNG.normal(0, 0.2)),
        })
    return data


# ── Main ─────────────────────────────────────────────────────────────────────
def main():
    print("Generating South Texas Urgent Care Network data...")

    volume = make_volume_heatmap()
    _write_json(volume, "volume-heatmap.json")

    features = make_noshow_features()
    _write_json(features, "noshow-features.json")

    roc = make_noshow_roc()
    _write_json(roc, "noshow-roc.json")

    radar = make_clinic_radar()
    _write_json(radar, "clinic-radar.json")

    staffing = make_staffing_optimization()
    _write_json(staffing, "staffing-optimization.json")

    print("\nDone! All chart data written to data/case-studies/south-texas-urgent-care/")


def _write_json(data, filename: str):
    path = JSON_DIR / filename
    with open(path, "w") as f:
        json.dump(data, f, indent=2)
    print(f"  > {filename}")


if __name__ == "__main__":
    main()
