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
    try:
        candidate = load_candidate()

        system_prompt, user_message = build_prompt(
            candidate,
            request.question,
            request.history,
            request.job_description,
        )

        history = [msg.model_dump() for msg in request.history]

        logger.info(f"Chat request: {len(request.question)} chars, {len(history)} history msgs")

        return StreamingResponse(
            stream_response(system_prompt, user_message, history),
            media_type="text/plain",
        )

    except FileNotFoundError as e:
        logger.error(f"Candidate file error: {e}")
        raise HTTPException(status_code=404, detail=str(e))

    except ValueError as e:
        logger.warning(f"Validation error: {e}")
        raise HTTPException(status_code=400, detail=str(e))

    except Exception as e:
        logger.error(f"Unexpected chat error: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred. Please try again.",
        )


@router.post("/job-match")
async def job_match(request: JobMatchRequest):
    try:
        candidate = load_candidate()

        system_prompt, user_message = build_job_match_prompt(
            candidate,
            request.job_description,
        )

        logger.info(f"Job match request: {len(request.job_description)} chars")

        response_json_str = await get_json_response(system_prompt, user_message)

        try:
            response_dict = json.loads(response_json_str)
        except json.JSONDecodeError:
            logger.error(f"LLM returned invalid JSON: {response_json_str[:200]}")
            raise HTTPException(
                status_code=502,
                detail="AI returned an invalid response. Please try again.",
            )

        return JSONResponse(content=response_dict)

    except HTTPException:
        raise

    except FileNotFoundError as e:
        logger.error(f"Candidate file error: {e}")
        raise HTTPException(status_code=404, detail=str(e))

    except ValueError as e:
        logger.warning(f"Validation error: {e}")
        raise HTTPException(status_code=400, detail=str(e))

    except Exception as e:
        logger.error(f"Unexpected job-match error: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred. Please try again.",
        )
