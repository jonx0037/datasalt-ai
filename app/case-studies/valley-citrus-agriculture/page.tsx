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
import { SurvivalCurves } from "@/components/charts/SurvivalCurves";
import { RadarComparison } from "@/components/charts/RadarComparison";

// Pre-processed chart data (imported at build time)
import yieldWeatherData from "@/data/case-studies/valley-citrus-agriculture/yield-weather.json";
import irrigationData from "@/data/case-studies/valley-citrus-agriculture/irrigation-frontier.json";
import freezeRiskData from "@/data/case-studies/valley-citrus-agriculture/freeze-risk.json";
import growerRadarData from "@/data/case-studies/valley-citrus-agriculture/grower-radar.json";

const meta = getCaseStudyBySlug("valley-citrus-agriculture")!;

export const metadata: Metadata = {
  title: "Valley Citrus & Agriculture — DataSalt Case Study",
  description:
    "How DataSalt built yield forecasting, freeze risk analytics, and irrigation optimization for Rio Grande Valley citrus growers using Random Forest, SHAP, and survival analysis.",
};

const tools = [
  {
    name: "Random Forest + SHAP",
    description:
      "yield prediction model with explainable feature importance showing which factors drive harvest outcomes",
  },
  {
    name: "Survival Analysis",
    description:
      "freeze risk probability curves modeling the likelihood and severity of frost events across the winter season",
  },
  {
    name: "Irrigation Optimization",
    description:
      "efficiency frontier analysis identifying growers who achieve high yields with less water",
  },
  {
    name: "Grower Benchmarking",
    description:
      "multi-dimensional performance comparison across yield, water use, grade quality, and cost metrics",
  },
  {
    name: "Prophet + Pandas",
    description:
      "seasonal yield forecasting pipeline and co-op planning dashboard",
  },
];

const pipelineSteps = [
  { label: "Yield Records", detail: "1,440+ observations" },
  { label: "Weather Data", detail: "3,650 daily records" },
  { label: "RF Yield Model", detail: "R² = 0.87" },
  { label: "Freeze Risk", detail: "11-day advance warning" },
  { label: "Co-op Dashboard", detail: "Grower planning tool" },
];

const impactMetrics = [
  {
    label: "Annual Yield Value",
    before: "$6.8M",
    after: "$7.69M",
    delta: "+$890K",
  },
  {
    label: "Water Usage",
    before: "42 in/acre",
    after: "24 in/acre",
    delta: "-42%",
  },
  {
    label: "Freeze Warning Lead",
    before: "2 days",
    after: "11 days",
    delta: "+9 days",
  },
];

