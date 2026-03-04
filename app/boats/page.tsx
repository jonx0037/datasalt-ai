import { Suspense } from "react";
import { Ship, TrendingUp, BarChart3, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { BoatPricingCalculator } from "@/components/boats/BoatPricingCalculator";
import { MarketOverview } from "@/components/boats/MarketOverview";

import shapData from "@/data/boats/shap-values.json";
import predictionsData from "@/data/boats/xgb-predictions.json";

const metrics = (predictionsData as { model_metrics: { r2: number; mae: number } }).model_metrics;

const heroStats = [
  {
    label: "Model Accuracy (R²)",
    value: (metrics.r2 * 100).toFixed(1) + "%",
    icon: BarChart3,
  },
  {
    label: "Avg Prediction Error",
    value: "$" + metrics.mae.toLocaleString(),
    icon: TrendingUp,
  },
  {
    label: "Training Samples",
    value: "2,000",
    icon: Search,
  },
];

export default function BoatsPage() {
  return (
    <main className="min-h-screen">
      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="hero-gradient relative overflow-hidden pt-28 pb-20 sm:pt-32 sm:pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Badge
            variant="outline"
            className="mb-4 border-white/30 text-white/80 bg-white/10 backdrop-blur-sm"
          >
            <Ship className="mr-1.5 h-3.5 w-3.5" />
            boats.datasalt.ai
          </Badge>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight max-w-3xl">
            Gulf Coast Boat
            <span className="text-teal-400"> Pricing Calculator</span>
          </h1>

          <p className="mt-4 text-lg text-white/70 max-w-2xl leading-relaxed">
            Predict fair market value for boats on the Texas Gulf Coast.
            Powered by XGBoost trained on 2,000+ synthetic sales records with
            SHAP-based explainability.
          </p>

          {/* Hero stats */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl">
            {heroStats.map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3"
              >
                <stat.icon className="h-5 w-5 text-teal-400 shrink-0" />
                <div>
                  <p className="text-white font-semibold text-lg leading-tight">
                    {stat.value}
                  </p>
                  <p className="text-white/60 text-xs">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing Calculator ────────────────────────────── */}
      <section className="py-16 sm:py-20" id="calculator">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Price Estimator
            </h2>
            <p className="mt-2 text-muted-foreground max-w-xl mx-auto">
              Adjust the inputs below to get an instant XGBoost-powered price
              prediction with confidence intervals and comparable sales.
            </p>
          </div>

          <Suspense
            fallback={
              <Card className="animate-pulse h-[600px]">
                <CardContent className="flex items-center justify-center h-full text-muted-foreground">
                  Loading calculator...
                </CardContent>
              </Card>
            }
          >
            <BoatPricingCalculator />
          </Suspense>
        </div>
      </section>

      {/* ── Market Overview ───────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-muted/50" id="market">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Market Overview
            </h2>
            <p className="mt-2 text-muted-foreground max-w-xl mx-auto">
              Monthly trends, price distributions by boat type, and SHAP
              feature importance from the XGBoost model.
            </p>
          </div>

          <MarketOverview shapData={shapData} />
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────── */}
      <section className="py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-center mb-10">
            How It Works
          </h2>

          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Synthetic Data",
                desc: "2,000 realistic boat sales records generated with domain-informed pricing rules (manufacturer premiums, seasonal effects, condition multipliers).",
              },
              {
                step: "2",
                title: "XGBoost Model",
                desc: `Gradient-boosted trees trained on 10 features achieve R²=${(metrics.r2 * 100).toFixed(1)}% accuracy. Predictions are pre-computed for instant responses.`,
              },
              {
                step: "3",
                title: "SHAP Explainability",
                desc: "TreeSHAP reveals which features drive each prediction — engine HP and condition matter most, while hull material has minimal impact.",
              },
            ].map((item) => (
              <Card key={item.step} className="text-center">
                <CardContent className="pt-6">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold text-lg flex items-center justify-center mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
