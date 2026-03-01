import type { Metadata } from "next";
import { caseStudies, getAllIndustryTags } from "@/lib/case-studies";
import { CaseStudyGalleryFilter } from "@/components/case-studies/CaseStudyGalleryFilter";

export const metadata: Metadata = {
  title: "Case Studies — DataSalt",
  description:
    "Real AI/ML projects built and deployed. See how DataSalt delivered applied machine learning solutions across government, marine, financial, and small business domains.",
};

export default function CaseStudiesPage() {
  const tags = getAllIndustryTags();

  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
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

        {/* Filter + cards (client component handles filtering) */}
        <CaseStudyGalleryFilter studies={caseStudies} tags={tags} />
      </div>
    </div>
  );
}
