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
  ReferenceArea,
} from "recharts";
import { getChartColors, getAxisTheme } from "@/lib/chart-theme";

interface ReferenceZone {
  x1: string;
  x2: string;
  label: string;
  color: string;
}

interface TrendWithOverlaysProps {
  data: Record<string, string | number>[];
  xKey?: string;
  primaryKey: string;
  primaryLabel: string;
  overlayKeys?: string[];
  format?: "dollar" | "dollar2" | "percent" | "number";
  referenceAreas?: ReferenceZone[];
}

function formatValue(v: number, fmt: "dollar" | "dollar2" | "percent" | "number"): string {
  if (fmt === "dollar") return `$${v.toLocaleString()}`;
  if (fmt === "dollar2") return `$${v.toFixed(2)}`;
  if (fmt === "percent") return `${v}%`;
  return v.toLocaleString();
}

export function TrendWithOverlays({
  data,
  xKey = "date",
  primaryKey,
  primaryLabel,
  overlayKeys = [],
  format = "number",
  referenceAreas,
}: TrendWithOverlaysProps) {
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
          formatter={(value: unknown) => {
            const v = Number(value ?? 0);
            return [formatValue(v, format)];
          }}
        />
        <Legend verticalAlign="top" height={36} />

        {/* Reference zones (e.g. hold/sell regions) */}
        {referenceAreas?.map((zone) => (
          <ReferenceArea
            key={zone.label}
            x1={zone.x1}
            x2={zone.x2}
            fill={zone.color}
            fillOpacity={0.1}
            label={{
              value: zone.label,
              position: "insideTop",
              fill: zone.color,
              fontSize: 10,
            }}
          />
        ))}

        {/* Overlay areas (drawn first, behind primary line) */}
        {overlayKeys.map((key, i) => (
          <Area
            key={key}
            type="monotone"
            dataKey={key}
            name={key}
            stroke={colors[(i + 1) % colors.length]}
            fill={colors[(i + 1) % colors.length]}
            fillOpacity={0.08}
            strokeWidth={1}
            strokeDasharray="4 4"
          />
        ))}

        {/* Primary line */}
        <Line
          type="monotone"
          dataKey={primaryKey}
          name={primaryLabel}
          stroke={colors[0]}
          strokeWidth={2.5}
          dot={false}
          activeDot={{ r: 4 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
