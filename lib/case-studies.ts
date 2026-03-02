import type { CaseStudyMeta, IndustryTag } from "@/types/case-study";

export const caseStudies: CaseStudyMeta[] = [
  {
    slug: "gulf-coast-boat-sales",
    title: "Gulf Coast Boat Sales",
    subtitle:
      "Pricing Intelligence & Inventory Optimization for a Family-Owned Marine Dealership",
    industry: ["small-business", "forecasting", "optimization"],
    techniques: ["XGBoost", "SHAP", "Prophet", "Survival Analysis", "K-Means"],
    heroMetrics: [
      { label: "Faster Inventory Turnover", value: "23%", delta: "+23%" },
      { label: "Avg Pricing Uplift", value: "$2,800", delta: "per unit" },
      { label: "Forecast Accuracy", value: "91%", delta: "monthly" },
    ],
    readingTime: "10 min read",
    stack: ["Python", "XGBoost", "SHAP", "Prophet", "Pandas", "Recharts"],
    summary:
      "Data-driven pricing model and demand forecasting system for a South Texas boat dealership — replacing gut-feel pricing with ML-powered inventory intelligence.",
    outcome:
      "23% faster inventory turnover and $2,800 average pricing uplift through optimized markdown timing and data-driven pricing.",
    thumbnail: "/images/case-studies/gulf-coast-boat-sales-hero.png",
  },
  {
    slug: "harlibot",
    title: "HarliBot",
    subtitle: "Bilingual Municipal AI Chatbot for the City of Harlingen, TX",
    industry: ["government", "nlp"],
    techniques: ["NLP", "Intent Classification", "Bilingual Models"],
    heroMetrics: [
      { label: "Languages Supported", value: "2", delta: "EN + ES" },
      { label: "Availability", value: "24/7" },
      { label: "Integration Points", value: "5+", delta: "city services" },
    ],
    readingTime: "6 min read",
    stack: [
      "Python",
      "AWS Lambda",
      "Dialogflow CX",
      "React",
      "Node.js",
      "NLP",
    ],
    summary:
      "Bilingual municipal AI chatbot deployed for the City of Harlingen, TX — enabling residents to access city services and information in English and Spanish 24/7.",
    outcome:
      "Reduced call center load by handling routine resident inquiries around the clock in both languages.",
    thumbnail: "/images/case-studies/HarliBot.png",
  },
  {
    slug: "market-regime-detector",
    title: "Market Regime Detector",
    subtitle: "Cross-Asset Sentiment-Based Market Regime Classification",
    industry: ["forecasting", "nlp", "classification"],
    techniques: ["FinBERT", "Sentiment Analysis", "HMM", "Time Series"],
    heroMetrics: [
      { label: "Asset Classes", value: "4", delta: "cross-asset" },
      { label: "Lead Time", value: "2-5 days", delta: "vs price-based" },
      {
        label: "Source Documents",
        value: "10K+",
        delta: "processed daily",
      },
    ],
    readingTime: "7 min read",
    stack: [
      "Python",
      "FinBERT",
      "HuggingFace Transformers",
      "AWS SageMaker",
      "Pandas",
      "Plotly",
      "SEC EDGAR API",
    ],
    summary:
      "Sentiment-based cross-asset market regime detection system that classifies market conditions using NLP on financial news, earnings calls, and SEC filings.",
    outcome:
      "Automated regime classification with interpretable signal output; text sentiment leads price-based indicators at major transitions.",
  },
  {
    slug: "spi-beach-resort",
    title: "SPI Beach Resort Analytics",
    subtitle:
      "Revenue Management & Guest Intelligence for a South Padre Island Resort",
    industry: ["hospitality", "time-series", "nlp", "forecasting"],
    techniques: ["Prophet", "BERTopic", "Dynamic Pricing", "NLP"],
    heroMetrics: [
      { label: "Revenue Uplift", value: "$340K", delta: "annual" },
      { label: "Top Complaint Drivers", value: "3", delta: "identified" },
      { label: "Forecast Accuracy", value: "89%", delta: "14-day" },
    ],
    readingTime: "9 min read",
    stack: ["Python", "Prophet", "BERTopic", "Pandas", "Recharts"],
    summary:
      "Revenue management and guest sentiment intelligence for a South Padre Island resort — combining demand forecasting, dynamic pricing simulation, and NLP-driven review analysis.",
    outcome:
      "$340K annual revenue uplift through event-aware dynamic pricing and actionable guest sentiment insights.",
  },
  {
    slug: "gulf-shrimping-operations",
    title: "Gulf Shrimping Operations",
    subtitle:
      "Fleet Optimization & Market Timing for a Commercial Shrimping Fleet",
    industry: ["maritime", "optimization", "time-series", "forecasting"],
    techniques: ["XGBoost", "Route Optimization", "Price Forecasting", "KPI Benchmarking"],
    heroMetrics: [
      { label: "Fuel Savings", value: "$127K", delta: "annual" },
      { label: "Revenue Increase", value: "18%", delta: "year-over-year" },
      { label: "CPUE Spread", value: "2.3x", delta: "top vs bottom" },
    ],
    readingTime: "9 min read",
    stack: ["Python", "XGBoost", "Lifelines", "Pandas", "Recharts"],
    summary:
      "Fleet-wide trip profitability analysis and market timing system for a Gulf of Mexico shrimping operation — optimizing fuel costs, catch-per-unit-effort, and wholesale price timing.",
    outcome:
      "$127K annual fuel savings and 18% revenue increase through route optimization and data-driven hold/sell decisions.",
  },
  {
    slug: "valley-citrus-agriculture",
    title: "Valley Citrus & Agriculture",
    subtitle:
      "Yield Forecasting & Freeze Risk Analytics for Rio Grande Valley Growers",
    industry: ["agriculture", "forecasting", "time-series", "optimization"],
    techniques: ["Random Forest", "SHAP", "Prophet", "Survival Analysis"],
    heroMetrics: [
      { label: "Yield Improvement", value: "$890K", delta: "cooperative-wide" },
      { label: "Water Waste Reduction", value: "42%", delta: "irrigation" },
      { label: "Freeze Warning", value: "11 days", delta: "lead time" },
    ],
    readingTime: "10 min read",
    stack: ["Python", "Random Forest", "SHAP", "Prophet", "Pandas", "Recharts"],
    summary:
      "Yield prediction, irrigation optimization, and freeze risk quantification for a Rio Grande Valley citrus cooperative — turning weather data into actionable farming intelligence.",
    outcome:
      "$890K yield improvement through optimized irrigation scheduling, grower benchmarking, and 11-day freeze early warning system.",
  },
  {
    slug: "south-texas-urgent-care",
    title: "South Texas Urgent Care Network",
    subtitle:
      "Patient Volume Forecasting & No-Show Prediction for a Multi-Clinic Network",
    industry: ["healthcare", "forecasting", "classification", "optimization"],
    techniques: ["XGBoost", "Prophet", "ROC Analysis", "Staffing Optimization"],
    heroMetrics: [
      { label: "Wait Time Reduction", value: "31%", delta: "avg across clinics" },
      { label: "Labor Savings", value: "$215K", delta: "annual" },
      { label: "No-Show Rate", value: "19%", delta: "from 30%" },
    ],
    readingTime: "10 min read",
    stack: ["Python", "XGBoost", "Prophet", "scikit-learn", "Pandas", "Recharts"],
    summary:
      "Patient volume forecasting, no-show prediction, and staffing optimization for a multi-clinic urgent care network in South Texas — reducing wait times and labor costs simultaneously.",
    outcome:
      "31% wait time reduction and $215K annual labor savings through demand-matched staffing and proactive no-show intervention.",
  },
];

export function getCaseStudyBySlug(
  slug: string
): CaseStudyMeta | undefined {
  return caseStudies.find((cs) => cs.slug === slug);
}

export function getAllIndustryTags(): IndustryTag[] {
  const tags = new Set<IndustryTag>();
  caseStudies.forEach((cs) => cs.industry.forEach((tag) => tags.add(tag)));
  return Array.from(tags).sort();
}
