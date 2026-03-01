/**
 * Chart theme utilities for Recharts and Plotly.
 * Reads CSS --chart-N variables at runtime to support dark/light mode.
 */

// Static fallbacks for SSR (server renders before CSS is available)
export const CHART_COLORS_FALLBACK = [
  "#0D9488", // teal (chart-1)
  "#1B2A4A", // navy (chart-2, light)
  "#6B7280", // muted (chart-3, light)
  "#EAB308", // amber (chart-4)
  "#F97316", // orange (chart-5)
];

export function getChartColors(): string[] {
  if (typeof window === "undefined") return CHART_COLORS_FALLBACK;

  const root = getComputedStyle(document.documentElement);
  return [
    root.getPropertyValue("--chart-1").trim() || CHART_COLORS_FALLBACK[0],
    root.getPropertyValue("--chart-2").trim() || CHART_COLORS_FALLBACK[1],
    root.getPropertyValue("--chart-3").trim() || CHART_COLORS_FALLBACK[2],
    root.getPropertyValue("--chart-4").trim() || CHART_COLORS_FALLBACK[3],
    root.getPropertyValue("--chart-5").trim() || CHART_COLORS_FALLBACK[4],
  ];
}

export function getAxisTheme() {
  if (typeof window === "undefined") {
    return {
      stroke: "#6B7280",
      fill: "#6B7280",
      gridStroke: "#E5E7EB",
      fontSize: 12,
    };
  }

  const root = getComputedStyle(document.documentElement);
  const mutedFg =
    root.getPropertyValue("--muted-foreground").trim() || "#6B7280";
  const border = root.getPropertyValue("--border").trim() || "#E5E7EB";

  return {
    stroke: mutedFg,
    fill: mutedFg,
    gridStroke: border,
    fontSize: 12,
  };
}

/** Common Plotly layout overrides for dark theme integration */
export function getPlotlyLayout() {
  if (typeof window === "undefined") {
    return {
      paper_bgcolor: "transparent",
      plot_bgcolor: "transparent",
      font: { color: "#6B7280", family: "Inter, sans-serif", size: 12 },
    };
  }

  const root = getComputedStyle(document.documentElement);
  const fg = root.getPropertyValue("--foreground").trim() || "#1B2A4A";
  const mutedFg =
    root.getPropertyValue("--muted-foreground").trim() || "#6B7280";

  return {
    paper_bgcolor: "transparent",
    plot_bgcolor: "transparent",
    font: { color: mutedFg, family: "Inter, sans-serif", size: 12 },
    title: { font: { color: fg } },
  };
}
