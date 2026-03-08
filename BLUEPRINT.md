# OFY AI Career & Opportunity Assistant - Technical Blueprint

## 1. Full System Architecture Diagram (Text Representation)

The architecture follows a modern decoupled full-stack approach, optimized for scalability and AI integration.

```text
[ Client Layer ]
      |
      v (HTTPS / REST / WebSockets)
[ API Gateway / Load Balancer ] (Cloudflare / AWS ALB)
      |
      v
[ Backend Application Layer ] (Node.js / Express)
  |-- Auth Middleware (Supabase JWT validation)
  |-- Rate Limiter (Redis-backed)
  |-- File Processing Service (PDF/DOCX extraction via pdf-parse/mammoth)
  |-- AI Orchestration Service (Gemini API integration)
  |-- Search Service (pgvector queries)
      |
      +--> [ External APIs ]
      |      |-- Google Gemini API (LLM & Embeddings)
      |
      +--> [ Data Persistence Layer ] (Supabase)
             |-- PostgreSQL (Relational Data)
             |-- pgvector (Vector Embeddings)
             |-- Supabase Storage (CV/Document Storage)
             |-- Redis (Caching & Rate Limiting)

[ Background Workers ] (Node.js / BullMQ)
  |-- Scraper Job (Puppeteer/Cheerio -> opportunitiesforyouth.org)
  |-- Embedding Generator Job (Text -> Gemini Embeddings -> pgvector)
```

## 2. Database Schema Design (Supabase / PostgreSQL)

```sql
-- Users Table (Managed by Supabase Auth, extended here)
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    subscription_tier VARCHAR(50) DEFAULT 'free', -- 'free', 'pro', 'premium'
    tokens_used INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Opportunities Table
CREATE TABLE opportunities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_url TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    deadline TIMESTAMPTZ,
    country TEXT,
    category TEXT, -- e.g., 'Scholarship', 'Fellowship', 'Job'
    funding_type TEXT, -- e.g., 'Fully Funded', 'Partial'
    description TEXT NOT NULL,
    raw_html TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Opportunity Embeddings (pgvector)
CREATE EXTENSION IF NOT EXISTS vector;
CREATE TABLE opportunity_embeddings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    opportunity_id UUID REFERENCES opportunities(id) ON DELETE CASCADE,
    embedding vector(768), -- Assuming Gemini embedding size
    chunk_text TEXT NOT NULL
);
CREATE INDEX ON opportunity_embeddings USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- User Documents (CVs, SOPs)
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    document_type VARCHAR(50), -- 'cv', 'sop', 'motivation_letter'
    storage_path TEXT NOT NULL, -- Path in Supabase Storage
    extracted_text TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Reviews & Feedback
CREATE TABLE ai_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    opportunity_id UUID REFERENCES opportunities(id) ON DELETE SET NULL,
    review_type VARCHAR(50), -- 'cv_review', 'essay_improvement'
    structured_feedback JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 3. Opportunity Scraper + Indexing Strategy

**Scraper Architecture:**
- **Tooling:** Node.js with `Cheerio` (for static HTML) or `Puppeteer` (if JS rendering is required).
- **Cron Job:** Run daily via GitHub Actions or a dedicated worker (e.g., BullMQ).
- **Flow:**
  1. Fetch listing pages on `opportunitiesforyouth.org`.
  2. Extract URLs of individual opportunities.
  3. For each URL, check if it exists in the `opportunities` table.
  4. If new or updated, fetch the detail page.
  5. Use a lightweight LLM prompt (Gemini Flash) to extract structured fields (Title, Deadline, Country, Category, Funding Type) from the raw text to ensure high accuracy.
  6. Save to PostgreSQL.

**Indexing Strategy:**
- Once saved, trigger an event to the Embedding Worker.
- Chunk the `description` into overlapping segments (e.g., 500 tokens).
- Call Gemini Embedding API (`text-embedding-004`).
- Store the resulting vectors in `opportunity_embeddings`.

## 4. Embeddings + Vector Search Flow

**User Query Flow:**
1. User types: *"Fully funded masters scholarships in Europe for public health"*
2. Backend receives query and calls Gemini Embedding API to vectorize the query.
3. Backend executes a similarity search in PostgreSQL using `pgvector`:
   ```sql
   SELECT o.id, o.title, o.category, o.funding_type, 1 - (e.embedding <=> $1) AS similarity
   FROM opportunity_embeddings e
   JOIN opportunities o ON e.opportunity_id = o.id
   WHERE o.is_active = TRUE
   ORDER BY e.embedding <=> $1
   LIMIT 10;
   ```
4. Return the top matching opportunities to the frontend.

## 5. Backend API Structure (Node.js / Express)

```text
/api/v1
├── /auth
│   ├── POST /register
│   ├── POST /login
│   └── GET  /me
├── /opportunities
│   ├── GET  /                 # List with pagination & filters
│   ├── GET  /search           # Semantic vector search
│   └── GET  /:id
├── /documents
│   ├── POST /upload           # Upload CV/DOCX (multipart/form-data)
│   ├── GET  /                 # List user documents
│   └── DELETE /:id
├── /ai
│   ├── POST /review-cv        # Trigger CV analysis against an opportunity
│   ├── POST /improve-essay    # Trigger SOP/Essay improvement
│   └── POST /generate-draft   # Generate initial draft based on bullet points
└── /webhooks
    └── POST /stripe           # Handle subscription upgrades
