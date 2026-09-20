import type { Metadata } from "next";
import { getCaseStudyBySlug } from "@/lib/case-studies";
import { CaseStudyHero } from "@/components/case-studies/CaseStudyHero";
import { CaseStudyChallenge } from "@/components/case-studies/CaseStudyChallenge";
import { CaseStudyApproach } from "@/components/case-studies/CaseStudyApproach";
import { PipelineDiagram } from "@/components/case-studies/PipelineDiagram";
import { CaseStudyFindings } from "@/components/case-studies/CaseStudyFindings";
import { CaseStudyImpact } from "@/components/case-studies/CaseStudyImpact";
import { CaseStudyTechnical } from "@/components/case-studies/CaseStudyTechnical";
import { CaseStudyCTA } from "@/components/case-studies/CaseStudyCTA";
import { DemoCallout } from "@/components/case-studies/DemoCallout";

const meta = getCaseStudyBySlug("finrag")!;

export const metadata: Metadata = {
  title: "FinRAG — DataSalt Case Study",
  description:
    "A multimodal retrieval layer for financial documents: filings, transcripts, charts and earnings audio in one shared vector space, with per-result explanations.",
};

const tools = [
  {
    name: "Google Gemini Embedding 2",
    description:
      "one model that embeds text, PDF pages, chart images and audio into a single shared space — no captioning or transcription step in between, which is the usual place multimodal pipelines lose fidelity",
  },
  {
    name: "Qdrant",
    description:
      "vector store holding two named vectors per point — a 3072-dimension full vector and a 768-dimension compact one — with payload filtering by modality",
  },
  {
    name: "PostgreSQL",
    description:
      "document and chunk metadata via async SQLAlchemy and Alembic migrations, kept separate from the vector store so the corpus can be re-indexed without losing provenance",
  },
  {
    name: "Cloudflare R2",
    description:
      "object storage for source documents and extracted assets; nothing is served directly, only through time-limited presigned URLs",
  },
  {
    name: "SHAP",
    description:
      "optional explainability service producing token-level attributions for a result — loaded behind a feature flag because it carries a transformer model and roughly a gigabyte of memory",
  },
  {
    name: "FastAPI + Next.js",
    description:
      "async Python API on Railway, React frontend on Vercel at finrag.io",
  },
];

const pipelineSteps = [
  { label: "Ingest", detail: "PDF, text, image, audio" },
  { label: "Chunk", detail: "512-word window, 128 overlap" },
  { label: "Embed", detail: "one shared vector space" },
  { label: "Index", detail: "Qdrant, dual named vectors" },
  { label: "Search", detail: "per-modality balanced" },
  { label: "Explain", detail: "SHAP attributions" },
];

const impactMetrics = [
  {
    label: "Modalities Searched Together",
    before: "Text only",
    after: "Text, PDF, image, audio",
    delta: "One query",
  },
  {
    label: "Cross-Modal Bridge",
    before: "Caption, then embed",
    after: "Embedded directly",
    delta: "No lossy step",
  },
  {
    label: "Vector Resolution",
    before: "Fixed",
    after: "3072 or 768, per query",
    delta: "Cost lever",
  },
  {
    label: "Why A Result Matched",
    before: "Opaque score",
    after: "Token attributions",
    delta: "Inspectable",
  },
];

