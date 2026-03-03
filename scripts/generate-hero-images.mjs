#!/usr/bin/env node

/**
 * DataSalt Blog Hero Image Generator
 *
 * Generates branded 1200×630px PNG hero images for blog posts.
 * Uses @napi-rs/canvas for direct pixel rendering.
 *
 * Usage:
 *   node scripts/generate-hero-images.js                              # Generate all
 *   node scripts/generate-hero-images.js --title "T" --slug s --tag t # Generate one
 */

import { createCanvas, loadImage } from "@napi-rs/canvas";
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { parseArgs } from "util";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, "..");
const OUTPUT_DIR = join(PROJECT_ROOT, "public", "images", "blog");
const LOGO_PATH = join(
  PROJECT_ROOT,
  "public",
  "images",
  "logo",
  "datasalt-logo.png"
);

// ── Brand colors (from globals.css oklch → approximate hex) ──
const NAVY = "#1B2A4A";
const NAVY_DARK = "#0F172A";
const TEAL = "#0D9488";

// ── Image manifest ──
const POSTS = [
  {
    slug: "getting-started-with-mlops",
    filename: "getting-started-with-mlops-hero.png",
    tag: "MLOps",
    title: "Getting Started with MLOps: A Practical Guide for Data Teams",
  },
  {
    slug: "10-pipelines-10-industries",
    filename: "10-pipelines-hero.png",
    tag: "Machine Learning",
    title:
      "10 ML Pipelines for 10 Different Industries: What We Learned",
  },
  {
    slug: "predictive-pricing-small-business",
    filename: "predictive-pricing-hero.png",
    tag: "Pricing",
    title:
      "Predictive Pricing for Small Business: Lessons from Boats and Used Cars",
  },
  {
    slug: "nlp-lead-qualification-legal",
    filename: "nlp-lead-qualification-hero.png",
    tag: "NLP",
    title:
      "NLP for Lead Qualification: What a Personal Injury Firm Taught Us About Text Data",
  },
  {
    slug: "seasonal-demand-forecasting",
    filename: "seasonal-forecasting-hero.png",
    tag: "Forecasting",
    title:
      "Forecasting Demand When Your Data Is Seasonal: Resort Occupancy and Healthcare Visits",
  },
  {
    slug: "data-science-stack-smb",
    filename: "ds-stack-smb-hero.png",
    tag: "MLOps",
    title: "The Data Science Stack for Small and Mid-Size Businesses",
  },
  {
    slug: "small-data-ml",
    filename: "small-data-ml-hero.png",
    tag: "Machine Learning",
    title: "When Your Client Has 500 Rows, Not 500 Million",
  },
  {
    slug: "notebook-to-production-checklist",
    filename: "notebook-to-production-hero.png",
    tag: "MLOps",
    title: "From Jupyter Notebook to Production: A Deployment Checklist",
  },
];

// Subtle gradient angle variation per image
const GRADIENT_ANGLES = [135, 150, 120, 145, 130, 155, 125, 140];

// ── Canvas dimensions ──
const W = 1200;
const H = 630;

// ── Text wrapping helper ──
function wrapText(ctx, text, maxWidth) {
  const words = text.split(" ");
  const lines = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const testLine = currentLine + " " + words[i];
    const { width } = ctx.measureText(testLine);
    if (width > maxWidth) {
      lines.push(currentLine);
      currentLine = words[i];
    } else {
      currentLine = testLine;
    }
  }
  lines.push(currentLine);
  return lines;
}

// ── Gradient with angle ──
function drawGradient(ctx, angleDeg) {
  const rad = (angleDeg * Math.PI) / 180;
  const cx = W / 2;
  const cy = H / 2;
  const len = Math.sqrt(W * W + H * H) / 2;

  const x0 = cx - Math.cos(rad) * len;
  const y0 = cy - Math.sin(rad) * len;
  const x1 = cx + Math.cos(rad) * len;
  const y1 = cy + Math.sin(rad) * len;

  const grad = ctx.createLinearGradient(x0, y0, x1, y1);
  grad.addColorStop(0, NAVY);
  grad.addColorStop(0.5, "#0a2a30");
  grad.addColorStop(1, NAVY_DARK);

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);
}

