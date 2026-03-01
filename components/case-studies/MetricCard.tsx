import type { HeroMetric } from "@/types/case-study";

export function MetricCard({ label, value, delta }: HeroMetric) {
  return (
    <div className="rounded-lg border border-border bg-card p-6 text-center">
      <p className="text-3xl sm:text-4xl font-bold text-teal mb-1">{value}</p>
      <p className="text-sm font-medium text-foreground">{label}</p>
      {delta && (
        <p className="text-xs text-muted-foreground mt-1">{delta}</p>
      )}
    </div>
  );
}
