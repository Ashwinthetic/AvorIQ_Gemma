"""
AvorIQ Backend — Embedding Service
Unified embedding client with fallback chain:

    primary: TEI (local)  ────►  secondary: HF Inference API (cloud)
    primary: HF Inference ────►  secondary: TEI (local)

Chat still goes through `ollama_service`.

Default model: BAAI/bge-m3 (1024-dim, multilingual).

Env vars:
    TEI_BASE_URL           default: http://tei:80
    EMBEDDING_MODEL        default: BAAI/bge-m3
    EMBEDDING_DIM          default: 1024
    HF_API_TOKEN           default: ""   (HF Inference API bearer token)
    HF_API_BASE_URL        default: https://api-inference.huggingface.co
    EMBEDDING_PRIMARY      "tei" | "hf_api"   default: "tei"
"""

import asyncio
import logging
import os

import httpx

logger = logging.getLogger(__name__)

TEI_BASE_URL = os.getenv("TEI_BASE_URL", "http://tei:80")
EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "BAAI/bge-m3")
EMBEDDING_DIM = int(os.getenv("EMBEDDING_DIM", "1024"))

# Hugging Face Inference API (cloud, rate-limited on free tier)
HF_API_TOKEN = os.getenv("HF_API_TOKEN", "")
HF_API_BASE_URL = os.getenv("HF_API_BASE_URL", "https://api-inference.huggingface.co")

# Which provider is tried first. The other one is used as fallback.
EMBEDDING_PRIMARY = os.getenv("EMBEDDING_PRIMARY", "tei").lower().strip()

# TEI client: TEI is fast once the model is loaded, but the first request can take
# ~30–60s on CPU while the model is paged in. Use a generous read timeout.
_tei_client = httpx.AsyncClient(
    base_url=TEI_BASE_URL,
    timeout=httpx.Timeout(connect=10.0, read=120.0, write=10.0, pool=10.0),
)

# HF Inference API: shorter timeouts — if it's going to fail, fail fast and fall back.
_hf_client = httpx.AsyncClient(
    base_url=HF_API_BASE_URL,
    timeout=httpx.Timeout(connect=10.0, read=30.0, write=10.0, pool=10.0),
    headers={"Authorization": f"Bearer {HF_API_TOKEN}"} if HF_API_TOKEN else {},
)


# ── Helpers ────────────────────────────────────────────────────────────────


def _is_rate_limit_or_5xx(exc: Exception) -> bool:
    """Return True if the exception looks like something a fallback could fix."""
    if isinstance(exc, httpx.HTTPStatusError):
        return exc.response.status_code in (408, 429, 500, 502, 503, 504)
    # Network/timeout → also worth falling back
    return isinstance(exc, (httpx.TimeoutException, httpx.ConnectError, httpx.RemoteProtocolError))


# ── TEI backend ────────────────────────────────────────────────────────────


async def tei_check_health() -> dict:
    """Check if local TEI is reachable."""
    try:
        resp = await _tei_client.get("/health")
        resp.raise_for_status()
        return {"status": "healthy", "backend": "tei", "url": TEI_BASE_URL}
    except Exception as e:
        return {"status": "unhealthy", "backend": "tei", "url": TEI_BASE_URL, "error": str(e)}


async def tei_generate_embedding(text: str) -> list[float]:
    """Generate an embedding via local TEI."""
    try:
        resp = await _tei_client.post(
            "/embed",
            json={"inputs": [text]},
            headers={"Content-Type": "application/json"},
        )
        resp.raise_for_status()
        data = resp.json()
        if isinstance(data, list) and data and isinstance(data[0], list):
            return data[0]
        if isinstance(data, list) and data and isinstance(data[0], (int, float)):
            return data
        raise ValueError(f"Unexpected TEI response shape: {type(data)}")
    except Exception as e:
        logger.error(f"TEI embedding failed: {e}")
        raise


