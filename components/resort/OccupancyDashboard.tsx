"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Hotel,
  TrendingUp,
  Users,
  Loader2,
  CalendarDays,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ForecastLine } from "@/components/charts/ForecastLine";
import { StaffingPanel } from "./StaffingPanel";
import timeseriesData from "@/data/resort/occupancy-forecast-timeseries.json";

// ── Constants ────────────────────────────────────────────────
const MONTHS = [
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

const ROOM_TYPES = [
  { value: "all", label: "All Rooms" },
  { value: "Standard", label: "Standard" },
  { value: "Ocean View", label: "Ocean View" },
  { value: "Suite", label: "Suite" },
  { value: "Beachfront", label: "Beachfront" },
];

const EVENTS = [
  { id: "spring_break", label: "Spring Break" },
  { id: "summer_peak", label: "Summer Peak" },
  { id: "holiday_season", label: "Holiday Season" },
  { id: "fishing_tournament", label: "Fishing Tournament" },
  { id: "winter_texan", label: "Winter Texan Season" },
];

interface ForecastResult {
  predicted_occupancy: number;
  occupancy_low: number;
  occupancy_high: number;
  recommended_rate: number;
  actual_rate: number;
  revenue_opportunity: number;
  staffing: {
    recommendation: string;
    total_fte: number;
    gap: number;
    by_department: {
      department: string;
      current: number;
      recommended: number;
    }[];
  };
  model_metrics: {
    mape: number;
    accuracy_14d: number;
    revenue_uplift: number;
  };
}

// ── Component ────────────────────────────────────────────────
export function OccupancyDashboard() {
  // Form state
  const [month, setMonth] = useState("3"); // March (Spring Break)
  const [roomType, setRoomType] = useState("all");
  const [activeEvents, setActiveEvents] = useState<string[]>(["spring_break"]);

  // Prediction state
  const [result, setResult] = useState<ForecastResult | null>(null);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const toggleEvent = (eventId: string) => {
    setActiveEvents((prev) =>
      prev.includes(eventId)
        ? prev.filter((e) => e !== eventId)
        : [...prev, eventId]
    );
  };

  const fetchForecast = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/resort/api/forecast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          month: Number(month),
          room_type: roomType,
          events: activeEvents.length > 0 ? activeEvents : ["none"],
        }),
      });
      const data = await res.json();
      if (!data.error) setResult(data);
    } catch {
      // Silent fail — keep last result
    } finally {
      setLoading(false);
    }
  }, [month, roomType, activeEvents]);

  // Debounced fetch on input change
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(fetchForecast, 300);
    return () => clearTimeout(debounceRef.current);
  }, [fetchForecast]);

  const occupancy = result?.predicted_occupancy ?? 0;
  const occLow = result?.occupancy_low ?? 0;
  const occHigh = result?.occupancy_high ?? 0;

  return (
    <div className="grid lg:grid-cols-[1fr_360px] gap-6">
      {/* ── Left: Inputs + Results + Chart ──────────────── */}
      <div className="space-y-6">
        {/* Result display card */}
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-card to-muted/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Predicted Occupancy Rate
                </p>
                <div className="flex items-baseline gap-2">
                  <span
                    className={cn(
                      "text-4xl font-bold tracking-tight transition-opacity",
                      loading && "opacity-50"
                    )}
                  >
                    {occupancy.toFixed(1)}%
                  </span>
                  {loading && (
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  )}
                </div>
                {result && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Range: {occLow.toFixed(1)}% – {occHigh.toFixed(1)}%
                  </p>
                )}
              </div>

              <div className="text-right space-y-1">
                {result && (
                  <>
                    <Badge
                      variant={occupancy > 85 ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {occupancy > 85
                        ? "High Demand"
                        : occupancy > 65
                          ? "Moderate"
                          : "Low Season"}
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      MAPE: {result.model_metrics.mape}%
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Confidence bar */}
            {result && (
              <div className="mt-4">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>{occLow.toFixed(1)}%</span>
                  <span>{occHigh.toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, Math.max(10, ((occupancy - occLow) / (occHigh - occLow || 1)) * 100))}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Rate + Revenue row */}
            {result && (
              <div className="mt-4 grid grid-cols-3 gap-4 pt-4 border-t border-border/50">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Recommended Rate
                  </p>
                  <p className="text-lg font-semibold">
                    ${result.recommended_rate}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Current Rate</p>
                  <p className="text-lg font-semibold">
                    ${result.actual_rate}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    Revenue Opportunity
                  </p>
                  <p className="text-lg font-semibold text-primary">
                    {result.revenue_opportunity > 0
                      ? `+$${result.revenue_opportunity.toLocaleString()}`
                      : "Optimal"}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Input controls */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-primary" />
              Forecast Parameters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Row 1: Month + Room Type selects */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Month</Label>
                <Select value={month} onValueChange={setMonth}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MONTHS.map((m) => (
                      <SelectItem key={m.value} value={m.value}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Room Type</Label>
                <Select value={roomType} onValueChange={setRoomType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ROOM_TYPES.map((r) => (
                      <SelectItem key={r.value} value={r.value}>
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Row 2: Event scenario checkboxes */}
            <div className="space-y-3">
              <Label>Event Scenarios</Label>
              <div className="grid sm:grid-cols-2 gap-3">
                {EVENTS.map((event) => (
                  <label
                    key={event.id}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Checkbox
                      checked={activeEvents.includes(event.id)}
                      onCheckedChange={() => toggleEvent(event.id)}
                    />
                    <span className="text-sm">{event.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Forecast time-series chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Occupancy Forecast (2023–2025)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ForecastLine
              data={timeseriesData}
              xKey="label"
              actualKey="actual"
              forecastKey="forecast"
              upperKey="upper"
              lowerKey="lower"
              actualLabel="Actual Occupancy"
              forecastLabel="Prophet Forecast"
              format="percent"
              forecastStart="Jan 2025"
            />
          </CardContent>
        </Card>
      </div>

      {/* ── Right: Staffing + Quick Stats ───────────────── */}
      <div className="space-y-6">
        {/* Staffing panel */}
        <StaffingPanel
          staffing={result?.staffing ?? null}
          loading={loading}
        />

        {/* Quick stat cards */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Hotel className="h-4 w-4 text-primary" />
              Model Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <StatRow
              label="14-Day Accuracy"
              value={`${result?.model_metrics.accuracy_14d ?? 89}%`}
            />
            <StatRow
              label="Mean Absolute % Error"
              value={`${result?.model_metrics.mape ?? 11}%`}
            />
            <StatRow
              label="Annual Revenue Uplift"
              value={`$${(result?.model_metrics.revenue_uplift ?? 340000).toLocaleString()}`}
            />
          </CardContent>
        </Card>

        {/* Staffing total */}
        {result?.staffing && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Total FTE</span>
                </div>
                <span className="text-lg font-bold">
                  {result.staffing.total_fte}
                </span>
              </div>
              <Badge
                variant={
                  result.staffing.recommendation === "Adequate"
                    ? "default"
                    : "secondary"
                }
                className="mt-2 text-xs"
              >
                {result.staffing.recommendation}
                {result.staffing.gap !== 0 &&
                  ` (${result.staffing.gap > 0 ? "+" : ""}${result.staffing.gap} FTE gap)`}
              </Badge>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

// ── Stat sub-component ───────────────────────────────────────
function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold tabular-nums">{value}</span>
    </div>
  );
}
