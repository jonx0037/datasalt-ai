"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { DollarSign, ArrowUpDown, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ComparableSales } from "./ComparableSales";

// ── Constants ────────────────────────────────────────────────
const BOAT_TYPES = ["Center Console", "Bay Boat", "Deck Boat", "Pontoon", "Bowrider"];
const MANUFACTURERS = [
  "Robalo", "Sea Hunt", "Nautic Star", "Tracker", "Bayliner",
  "Boston Whaler", "Grady-White", "Mako", "Chaparral", "Bennington",
];
const CONDITIONS = ["New", "Excellent", "Good", "Fair"];
const HULL_MATERIALS = ["Fiberglass", "Aluminum"];

interface PredictionResult {
  predicted_price: number;
  price_low: number;
  price_high: number;
  confidence: number;
  model_metrics: { r2: number; mae: number };
}

// ── Component ────────────────────────────────────────────────
export function BoatPricingCalculator() {
  // Form state
  const [boatType, setBoatType] = useState("Center Console");
  const [manufacturer, setManufacturer] = useState("Robalo");
  const [modelYear, setModelYear] = useState(2021);
  const [lengthFt, setLengthFt] = useState(22);
  const [engineHp, setEngineHp] = useState(250);
  const [condition, setCondition] = useState("Good");
  const [hullMaterial, setHullMaterial] = useState("Fiberglass");
  const [daysOnLot, setDaysOnLot] = useState(30);

  // Prediction state
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const fetchPrediction = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/boats/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          boat_type: boatType,
          manufacturer,
          model_year: modelYear,
          length_ft: lengthFt,
          beam_ft: Math.round(lengthFt * 0.32 * 10) / 10,
          engine_hp: engineHp,
          hull_material: hullMaterial,
          condition,
          days_on_lot: daysOnLot,
          sale_month: new Date().getMonth() + 1,
        }),
      });
      const data = await res.json();
      setPrediction(data);
    } catch {
      // Silent fail — keep last prediction
    } finally {
      setLoading(false);
    }
  }, [boatType, manufacturer, modelYear, lengthFt, engineHp, condition, hullMaterial, daysOnLot]);

  // Debounced fetch on input change
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(fetchPrediction, 300);
    return () => clearTimeout(debounceRef.current);
  }, [fetchPrediction]);

  const price = prediction?.predicted_price ?? 0;
  const priceLow = prediction?.price_low ?? 0;
  const priceHigh = prediction?.price_high ?? 0;

  return (
    <div className="grid lg:grid-cols-[1fr_380px] gap-6">
      {/* ── Left: Inputs + Price Display ──────────────── */}
      <div className="space-y-6">
        {/* Price display card */}
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-card to-muted/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Estimated Fair Market Value
                </p>
                <div className="flex items-baseline gap-2">
                  <span
                    className={cn(
                      "text-4xl font-bold tracking-tight transition-opacity",
                      loading && "opacity-50"
                    )}
                  >
                    ${price.toLocaleString()}
                  </span>
                  {loading && (
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  )}
                </div>
                {prediction && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Range: ${priceLow.toLocaleString()} – $
                    {priceHigh.toLocaleString()}
                  </p>
                )}
              </div>

              <div className="text-right space-y-1">
                {prediction && (
                  <>
                    <Badge
                      variant={prediction.confidence > 70 ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {prediction.confidence}% match
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      ±${prediction.model_metrics.mae.toLocaleString()} MAE
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Confidence bar */}
            {prediction && (
              <div className="mt-4">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>${priceLow.toLocaleString()}</span>
                  <span>${priceHigh.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, Math.max(10, ((price - priceLow) / (priceHigh - priceLow || 1)) * 100))}%`,
                      marginLeft: "0%",
                    }}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Input controls */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4 text-primary" />
              Boat Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Row 1: Dropdowns */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Boat Type</Label>
                <Select value={boatType} onValueChange={setBoatType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {BOAT_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Manufacturer</Label>
                <Select value={manufacturer} onValueChange={setManufacturer}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MANUFACTURERS.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Condition</Label>
                <Select value={condition} onValueChange={setCondition}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CONDITIONS.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Hull Material</Label>
                <Select value={hullMaterial} onValueChange={setHullMaterial}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {HULL_MATERIALS.map((h) => (
                      <SelectItem key={h} value={h}>
                        {h}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Row 2: Sliders */}
            <div className="space-y-5">
              <SliderField
                label="Model Year"
                value={modelYear}
                min={2010}
                max={2024}
                step={1}
                onChange={setModelYear}
              />
              <SliderField
                label="Length (ft)"
                value={lengthFt}
                min={16}
                max={30}
                step={1}
                onChange={setLengthFt}
                suffix=" ft"
              />
              <SliderField
                label="Engine HP"
                value={engineHp}
                min={75}
                max={450}
                step={25}
                onChange={setEngineHp}
                suffix=" HP"
              />
              <SliderField
                label="Days on Lot"
                value={daysOnLot}
                min={5}
                max={200}
                step={5}
                onChange={setDaysOnLot}
                suffix=" days"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Right: Comparable Sales ───────────────────── */}
      <div>
        <ComparableSales
          query={{
            boat_type: boatType,
            manufacturer,
            model_year: modelYear,
            length_ft: lengthFt,
            engine_hp: engineHp,
            condition,
          }}
        />
      </div>
    </div>
  );
}

// ── Slider sub-component ─────────────────────────────────────
function SliderField({
  label,
  value,
  min,
  max,
  step,
  onChange,
  prefix = "",
  suffix = "",
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm">{label}</Label>
        <span className="text-sm font-medium tabular-nums">
          {prefix}
          {value.toLocaleString()}
          {suffix}
        </span>
      </div>
      <Slider
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        className="cursor-pointer"
      />
    </div>
  );
}
