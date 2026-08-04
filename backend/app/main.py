"""
FastAPI application entry point.

Configures CORS, registers routes, and validates settings at startup
using the modern `lifespan` context manager pattern.
"""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routes.chat import router as chat_router

logger = logging.getLogger("persona-ai")


# ── Lifespan ─────────────────────────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup / shutdown lifecycle hook (replaces deprecated on_event)."""
    # ── Startup ──
    settings.validate()
    logger.info("🚀 %s started | Model: %s", settings.APP_NAME, settings.MODEL_NAME)
    yield
    # ── Shutdown ──
    logger.info("👋 %s shutting down", settings.APP_NAME)


# ── App ──────────────────────────────────────────────────────────────────────

app = FastAPI(
    title=settings.APP_NAME,
    lifespan=lifespan,
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
)


# ── CORS ─────────────────────────────────────────────────────────────────────

_allowed_origins: list[str] = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
]

if settings.FRONTEND_URL:
    for url in settings.FRONTEND_URL.split(","):
        clean = url.strip().rstrip("/")
        if clean and clean not in _allowed_origins:
            _allowed_origins.append(clean)

app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed_origins,
    # Match Vercel preview deploys — anchored to prevent wildcard abuse
    allow_origin_regex=r"https://[\w-]+\.vercel\.app",
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type"],
)


# ── Routes ───────────────────────────────────────────────────────────────────

app.include_router(chat_router)


@app.get("/")
def read_root():
    """Root probe — confirms the API is reachable."""
    return {"status": "ok", "app": settings.APP_NAME}


@app.get("/health")
def health_check():
    """Health check for load balancers (Render, Railway, etc.)."""
    return {
        "status": "healthy",
        "model": settings.MODEL_NAME,
    }
