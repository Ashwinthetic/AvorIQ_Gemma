"""
AvorIQ Backend — Gemma 4 API Service
Async client for the Google Gemma 4 API with full support for Google Generative
Language API and OpenAI-compatible inference gateways.

Supported Verified Gemma 4 Models:
    - gemma-4-31b-it      (31B dense instruction-tuned reasoning model)
    - gemma-4-26b-a4b-it  (26B mixture-of-experts model)
    - gemma-4-E4B-it      (4B edge multimodal model)
    - gemma-4-E2B-it      (2B edge lightweight model)

Environment Variables:
    GEMMA_API_KEY          API key for authentication (fallback: GOOGLE_API_KEY, GEMINI_API_KEY)
    GEMMA_MODEL            Model identifier (default: "gemma-4-31b-it")
    GEMMA_API_BASE_URL     Base URL (default: "https://generativelanguage.googleapis.com/v1beta")
    GEMMA_TEMPERATURE      Sampling temperature (default: 0.7)
    GEMMA_TOP_P            Top-p sampling parameter (default: 0.9)
    GEMMA_MAX_OUTPUT_TOKENS Maximum generation tokens (default: 2048)
    GEMMA_TIMEOUT_SECONDS  Request timeout in seconds (default: 60.0)
"""

import json
import logging
import os
from typing import AsyncGenerator, Optional, Union, Literal, overload

import httpx

logger = logging.getLogger(__name__)

# ── Verified Model Registry ─────────────────────────────────────────────────

VERIFIED_GEMMA_4_MODELS = {
    "gemma-4-31b-it",
    "gemma-4-26b-a4b-it",
    "gemma-4-E4B-it",
    "gemma-4-E2B-it",
}

DEFAULT_MODEL = "gemma-4-31b-it"

# ── Environment Configuration ───────────────────────────────────────────────

GEMMA_API_KEY = (
    os.getenv("GEMMA_API_KEY")
    or os.getenv("GOOGLE_API_KEY")
    or os.getenv("GEMINI_API_KEY")
    or ""
).strip()

GEMMA_MODEL = os.getenv("GEMMA_MODEL", DEFAULT_MODEL).strip()

GEMMA_API_BASE_URL = os.getenv(
    "GEMMA_API_BASE_URL",
    "https://generativelanguage.googleapis.com/v1beta",
).rstrip("/")

GEMMA_TEMPERATURE = float(os.getenv("GEMMA_TEMPERATURE", "0.7"))
GEMMA_TOP_P = float(os.getenv("GEMMA_TOP_P", "0.9"))
GEMMA_MAX_OUTPUT_TOKENS = int(os.getenv("GEMMA_MAX_OUTPUT_TOKENS", "2048"))
GEMMA_TIMEOUT_SECONDS = float(os.getenv("GEMMA_TIMEOUT_SECONDS", "60.0"))

# Shared async client configured with timeouts matching backend standards
_client = httpx.AsyncClient(
    timeout=httpx.Timeout(
        connect=10.0,
        read=GEMMA_TIMEOUT_SECONDS,
        write=10.0,
        pool=10.0,
    ),
)


# ── Internal Helper Functions ──────────────────────────────────────────────


def _mask_secret(secret: str) -> str:
    """Mask sensitive string for safe logging."""
    if not secret:
        return "<not-set>"
    if len(secret) <= 8:
        return "***"
    return f"{secret[:4]}...{secret[-4:]}"


def _is_google_api(base_url: str) -> bool:
    """Check if target endpoint is Google's Generative Language API."""
    return "googleapis.com" in base_url.lower()


def _normalize_model_name(model_name: str) -> str:
    """Normalize model identifier stripping any leading prefix."""
    clean = model_name.strip()
    if clean.startswith("models/"):
        return clean.replace("models/", "", 1)
    return clean


def _get_headers(is_google: bool) -> dict[str, str]:
    """Build headers without exposing tokens in log traces."""
    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
    }
    if GEMMA_API_KEY:
        if is_google:
            headers["x-goog-api-key"] = GEMMA_API_KEY
        else:
            headers["Authorization"] = f"Bearer {GEMMA_API_KEY}"
    return headers


def format_messages_for_google(messages: list[dict]) -> dict:
    """
    Format standard chat messages into Google Generative Language API payload.

    Args:
        messages: List of {"role": "system"|"user"|"assistant"|"ai", "content": "...", "images": [...]}

    Returns:
        Dictionary payload conforming to Google Generative Language API schema.
    """
    contents: list[dict] = []
    system_instruction_parts: list[dict] = []

    for msg in messages:
        role = msg.get("role", "user").lower()
        content = msg.get("content", "")
        images = msg.get("images", [])

        if role == "system":
            if content:
                system_instruction_parts.append({"text": content})
            continue

        api_role = "model" if role in ("assistant", "ai") else "user"
        parts: list[dict] = []

        if content:
            parts.append({"text": content})

        # Multimodal image attachment support (base64)
        if images and isinstance(images, list):
            for img_b64 in images:
                if img_b64:
                    parts.append({
                        "inlineData": {
                            "mimeType": "image/jpeg",
                            "data": img_b64,
                        }
                    })

        if parts:
            contents.append({"role": api_role, "parts": parts})

    payload: dict = {
        "contents": contents,
        "generationConfig": {
            "temperature": GEMMA_TEMPERATURE,
            "topP": GEMMA_TOP_P,
            "maxOutputTokens": GEMMA_MAX_OUTPUT_TOKENS,
        },
    }

    if system_instruction_parts:
        payload["systemInstruction"] = {"parts": system_instruction_parts}

    return payload


