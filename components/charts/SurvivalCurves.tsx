"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import { useTheme } from "next-themes";
import { getChartColors, getPlotlyLayout } from "@/lib/chart-theme";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

interface SurvivalPoint {
  x: number;
  series: string;
  y: number;
}

interface SurvivalCurvesProps {
  data: SurvivalPoint[];
  xLabel?: string;
  yLabel?: string;
}

export function SurvivalCurves({
  data,
  xLabel = "Days on Lot",
  yLabel = "P(Still in Inventory)",
}: SurvivalCurvesProps) {
  const { theme } = useTheme();

  const { traces, layout } = useMemo(() => {
    const colors = getChartColors();
    const baseLayout = getPlotlyLayout();
    const seriesNames = [...new Set(data.map((d) => d.series))];

    const plotTraces = seriesNames.map((name, i) => {
      const subset = data
        .filter((d) => d.series === name)
        .sort((a, b) => a.x - b.x);
      return {
        x: subset.map((d) => d.x),
        y: subset.map((d) => d.y),
        name,
        type: "scatter" as const,
        mode: "lines" as const,
        line: {
          shape: "hv" as const,
          width: 2,
          color: colors[i % colors.length],
        },
      };
    });

    const plotLayout = {
      ...baseLayout,
      xaxis: {
        title: { text: xLabel, font: { size: 12 } },
        gridcolor: "var(--border)",
        zerolinecolor: "var(--border)",
      },
      yaxis: {
        title: { text: yLabel, font: { size: 12 } },
        range: [0, 1.02],
        gridcolor: "var(--border)",
        zerolinecolor: "var(--border)",
      },
      legend: {
        orientation: "h" as const,
        y: -0.2,
        x: 0.5,
        xanchor: "center" as const,
      },
      margin: { t: 10, r: 20, b: 60, l: 60 },
      height: 350,
    };

    return { traces: plotTraces, layout: plotLayout };
  }, [data, theme, xLabel, yLabel]);

  return (
    <Plot
      data={traces}
      layout={layout}
      config={{
        displayModeBar: false,
        responsive: true,
      }}
      style={{ width: "100%" }}
    />
  );
}
