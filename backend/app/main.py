from fastapi import FastAPI
from app.routes.chat import router as chat_router

app = FastAPI()
app.include_router(chat_router)

@app.get("/")
def read_root():
    return {"message": "AI Portfolio Backend Running"}