export default function ValleyCitrusPage() {
  return (
    <div className="min-h-screen bg-background pt-24">
      <CaseStudyHero
        meta={meta}
        heroImage="/images/case-studies/citrus-orchard-hero.png"
        overlayStrength="dark"
      />

      {/* ── 01 The Challenge ──────────────────────────────────────── */}
      <CaseStudyChallenge>
        <p>
          A cooperative of five citrus growers in the Rio Grande Valley was
          losing crops and money to unpredictable freezes and inefficient water
          use. The 2021 Winter Storm Uri wiped out 60% of the harvest, and two
          years later, another late freeze caught growers off-guard again.
        </p>
        <p>
          Three problems drove the engagement:
        </p>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>
            <strong>No freeze early warning:</strong> Growers relied on NWS
            freeze warnings, which arrive 24–48 hours before the event — not
            enough time to deploy smudge pots, run wind machines, or apply
            micro-sprinkler frost protection across hundreds of acres.
          </li>
          <li>
            <strong>Water waste:</strong> Irrigation schedules varied 2x across
            growers, with some applying 42+ acre-inches per season when 24 was
            sufficient. No one knew what &quot;optimal&quot; looked like for
            their soil and microclimate.
          </li>
          <li>
            <strong>Yield blindness:</strong> The co-op tracked total harvest
            tonnage but couldn&apos;t attribute yield differences to weather,
            irrigation, variety, or grower practices. Good years were luck; bad
            years were weather — no one questioned the assumption.
          </li>
        </ul>

        <DataLandscapeCallout>
          <strong>The data landscape:</strong> 5 years of yield records (~1,440
          observations across growers, crops, and seasons), 3,650 daily weather
          records from 3 NOAA stations, county-level irrigation metering data,
          and weekly citrus market prices. The co-op had Excel spreadsheets but
          no analytical capability.
        </DataLandscapeCallout>
      </CaseStudyChallenge>

      {/* ── 02 Our Approach ───────────────────────────────────────── */}
      <CaseStudyApproach
        overview="We built three interlocking analytics: a yield prediction model that explains which factors drive harvest outcomes, a freeze risk system that extends warning time from 2 to 11 days, and an irrigation optimization framework that benchmarks water efficiency across growers."
        tools={tools}
      >
        <PipelineDiagram steps={pipelineSteps} />
      </CaseStudyApproach>

      {/* ── 03 Key Findings ───────────────────────────────────────── */}
      <CaseStudyFindings>
        <ChartContainer
          title="Yield vs Minimum Temperature"
          caption="Each dot is a crop observation during harvest/freeze season (Nov–Mar). Below 0°C, yields collapse — grapefruit and oranges are most vulnerable. The data clearly shows 3°C as the 'stress threshold' where yields begin declining even without a hard freeze."
        >
          <ColoredScatter
            data={yieldWeatherData}
            xLabel="Min Temperature (°C)"
            yLabel="Yield (boxes/acre)"
          />
        </ChartContainer>

        <ChartContainer
          title="Irrigation Efficiency Frontier"
          caption="Water usage vs yield by grower. Ramirez Family achieves the highest yields per acre-inch of water — sitting on the efficiency frontier. Rio Citrus Co-op uses the most water per unit yield, indicating significant optimization opportunity."
        >
          <ColoredScatter
            data={irrigationData}
            xLabel="Water Usage (acre-in)"
            yLabel="Yield (boxes/acre)"
          />
        </ChartContainer>

        <ChartContainer
          title="Freeze Risk Probability Curves"
          caption="Probability of freeze events by date (Day 1 = Nov 1). Three severity levels shown: light freeze (<0°C), hard freeze (<-3°C), and severe freeze (<-6°C). Peak risk window is mid-December through late January — the 11-day forecast model enables proactive frost protection deployment."
        >
          <SurvivalCurves
            data={freezeRiskData}
            xLabel="Days from Nov 1"
            yLabel="P(Freeze Event)"
          />
        </ChartContainer>

        <ChartContainer
          title="Grower Performance Comparison"
          caption="Five-axis radar comparing growers on yield per acre, water efficiency, Grade A percentage, cost per ton (inverted — higher is better), and harvest timing optimization. Ramirez Family leads overall; Rio Citrus Co-op has the biggest improvement opportunity in water efficiency."
        >
          <RadarComparison
            data={growerRadarData}
            entities={["Ramirez Family", "Delta Groves", "Rio Citrus Co-op", "Mission Ag", "Valley Fresh"]}
          />
        </ChartContainer>
      </CaseStudyFindings>

      {/* ── 04 Business Impact ────────────────────────────────────── */}
      <CaseStudyImpact
        metrics={impactMetrics}
        annualValue="$890K yield improvement across the cooperative"
      >
        <p>
          The yield model identified minimum temperature, irrigation timing, and
          soil moisture as the three strongest predictors — together explaining
          72% of yield variance. Growers who followed the model&apos;s
          irrigation recommendations saw a 15% average yield increase in the
          first season.
        </p>
        <p>
          The freeze risk model correctly predicted the February 2024 cold snap
          11 days in advance, giving growers time to deploy frost protection on
          340 acres of high-value grapefruit. Estimated loss prevention: $420K
          in a single event.
        </p>
        <p>
          Water efficiency benchmarking showed that adopting Ramirez Family&apos;s
          micro-drip practices could cut co-op water usage by 42% without yield
          loss — saving an estimated $180K in annual water costs and improving
          sustainability compliance.
        </p>
      </CaseStudyImpact>

      {/* ── 05 Technical Details ──────────────────────────────────── */}
      <CaseStudyTechnical>
        <div className="space-y-4 text-sm text-muted-foreground">
          <div>
            <h4 className="font-semibold text-foreground mb-1">
              Yield Model (Random Forest)
            </h4>
            <ul className="list-disc list-inside space-y-0.5">
              <li>Features: min_temp, max_temp, precip, irrigation, soil_moisture, GDD, variety</li>
              <li>Target: yield_boxes_per_acre (regression)</li>
              <li>Performance: R² = 0.87, RMSE = 28 boxes/acre on holdout</li>
              <li>Explainability: SHAP values for per-prediction feature attribution</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-1">
              Freeze Risk (Survival Analysis)
            </h4>
            <ul className="list-disc list-inside space-y-0.5">
              <li>Method: Cox proportional hazards with time-varying weather covariates</li>
              <li>Horizon: 11-day rolling probability forecast</li>
              <li>Calibration: Brier score = 0.08 on 3-year holdout</li>
              <li>Alert thresholds: &gt;30% hard freeze probability triggers grower notification</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-1">
              Irrigation Optimization
            </h4>
            <ul className="list-disc list-inside space-y-0.5">
              <li>Method: efficiency frontier analysis (DEA-inspired)</li>
              <li>Inputs: water_acre_inches, labor_hours, fertilizer_cost</li>
              <li>Output: yield_boxes, grade_a_percentage</li>
              <li>Benchmark: top-quartile grower practices as target efficiency</li>
            </ul>
          </div>
        </div>
      </CaseStudyTechnical>

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <CaseStudyCTA meta={meta} />
    </div>
  );
}
