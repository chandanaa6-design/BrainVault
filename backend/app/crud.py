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


def delete_flashcard(db, flashcard_id):
    flashcard = db.query(models.Flashcard).filter(
        models.Flashcard.id == flashcard_id
    ).first()

    if flashcard:
        db.delete(flashcard)
        db.commit()

    return flashcard


def update_flashcard(db: Session, flashcard_id: int, card: schemas.FlashcardCreate):
    flashcard = db.query(models.Flashcard).filter(
        models.Flashcard.id == flashcard_id
    ).first()

    if flashcard:
        flashcard.question = card.question
        flashcard.answer = card.answer
        flashcard.subject = card.subject
        flashcard.difficulty = card.difficulty

        db.commit()
        db.refresh(flashcard)

    return flashcard
