from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from .. import crud, schemas

router = APIRouter(
    prefix="/flashcards",
    tags=["Flashcards"]
)


@router.post("/", response_model=schemas.FlashcardResponse)
def create_flashcard(
    card: schemas.FlashcardCreate,
    db: Session = Depends(get_db)
):
    return crud.create_flashcard(db, card)


@router.get("/", response_model=list[schemas.FlashcardResponse])
def get_flashcards(
    db: Session = Depends(get_db)
):
    return crud.get_flashcards(db)
