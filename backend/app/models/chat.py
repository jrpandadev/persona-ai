"""
Pydantic request/response schemas for the Chat API.

Provides input validation, sanitisation, and payload size limits to
prevent abuse and ensure the LLM receives clean, bounded input.
"""

from pydantic import BaseModel, Field, field_validator


class Message(BaseModel):
    """A single conversation turn (user or assistant)."""

    role: str = Field(..., pattern="^(user|assistant)$")
    content: str = Field(..., max_length=5000)


class ChatRequest(BaseModel):
    """Payload for the POST /chat/ streaming endpoint."""

    question: str = Field(..., min_length=1, max_length=2000)
    history: list[Message] = Field(default=[], max_length=30)
    job_description: str | None = Field(default=None, max_length=10000)

    @field_validator("question")
    @classmethod
    def question_not_empty(cls, v: str) -> str:
        stripped = v.strip()
        if not stripped:
            raise ValueError("Question cannot be empty or whitespace only")
        return stripped

    @field_validator("job_description")
    @classmethod
    def sanitize_job_description(cls, v: str | None) -> str | None:
        if v is not None:
            stripped = v.strip()
            return stripped if stripped else None
        return None


class JobMatchRequest(BaseModel):
    """Payload for the POST /chat/job-match analysis endpoint."""

    job_description: str = Field(..., min_length=10, max_length=10000)

    @field_validator("job_description")
    @classmethod
    def job_description_not_empty(cls, v: str) -> str:
        stripped = v.strip()
        if len(stripped) < 10:
            raise ValueError(
                "Job description must be at least 10 characters after trimming whitespace"
            )
        return stripped