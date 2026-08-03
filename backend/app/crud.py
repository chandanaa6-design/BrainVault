from datetime import datetime, timedelta

from sqlalchemy.orm import Session

from . import models, schemas


# ===========================
# CREATE
# ===========================

def create_flashcard(db: Session, card: schemas.FlashcardCreate):

    db_card = models.Flashcard(
        subject=card.subject,
        question=card.question,
        answer=card.answer,

        question_type=card.question_type,
        answer_type=card.answer_type,

        tags=card.tags,

        question_image=card.question_image,
        answer_image=card.answer_image,
    )

    db.add(db_card)
    db.commit()
    db.refresh(db_card)

    return db_card


# ===========================
# READ
# ===========================

def get_flashcards(db: Session):
    return (
        db.query(models.Flashcard)
        .order_by(models.Flashcard.id.desc())
        .all()
    )


def get_flashcard(db: Session, flashcard_id: int):
    return (
        db.query(models.Flashcard)
        .filter(models.Flashcard.id == flashcard_id)
        .first()
    )


# ===========================
# UPDATE
# ===========================

def update_flashcard(
    db: Session,
    flashcard_id: int,
    card: schemas.FlashcardUpdate,
):

    db_card = get_flashcard(db, flashcard_id)

    if not db_card:
        return None

    update_data = card.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(db_card, key, value)

    db.commit()
    db.refresh(db_card)

    return db_card


# ===========================
# DELETE
# ===========================

def delete_flashcard(db: Session, flashcard_id: int):

    db_card = get_flashcard(db, flashcard_id)

    if not db_card:
        return False

    db.delete(db_card)
    db.commit()

    return True

# ===========================
# REVIEW
# ===========================


def review_flashcard(
    db: Session,
    flashcard_id: int,
    rating: str,
):

    card = get_flashcard(db, flashcard_id)

    if not card:
        return None

    card.review_count += 1
    card.last_reviewed = datetime.utcnow()

    if rating.lower() == "easy":

        card.easy_count += 1
        card.mastery_score += 10
        card.interval_days = max(1, card.interval_days * 2)

    elif rating.lower() == "hard":

        card.hard_count += 1
        card.mastery_score += 3
        card.interval_days = max(1, card.interval_days)

    else:

        card.again_count += 1
        card.mastery_score = max(0, card.mastery_score - 5)
        card.interval_days = 1

    card.next_review = (
        datetime.utcnow() +
        timedelta(days=card.interval_days)
    )

    db.commit()
    db.refresh(card)

    return card


# ===========================
# DASHBOARD
# ===========================

def get_dashboard_stats(db: Session):

    cards = db.query(models.Flashcard).all()

    total_cards = len(cards)

    total_topics = len(
        set(
            c.subject
            for c in cards
            if c.subject
        )
    )

    mastered = sum(
        1
        for c in cards
        if c.mastery_score >= 80
    )

    learning = sum(
        1
        for c in cards
        if c.review_count > 0
        and c.mastery_score < 80
    )

    difficult = sum(
        1
        for c in cards
        if c.again_count > c.easy_count
    )

    due_today = sum(
        1
        for c in cards
        if c.next_review
        and c.next_review <= datetime.utcnow()
    )

    return {
        "total_cards": total_cards,
        "total_topics": total_topics,
        "due_today": due_today,
        "mastered": mastered,
        "learning": learning,
        "difficult": difficult,
    }
