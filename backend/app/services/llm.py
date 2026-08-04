"""
LLM integration layer.

Provides async streaming and JSON-mode response methods via the Groq API.
The client is lazily initialized to avoid import-time failures when
GROQ_API_KEY is not yet validated.
"""

import asyncio
import logging

from groq import AsyncGroq

from app.config import settings

logger = logging.getLogger("persona-ai")

# ── Lazy Client ──────────────────────────────────────────────────────────────

_client: AsyncGroq | None = None


def _get_client() -> AsyncGroq:
    """Return a lazily-initialized AsyncGroq client."""
    global _client
    if _client is None:
        _client = AsyncGroq(api_key=settings.GROQ_API_KEY)
    return _client


# ── Streaming Chat ───────────────────────────────────────────────────────────

async def stream_response(
    system_prompt: str,
    user_message: str,
    history: list[dict] | None = None,
    *,
    timeout_seconds: float = 30.0,
    max_tokens: int = 2048,
):
    """
    Stream an LLM response as an async generator.

    Yields text chunks. Raises on error instead of silently yielding error
    text — the caller (route) is responsible for catching and returning
    an appropriate HTTP error.
    """
    messages = [{"role": "system", "content": system_prompt}]

    if history:
        for msg in history:
            messages.append({"role": msg["role"], "content": msg["content"]})

    messages.append({"role": "user", "content": user_message})

    client = _get_client()

    try:
        async with asyncio.timeout(timeout_seconds):
            stream = await client.chat.completions.create(
                model=settings.MODEL_NAME,
                messages=messages,
                stream=True,
                max_tokens=max_tokens,
            )

            async for chunk in stream:
                content = chunk.choices[0].delta.content
                if content:
                    yield content
                    await asyncio.sleep(0)  # Yield control to event loop

    except asyncio.CancelledError:
        logger.info("Client disconnected during stream — terminating gracefully")
        raise

    except asyncio.TimeoutError:
        logger.error("LLM streaming timed out after %.0fs", timeout_seconds)
        yield "\n\nSorry, the response took too long. Please try again."

    except Exception as e:
        logger.error("LLM streaming error: %s", e, exc_info=True)
        yield "\n\nSorry, I encountered an issue generating a response. Please try again."


# ── JSON Response ────────────────────────────────────────────────────────────

async def get_json_response(
    system_prompt: str,
    user_message: str,
    *,
    timeout_seconds: float = 60.0,
    max_tokens: int = 4096,
) -> str:
    """
    Get a non-streaming JSON response from the LLM.

    Returns the raw JSON string. Raises on any failure so the caller can
    return an appropriate HTTP error.
    """
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_message},
    ]

    client = _get_client()

    try:
        async with asyncio.timeout(timeout_seconds):
            response = await client.chat.completions.create(
                model=settings.MODEL_NAME,
                messages=messages,
                response_format={"type": "json_object"},
                max_tokens=max_tokens,
            )
            return response.choices[0].message.content

    except asyncio.TimeoutError:
        logger.error("LLM JSON response timed out after %.0fs", timeout_seconds)
        raise

    except Exception as e:
        logger.error("LLM JSON response error: %s", e, exc_info=True)
        raise