import os
import logging
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("persona-ai")


class Settings:
    GROQ_API_KEY: str | None = os.getenv("GROQ_API_KEY")
    MODEL_NAME: str = os.getenv("MODEL_NAME", "llama-3.3-70b-versatile")
    APP_NAME: str = os.getenv("APP_NAME", "AI Portfolio Backend")
    DEBUG: bool = os.getenv("DEBUG", "False").lower() in ("true", "1", "yes")
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:5173")


settings = Settings()