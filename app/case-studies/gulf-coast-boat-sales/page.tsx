import type { Metadata } from "next";
import { getCaseStudyBySlug } from "@/lib/case-studies";
import { CaseStudyHero } from "@/components/case-studies/CaseStudyHero";
import { CaseStudyChallenge } from "@/components/case-studies/CaseStudyChallenge";
import { DataLandscapeCallout } from "@/components/case-studies/DataLandscapeCallout";
import { CaseStudyApproach } from "@/components/case-studies/CaseStudyApproach";
import { PipelineDiagram } from "@/components/case-studies/PipelineDiagram";
import { CaseStudyFindings } from "@/components/case-studies/CaseStudyFindings";
import { ChartContainer } from "@/components/case-studies/ChartContainer";
import { CaseStudyImpact } from "@/components/case-studies/CaseStudyImpact";
import { CaseStudyTechnical } from "@/components/case-studies/CaseStudyTechnical";
import { CaseStudyCTA } from "@/components/case-studies/CaseStudyCTA";

// Charts (client components)
import { SeasonalHeatmap } from "@/components/charts/SeasonalHeatmap";
import { SHAPWaterfall } from "@/components/charts/SHAPWaterfall";
import { SurvivalCurves } from "@/components/charts/SurvivalCurves";
import { PricingCalculator } from "@/components/charts/PricingCalculator";

// Pre-processed chart data (imported at build time)
import rawSeasonalData from "@/data/case-studies/gulf-coast-boat-sales/seasonal-heatmap.json";
import shapData from "@/data/case-studies/gulf-coast-boat-sales/shap-waterfall.json";
import rawSurvivalData from "@/data/case-studies/gulf-coast-boat-sales/survival-curves.json";
import pricingData from "@/data/case-studies/gulf-coast-boat-sales/pricing-features.json";

// Map legacy JSON shapes to generalized component interfaces
const seasonalData = rawSeasonalData.map((d: { month: string; boatType: string; sales: number }) => ({
  column: d.month,
  row: d.boatType,
  value: d.sales,
}));

const survivalData = rawSurvivalData.map((d: { day: number; boatType: string; probability: number }) => ({
  x: d.day,
  series: d.boatType,
  y: d.probability,
}));

const meta = getCaseStudyBySlug("gulf-coast-boat-sales")!;

export const metadata: Metadata = {
  title: "Gulf Coast Boat Sales — DataSalt Case Study",
  description:
    "How DataSalt built a pricing intelligence and inventory optimization system for a family-owned marine dealership in South Texas using XGBoost, Prophet, and survival analysis.",
};

const tools = [
  {
    name: "XGBoost + SHAP",
    description:
      "gradient-boosted pricing model with interpretable feature contributions",
  },
  {
    name: "Prophet",
    description:
      "Facebook's time series library for monthly demand forecasting with seasonal decomposition",
  },
  {
    name: "Survival Analysis (Lifelines)",
    description:
      "Kaplan-Meier curves modeling how long each boat type sits before sale",
  },
  {
    name: "K-Means Clustering",
    description:
      "customer segmentation by purchase behavior, geography, and financing preference",
  },
  {
    name: "Pandas + Recharts",
    description:
      "data pipeline and interactive dashboard for the dealership team",
  },
];

const pipelineSteps = [
  { label: "Raw Sales Data", detail: "3,000+ transactions" },
  { label: "Feature Engineering", detail: "20+ derived features" },
  { label: "XGBoost Pricing", detail: "R² = 0.83" },
  { label: "Prophet Forecast", detail: "91% monthly accuracy" },
  { label: "Dashboard", detail: "Real-time pricing tool" },
];

const impactMetrics = [
  {
    label: "Inventory Turnover",
    before: "68 days avg",
    after: "52 days avg",
    delta: "23% faster",
  },
  {
    label: "Avg Margin per Unit",
    before: "$1,900",
    after: "$4,700",
    delta: "+$2,800",
  },
  {
    label: "Dead Inventory (>120 days)",
    before: "18%",
    after: "7%",
    delta: "-61%",
  },
];

