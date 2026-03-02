import type { HeroMetric } from "@/types/case-study";

interface MetricCardProps extends HeroMetric {
  /** When true, renders with a frosted-glass style suited for a photo background */
  heroImage?: boolean;
}

export function MetricCard({ label, value, delta, heroImage }: MetricCardProps) {
  return (
    <div
      className={`rounded-lg border p-6 text-center ${heroImage
          ? "border-white/20 bg-black/30 backdrop-blur-md"
          : "border-border bg-card"
        }`}
    >
      <p
        className={`text-3xl sm:text-4xl font-bold mb-1 ${heroImage ? "text-white" : "text-teal"
          }`}
      >
        {value}
      </p>
      <p
        className={`text-sm font-medium ${heroImage ? "text-white/90" : "text-foreground"
          }`}
      >
        {label}
      </p>
      {delta && (
        <p
          className={`text-xs mt-1 ${heroImage ? "text-white/60" : "text-muted-foreground"
            }`}
        >
          {delta}
        </p>
      )}
    </div>
  );
}
