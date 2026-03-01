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
import { ColoredScatter } from "@/components/charts/ColoredScatter";
import { SeasonalHeatmap } from "@/components/charts/SeasonalHeatmap";
import { RadarComparison } from "@/components/charts/RadarComparison";
import { TrendWithOverlays } from "@/components/charts/TrendWithOverlays";

// Pre-processed chart data (imported at build time)
import profitabilityData from "@/data/case-studies/gulf-shrimping-operations/trip-profitability.json";
import catchData from "@/data/case-studies/gulf-shrimping-operations/seasonal-catch.json";
import radarData from "@/data/case-studies/gulf-shrimping-operations/captain-radar.json";
import priceData from "@/data/case-studies/gulf-shrimping-operations/price-forecast.json";

const meta = getCaseStudyBySlug("gulf-shrimping-operations")!;

export const metadata: Metadata = {
  title: "Gulf Shrimping Operations — DataSalt Case Study",
  description:
    "How DataSalt built a fleet optimization and market timing system for a South Texas commercial shrimping operation using XGBoost, trip economics modeling, and price forecasting.",
};

const tools = [
  {
    name: "XGBoost",
    description:
      "gradient-boosted model predicting trip profitability from area, season, fuel cost, and gear type",
  },
  {
    name: "Trip Economics Engine",
    description:
      "cost–revenue simulation modeling catch × price minus fuel, crew, and ice costs per trip",
  },
  {
    name: "Price Forecasting",
    description:
      "14-day wholesale shrimp price forecast using seasonal decomposition and market signals",
  },
  {
    name: "Captain Benchmarking",
    description:
      "multi-metric performance radar comparing CPUE, fuel efficiency, ROI, and consistency across captains",
  },
  {
    name: "Pandas + Recharts",
    description:
      "data pipeline and interactive fleet dashboard for the operations manager",
  },
];

const pipelineSteps = [
  { label: "Trip Logs", detail: "2,200+ trips" },
  { label: "Cost Modeling", detail: "Fuel, crew, ice" },
  { label: "XGBoost Predict", detail: "Trip ROI model" },
  { label: "Price Forecast", detail: "14-day ahead" },
  { label: "Fleet Dashboard", detail: "Daily decisions" },
];

const impactMetrics = [
  {
    label: "Annual Fuel Cost",
    before: "$680K",
    after: "$553K",
    delta: "-$127K",
  },
  {
    label: "Fleet Revenue",
    before: "$1.4M",
    after: "$1.65M",
    delta: "+18%",
  },
  {
    label: "CPUE Spread",
    before: "3.1x",
    after: "1.8x",
    delta: "42% tighter",
  },
];

