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
  ReferenceLine,
} from "recharts";
import { getChartColors, getAxisTheme } from "@/lib/chart-theme";

interface DecompositionBarProps {
  data: Record<string, string | number>[];
  xKey?: string;
  components: string[];
  format?: "dollar" | "percent" | "number";
}

function formatValue(v: number, fmt: "dollar" | "percent" | "number"): string {
  if (fmt === "dollar") return `$${v.toLocaleString()}`;
  if (fmt === "percent") return `${v}%`;
  return v.toLocaleString();
}

export function DecompositionBar({
  data,
  xKey = "label",
  components,
  format = "dollar",
}: DecompositionBarProps) {
  const { theme } = useTheme();

  const { colors, axis } = useMemo(
    () => ({ colors: getChartColors(), axis: getAxisTheme() }),
    [theme]
  );

  return (
    <ResponsiveContainer width="100%" height={380}>
      <BarChart data={data} margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={axis.gridStroke} />
        <XAxis
          dataKey={xKey}
          tick={{ fill: axis.fill, fontSize: axis.fontSize }}
          stroke={axis.stroke}
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
        <ReferenceLine y={0} stroke={axis.stroke} />
        {components.map((comp, i) => (
          <Bar
            key={comp}
            dataKey={comp}
            name={comp}
            stackId="decomposition"
            fill={colors[i % colors.length]}
            radius={i === components.length - 1 ? [2, 2, 0, 0] : undefined}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
