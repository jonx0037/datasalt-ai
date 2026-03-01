import { ArrowRight } from "lucide-react";

interface PipelineStep {
  label: string;
  detail?: string;
}

interface PipelineDiagramProps {
  steps: PipelineStep[];
}

export function PipelineDiagram({ steps }: PipelineDiagramProps) {
  return (
    <div className="my-6 flex flex-wrap items-center gap-2">
      {steps.map((step, i) => (
        <div key={step.label} className="flex items-center gap-2">
          <div className="rounded-lg border border-border bg-card px-4 py-3 text-center min-w-[120px]">
            <p className="text-sm font-medium text-foreground">{step.label}</p>
            {step.detail && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {step.detail}
              </p>
            )}
          </div>
          {i < steps.length - 1 && (
            <ArrowRight className="h-4 w-4 text-teal flex-shrink-0" />
          )}
        </div>
      ))}
    </div>
  );
}
