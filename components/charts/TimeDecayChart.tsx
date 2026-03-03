"use client";

import { useMemo } from "react";
import { useTheme } from "next-themes";
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from "recharts";
import { getChartColors, getAxisTheme } from "@/lib/chart-theme";

interface TimeDecayChartProps {
  data: Record<string, string | number>[];
  xKey?: string;
  priceKey: string;
  compKey?: string;
  priceLabel?: string;
  compLabel?: string;
  /** Day values where markdown triggers fire — show as vertical reference lines */
  triggers?: { day: number; label: string }[];
}

export function TimeDecayChart({
  data,
  xKey = "day",
  priceKey,
  compKey,
  priceLabel = "Recommended Price",
  compLabel = "Comparable Sales Avg",
  triggers = [],
}: TimeDecayChartProps) {
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
          label={{
            value: "Days on Lot",
            position: "insideBottom",
            offset: -10,
            fill: axis.fill,
            fontSize: 11,
          }}
        />
        <YAxis
          tick={{ fill: axis.fill, fontSize: axis.fontSize }}
          stroke={axis.stroke}
          tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
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
            `$${Number(value ?? 0).toLocaleString()}`,
          ]}
        />
        <Legend verticalAlign="top" height={36} />

        {/* Markdown trigger vertical lines */}
        {triggers.map((t) => (
          <ReferenceLine
            key={t.day}
            x={t.day}
            stroke={colors[3] || "#EAB308"}
            strokeDasharray="4 3"
            label={{
              value: t.label,
              position: "top",
              fill: colors[3] || "#EAB308",
              fontSize: 10,
            }}
          />
        ))}

        {/* Comparable sales average (flat-ish reference line) */}
        {compKey && (
          <Line
            type="monotone"
            dataKey={compKey}
            name={compLabel}
            stroke={colors[2] || "#6B7280"}
            strokeWidth={1.5}
            strokeDasharray="6 3"
            dot={false}
          />
        )}

        {/* Stepped price decay */}
        <Line
          type="stepAfter"
          dataKey={priceKey}
          name={priceLabel}
          stroke={colors[0]}
          strokeWidth={2.5}
          dot={false}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
