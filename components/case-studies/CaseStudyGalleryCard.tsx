import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { CaseStudyMeta } from "@/types/case-study";
import { INDUSTRY_TAG_LABELS } from "@/types/case-study";

interface CaseStudyGalleryCardProps {
  study: CaseStudyMeta;
}

export function CaseStudyGalleryCard({ study }: CaseStudyGalleryCardProps) {
  return (
    <Card className="flex flex-col border-border hover:border-teal/40 transition-colors duration-200 group">
      {/* Thumbnail */}
      <div className="relative h-40 rounded-t-lg overflow-hidden">
        {study.thumbnail ? (
          <Image
            src={study.thumbnail}
            alt={`${study.title} hero image`}
            fill
            className={`object-cover ${study.thumbnailPosition === "center" ? "object-center"
                : study.thumbnailPosition === "bottom" ? "object-bottom"
                  : study.thumbnailPosition === "left" ? "object-left"
                    : study.thumbnailPosition === "right" ? "object-right"
                      : "object-top"
              }`}
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="h-full bg-gradient-to-br from-navy-dark/80 to-teal/20 flex items-center justify-center">
            <span className="text-3xl font-bold text-teal/40 font-mono">
              {study.title
                .split(" ")
                .map((w) => w[0])
                .join("")}
            </span>
          </div>
        )}
      </div>

      <CardHeader className="pb-3">
        <div className="flex flex-wrap gap-1.5 mb-2">
          {study.industry.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {INDUSTRY_TAG_LABELS[tag] ?? tag}
            </Badge>
          ))}
        </div>
        <h3 className="text-xl font-semibold text-foreground">{study.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {study.subtitle}
        </p>
      </CardHeader>

      <CardContent className="flex flex-col flex-1 gap-4">
        <p className="text-sm text-muted-foreground leading-relaxed flex-1 line-clamp-3">
          {study.summary}
        </p>

        {/* Mini metrics */}
        {study.heroMetrics.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {study.heroMetrics.map((m) => (
              <div key={m.label} className="text-center">
                <p className="text-sm font-bold text-teal">{m.value}</p>
                <p className="text-[10px] text-muted-foreground leading-tight">
                  {m.label}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Stack tags */}
        <div className="flex flex-wrap gap-1.5">
          {study.stack.slice(0, 5).map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 rounded-md bg-teal/10 text-teal text-xs font-mono font-medium border border-teal/20"
            >
              {tech}
            </span>
          ))}
          {study.stack.length > 5 && (
            <span className="px-2 py-0.5 text-xs text-muted-foreground">
              +{study.stack.length - 5}
            </span>
          )}
        </div>

        <Link
          href={`/case-studies/${study.slug}`}
          className="inline-flex items-center gap-1 text-sm text-teal hover:text-teal/80 font-medium transition-colors mt-1"
        >
          Read case study
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </CardContent>
    </Card>
  );
}
