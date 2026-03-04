import { Suspense } from "react";
import { Hotel, TrendingUp, BarChart3, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { OccupancyDashboard } from "@/components/resort/OccupancyDashboard";
import { ReviewExplorer } from "@/components/resort/ReviewExplorer";
import { ResortInsights } from "@/components/resort/ResortInsights";

const heroStats = [
  {
    label: "Annual Revenue Uplift",
    value: "$340K",
    icon: TrendingUp,
  },
  {
    label: "14-Day Accuracy",
    value: "89%",
    icon: BarChart3,
  },
  {
    label: "Top Demand Drivers",
    value: "3 Events",
    icon: Target,
  },
];

export default function ResortPage() {
  return (
    <main className="min-h-screen">
      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="hero-gradient relative overflow-hidden pt-28 pb-20 sm:pt-32 sm:pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Badge
            variant="outline"
            className="mb-4 border-white/30 text-white/80 bg-white/10 backdrop-blur-sm"
          >
            <Hotel className="mr-1.5 h-3.5 w-3.5" />
            resort.datasalt.ai
          </Badge>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight max-w-3xl">
            SPI Beach Resort
            <span className="text-teal-400"> Occupancy Dashboard</span>
          </h1>

          <p className="mt-4 text-lg text-white/70 max-w-2xl leading-relaxed">
            AI-powered occupancy forecasting and revenue management. Prophet-based
            demand prediction with dynamic pricing simulation and guest sentiment
            analysis.
          </p>

          {/* Hero stats */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl">
            {heroStats.map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3"
              >
                <stat.icon className="h-5 w-5 text-teal-400 shrink-0" />
                <div>
                  <p className="text-white font-semibold text-lg leading-tight">
                    {stat.value}
                  </p>
                  <p className="text-white/60 text-xs">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Forecasting Dashboard ────────────────────────── */}
      <section className="py-16 sm:py-20" id="dashboard">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Occupancy Forecasting
            </h2>
            <p className="mt-2 text-muted-foreground max-w-xl mx-auto">
              Adjust month, room type, and event scenarios to get instant
              Prophet-powered occupancy predictions with staffing recommendations.
            </p>
          </div>

          <Suspense
            fallback={
              <Card className="animate-pulse h-[600px]">
                <CardContent className="flex items-center justify-center h-full text-muted-foreground">
                  Loading dashboard...
                </CardContent>
              </Card>
            }
          >
            <OccupancyDashboard />
          </Suspense>
        </div>
      </section>

      {/* ── Review Sentiment Explorer ───────────────────── */}
      <section className="py-16 sm:py-20 bg-muted/50" id="reviews">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Guest Review Explorer
            </h2>
            <p className="mt-2 text-muted-foreground max-w-xl mx-auto">
              Explore 200 guest reviews with sentiment scoring, topic filtering,
              and monthly trend analysis.
            </p>
          </div>

          <Suspense
            fallback={
              <Card className="animate-pulse h-[400px]">
                <CardContent className="flex items-center justify-center h-full text-muted-foreground">
                  Loading reviews...
                </CardContent>
              </Card>
            }
          >
            <ReviewExplorer />
          </Suspense>
        </div>
      </section>

      {/* ── Resort Insights ──────────────────────────────── */}
      <section className="py-16 sm:py-20" id="insights">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Resort Insights
            </h2>
            <p className="mt-2 text-muted-foreground max-w-xl mx-auto">
              Room type performance comparison and check-in volume patterns
              across the week.
            </p>
          </div>

          <ResortInsights />
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-muted/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-center mb-10">
            How It Works
          </h2>

          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Synthetic Data",
                desc: "3 years of realistic booking, pricing, and review data generated with seasonal patterns, event effects, and room type dynamics.",
              },
              {
                step: "2",
                title: "Prophet Forecast",
                desc: "Facebook Prophet time-series model captures seasonality, holiday effects, and growth trends to predict occupancy 90 days ahead with 89% accuracy.",
              },
              {
                step: "3",
                title: "Dynamic Pricing",
                desc: "Recommended rates adjust based on predicted demand, event impact, and room type. Revenue opportunity analysis identifies $340K annual uplift potential.",
              },
            ].map((item) => (
              <Card key={item.step} className="text-center">
                <CardContent className="pt-6">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold text-lg flex items-center justify-center mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
