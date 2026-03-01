"use client";

import { useMemo } from "react";
import { useTheme } from "next-themes";
import { getChartColors } from "@/lib/chart-theme";

interface HeatmapCell {
  column: string;
  row: string;
  value: number;
}

interface SeasonalHeatmapProps {
  data: HeatmapCell[];
  columns?: string[];
  valueLabel?: string;
  valueFormat?: (v: number) => string;
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function SeasonalHeatmap({
  data,
  columns,
  valueLabel,
  valueFormat = (v) => String(v),
}: SeasonalHeatmapProps) {
  const { theme } = useTheme();

  const { rows, cols, maxValue, cellMap } = useMemo(() => {
    const r = [...new Set(data.map((d) => d.row))];
    const c = columns ?? [...new Set(data.map((d) => d.column))];
    const max = Math.max(...data.map((d) => d.value));
    const map = new Map<string, number>();
    data.forEach((d) => map.set(`${d.column}-${d.row}`, d.value));
    return { rows: r, cols: c, maxValue: max, cellMap: map };
  }, [data, columns]);

  const tealColor = useMemo(() => {
    const colors = getChartColors();
    return colors[0]; // teal
  }, [theme]);

  const intensity = (value: number) => {
    const ratio = value / maxValue;
    return Math.max(0.08, ratio);
  };

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[600px]">
        {/* Column headers */}
        <div className="grid" style={{ gridTemplateColumns: `120px repeat(${cols.length}, 1fr)` }}>
          <div />
          {cols.map((c) => (
            <div key={c} className="text-center text-xs text-muted-foreground font-medium py-2">
              {c}
            </div>
          ))}
        </div>

        {/* Rows */}
        {rows.map((row) => (
          <div
            key={row}
            className="grid"
            style={{ gridTemplateColumns: `120px repeat(${cols.length}, 1fr)` }}
          >
            <div className="text-xs text-muted-foreground font-medium flex items-center pr-3 py-1">
              {row}
            </div>
            {cols.map((col) => {
              const val = cellMap.get(`${col}-${row}`) ?? 0;
              return (
                <div
                  key={`${col}-${row}`}
                  className="m-0.5 rounded flex items-center justify-center text-xs font-mono transition-colors"
                  style={{
                    backgroundColor: `color-mix(in oklch, ${tealColor} ${Math.round(intensity(val) * 100)}%, transparent)`,
                    minHeight: "32px",
                  }}
                  title={`${row} / ${col}: ${valueFormat(val)}${valueLabel ? ` ${valueLabel}` : ""}`}
                >
                  <span className={val > maxValue * 0.5 ? "text-white font-medium" : "text-foreground/70"}>
                    {valueFormat(val)}
                  </span>
                </div>
              );
            })}
          </div>
        ))}

        {/* Legend */}
        <div className="flex items-center justify-end gap-2 mt-4">
          <span className="text-xs text-muted-foreground">Low</span>
          <div className="flex gap-0.5">
            {[0.1, 0.3, 0.5, 0.7, 0.9].map((opacity) => (
              <div
                key={opacity}
                className="w-6 h-4 rounded"
                style={{
                  backgroundColor: `color-mix(in oklch, ${tealColor} ${Math.round(opacity * 100)}%, transparent)`,
                }}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">High</span>
        </div>
      </div>
    </div>
  );
}
