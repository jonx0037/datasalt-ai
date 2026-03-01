import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden hero-gradient">
      {/* Subtle grid overlay for texture */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
        aria-hidden
      />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-teal/40 bg-teal/10 text-teal text-sm font-medium mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" aria-hidden />
          Applied AI/ML Consulting
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight mb-6">
          From Model
          <br />
          <span className="text-teal">to Deployment.</span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed">
          DataSalt brings enterprise-grade machine learning and NLP expertise to
          organizations that need real solutions — not just advice. We build,
          deploy, and deliver.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild size="lg" className="bg-teal hover:bg-teal/90 text-white px-8 h-12 text-base font-medium shadow-lg shadow-teal/20">
            <Link href="/contact">
              Start with a Discovery Call
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="ghost" size="lg" className="text-white/80 hover:text-white hover:bg-white/10 px-8 h-12 text-base">
            <Link href="#case-studies">See Our Work</Link>
          </Button>
        </div>

        {/* Tagline */}
        <p className="mt-12 text-sm text-white/40 font-medium tracking-widest uppercase">
          Seasoned AI. Sharp Results.
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/30">
        <ChevronDown className="h-5 w-5 animate-bounce" aria-hidden />
      </div>
    </section>
  );
}
