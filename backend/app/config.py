"""
Application configuration — single source of truth for all settings.

Uses pydantic-settings for type-safe environment variable parsing with
validation, defaults, and clear error messages on misconfiguration.
"""

import logging
import os
from functools import lru_cache

from dotenv import load_dotenv

load_dotenv()

# ── Logging ──────────────────────────────────────────────────────────────────

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("persona-ai")


# ── Settings ─────────────────────────────────────────────────────────────────

class Settings:
    """
    Application settings parsed from environment variables.

    Required:
        GROQ_API_KEY — API key for the Groq LLM service.

    Optional (defaults provided):
        MODEL_NAME   — LLM model identifier.
        APP_NAME     — Display name for the API.
        DEBUG        — Enable debug mode (verbose logging).
        FRONTEND_URL — Comma-separated list of allowed frontend origins.
    """

    GROQ_API_KEY: str
    MODEL_NAME: str
    APP_NAME: str
    DEBUG: bool
    FRONTEND_URL: str

    def __init__(self) -> None:
        self.GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
        self.MODEL_NAME = os.getenv("MODEL_NAME", "openai/gpt-oss-120b")
        self.APP_NAME = os.getenv("APP_NAME", "AI Portfolio Backend")
        self.DEBUG = os.getenv("DEBUG", "False").lower() in ("true", "1", "yes")
        self.FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

    def validate(self) -> None:
        """Validate that all required settings are present. Call at startup."""
        if not self.GROQ_API_KEY:
            raise RuntimeError(
                "GROQ_API_KEY environment variable is required. "
                "See backend/.env.example for the expected format."
            )


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """Return a cached singleton Settings instance."""
    s = Settings()
    return s


settings = get_settings()