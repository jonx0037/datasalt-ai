import type { Metadata } from "next";
import { getCaseStudyBySlug } from "@/lib/case-studies";
import { CaseStudyHero } from "@/components/case-studies/CaseStudyHero";
import { CaseStudyChallenge } from "@/components/case-studies/CaseStudyChallenge";
import { CaseStudyApproach } from "@/components/case-studies/CaseStudyApproach";
import { CaseStudyImpact } from "@/components/case-studies/CaseStudyImpact";
import { CaseStudyCTA } from "@/components/case-studies/CaseStudyCTA";

const meta = getCaseStudyBySlug("harlibot")!;

export const metadata: Metadata = {
  title: "HarliBot — DataSalt Case Study",
  description:
    "How DataSalt built a bilingual AI chatbot for the City of Harlingen, TX — enabling 24/7 resident access to city services in English and Spanish.",
};

const tools = [
  {
    name: "Dialogflow CX",
    description:
      "intent recognition, bilingual conversation flows, entity extraction",
  },
  {
    name: "AWS Lambda + API Gateway",
    description: "serverless fulfillment layer for dynamic lookups",
  },
  {
    name: "Python",
    description: "NLP preprocessing, custom intent logic, data integration",
  },
  {
    name: "React",
    description: "embeddable chat widget deployed on the city\u2019s website",
  },
];

export default function HarliBotPage() {
  return (
    <div className="min-h-screen bg-background pt-24">
      <CaseStudyHero
        meta={meta}
        heroImage="/images/case-studies/HarliBot-hero.png"
      />

      <CaseStudyChallenge>
        <p>
          The City of Harlingen receives hundreds of resident inquiries every
          week — questions about permit status, utility billing, trash pickup
          schedules, permit applications, and more. The city&apos;s call center
          was handling these requests manually, creating bottlenecks,
          after-hours gaps, and inconsistent answers.
        </p>
        <p>
          A significant portion of Harlingen&apos;s population is
          Spanish-speaking, and existing self-service tools were English-only.
          The city needed a solution that could handle routine inquiries around
          the clock, in both languages, without requiring staff time for every
          interaction.
        </p>
      </CaseStudyChallenge>

      <CaseStudyApproach
        overview="We designed HarliBot as a bilingual NLP-powered chatbot integrated with the city's existing service data. The core architecture used Dialogflow CX for intent classification and conversation management, with custom Python handlers on AWS Lambda for dynamic data lookups and business logic."
        tools={tools}
      >
        <div className="prose prose-neutral dark:prose-invert max-w-none text-muted-foreground leading-relaxed space-y-4">
          <p>
            Language detection was handled automatically — the bot responds in
            whichever language the resident initiates the conversation in. We
            trained intent models on real resident inquiry data to ensure the
            classifier performed on the actual vocabulary and phrasing patterns
            of Harlingen residents, not generic training examples.
          </p>
          <p>
            The React frontend was embedded directly into the city&apos;s
            existing website, requiring no separate app download or account
            creation for residents.
          </p>
        </div>
      </CaseStudyApproach>

      <CaseStudyImpact>
        <p>
          HarliBot successfully handles routine resident inquiries in both
          English and Spanish around the clock, reducing the volume of
          repetitive calls reaching the city&apos;s call center. Residents get
          immediate, consistent answers without navigating phone trees or
          waiting for business hours.
        </p>
        <p>
          The bilingual capability was a meaningful equity improvement —
          Spanish-speaking residents gained the same self-service access as
          English speakers for the first time.
        </p>
      </CaseStudyImpact>

      <CaseStudyCTA meta={meta} />
    </div>
  );
}