async def tei_generate_embeddings_batch(texts: list[str]) -> list[list[float]]:
    """Batch-embed via local TEI."""
    if not texts:
        return []
    resp = await _tei_client.post(
        "/embed",
        json={"inputs": texts},
        headers={"Content-Type": "application/json"},
    )
    resp.raise_for_status()
    data = resp.json()
    if isinstance(data, list) and data and isinstance(data[0], list):
        return data
    raise ValueError(f"Unexpected TEI batch response shape: {type(data)}")


# ── HF Inference API backend ───────────────────────────────────────────────


async def hf_check_health() -> dict:
    """Check if the HF Inference API is reachable and the model is loaded."""
    if not HF_API_TOKEN:
        return {
            "status": "unconfigured",
            "backend": "hf_api",
            "error": "HF_API_TOKEN not set",
        }
    try:
        # POSTing a tiny embed is the cheapest way to know if the model is ready.
        # Inference API returns 503 for "model is loading" — that's still 'reachable'.
        resp = await _hf_client.post(
            f"/pipeline/feature-extraction/{EMBEDDING_MODEL}",
            json={"inputs": "healthcheck"},
        )
        if resp.status_code in (200, 503):
            return {
                "status": "healthy" if resp.status_code == 200 else "loading",
                "backend": "hf_api",
                "model": EMBEDDING_MODEL,
            }
        resp.raise_for_status()
        return {"status": "healthy", "backend": "hf_api", "model": EMBEDDING_MODEL}
    except Exception as e:
        return {
            "status": "unhealthy",
            "backend": "hf_api",
            "model": EMBEDDING_MODEL,
            "error": str(e),
        }


async def hf_generate_embedding(text: str) -> list[float]:
    """Generate an embedding via the Hugging Face Inference API."""
    if not HF_API_TOKEN:
        raise RuntimeError("HF_API_TOKEN not configured")
    resp = await _hf_client.post(
        f"/pipeline/feature-extraction/{EMBEDDING_MODEL}",
        json={"inputs": text, "options": {"wait_for_model": True}},
    )
    resp.raise_for_status()
    data = resp.json()
    # feature-extraction pipeline returns List[List[float]] — one vector per token.
    # We need mean-pooling to get a single sentence vector.
    if not data or not isinstance(data, list):
        raise ValueError(f"Unexpected HF response shape: {type(data)}")
    if isinstance(data[0], list):
        # Tokens: average-pool across tokens
        dim = len(data[0])
        vec = [0.0] * dim
        for token_vec in data:
            for i, v in enumerate(token_vec):
                vec[i] += float(v)
        return [v / len(data) for v in vec]
    if isinstance(data[0], (int, float)):
        return list(data)
    raise ValueError(f"Unexpected HF response inner type: {type(data[0])}")


async def hf_generate_embeddings_batch(texts: list[str]) -> list[list[float]]:
    """Batch-embed via HF Inference API. Inference API doesn't batch natively,
    so we run calls in parallel with a small concurrency cap."""
    if not texts:
        return []
    sem = asyncio.Semaphore(8)

    async def _one(t: str) -> list[float]:
        async with sem:
            try:
                return await hf_generate_embedding(t)
            except Exception as e:
                logger.error(f"HF batch item failed: {e}")
                return []

    return await asyncio.gather(*[_one(t) for t in texts])


# ── Unified facade ─────────────────────────────────────────────────────────


async def check_health() -> dict:
    """Returns health of the primary embedding backend (whichever is active)."""
    if EMBEDDING_PRIMARY == "hf_api":
        primary = await hf_check_health()
        primary["primary"] = "hf_api"
    elif EMBEDDING_PRIMARY == "ollama":
        from app.services.ollama_service import check_health as ollama_health
        primary = await ollama_health()
        primary["primary"] = "ollama"
    else:
        primary = await tei_check_health()
        primary["primary"] = "tei"
    primary["model"] = EMBEDDING_MODEL
    primary["dim"] = EMBEDDING_DIM
    return primary


