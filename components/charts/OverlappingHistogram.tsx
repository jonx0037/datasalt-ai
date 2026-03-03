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

interface OverlappingHistogramProps {
  data: Record<string, string | number>[];
  xKey?: string;
  beforeKey: string;
  afterKey: string;
  beforeLabel?: string;
  afterLabel?: string;
  xLabel?: string;
  yLabel?: string;
}

export function OverlappingHistogram({
  data,
  xKey = "bin",
  beforeKey,
  afterKey,
  beforeLabel = "Before",
  afterLabel = "After",
}: OverlappingHistogramProps) {
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
        barCategoryGap="10%"
      >
        <CartesianGrid strokeDasharray="3 3" stroke={axis.gridStroke} />
        <XAxis
          dataKey={xKey}
          tick={{ fill: axis.fill, fontSize: axis.fontSize }}
          stroke={axis.stroke}
        />
        <YAxis
          tick={{ fill: axis.fill, fontSize: axis.fontSize }}
          stroke={axis.stroke}
          label={{
            value: "Count",
            angle: -90,
            position: "insideLeft",
            fill: axis.fill,
            fontSize: 11,
          }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--popover, #fff)",
            border: "1px solid var(--border, #e5e7eb)",
            borderRadius: "8px",
            color: "var(--foreground, #1B2A4A)",
            fontSize: 12,
          }}
        />
        <Legend verticalAlign="top" height={36} />
        <Bar
          dataKey={beforeKey}
          name={beforeLabel}
          fill={colors[2] || "#6B7280"}
          fillOpacity={0.55}
          radius={[2, 2, 0, 0]}
        />
        <Bar
          dataKey={afterKey}
          name={afterLabel}
          fill={colors[0]}
          fillOpacity={0.7}
          radius={[2, 2, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
