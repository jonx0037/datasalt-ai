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
} from "recharts";
import { getChartColors, getAxisTheme } from "@/lib/chart-theme";

interface DualLineComparisonProps {
  data: Record<string, string | number>[];
  xKey?: string;
  actualKey: string;
  recommendedKey: string;
  actualLabel?: string;
  recommendedLabel?: string;
  format?: "dollar" | "percent" | "number";
}

function formatValue(v: number, fmt: "dollar" | "percent" | "number"): string {
  if (fmt === "dollar") return `$${v.toLocaleString()}`;
  if (fmt === "percent") return `${v}%`;
  return v.toLocaleString();
}

export function DualLineComparison({
  data,
  xKey = "label",
  actualKey,
  recommendedKey,
  actualLabel = "Actual",
  recommendedLabel = "Recommended",
  format = "number",
}: DualLineComparisonProps) {
  const { theme } = useTheme();

  const { colors, axis } = useMemo(
    () => ({ colors: getChartColors(), axis: getAxisTheme() }),
    [theme]
  );

  return (
    <ResponsiveContainer width="100%" height={380}>
      <ComposedChart data={data} margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
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
          formatter={(value: unknown) => [formatValue(Number(value ?? 0), format)]}
        />
        <Legend verticalAlign="top" height={36} />

        {/* Gap shading between the two lines */}
        <Area
          type="monotone"
          dataKey={recommendedKey}
          name={`${recommendedLabel} (gap)`}
          stroke="none"
          fill={colors[0]}
          fillOpacity={0.08}
          legendType="none"
        />

        {/* Actual line */}
        <Line
          type="monotone"
          dataKey={actualKey}
          name={actualLabel}
          stroke={colors[2] || "#6B7280"}
          strokeWidth={2}
          dot={false}
          strokeDasharray="6 3"
        />

        {/* Recommended line */}
        <Line
          type="monotone"
          dataKey={recommendedKey}
          name={recommendedLabel}
          stroke={colors[0]}
          strokeWidth={2.5}
          dot={false}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
