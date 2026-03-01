import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "HarliBot — DataSalt Case Study",
  description:
    "How DataSalt built a bilingual AI chatbot for the City of Harlingen, TX — enabling 24/7 resident access to city services in English and Spanish.",
};

const stack = [
  "Python", "AWS Lambda", "AWS API Gateway", "Dialogflow CX",
  "React", "Node.js", "NLP", "Bilingual Intent Classification"
];

export default function HarliBotPage() {
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
        <Badge variant="secondary" className="mb-4">Government AI</Badge>
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
          HarliBot
        </h1>
        <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
          Bilingual Municipal AI Chatbot for the City of Harlingen, TX
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
              The City of Harlingen receives hundreds of resident inquiries every week — questions
              about permit status, utility billing, trash pickup schedules, permit applications,
              and more. The city&apos;s call center was handling these requests manually, creating
              bottlenecks, after-hours gaps, and inconsistent answers.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              A significant portion of Harlingen&apos;s population is Spanish-speaking, and existing
              self-service tools were English-only. The city needed a solution that could handle
              routine inquiries around the clock, in both languages, without requiring staff time
              for every interaction.
            </p>
          </section>

          {/* The Approach */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
              <span className="text-teal font-mono text-base">02</span> The Approach
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We designed HarliBot as a bilingual NLP-powered chatbot integrated with the city&apos;s
              existing service data. The core architecture used Dialogflow CX for intent classification
              and conversation management, with custom Python handlers on AWS Lambda for dynamic data
              lookups and business logic.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Language detection was handled automatically — the bot responds in whichever language
              the resident initiates the conversation in. We trained intent models on real resident
              inquiry data to ensure the classifier performed on the actual vocabulary and phrasing
              patterns of Harlingen residents, not generic training examples.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              The React frontend was embedded directly into the city&apos;s existing website, requiring
              no separate app download or account creation for residents.
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
                <span><strong className="text-foreground">Dialogflow CX</strong> — intent recognition, bilingual conversation flows, entity extraction</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-teal mt-2 flex-shrink-0" />
                <span><strong className="text-foreground">AWS Lambda + API Gateway</strong> — serverless fulfillment layer for dynamic lookups</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-teal mt-2 flex-shrink-0" />
                <span><strong className="text-foreground">Python</strong> — NLP preprocessing, custom intent logic, data integration</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-teal mt-2 flex-shrink-0" />
                <span><strong className="text-foreground">React</strong> — embeddable chat widget deployed on the city&apos;s website</span>
              </li>
            </ul>
          </section>

          {/* The Outcome */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
              <span className="text-teal font-mono text-base">04</span> The Outcome
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              HarliBot successfully handles routine resident inquiries in both English and Spanish
              around the clock, reducing the volume of repetitive calls reaching the city&apos;s call center.
              Residents get immediate, consistent answers without navigating phone trees or waiting for
              business hours.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              The bilingual capability was a meaningful equity improvement — Spanish-speaking residents
              gained the same self-service access as English speakers for the first time.
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
