import { ChevronDown } from "lucide-react";

interface CaseStudyTechnicalProps {
  children: React.ReactNode;
}

export function CaseStudyTechnical({ children }: CaseStudyTechnicalProps) {
  return (
    <section className="py-12 border-t border-border">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <details className="group">
          <summary className="flex items-center gap-2 cursor-pointer list-none">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <span className="text-teal font-mono text-base">05</span>
              Technical Details
            </h2>
            <ChevronDown className="h-5 w-5 text-muted-foreground transition-transform group-open:rotate-180" />
          </summary>
          <div className="mt-6 prose prose-neutral dark:prose-invert max-w-none text-muted-foreground leading-relaxed space-y-4">
            {children}
          </div>
        </details>
      </div>
    </section>
  );
}
