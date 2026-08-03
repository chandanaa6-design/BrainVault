from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class FlashcardCreate(BaseModel):
    subject: Optional[str] = ""

    question: str
    answer: str

    question_type: Optional[str] = "markdown"
    answer_type: Optional[str] = "markdown"

    tags: Optional[str] = ""

    question_image: Optional[str] = None
    answer_image: Optional[str] = None


class FlashcardUpdate(BaseModel):
    subject: Optional[str] = ""

    question: str
    answer: str

    question_type: Optional[str] = "markdown"
    answer_type: Optional[str] = "markdown"

    tags: Optional[str] = ""

    question_image: Optional[str] = None
    answer_image: Optional[str] = None


class FlashcardResponse(BaseModel):
    id: int

    subject: Optional[str] = ""

    question: str
    answer: str

    question_type: str
    answer_type: str

    tags: Optional[str] = ""

    question_image: Optional[str] = None
    answer_image: Optional[str] = None

    created_at: datetime
    updated_at: datetime

    review_count: int
    easy_count: int
    hard_count: int
    again_count: int

    last_reviewed: Optional[datetime] = None
    next_review: Optional[datetime] = None
    interval_days: int

    mastery_score: int

    class Config:
        from_attributes = True
