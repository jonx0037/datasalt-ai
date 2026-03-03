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
import { OverlappingHistogram } from "@/components/charts/OverlappingHistogram";
import { ColoredScatter } from "@/components/charts/ColoredScatter";
import { TrendWithOverlays } from "@/components/charts/TrendWithOverlays";
import { TimeDecayChart } from "@/components/charts/TimeDecayChart";

// Pre-processed chart data (imported at build time)
import daysOnLotData from "@/data/case-studies/valley-auto-exchange/days-on-lot.json";
import rawPricingScatter from "@/data/case-studies/valley-auto-exchange/pricing-scatter.json";
import marginTrendData from "@/data/case-studies/valley-auto-exchange/margin-trend.json";
import timeDecayData from "@/data/case-studies/valley-auto-exchange/time-decay.json";

// Transform scatter data into ColoredScatter format: { x, y, category }
const scatterData = rawPricingScatter.map(
  (d: { recommended: number; actual: number; type: string }) => ({
    x: d.recommended,
    y: d.actual,
    category: d.type,
  })
);

const meta = getCaseStudyBySlug("valley-auto-exchange")!;

export const metadata: Metadata = {
  title: "Valley Auto Exchange — DataSalt Case Study",
  description:
    "How DataSalt built an ML-powered dynamic pricing engine and inventory turn optimizer for a South Texas used-car lot — replacing intuition-based pricing with real-time market intelligence.",
};

const tools = [
  {
    name: "LightGBM Regressor",
    description:
      "dynamic pricing model trained on 1,800 historical transactions — predicts optimal list price with confidence intervals using vehicle attributes, local comps, and seasonal indicators",
  },
  {
    name: "XGBoost Classifier",
    description:
      "acquisition scoring model that predicts whether an auction vehicle will sell within 45 days at 12%+ margin — produces pre-auction buy sheets",
  },
  {
    name: "Selenium + BeautifulSoup",
    description:
      "nightly competitive scraping pipeline across Cars.com, Autotrader, Facebook Marketplace, and Craigslist for the McAllen-Harlingen-Brownsville metro",
  },
  {
    name: "FastAPI + React",
    description:
      "lot-manager dashboard serving per-vehicle price recommendations, age alerts, markdown triggers, and auction buy sheets",
  },
  {
    name: "Time-Decay Optimizer",
    description:
      "automated markdown strategy calibrated per vehicle segment — trucks depreciate more slowly than sedans in this market",
  },
];

const pipelineSteps = [
  { label: "Data Ingestion", detail: "DMS export + nightly scrape" },
  { label: "Feature Engineering", detail: "Comps, seasonality, demand" },
  { label: "Price Prediction", detail: "LightGBM regressor" },
  { label: "Markdown Strategy", detail: "Time-decay optimizer" },
  { label: "Dashboard", detail: "FastAPI → React UI" },
];

const impactMetrics = [
  {
    label: "Avg. Days on Lot",
    before: "58 days",
    after: "36 days",
    delta: "-37%",
  },
  {
    label: "Aged Inventory (90+ days)",
    before: "18% of lot",
    after: "5.2%",
    delta: "-71%",
  },
  {
    label: "Gross Margin per Unit",
    before: "$2,180",
    after: "$3,020",
    delta: "+$840",
  },
  {
    label: "Annual Floorplan Savings",
    before: "Baseline",
    after: "Reduced",
    delta: "~$18,200",
  },
];

