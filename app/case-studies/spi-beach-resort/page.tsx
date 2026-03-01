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
import { TrendWithOverlays } from "@/components/charts/TrendWithOverlays";
import { DualLineComparison } from "@/components/charts/DualLineComparison";
import { DecompositionBar } from "@/components/charts/DecompositionBar";

// Pre-processed chart data (imported at build time)
import occupancyData from "@/data/case-studies/spi-beach-resort/occupancy-heatmap.json";
import sentimentData from "@/data/case-studies/spi-beach-resort/sentiment-trend.json";
import pricingData from "@/data/case-studies/spi-beach-resort/pricing-simulation.json";
import revparData from "@/data/case-studies/spi-beach-resort/revpar-decomposition.json";

const meta = getCaseStudyBySlug("spi-beach-resort")!;

export const metadata: Metadata = {
  title: "SPI Beach Resort Analytics — DataSalt Case Study",
  description:
    "How DataSalt built a revenue management and guest intelligence system for a South Padre Island resort using Prophet, BERTopic, and dynamic pricing simulation.",
};

const tools = [
  {
    name: "Prophet",
    description:
      "time-series forecasting with seasonal decomposition for 14-day demand prediction",
  },
  {
    name: "BERTopic",
    description:
      "transformer-based topic modeling to extract complaint drivers from 2,500+ guest reviews",
  },
  {
    name: "Dynamic Pricing Engine",
    description:
      "event-aware pricing simulation comparing actual rates to optimized revenue-maximizing rates",
  },
  {
    name: "RevPAR Decomposition",
    description:
      "breaking revenue-per-available-room into rate and occupancy contributions by month",
  },
  {
    name: "Pandas + Recharts",
    description:
      "data pipeline and interactive revenue dashboard for the management team",
  },
];

const pipelineSteps = [
  { label: "Booking Data", detail: "45K+ reservations" },
  { label: "Review NLP", detail: "2,500 reviews analyzed" },
  { label: "Prophet Forecast", detail: "89% 14-day accuracy" },
  { label: "Pricing Simulation", detail: "Actual vs optimal" },
  { label: "Revenue Dashboard", detail: "Daily KPI tracking" },
];

const impactMetrics = [
  {
    label: "Annual Revenue",
    before: "$4.2M",
    after: "$4.54M",
    delta: "+$340K",
  },
  {
    label: "Spring Break RevPAR",
    before: "$267",
    after: "$312",
    delta: "+17%",
  },
  {
    label: "Off-Season Occupancy",
    before: "58%",
    after: "67%",
    delta: "+9 pts",
  },
];

