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
import { DayHourHeatmap } from "@/components/charts/DayHourHeatmap";
import { SHAPWaterfall } from "@/components/charts/SHAPWaterfall";
import { ROCCurve } from "@/components/charts/ROCCurve";
import { RadarComparison } from "@/components/charts/RadarComparison";
import { DualLineComparison } from "@/components/charts/DualLineComparison";

// Pre-processed chart data (imported at build time)
import volumeData from "@/data/case-studies/south-texas-urgent-care/volume-heatmap.json";
import noshowFeatures from "@/data/case-studies/south-texas-urgent-care/noshow-features.json";
import noshowROC from "@/data/case-studies/south-texas-urgent-care/noshow-roc.json";
import clinicRadar from "@/data/case-studies/south-texas-urgent-care/clinic-radar.json";
import staffingData from "@/data/case-studies/south-texas-urgent-care/staffing-optimization.json";

const meta = getCaseStudyBySlug("south-texas-urgent-care")!;

export const metadata: Metadata = {
  title: "South Texas Urgent Care Network — DataSalt Case Study",
  description:
    "How DataSalt built patient volume forecasting, no-show prediction, and staffing optimization for a multi-clinic urgent care network using XGBoost, Prophet, and ROC analysis.",
};

const tools = [
  {
    name: "XGBoost Classifier",
    description:
      "no-show prediction model identifying high-risk appointments for proactive outreach and overbooking",
  },
  {
    name: "Prophet Forecasting",
    description:
      "daily patient volume forecast with Winter Texan seasonality and flu-season regressors",
  },
  {
    name: "Staffing Optimizer",
    description:
      "demand-matched staffing recommendations by hour, shifting providers to match actual patient flow",
  },
  {
    name: "Clinic Benchmarking",
    description:
      "multi-metric comparison across 5 clinics for wait times, satisfaction, and operational efficiency",
  },
  {
    name: "Pandas + Recharts",
    description:
      "data pipeline and interactive operations dashboard for clinic managers",
  },
];

const pipelineSteps = [
  { label: "Visit Records", detail: "120K+ visits" },
  { label: "Volume Forecast", detail: "14-day ahead" },
  { label: "No-Show Model", detail: "AUC = 0.82" },
  { label: "Staff Optimizer", detail: "Hourly scheduling" },
  { label: "Ops Dashboard", detail: "Real-time metrics" },
];

const impactMetrics = [
  {
    label: "Avg Wait Time",
    before: "47 min",
    after: "32 min",
    delta: "-31%",
  },
  {
    label: "Annual Labor Cost",
    before: "$1.28M",
    after: "$1.065M",
    delta: "-$215K",
  },
  {
    label: "No-Show Rate",
    before: "30%",
    after: "19%",
    delta: "-11 pts",
  },
];

