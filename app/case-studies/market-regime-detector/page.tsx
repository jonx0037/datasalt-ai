import type { Metadata } from "next";
import { getCaseStudyBySlug } from "@/lib/case-studies";
import { CaseStudyHero } from "@/components/case-studies/CaseStudyHero";
import { CaseStudyChallenge } from "@/components/case-studies/CaseStudyChallenge";
import { CaseStudyApproach } from "@/components/case-studies/CaseStudyApproach";
import { CaseStudyImpact } from "@/components/case-studies/CaseStudyImpact";
import { CaseStudyCTA } from "@/components/case-studies/CaseStudyCTA";

const meta = getCaseStudyBySlug("market-regime-detector")!;

export const metadata: Metadata = {
  title: "Market Regime Detector — DataSalt Case Study",
  description:
    "How DataSalt built a cross-asset sentiment-based market regime detection system using FinBERT NLP on financial news, earnings calls, and SEC filings.",
};

const tools = [
  {
    name: "FinBERT (HuggingFace)",
    description: "financial sentiment classification on raw text",
  },
  {
    name: "AWS SageMaker",
    description:
      "model hosting, scheduled batch inference, experiment tracking",
  },
  {
    name: "SEC EDGAR API",
    description: "programmatic access to 10-K/10-Q filings",
  },
  {
    name: "Pandas + NumPy",
    description: "signal aggregation, feature engineering, regime labeling",
  },
  {
    name: "Plotly",
    description: "interactive regime visualization dashboard",
  },
];

export default function MarketRegimeDetectorPage() {
  return (
    <div className="min-h-screen bg-background pt-24">
      <CaseStudyHero
        meta={meta}
        heroImage="/images/case-studies/sentiment-regime-detector-hero-image.png"
        overlayStrength="dark"
      />

      <CaseStudyChallenge>
        <p>
          Market regime — whether we&apos;re in a risk-on, risk-off, or
          transitional environment — is one of the most consequential inputs in
          systematic portfolio management. Traditional regime detection methods
          rely on lagging price-based indicators (moving averages, volatility
          measures) that describe what already happened, not what the market is
          currently feeling.
        </p>
        <p>
          The hypothesis: the language in financial news, earnings calls, and
          regulatory filings contains forward-looking sentiment signals that
          lead price-based indicators. If we can extract and aggregate this
          sentiment across asset classes, we can classify market regimes in
          near real-time.
        </p>
      </CaseStudyChallenge>

      <CaseStudyApproach
        overview="We built a pipeline that ingests financial text from three sources: financial news (Reuters, Bloomberg headlines via API), earnings call transcripts, and SEC 10-K/10-Q filings via the EDGAR API. Text is preprocessed and run through FinBERT — a BERT model fine-tuned on financial text — to produce sentiment scores at the sentence level."
        tools={tools}
      >
        <div className="prose prose-neutral dark:prose-invert max-w-none text-muted-foreground leading-relaxed space-y-4">
          <p>
            Sentence-level scores are aggregated into daily sentiment signals
            per asset class (equities, credit, rates, commodities). These
            signals, combined with traditional volatility and correlation
            features, feed a classification model that assigns the current
            market to one of four regimes: Risk-On, Risk-Off, Recovery, or
            Stress.
          </p>
          <p>
            The system was deployed on AWS SageMaker with a scheduled inference
            pipeline running nightly. A Plotly-based dashboard surfaces the
            current regime classification, historical regime transitions, and
            the top contributing sentiment signals.
          </p>
        </div>
      </CaseStudyApproach>

      <CaseStudyImpact>
        <p>
          The system produces daily regime classifications with interpretable
          signal attribution — traders and portfolio managers can see not just
          the regime label, but which sectors and source documents drove the
          classification. This interpretability is critical in financial
          applications where &quot;black box&quot; outputs are operationally
          unacceptable.
        </p>
        <p>
          Backtested regime signals showed consistent lead time over
          price-based indicators in major market transitions, validating the
          core hypothesis that text sentiment precedes price movement during
          regime shifts.
        </p>
      </CaseStudyImpact>

      <CaseStudyCTA meta={meta} />
    </div>
  );
}
