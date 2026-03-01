import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const caseStudies = [
  {
    slug: "harlibot",
    title: "HarliBot",
    summary:
      "Bilingual municipal AI chatbot deployed for the City of Harlingen, TX — enabling residents to access city services and information in English and Spanish 24/7.",
    stack: ["Python", "AWS Lambda", "NLP", "Dialogflow", "React"],
    category: "Government AI",
  },
  {
    slug: "market-regime-detector",
    title: "Market Regime Detector",
    summary:
      "Sentiment-based cross-asset market regime detection system that classifies market conditions using NLP on financial news, earnings calls, and SEC filings.",
    stack: ["Python", "FinBERT", "AWS SageMaker", "Pandas", "Plotly"],
    category: "Financial NLP",
  },
];

export function CaseStudies() {
  return (
    <section
      id="case-studies"
      className="py-24 bg-muted/30 dark:bg-navy/20"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-teal uppercase tracking-widest mb-3">
            Proof of Work
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Case Studies
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Real problems. Real solutions. Built and deployed — not just
            proposed.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {caseStudies.map((cs) => (
            <Card
              key={cs.slug}
              className="flex flex-col border-border hover:border-teal/40 transition-colors duration-200 group"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Badge
                      variant="secondary"
                      className="text-xs font-medium mb-2"
                    >
                      {cs.category}
                    </Badge>
                    <h3 className="text-xl font-semibold text-foreground">
                      {cs.title}
                    </h3>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col flex-1 gap-4">
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                  {cs.summary}
                </p>

                {/* Stack tags */}
                <div className="flex flex-wrap gap-1.5">
                  {cs.stack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded-md bg-teal/10 text-teal text-xs font-mono font-medium border border-teal/20"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <Link
                  href={`/case-studies/${cs.slug}`}
                  className="inline-flex items-center gap-1 text-sm text-teal hover:text-teal/80 font-medium transition-colors mt-1"
                >
                  Read the case study
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/case-studies"
            className="text-sm text-teal hover:text-teal/80 transition-colors underline underline-offset-4"
          >
            View all case studies →
          </Link>
        </div>
      </div>
    </section>
  );
}
