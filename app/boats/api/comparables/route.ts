import { NextRequest, NextResponse } from "next/server";
import comparablesData from "@/data/boats/comparable-sales.json";

interface Comparable {
  boat_type: string;
  manufacturer: string;
  model_year: number;
  length_ft: number;
  engine_hp: number;
  condition: string;
  location: string;
  days_on_lot: number;
  sale_price: number;
}

const allComps = (comparablesData as { comparables: Comparable[] }).comparables;

/** Simple relevance score — lower = more similar. */
function relevance(comp: Comparable, query: Record<string, string | number>): number {
  let score = 0;

  if (query.boat_type && comp.boat_type !== query.boat_type) score += 3;
  if (query.manufacturer && comp.manufacturer !== query.manufacturer) score += 2;
  if (query.condition && comp.condition !== query.condition) score += 2;

  if (query.model_year) {
    score += Math.abs(comp.model_year - Number(query.model_year)) * 0.3;
  }
  if (query.length_ft) {
    score += Math.abs(comp.length_ft - Number(query.length_ft)) * 0.2;
  }
  if (query.engine_hp) {
    score += Math.abs(comp.engine_hp - Number(query.engine_hp)) * 0.01;
  }

  return score;
}

export async function POST(req: NextRequest) {
  try {
    const query = await req.json();
    const limit = Math.min(Number(query.limit) || 5, 20);

    const scored = allComps
      .map((c) => ({ ...c, _score: relevance(c, query) }))
      .sort((a, b) => a._score - b._score)
      .slice(0, limit);

    // Strip internal score
    const results = scored.map(({ _score, ...rest }) => rest);

    return NextResponse.json({ comparables: results });
  } catch {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}
