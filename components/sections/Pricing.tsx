import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const tiers = [
  {
    name: "Discovery Audit",
    tagline: "Start with clarity.",
    description:
      "A structured engagement to map your data landscape and identify where ML can move the needle. Ideal as a first step before any larger commitment.",
    includes: [
      "Current-state assessment",
      "ML opportunity analysis",
      "Technology recommendations",
      "Prioritized roadmap",
    ],
    highlight: false,
  },
  {
    name: "Core AI/ML Consulting",
    tagline: "Build it right.",
    description:
      "Custom model development, MLOps infrastructure, and cloud deployment. Scoped per project based on complexity, data maturity, and delivery requirements.",
    includes: [
      "Problem framing and data pipeline",
      "Model development and evaluation",
      "Production deployment on AWS/GCP",
      "Documentation and handoff",
    ],
    highlight: true,
  },
  {
    name: "Full-Stack Add-On",
    tagline: "Make it usable.",
    description:
      "UI, dashboards, and APIs layered on top of your ML work. Available as a standalone engagement or combined with Core consulting.",
    includes: [
      "Dashboard and visualization",
      "REST or GraphQL API",
      "Internal tools or client-facing apps",
      "Deployment and hosting",
    ],
    highlight: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-muted/30 dark:bg-navy/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-6">
          <p className="text-sm font-medium text-teal uppercase tracking-widest mb-3">
            Pricing
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Transparent Structure.
            <br />
            Flexible Pricing.
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Every engagement starts with a conversation. Pricing is scoped per
            project — reach out to discuss your needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {tiers.map((tier) => (
            <Card
              key={tier.name}
              className={cn(
                "flex flex-col transition-all duration-200",
                tier.highlight
                  ? "border-teal shadow-lg shadow-teal/10 dark:shadow-teal/5 relative"
                  : "border-border hover:border-teal/30"
              )}
            >
              {tier.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 rounded-full bg-teal text-white text-xs font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              <CardHeader className={cn("pb-4", tier.highlight && "pt-7")}>
                <h3 className="text-lg font-semibold text-foreground">
                  {tier.name}
                </h3>
                <p className="text-sm text-teal font-medium">{tier.tagline}</p>
              </CardHeader>
              <CardContent className="flex flex-col flex-1 gap-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {tier.description}
                </p>
                <ul className="space-y-2 flex-1">
                  {tier.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-foreground/80">
                      <Check className="h-4 w-4 text-teal flex-shrink-0 mt-0.5" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  variant={tier.highlight ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "mt-auto",
                    tier.highlight
                      ? "bg-teal hover:bg-teal/90 text-white"
                      : "border-teal/30 hover:border-teal hover:bg-teal/5"
                  )}
                >
                  <Link href="/contact">Get a Quote</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
