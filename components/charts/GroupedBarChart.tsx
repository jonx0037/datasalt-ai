"use client";

import { useMemo } from "react";
import { useTheme } from "next-themes";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { getChartColors, getAxisTheme } from "@/lib/chart-theme";

interface GroupedBarChartProps {
  data: Record<string, string | number>[];
  xKey?: string;
  bars: { dataKey: string; label: string }[];
  format?: "dollar" | "percent" | "number" | "hours";
}

function formatValue(
  v: number,
  fmt: "dollar" | "percent" | "number" | "hours"
): string {
  if (fmt === "dollar") return `$${v.toLocaleString()}`;
  if (fmt === "percent") return `${v}%`;
  if (fmt === "hours") return `${v}h`;
  return v.toLocaleString();
}

export function GroupedBarChart({
  data,
  xKey = "label",
  bars,
  format = "number",
}: GroupedBarChartProps) {
  const { theme } = useTheme();

  const { colors, axis } = useMemo(
    () => ({ colors: getChartColors(), axis: getAxisTheme() }),
    [theme]
  );

  return (
    <ResponsiveContainer width="100%" height={380}>
      <BarChart
        data={data}
        margin={{ top: 10, right: 20, bottom: 20, left: 10 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={axis.gridStroke} />
        <XAxis
          dataKey={xKey}
          tick={{ fill: axis.fill, fontSize: axis.fontSize }}
          stroke={axis.stroke}
          interval={0}
          angle={-20}
          textAnchor="end"
          height={50}
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
          formatter={(value: unknown) => [
            formatValue(Number(value ?? 0), format),
          ]}
        />
        <Legend verticalAlign="top" height={36} />
        {bars.map((bar, i) => (
          <Bar
            key={bar.dataKey}
            dataKey={bar.dataKey}
            name={bar.label}
            fill={colors[i % colors.length]}
            radius={[2, 2, 0, 0]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
