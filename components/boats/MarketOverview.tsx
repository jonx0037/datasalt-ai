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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getChartColors, getAxisTheme } from "@/lib/chart-theme";
import { SHAPWaterfall } from "@/components/charts/SHAPWaterfall";
import trendsData from "@/data/boats/market-trends.json";

interface SHAPItem {
  feature: string;
  label: string;
  importance: number;
}

interface MarketOverviewProps {
  shapData: {
    feature_importance: SHAPItem[];
    base_value: number;
  };
}

const trends = trendsData as {
  monthly_trends: {
    month: string;
    month_num: number;
    avg_price: number;
    median_price: number;
    count: number;
    avg_days_on_lot: number;
  }[];
  by_boat_type: { boat_type: string; avg_price: number; count: number }[];
  by_condition: { condition: string; avg_price: number; count: number }[];
};

export function MarketOverview({ shapData }: MarketOverviewProps) {
  const { theme } = useTheme();

  const { colors, axis } = useMemo(
    () => ({ colors: getChartColors(), axis: getAxisTheme() }),
    [theme]
  );

  // Map SHAP data to use labels
  const shapDisplay = shapData.feature_importance.map((item) => ({
    feature: item.label,
    importance: item.importance,
  }));

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Monthly Sales Volume */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Monthly Sales Volume</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={trends.monthly_trends}
              margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={axis.gridStroke}
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tick={{ fill: axis.fill, fontSize: 11 }}
                stroke={axis.stroke}
              />
              <YAxis
                tick={{ fill: axis.fill, fontSize: 11 }}
                stroke={axis.stroke}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  borderColor: "var(--border)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="count" name="Sales" radius={[4, 4, 0, 0]}>
                {trends.monthly_trends.map((entry, i) => (
                  <Cell
                    key={entry.month}
                    fill={entry.count > 180 ? colors[0] : colors[2]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Average Price by Boat Type */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Avg Price by Boat Type</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={trends.by_boat_type}
              layout="vertical"
              margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={axis.gridStroke}
                horizontal={false}
              />
              <XAxis
                type="number"
                tick={{ fill: axis.fill, fontSize: 11 }}
                stroke={axis.stroke}
                tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
              />
              <YAxis
                type="category"
                dataKey="boat_type"
                tick={{ fill: axis.fill, fontSize: 11 }}
                stroke={axis.stroke}
                width={100}
              />
              <Tooltip
                formatter={(value: unknown) => [
                  `$${Number(value).toLocaleString()}`,
                  "Avg Price",
                ]}
                contentStyle={{
                  backgroundColor: "var(--card)",
                  borderColor: "var(--border)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="avg_price" name="Avg Price" radius={[0, 4, 4, 0]}>
                {trends.by_boat_type.map((entry, i) => (
                  <Cell key={entry.boat_type} fill={colors[i % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* SHAP Feature Importance */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-base">
            Feature Importance (SHAP Values)
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Mean absolute SHAP values — higher = more impact on predicted price.
            Base value: ${shapData.base_value.toLocaleString()}
          </p>
        </CardHeader>
        <CardContent>
          <SHAPWaterfall data={shapDisplay} format="dollar" />
        </CardContent>
      </Card>
    </div>
  );
}