export default function GulfShrimpingPage() {
  return (
    <div className="min-h-screen bg-background pt-24">
      <CaseStudyHero meta={meta} />

      {/* ── 01 The Challenge ──────────────────────────────────────── */}
      <CaseStudyChallenge>
        <p>
          A five-boat commercial shrimping fleet operating out of Port Isabel
          was running on instinct. Captains chose fishing areas based on habit,
          priced their catch at whatever the dock buyer offered that morning, and
          had no visibility into which trips were actually profitable after
          accounting for fuel, crew, and ice costs.
        </p>
        <p>
          Three problems drove the engagement:
        </p>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>
            <strong>Blind trip economics:</strong> The fleet owner knew total
            revenue and total fuel cost per month, but couldn&apos;t attribute
            profitability to individual trips, areas, or captains. Some trips
            were almost certainly losing money — but which ones?
          </li>
          <li>
            <strong>Fuel waste:</strong> Captains routinely steamed to distant
            grounds (Aransas Pass, 3+ hours each way) without evidence that the
            higher catch justified the $280+ fuel cost. Closer grounds like
            Brownsville Ship Channel were underutilized.
          </li>
          <li>
            <strong>No market timing:</strong> Shrimp prices fluctuate 40%
            seasonally, but the fleet sold everything at the dock the same day.
            No one tracked whether holding catch for 24–48 hours in cold storage
            could capture a price swing.
          </li>
        </ul>

        <DataLandscapeCallout>
          <strong>The data landscape:</strong> 3 years of handwritten trip logs
          digitized into ~2,200 records (vessel, captain, dates, area, fuel
          gallons, catch lbs by species), daily wholesale shrimp prices from
          NOAA, and daily diesel prices from EIA. No existing analytics.
        </DataLandscapeCallout>
      </CaseStudyChallenge>

      {/* ── 02 Our Approach ───────────────────────────────────────── */}
      <CaseStudyApproach
        overview="We built a trip-level economics model that assigns profit/loss to every trip, then layered on an area optimization model and a price forecasting system to answer: where should each boat go tomorrow, and should we sell or hold today's catch?"
        tools={tools}
      >
        <PipelineDiagram steps={pipelineSteps} />
      </CaseStudyApproach>

      {/* ── 03 Key Findings ───────────────────────────────────────── */}
      <CaseStudyFindings>
        <ChartContainer
          title="Trip Profitability by Fishing Area"
          caption="Each dot is one trip. X-axis is fuel cost, Y-axis is revenue. Trips above the diagonal are profitable; below are losses. Laguna Madre and Baffin Bay consistently cluster in the high-revenue zone. Aransas Pass shows high fuel costs with inconsistent returns."
        >
          <ColoredScatter
            data={profitabilityData}
            xLabel="Fuel Cost ($)"
            yLabel="Revenue ($)"
            xFormat="dollar"
            yFormat="dollar"
          />
        </ChartContainer>

        <ChartContainer
          title="Seasonal Catch by Area"
          caption="Monthly catch volume (thousands of lbs) by fishing area. May–July is peak brown shrimp season across all areas. Laguna Madre and Baffin Bay dominate year-round, while Brownsville Ship Channel peaks narrowly in June."
        >
          <SeasonalHeatmap
            data={catchData}
            columns={["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]}
            valueLabel="K lbs"
          />
        </ChartContainer>

        <ChartContainer
          title="Captain Performance Comparison"
          caption="Five-axis radar comparing captains on catch-per-unit-effort (CPUE), fuel efficiency, trip ROI, consistency (low variance), and season coverage. Capt. Martinez leads on CPUE and ROI; Capt. Garcia excels at fuel efficiency."
        >
          <RadarComparison
            data={radarData}
            entities={["Capt. Martinez", "Capt. Nguyen", "Capt. Williams", "Capt. Garcia", "Capt. Johnson"]}
          />
        </ChartContainer>

        <ChartContainer
          title="Shrimp Price Trend & Forecast"
          caption="Monthly wholesale shrimp price ($/lb) with 14-day forecast overlay. Prices peak in winter (low supply) and dip in summer (peak catch). The forecast model enables hold/sell decisions — holding catch during rising price windows captured an additional $42K in the first year."
        >
          <TrendWithOverlays
            data={priceData}
            xKey="date"
            primaryKey="price"
            primaryLabel="Wholesale Price ($/lb)"
            overlayKeys={["forecast"]}
            format="dollar2"
          />
        </ChartContainer>
      </CaseStudyFindings>

      {/* ── 04 Business Impact ────────────────────────────────────── */}
      <CaseStudyImpact
        metrics={impactMetrics}
        annualValue="$127K fuel savings + 18% revenue increase"
      >
        <p>
          The trip economics model revealed that 23% of trips to Aransas Pass
          were net-negative after fuel costs. Redirecting those trips to
          Laguna Madre and Baffin Bay cut annual fuel spend by $127K while
          maintaining catch volume.
        </p>
        <p>
          Captain benchmarking exposed a 2.3x spread in catch-per-unit-effort
          (CPUE) between the best and worst performers. Pairing Capt. Williams
          with Capt. Martinez for three months of mentored trips narrowed the
          fleet CPUE spread from 3.1x to 1.8x.
        </p>
        <p>
          The price forecast model identified 34 hold-worthy windows in the
          first year — periods where holding catch 24–48 hours would capture
          a 5–12% price increase. Implementing a cold-storage hold protocol
          added $42K in incremental revenue.
        </p>
      </CaseStudyImpact>

      {/* ── 05 Technical Details ──────────────────────────────────── */}
      <CaseStudyTechnical>
        <div className="space-y-4 text-sm text-muted-foreground">
          <div>
            <h4 className="font-semibold text-foreground mb-1">
              Trip Economics Model
            </h4>
            <ul className="list-disc list-inside space-y-0.5">
              <li>Granularity: per-trip, per-vessel</li>
              <li>Revenue: catch_lbs × species_price × grade_adjustment</li>
              <li>Costs: fuel (gallons × diesel_price) + crew_share + ice</li>
              <li>ROI = (revenue - total_cost) / total_cost</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-1">
              Area Optimization (XGBoost)
            </h4>
            <ul className="list-disc list-inside space-y-0.5">
              <li>Features: area, month, sea_state, moon_phase, recent_catch</li>
              <li>Target: trip_roi (regression)</li>
              <li>Validation: 5-fold CV, RMSE = 0.18 on normalized ROI</li>
              <li>Feature importance: area &gt; month &gt; recent_catch</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-1">
              Price Forecast
            </h4>
            <ul className="list-disc list-inside space-y-0.5">
              <li>Method: seasonal ARIMA + supply indicators</li>
              <li>Horizon: 14-day rolling forecast</li>
              <li>Accuracy: MAPE = 8.2% on 3-month holdout</li>
              <li>Hold signal: &gt;5% predicted price increase in next 48h</li>
            </ul>
          </div>
        </div>
      </CaseStudyTechnical>

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <CaseStudyCTA meta={meta} />
    </div>
  );
}
