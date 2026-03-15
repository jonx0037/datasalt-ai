---
title: "Your Embeddings Can't Read. That's the Problem."
date: 2026-04-14
category: NLP
excerpt: "Text-only pipelines miss half the information in most real-world documents. Here's why multimodal embeddings — and Google Gemini specifically — change the equation."
tags: [RAG, NLP, Embeddings, Finance]
hero: "/images/blog/multimodal-embeddings-gemini-hero.png"
---

When we say a RAG pipeline "reads" a document, we're being generous. What it actually does is chunk the text, embed the chunks, and retrieve the ones whose embeddings are closest to the query. That works reasonably well when the document is mostly prose.

Most real-world documents are not mostly prose.

Financial filings have tables. Medical records have structured forms. Technical reports have charts, diagrams, and figures. Research papers have equations rendered as images. If your embedding model only handles text, everything else — every table, every chart, every diagram — either gets dropped entirely or gets passed through a conversion step that loses most of what made it useful. You're not building a document intelligence system. You're building a text extraction system that pretends documents don't have structure.

That distinction matters more than most RAG tutorials will tell you.

## The Standard Workaround (And Why It's Not Good Enough)

The common fix is to add a vision model upstream. Extract the images and tables, pass them through GPT-4o or a similar model, generate captions and descriptions, then embed the captions as text alongside the original prose chunks.

This sounds reasonable. In practice, it introduces three problems.

First, it's lossy. A chart showing quarterly revenue by segment across five years contains specific numbers, trend lines, and comparative relationships. The caption "Revenue increased across all segments in Q3 and Q4" captures the gist but loses the data. If a user asks "What was APAC revenue in Q2?", the caption can't answer that — the number was in the chart, not the caption.

Second, it's a separate pipeline. Vision captioning runs as a preprocessing step, independent of retrieval. The caption and the original image are represented in different ways that can't be compared directly. Semantic similarity between a text query and a generated caption is not the same as semantic similarity between a query and the actual visual content.

Third, it doubles your infrastructure complexity. Now you're managing two APIs, two error modes, two cost centers, and a dependency chain in which failures in captioning silently degrade downstream retrieval quality.

There's a cleaner approach.

## One Model, One Vector Space

Google Gemini Embeddings 2 preview does something architecturally different: it embeds text, images, and structured content into the *same* vector space natively. No captioning step. No intermediary. A table is embedded as a table. A chart is embedded as a chart. A prose paragraph is embedded as prose. And all three are comparable — you can compute cosine similarity between a text query and an embedded chart image directly, because they live in the same 3072-dimensional space.

This isn't just an engineering convenience. It's a fundamentally different semantic model. When you query "What drove the margin compression in Q3?", the retrieval step can surface a table of segment-level margins, a chart showing cost breakdowns, and the CFO's commentary from the earnings call — ranked by actual relevance — because all three are embedded in the same space and scored against the same query vector.

With a text-only pipeline and vision captioning, you'd get the CFO's commentary and a vague caption about a cost breakdown chart. Not the same thing.

## What This Looks Like in Practice

We built [FinRAG](https://finrag.io) — a multimodal financial document intelligence platform — around this architecture. The corpus includes SEC 10-K and 10-Q filings, earnings call transcripts, and proxy statements. The ingestion pipeline separates documents into three chunk types: prose, serialized table markdown, and figure images. All three go through Gemini Embeddings 2 preview. All three land in the same [Qdrant](https://qdrant.tech) collection, with a `chunk_type` field in the payload for filtered retrieval.

The difference in answer quality on table-heavy queries is not marginal. It's the difference between answering the question and not answering it.

For example: "What was the effective tax rate excluding one-time items for FY2024?"

- **Text-only pipeline:** Retrieves prose mentions of "effective tax rate" from the MD&A section. Returns the headline rate, not the adjusted figure, because the reconciliation table never made it into the index.
- **Multimodal pipeline:** Retrieves the reconciliation table directly. Returns the adjusted rate with the correct line items cited.

That's not a subtle improvement. That's the system working versus not working.

## The Business Payoff

If you're not an ML engineer, here's what this means in plain terms: the documents your organization produces and receives are full of information that standard AI tools can't access. Spreadsheets, slide decks, scanned reports, PDF forms — the majority of enterprise knowledge doesn't live in clean prose. It lives in structured layouts that text-only models treat as noise.

Multimodal embeddings unlock that information for retrieval. They make the question "What does this document say about X?" actually answerable — regardless of whether X lives in a paragraph, a table, or a chart on page 47.

For financial analysis, legal review, medical records, and any other domain where document structure carries meaning, this is the architecture that should be the default. Text-only RAG isn't wrong — it's just incomplete.

## One Caveat Worth Naming

Native multimodal embeddings are newer, and the model landscape is still evolving. Gemini Embeddings 2 preview is, as the name suggests, a preview model — production use requires monitoring for model updates and API changes. The retrieval precision gains are real, but so is the dependency on a provider-specific model with a versioning cadence you don't control.

That's a manageable tradeoff for most use cases. It's worth naming so you go in with eyes open.

---

*FinRAG is live at [finrag.io](https://finrag.io) — query a curated corpus of SEC filings and earnings transcripts with multimodal retrieval and cited answers. See the full architecture in our [FinRAG case study](https://www.datasalt.ai/case-studies/finrag), or [start a conversation](https://www.datasalt.ai/contact) about what a multimodal document intelligence system could look like for your organization.*