export default function FinRAGPage() {
  return (
    <div className="min-h-screen bg-background pt-24">
      <CaseStudyHero meta={meta} />

      {/* ── 01 The Challenge ──────────────────────────────────────── */}
      <CaseStudyChallenge>
        <p>
          FinRAG started from a question that comes up in every financial NLP
          engagement: why do retrieval systems struggle with financial
          documents?
        </p>
        <p>
          Part of the answer is structure. Filings, transcripts and proxy
          statements are among the most information-dense documents in
          existence — dense prose, nested tables, footnotes that override
          headline numbers, and cross-references spanning hundreds of pages.
        </p>
        <p>
          But the harder part is that the evidence is not all text. A number
          lives in a table, the qualification that changes its meaning is said
          aloud on the earnings call, and the trend is only legible in a chart.
          The usual answer is to caption the image, transcribe the audio, and
          embed the resulting text — which means every cross-modal query is
          answered against a lossy paraphrase rather than the thing itself.
        </p>
        <p>
          FinRAG takes the other route: embed each modality directly into one
          shared vector space, so a text query can reach a chart or an audio
          segment without passing through a description of it. It is live at{" "}
          <a
            href="https://finrag.io"
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal hover:underline"
          >
            finrag.io
          </a>
          .
        </p>
        <p>
          <strong>What this system is, precisely.</strong> FinRAG is the{" "}
          <em>retrieval</em> layer of a RAG stack, not the whole stack. It finds
          and ranks evidence and shows why it ranked it; it does not currently
          generate written answers on top. That is a deliberate order of work
          rather than an omission — retrieval is the half that decides whether
          a RAG system can be right at all, and a generation layer built over
          weak retrieval only makes its failures more fluent.
        </p>
      </CaseStudyChallenge>

      {/* ── 02 Our Approach ───────────────────────────────────────── */}
      <CaseStudyApproach
        overview="Ingest four modalities, chunk each by its own natural unit, embed them all with one model into a single vector space, index with two resolutions per point so cost can be traded against quality per query, search with the result budget split across modalities so one loud modality cannot crowd out the rest, and attribute each result back to the tokens that drove it."
        tools={tools}
      >
        <PipelineDiagram steps={pipelineSteps} />
      </CaseStudyApproach>

      {/* ── 03 Design Decisions ───────────────────────────────────── */}
      <CaseStudyFindings>
        <div className="space-y-6 text-muted-foreground">
          <div>
            <h4 className="font-semibold text-foreground mb-1">
              One embedding space, no captioning bridge
            </h4>
            <p>
              Text, PDF pages, chart images and audio are embedded by the same
              model into the same space. The alternative — caption the image,
              transcribe the audio, embed the text — introduces a paraphrase
              between the query and the evidence, and every cross-modal match is
              then only as good as that paraphrase. Removing the bridge is the
              central architectural bet of the system.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-1">
              Two vector resolutions per point
            </h4>
            <p>
              Each point carries both a 3072-dimension vector and a
              768-dimension one, stored as named vectors in the same collection.
              A query picks its resolution: the compact vector for cheap,
              high-volume search, the full vector when quality matters more than
              cost. The same lever would otherwise require a second index.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-1">
              Per-modality balanced search
            </h4>
            <p>
              The result budget is divided across the requested modalities
              rather than allocated by raw score. Without this, whichever
              modality happens to produce higher similarity scores dominates
              every result set, and a multimodal index quietly degrades into a
              single-modality one.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-1">
              Explanations as a first-class surface
            </h4>
            <p>
              A retrieval score is a number with no argument attached. The
              explain service returns token-level SHAP attributions for a
              result, so a user can see which parts of a passage drove the
              match. It sits behind a feature flag because it loads a
              transformer and roughly a gigabyte of memory — worth paying when
              a human is auditing a result, not on every query.
            </p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <h4 className="font-semibold text-foreground mb-1">
              What has not been measured yet
            </h4>
            <p>
              This case study deliberately reports no retrieval precision,
              recall or latency figures. The system has unit and integration
              tests, but no standing retrieval evaluation — no labelled query
              set, no held-out relevance judgements. Publishing benchmark-shaped
              numbers without that harness behind them would be worse than
              publishing none, so a labelled evaluation set and a reproducible
              retrieval benchmark are the next piece of work, and any figures
              will appear here only once they are measured.
            </p>
          </div>
        </div>
      </CaseStudyFindings>

      {/* ── Live Demo ───────────────────────────────────────────── */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <DemoCallout
            title="Try FinRAG Live"
            description="Search a demonstration corpus of financial text, filings, charts and earnings audio — filter by modality and inspect why each result matched."
            href="https://finrag.io"
            buttonText="Launch FinRAG"
          />
        </div>
      </section>

      {/* ── 04 Business Impact ────────────────────────────────────── */}
      <CaseStudyImpact
        metrics={impactMetrics}
        annualValue="A multimodal retrieval layer that searches text, filings, charts and audio together — and shows its reasoning"
      >
        <p>
          The value of FinRAG is what it makes reachable. A question about a
          figure can surface the filing page it sits on, the chart that plots
          it, and the moment on the earnings call where it was qualified — from
          one query, without anyone having decided in advance to transcribe the
          call or caption the chart in a way that happened to preserve the
          relevant detail.
        </p>
        <p>
          It is built as a portfolio system and is deployable against any
          document corpus. It currently indexes a demonstration set spanning the
          four supported modalities. FinRAG pairs with{" "}
          <a
            href="https://market-sentiment.io"
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal hover:underline"
          >
            market-sentiment.io
          </a>{" "}
          to form DataSalt&apos;s financial AI demonstration suite, and the
          mathematics underneath it — retrieval geometry, ranking, fusion and
          evaluation — is written up in depth at{" "}
          <a
            href="https://www.formalrag.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal hover:underline"
          >
            formalrag.com
          </a>
          .
        </p>
      </CaseStudyImpact>

      {/* ── 05 Technical Details ──────────────────────────────────── */}
      <CaseStudyTechnical>
        <div className="space-y-4 text-sm text-muted-foreground">
          <div>
            <h4 className="font-semibold text-foreground mb-1">
              Ingestion &amp; Chunking
            </h4>
            <ul className="list-disc list-inside space-y-0.5">
              <li>PDF handling via pypdf; documents split into page ranges for embedding</li>
              <li>Text: 512-word sliding window with 128-word overlap</li>
              <li>Audio: fixed-length segments with overlap, embedded directly rather than transcribed</li>
              <li>Images: embedded whole, as a single chunk</li>
              <li>Source files and extracted assets stored in Cloudflare R2 (MinIO locally)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-1">
              Embeddings — the multimodal core
            </h4>
            <ul className="list-disc list-inside space-y-0.5">
              <li>Model: <code>gemini-embedding-2-preview</code> via the google-genai SDK</li>
              <li>Modalities: text, PDF, image and audio in one shared space</li>
              <li>Dimensions: 3072 full, 768 compact — both produced per chunk</li>
              <li>Calls wrapped in a thread pool with exponential backoff for rate limits</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-1">
              Retrieval
            </h4>
            <ul className="list-disc list-inside space-y-0.5">
              <li>Vector store: Qdrant, two named vectors per point, selected per request</li>
              <li>Filtering: Qdrant payload conditions on modality and document</li>
              <li>Balancing: the result limit is divided across the requested modalities</li>
              <li>Results carry a time-limited presigned URL rather than a direct object link</li>
              <li>No sparse leg, no fusion and no reranking stage — dense retrieval only</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-1">
              Explainability
            </h4>
            <ul className="list-disc list-inside space-y-0.5">
              <li>Token-level SHAP attributions over a result, surfaced in the UI as a waterfall, a bar chart and inline highlighting</li>
              <li>Ships as an optional dependency group and is gated by an environment flag; the import degrades gracefully when absent</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-1">
              Infrastructure
            </h4>
            <ul className="list-disc list-inside space-y-0.5">
              <li>Backend: FastAPI on Railway, with Alembic migrations run before each deploy and a health-check endpoint</li>
              <li>Frontend: Next.js App Router on Vercel at finrag.io</li>
              <li>Metadata: PostgreSQL via async SQLAlchemy and asyncpg</li>
              <li>Vector store: Qdrant; object storage: Cloudflare R2</li>
              <li>Demonstration audio was generated with Gemini TTS as an ingestion input — the system embeds audio, it does not read answers aloud</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-1">
              Not built (yet)
            </h4>
            <ul className="list-disc list-inside space-y-0.5">
              <li>Answer generation, citation rendering and response streaming — the retrieval layer is complete, the generation layer above it is not</li>
              <li>Sparse retrieval and rank fusion — a single dense leg today</li>
              <li>Cross-encoder reranking over the candidate set</li>
              <li>A labelled retrieval evaluation set and a standing benchmark</li>
            </ul>
          </div>
        </div>
      </CaseStudyTechnical>

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <CaseStudyCTA meta={meta} />
    </div>
  );
}
