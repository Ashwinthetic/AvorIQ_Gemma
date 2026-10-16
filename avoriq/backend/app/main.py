"""
AvorIQ Backend — FastAPI Application Entry Point
Initializes database, pulls Ollama models, seeds data, and mounts API routers.
"""

import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup: init DB, pull models, seed data. Shutdown: cleanup."""
    logger.info("=" * 60)
    logger.info("  AvorIQ Backend Starting...")
    logger.info("=" * 60)

    # Step 1: Initialize database + pgvector
    logger.info("[1/4] Initializing database and pgvector extension...")
    from app.database import init_db
    await init_db()
    logger.info("  ✓ Database initialized")

    # Step 2: Warm up the active embedding provider
    logger.info(f"[2/4] Checking embedding provider (primary={os.getenv('EMBEDDING_PRIMARY', 'tei')})...")
    from app.services.tei_service import ensure_tei_ready
    emb_ok = await ensure_tei_ready()
    if emb_ok:
        logger.info("  ✓ Embedding provider ready")
    else:
        logger.warning("  ✗ Embedding provider not ready — search/embedding will fail")

    # Step 3: Ensure Ollama chat model is pulled
    logger.info("[3/4] Checking Ollama chat model...")
    from app.services.ollama_service import ensure_models_ready
    await ensure_models_ready()
    logger.info("  ✓ Ollama ready")

    # Step 4: Seed scholarship data
    logger.info("[4/4] Seeding scholarship data...")
    from app.seed import seed_scholarships
    await seed_scholarships()
    logger.info("  ✓ Data seeded")

    logger.info("=" * 60)
    logger.info("  AvorIQ Backend Ready! → http://localhost:8000")
    logger.info("  API Docs → http://localhost:8000/docs")
    logger.info("  Embeddings: Hugging Face Inference API (bge-m3)")
    logger.info("=" * 60)

    yield  # App is running

    logger.info("AvorIQ Backend shutting down...")


# ── Create FastAPI app ──
app = FastAPI(
    title="AvorIQ API",
    description="AI-powered scholarship intelligence engine for Indian students",
    version="1.0.0",
    lifespan=lifespan,
)

# ── CORS Middleware ──
cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Mount Routers ──
from app.routers.scholarships import router as scholarships_router
from app.routers.chat import router as chat_router
from app.routers.admin import router as admin_router
from app.routers.users import router as users_router

app.include_router(scholarships_router)
app.include_router(chat_router)
app.include_router(admin_router)
app.include_router(users_router)


# ── Health Check ──
@app.get("/api/health")
async def health_check():
    """Health check endpoint for Docker and monitoring."""
    from app.services.ollama_service import check_health as ollama_health
    from app.services.tei_service import check_health as tei_health
    from app.database import engine
    from sqlalchemy import text

    # Check database
    db_status = "healthy"
    try:
        async with engine.connect() as conn:
            await conn.execute(text("SELECT 1"))
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"

    # Check Ollama (chat)
    ollama_status = await ollama_health()

    # Check TEI (embeddings) + HF fallback
    tei_status = await tei_health()
    hf_status = None
    try:
        from app.services.tei_service import hf_check_health
        hf_status = await hf_check_health()
    except Exception:
        hf_status = {"status": "unconfigured"}

    # Overall health depends on whichever embedding backend is primary.
    primary = os.getenv("EMBEDDING_PRIMARY", "tei").lower()
    primary_status = (
        hf_status.get("status") if primary == "hf_api" else tei_status.get("status")
    )

    all_healthy = (
        db_status == "healthy"
        and ollama_status.get("status") == "healthy"
        and primary_status in ("healthy", "loading")
    )

    return {
        "status": "healthy" if all_healthy else "degraded",
        "database": db_status,
        "ollama": ollama_status.get("status", "unknown"),
        "tei": tei_status.get("status", "unknown"),
        "hf_api": hf_status.get("status", "unknown"),
        "embedding_primary": primary,
        "embedding_model": tei_status.get("model", "unknown"),
        "embedding_dim": tei_status.get("dim", 0),
        "models_loaded": ollama_status.get("models", []),
    }