```

## 6. Frontend Component Structure (React / Vite)

```text
src/
├── components/
│   ├── common/          # Button, Input, Modal, ProgressBar, Card
│   ├── layout/          # Sidebar, Header, DashboardLayout
│   ├── opportunities/   # OpportunityCard, SearchBar, FilterPanel
│   ├── documents/       # FileUploader, DocumentList
│   └── ai/              # FeedbackDisplay, ScoreRing, RewriteSuggestionCard
├── pages/
│   ├── Home.tsx         # Landing page
│   ├── Dashboard.tsx    # User overview
│   ├── Search.tsx       # Semantic search interface
│   ├── CVReview.tsx     # Upload CV & select opportunity -> view results
│   └── EssayBuilder.tsx # Interactive editor with AI copilot
├── services/
│   ├── api.ts           # Axios instance & interceptors
│   ├── auth.ts          # Supabase auth wrappers
│   └── ai.ts            # AI specific endpoints
├── store/               # Zustand or Redux for state management
└── utils/               # Formatting, validation schemas (Zod)
```

## 7. Prompt Engineering Framework

### System Prompt (Ethical Guardrails)
```text
You are the OFY AI Career & Opportunity Assistant, an expert career coach and admissions consultant.
Your goal is to help users improve their applications, CVs, and essays.

CRITICAL RULES:
1. NEVER fabricate, invent, or hallucinate experiences, skills, or qualifications for the user.
2. If a user asks you to lie or make up a qualification, politely refuse and suggest how they can highlight their actual strengths.
3. Provide constructive, actionable, and specific feedback.
4. Always output your response in the requested JSON format.
5. Maintain an encouraging, professional, and ethical tone.
```

### CV Analysis Prompt
```text
Analyze the provided CV against the target Opportunity Description.

CV Text:
{cv_text}

Opportunity Description:
{opportunity_text}

Perform a comprehensive review and return the result STRICTLY as a JSON object matching the following schema. Do not include markdown formatting outside the JSON block.
```

### Essay Rewriting Prompt
```text
Review the following essay draft for the specified opportunity.
Identify areas for improvement in clarity, impact, tone, and alignment with the opportunity's goals.
Do not change the underlying facts or experiences. Enhance the narrative flow and professional vocabulary.

Draft: {draft_text}
Opportunity: {opportunity_text}

