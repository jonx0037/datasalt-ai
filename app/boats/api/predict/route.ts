import { NextRequest, NextResponse } from "next/server";
import predictions from "@/data/boats/xgb-predictions.json";

interface PredictionEntry {
  features: Record<string, number>;
  predicted_price: number;
  price_low: number;
  price_high: number;
}

const grid = predictions as {
  predictions: PredictionEntry[];
  feature_columns: string[];
  categorical_mappings: Record<string, Record<string, string>>;
  grid_values: Record<string, number[]>;
  model_metrics: { r2: number; mae: number };
};

/** Encode a categorical value to its numeric code. */
function encodeCategorical(col: string, value: string): number {
  const mapping = grid.categorical_mappings[col];
  if (!mapping) return 0;
  for (const [code, label] of Object.entries(mapping)) {
    if (label === value) return Number(code);
  }
  return 0;
}

/** Weighted Euclidean distance between two feature vectors. */
function distance(a: Record<string, number>, b: Record<string, number>): number {
  // Weight important features more heavily
  const weights: Record<string, number> = {
    engine_hp: 3,
    condition: 3,
    model_year: 2,
    manufacturer: 2,
    boat_type: 1.5,
    length_ft: 1.5,
    hull_material: 1,
    days_on_lot: 0.5,
    beam_ft: 0.5,
    sale_month: 0.3,
  };

  let sum = 0;
  for (const key of Object.keys(a)) {
    const w = weights[key] ?? 1;
    const rangeVal = grid.grid_values[key];
    const range = rangeVal
      ? Math.max(...rangeVal) - Math.min(...rangeVal) || 1
      : 1;
    const diff = ((a[key] ?? 0) - (b[key] ?? 0)) / range;
    sum += w * diff * diff;
  }
  return Math.sqrt(sum);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Encode the input features
    const encoded: Record<string, number> = {};
    for (const col of grid.feature_columns) {
      if (col in (grid.categorical_mappings ?? {})) {
        encoded[col] = encodeCategorical(col, body[col] ?? "");
      } else {
        encoded[col] = Number(body[col] ?? 0);
      }
    }

    // Find nearest prediction in grid
    let bestIdx = 0;
    let bestDist = Infinity;
    for (let i = 0; i < grid.predictions.length; i++) {
      const d = distance(encoded, grid.predictions[i].features);
      if (d < bestDist) {
        bestDist = d;
        bestIdx = i;
      }
    }

    const match = grid.predictions[bestIdx];

    return NextResponse.json({
      predicted_price: match.predicted_price,
      price_low: match.price_low,
      price_high: match.price_high,
      confidence: Math.max(0, Math.round((1 - bestDist / 5) * 100)),
      model_metrics: grid.model_metrics,
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}
