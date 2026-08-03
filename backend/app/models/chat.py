from typing import List
from pydantic import BaseModel, Field


class Message(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    question: str
    history: List[Message] = []
    job_description: str | None = None


class JobMatchRequest(BaseModel):
    job_description: str