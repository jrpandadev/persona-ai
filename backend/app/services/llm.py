import asyncio
import logging
from groq import AsyncGroq
from app.config import settings

logger = logging.getLogger("persona-ai")

client = AsyncGroq(api_key=settings.GROQ_API_KEY)


async def stream_response(system_prompt: str, user_message: str, history: list = None):
    """Stream an LLM response with proper system/user message separation (Async)."""

    messages = [{"role": "system", "content": system_prompt}]

    if history:
        for msg in history:
            messages.append({"role": msg["role"], "content": msg["content"]})

    messages.append({"role": "user", "content": user_message})

    try:
        stream = await client.chat.completions.create(
            model=settings.MODEL_NAME,
            messages=messages,
            stream=True,
            max_tokens=2048,
        )

        async for chunk in stream:
            content = chunk.choices[0].delta.content
            if content:
                yield content
                await asyncio.sleep(0)  # Yield control back to event loop

    except asyncio.CancelledError:
        logger.info("Client disconnected during stream. Terminating gracefully.")
        raise

    except Exception as e:
        logger.error(f"LLM streaming error: {e}")
        yield "Sorry, I encountered an issue generating a response. Please try again."


async def get_json_response(system_prompt: str, user_message: str) -> str:
    """Get a non-streaming JSON response from the LLM (Async)."""

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_message},
    ]

    try:
        response = await client.chat.completions.create(
            model=settings.MODEL_NAME,
            messages=messages,
            response_format={"type": "json_object"},
            max_tokens=2048,
        )
        return response.choices[0].message.content

    except Exception as e:
        logger.error(f"LLM JSON response error: {e}")
        raise