def extract_google_text(data: dict) -> str:
    """Extract and normalize candidate text from Google Generative Language API response."""
    candidates = data.get("candidates")
    if not candidates or not isinstance(candidates, list) or len(candidates) == 0:
        prompt_feedback = data.get("promptFeedback", {})
        block_reason = prompt_feedback.get("blockReason")
        if block_reason:
            return f"Response blocked by safety filters: {block_reason}"
        return ""

    first_candidate = candidates[0]
    content = first_candidate.get("content", {})
    parts = content.get("parts", [])

    extracted = []
    for part in parts:
        if isinstance(part, dict) and "text" in part:
            extracted.append(part["text"])

    return "".join(extracted)


def extract_openai_text(data: dict) -> str:
    """Extract and normalize content from OpenAI-compatible API response."""
    choices = data.get("choices", [])
    if not choices or not isinstance(choices, list):
        return ""
    message = choices[0].get("message", {})
    return message.get("content", "") or ""


# ── Public Service Functions ────────────────────────────────────────────────


async def check_health() -> dict:
    """
    Check if Gemma 4 API configuration and credentials are ready.
    Safe: Never exposes API keys or secrets in the return payload or logs.
    """
    model = _normalize_model_name(GEMMA_MODEL)
    is_google = _is_google_api(GEMMA_API_BASE_URL)

    if not GEMMA_API_KEY:
        return {
            "status": "unhealthy",
            "service": "gemma_api",
            "model": model,
            "error": "Missing credentials: GEMMA_API_KEY or GOOGLE_API_KEY is not set",
            "key_configured": False,
        }

    try:
        if is_google:
            url = f"{GEMMA_API_BASE_URL}/models/{model}"
            resp = await _client.get(
                url,
                headers=_get_headers(is_google=True),
                timeout=10.0,
            )
        else:
            url = f"{GEMMA_API_BASE_URL}/models"
            resp = await _client.get(
                url,
                headers=_get_headers(is_google=False),
                timeout=10.0,
            )

        if resp.status_code == 200:
            return {
                "status": "healthy",
                "service": "gemma_api",
                "model": model,
                "endpoint": GEMMA_API_BASE_URL,
                "key_configured": True,
            }
        else:
            return {
                "status": "degraded",
                "service": "gemma_api",
                "model": model,
                "status_code": resp.status_code,
                "error": f"API responded with status code {resp.status_code}",
                "key_configured": True,
            }
    except Exception as e:
        logger.warning(f"Gemma 4 API health check warning: {e}")
        return {
            "status": "unhealthy",
            "service": "gemma_api",
            "model": model,
            "error": str(e),
            "key_configured": True,
        }


@overload
async def chat_completion(
    messages: list[dict], stream: Literal[False] = False, model: Optional[str] = None
) -> str: ...


@overload
async def chat_completion(
    messages: list[dict], stream: Literal[True], model: Optional[str] = None
) -> AsyncGenerator[str, None]: ...


@overload
async def chat_completion(
    messages: list[dict], stream: bool, model: Optional[str] = None
) -> Union[str, AsyncGenerator[str, None]]: ...


async def chat_completion(
    messages: list[dict],
    stream: bool = False,
    model: Optional[str] = None,
) -> Union[str, AsyncGenerator[str, None]]:
    """
    Generate a chat completion using Gemma 4.
    Matches the existing AvorIQ chat completion interface and response normalization.

    Args:
        messages: List of {"role": "user"|"system"|"assistant", "content": "..."}
        stream: If True, returns an async generator yielding tokens as they arrive.
        model: Optional model identifier override.

    Returns:
        String response if stream=False, or AsyncGenerator[str, None] if stream=True.
    """
    target_model = _normalize_model_name(model or GEMMA_MODEL)

    if stream:
        return _stream_chat(messages, target_model)
    else:
        return await _batch_chat(messages, target_model)


