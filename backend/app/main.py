from fastapi import FastAPI

from .database import Base, engine
from .routes.flashcards import router as flashcard_router

# Create all database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="BrainVault API",
    version="1.0.0"
)

app.include_router(flashcard_router)


@app.get("/")
def root():
    return {
        "message": "Welcome to BrainVault API 🚀"
    }
