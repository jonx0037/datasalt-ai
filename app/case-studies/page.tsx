import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Case Studies — DataSalt",
  description:
    "Real AI/ML projects built and deployed. See how DataSalt delivered applied machine learning solutions for government and financial services clients.",
};

const caseStudies = [
  {
    slug: "harlibot",
    title: "HarliBot",
    category: "Government AI",
    summary:
      "Bilingual municipal AI chatbot deployed for the City of Harlingen, TX — enabling residents to access city services and information in English and Spanish 24/7.",
    stack: ["Python", "AWS Lambda", "NLP", "Dialogflow", "React"],
    outcome: "Reduced call center load by handling routine resident inquiries around the clock.",
  },
  {
    slug: "market-regime-detector",
    title: "Market Regime Detector",
    category: "Financial NLP",
    summary:
      "Sentiment-based cross-asset market regime detection system that classifies market conditions using NLP on financial news, earnings calls, and SEC filings.",
    stack: ["Python", "FinBERT", "AWS SageMaker", "Pandas", "Plotly"],
    outcome: "Automated regime classification across equity, credit, and rates markets with interpretable signal output.",
  },
];

export default function CaseStudiesPage() {
  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-16">
          <p className="text-sm font-medium text-teal uppercase tracking-widest mb-3">
            Proof of Work
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            Case Studies
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
            Real problems. Real solutions. Built and deployed — not just
            proposed.
          </p>
        </div>

        {/* Cards */}
        <div className="space-y-6">
          {caseStudies.map((cs) => (
            <Card key={cs.slug} className="border-border hover:border-teal/40 transition-colors group">
              <CardHeader className="pb-3">
                <Badge variant="secondary" className="w-fit text-xs mb-2">
                  {cs.category}
                </Badge>
                <h2 className="text-2xl font-bold text-foreground">{cs.title}</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">{cs.summary}</p>
                <p className="text-sm text-foreground/80">
                  <span className="font-medium text-teal">Outcome: </span>
                  {cs.outcome}
                </p>
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
                  className="inline-flex items-center gap-1.5 text-sm text-teal hover:text-teal/80 font-medium transition-colors"
                >
                  Read the full case study
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
