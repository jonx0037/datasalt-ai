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
  Cell,
} from "recharts";
import { getChartColors, getAxisTheme } from "@/lib/chart-theme";

interface SHAPItem {
  feature: string;
  importance: number;
}

interface SHAPWaterfallProps {
  data: SHAPItem[];
  format?: "dollar" | "decimal" | "number";
}

function formatSHAP(v: number, fmt: "dollar" | "decimal" | "number"): string {
  if (fmt === "dollar") return `$${(v / 1000).toFixed(0)}k`;
  if (fmt === "decimal") return v.toFixed(3);
  return v.toLocaleString();
}

export function SHAPWaterfall({ data, format = "dollar" }: SHAPWaterfallProps) {
  const { theme } = useTheme();

  const { colors, axis } = useMemo(
    () => ({ colors: getChartColors(), axis: getAxisTheme() }),
    [theme]
  );

  const maxImportance = Math.max(...data.map((d) => d.importance));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke={axis.gridStroke}
          horizontal={false}
        />
        <XAxis
          type="number"
          tick={{ fill: axis.fill, fontSize: axis.fontSize }}
          axisLine={{ stroke: axis.stroke }}
          tickFormatter={(v: number) => formatSHAP(v, format)}
        />
        <YAxis
          type="category"
          dataKey="feature"
          tick={{ fill: axis.fill, fontSize: axis.fontSize }}
          axisLine={{ stroke: axis.stroke }}
          width={95}
        />
        <Tooltip
          formatter={(value: unknown) => [formatSHAP(Number(value ?? 0), format), "Mean |SHAP|"]}
          contentStyle={{
            backgroundColor: "var(--card)",
            borderColor: "var(--border)",
            borderRadius: "8px",
            fontSize: "12px",
          }}
          labelStyle={{ color: "var(--foreground)" }}
        />
        <Bar dataKey="importance" radius={[0, 4, 4, 0]}>
          {data.map((entry, index) => (
            <Cell
              key={entry.feature}
              fill={
                entry.importance > maxImportance * 0.6
                  ? colors[0]
                  : entry.importance > maxImportance * 0.3
                    ? colors[2]
                    : colors[4]
              }
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