Return a JSON object containing:
- "overall_feedback": string
- "improved_draft": string
- "key_changes": array of strings explaining what was changed and why.
```

## 8. Example JSON Output Format for CV Review

```json
{
  "match_score": 78,
  "skills_alignment": {
    "matched_skills": ["Project Management", "Data Analysis", "Public Health Policy"],
    "missing_skills": ["Grant Writing", "Biostatistics"]
  },
  "experience_alignment": {
    "strengths": "Strong background in community health initiatives which aligns well with the fellowship's focus on grassroots impact.",
    "weaknesses": "Lacks demonstrated experience in managing international teams, which is a preferred qualification."
  },
  "ats_compatibility_score": 85,
  "section_suggestions": [
    {
      "section": "Professional Experience",
      "current_text": "Managed health programs in local clinics.",
      "suggested_rewrite": "Spearheaded community health programs across 5 local clinics, improving patient outreach by 30%.",
      "reason": "Quantifying achievements increases impact and ATS keyword matching."
    }
  ],
  "ethical_guidance": "Ensure you can speak confidently about the data analysis tools you used, as this is a core requirement for the role."
}
```

## 9. Step-by-Step Build Roadmap

**Phase 1: Foundation (Weeks 1-2)**
- Setup Supabase project (Auth, Database, Storage).
- Initialize React (Vite) frontend and Node.js (Express) backend.
- Implement user authentication flow.
- Setup basic routing and dashboard layout.

**Phase 2: Data Pipeline (Weeks 3-4)**
- Build the Node.js scraper for opportunitiesforyouth.org.
- Implement Gemini API integration for data extraction.
- Setup `pgvector` and the embedding generation pipeline.
- Build the Semantic Search API and frontend interface.

**Phase 3: Core AI Features (Weeks 5-7)**
- Implement file upload (PDF/DOCX) and text extraction.
- Build the CV Review Tool using Gemini Structured Outputs.
- Build the Essay/SOP Assistant interface.
- Implement the Prompt Engineering Framework.

**Phase 4: Polish & Monetization (Weeks 8-9)**
- Refine UI/UX (loading states, progress bars, error handling).
- Integrate Stripe for subscription tiers.
- Implement rate limiting and token usage tracking.
- Security audits (input sanitization, prompt injection defenses).

**Phase 5: Launch (Week 10)**
- Deploy backend to Cloud Run / AWS ECS.
- Deploy frontend to Vercel / Cloudflare Pages.
- Monitor logs and user feedback.

## 10. Scalability Strategy

- **Database:** Supabase (PostgreSQL) handles relational data well. Use connection pooling (PgBouncer) for the backend.
- **Vector Search:** As the opportunities table grows, ensure `ivfflat` or `hnsw` indexes are properly configured and rebuilt periodically in `pgvector`.
- **AI API Limits:** Implement robust retry logic with exponential backoff for Gemini API calls. Use Redis to cache frequent identical queries (e.g., popular search terms).
- **File Processing:** Offload PDF/DOCX parsing to background workers (BullMQ) so the main API thread isn't blocked.
- **CDN:** Serve frontend assets and public documents via Cloudflare.

## 11. Monetization Options (Freemium Model)

**Free Tier:**
- Access to basic semantic search (limited to 10 searches/day).
- 1 basic CV review per month.
- Standard opportunity browsing.

**Pro Tier ($9.99/month):**
- Unlimited semantic searches.
- 10 Advanced CV reviews per month (with section-by-section rewrites).
- AI Essay/SOP Assistant access (up to 20,000 words generated/month).
- Save and track favorite opportunities.

**Premium/Coaching Tier ($29.99/month):**
- Unlimited AI features.
- Priority processing (faster AI response times).
- Export tailored CVs directly to PDF.
- Human-in-the-loop review option (upsell).

## 12. Deployment Guide (Production-Ready)

**Frontend (Vercel / Cloudflare Pages):**
- Connect GitHub repository.
- Set build command: `npm run build`
- Set output directory: `dist`
- Environment variables: `VITE_API_URL`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.

**Backend (Google Cloud Run / AWS App Runner):**
- Containerize the Node.js app using Docker.
- Set environment variables: `DATABASE_URL`, `GEMINI_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `REDIS_URL`.
- Configure auto-scaling (min instances: 1, max instances: 100).
- Attach a custom domain and SSL certificate.

**Database (Supabase):**
- Enable Point-in-Time Recovery (PITR) for backups.
- Set up Row Level Security (RLS) policies to ensure users can only access their own documents and reviews.

**Monitoring:**
- Integrate Sentry for error tracking.
- Use Datadog or Google Cloud Logging for API performance monitoring.
