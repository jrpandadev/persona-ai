from fastapi import APIRouter
from app.models.chat import ChatRequest
from app.services.candidate_loader import load_candidate
from app.services.prompt_builder import build_prompt
from fastapi.responses import StreamingResponse
from app.services.llm import stream_response
from fastapi import HTTPException

router = APIRouter(prefix="/chat", tags=["Chat"])


@router.post("/")
def chat(request: ChatRequest):

    try:

        candidate = load_candidate()

        prompt = build_prompt(
            candidate,
            request.question,
            request.history,
            request.job_description
        )

        return StreamingResponse(
            stream_response(prompt),
            media_type="text/plain"
        )

    except FileNotFoundError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e)
        )

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Internal Server Error: {str(e)}"
        )


from app.models.chat import JobMatchRequest
from app.services.prompt_builder import build_job_match_prompt
from app.services.llm import get_json_response
import json
from fastapi.responses import JSONResponse

@router.post("/job-match")
def job_match(request: JobMatchRequest):
    try:
        candidate = load_candidate()
        prompt = build_job_match_prompt(candidate, request.job_description)
        response_json_str = get_json_response(prompt)
        
        response_dict = json.loads(response_json_str)
        return JSONResponse(content=response_dict)

    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

