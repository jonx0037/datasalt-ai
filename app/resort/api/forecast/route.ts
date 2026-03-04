import { NextRequest, NextResponse } from "next/server";
import forecastData from "@/data/resort/forecast-grid.json";
import staffingData from "@/data/resort/staffing-levels.json";

interface GridEntry {
  month: number;
  month_label: string;
  room_type: string;
  event: string;
  predicted_occupancy: number;
  occupancy_low: number;
  occupancy_high: number;
  recommended_rate: number;
  actual_rate: number;
  revenue_opportunity: number;
}

interface StaffingEntry {
  month: string;
  month_num: number;
  department: string;
  current_fte: number;
  recommended_fte: number;
}

const forecast = forecastData as {
  grid: GridEntry[];
  model_metrics: { mape: number; accuracy_14d: number; revenue_uplift: number };
};

const staffing = staffingData as StaffingEntry[];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const month = Number(body.month ?? 1);
    const roomType = String(body.room_type ?? "Standard");
    const events: string[] = body.events ?? ["none"];
    const event = events[0] ?? "none";

    let matches: GridEntry[];

    if (roomType === "all") {
      // Average across all room types for this month + event
      matches = forecast.grid.filter(
        (e) => e.month === month && e.event === event
      );
    } else {
      matches = forecast.grid.filter(
        (e) =>
          e.month === month &&
          e.room_type === roomType &&
          e.event === event
      );
    }

    if (matches.length === 0) {
      return NextResponse.json(
        { error: "No matching forecast found" },
        { status: 404 }
      );
    }

    // Average the matches
    const avg = (arr: number[]) =>
      Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 10) / 10;

    const predicted_occupancy = avg(matches.map((m) => m.predicted_occupancy));
    const occupancy_low = avg(matches.map((m) => m.occupancy_low));
    const occupancy_high = avg(matches.map((m) => m.occupancy_high));
    const recommended_rate = Math.round(
      avg(matches.map((m) => m.recommended_rate))
    );
    const actual_rate = Math.round(avg(matches.map((m) => m.actual_rate)));
    const revenue_opportunity = Math.round(
      matches.reduce((s, m) => s + m.revenue_opportunity, 0)
    );

    // Staffing for this month
    const monthLabel = matches[0].month_label;
    const monthStaffing = staffing.filter((s) => s.month === monthLabel);
    const totalFte = Math.round(
      monthStaffing.reduce((s, e) => s + e.recommended_fte, 0) * 10
    ) / 10;
    const staffingGap =
      Math.round(
        monthStaffing.reduce(
          (s, e) => s + (e.recommended_fte - e.current_fte),
          0
        ) * 10
      ) / 10;

    return NextResponse.json({
      predicted_occupancy,
      occupancy_low,
      occupancy_high,
      recommended_rate,
      actual_rate,
      revenue_opportunity,
      staffing: {
        recommendation:
          staffingGap > 2
            ? "Understaffed"
            : staffingGap < -2
              ? "Overstaffed"
              : "Adequate",
        total_fte: totalFte,
        gap: staffingGap,
        by_department: monthStaffing.map((s) => ({
          department: s.department,
          current: s.current_fte,
          recommended: s.recommended_fte,
        })),
      },
      model_metrics: forecast.model_metrics,
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}
