"use client";

import { useMemo } from "react";
import { useTheme } from "next-themes";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from "recharts";
import { getChartColors, getAxisTheme } from "@/lib/chart-theme";

interface ScatterPoint {
  x: number;
  y: number;
  category: string;
  label?: string;
}

interface EventMarker {
  x: number;
  label: string;
}

interface ColoredScatterProps {
  data: ScatterPoint[];
  xLabel: string;
  yLabel: string;
  xFormat?: "dollar" | "percent" | "number";
  yFormat?: "dollar" | "percent" | "number";
  events?: EventMarker[];
}

function formatValue(v: number, fmt: "dollar" | "percent" | "number"): string {
  if (fmt === "dollar") return `$${v.toLocaleString()}`;
  if (fmt === "percent") return `${v}%`;
  return v.toLocaleString();
}

export function ColoredScatter({
  data,
  xLabel,
  yLabel,
  xFormat = "number",
  yFormat = "number",
  events,
}: ColoredScatterProps) {
  const { theme } = useTheme();

  const { groups, colors, axis } = useMemo(() => {
    const c = getChartColors();
    const a = getAxisTheme();
    const categories = [...new Set(data.map((d) => d.category))];
    const grouped = categories.map((cat) => ({
      name: cat,
      points: data.filter((d) => d.category === cat),
    }));
    return { groups: grouped, colors: c, axis: a };
  }, [data, theme]);

  return (
    <ResponsiveContainer width="100%" height={380}>
      <ScatterChart margin={{ top: 10, right: 20, bottom: 40, left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={axis.gridStroke} />
        <XAxis
          type="number"
          dataKey="x"
          name={xLabel}
          tick={{ fill: axis.fill, fontSize: axis.fontSize }}
          stroke={axis.stroke}
          tickFormatter={(v: number) => formatValue(v, xFormat)}
          label={{
            value: xLabel,
            position: "insideBottom",
            offset: -10,
            fill: axis.fill,
            fontSize: axis.fontSize,
          }}
        />
        <YAxis
          type="number"
          dataKey="y"
          name={yLabel}
          tick={{ fill: axis.fill, fontSize: axis.fontSize }}
          stroke={axis.stroke}
          tickFormatter={(v: number) => formatValue(v, yFormat)}
          label={{
            value: yLabel,
            angle: -90,
            position: "insideLeft",
            offset: 0,
            fill: axis.fill,
            fontSize: axis.fontSize,
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
          formatter={(value: unknown, name: unknown) => {
            const v = Number(value ?? 0);
            const n = String(name ?? "");
            if (n === xLabel) return [formatValue(v, xFormat), xLabel];
            if (n === yLabel) return [formatValue(v, yFormat), yLabel];
            return [v, n];
          }}
        />
        <Legend verticalAlign="top" height={36} />
        {groups.map((g, i) => (
          <Scatter
            key={g.name}
            name={g.name}
            data={g.points}
            fill={colors[i % colors.length]}
            opacity={0.75}
          />
        ))}
        {events?.map((evt) => (
          <ReferenceLine
            key={evt.label}
            x={evt.x}
            stroke={colors[4] || "#F97316"}
            strokeDasharray="4 4"
            label={{
              value: evt.label,
              position: "top",
              fill: colors[4] || "#F97316",
              fontSize: 10,
            }}
          />
        ))}
      </ScatterChart>
    </ResponsiveContainer>
  );
}