// ── Dot grid overlay ──
function drawDotGrid(ctx) {
  ctx.fillStyle = "rgba(255, 255, 255, 0.06)";
  const spacing = 40;
  const radius = 1.5;

  for (let x = spacing; x < W; x += spacing) {
    for (let y = spacing; y < H; y += spacing) {
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

// ── Main render function ──
async function renderHeroImage(post, index) {
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext("2d");

  // Background gradient
  const angle = GRADIENT_ANGLES[index % GRADIENT_ANGLES.length];
  drawGradient(ctx, angle);

  // Dot grid overlay
  drawDotGrid(ctx);

  // Category tag
  const tagY = 80;
  const tagX = 60;

  ctx.font = "600 16px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  const tagText = post.tag.toUpperCase();
  const tagMetrics = ctx.measureText(tagText);
  const tagPadH = 12;
  const tagPadV = 6;
  const tagW = tagMetrics.width + tagPadH * 2;
  const tagH = 16 + tagPadV * 2;

  // Tag pill background
  ctx.fillStyle = "rgba(13, 148, 136, 0.25)"; // teal at 25%
  ctx.beginPath();
  const tagR = 4;
  ctx.roundRect(tagX, tagY - tagPadV, tagW, tagH, tagR);
  ctx.fill();

  // Tag text
  ctx.fillStyle = TEAL;
  ctx.fillText(tagText, tagX + tagPadH, tagY + 12);

  // Title text
  const titleY = tagY + tagH + 24;
  const titleMaxW = 900;
  const titleFontSize = 44;
  const titleLineHeight = titleFontSize * 1.25;

  ctx.font = `bold ${titleFontSize}px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;
  ctx.fillStyle = "#FFFFFF";
  const lines = wrapText(ctx, post.title, titleMaxW);

  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], tagX, titleY + i * titleLineHeight);
  }

  // Logo watermark (bottom-right, 20% opacity)
  try {
    const logo = await loadImage(LOGO_PATH);
    const logoW = 160;
    const logoH = (logo.height / logo.width) * logoW;
    const logoX = W - logoW - 40;
    const logoY = H - logoH - 40;

    ctx.globalAlpha = 0.2;
    ctx.drawImage(logo, logoX, logoY, logoW, logoH);
    ctx.globalAlpha = 1.0;
  } catch {
    // Logo not found — skip watermark silently
  }

  // Export PNG
  const buffer = canvas.toBuffer("image/png");
  const outPath = join(OUTPUT_DIR, post.filename);
  writeFileSync(outPath, buffer);
  console.log(`  ✓ ${post.filename} (${(buffer.length / 1024).toFixed(0)} KB)`);
}

// ── CLI entry point ──
async function main() {
  // Ensure output directory exists
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Parse CLI args for single-image mode
  const { values } = parseArgs({
    options: {
      title: { type: "string" },
      slug: { type: "string" },
      tag: { type: "string" },
    },
    strict: false,
  });

  if (values.title && values.slug && values.tag) {
    // Single image mode
    const post = {
      title: values.title,
      slug: values.slug,
      filename: `${values.slug}-hero.png`,
      tag: values.tag,
    };
    console.log("Generating single hero image...");
    await renderHeroImage(post, 0);
  } else {
    // Batch mode — generate all
    console.log(`Generating ${POSTS.length} hero images...`);
    for (let i = 0; i < POSTS.length; i++) {
      await renderHeroImage(POSTS[i], i);
    }
  }

  console.log(`\nDone! Images saved to public/images/blog/`);
}

main().catch((err) => {
  console.error("Hero image generation failed:", err);
  process.exit(1);
});
