"use client";

import { useMemo } from "react";
import { useTheme } from "next-themes";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { getChartColors } from "@/lib/chart-theme";

interface RadarComparisonProps {
  data: Record<string, string | number>[];
  entities: string[];
  axisKey?: string;
}

export function RadarComparison({
  data,
  entities,
  axisKey = "axis",
}: RadarComparisonProps) {
  const { theme } = useTheme();

  const colors = useMemo(() => getChartColors(), [theme]);

  return (
    <ResponsiveContainer width="100%" height={380}>
      <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
        <PolarGrid stroke="var(--border, #e5e7eb)" />
        <PolarAngleAxis
          dataKey={axisKey}
          tick={{ fill: "var(--muted-foreground, #6B7280)", fontSize: 11 }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 100]}
          tick={{ fill: "var(--muted-foreground, #6B7280)", fontSize: 10 }}
          axisLine={false}
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
        <Legend verticalAlign="bottom" height={36} />
        {entities.map((entity, i) => (
          <Radar
            key={entity}
            name={entity}
            dataKey={entity}
            stroke={colors[i % colors.length]}
            fill={colors[i % colors.length]}
            fillOpacity={0.15}
            strokeWidth={2}
          />
        ))}
      </RadarChart>
    </ResponsiveContainer>
  );
}
