from fastapi import FastAPI
from app.routes.chat import router as chat_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",   # Vite local
        "http://localhost:3000",   # React local
        "*",                       # Allow all origins (Vercel, Netlify, Render frontend)
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router)

@app.get("/")
def read_root():
    return {"message": "AI Portfolio Backend Running"}

