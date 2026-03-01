"use client";

import { useState } from "react";
import type { IndustryTag } from "@/types/case-study";
import { INDUSTRY_TAG_LABELS } from "@/types/case-study";
import type { CaseStudyMeta } from "@/types/case-study";
import { CaseStudyGalleryCard } from "./CaseStudyGalleryCard";

interface CaseStudyGalleryFilterProps {
  studies: CaseStudyMeta[];
  tags: IndustryTag[];
}

export function CaseStudyGalleryFilter({
  studies,
  tags,
}: CaseStudyGalleryFilterProps) {
  const [activeTags, setActiveTags] = useState<Set<IndustryTag>>(new Set());

  const toggleTag = (tag: IndustryTag) => {
    setActiveTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) {
        next.delete(tag);
      } else {
        next.add(tag);
      }
      return next;
    });
  };

  const clearFilters = () => setActiveTags(new Set());

  const filtered =
    activeTags.size === 0
      ? studies
      : studies.filter((s) =>
          s.industry.some((tag) => activeTags.has(tag))
        );

  return (
    <>
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2 mb-10">
        <button
          onClick={clearFilters}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            activeTags.size === 0
              ? "bg-teal text-white"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
        >
          All
        </button>
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => toggleTag(tag)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              activeTags.has(tag)
                ? "bg-teal text-white"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {INDUSTRY_TAG_LABELS[tag] ?? tag}
          </button>
        ))}
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((study) => (
          <CaseStudyGalleryCard key={study.slug} study={study} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-12">
          No case studies match the selected filters.
        </p>
      )}
    </>
  );
}
