import { BeforeAfterMetric } from "./BeforeAfterMetric";

interface ImpactMetric {
  label: string;
  before: string;
  after: string;
  delta: string;
}

interface CaseStudyImpactProps {
  metrics?: ImpactMetric[];
  annualValue?: string;
  children?: React.ReactNode;
}

export function CaseStudyImpact({
  metrics,
  annualValue,
  children,
}: CaseStudyImpactProps) {
  return (
    <section className="py-12 border-t border-border">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
          <span className="text-teal font-mono text-base">04</span>
          Business Impact
        </h2>

        {metrics && metrics.length > 0 && (
          <div className="rounded-lg border border-border bg-card p-6 mb-6">
            {metrics.map((m) => (
              <BeforeAfterMetric key={m.label} {...m} />
            ))}
          </div>
        )}

        {annualValue && (
          <div className="rounded-lg border border-teal/30 bg-teal/5 dark:bg-teal/10 p-6 text-center">
            <p className="text-sm text-muted-foreground mb-1">
              Projected Annual Value
            </p>
            <p className="text-2xl font-bold text-teal">{annualValue}</p>
          </div>
        )}

        {children && (
          <div className="prose prose-neutral dark:prose-invert max-w-none text-muted-foreground leading-relaxed mt-6">
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
