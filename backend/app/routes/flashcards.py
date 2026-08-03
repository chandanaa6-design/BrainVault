from datetime import datetime
from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    UploadFile,
    File,
)

from sqlalchemy.orm import Session

from ..database import get_db
from .. import crud, schemas, models

import os
import shutil
import uuid
import json
from fastapi.responses import FileResponse

router = APIRouter(
    prefix="/flashcards",
    tags=["Flashcards"]
)


# -------------------------
# IMAGE UPLOAD
# -------------------------

@router.post("/upload")
async def upload_image(file: UploadFile = File(...)):

    os.makedirs("uploads", exist_ok=True)

    extension = os.path.splitext(file.filename)[1]

    filename = f"{uuid.uuid4()}{extension}"

    filepath = os.path.join("uploads", filename)

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {
        "filename": filename,
        "url": f"/uploads/{filename}"
    }


# -------------------------
# CREATE
# -------------------------

@router.post("/", response_model=schemas.FlashcardResponse)
def create_flashcard(
    card: schemas.FlashcardCreate,
    db: Session = Depends(get_db)
):
    return crud.create_flashcard(db, card)


# -------------------------
# READ
# -------------------------

@router.get("/", response_model=list[schemas.FlashcardResponse])
def get_flashcards(
    db: Session = Depends(get_db)
):
    return crud.get_flashcards(db)


# -------------------------
# DASHBOARD
# -------------------------

@router.get("/dashboard/stats")
def dashboard_stats(
    db: Session = Depends(get_db),
):
    return crud.get_dashboard_stats(db)


# -------------------------
# UPDATE
# -------------------------

@router.put("/{flashcard_id}", response_model=schemas.FlashcardResponse)
def update_flashcard(
    flashcard_id: int,
    card: schemas.FlashcardUpdate,
    db: Session = Depends(get_db)
):
    updated_card = crud.update_flashcard(
        db,
        flashcard_id,
        card,
    )

    if not updated_card:
        raise HTTPException(
            status_code=404,
            detail="Flashcard not found"
        )

    return updated_card


# -------------------------
# DELETE
# -------------------------

@router.delete("/{flashcard_id}")
def delete_flashcard(
    flashcard_id: int,
    db: Session = Depends(get_db)
):
    deleted_card = crud.delete_flashcard(
        db,
        flashcard_id,
    )

    if not deleted_card:
        raise HTTPException(
            status_code=404,
            detail="Flashcard not found"
        )

    return {
        "message": "Flashcard deleted successfully"
    }


# -------------------------
# REVIEW
# -------------------------

@router.post(
    "/{flashcard_id}/review/{rating}",
    response_model=schemas.FlashcardResponse,
)
def review_flashcard(
    flashcard_id: int,
    rating: str,
    db: Session = Depends(get_db),
):
    if rating not in ["easy", "hard", "again"]:
        raise HTTPException(
            status_code=400,
            detail="Invalid rating"
        )

    flashcard = crud.review_flashcard(
        db,
        flashcard_id,
        rating,
    )

    if not flashcard:
        raise HTTPException(
            status_code=404,
            detail="Flashcard not found"
        )

    return flashcard


# -------------------------
# EXPORT BACKUP
# -------------------------

@router.get("/export")
def export_flashcards(
    db: Session = Depends(get_db),
):
    cards = crud.get_flashcards(db)

    backup = []

    for card in cards:
        backup.append({
            "subject": card.subject,
            "question": card.question,
            "answer": card.answer,

            "question_type": card.question_type,
            "answer_type": card.answer_type,

            "tags": card.tags,

            "question_image": card.question_image,
            "answer_image": card.answer_image,

            "review_count": card.review_count,
            "easy_count": card.easy_count,
            "hard_count": card.hard_count,
            "again_count": card.again_count,

            "interval_days": card.interval_days,
            "mastery_score": card.mastery_score,

            "created_at": str(card.created_at),
            "updated_at": str(card.updated_at),
            "last_reviewed": str(card.last_reviewed),
            "next_review": str(card.next_review),
        })

    filename = "brainvault_backup.json"

    with open(filename, "w", encoding="utf-8") as f:
        json.dump(
            backup,
            f,
            indent=4,
            ensure_ascii=False,
        )

    return FileResponse(
        filename,
        media_type="application/json",
        filename=filename,
    )

# -------------------------
# IMPORT BACKUP
# -------------------------


@router.post("/import")
async def import_flashcards(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    data = json.load(file.file)

    imported = 0
    skipped = 0

    for item in data:

        existing = (
            db.query(models.Flashcard)
            .filter(
                models.Flashcard.subject == item["subject"],
                models.Flashcard.question == item["question"],
                models.Flashcard.answer == item["answer"],
            )
            .first()
        )

        if existing:
            skipped += 1
            continue

        card = models.Flashcard(
            subject=item.get("subject", ""),
            question=item.get("question", ""),
            answer=item.get("answer", ""),

            question_type=item.get("question_type", "markdown"),
            answer_type=item.get("answer_type", "markdown"),

            tags=item.get("tags", ""),

            question_image=item.get("question_image"),
            answer_image=item.get("answer_image"),

            review_count=item.get("review_count", 0),
            easy_count=item.get("easy_count", 0),
            hard_count=item.get("hard_count", 0),
            again_count=item.get("again_count", 0),

            interval_days=item.get("interval_days", 1),
            mastery_score=item.get("mastery_score", 0),
        )

        db.add(card)
        imported += 1

    db.commit()

    return {
        "imported": imported,
        "skipped": skipped,
    }
