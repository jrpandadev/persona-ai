from pydantic import BaseModel, Field, field_validator


class Message(BaseModel):
    role: str = Field(..., pattern="^(user|assistant)$")
    content: str = Field(..., max_length=5000)


class ChatRequest(BaseModel):
    question: str = Field(..., min_length=1, max_length=2000)
    history: list[Message] = Field(default=[], max_length=50)
    job_description: str | None = Field(default=None, max_length=10000)

    @field_validator("question")
    @classmethod
    def question_not_empty(cls, v):
        if not v.strip():
            raise ValueError("Question cannot be empty or whitespace only")
        return v.strip()


class JobMatchRequest(BaseModel):
    job_description: str = Field(..., min_length=10, max_length=10000)