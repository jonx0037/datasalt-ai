---
title: "NLP for Lead Qualification: What a Personal Injury Firm Taught Us About Text Data"
slug: "nlp-lead-qualification-legal"
description: "Intake forms, medical records, and police reports — all in two languages. How we built an NLP-powered case triage system for a South Texas personal injury firm."
date: "2026-03-17"
readTime: "5 min read"
tags:
  - NLP
  - BERT
  - Legal
  - Classification
hero: "/images/blog/nlp-lead-qualification-hero.png"
---

Personal injury firms run on intake volume. The economics are simple: more leads come in than the firm can take on, and the faster you identify the high-value cases, the better your outcomes. Miss a strong case because it sat in a pile for a week, and you've lost real money. Spend attorney hours on a case that was never viable, and you've lost even more.

Most firms solve this with experienced paralegals who read every intake and make judgment calls. That works — until the volume exceeds what your team can process in a business day, or until your best paralegal takes a vacation.

We built an NLP-powered document triage and case classification system for [Garza, Robles & Cantu Law](/case-studies/grc-law), a personal injury firm in South Texas. The system cut intake-to-assessment time by 73% and hit 94.2% classification accuracy. Here's how — and why the bilingual requirement was the hardest part.

## The Problem: Unstructured, Bilingual, Time-Sensitive

A typical intake at GRC Law involves multiple document types: a client intake form (often handwritten), a police report or incident report, medical records, insurance correspondence, and sometimes photos. These arrive in English, Spanish, or a mix of both — and they need to be triaged into priority buckets within hours, not days.

The firm needed three things from the system:

**Case viability classification.** Given the intake documents, is this likely a strong case, a moderate case, or a low-priority case? This isn't a binary accept/reject — it's a prioritization signal that helps attorneys allocate their time.

**Key detail extraction.** Automatically pull out the critical facts: injury type, liability indicators, insurance status, statute of limitations timeline. These details are scattered across multiple documents and frequently in different languages.

**Bilingual handling that actually works.** Not "translate everything to English first and then process it." Real bilingual handling, where a Spanish-language medical record and an English-language police report about the same incident are understood in relation to each other.

## The Pipeline: OCR → NLP → Classification

### Document Ingestion with AWS Textract

Most intake documents arrive as scans or photos — especially handwritten client forms and faxed medical records. We used AWS Textract for OCR, which handles both printed and handwritten text reasonably well.

The key decision was running Textract with layout preservation rather than raw text extraction. For forms with labeled fields, the spatial relationship between a label ("Tipo de lesión") and its handwritten answer matters. Extracting them as flat text loses that structure.

```python
import boto3

textract = boto3.client('textract')

response = textract.analyze_document(
    Document={'Bytes': document_bytes},
    FeatureTypes=['FORMS', 'TABLES']
)

# Extract key-value pairs from form fields
for block in response['Blocks']:
    if block['BlockType'] == 'KEY_VALUE_SET':
        # Process form field relationships
        pass
```

### Language Detection and Routing

Rather than forcing all documents through a single pipeline, we detect each document's primary language and route it accordingly. This sounds simple, but the edge cases are real: a police report written in English with witness statements in Spanish, or a medical record with English diagnoses and Spanish patient notes.

We used a lightweight language detection model at the paragraph level, not the document level. This lets us tag individual sections and maintain language context through the downstream processing.

### BERT Fine-Tuning on Legal Intake Documents

The classification model is a fine-tuned BERT variant trained on historical intake documents that GRC Law had already assessed and categorized. The training data included roughly 3,200 cases with known outcomes — enough to fine-tune a pretrained model, not enough to train one from scratch.

For the bilingual requirement, we started with a multilingual BERT base (bert-base-multilingual-cased) rather than training separate English and Spanish models. This was a pragmatic choice: separate models would require a reliable document-level language classification upstream, and the mixed-language documents would fall through the cracks.

The fine-tuning process was straightforward:

