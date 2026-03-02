import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { CaseStudyMeta } from "@/types/case-study";
import { INDUSTRY_TAG_LABELS } from "@/types/case-study";
import { MetricCard } from "./MetricCard";

interface CaseStudyHeroProps {
  meta: CaseStudyMeta;
  /** Optional path to a background hero image (from /public, e.g. "/images/case-studies/foo.png") */
  heroImage?: string;
  /** Controls overlay darkness. Defaults to "medium". Use "dark" for lighter/busier hero images. */
  overlayStrength?: "medium" | "dark";
}

export function CaseStudyHero({ meta, heroImage, overlayStrength = "medium" }: CaseStudyHeroProps) {
  const hasImage = Boolean(heroImage);

  return (
    <section
      className="pb-12 relative"
      style={
        hasImage
          ? {
            backgroundImage: `url(${heroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }
          : undefined
      }
    >
      {/* Dark gradient overlay — only rendered when a hero image is present */}
      {hasImage && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              overlayStrength === "dark"
                ? "linear-gradient(to bottom, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.65) 60%, rgba(0,0,0,0.85) 100%)"
                : "linear-gradient(to bottom, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.45) 60%, rgba(0,0,0,0.72) 100%)",
          }}
        />
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Back nav */}
        <Link
          href="/case-studies"
          className={`inline-flex items-center gap-1.5 text-sm transition-colors mb-10 ${hasImage
            ? "text-white/70 hover:text-white"
            : "text-muted-foreground hover:text-foreground"
            }`}
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All Case Studies
        </Link>

        {/* Tags + reading time */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {meta.industry.map((tag) => (
            <Badge
              key={tag}
              variant={hasImage ? "outline" : "secondary"}
              className={`text-xs ${hasImage ? "border-white/40 text-white bg-white/10" : ""}`}
            >
              {INDUSTRY_TAG_LABELS[tag] ?? tag}
            </Badge>
          ))}
          <span
            className={`text-xs ${hasImage ? "text-white/60" : "text-muted-foreground"}`}
          >
            {meta.readingTime}
          </span>
        </div>

        {/* Title + subtitle */}
        <h1
          className={`text-4xl sm:text-5xl font-bold mb-4 ${hasImage ? "text-white drop-shadow-md" : "text-foreground"
            }`}
        >
          {meta.title}
        </h1>
        <p
          className={`text-xl mb-8 leading-relaxed ${hasImage ? "text-white/85" : "text-muted-foreground"
            }`}
        >
          {meta.subtitle}
        </p>

        {/* Stack */}
        <div className="flex flex-wrap gap-1.5 mb-10">
          {meta.stack.map((tech) => (
            <span
              key={tech}
              className={`px-2.5 py-1 rounded-md text-xs font-mono font-medium border ${hasImage
                ? "bg-white/10 text-white border-white/25 backdrop-blur-sm"
                : "bg-teal/10 text-teal border-teal/20"
                }`}
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Hero metrics */}
        {meta.heroMetrics.length > 0 && (
          <div className={`grid grid-cols-1 sm:grid-cols-3 gap-4 ${hasImage ? "pb-10" : ""}`}>
            {meta.heroMetrics.map((metric) => (
              <MetricCard key={metric.label} {...metric} heroImage={hasImage} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