export default function ValleyAutoExchangePage() {
  return (
    <div className="min-h-screen bg-background pt-24">
      <CaseStudyHero
        meta={meta}
        heroImage="/images/case-studies/Valley-Auto-Exchange.png"
        overlayStrength="dark"
      />

      {/* ── 01 The Challenge ──────────────────────────────────────── */}
      <CaseStudyChallenge>
        <p>
          Valley Auto Exchange is a used-car dealership in Harlingen, TX that
          typically holds 80-120 vehicles on the lot at any time. The owner and
          lot manager priced vehicles manually using a combination of KBB
          lookups, gut feel, and whatever the last similar car sold for. This
          approach led to two recurring problems.
        </p>
        <p>
          First, mispriced inventory that sat too long. On average, vehicles
          spent 58 days on the lot before selling — well above the industry
          target of 30-45 days for independent dealers. Cars priced too high
          lingered, depreciating daily while consuming floorplan interest. Each
          day a car sits costs roughly $15-25 in carrying costs. At any given
          time, 15-20% of the lot was &quot;aged inventory&quot; — units past 90
          days that would eventually sell at a loss.
        </p>
        <p>
          Second, underpriced vehicles that left money on the table. The dealer
          had no systematic way to identify when a specific vehicle was in high
          demand regionally. A 2019 Toyota Tacoma in good condition commands a
          premium in South Texas due to cross-border demand and ranch/farm use —
          but without market data, the dealer priced it the same as comparable
          sedans. They also lacked acquisition intelligence, buying at Manheim
          and ADESA auctions without a model for which vehicles would yield the
          best margin.
        </p>

        <DataLandscapeCallout>
          <strong>The data landscape:</strong> 3 years of DMS sales data (~1,800
          transactions), nightly competitive listings scraped from 4 platforms
          across the McAllen-Harlingen-Brownsville metro, Manheim Market Report
          wholesale benchmarks, and seasonal/macroeconomic features including tax
          refund season and cross-border peso exchange rate.
        </DataLandscapeCallout>
      </CaseStudyChallenge>

      {/* ── 02 Our Approach ───────────────────────────────────────── */}
      <CaseStudyApproach
        overview="We built a three-model system: a LightGBM pricing model that predicts optimal list price from vehicle attributes and local market conditions, a time-decay optimizer that automates markdown strategy per vehicle segment, and an XGBoost acquisition scorer that produces buy sheets before each auction."
        tools={tools}
      >
        <PipelineDiagram steps={pipelineSteps} />
      </CaseStudyApproach>

      {/* ── 03 Key Findings ───────────────────────────────────────── */}
      <CaseStudyFindings>
        <ChartContainer
          title="Days on Lot Distribution: Before vs. After"
          caption="Distribution of inventory turn times before and after deployment. The 'After' distribution compresses sharply — vehicles now sell within 40 days, with the long tail of 90+ day aged inventory nearly eliminated."
        >
          <OverlappingHistogram
            data={daysOnLotData}
            xKey="bin"
            beforeKey="before"
            afterKey="after"
            beforeLabel="Before (avg 58 days)"
            afterLabel="After (avg 36 days)"
            xLabel="Days on Lot"
            yLabel="Number of Vehicles"
          />
        </ChartContainer>

        <ChartContainer
          title="Pricing Model Accuracy (R² = 0.91)"
          caption="Model-recommended price vs. actual sale price for ~200 recent transactions. Points cluster tightly along the y=x line across all vehicle segments. Trucks (green) are systematically higher-priced — reflecting South Texas cross-border and ranch demand."
        >
          <ColoredScatter
            data={scatterData}
            xLabel="Recommended Price"
            yLabel="Actual Sale Price"
            xFormat="dollar"
            yFormat="dollar"
          />
        </ChartContainer>

        <ChartContainer
          title="Monthly Gross Margin Trend"
          caption="Average gross margin per vehicle over 24 months. First 12 months (pre-deployment) average $2,100-2,300 with high variance. After go-live, margins climb steadily to stabilize around $3,000 — a +$840/unit improvement."
        >
          <TrendWithOverlays
            data={marginTrendData}
            xKey="label"
            primaryKey="margin"
            primaryLabel="Avg Gross Margin"
            format="dollar"
            referenceAreas={[
              {
                x1: "Dec 23",
                x2: "Jan 24",
                label: "System Go-Live",
                color: "#10b981",
              },
            ]}
          />
        </ChartContainer>

        <ChartContainer
          title="Time-Decay Pricing: Example Vehicle"
          caption="Recommended price curve for a 2020 Honda Civic (42k miles) over 90 days on lot. The system applies stepped markdowns at day 21 and day 45, with an overlay of comparable sales average. Trucks follow a slower decay curve in this market."
        >
          <TimeDecayChart
            data={timeDecayData}
            xKey="day"
            priceKey="price"
            compKey="comp"
            priceLabel="Recommended Price"
            compLabel="Comparable Sales Avg"
            triggers={[
              { day: 21, label: "1st Markdown" },
              { day: 45, label: "2nd Markdown" },
              { day: 60, label: "Floor Price" },
            ]}
          />
        </ChartContainer>
      </CaseStudyFindings>

      {/* ── 04 Business Impact ────────────────────────────────────── */}
      <CaseStudyImpact
        metrics={impactMetrics}
        annualValue="~$18,200 in annual floorplan interest savings, plus an estimated $840 additional margin on each of ~400 annual transactions"
      >
        <p>
          The most visible change was inventory velocity. The lot manager no
          longer has vehicles languishing past 90 days — the time-decay system
          automatically flags and recommends markdowns before carrying costs
          erode margin. Aged inventory dropped from 18% to 5.2% of the lot,
          freeing up floorplan capital for faster-turning vehicles.
        </p>
        <p>
          The pricing accuracy gain was equally significant. The scatter plot
          tells the story: the model&apos;s recommended prices track actual sale
          prices with R²&nbsp;=&nbsp;0.91 across all vehicle segments. The
          dealer stopped both leaving money on the table (underpriced trucks) and
          overpricing sedans that would sit for months. The acquisition scoring
          model transformed auction strategy — the dealer now walks in with a
          data-driven buy sheet instead of bidding on instinct.
        </p>
      </CaseStudyImpact>

      {/* ── 05 Technical Details ──────────────────────────────────── */}
      <CaseStudyTechnical>
        <div className="space-y-4 text-sm text-muted-foreground">
          <div>
            <h4 className="font-semibold text-foreground mb-1">
              Dynamic Pricing Model (LightGBM)
            </h4>
            <ul className="list-disc list-inside space-y-0.5">
              <li>Features: year, make, model, trim, mileage, condition, local comp count, median comp price, days-on-market for comps, acquisition cost, seasonal flags</li>
              <li>Target: actual sale price (not list price) to capture real willingness-to-pay</li>
              <li>Performance: R² = 0.91, MAE = $420 on held-out test set</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-1">
              Time-Decay Optimizer
            </h4>
            <ul className="list-disc list-inside space-y-0.5">
              <li>Strategy: initial price (days 1-21), first markdown (day 21-30), aggressive markdown (day 45+), floor price (day 60+)</li>
              <li>Calibrated per segment — trucks decay slower than sedans in South Texas</li>
              <li>Automated weekly repricing suggestions (lot manager approves or overrides)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-1">
              Acquisition Scoring (XGBoost)
            </h4>
            <ul className="list-disc list-inside space-y-0.5">
              <li>Predicts sell-within-45-days at 12%+ margin — binary classifier</li>
              <li>Produces ranked &quot;buy sheet&quot; before each Manheim/ADESA auction</li>
              <li>Inputs: auction price, vehicle attributes, current local demand signals</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-1">
              Infrastructure (AWS)
            </h4>
            <ul className="list-disc list-inside space-y-0.5">
              <li>Scraping: Selenium + BeautifulSoup on Lambda + EventBridge (nightly)</li>
              <li>Backend: FastAPI serving pricing recommendations via REST</li>
              <li>Frontend: React dashboard for lot manager with per-vehicle cards</li>
              <li>Database: PostgreSQL for transaction history and competitive listings</li>
            </ul>
          </div>
        </div>
      </CaseStudyTechnical>

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <CaseStudyCTA meta={meta} />
    </div>
  );
}
