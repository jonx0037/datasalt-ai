import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DemoCalloutProps {
  title?: string;
  description?: string;
  href?: string;
  buttonText?: string;
}

export function DemoCallout({
  title = "Try Our AI-Powered Intake System",
  description = "See how the pipeline handles matter classification, risk assessment, and attorney assignment — in real time.",
  href = "https://counselos.vercel.app/",
  buttonText = "Launch Live Demo",
}: DemoCalloutProps) {
  return (
    <div className="not-prose my-10 rounded-lg border border-teal/20 bg-gradient-to-r from-teal/5 to-teal/10 dark:from-teal/10 dark:to-teal/15 p-8">
      <p className="text-xs font-medium text-teal uppercase tracking-widest mb-2">
        Interactive Demo
      </p>
      <p className="text-lg font-semibold text-foreground mb-1">{title}</p>
      <p className="text-sm text-muted-foreground mb-5">{description}</p>
      <Button asChild className="bg-teal hover:bg-teal/90 text-white">
        <a href={href} target="_blank" rel="noopener noreferrer">
          <ExternalLink className="mr-2 h-4 w-4" />
          {buttonText}
        </a>
      </Button>
    </div>
  );
}
