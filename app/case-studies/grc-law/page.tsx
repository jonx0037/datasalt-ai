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
import { DemoCallout } from "@/components/case-studies/DemoCallout";

// Charts (client components)
import { SeasonalHeatmap } from "@/components/charts/SeasonalHeatmap";
import { GroupedBarChart } from "@/components/charts/GroupedBarChart";
import { TrendWithOverlays } from "@/components/charts/TrendWithOverlays";

// Pre-processed chart data (imported at build time)
import rawConfusionData from "@/data/case-studies/grc-law/confusion-matrix.json";
import processingTimeData from "@/data/case-studies/grc-law/processing-time.json";
import entityCoverageData from "@/data/case-studies/grc-law/entity-coverage.json";

// Transform confusion matrix JSON into the SeasonalHeatmap format
const predictedColumns = [
  { key: "policeReport", label: "Police Report" },
  { key: "medicalRecord", label: "Medical Record" },
  { key: "billingInvoice", label: "Billing Invoice" },
  { key: "insuranceCorr", label: "Insurance Corr." },
  { key: "legalFiling", label: "Legal Filing" },
  { key: "witnessStmt", label: "Witness Stmt." },
  { key: "correspondence", label: "Correspondence" },
];

const confusionData = rawConfusionData.flatMap(
  (row: Record<string, string | number>) =>
    predictedColumns.map((col) => ({
      column: col.label,
      row: row.actual as string,
      value: (row[col.key] as number) ?? 0,
    }))
);

const meta = getCaseStudyBySlug("grc-law")!;

export const metadata: Metadata = {
  title: "Garza, Robles & Cantu Law — DataSalt Case Study",
  description:
    "How DataSalt built an NLP-powered document triage and case classification system for a high-volume personal injury firm, cutting intake-to-assessment time by 73%.",
};

const tools = [
  {
    name: "Fine-tuned BERT",
    description:
      "multi-class document classifier trained on 2,400 labeled documents — 94.2% accuracy across 7 document types",
  },
  {
    name: "spaCy + Custom NER",
    description:
      "domain-specific named entity recognition for injury types, ICD-10 codes, policy numbers, and liability language",
  },
  {
    name: "AWS Textract",
    description:
      "OCR with layout preservation for scanned police reports and medical records",
  },
  {
    name: "Cross-encoder Reranker",
    description:
      "passage-level relevance scoring to surface the 10-15 most case-critical sentences from full document stacks",
  },
  {
    name: "Bilingual Pipeline",
    description:
      "fastText language detection routing Spanish documents through a parallel spaCy transformer model",
  },
];

const pipelineSteps = [
  { label: "PDF Ingestion", detail: "Textract OCR + direct parse" },
  { label: "Classification", detail: "BERT, 7 doc types" },
  { label: "Entity Extraction", detail: "spaCy custom NER" },
  { label: "Passage Ranking", detail: "Cross-encoder scoring" },
  { label: "Case Summary", detail: "Structured 1-2 page brief" },
];

const impactMetrics = [
  {
    label: "Intake-to-Assessment",
    before: "6-8 hours",
    after: "1.5-2 hours",
    delta: "-73%",
  },
  {
    label: "Classification Accuracy",
    before: "Manual review",
    after: "94.2%",
    delta: "Automated",
  },
  {
    label: "Critical Detail Miss Rate",
    before: "Baseline",
    after: "Reduced",
    delta: "-81%",
  },
  {
    label: "Paralegal Time Freed",
    before: "60% on triage",
    after: "Reallocated",
    delta: "~35 hrs/wk",
  },
];

