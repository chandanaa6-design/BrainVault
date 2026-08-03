from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

import os

from app.database import Base, engine
from app.routes.flashcards import router as flashcard_router

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="BrainVault API",
    version="1.0.0"
)

# ---------------- CORS ----------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",   # Local development
        "https://your-vercel-url.vercel.app",   # Replace after frontend deployment
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- Upload Folder ----------------
os.makedirs("uploads", exist_ok=True)

app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads",
)
# -----------------------------------------------

app.include_router(flashcard_router)


@app.get("/")
def root():
    return {
        "message": "Welcome to BrainVault API 🚀"
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        app,
        host="127.0.0.1",
        port=8000,
        reload=False
    )
