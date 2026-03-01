"use client";

import { useMemo } from "react";
import { useTheme } from "next-themes";
import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { getChartColors, getAxisTheme } from "@/lib/chart-theme";

interface ROCPoint {
  fpr: number;
  tpr: number;
}

interface ROCCurveProps {
  data: ROCPoint[];
  auc: number;
}

export function ROCCurve({ data, auc }: ROCCurveProps) {
  const { theme } = useTheme();

  const { colors, axis } = useMemo(
    () => ({ colors: getChartColors(), axis: getAxisTheme() }),
    [theme]
  );

  // Add diagonal reference points for the random baseline
  const diagonalData = [
    { fpr: 0, tpr: 0, diagonal: 0 },
    { fpr: 1, tpr: 1, diagonal: 1 },
  ];

  return (
    <ResponsiveContainer width="100%" height={380}>
      <AreaChart data={data} margin={{ top: 10, right: 20, bottom: 40, left: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={axis.gridStroke} />
        <XAxis
          dataKey="fpr"
          type="number"
          domain={[0, 1]}
          tick={{ fill: axis.fill, fontSize: axis.fontSize }}
          stroke={axis.stroke}
          label={{
            value: "False Positive Rate",
            position: "insideBottom",
            offset: -10,
            fill: axis.fill,
            fontSize: 12,
          }}
          tickFormatter={(v: number) => v.toFixed(1)}
        />
        <YAxis
          dataKey="tpr"
          type="number"
          domain={[0, 1]}
          tick={{ fill: axis.fill, fontSize: axis.fontSize }}
          stroke={axis.stroke}
          label={{
            value: "True Positive Rate",
            angle: -90,
            position: "insideLeft",
            offset: 10,
            fill: axis.fill,
            fontSize: 12,
          }}
          tickFormatter={(v: number) => v.toFixed(1)}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--popover, #fff)",
            border: "1px solid var(--border, #e5e7eb)",
            borderRadius: "8px",
            color: "var(--foreground, #1B2A4A)",
            fontSize: 12,
          }}
          formatter={(value: number | undefined) => [(value ?? 0).toFixed(3)]}
          labelFormatter={(label) => `FPR: ${Number(label).toFixed(3)}`}
        />

        {/* Diagonal reference line (random classifier baseline) */}
        <ReferenceLine
          segment={[{ x: 0, y: 0 }, { x: 1, y: 1 }]}
          stroke="var(--muted-foreground, #6B7280)"
          strokeDasharray="6 3"
          strokeWidth={1}
        />

        {/* Area under the ROC curve */}
        <Area
          type="monotone"
          dataKey="tpr"
          stroke={colors[0]}
          fill={colors[0]}
          fillOpacity={0.12}
          strokeWidth={2.5}
          dot={false}
          activeDot={{ r: 3 }}
          name={`ROC (AUC = ${auc})`}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
