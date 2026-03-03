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
import { GroupedBarChart } from "@/components/charts/GroupedBarChart";
import { OverlappingHistogram } from "@/components/charts/OverlappingHistogram";
import { ForecastLine } from "@/components/charts/ForecastLine";

// Pre-processed chart data (imported at build time)
import rawNeighborhoodData from "@/data/case-studies/rio-grande-builders/neighborhood-demand.json";
import leadScoreData from "@/data/case-studies/rio-grande-builders/lead-score-distribution.json";
import permitForecastData from "@/data/case-studies/rio-grande-builders/permit-forecast.json";

// Sort neighborhoods by demand score descending for the bar chart
const neighborhoodData = [...rawNeighborhoodData]
  .sort((a: { tract: string; score: number }, b: { tract: string; score: number }) => b.score - a.score)
  .map((d: { tract: string; score: number }) => ({
    label: d.tract,
    score: d.score,
  }));

const meta = getCaseStudyBySlug("rio-grande-builders")!;

export const metadata: Metadata = {
  title: "Rio Grande Builders — DataSalt Case Study",
  description:
    "How DataSalt built a neighborhood demand forecasting and lead scoring system for a South Texas home builder using XGBoost, Prophet, and GeoPandas.",
};

const tools = [
  {
    name: "XGBoost Classifier",
    description:
      "gradient-boosted lead scoring model trained on 3 years of CRM data to rank prospects 0-100",
  },
  {
    name: "Prophet + GeoPandas",
    description:
      "time-series permit forecasting with spatial smoothing to capture neighborhood spillover effects",
  },
  {
    name: "Mapbox GL JS",
    description:
      "interactive census tract map colored by demand score for the sales team's weekly planning",
  },
  {
    name: "scipy Optimization",
    description:
      "constrained marketing budget allocation across ZIP codes weighted by demand score and channel ROI",
  },
  {
    name: "HubSpot API",
    description:
      "automated lead score injection into CRM — replaced the shared Excel file with structured pipeline tracking",
  },
];

const pipelineSteps = [
  { label: "County Permit Data", detail: "3 counties, scraped weekly" },
  { label: "Feature Engineering", detail: "Census + MLS + Trends" },
  { label: "Demand Scoring", detail: "Per census tract, 6-12mo" },
  { label: "Lead Model", detail: "XGBoost, 0-100 score" },
  { label: "Dashboard + CRM", detail: "React + HubSpot" },
];

const impactMetrics = [
  {
    label: "Unsold Inventory",
    before: "5.2 units avg",
    after: "2.0 units avg",
    delta: "-62%",
  },
  {
    label: "Lead-to-Close Rate",
    before: "8.1%",
    after: "10.9%",
    delta: "+34%",
  },
  {
    label: "Marketing Cost/Acquisition",
    before: "Baseline",
    after: "Optimized",
    delta: "-28%",
  },
];

