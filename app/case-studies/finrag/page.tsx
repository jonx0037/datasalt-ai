import type { Metadata } from "next";
import { getCaseStudyBySlug } from "@/lib/case-studies";
import { CaseStudyHero } from "@/components/case-studies/CaseStudyHero";
import { CaseStudyChallenge } from "@/components/case-studies/CaseStudyChallenge";
import { CaseStudyApproach } from "@/components/case-studies/CaseStudyApproach";
import { PipelineDiagram } from "@/components/case-studies/PipelineDiagram";
import { CaseStudyFindings } from "@/components/case-studies/CaseStudyFindings";
import { ChartContainer } from "@/components/case-studies/ChartContainer";
import { CaseStudyImpact } from "@/components/case-studies/CaseStudyImpact";
import { CaseStudyTechnical } from "@/components/case-studies/CaseStudyTechnical";
import { CaseStudyCTA } from "@/components/case-studies/CaseStudyCTA";
import { DemoCallout } from "@/components/case-studies/DemoCallout";

// Charts (client components)
import { GroupedBarChart } from "@/components/charts/GroupedBarChart";
import { DualLineComparison } from "@/components/charts/DualLineComparison";

// Pre-processed chart data (imported at build time)
import retrievalPrecisionData from "@/data/case-studies/finrag/retrieval-precision.json";
import latencyData from "@/data/case-studies/finrag/latency-by-query.json";
import hybridVsDenseData from "@/data/case-studies/finrag/hybrid-vs-dense.json";

const meta = getCaseStudyBySlug("finrag")!;

export const metadata: Metadata = {
  title: "FinRAG — DataSalt Case Study",
  description:
    "How DataSalt built a multimodal financial document intelligence platform with 91.4% retrieval precision across SEC filings, earnings transcripts, and structured tables.",
};

const tools = [
  {
    name: "Google Gemini Embeddings 2",
    description:
      "native multimodal embedding — text, tables, and chart images in a shared 3072-dim vector space with no intermediate captioning step",
  },
  {
    name: "Google Gemini Flash 2.5 (TTS)",
    description:
      "synthesized audio playback of earnings call summaries and key passages — enabling on-the-go consumption of financial intelligence",
  },
  {
    name: "Qdrant",
    description:
      "vector database with payload filtering by chunk type (text, table, image) and named vector support for hybrid dense + sparse retrieval",
  },
  {
    name: "Cloudflare R2",
    description:
      "object storage for the raw PDF corpus and extracted assets (serialized tables, chart images)",
  },
  {
    name: "Fly.io",
    description:
      "Python API server (FastAPI) hosting the retrieval pipeline, cross-encoder reranker, and streaming generation endpoint",
  },
  {
    name: "Next.js + Vercel",
    description:
      "frontend with Server-Sent Events for streamed responses, audio playback for TTS, and full-text citation rendering",
  },
];

const pipelineSteps = [
  { label: "Document Ingestion", detail: "PDF parse + chunk by type" },
  { label: "Multimodal Embedding", detail: "Gemini Embeddings 2" },
  { label: "Hybrid Indexing", detail: "Qdrant dense + BM25 sparse" },
  { label: "Retrieval + Reranking", detail: "RRF fusion → cross-encoder" },
  { label: "LLM Synthesis", detail: "Cited, grounded answers" },
  { label: "Streaming Response", detail: "SSE + TTS audio" },
];

const impactMetrics = [
  {
    label: "Query-to-Answer Time",
    before: "Manual: 15–30 min",
    after: "<2 seconds",
    delta: "~99% faster",
  },
  {
    label: "Table Data Accessibility",
    before: "Not retrieved",
    after: "Serialized + embedded",
    delta: "Full coverage",
  },
  {
    label: "Answer Grounding",
    before: "None",
    after: "Page-level citations",
    delta: "100% of responses",
  },
  {
    label: "Doc Types Handled",
    before: "Text only",
    after: "Text + tables + charts",
    delta: "Multimodal",
  },
  {
    label: "Earnings Call Access",
    before: "Read-only transcript",
    after: "Synthesized audio",
    delta: "TTS playback",
  },
];

