from sqlalchemy.orm import Session

from . import models, schemas


def create_flashcard(db: Session, card: schemas.FlashcardCreate):
    db_card = models.Flashcard(**card.model_dump())

    db.add(db_card)
    db.commit()
    db.refresh(db_card)

    return db_card


def get_flashcards(db: Session):
    return db.query(models.Flashcard).all()