export default function RioGrandeBuildersPage() {
  return (
    <div className="min-h-screen bg-background pt-24">
      <CaseStudyHero
        meta={meta}
        heroImage="/images/case-studies/Rio-Grande-Builders.png"
        overlayStrength="dark"
      />

      {/* ── 01 The Challenge ──────────────────────────────────────── */}
      <CaseStudyChallenge>
        <p>
          Rio Grande Builders is a mid-size residential construction company
          operating across Hidalgo, Cameron, and Starr counties. They build
          40-60 homes per year — primarily single-family starter homes and
          mid-range custom builds. Their sales pipeline was entirely
          relationship-driven: the owner and two sales reps relied on word of
          mouth, drive-by lot scouting, and gut instinct to decide where to
          build next.
        </p>
        <p>
          The problems were concrete: they broke ground on a 12-home
          subdivision in a neighborhood where demand had already peaked,
          leaving 4 units unsold for over 9 months. Meanwhile, a competitor
          moved into an adjacent ZIP code that showed clear growth signals
          they had missed. They had no systematic way to identify which
          neighborhoods were heating up, which leads were most likely to
          convert, or how to allocate their limited marketing budget across a
          three-county footprint.
        </p>

        <DataLandscapeCallout>
          <strong>The data landscape:</strong> Sales tracked in a shared Excel
          file, leads arriving through a generic Gmail inbox, and county
          permit data that was never analyzed. Three years of CRM-equivalent
          history, public permit filings from three counties, MLS listing
          data, Census/ACS demographics, and Google Trends search volume —
          all available but never connected.
        </DataLandscapeCallout>
      </CaseStudyChallenge>

      {/* ── 02 Our Approach ───────────────────────────────────────── */}
      <CaseStudyApproach
        overview="We framed this as three interconnected modeling problems: neighborhood demand scoring to identify where to build, lead scoring to identify who to sell to, and budget optimization to allocate marketing spend efficiently. Each model feeds the next, and all surface through a unified dashboard and CRM integration."
        tools={tools}
      >
        <PipelineDiagram steps={pipelineSteps} />
      </CaseStudyApproach>

      {/* ── 03 Key Findings ───────────────────────────────────────── */}
      <CaseStudyFindings>
        <ChartContainer
          title="Neighborhood Demand Ranking"
          caption="Census tracts ranked by 12-month demand score (0-100). Scores combine permit velocity, MLS absorption rate, population growth, and spatial spillover from adjacent tracts. The top 6 tracts account for over 60% of near-term opportunity."
        >
          <GroupedBarChart
            data={neighborhoodData}
            xKey="label"
            bars={[{ dataKey: "score", label: "Demand Score" }]}
          />
        </ChartContainer>

        <ChartContainer
          title="Lead Score Distribution: Before vs. After"
          caption="Before ML scoring, leads were treated nearly equally — a flat distribution with no clear separation. After deployment, the model creates a bimodal split: low-probability leads cluster below 20, while high-value prospects concentrate above 80, letting the sales team focus their time."
        >
          <OverlappingHistogram
            data={leadScoreData}
            beforeKey="before"
            afterKey="after"
            beforeLabel="Before ML Scoring"
            afterLabel="After ML Scoring"
            xLabel="Lead Score Bin"
            yLabel="Number of Leads"
          />
        </ChartContainer>

        <ChartContainer
          title="Permit Volume Forecast"
          caption="36 months of historical county permit filings with a 12-month Prophet forecast and 80% confidence band. The model captures the seasonal spring-summer construction surge and projects continued growth into 2025."
        >
          <ForecastLine
            data={permitForecastData}
            actualKey="actual"
            forecastKey="forecast"
            upperKey="upper"
            lowerKey="lower"
            actualLabel="Actual Permits"
            forecastLabel="Forecast"
            format="number"
            forecastStart="Jan 25"
          />
        </ChartContainer>
      </CaseStudyFindings>

      {/* ── 04 Business Impact ────────────────────────────────────── */}
      <CaseStudyImpact
        metrics={impactMetrics}
        annualValue="62% reduction in unsold inventory within 6 months"
      >
        <p>
          The demand scoring map became the centerpiece of the owner&apos;s
          weekly planning meetings. Instead of debating which neighborhoods
          &quot;felt hot,&quot; the team now reviews tract-level scores
          updated every Monday morning. The first decision it influenced: they
          pivoted a planned 8-unit subdivision from a cooling tract to one
          ranked in the top 5 — all 8 units were under contract within 4
          months.
        </p>
        <p>
          Lead scoring changed how the sales reps spend their mornings. With
          scores auto-populated in HubSpot, they sort by priority and work the
          top 20 first. The +34% lift in lead-to-close rate came not from
          getting better leads, but from spending more time on the right ones.
        </p>
      </CaseStudyImpact>

      {/* ── 05 Technical Details ──────────────────────────────────── */}
      <CaseStudyTechnical>
        <div className="space-y-4 text-sm text-muted-foreground">
          <div>
            <h4 className="font-semibold text-foreground mb-1">
              Lead Scoring Model (XGBoost)
            </h4>
            <ul className="list-disc list-inside space-y-0.5">
              <li>Features: lead_source, time_to_first_contact, tract_demand_score, median_income, referral_flag, season</li>
              <li>Target: binary (converted vs. not), outputs calibrated probability scaled 0-100</li>
              <li>Evaluation: AUC = 0.81, precision@top-20% = 0.67 (5-fold CV)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-1">
              Demand Forecast (Prophet + GeoPandas)
            </h4>
            <ul className="list-disc list-inside space-y-0.5">
              <li>Granularity: monthly permit volume per census tract</li>
              <li>Spatial smoothing: inverse-distance weighting from adjacent tracts</li>
              <li>Accuracy: MAPE = 11% on 12-month holdout across 24 tracts</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-1">
              Marketing Optimization (scipy)
            </h4>
            <ul className="list-disc list-inside space-y-0.5">
              <li>Method: constrained linear programming via scipy.optimize.linprog</li>
              <li>Constraints: total monthly budget cap, minimum spend per active ZIP</li>
              <li>Objective: maximize expected conversions weighted by tract demand score</li>
            </ul>
          </div>
        </div>
      </CaseStudyTechnical>

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <CaseStudyCTA meta={meta} />
    </div>
  );
}
