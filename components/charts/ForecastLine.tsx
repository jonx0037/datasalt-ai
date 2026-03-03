"use client";

import { useMemo } from "react";
import { useTheme } from "next-themes";
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from "recharts";
import { getChartColors, getAxisTheme } from "@/lib/chart-theme";

interface ForecastLineProps {
  data: Record<string, string | number | null>[];
  xKey?: string;
  actualKey: string;
  forecastKey: string;
  upperKey: string;
  lowerKey: string;
  actualLabel?: string;
  forecastLabel?: string;
  format?: "dollar" | "percent" | "number";
  /** x-value where the forecast region begins */
  forecastStart?: string;
}

function formatValue(v: number, fmt: "dollar" | "percent" | "number"): string {
  if (fmt === "dollar") return `$${v.toLocaleString()}`;
  if (fmt === "percent") return `${v}%`;
  return v.toLocaleString();
}

export function ForecastLine({
  data,
  xKey = "label",
  actualKey,
  forecastKey,
  upperKey,
  lowerKey,
  actualLabel = "Actual",
  forecastLabel = "Forecast",
  format = "number",
  forecastStart,
}: ForecastLineProps) {
  const { theme } = useTheme();

  const { colors, axis } = useMemo(
    () => ({ colors: getChartColors(), axis: getAxisTheme() }),
    [theme]
  );

  return (
    <ResponsiveContainer width="100%" height={380}>
      <ComposedChart
        data={data}
        margin={{ top: 10, right: 20, bottom: 20, left: 10 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={axis.gridStroke} />
        <XAxis
          dataKey={xKey}
          tick={{ fill: axis.fill, fontSize: axis.fontSize }}
          stroke={axis.stroke}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fill: axis.fill, fontSize: axis.fontSize }}
          stroke={axis.stroke}
          tickFormatter={(v: number) => formatValue(v, format)}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--popover, #fff)",
            border: "1px solid var(--border, #e5e7eb)",
            borderRadius: "8px",
            color: "var(--foreground, #1B2A4A)",
            fontSize: 12,
          }}
          formatter={(value: unknown, name: unknown) => {
            const n = String(name ?? "");
            if (value == null) return ["-", n];
            return [formatValue(Number(value), format), n];
          }}
        />
        <Legend verticalAlign="top" height={36} />

        {/* Confidence band — upper bound area */}
        <Area
          type="monotone"
          dataKey={upperKey}
          name="80% CI"
          stroke="none"
          fill={colors[0]}
          fillOpacity={0.12}
          connectNulls={false}
        />
        {/* Lower bound area to "cut out" the band bottom */}
        <Area
          type="monotone"
          dataKey={lowerKey}
          stroke="none"
          fill="var(--background, #fff)"
          fillOpacity={1}
          legendType="none"
          connectNulls={false}
        />

        {/* Forecast start reference line */}
        {forecastStart && (
          <ReferenceLine
            x={forecastStart}
            stroke={axis.stroke}
            strokeDasharray="6 3"
            label={{
              value: "Forecast →",
              position: "top",
              fill: axis.fill,
              fontSize: 11,
            }}
          />
        )}

        {/* Actual (historical) line */}
        <Line
          type="monotone"
          dataKey={actualKey}
          name={actualLabel}
          stroke={colors[1] || "#1B2A4A"}
          strokeWidth={2}
          dot={false}
          connectNulls={false}
        />

        {/* Forecast line */}
        <Line
          type="monotone"
          dataKey={forecastKey}
          name={forecastLabel}
          stroke={colors[0]}
          strokeWidth={2.5}
          strokeDasharray="6 3"
          dot={false}
          connectNulls={false}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
