"""
AvorIQ Backend — Ollama Service
Async HTTP client for Ollama API (embeddings + chat completion).
"""

import httpx
import os
import logging
from typing import AsyncGenerator, overload, Union, Literal

logger = logging.getLogger(__name__)

OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
CHAT_MODEL = os.getenv("CHAT_MODEL", "gemma3:4b")
EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "nomic-embed-text")
if EMBEDDING_MODEL.startswith("BAAI/"):
    EMBEDDING_MODEL = EMBEDDING_MODEL.replace("BAAI/", "")

# Shared async client with generous timeout for CPU inference
_client = httpx.AsyncClient(
    base_url=OLLAMA_BASE_URL,
    timeout=httpx.Timeout(connect=10.0, read=120.0, write=10.0, pool=10.0),
)


async def check_health() -> dict:
    """Check if Ollama is reachable and list loaded models."""
    try:
        resp = await _client.get("/api/tags")
        resp.raise_for_status()
        data = resp.json()
        models = [m["name"] for m in data.get("models", [])]
        return {"status": "healthy", "models": models}
    except Exception as e:
        logger.error(f"Ollama health check failed: {e}")
        return {"status": "unhealthy", "models": [], "error": str(e)}


async def pull_model(model_name: str) -> bool:
    """Pull a model from Ollama registry if not already available."""
    try:
        logger.info(f"Checking if model '{model_name}' is available...")
        health = await check_health()
        available = health.get("models", [])

        # Check if model is already pulled (handle tag variations)
        for m in available:
            if model_name in m or m.startswith(model_name.split(":")[0]):
                logger.info(f"Model '{model_name}' already available as '{m}'")
                return True

        logger.info(f"Pulling model '{model_name}'... This may take a few minutes.")
        async with _client.stream(
            "POST",
            "/api/pull",
            json={"name": model_name},
            timeout=httpx.Timeout(connect=10.0, read=600.0, write=10.0, pool=10.0),
        ) as response:
            response.raise_for_status()
            async for line in response.aiter_lines():
                if line.strip():
                    logger.info(f"  Pull progress: {line.strip()[:120]}")

        logger.info(f"Model '{model_name}' pulled successfully!")
        return True
    except Exception as e:
        logger.error(f"Failed to pull model '{model_name}': {e}")
        return False


async def generate_embedding(text: str) -> list[float]:
    """Generate a 768-dim embedding using nomic-embed-text."""
    try:
        resp = await _client.post(
            "/api/embed",
            json={"model": EMBEDDING_MODEL, "input": text},
        )
        resp.raise_for_status()
        data = resp.json()
        # Ollama /api/embed returns {"embeddings": [[...]]}
        embeddings = data.get("embeddings", [])
        if embeddings and len(embeddings) > 0:
            return embeddings[0]
        return []
    except Exception as e:
        logger.error(f"Embedding generation failed: {e}")
        return []


@overload
async def chat_completion(
    messages: list[dict], stream: Literal[False] = False
) -> str: ...


@overload
async def chat_completion(
    messages: list[dict], stream: Literal[True]
) -> AsyncGenerator[str, None]: ...


@overload
async def chat_completion(
    messages: list[dict], stream: bool
) -> Union[str, AsyncGenerator[str, None]]: ...


async def chat_completion(
    messages: list[dict], stream: bool = False
) -> Union[str, AsyncGenerator[str, None]]:
    """
    Generate a chat completion using Gemma 3 4B.
    
    Args:
        messages: List of {"role": "user"|"system"|"assistant", "content": "..."}
        stream: If True, returns an async generator yielding tokens.
    """
    if stream:
        return _stream_chat(messages)
    else:
        return await _batch_chat(messages)


async def _batch_chat(messages: list[dict]) -> str:
    """Non-streaming chat completion."""
    try:
        resp = await _client.post(
            "/api/chat",
            json={
                "model": CHAT_MODEL,
                "messages": messages,
                "stream": False,
                "options": {
                    "temperature": 0.7,
                    "top_p": 0.9,
                    "num_predict": 512,
                },
            },
        )
        resp.raise_for_status()
        data = resp.json()
        return data.get("message", {}).get("content", "")
    except Exception as e:
        logger.error(f"Chat completion failed: {e}")
        return f"I'm having trouble generating a response right now. Error: {str(e)}"


async def _stream_chat(messages: list[dict]) -> AsyncGenerator[str, None]:
    """Streaming chat completion — yields tokens as they arrive."""
    try:
        async with _client.stream(
            "POST",
            "/api/chat",
            json={
                "model": CHAT_MODEL,
                "messages": messages,
                "stream": True,
                "options": {
                    "temperature": 0.7,
                    "top_p": 0.9,
                    "num_predict": 512,
                },
            },
            timeout=httpx.Timeout(connect=10.0, read=120.0, write=10.0, pool=10.0),
        ) as response:
            response.raise_for_status()
            import json as json_module
            async for line in response.aiter_lines():
                if line.strip():
                    try:
                        chunk = json_module.loads(line)
                        content = chunk.get("message", {}).get("content", "")
                        if content:
                            yield content
                    except Exception:
                        continue
    except Exception as e:
        logger.error(f"Streaming chat failed: {e}")
        yield f"Error generating response: {str(e)}"


async def ensure_models_ready():
    """Pull all required models on startup."""
    logger.info("Ensuring required Ollama models are available...")
    await pull_model(CHAT_MODEL)
    await pull_model(EMBEDDING_MODEL)
    logger.info("All models ready!")
