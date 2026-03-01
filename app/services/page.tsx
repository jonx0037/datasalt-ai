import type { Metadata } from "next";
import Link from "next/link";
import { Search, BrainCircuit, Code2, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Services — DataSalt",
  description:
    "Applied AI/ML consulting services: Discovery Audits, Core ML Engineering, and Full-Stack integration. Scoped per project, delivered end-to-end.",
};

const services = [
  {
    icon: Search,
    name: "Discovery Audit",
    tagline: "Not sure where to start? Start here.",
    description:
      "A structured assessment of your data landscape, infrastructure, and team capabilities. We identify where AI/ML can deliver value and build a clear roadmap for getting there. No commitment required beyond the conversation.",
    details: [
      "Structured review of your current data sources, pipelines, and infrastructure",
      "Assessment of team capabilities and tooling gaps",
      "Identification of high-value ML opportunities ranked by feasibility and ROI",
      "Technology recommendations tailored to your stack and scale",
      "A written roadmap with clear next steps and time estimates",
    ],
    idealFor: "Organizations new to ML, or teams that have tried ML initiatives that didn't ship.",
    deliverable: "Written assessment + roadmap document",
  },
  {
    icon: BrainCircuit,
    name: "Core AI/ML Consulting",
    tagline: "Custom models. Real deployment. Measurable outcomes.",
    description:
      "End-to-end machine learning engineering — from problem framing and data pipelines through model development, evaluation, and production deployment on AWS or your preferred cloud. NLP, forecasting, classification, anomaly detection, and more.",
    details: [
      "Problem framing and success metric definition",
      "Data pipeline design and ETL engineering",
      "Feature engineering and model development (scikit-learn, PyTorch, Hugging Face)",
      "Model evaluation, validation, and bias assessment",
      "Production deployment on AWS SageMaker, Lambda, or containerized infrastructure",
      "MLOps setup: monitoring, drift detection, retraining triggers",
      "Full documentation and knowledge transfer",
    ],
    idealFor: "Teams with defined ML problems who need the engineering depth to ship.",
    deliverable: "Deployed model + documentation + handoff session",
  },
  {
    icon: Code2,
    name: "Full-Stack Add-On",
    tagline: "Your model deserves a front end worth showing.",
    description:
      "When your ML work needs a user interface, dashboard, or API to be useful to the humans who depend on it. Built with the same engineering rigor as the models themselves.",
    details: [
      "React / Next.js dashboards and data visualization",
      "REST or GraphQL API design and implementation",
      "Internal tools for ops, analyst, or engineering teams",
      "Client-facing applications with authentication and role management",
      "Integration with existing systems (CRMs, data warehouses, third-party APIs)",
      "Deployment to Vercel, AWS Amplify, or your preferred hosting",
    ],
    idealFor:
      "Teams that have ML models or APIs but no front-end to make them accessible.",
    deliverable: "Deployed application + codebase + deployment guide",
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-16">
          <p className="text-sm font-medium text-teal uppercase tracking-widest mb-3">
            Services
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            What We Do
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
            Three ways to engage, scoped to where you are. Every engagement
            starts with a free discovery conversation — no commitment required.
          </p>
        </div>

        {/* Service sections */}
        <div className="space-y-16">
          {services.map((service, idx) => {
            const Icon = service.icon;
            return (
              <div key={service.name} className="border-t border-border pt-12">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-teal/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-5 w-5 text-teal" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-mono mb-1">
                      0{idx + 1}
                    </p>
                    <h2 className="text-2xl font-bold text-foreground">
                      {service.name}
                    </h2>
                    <p className="text-teal font-medium mt-1">{service.tagline}</p>
                  </div>
                </div>

                <p className="text-muted-foreground leading-relaxed mb-6">
                  {service.description}
                </p>

                <ul className="space-y-2 mb-6">
                  {service.details.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-foreground/80">
                      <CheckCircle2 className="h-4 w-4 text-teal flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-lg bg-muted/50 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">
                      Ideal For
                    </p>
                    <p className="text-foreground/80">{service.idealFor}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">
                      Deliverable
                    </p>
                    <p className="text-foreground/80">{service.deliverable}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-16 pt-12 border-t border-border text-center">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Ready to talk through your project?
          </h3>
          <p className="text-muted-foreground mb-8">
            Every engagement starts with a free conversation. No sales pressure.
          </p>
          <Button asChild size="lg" className="bg-teal hover:bg-teal/90 text-white px-8">
            <Link href="/contact">
              Start with a Discovery Call
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
