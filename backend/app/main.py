import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routes.chat import router as chat_router

logger = logging.getLogger("persona-ai")

app = FastAPI(title=settings.APP_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        settings.FRONTEND_URL,
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router)


@app.on_event("startup")
def validate_config():
    if not settings.GROQ_API_KEY:
        raise RuntimeError("GROQ_API_KEY environment variable is required")
    logger.info(f"🚀 {settings.APP_NAME} started | Model: {settings.MODEL_NAME}")


@app.get("/")
def read_root():
    return {"message": "AI Portfolio Backend Running"}


@app.get("/health")
def health_check():
    """Health check endpoint for Render/PaaS load balancers."""
    return {
        "status": "healthy",
        "model": settings.MODEL_NAME,
        "frontend_url": settings.FRONTEND_URL
    }
