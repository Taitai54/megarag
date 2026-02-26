# AGENTS.md
 
This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Common commands
- Install deps: `npm install`
- Dev server: `npm run dev` (defaults to http://localhost:3000)
- Build: `npm run build`
- Start prod server: `npm start`
- Lint: `npm run lint`
- Pipeline smoke test (requires dev server running): `bash scripts/test-pipeline.sh`  
  - Creates `scripts/test-files/*`, uploads them, polls `/api/status/:id`, and runs a sample query.
- Note: there is no unit-test runner configured in `package.json`.

## Configuration
- Copy `.env.example` → `.env.local` and fill:
  - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
  - `GOOGLE_AI_API_KEY`
  - `ENCRYPTION_KEY` (required for white-label API key storage)
- Optional tuning (from `.env.example`): `CHUNK_SIZE_TOKENS`, `CHUNK_OVERLAP_TOKENS`, `ENABLE_ENTITY_EXTRACTION`, `MAX_FILE_SIZE_MB`.

## High-level architecture
- **Next.js App Router** lives in `src/app`:
  - UI pages: landing (`/`), dashboard (`/dashboard`), chat (`/dashboard/chat`), explorer (`/dashboard/explorer`), and admin screens under `/admin`.
  - API routes under `src/app/api` handle upload, query, documents CRUD, chat sessions, etc.
- **Core pipeline + RAG logic** in `src/lib`:
  - `processing/` contains the file-type router and processors (text, document, image, video, audio) plus entity extraction.
  - `gemini/` wraps Gemini client + embedding generation.
  - `rag/` holds retrieval modes (naive/local/global/hybrid/mix) and response generation.
  - `supabase/` has browser/server clients (anon vs service-role).
- **Data/storage**:
  - Supabase Postgres + pgvector store documents, chunks, entities, relations, and chat history.
  - Storage bucket holds original files.
  - Schema/functions live in `supabase/*.sql` (see `supabase/core_schema.sql`, `supabase/white_label_schema.sql`).
- **External services**:
  - Google Gemini for content extraction, embeddings, and answer generation.
  - Docling service (FastAPI) for structured doc parsing (documented in `ARCHITECTURE.md`).

## References
- `ARCHITECTURE.md` for system diagrams and end-to-end data flow.
- `API_DOCUMENTATION.md` for Admin + V1 API endpoints and auth flows.
