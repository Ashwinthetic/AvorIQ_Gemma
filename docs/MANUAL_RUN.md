# AvorIQ — Manual Run Guide

> Last updated: 2026-06-19
> Stack: Postgres + pgvector · Ollama (chat LLM) · FastAPI backend · HF Inference API (embeddings)
> Embedding model: `BAAI/bge-m3` (1024-dim, multilingual)

> **Deploying to a real server?** See [`docs/UBUNTU_DEPLOY.md`](./UBUNTU_DEPLOY.md) for a full Ubuntu VPS deployment walkthrough with Caddy TLS, firewall, and hardening.

---

## 1. Prerequisites

| Tool    | Version | Purpose                                       |
|---------|---------|-----------------------------------------------|
| Docker Desktop | Latest  | Runs Postgres, Ollama, and the backend |
| Git     | Any     | Pull the repo                                |
| Node.js | 18+     | Run the frontend                             |
| Python  | 3.12    | Only needed for local venv scripts (optional) |

- **Hugging Face account** with a Read-scoped API token. Get one at <https://huggingface.co/settings/tokens>.
- **~6 GB free disk** for Postgres data + Ollama's `gemma3:4b` model (~3 GB).
- **Stable internet** — first-time Ollama model pull can fail mid-download on flaky networks; retry if it breaks.

---

## 2. First-time setup

```powershell
# 1. Clone the repo (if you haven't already)
git clone https://github.com/adityatomar4877-rgb/AvorIQ.git
cd AvorIQ

# 2. Make sure Docker Desktop is running (system tray icon should be green)
docker info
```

If `docker info` errors with `open //./pipe/dockerDesktopLinuxEngine`, start Docker Desktop and wait ~30s.

---

## 3. Configure the Hugging Face token

> ⚠️ **NEVER paste your HF token into chat or code.** Paste it directly into the `.env` file using a text editor. The `.env` is in `.gitignore`.

```powershell
# Open the backend env file in your editor
notepad avoriq\backend\.env
```

Set `HF_API_TOKEN` to your new Read-scoped token:

```env
HF_API_TOKEN=hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Leave the other vars as-is. Save and close.

---

## 4. Start the backend stack

```powershell
cd avoriq\backend
docker compose up -d
```

This brings up three containers:

| Container         | Port (host) | What it does                                     |
|-------------------|-------------|--------------------------------------------------|
| `avoriq-postgres` | 5432        | Postgres 16 + pgvector extension                 |
| `avoriq-ollama`   | 11435       | Ollama serving `gemma3:4b` for chat              |
| `avoriq-backend`  | 8000        | FastAPI app — embeddings, search, chat, seeding  |

First-time startup takes **2–5 minutes** because Ollama pulls `gemma3:4b` and the backend seeds 20 scholarships with embeddings (each embedding call is ~1–3s on first request while the model warms up).

Watch the logs:

```powershell
docker compose logs -f backend
```

You should see lines like:

```
[1/4] Initializing database and pgvector extension...
  ✓ Database initialized
[2/4] Checking embedding provider (primary=hf_api)...
  ✓ Embedding provider ready
[3/4] Checking Ollama chat model...
  ✓ Ollama ready
[4/4] Seeding scholarship data...
  ✓ Data seeded
  AvorIQ Backend Ready! → http://localhost:8000
```

If a step fails, the logs will say which. Common failures:

- **`HF_API_TOKEN not configured`** — your `.env` doesn't have a token, or the env file wasn't loaded. Check `docker exec avoriq-backend env | grep HF_API_TOKEN`.
- **`HF model is loading`** — first call to a cold model. The API will retry automatically.
- **Ollama `Failed to pull gemma3:4b`** — network blip. Re-run: `docker exec avoriq-ollama ollama pull gemma3:4b`.

---

## 5. Verify it's working

### 5.1 Health check

```powershell
curl http://localhost:8000/api/health
```

Expected (200 OK):

```json
{
  "status": "healthy",
  "database": "healthy",
  "ollama": "healthy",
  "tei": "unhealthy",
  "hf_api": "healthy",
  "embedding_primary": "hf_api",
  "embedding_model": "BAAI/bge-m3",
  "embedding_dim": 1024,
  "models_loaded": ["gemma3:4b"]
}
```

> `tei: "unhealthy"` is expected because we're not running local TEI. The system is using the HF Inference API instead (see `embedding_primary: "hf_api"`).

### 5.2 Vector search

```powershell
curl "http://localhost:8000/api/scholarships/search?query=SC%20girl%20engineering%20Madhya%20Pradesh&limit=3"
```

Expected: a JSON array of scholarships, with `similarity_score` > 0.5 for the top results. Should return the MP Post-Matric, Pragati, or AICTE schemes.

### 5.3 Embedding dim check (database level)

```powershell
docker exec avoriq-postgres psql -U avoriq -d avoriq -c "SELECT vector_dims(embedding) FROM scholarships LIMIT 1;"
```

Expected: `1024`. If you see `768`, your database wasn't reseeded — re-run the seeder (see §7).

### 5.4 Chat (uses Ollama)

```powershell
curl -X POST http://localhost:8000/api/chat -H "Content-Type: application/json" -d '{\"message\":\"hi\",\"stream\":false}'
```

Expected: a friendly greeting from `gemma3:4b` via Ollama.

---

## 6. Start the frontend

In a separate terminal:

```powershell
cd avoriq\frontend
npm install
npm run dev
```

Open <http://localhost:3000>. You should see the AvorIQ landing page. Chat and search now use bge-m3 embeddings.

---

## 7. Re-seed or re-embed

If embeddings ever need to be regenerated (model change, schema change, corruption):

```powershell
# Force re-seed (deletes and re-embeds all 20 scholarships)
docker exec avoriq-backend python -m app.seed --reseed

