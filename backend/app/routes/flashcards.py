from fastapi import APIRouter, Depends, HTTPException
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


@router.delete("/{flashcard_id}")
def delete_flashcard(
    flashcard_id: int,
    db: Session = Depends(get_db)
):
    deleted_card = crud.delete_flashcard(db, flashcard_id)

    if not deleted_card:
        raise HTTPException(
            status_code=404,
            detail="Flashcard not found"
        )

    return {
        "message": "Flashcard deleted successfully"
    }

@router.put("/{flashcard_id}", response_model=schemas.FlashcardResponse)
def update_flashcard(
    flashcard_id: int,
    card: schemas.FlashcardCreate,
    db: Session = Depends(get_db)
):
    updated_card = crud.update_flashcard(db, flashcard_id, card)

    if not updated_card:
        raise HTTPException(
            status_code=404,
            detail="Flashcard not found"
        )

    return updated_card