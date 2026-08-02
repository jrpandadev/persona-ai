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
            request.history
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