export default function SPIBeachResortPage() {
  return (
    <div className="min-h-screen bg-background pt-24">
      <CaseStudyHero meta={meta} />

      {/* ── 01 The Challenge ──────────────────────────────────────── */}
      <CaseStudyChallenge>
        <p>
          A mid-size resort on South Padre Island was leaving revenue on the
          table. Room rates were set seasonally — the same price for Spring
          Break week as the quiet week after, the same rate whether a fishing
          tournament was in town or not. Meanwhile, guest satisfaction scores
          were slipping, and the GM couldn&apos;t pinpoint why.
        </p>
        <p>
          Three specific problems drove the engagement:
        </p>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>
            <strong>Static pricing:</strong> Rates changed only 4 times a year
            (spring, summer, fall, winter). High-demand events like Spring
            Break and fishing tournaments were priced the same as adjacent weeks.
          </li>
          <li>
            <strong>Review blindness:</strong> Over 2,500 guest reviews across
            Google, TripAdvisor, and Booking.com — but no systematic way to
            extract actionable themes or track sentiment over time.
          </li>
          <li>
            <strong>No demand forecasting:</strong> Staffing, inventory, and
            rate decisions were made on gut feel. The GM knew &quot;March is
            busy&quot; but couldn&apos;t predict two weeks out with any precision.
          </li>
        </ul>

        <DataLandscapeCallout>
          <strong>The data landscape:</strong> 3 years of property management
          system (PMS) booking data (~45,000 reservations), 2,500+ guest
          reviews scraped from 3 platforms, local event calendars, and daily
          weather data. No existing analytics beyond occupancy reports.
        </DataLandscapeCallout>
      </CaseStudyChallenge>

      {/* ── 02 Our Approach ───────────────────────────────────────── */}
      <CaseStudyApproach
        overview="We built three interconnected intelligence layers: demand forecasting to predict occupancy 14 days out, NLP-driven review analysis to surface guest pain points, and a dynamic pricing simulation showing the revenue gap between actual and optimized rates."
        tools={tools}
      >
        <PipelineDiagram steps={pipelineSteps} />
      </CaseStudyApproach>

      {/* ── 03 Key Findings ───────────────────────────────────────── */}
      <CaseStudyFindings>
        <ChartContainer
          title="Occupancy by Room Type & Month"
          caption="Average occupancy rates across all room categories. March (Spring Break) and July peaks are clear, with Beachfront rooms commanding premium rates but lower fill rates. September is the consistent trough."
        >
          <SeasonalHeatmap
            data={occupancyData}
            columns={["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]}
            valueLabel="%"
          />
        </ChartContainer>

        <ChartContainer
          title="Guest Sentiment Trend"
          caption="Monthly average sentiment score (1–5) with sub-topic breakdown. Overall sentiment improved from 3.8 to 4.1 after the resort addressed the top 3 complaint drivers identified by BERTopic: pool cleanliness, check-in wait times, and AC reliability."
        >
          <TrendWithOverlays
            data={sentimentData}
            xKey="date"
            primaryKey="sentiment"
            primaryLabel="Overall Sentiment"
            overlayKeys={["cleanliness", "service", "amenities"]}
          />
        </ChartContainer>

        <ChartContainer
          title="Actual vs Optimized Pricing"
          caption="Monthly ADR (average daily rate) comparison. The dynamic pricing model recommends higher rates during peak demand events and modest discounts during troughs — a $340K annual revenue opportunity."
        >
          <DualLineComparison
            data={pricingData}
            xKey="label"
            actualKey="actual"
            recommendedKey="recommended"
            actualLabel="Actual ADR"
            recommendedLabel="Optimized ADR"
            format="dollar"
          />
        </ChartContainer>

        <ChartContainer
          title="RevPAR Decomposition"
          caption="Revenue per available room broken into base, rate effect, and occupancy effect. March and July show strong contributions from both rate and occupancy; September's drag comes entirely from low occupancy."
        >
          <DecompositionBar
            data={revparData}
            components={["Base RevPAR", "Rate Effect", "Occupancy Effect"]}
            format="dollar"
          />
        </ChartContainer>
      </CaseStudyFindings>

      {/* ── 04 Business Impact ────────────────────────────────────── */}
      <CaseStudyImpact
        metrics={impactMetrics}
        annualValue="$340K projected annual revenue uplift"
      >
        <p>
          The pricing simulation showed the resort was underpricing Spring Break
          by 17% and overpricing September by 8%. Implementing event-aware
          dynamic pricing in the first quarter captured the majority of the
          identified revenue gap.
        </p>
        <p>
          The NLP review analysis identified three specific complaint drivers
          that were dragging down satisfaction: pool area cleanliness during
          peak weeks, check-in wait times exceeding 20 minutes on Fridays, and
          aging AC units in the Standard rooms. Addressing these moved the
          overall sentiment score from 3.8 to 4.1 within two quarters.
        </p>
      </CaseStudyImpact>

      {/* ── 05 Technical Details ──────────────────────────────────── */}
      <CaseStudyTechnical>
        <div className="space-y-4 text-sm text-muted-foreground">
          <div>
            <h4 className="font-semibold text-foreground mb-1">
              Demand Forecast (Prophet)
            </h4>
            <ul className="list-disc list-inside space-y-0.5">
              <li>Granularity: daily, per room type</li>
              <li>Regressors: local events, weather forecast, day-of-week</li>
              <li>Seasonality: yearly (multiplicative) + weekly</li>
              <li>Accuracy: MAPE = 11% on 14-day rolling holdout</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-1">
              Review Analysis (BERTopic)
            </h4>
            <ul className="list-disc list-inside space-y-0.5">
              <li>Corpus: 2,500 reviews from Google, TripAdvisor, Booking.com</li>
              <li>Embedding: all-MiniLM-L6-v2 sentence transformer</li>
              <li>Topics discovered: 12 (top 3 actionable)</li>
              <li>Sentiment: VADER compound scores per review</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-1">
              Pricing Simulation
            </h4>
            <ul className="list-disc list-inside space-y-0.5">
              <li>Method: constrained optimization on ADR × occupancy</li>
              <li>Constraints: max 25% rate swing vs current, min 40% occupancy floor</li>
              <li>Validation: backtested on 12-month holdout period</li>
            </ul>
          </div>
        </div>
      </CaseStudyTechnical>

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <CaseStudyCTA meta={meta} />
    </div>
  );
}
