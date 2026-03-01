import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { CaseStudyMeta } from "@/types/case-study";
import { INDUSTRY_TAG_LABELS } from "@/types/case-study";
import { MetricCard } from "./MetricCard";

interface CaseStudyHeroProps {
  meta: CaseStudyMeta;
}

export function CaseStudyHero({ meta }: CaseStudyHeroProps) {
  return (
    <section className="pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back nav */}
        <Link
          href="/case-studies"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All Case Studies
        </Link>

        {/* Tags + reading time */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {meta.industry.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {INDUSTRY_TAG_LABELS[tag] ?? tag}
            </Badge>
          ))}
          <span className="text-xs text-muted-foreground">
            {meta.readingTime}
          </span>
        </div>

        {/* Title + subtitle */}
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
          {meta.title}
        </h1>
        <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
          {meta.subtitle}
        </p>

        {/* Stack */}
        <div className="flex flex-wrap gap-1.5 mb-10">
          {meta.stack.map((tech) => (
            <span
              key={tech}
              className="px-2.5 py-1 rounded-md bg-teal/10 text-teal text-xs font-mono font-medium border border-teal/20"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Hero metrics */}
        {meta.heroMetrics.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {meta.heroMetrics.map((metric) => (
              <MetricCard key={metric.label} {...metric} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
