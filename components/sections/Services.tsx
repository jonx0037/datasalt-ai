import Link from "next/link";
import { Search, BrainCircuit, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const services = [
  {
    icon: Search,
    name: "Discovery Audit",
    tagline: "Not sure where to start? Start here.",
    description:
      "A structured assessment of your data landscape, infrastructure, and team capabilities. We identify where AI/ML can deliver value and build a clear roadmap for getting there. No commitment required beyond the conversation.",
    highlights: ["Current-state data audit", "ML opportunity mapping", "Actionable roadmap", "Technology recommendations"],
  },
  {
    icon: BrainCircuit,
    name: "Core AI/ML Consulting",
    tagline: "Custom models. Real deployment. Measurable outcomes.",
    description:
      "End-to-end machine learning engineering — from problem framing and data pipelines through model development, evaluation, and production deployment on AWS or your preferred cloud. NLP, forecasting, classification, anomaly detection, and more.",
    highlights: ["Custom model development", "NLP and text analytics", "Cloud deployment (AWS/GCP)", "MLOps and monitoring"],
  },
  {
    icon: Code2,
    name: "Full-Stack Add-On",
    tagline: "Your model deserves a front end worth showing.",
    description:
      "When your ML work needs a user interface, dashboard, or API to be useful to the humans who depend on it. Built with the same engineering rigor as the models themselves. Next.js, React, REST APIs, and production-grade tooling.",
    highlights: ["Dashboards and data visualization", "API design and integration", "Internal tools", "Client-facing applications"],
  },
];

export function Services() {
  return (
    <section id="services" className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-teal uppercase tracking-widest mb-3">
            What We Do
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Services
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Three ways to engage, scoped to where you are. Every engagement
            starts with a conversation.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <Card
                key={service.name}
                className="flex flex-col border-border hover:border-teal/40 transition-colors duration-200 group"
              >
                <CardHeader className="pb-4">
                  <div className="w-10 h-10 rounded-lg bg-teal/10 flex items-center justify-center mb-4 group-hover:bg-teal/20 transition-colors">
                    <Icon className="h-5 w-5 text-teal" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {service.name}
                  </h3>
                  <p className="text-sm text-teal font-medium">{service.tagline}</p>
                </CardHeader>
                <CardContent className="flex flex-col flex-1 gap-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                  <ul className="space-y-1.5 flex-1">
                    {service.highlights.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-sm text-foreground/80"
                      >
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-teal flex-shrink-0" aria-hidden />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Button asChild variant="outline" size="sm" className="mt-auto border-teal/30 hover:border-teal hover:bg-teal/5 text-foreground">
                    <Link href="/contact">Get a Quote</Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/services"
            className="text-sm text-teal hover:text-teal/80 transition-colors underline underline-offset-4"
          >
            View full service descriptions →
          </Link>
        </div>
      </div>
    </section>
  );
}
