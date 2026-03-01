"use client";

import { useMemo } from "react";
import { useTheme } from "next-themes";
import { getChartColors } from "@/lib/chart-theme";

interface HeatmapCell {
  day: string;
  hour: number;
  value: number;
}

interface DayHourHeatmapProps {
  data: HeatmapCell[];
  valueLabel?: string;
  days?: string[];
  hours?: number[];
}

export function DayHourHeatmap({
  data,
  valueLabel = "patients",
  days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  hours,
}: DayHourHeatmapProps) {
  const { theme } = useTheme();

  const { cols, maxValue, cellMap } = useMemo(() => {
    const h = hours ?? [...new Set(data.map((d) => d.hour))].sort((a, b) => a - b);
    const max = Math.max(...data.map((d) => d.value));
    const map = new Map<string, number>();
    data.forEach((d) => map.set(`${d.day}-${d.hour}`, d.value));
    return { cols: h, maxValue: max, cellMap: map };
  }, [data, hours]);

  const tealColor = useMemo(() => {
    const colors = getChartColors();
    return colors[0];
  }, [theme]);

  const intensity = (value: number) => {
    const ratio = value / maxValue;
    return Math.max(0.08, ratio);
  };

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[600px]">
        {/* Hour headers */}
        <div className="grid" style={{ gridTemplateColumns: `60px repeat(${cols.length}, 1fr)` }}>
          <div />
          {cols.map((h) => (
            <div key={h} className="text-center text-xs text-muted-foreground font-medium py-2">
              {h}:00
            </div>
          ))}
        </div>

        {/* Day rows */}
        {days.map((day) => (
          <div
            key={day}
            className="grid"
            style={{ gridTemplateColumns: `60px repeat(${cols.length}, 1fr)` }}
          >
            <div className="text-xs text-muted-foreground font-medium flex items-center pr-2 py-1">
              {day}
            </div>
            {cols.map((hour) => {
              const val = cellMap.get(`${day}-${hour}`) ?? 0;
              return (
                <div
                  key={`${day}-${hour}`}
                  className="m-0.5 rounded flex items-center justify-center text-xs font-mono transition-colors"
                  style={{
                    backgroundColor: `color-mix(in oklch, ${tealColor} ${Math.round(intensity(val) * 100)}%, transparent)`,
                    minHeight: "28px",
                  }}
                  title={`${day} ${hour}:00 — ${val} ${valueLabel}`}
                >
                  <span className={val > maxValue * 0.5 ? "text-white font-medium" : "text-foreground/70"}>
                    {val}
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