async def generate_embedding(text: str) -> list[float]:
    """
    Generate an embedding using the configured primary, with transparent
    fallback to the secondary on rate-limit / 5xx / network errors.

    Returns [] if both backends fail.
    """
    if EMBEDDING_PRIMARY == "ollama":
        from app.services.ollama_service import generate_embedding as ollama_embed
        return await ollama_embed(text)

    if EMBEDDING_PRIMARY == "hf_api":
        order = ("hf_api", "tei")
    else:
        order = ("tei", "hf_api")

    for backend in order:
        fn = hf_generate_embedding if backend == "hf_api" else tei_generate_embedding
        try:
            vec = await fn(text)
            if vec and len(vec) == EMBEDDING_DIM:
                return vec
            logger.warning(
                f"{backend} returned wrong dim: got {len(vec) if vec else 0}, "
                f"want {EMBEDDING_DIM}"
            )
        except Exception as e:
            if _is_rate_limit_or_5xx(e) or backend == order[-1]:
                logger.warning(f"{backend} embedding failed ({type(e).__name__}): {e}")
            else:
                logger.warning(f"{backend} embedding failed ({type(e).__name__}): {e}; trying fallback")

    logger.error("All embedding backends failed")
    return []


async def generate_embeddings_batch(texts: list[str]) -> list[list[float]]:
    """Batch-embed with fallback. Returns []-filled list if all backends fail."""
    if not texts:
        return []
    if EMBEDDING_PRIMARY == "ollama":
        from app.services.ollama_service import generate_embedding as ollama_embed
        return await asyncio.gather(*[ollama_embed(t) for t in texts])

    if EMBEDDING_PRIMARY == "hf_api":
        order = ("hf_api", "tei")
    else:
        order = ("tei", "hf_api")

    for backend in order:
        fn = hf_generate_embeddings_batch if backend == "hf_api" else tei_generate_embeddings_batch
        try:
            out = await fn(texts)
            if out and len(out) == len(texts):
                return out
        except Exception as e:
            logger.warning(f"{backend} batch embedding failed: {e}")

    return [[] for _ in texts]


# ── Startup warmup ─────────────────────────────────────────────────────────


async def ensure_tei_ready(max_wait_seconds: int = 120) -> bool:
    """
    Warm up the active primary backend so the first real embedding doesn't
    pay the model-load latency cost.
    """
    if EMBEDDING_PRIMARY == "ollama":
        logger.info("Embedding primary = Ollama. Ensuring model is pulled...")
        from app.services.ollama_service import pull_model
        model_name = EMBEDDING_MODEL
        if model_name.startswith("BAAI/"):
            model_name = model_name.replace("BAAI/", "")
        return await pull_model(model_name)

    if EMBEDDING_PRIMARY == "hf_api":
        logger.info("Embedding primary = HF Inference API. Checking...")
        h = await hf_check_health()
        if h["status"] == "healthy":
            logger.info("  ✓ HF Inference API ready")
            return True
        if h["status"] == "loading":
            logger.info("  HF model is loading — that's fine, will retry per-request")
            return True
        logger.warning(f"  HF Inference API not ready: {h.get('error', 'unknown')}")
        return False

    # Primary = local TEI
    logger.info(f"Ensuring TEI is ready at {TEI_BASE_URL} (model={EMBEDDING_MODEL})...")

    deadline = max_wait_seconds
    interval = 2.0
    elapsed = 0.0

    while elapsed < deadline:
        try:
            resp = await _tei_client.get("/health")
            if resp.status_code == 200:
                logger.info("  ✓ TEI /health returned 200")
                break
        except Exception:
            pass
        await asyncio.sleep(interval)
        elapsed += interval
        if int(elapsed) % 10 == 0:
            logger.info(f"  Waiting for TEI... ({int(elapsed)}s / {deadline}s)")
    else:
        logger.error(f"  TEI did not become healthy within {deadline}s")
        return False

    try:
        logger.info("  Issuing warm-up embed call to load model into memory...")
        await tei_generate_embedding("warmup")
        logger.info(f"  ✓ TEI ready (model={EMBEDDING_MODEL}, dim={EMBEDDING_DIM})")
        return True
    except Exception as e:
        logger.error(f"  Warm-up embed failed: {e}")
        return False
