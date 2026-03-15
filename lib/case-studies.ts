import type { CaseStudyMeta, IndustryTag } from "@/types/case-study";

export const caseStudies: CaseStudyMeta[] = [
  /* ── Featured trio (homepage shows first 3) ─────────────────────── */
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
    demoUrl: "https://boats.datasalt.ai",
  },
  {
    slug: "grc-law",
    title: "Garza, Robles & Cantu Law",
    subtitle:
      "NLP-Powered Document Triage & Case Classification for a Personal Injury Firm",
    industry: ["legal", "nlp", "classification"],
    techniques: ["BERT", "spaCy NER", "Textract", "Cross-encoder"],
    heroMetrics: [
      { label: "Intake-to-Assessment", value: "-73%", delta: "time saved" },
      { label: "Classification Accuracy", value: "94.2%", delta: "automated" },
      { label: "Critical Detail Miss Rate", value: "-81%", delta: "reduction" },
    ],
    readingTime: "9 min read",
    stack: ["Python", "BERT", "spaCy", "AWS Textract", "SageMaker", "Clio API"],
    summary:
      "NLP-powered document triage and case classification system for a high-volume personal injury firm — cutting intake-to-assessment time by 73% with bilingual capability.",
    outcome:
      "73% faster intake, 94.2% document classification accuracy, and ~35 paralegal hours freed per week for client-facing work.",
    thumbnail: "/images/case-studies/GRC-law.png",
  },
  {
    slug: "valley-auto-exchange",
    title: "Valley Auto Exchange",
    subtitle:
      "ML-Powered Dynamic Pricing & Inventory Turn Optimization for a Used-Car Lot",
    industry: ["retail", "pricing", "optimization"],
    techniques: ["LightGBM", "XGBoost", "Time-Decay Optimizer", "Selenium"],
    heroMetrics: [
      { label: "Days on Lot", value: "-37%", delta: "58 → 36 days" },
      { label: "Gross Margin per Unit", value: "+$840", delta: "improvement" },
      { label: "Aged Inventory", value: "-71%", delta: "90+ day units" },
    ],
    readingTime: "10 min read",
    stack: [
      "Python",
      "LightGBM",
      "XGBoost",
      "Selenium",
      "FastAPI",
      "React",
      "PostgreSQL",
    ],
    summary:
      "ML-powered dynamic pricing engine and inventory turn optimizer for a South Texas used-car lot — replacing intuition-based pricing with real-time market intelligence.",
    outcome:
      "37% faster inventory turnover, $840 margin improvement per unit, and ~$18,200 annual floorplan interest savings.",
    thumbnail: "/images/case-studies/Valley-Auto-Exchange.png",
  },
  /* ── Remaining studies ──────────────────────────────────────────── */
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
    demoUrl: "https://harlibot.app",
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
    thumbnail: "/images/case-studies/sentiment-regime-detector-card-image.png",
    thumbnailPosition: "left",
    demoUrl: "https://www.market-sentiment.io/",
  },
  {
    slug: "finrag",
    title: "FinRAG",
    subtitle: "Multimodal Financial Document Intelligence Platform",
    industry: ["finance", "rag", "multimodal"],
    techniques: ["RAG", "Multimodal Embeddings", "Hybrid Retrieval", "TTS"],
    heroMetrics: [
      { label: "Query Latency", value: "<2s", delta: "end-to-end" },
      { label: "Doc Types Supported", value: "5+", delta: "multimodal" },
      {
        label: "Retrieval Precision",
        value: "91.4%",
        delta: "top-3 accuracy",
      },
    ],
    readingTime: "8 min read",
    stack: [
      "Python",
      "Google Gemini Embeddings",
      "Google Gemini Flash 2.5",
      "Qdrant",
      "Cloudflare R2",
      "Fly.io",
      "Next.js",
      "Vercel",
    ],
    summary:
      "Multimodal RAG platform for financial document intelligence — querying SEC filings, earnings transcripts, and structured tables with cited, multimodal retrieval.",
    outcome:
      "91.4% retrieval precision across 5+ document types with sub-2-second query latency, powered by native multimodal embeddings.",
    demoUrl: "https://finrag.io",
  },
  {
    slug: "rio-grande-builders",
    title: "Rio Grande Builders",
    subtitle:
      "Lead Scoring & Neighborhood Demand Forecasting for a South Texas Home Builder",
    industry: ["real-estate", "forecasting", "classification"],
    techniques: ["XGBoost", "Prophet", "K-Means", "Gradient Boosting"],
    heroMetrics: [
      { label: "Unsold Inventory", value: "-62%", delta: "reduction" },
      { label: "Lead-to-Close Rate", value: "+34%", delta: "improvement" },
      { label: "Marketing CPA", value: "-28%", delta: "cost savings" },
    ],
    readingTime: "9 min read",
    stack: [
      "Python",
      "XGBoost",
      "Prophet",
      "scikit-learn",
      "Pandas",
      "Recharts",
    ],
    summary:
      "Lead scoring and neighborhood demand forecasting system for a South Texas home builder — replacing spray-and-pray marketing with data-driven land acquisition and buyer targeting.",
    outcome:
      "62% reduction in unsold inventory, 34% lead-to-close improvement, and 28% lower marketing CPA through ML-powered demand intelligence.",
    thumbnail: "/images/case-studies/Rio-Grande-Builders.png",
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
    thumbnail: "/images/case-studies/SPI-Beach-Resort-thumbnail.png",
    demoUrl: "https://resort.datasalt.ai",
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
    thumbnail: "/images/case-studies/shrimp-boat-thumb.png",
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
    thumbnail: "/images/case-studies/south-texas-urgent-care-thumb.png",
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
    thumbnail: "/images/case-studies/citrus-orchard-hero.png",
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
