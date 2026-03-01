import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CaseStudyMeta } from "@/types/case-study";

interface CaseStudyCTAProps {
  meta: CaseStudyMeta;
}

export function CaseStudyCTA({ meta }: CaseStudyCTAProps) {
  return (
    <section className="py-12 border-t border-border">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-border bg-muted/30 p-8 text-center">
          <p className="text-lg font-semibold text-foreground mb-2">
            Facing similar challenges?
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            Let&apos;s discuss how data science can drive results for your
            business.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button asChild className="bg-teal hover:bg-teal/90 text-white">
              <Link href="/contact">Discuss a Similar Project</Link>
            </Button>
            {meta.githubRepo && (
              <Button asChild variant="outline">
                <a
                  href={meta.githubRepo}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View on GitHub
                </a>
              </Button>
            )}
            {meta.demoUrl && (
              <Button asChild variant="outline">
                <a
                  href={meta.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Live Demo
                </a>
              </Button>
            )}
          </div>
        </div>

        <div className="mt-6 text-center">
          <Button asChild variant="ghost" size="sm">
            <Link href="/case-studies">
              <ArrowLeft className="mr-2 h-4 w-4" />
              All Case Studies
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
