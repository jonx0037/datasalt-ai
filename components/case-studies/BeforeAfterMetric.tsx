import { ArrowRight } from "lucide-react";

interface BeforeAfterMetricProps {
  label: string;
  before: string;
  after: string;
  delta: string;
}

export function BeforeAfterMetric({
  label,
  before,
  after,
  delta,
}: BeforeAfterMetricProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 py-4 border-b border-border last:border-b-0">
      <span className="text-sm font-medium text-foreground sm:w-44 flex-shrink-0">
        {label}
      </span>
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">{before}</span>
        <ArrowRight className="h-3.5 w-3.5 text-teal flex-shrink-0" />
        <span className="font-medium text-foreground">{after}</span>
      </div>
      <span className="text-xs font-medium text-teal sm:ml-auto">{delta}</span>
    </div>
  );
}
