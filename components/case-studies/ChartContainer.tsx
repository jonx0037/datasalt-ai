"use client";

interface ChartContainerProps {
  title: string;
  caption?: string;
  children: React.ReactNode;
  className?: string;
}

export function ChartContainer({
  title,
  caption,
  children,
  className,
}: ChartContainerProps) {
  return (
    <div
      className={`my-8 rounded-lg border border-border bg-card p-6 ${className ?? ""}`}
    >
      <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
      <div className="w-full">{children}</div>
      {caption && (
        <p className="text-xs text-muted-foreground mt-3 italic">{caption}</p>
      )}
    </div>
  );
}
