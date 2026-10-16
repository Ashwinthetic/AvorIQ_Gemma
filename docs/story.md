# AvorIQ: The AI-Powered Benefits Navigator & Student Second Brain

## Inspiration

Every year, millions of students at High School, Undergraduate (UG), and Postgraduate (PG) levels make critical, life-altering decisions using fragmented information. They rely on hearsay, ad-heavy blogs, random YouTube videos, and advice from acquaintances.

The problem is particularly acute in the financial aid and scholarship space. Sifting through hundreds of disconnected websites, dealing with dense bureaucratic rules, and trying to separate genuine institutional support from phishing scams is exhausting.deserving students miss out on scholarships simply because they missed a hidden deadline, misunderstood an eligibility clause, or fell victim to a scam registry.

We wanted to build a platform that does not just answer queries, but acts as a trusted **Benefits Navigator** and academic companion. We asked:
> Can we build a hybrid AI system that is conversational enough to understand a student’s story, but mathematically precise enough to verify eligibility and detect scams?

That question led to **AvorIQ**.

---

## What it Does (Our Core USP)

AvorIQ is a personalized educational second brain and benefits navigator. Instead of treating every student the same, it continuously adapts recommendations and matches scholarships to each student's unique academic and socioeconomic profile.

The **Core USP** of AvorIQ lies in its **Hybrid Safety & Matching Architecture**:
1. **Scam Prevention & Trust Classification:** It programmatically scores the trustworthiness of scholarship listings. If a link doesn't originate from a verified educational domain (e.g., `.edu`, `.ac.in`) or a government domain (e.g., `.gov`, `.gov.in`), it is flagged or filtered out. This protects students from data-harvesting or financial scams.
2. **Deterministic Demographic Scoring:** While conversational models are great at chat, they are notoriously prone to math errors and criteria hallucinations. AvorIQ separates the conversation (handled by AI) from the eligibility check (handled by a strict, mathematical matching engine). It scores profiles against rules (domicile state, income caps, caste categories, academic streams, and genders) with zero margin for error.
3. **Application Tracking Lifecycle:** Students don't just find scholarships; they manage their documents, track application milestones (Saved → Verified → Applied → Approved → Funds Received), and celebrate milestones with reward confetti.
4. **Under-Calibration AI Suite:** In addition to matching, the monorepo is built to host a local AI Study Planner and Exam Assistant, currently being tuned to prevent model drift and hallucination.

---

## How We Built It (The Technical Reality)

AvorIQ is built as a highly structured, scalable monorepo divided into two main layers:

```mermaid
graph TD
    A[User Profile Questionnaire & Chat] --> B[FastAPI Backend / Profile Memory]
    B -->|Regex & NLP Extraction| C[User Profile Signals]
    D[Web Portals & Aggregators] -->|scrape_scholarships.py| E[Raw Scholarship Dataset]
    E --> F[Authenticity Scoring Engine]
    F -->|Heuristics & Suffix Filters| G[Trust-Scored Catalog]
    C --> H[Matching & Eligibility Engine]
    G --> H
    H -->|Multi-Attribute Scoring| I[Curated Dashboard / Recommendations]
    B -->|Semantic Context| J[Ollama: Gemma 3 4B]
    J -->|Conversational RAG (Under Calibration)| K[AI Chat Assistant Output]
```

### 1. The Frontend (Next.js 16 + React 19 + Tailwind CSS)
* **Design Language:** A striking Bauhaus Neo-Brutalist interface using charcoal dark modes, bold terracotta accents, uppercase typography, and thick border shadows.
* **Offline Resilience:** Since student internet connections can be unstable, the frontend incorporates local storage caching and client-side fallback matching (`parseAndMatch` token matcher) so the application remains fast and operational even when the backend is offline.
* **Animations:** Framer Motion for smooth modal overlays and Canvas Confetti for task completion feedback.

### 2. The Backend & Data Scrapers (FastAPI + Python + SQLite)
* **Custom Scraper (`scrape_scholarships.py`):** Automatically aggregates scholarship records, normalizes data fields (deadlines, rewards, eligibility), and exports them into structured JSONL/CSV registries.
* **Authenticity Scoring (`authenticity.py`):** Evaluates listing safety based on suffix analysis (`.gov.in`, `.nic.in`, `.ac.in`), link structure, and description density to output an Authenticity Score (0-100).
* **Profile Memory (`profile_memory.py`):** Parses user messages to extract demographic tags (age, state, stream, gender, income) and updates the student profile dynamically.

### 3. Local AI Engine (Ollama + Gemma 3 4B)
* Runs a local instance of the **Gemma 3 4B** chat model and **Nomic Embed Text** for retrieval-augmented generation (RAG) using PostgreSQL with the `pgvector` extension.

---

## Challenges We Ran Into

### 1. The Danger of AI Hallucinations in Financial Aid
If an AI model misleads a student about a deadline, an income cap, or a document checklist, the student might lose their chance at funding. We realized we **could not trust raw LLMs** to do the matching. 
* *The Solution:* We designed a hybrid model. The LLM only interprets the conversational intent, while a deterministic Python/TypeScript engine performs the actual eligibility calculation.

### 2. Messy, Unstructured Scraped Web Data
Scholarship sites have notoriously inconsistent HTML formatting, broken links, and outdated deadlines.
* *The Solution:* We wrote a strict parsing parser that normalizes scraped data fields, checks domain suffix trees, and scores details. If critical fields are missing, the scholarship is flagged for manual review rather than showing faulty data.

### 3. Backend Portability and Offline Development
Setting up local databases, pgvector, and heavy LLM models can prevent easy developer setup.
* *The Solution:* We built a complete frontend preview mode backed by `localStorage` that mimics the entire database workflow, allowing developers and reviewers to test the core features instantly without local database dependencies.

---

## Accomplishments We're Proud Of

1. **Scam Filtering Engine:** We successfully implemented a trust heuristic that helps protect students from scholarship registry scams by verifying domain origins.
2. **Brutalist Design Execution:** We broke away from generic, boring SaaS gradients and created a bold Bauhaus Neo-Brutalist visual identity that feels fresh and premium.
3. **Robust Monorepo Structure:** The backend and frontend are built to scale, allowing new data sources and scrapers to be added with minimal configuration.

---

## What We Learned

Building AvorIQ taught us that **responsible AI is deterministic AI where it matters**. In high-stakes applications like public benefits and financial aid, generative models must be heavily bounded by rule-based guardrails. AI is great at making the experience conversational, but classic code logic must handle the mathematical validation and safety verifications.

---

## What's Next for AvorIQ

1. **Full Calibration of local LLM RAG:** Finish tuning embeddings and prompts on local CPU setups to reduce latency.
2. **Skill-to-Career Mapping:** Integrate the Career Navigator module to map skills from high school straight through to employment pathways.
3. **Universal Portal Syncing:** Allow students to download auto-filled templates of official application forms, streamlining the bureaucratic submission process.