# Or for batch CSV ingestion (after running the scraper):
python avoriq\scripts\scrape_scholarships.py --output-dir datasets\scholarships
docker exec avoriq-backend python -m app.csv_loader --csv /app/datasets/scholarships/scholarships.csv
```

The seeder is **idempotent** and auto-detects dimension mismatches (e.g. 768 → 1024): if the table's `embedding` column has the wrong dim, it drops and recreates the table before re-embedding.

---

## 8. Switching embedding providers

The code supports two backends and falls back between them. Set `EMBEDDING_PRIMARY` in `avoriq/backend/.env`:

| Value       | Primary backend            | Fallback               | Use when                                       |
|-------------|----------------------------|------------------------|------------------------------------------------|
| `hf_api`    | HF Inference API (cloud)   | Local TEI (if running) | You're on a CPU machine, no GPU               |
| `tei`       | Local TEI container        | HF Inference API       | You have a GPU host and want zero API latency |

**To use local TEI** (GPU host only):

1. Add a `tei` service to `docker-compose.yml`. See git history for the template — the image requires CUDA libraries, so it only works with NVIDIA GPUs.
2. Set `EMBEDDING_PRIMARY=tei` in `.env`.

---

## 9. Common operations

```powershell
# Stop everything
cd avoriq\backend
docker compose down

# Wipe ALL data (postgres + ollama models + embeddings)
docker compose down -v
docker compose up -d

# View live backend logs
docker compose logs -f backend

# Open a shell in the backend container
docker exec -it avoriq-backend bash

# Check what's running
docker ps

# Disk usage of all volumes
docker system df
```

---

## 10. Troubleshooting

### "Connection refused" on localhost:8000
- Backend container hasn't finished starting. Wait ~30s and check `docker compose logs backend`.
- Run `docker ps` — `avoriq-backend` should show status `Up`, not `Restarting`.

### Backend is "degraded" with `ollama: unhealthy`
- Ollama container is starting up. Wait ~30s.
- If persistent: `docker logs avoriq-ollama --tail 30` — look for "model not found" or "out of memory".

### Backend is "degraded" with `hf_api: unhealthy`
- Token is missing or invalid. Verify: `docker exec avoriq-backend env | grep HF_API_TOKEN`
- Token expired. Generate a new one at <https://huggingface.co/settings/tokens>.
- HF model is loading. The API returns `503` during first call — that's normal, retried automatically.

### Embeddings are `[]` (empty) in search results
- HF token missing/wrong. Check the backend logs for `"HF_API_TOKEN not configured"`.
- HF rate limit hit (free tier: ~few hundred requests/hour). Switch `EMBEDDING_PRIMARY=tei` or upgrade your HF plan.

### "no such column: vector" or "type vector has no dimension"
- Database wasn't migrated. The seeder auto-drops/recreates if dim mismatches, but if `init_db` hasn't run:
  ```powershell
  docker exec avoriq-backend python -c "from app.database import init_db; import asyncio; asyncio.run(init_db())"
  docker exec avoriq-backend python -m app.seed --reseed
  ```

### First-time image pulls are failing (CloudFront EOF)
- Retry: `docker compose up -d`. The Docker Hub CDN occasionally throws mid-download on large blobs.
- Or pre-pull with retries: `docker compose pull` (run a few times until no errors).

---

## 11. What's running where

| Port | Service         | What it does                              |
|------|-----------------|-------------------------------------------|
| 3000 | Next.js frontend | The web UI (run with `npm run dev`)      |
| 8000 | FastAPI backend  | REST API + auto-generated docs at `/docs` |
| 5432 | Postgres         | Direct DB access (`psql` or any client)   |
| 11435 | Ollama          | Direct chat completion (POST /api/chat)   |

---

## 12. Key files

| File                                                | What it does                              |
|-----------------------------------------------------|-------------------------------------------|
| `avoriq/backend/.env`                               | Secrets and config (gitignored)           |
| `avoriq/backend/docker-compose.yml`                 | Container definitions                     |
| `avoriq/backend/app/main.py`                        | FastAPI app + lifespan startup            |
| `avoriq/backend/app/services/tei_service.py`        | Embedding client (TEI + HF API + fallback)|
| `avoriq/backend/app/services/ollama_service.py`     | Chat client (Gemma 3 4B)                  |
| `avoriq/backend/app/services/vector_service.py`     | Hybrid search (vector + field-match bonus)|
| `avoriq/backend/app/seed.py`                        | Seeds 20 scholarships with embeddings     |
| `avoriq/backend/app/models.py`                      | SQLAlchemy schema (`Vector(1024)`)        |
| `scripts/setup.ps1`                                 | PowerShell bootstrap (currently uses old Ollama embed flow — run `docker compose up -d` instead) |