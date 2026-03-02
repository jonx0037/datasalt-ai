export interface HeroMetric {
  label: string;
  value: string;
  delta?: string;
}

export interface CaseStudyMeta {
  slug: string;
  title: string;
  subtitle: string;
  industry: IndustryTag[];
  techniques: string[];
  heroMetrics: HeroMetric[];
  readingTime: string;
  stack: string[];
  summary: string;
  outcome: string;
  thumbnail?: string;
  /** Controls object-position on the gallery card thumbnail. Defaults to "top" */
  thumbnailPosition?: "top" | "center" | "bottom";
  demoUrl?: string;
  githubRepo?: string;
}

export type IndustryTag =
  | "small-business"
  | "hospitality"
  | "maritime"
  | "agriculture"
  | "healthcare"
  | "forecasting"
  | "nlp"
  | "optimization"
  | "time-series"
  | "classification"
  | "government";

export const INDUSTRY_TAG_LABELS: Record<IndustryTag, string> = {
  "small-business": "Small Business",
  hospitality: "Hospitality",
  maritime: "Maritime",
  agriculture: "Agriculture",
  healthcare: "Healthcare",
  forecasting: "Forecasting",
  nlp: "NLP",
  optimization: "Optimization",
  "time-series": "Time Series",
  classification: "Classification",
  government: "Government",
};