export default function GulfCoastBoatSalesPage() {
  return (
    <div className="min-h-screen bg-background pt-24">
      <CaseStudyHero
        meta={meta}
        heroImage="/images/case-studies/gulf-coast-boat-sales-hero.png"
      />

      {/* ── 01 The Challenge ──────────────────────────────────────── */}
      <CaseStudyChallenge>
        <p>
          A family-owned marine dealership on the South Texas Gulf Coast was
          pricing boats the way they always had — gut feel, competitor
          scanning, and a &quot;what the market will bear&quot; approach. The
          owner knew his inventory was sitting too long and margins were
          thinning, but couldn&apos;t pinpoint why.
        </p>
        <p>
          Three specific problems drove the engagement:
        </p>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>
            <strong>Pricing blindness:</strong> No systematic way to set
            asking prices based on actual market drivers — length, engine,
            condition, and model year were weighted by intuition, not data.
          </li>
          <li>
            <strong>Seasonal inventory pileup:</strong> Boats purchased for
            spring selling season sat unsold through summer, tying up capital
            and requiring costly storage.
          </li>
          <li>
            <strong>No markdown timing:</strong> Price reductions were
            reactive (when the owner noticed a boat &quot;had been there a
            while&quot;), not proactive based on aging curves.
          </li>
        </ul>

        <DataLandscapeCallout>
          <strong>The data landscape:</strong> 11 years of point-of-sale
          records (~3,000 transactions), hand-maintained inventory spreadsheets,
          and the owner&apos;s deep domain knowledge of the South Texas marine
          market. No existing analytics infrastructure.
        </DataLandscapeCallout>
      </CaseStudyChallenge>

      {/* ── 02 Our Approach ───────────────────────────────────────── */}
      <CaseStudyApproach
        overview="We approached this as four interconnected modeling problems: pricing optimization, demand forecasting, inventory aging analysis, and customer segmentation. Each model feeds into a unified dashboard the dealership team uses daily."
        tools={tools}
      >
        <PipelineDiagram steps={pipelineSteps} />
      </CaseStudyApproach>

      {/* ── 03 Key Findings ───────────────────────────────────────── */}
      <CaseStudyFindings>
        <ChartContainer
          title="Seasonal Sales Heatmap"
          caption="Monthly sales volume by boat type across all years. Peak demand is Mar–Jun for center consoles and bay boats, with a secondary Oct–Nov bump from tournament season."
        >
          <SeasonalHeatmap
            data={seasonalData}
            columns={["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]}
            valueLabel="sales"
          />
        </ChartContainer>

        <ChartContainer
          title="What Drives Pricing? (SHAP Feature Importance)"
          caption="Mean absolute SHAP values from the XGBoost pricing model. Condition and model year dominate — the owner had been underweighting condition in his mental model."
        >
          <SHAPWaterfall data={shapData} />
        </ChartContainer>

        <ChartContainer
          title="Inventory Survival Curves"
          caption="Kaplan-Meier curves showing the probability a boat is still in inventory after N days. Pontoons and deck boats sell fastest; center consoles have the longest tail."
        >
          <SurvivalCurves data={survivalData} />
        </ChartContainer>

        <ChartContainer
          title="Interactive Pricing Calculator"
          caption="Adjust boat features to see the model's predicted sale price. Based on a linear regression trained on 3,000 historical transactions."
        >
          <PricingCalculator data={pricingData} />
        </ChartContainer>
      </CaseStudyFindings>

      {/* ── 04 Business Impact ────────────────────────────────────── */}
      <CaseStudyImpact
        metrics={impactMetrics}
        annualValue="$67,000 projected annual margin improvement"
      >
        <p>
          The dealership implemented data-driven pricing within the first
          month. The owner reported that the SHAP-based feature breakdown was
          the &quot;aha moment&quot; — seeing that condition grade had 2x the
          pricing impact of engine horsepower changed how he evaluated
          trade-ins and set asking prices.
        </p>
        <p>
          The survival curves gave the team a concrete markdown policy: if a
          center console is still on the lot after 75 days, it&apos;s past the
          median sell-through point and should receive a 5% price reduction.
          Previously, that same boat might have sat 120+ days before anyone
          noticed.
        </p>
      </CaseStudyImpact>

      {/* ── 05 Technical Details ──────────────────────────────────── */}
      <CaseStudyTechnical>
        <div className="space-y-4 text-sm text-muted-foreground">
          <div>
            <h4 className="font-semibold text-foreground mb-1">
              Pricing Model (XGBoost)
            </h4>
            <ul className="list-disc list-inside space-y-0.5">
              <li>Features: length_ft, engine_hp, model_year, days_on_lot, boat_type, condition, trade_in</li>
              <li>Hyperparameters: n_estimators=100, max_depth=4, learning_rate=0.1</li>
              <li>Evaluation: R² = 0.83, MAE = $1,450 (5-fold CV)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-1">
              Demand Forecast (Prophet)
            </h4>
            <ul className="list-disc list-inside space-y-0.5">
              <li>Granularity: monthly, per boat type</li>
              <li>Seasonality: yearly (multiplicative) + custom regressor for local events</li>
              <li>Accuracy: MAPE = 9% on 12-month holdout</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-1">
              Survival Analysis
            </h4>
            <ul className="list-disc list-inside space-y-0.5">
              <li>Library: lifelines KaplanMeierFitter</li>
              <li>Stratified by: boat_type, condition, price_quartile</li>
              <li>Used for: automated markdown trigger points</li>
            </ul>
          </div>
        </div>
      </CaseStudyTechnical>

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <CaseStudyCTA meta={meta} />
    </div>
  );
}