```python
from transformers import BertForSequenceClassification, Trainer, TrainingArguments

model = BertForSequenceClassification.from_pretrained(
    'bert-base-multilingual-cased',
    num_labels=3  # high, moderate, low priority
)

training_args = TrainingArguments(
    output_dir='./results',
    num_train_epochs=4,
    per_device_train_batch_size=8,
    learning_rate=2e-5,
    weight_decay=0.01,
    evaluation_strategy='epoch',
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=val_dataset,
)
```

The 94.2% classification accuracy is on a held-out test set stratified by case outcome. More importantly, the model's errors skewed conservative — it was more likely to flag a low-priority case as moderate than to miss a high-priority case entirely. For a law firm, that's the right failure mode.

## Why Bilingual NLP Is Harder Than It Looks

The biggest technical challenge wasn't the classification model. It was getting bilingual text processing to work reliably on legal documents.

**Legal Spanish is not conversational Spanish.** Medical terminology, legal phrasing, and regional vocabulary in South Texas legal documents don't match the distribution that most multilingual models were trained on. "Lesión cervical por latigazo" (cervical whiplash injury) is domain-specific language that a general-purpose model handles poorly without fine-tuning.

**Code-switching is constant.** In the Rio Grande Valley, it's common for a single document to switch between English and Spanish mid-paragraph — or even mid-sentence. A client might describe their accident in Spanish but refer to the insurance company by its English name and use English legal terms they've picked up. The NLP pipeline needs to handle this gracefully rather than treating it as noise.

**Named entity recognition across languages.** Extracting the name of a treating physician from a Spanish medical record and matching it to the same physician referenced in an English insurance letter requires cross-lingual entity resolution. Off-the-shelf NER models struggle with this, especially for names common in South Texas (where the same name might appear in both English and Spanish documents with slightly different formatting).

We addressed these challenges with targeted data augmentation during fine-tuning — specifically, creating synthetic training examples with code-switching patterns that matched the firm's actual document distribution. This was more effective than increasing the overall training set size.

## The Detail Extraction Layer

Beyond case classification, the system extracts structured data from unstructured documents using a combination of Textract form parsing and spaCy-based NER:

**Injury type and severity** — extracted from medical records and mapped to a standardized taxonomy the firm uses for case valuation.

**Liability indicators** — keywords and phrases from police reports that signal clear liability, comparative fault, or contested liability.

**Timeline facts** — dates of incident, first medical treatment, and statute of limitations deadline. This last one is critical: if the system flags a case where the statute is approaching, it gets escalated immediately, regardless of other classification signals.

**Insurance status** — whether the at-fault party has identifiable insurance, extracted from incident reports and client intake forms.

These extracted fields populate a structured case summary that the attorney sees alongside the model's priority classification. The attorney never has to read the raw documents for initial triage — they review the structured summary and the model's recommendation, then decide whether to pull the full file.

## Results and What They Mean

The 73% reduction in intake-to-assessment time came from eliminating the first-pass manual review entirely. Cases that previously sat in the queue for 1-3 days waiting for paralegal review now receive classification and summary within minutes of document upload.

The 81% reduction in critical detail miss rate was arguably more valuable. The system catches statute-of-limitations deadlines and liability signals that occasionally slipped through manual review during high-volume periods.

The lesson for other professional services firms: if your intake process involves reading unstructured documents and making classification decisions, NLP can handle the first pass. Not perfectly — but faster and more consistently than a human team at scale, especially when fatigue and volume are factors.

And if your client base operates in two languages, don't bolt on translation as an afterthought. Build bilingual processing into the pipeline's core from day one.

<DemoCallout
  title="See the Intake Pipeline in Action"
  description="Submit a sample matter and watch AI classify, assess risk, and recommend attorney assignment — the same pipeline we built for GRC Law."
/>

*Read the full case study: [Garza, Robles & Cantu Law](/case-studies/grc-law). Or [start with a discovery call](/contact).*