export default function GRCLawPage() {
  return (
    <div className="min-h-screen bg-background pt-24">
      <CaseStudyHero
        meta={meta}
        heroImage="/images/case-studies/GRC-law.png"
        overlayStrength="dark"
      />

      {/* ── 01 The Challenge ──────────────────────────────────────── */}
      <CaseStudyChallenge>
        <p>
          Garza, Robles &amp; Cantu is a personal injury law firm in McAllen,
          TX, with 4 attorneys and 6 paralegals handling 200+ active cases at
          any given time. Their practice spans auto accidents (65% of
          caseload), slip-and-fall, workplace injuries, and medical
          malpractice. The Rio Grande Valley&apos;s high traffic volume on
          US-83 and I-2 means a steady flow of new cases — 8-12 per week.
        </p>
        <p>
          The bottleneck was document processing. Every new case generates a
          stack of documents: police reports, medical records, insurance
          correspondence, witness statements, and billing records. Paralegals
          were spending 6-8 hours per case just reading, categorizing, and
          summarizing before an attorney could make an initial assessment.
          Document triage consumed nearly 60% of paralegal capacity.
        </p>
        <p>
          The second problem was consistency. Different paralegals flagged
          different things. Critical details — a pre-existing condition buried
          on page 47, a liability-shifting phrase in a police report, or a gap
          in treatment that insurance adjusters exploit — were sometimes missed
          entirely. The firm also needed bilingual capability: approximately 40%
          of their clients are Spanish-speaking.
        </p>

        <DataLandscapeCallout>
          <strong>The data landscape:</strong> 2,400 historically labeled
          documents across 7 types, 800 annotated for custom NER training,
          bilingual document flow (English + Spanish), and integration
          requirements with the firm&apos;s Clio case management system.
        </DataLandscapeCallout>
      </CaseStudyChallenge>

      {/* ── 02 Our Approach ───────────────────────────────────────── */}
      <CaseStudyApproach
        overview="We built a five-stage NLP pipeline: OCR ingestion, document classification, entity extraction, passage ranking, and structured summary generation. The system handles bilingual documents natively and integrates with the firm's existing case management workflow."
        tools={tools}
      >
        <PipelineDiagram steps={pipelineSteps} />
      </CaseStudyApproach>

      {/* ── 03 Key Findings ───────────────────────────────────────── */}
      <CaseStudyFindings>
        <ChartContainer
          title="Document Classification Confusion Matrix"
          caption="Classification performance across 7 document types. High diagonal values indicate strong accuracy. The main confusion corridor is between insurance correspondence and legal filings — they share overlapping legal language and formatting."
        >
          <SeasonalHeatmap
            data={confusionData}
            columns={predictedColumns.map((c) => c.label)}
            valueLabel="accuracy %"
          />
        </ChartContainer>

        <ChartContainer
          title="Processing Time: Manual vs. Automated"
          caption="Hours to complete document triage by case type. Complex cases (catastrophic injury, med-mal) show the largest absolute savings — from 11-14 hours down to 2.5-3 hours. Even simple auto accident cases see a 4x speedup."
        >
          <GroupedBarChart
            data={processingTimeData}
            xKey="caseType"
            bars={[
              { dataKey: "manual", label: "Manual (hrs)" },
              { dataKey: "automated", label: "Automated (hrs)" },
            ]}
            format="hours"
          />
        </ChartContainer>

        <ChartContainer
          title="Entity Extraction Coverage Over Time"
          caption="Percentage of key case entities (dates, injury codes, providers, amounts) successfully extracted. Step improvements at Q2, Q3, and Q4 correspond to quarterly model retraining on paralegal-corrected outputs."
        >
          <TrendWithOverlays
            data={entityCoverageData}
            xKey="label"
            primaryKey="coverage"
            primaryLabel="Entity Coverage"
            format="percent"
            referenceAreas={[
              { x1: "Mar 24", x2: "Apr 24", label: "Q1 Retrain", color: "#10b981" },
              { x1: "Jun 24", x2: "Jul 24", label: "Q2 Retrain", color: "#10b981" },
              { x1: "Sep 24", x2: "Oct 24", label: "Q3 Retrain", color: "#10b981" },
            ]}
          />
        </ChartContainer>
      </CaseStudyFindings>

      {/* ── 04 Business Impact ────────────────────────────────────── */}
      <CaseStudyImpact
        metrics={impactMetrics}
        annualValue="~35 paralegal hours freed per week, reallocated to client communication and case strategy"
      >
        <p>
          The immediate impact was speed: what used to take a paralegal an
          entire morning now takes under two hours, with the system handling
          the reading, classifying, and flagging automatically. The structured
          case summary became the attorneys&apos; preferred starting point for
          initial assessments — several noted that the &quot;red flags&quot;
          section (pre-existing conditions, treatment gaps, inconsistent
          statements) caught details they would have spent hours finding
          manually.
        </p>
        <p>
          The bilingual pipeline was a quiet win. Spanish-language police
          reports and medical records from facilities across the border are now
          processed with the same accuracy as English documents, with entity
          extraction working cross-lingually. The firm estimates this alone
          saved 4-5 hours per week that was previously spent on manual
          translation and cross-referencing.
        </p>
      </CaseStudyImpact>

      {/* ── Live Demo ───────────────────────────────────────────── */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <DemoCallout />
        </div>
      </section>

      {/* ── 05 Technical Details ──────────────────────────────────── */}
      <CaseStudyTechnical>
        <div className="space-y-4 text-sm text-muted-foreground">
          <div>
            <h4 className="font-semibold text-foreground mb-1">
              Document Classifier (BERT)
            </h4>
            <ul className="list-disc list-inside space-y-0.5">
              <li>Base model: bert-base-uncased, fine-tuned on 2,400 labeled documents</li>
              <li>Classes: police report, medical record, billing, insurance corr., legal filing, witness stmt., other</li>
              <li>Evaluation: 94.2% accuracy, macro-F1 = 0.91 (stratified 5-fold CV)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-1">
              Named Entity Recognition (spaCy)
            </h4>
            <ul className="list-disc list-inside space-y-0.5">
              <li>Custom entities: DATE_OF_INCIDENT, INJURY_TYPE (ICD-10), PROVIDER, CARRIER, POLICY_NUM, AMOUNT</li>
              <li>Training: 800 annotated documents, prodigy-assisted labeling</li>
              <li>Bilingual: English (en_core_web_trf) + Spanish (es_dep_news_trf) models</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-1">
              Infrastructure (AWS)
            </h4>
            <ul className="list-disc list-inside space-y-0.5">
              <li>OCR: AWS Textract with layout detection for multi-column medical records</li>
              <li>Hosting: SageMaker endpoint for BERT classifier, Lambda for orchestration</li>
              <li>Integration: Clio case management API for automatic case file attachment</li>
            </ul>
          </div>
        </div>
      </CaseStudyTechnical>

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <CaseStudyCTA meta={meta} />
    </div>
  );
}