async def _batch_chat(messages: list[dict], model: str) -> str:
    """Non-streaming chat completion with comprehensive error handling."""
    if not GEMMA_API_KEY:
        logger.error("Gemma 4 API call attempted without GEMMA_API_KEY or GOOGLE_API_KEY")
        return "Gemma 4 service is not configured: Missing GEMMA_API_KEY environment variable."

    is_google = _is_google_api(GEMMA_API_BASE_URL)

    try:
        logger.info(f"Dispatching Gemma 4 batch completion request (model='{model}')")

        if is_google:
            url = f"{GEMMA_API_BASE_URL}/models/{model}:generateContent"
            payload = format_messages_for_google(messages)
        else:
            url = f"{GEMMA_API_BASE_URL}/chat/completions"
            payload = {
                "model": model,
                "messages": messages,
                "stream": False,
                "temperature": GEMMA_TEMPERATURE,
                "top_p": GEMMA_TOP_P,
                "max_tokens": GEMMA_MAX_OUTPUT_TOKENS,
            }

        resp = await _client.post(
            url,
            json=payload,
            headers=_get_headers(is_google),
            timeout=GEMMA_TIMEOUT_SECONDS,
        )

        if resp.status_code != 200:
            error_detail = f"HTTP {resp.status_code}"
            try:
                err_json = resp.json()
                api_msg = err_json.get("error", {}).get("message")
                if api_msg:
                    error_detail = f"{error_detail}: {api_msg}"
            except Exception:
                error_detail = f"{error_detail}: {resp.text[:150]}"
            logger.error(f"Gemma 4 API request failed: {error_detail}")
            return f"Error communicating with Gemma 4 API ({error_detail})."

        data = resp.json()
        normalized_text = extract_google_text(data) if is_google else extract_openai_text(data)

        if not normalized_text:
            logger.warning(f"Gemma 4 API returned empty response for model='{model}'")
            return "No response generated by Gemma 4 model."

        return normalized_text

    except httpx.TimeoutException:
        logger.error(f"Gemma 4 API request timed out after {GEMMA_TIMEOUT_SECONDS}s")
        return f"Gemma 4 API request timed out after {GEMMA_TIMEOUT_SECONDS} seconds."
    except httpx.RequestError as exc:
        logger.error(f"Network error calling Gemma 4 API: {exc}")
        return f"Network error communicating with Gemma 4 API: {exc}"
    except Exception as exc:
        logger.error(f"Unexpected error in Gemma 4 service: {exc}", exc_info=False)
        return f"Unexpected error during Gemma 4 generation: {exc}"


async def _stream_chat(messages: list[dict], model: str) -> AsyncGenerator[str, None]:
    """Streaming chat completion via SSE with robust chunk decoding."""
    if not GEMMA_API_KEY:
        logger.error("Gemma 4 streaming attempted without GEMMA_API_KEY or GOOGLE_API_KEY")
        yield "Gemma 4 service is not configured: Missing GEMMA_API_KEY environment variable."
        return

    is_google = _is_google_api(GEMMA_API_BASE_URL)

    try:
        logger.info(f"Dispatching Gemma 4 streaming request (model='{model}')")

        if is_google:
            url = f"{GEMMA_API_BASE_URL}/models/{model}:streamGenerateContent?alt=sse"
            payload = format_messages_for_google(messages)
        else:
            url = f"{GEMMA_API_BASE_URL}/chat/completions"
            payload = {
                "model": model,
                "messages": messages,
                "stream": True,
                "temperature": GEMMA_TEMPERATURE,
                "top_p": GEMMA_TOP_P,
                "max_tokens": GEMMA_MAX_OUTPUT_TOKENS,
            }

        async with _client.stream(
            "POST",
            url,
            json=payload,
            headers=_get_headers(is_google),
            timeout=GEMMA_TIMEOUT_SECONDS,
        ) as response:
            if response.status_code != 200:
                logger.error(f"Gemma 4 streaming failed with HTTP {response.status_code}")
                yield f"Error from Gemma 4 API: HTTP {response.status_code}"
                return

            async for line in response.aiter_lines():
                if not line:
                    continue
                stripped = line.strip()
                if stripped.startswith("data: "):
                    json_str = stripped[6:].strip()
                    if not json_str or json_str == "[DONE]":
                        continue
                    try:
                        chunk = json.loads(json_str)
                        if is_google:
                            token = extract_google_text(chunk)
                        else:
                            choices = chunk.get("choices", [])
                            token = choices[0].get("delta", {}).get("content", "") if choices else ""
                        if token:
                            yield token
                    except json.JSONDecodeError:
                        continue

    except httpx.TimeoutException:
        logger.error(f"Gemma 4 streaming connection timed out after {GEMMA_TIMEOUT_SECONDS}s")
        yield f"Error: Gemma 4 streaming timed out after {GEMMA_TIMEOUT_SECONDS} seconds."
    except httpx.RequestError as exc:
        logger.error(f"Network error during Gemma 4 streaming: {exc}")
        yield f"Network error during streaming: {exc}"
    except Exception as exc:
        logger.error(f"Unexpected error during Gemma 4 streaming: {exc}")
        yield f"Unexpected error during streaming: {exc}"