export default function SouthTexasUrgentCarePage() {
  return (
    <div className="min-h-screen bg-background pt-24">
      <CaseStudyHero meta={meta} />

      {/* ── 01 The Challenge ──────────────────────────────────────── */}
      <CaseStudyChallenge>
        <p>
          A five-clinic urgent care network across McAllen, Edinburg, Mission,
          Pharr, and Weslaco was struggling with unpredictable patient volumes,
          chronic overstaffing during slow hours, understaffing during surges,
          and a 30% no-show rate that wasted provider time and disrupted
          scheduling.
        </p>
        <p>
          Three problems drove the engagement:
        </p>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>
            <strong>Staffing mismatch:</strong> All five clinics used the same
            flat staffing model — 6 providers from 9am to 5pm — regardless of
            actual demand. Monday mornings routinely hit 30+ patients per hour
            while Saturday afternoons saw 8. Providers were either idle or
            overwhelmed.
          </li>
          <li>
            <strong>No-show waste:</strong> Nearly 1 in 3 scheduled
            appointments resulted in a no-show. The network had no way to
            predict which patients would miss, no overbooking strategy, and no
            outreach system to reduce no-shows.
          </li>
          <li>
            <strong>Winter Texan surge:</strong> Between October and March,
            patient volumes increase 40% as seasonal residents (&quot;Winter
            Texans&quot;) arrive in the Rio Grande Valley. The clinics didn&apos;t
            adjust staffing for this predictable annual pattern.
          </li>
        </ul>

        <DataLandscapeCallout>
          <strong>The data landscape:</strong> 3 years of visit records
          (~120,000 visits across 5 clinics), appointment scheduling data with
          no-show flags, daily staffing logs, patient demographics, and local
          flu surveillance data. The EHR system exported clean CSVs but the
          network had no analytics team.
        </DataLandscapeCallout>
      </CaseStudyChallenge>

      {/* ── 02 Our Approach ───────────────────────────────────────── */}
      <CaseStudyApproach
        overview="We built three interlocking systems: a patient volume forecast that predicts demand 14 days ahead, a no-show classifier that flags high-risk appointments for proactive outreach, and a staffing optimizer that matches provider hours to predicted patient flow."
        tools={tools}
      >
        <PipelineDiagram steps={pipelineSteps} />
      </CaseStudyApproach>

      {/* ── 03 Key Findings ───────────────────────────────────────── */}
      <CaseStudyFindings>
        <ChartContainer
          title="Patient Volume by Day & Hour"
          caption="Average patient volume across all clinics by day-of-week and hour. Monday mornings (8–11am) are consistently the highest volume window. Weekends drop significantly. This pattern drives the staffing optimizer — matching provider count to these demand curves eliminates both wait times and idle hours."
        >
          <DayHourHeatmap data={volumeData} valueLabel="patients" />
        </ChartContainer>

        <ChartContainer
          title="No-Show Prediction — Feature Importance"
          caption="SHAP values showing which features most influence no-show predictions. Prior no-show history is the strongest predictor — patients with 2+ prior no-shows are 3.4x more likely to miss again. Appointment lead time is second: appointments booked 14+ days out have double the no-show rate."
        >
          <SHAPWaterfall data={noshowFeatures} format="decimal" />
        </ChartContainer>

        <ChartContainer
          title="No-Show Classifier — ROC Curve"
          caption="Receiver Operating Characteristic curve for the XGBoost no-show classifier. AUC = 0.82 indicates strong discrimination between show and no-show patients. At the operating threshold (FPR = 0.15), the model catches 65% of no-shows — enough to enable targeted reminder calls and strategic overbooking."
        >
          <ROCCurve data={noshowROC.points} auc={noshowROC.auc} />
        </ChartContainer>

        <ChartContainer
          title="Clinic Performance Comparison"
          caption="Five-axis radar comparing clinics on patient volume, average wait time (inverted — higher is better), satisfaction score, no-show rate (inverted), and Winter Texan patient percentage. Mission and Weslaco handle Winter Texan surges best; McAllen Central has the highest volume but longest waits."
        >
          <RadarComparison
            data={clinicRadar}
            entities={["McAllen Central", "Edinburg", "Mission", "Pharr", "Weslaco"]}
          />
        </ChartContainer>

        <ChartContainer
          title="Staffing Optimization — Current vs Recommended"
          caption="Provider count by hour: current flat staffing (dashed) vs demand-matched recommendation (solid). The optimizer shifts 2 providers to the 8–11am surge window and reduces afternoon/evening coverage. Net result: same total provider-hours, 31% lower wait times."
        >
          <DualLineComparison
            data={staffingData}
            actualKey="current"
            recommendedKey="recommended"
            actualLabel="Current Staffing"
            recommendedLabel="Recommended"
          />
        </ChartContainer>
      </CaseStudyFindings>

      {/* ── 04 Business Impact ────────────────────────────────────── */}
      <CaseStudyImpact
        metrics={impactMetrics}
        annualValue="$215K labor savings + 31% wait time reduction"
      >
        <p>
          The staffing optimizer redistributed the same total provider-hours
          across the day to match actual demand. Monday morning coverage
          increased from 6 to 8 providers; Saturday afternoon coverage dropped
          from 6 to 3. Average wait times fell from 47 to 32 minutes
          network-wide.
        </p>
        <p>
          The no-show model enabled a two-pronged intervention: automated SMS
          reminders 48 hours before flagged appointments, plus strategic
          overbooking of 2 slots per high-risk session. The combined effect
          reduced no-shows from 30% to 19%, recovering ~4,200 appointment slots
          per year.
        </p>
        <p>
          Winter Texan volume forecasting allowed the network to hire 3
          temporary providers each October instead of scrambling in November.
          Advance planning cut temporary staffing costs by 22% while
          maintaining satisfaction scores above 4.2/5.0 during peak season.
        </p>
      </CaseStudyImpact>

      {/* ── 05 Technical Details ──────────────────────────────────── */}
      <CaseStudyTechnical>
        <div className="space-y-4 text-sm text-muted-foreground">
          <div>
            <h4 className="font-semibold text-foreground mb-1">
              Volume Forecast (Prophet)
            </h4>
            <ul className="list-disc list-inside space-y-0.5">
              <li>Granularity: daily, per-clinic</li>
              <li>Regressors: flu_index, temperature, day_of_week, is_holiday</li>
              <li>Seasonality: Winter Texan (Oct–Mar) + flu season (Nov–Feb)</li>
              <li>Accuracy: MAPE = 11.2% on 3-month holdout</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-1">
              No-Show Classifier (XGBoost)
            </h4>
            <ul className="list-disc list-inside space-y-0.5">
              <li>Features: prior_noshows, lead_time, insurance, day, distance, age, time_slot, provider</li>
              <li>Target: no_show (binary classification)</li>
              <li>Performance: AUC = 0.82, precision = 0.71 at recall = 0.65</li>
              <li>Threshold: optimized for actionable outreach capacity (~15% FPR)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-1">
              Staffing Optimizer
            </h4>
            <ul className="list-disc list-inside space-y-0.5">
              <li>Method: constrained optimization (minimize wait time subject to budget)</li>
              <li>Constraint: total provider-hours per week ≤ current budget</li>
              <li>Granularity: hourly staffing levels by day-of-week</li>
              <li>Validation: 4-week A/B test at McAllen Central before network rollout</li>
            </ul>
          </div>
        </div>
      </CaseStudyTechnical>

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <CaseStudyCTA meta={meta} />
    </div>
  );
}