export default function FinRAGPage() {
  return (
    <div className="min-h-screen bg-background pt-24">
      <CaseStudyHero meta={meta} />

      {/* ── 01 The Challenge ──────────────────────────────────────── */}
      <CaseStudyChallenge>
        <p>
          FinRAG was born from a question DataSalt kept running into across
          financial NLP engagements: why do RAG systems struggle with financial
          documents?
        </p>
        <p>
          The answer is structure. Financial filings — 10-Ks, 10-Qs, earnings
          call transcripts, proxy statements — are among the most
          information-dense documents in existence. They contain dense prose,
          nested tables, footnotes that override headline numbers, embedded
          charts, and cross-references that span hundreds of pages. A standard
          text-chunking RAG pipeline treats all of this as undifferentiated text
          and performs poorly on exactly the queries that matter most:
          &quot;What was the effective tax rate excluding one-time items?&quot;,
          &quot;How did segment margins change year-over-year?&quot;, &quot;What
          did management say about guidance on the Q3 call?&quot;
        </p>
        <p>
          The second problem is multimodality. Critical data in financial
          documents lives in tables and charts — not prose. Standard embedding
          pipelines that chunk raw text miss or corrupt tabular data entirely. A
          system that can&apos;t read a table can&apos;t answer a financial
          question reliably.
        </p>
        <p>
          We built FinRAG to close that gap: a RAG architecture purpose-built
          for financial documents, with table-aware parsing, structure-preserving
          chunking, and a hybrid retrieval strategy that handles both semantic
          and structured queries. The system is live at{" "}
          <a
            href="https://finrag.io"
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal hover:underline"
          >
            finrag.io
          </a>{" "}
          and serves as a companion to the{" "}
          <a
            href="https://market-sentiment.io"
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal hover:underline"
          >
            market-sentiment.io
          </a>{" "}
          dashboard — together forming DataSalt&apos;s financial AI
          demonstration suite.
        </p>
      </CaseStudyChallenge>

      {/* ── 02 Our Approach ───────────────────────────────────────── */}
      <CaseStudyApproach
        overview="We built a six-stage pipeline: multimodal document ingestion, structure-aware embedding via Google Gemini, hybrid dense + sparse indexing in Qdrant, reciprocal rank fusion with cross-encoder reranking, LLM synthesis with page-level citations, and streamed responses with TTS audio for earnings calls."
        tools={tools}
      >
        <PipelineDiagram steps={pipelineSteps} />
      </CaseStudyApproach>

      {/* ── 03 Key Findings ───────────────────────────────────────── */}
      <CaseStudyFindings>
        <ChartContainer
          title="Retrieval Precision by Document Type"
          caption="Top-3 chunk retrieval precision across five document types. Table chunks slightly underperform prose chunks due to serialization edge cases in heavily merged-cell tables — a known area for improvement."
        >
          <GroupedBarChart
            data={retrievalPrecisionData}
            xKey="docType"
            bars={[{ dataKey: "precision", label: "Top-3 Precision (%)" }]}
            format="percent"
          />
        </ChartContainer>

        <ChartContainer
          title="Latency by Query Type"
          caption="Retrieval and generation time by query complexity. Multi-hop and comparative queries require more retrieved chunks and longer generation context, driving higher latency — both remain within acceptable interactive UX bounds."
        >
          <GroupedBarChart
            data={latencyData}
            xKey="queryType"
            bars={[
              { dataKey: "retrieval", label: "Retrieval (s)" },
              { dataKey: "generation", label: "Generation (s)" },
            ]}
            format="number"
          />
        </ChartContainer>

        <ChartContainer
          title="Hybrid vs. Dense-Only Retrieval Recall"
          caption="Recall across a 100-query evaluation set. BM25 provides the largest gains on queries containing exact financial terminology (EBITDA, segment names, specific fiscal quarters) where dense embeddings under-represent surface-form specificity."
        >
          <DualLineComparison
            data={hybridVsDenseData}
            xKey="query"
            actualKey="denseOnly"
            recommendedKey="hybrid"
            actualLabel="Dense Only"
            recommendedLabel="Hybrid (Dense + BM25)"
            format="percent"
          />
        </ChartContainer>
      </CaseStudyFindings>

      {/* ── Live Demo ───────────────────────────────────────────── */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <DemoCallout
            title="Try FinRAG Live"
            description="Query a curated corpus of SEC filings and earnings transcripts — with table-aware retrieval and cited answers."
            href="https://finrag.io"
            buttonText="Launch FinRAG"
          />
        </div>
      </section>

      {/* ── 04 Business Impact ────────────────────────────────────── */}
      <CaseStudyImpact
        metrics={impactMetrics}
        annualValue="Purpose-built financial RAG with multimodal retrieval, page-level citations, and earnings call TTS"
      >
        <p>
          FinRAG demonstrates what a purpose-built financial RAG system looks
          like when document structure is treated as a first-class concern — not
          an afterthought. The hybrid retrieval strategy outperforms dense-only
          retrieval by 4–8 percentage points on financial-specific queries.
          Table serialization enables a class of queries that standard chunking
          pipelines cannot answer. And citation-first generation makes every
          response auditable — a non-negotiable requirement in financial
          workflows where hallucination poses real risk.
        </p>
        <p>
          As a DataSalt portfolio project, FinRAG is designed to be deployed
          against any corpus of financial documents. It currently indexes a
          demonstration set of public SEC filings (10-K and 10-Q) for three
          S&amp;P 500 companies, with earnings call transcripts for the same
          period. FinRAG pairs with{" "}
          <a
            href="https://market-sentiment.io"
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal hover:underline"
          >
            market-sentiment.io
          </a>{" "}
          — DataSalt&apos;s live sentiment regime detection dashboard — to form
          a complete financial AI demonstration suite.
        </p>
      </CaseStudyImpact>

      {/* ── 05 Technical Details ──────────────────────────────────── */}
      <CaseStudyTechnical>
        <div className="space-y-4 text-sm text-muted-foreground">
          <div>
            <h4 className="font-semibold text-foreground mb-1">
              Document Parsing &amp; Ingestion
            </h4>
            <ul className="list-disc list-inside space-y-0.5">
              <li>PDF extraction: pdfplumber for structured layout detection; PyMuPDF as fallback</li>
              <li>Table parsing: pdfplumber table extraction → markdown serialization with column headers preserved</li>
              <li>Chart/figure handling: extracted as images and passed directly to the Gemini embedding model — no intermediate captioning step</li>
              <li>Document storage: raw PDFs and extracted assets stored in Cloudflare R2</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-1">
              Embeddings — The Multimodal Core
            </h4>
            <ul className="list-disc list-inside space-y-0.5">
              <li>Model: Google Gemini Embeddings 2 preview (gemini-embedding-exp-03-07)</li>
              <li>Modalities: text prose, serialized table markdown, and chart/figure images in a unified vector space</li>
              <li>Dimension: 3072 — single model handles all content types without modality-specific pipelines</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-1">
              Retrieval Architecture
            </h4>
            <ul className="list-disc list-inside space-y-0.5">
              <li>Vector store: Qdrant with payload filtering by chunk type (text / table / image)</li>
              <li>Sparse: BM25 via rank-bm25, indexed on tokenized financial corpus</li>
              <li>Fusion: Reciprocal Rank Fusion (k=60) across dense and sparse ranked lists</li>
              <li>Reranker: cross-encoder/ms-marco-MiniLM-L-6-v2 for top-20 → top-5 selection</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-1">
              LLM &amp; Generation
            </h4>
            <ul className="list-disc list-inside space-y-0.5">
              <li>Model: Claude Sonnet 4.5 via Anthropic API</li>
              <li>Context: top-5 reranked chunks (~3,000 tokens) + system prompt</li>
              <li>Output: answer + cited sources (document name, chunk ID, page number)</li>
              <li>Streaming: Anthropic streaming API → Next.js Server-Sent Events</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-1">
              Text-to-Speech (Earnings Calls)
            </h4>
            <ul className="list-disc list-inside space-y-0.5">
              <li>Model: Google Gemini Flash 2.5 TTS</li>
              <li>Synthesized audio playback of RAG-generated summaries and key earnings call passages</li>
              <li>Generated server-side via Gemini API, streamed to client as audio</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-1">
              Infrastructure
            </h4>
            <ul className="list-disc list-inside space-y-0.5">
              <li>Backend: FastAPI (Python), deployed on Fly.io</li>
              <li>Frontend: Next.js 14 App Router, deployed on Vercel at finrag.io</li>
              <li>Vector DB: Qdrant</li>
              <li>Object storage: Cloudflare R2 (PDF corpus and extracted assets)</li>
              <li>Ingestion: offline batch pipeline (Python), triggered on corpus updates</li>
            </ul>
          </div>
        </div>
      </CaseStudyTechnical>

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <CaseStudyCTA meta={meta} />
    </div>
  );
}
