"""
Chat API routes.

Provides two endpoints:
  POST /chat/       — Streaming conversational chat
  POST /chat/job-match — Structured job description analysis (JSON)
"""

import json
import logging

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse, JSONResponse

from app.models.chat import ChatRequest, JobMatchRequest
from app.services.candidate_loader import load_candidate
from app.services.prompt_builder import build_prompt, build_job_match_prompt
from app.services.llm import stream_response, get_json_response

logger = logging.getLogger("persona-ai")

router = APIRouter(prefix="/chat", tags=["Chat"])


@router.post("/")
async def chat(request: ChatRequest):
    """Stream an AI response grounded in the candidate profile."""
    try:
        candidate = load_candidate()

        system_prompt, user_message = build_prompt(
            candidate,
            request.question,
            request.history,
            request.job_description,
        )

        history = [msg.model_dump() for msg in request.history]

        logger.info(
            "Chat request: %d chars, %d history msgs",
            len(request.question),
            len(history),
        )

        return StreamingResponse(
            stream_response(system_prompt, user_message, history),
            media_type="text/event-stream",
        )

    except FileNotFoundError as e:
        logger.error("Candidate file error: %s", e)
        raise HTTPException(status_code=404, detail=str(e))

    except ValueError as e:
        logger.warning("Validation error: %s", e)
        raise HTTPException(status_code=400, detail=str(e))

    except Exception as e:
        logger.error("Unexpected chat error: %s", e, exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred. Please try again.",
        )


@router.post("/job-match")
async def job_match(request: JobMatchRequest):
    """Analyze a job description against the candidate profile."""
    try:
        candidate = load_candidate()

        system_prompt, user_message = build_job_match_prompt(
            candidate,
            request.job_description,
        )

        logger.info("Job match request: %d chars", len(request.job_description))

        response_json_str = await get_json_response(system_prompt, user_message)

        try:
            response_dict = json.loads(response_json_str)
        except json.JSONDecodeError:
            logger.error(
                "LLM returned invalid JSON (first 200 chars): %s",
                response_json_str[:200],
            )
            raise HTTPException(
                status_code=502,
                detail="AI returned an invalid response. Please try again.",
            )

        return JSONResponse(content=response_dict)

    except HTTPException:
        raise

    except FileNotFoundError as e:
        logger.error("Candidate file error: %s", e)
        raise HTTPException(status_code=404, detail=str(e))

    except ValueError as e:
        logger.warning("Validation error: %s", e)
        raise HTTPException(status_code=400, detail=str(e))

    except Exception as e:
        logger.error("Unexpected job-match error: %s", e, exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred. Please try again.",
        )
