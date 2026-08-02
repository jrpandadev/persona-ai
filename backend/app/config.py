import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    GROQ_API_KEY: str | None = os.getenv("GROQ_API_KEY")
    MODEL_NAME: str = os.getenv("MODEL_NAME", "llama-3.3-70b-versatile")
    APP_NAME: str = os.getenv("APP_NAME", "AI Portfolio Backend")
    DEBUG: bool = os.getenv("DEBUG", "False").lower() in ("true", "1", "yes")


settings = Settings()

# Direct exports for backward compatibility
GROQ_API_KEY = settings.GROQ_API_KEY
MODEL_NAME = settings.MODEL_NAME
APP_NAME = settings.APP_NAME
DEBUG = settings.DEBUG