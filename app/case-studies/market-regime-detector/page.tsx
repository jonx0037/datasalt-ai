import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Market Regime Detector — DataSalt Case Study",
  description:
    "How DataSalt built a cross-asset sentiment-based market regime detection system using FinBERT NLP on financial news, earnings calls, and SEC filings.",
};

const stack = [
  "Python", "FinBERT", "HuggingFace Transformers", "AWS SageMaker",
  "Pandas", "NumPy", "Plotly", "SEC EDGAR API", "yfinance"
];

export default function MarketRegimeDetectorPage() {
  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Back nav */}
        <Link
          href="/case-studies"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All Case Studies
        </Link>

        {/* Header */}
        <Badge variant="secondary" className="mb-4">Financial NLP</Badge>
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
          Market Regime Detector
        </h1>
        <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
          Cross-Asset Sentiment-Based Market Regime Classification
        </p>

        {/* Stack */}
        <div className="flex flex-wrap gap-1.5 mb-12">
          {stack.map((tech) => (
            <span
              key={tech}
              className="px-2.5 py-1 rounded-md bg-teal/10 text-teal text-xs font-mono font-medium border border-teal/20"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-10">
          {/* The Problem */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
              <span className="text-teal font-mono text-base">01</span> The Problem
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Market regime — whether we&apos;re in a risk-on, risk-off, or transitional environment —
              is one of the most consequential inputs in systematic portfolio management. Traditional
              regime detection methods rely on lagging price-based indicators (moving averages,
              volatility measures) that describe what already happened, not what the market is
              currently feeling.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              The hypothesis: the language in financial news, earnings calls, and regulatory filings
              contains forward-looking sentiment signals that lead price-based indicators. If we can
              extract and aggregate this sentiment across asset classes, we can classify market regimes
              in near real-time.
            </p>
          </section>

          {/* The Approach */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
              <span className="text-teal font-mono text-base">02</span> The Approach
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We built a pipeline that ingests financial text from three sources: financial news
              (Reuters, Bloomberg headlines via API), earnings call transcripts, and SEC 10-K/10-Q
              filings via the EDGAR API. Text is preprocessed and run through FinBERT — a BERT model
              fine-tuned on financial text — to produce sentiment scores at the sentence level.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Sentence-level scores are aggregated into daily sentiment signals per asset class
              (equities, credit, rates, commodities). These signals, combined with traditional
              volatility and correlation features, feed a classification model that assigns the
              current market to one of four regimes: Risk-On, Risk-Off, Recovery, or Stress.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              The system was deployed on AWS SageMaker with a scheduled inference pipeline running
              nightly. A Plotly-based dashboard surfaces the current regime classification, historical
              regime transitions, and the top contributing sentiment signals.
            </p>
          </section>

          {/* The Stack */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
              <span className="text-teal font-mono text-base">03</span> The Stack
            </h2>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-teal mt-2 flex-shrink-0" />
                <span><strong className="text-foreground">FinBERT (HuggingFace)</strong> — financial sentiment classification on raw text</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-teal mt-2 flex-shrink-0" />
                <span><strong className="text-foreground">AWS SageMaker</strong> — model hosting, scheduled batch inference, experiment tracking</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-teal mt-2 flex-shrink-0" />
                <span><strong className="text-foreground">SEC EDGAR API</strong> — programmatic access to 10-K/10-Q filings</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-teal mt-2 flex-shrink-0" />
                <span><strong className="text-foreground">Pandas + NumPy</strong> — signal aggregation, feature engineering, regime labeling</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-teal mt-2 flex-shrink-0" />
                <span><strong className="text-foreground">Plotly</strong> — interactive regime visualization dashboard</span>
              </li>
            </ul>
          </section>

          {/* The Outcome */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
              <span className="text-teal font-mono text-base">04</span> The Outcome
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              The system produces daily regime classifications with interpretable signal attribution —
              traders and portfolio managers can see not just the regime label, but which sectors and
              source documents drove the classification. This interpretability is critical in financial
              applications where &quot;black box&quot; outputs are operationally unacceptable.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Backtested regime signals showed consistent lead time over price-based indicators in
              major market transitions, validating the core hypothesis that text sentiment precedes
              price movement during regime shifts.
            </p>
          </section>
        </div>

        {/* CTA */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row items-start gap-4">
          <Button asChild className="bg-teal hover:bg-teal/90 text-white">
            <Link href="/contact">Discuss a Similar Project</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/case-studies">
              <ArrowLeft className="mr-2 h-4 w-4" />
              All Case Studies
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
