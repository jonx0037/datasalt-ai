"use client";

import { useState, useMemo } from "react";
import { useTheme } from "next-themes";

interface PricingFeatures {
  coefficients: Record<string, number>;
  r2: number;
  ranges: Record<string, { min: number; max: number; default: number }>;
}

interface PricingCalculatorProps {
  data: PricingFeatures;
}

const LABELS: Record<string, string> = {
  length_ft: "Length (ft)",
  engine_hp: "Engine HP",
  model_year: "Model Year",
  days_on_lot: "Days on Lot",
};

export function PricingCalculator({ data }: PricingCalculatorProps) {
  const { theme } = useTheme();

  const [values, setValues] = useState(() => {
    const init: Record<string, number> = {};
    for (const [key, range] of Object.entries(data.ranges)) {
      init[key] = range.default;
    }
    init.is_new = 0;
    return init;
  });

  const predictedPrice = useMemo(() => {
    const { coefficients } = data;
    let price = coefficients.intercept;
    for (const [key, coef] of Object.entries(coefficients)) {
      if (key === "intercept") continue;
      price += coef * (values[key] ?? 0);
    }
    return Math.max(0, Math.round(price / 100) * 100);
  }, [values, data]);

  const handleSlider = (key: string, val: number) => {
    setValues((prev) => ({ ...prev, [key]: val }));
  };

  return (
    <div className="space-y-6">
      {/* Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Object.entries(data.ranges).map(([key, range]) => (
          <div key={key} className="space-y-1">
            <div className="flex justify-between text-sm">
              <label className="text-muted-foreground">{LABELS[key] ?? key}</label>
              <span className="font-mono font-medium text-foreground">
                {values[key]}
              </span>
            </div>
            <input
              type="range"
              min={range.min}
              max={range.max}
              step={key === "length_ft" ? 0.5 : 1}
              value={values[key]}
              onChange={(e) => handleSlider(key, Number(e.target.value))}
              className="w-full accent-teal"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{range.min}</span>
              <span>{range.max}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Condition toggle */}
      <div className="flex items-center gap-3">
        <label className="text-sm text-muted-foreground">Condition:</label>
        <button
          onClick={() => setValues((prev) => ({ ...prev, is_new: prev.is_new ? 0 : 1 }))}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            values.is_new
              ? "bg-teal text-white"
              : "bg-secondary text-secondary-foreground"
          }`}
        >
          {values.is_new ? "New" : "Used"}
        </button>
      </div>

      {/* Predicted price */}
      <div className="rounded-lg border border-teal/30 bg-teal/5 dark:bg-teal/10 p-6 text-center">
        <p className="text-sm text-muted-foreground mb-1">
          Predicted Sale Price
        </p>
        <p className="text-3xl font-bold text-teal font-mono">
          ${predictedPrice.toLocaleString()}
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Linear model R² = {data.r2} · For illustration only
        </p>
      </div>
    </div>
  );
}
