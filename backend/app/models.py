from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime

from .database import Base


class Flashcard(Base):
    __tablename__ = "flashcards"

    id = Column(Integer, primary_key=True, index=True)

    # Basic Information
    subject = Column(String, nullable=True, default="")
    question = Column(Text, nullable=False)
    answer = Column(Text, nullable=False)
    question_type = Column(String, default="markdown")
    answer_type = Column(String, default="markdown")
    tags = Column(String, nullable=True, default="")

    # Images
    question_image = Column(String, nullable=True)
    answer_image = Column(String, nullable=True)

    # Dates
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    # Review Statistics
    review_count = Column(Integer, default=0)
    easy_count = Column(Integer, default=0)
    hard_count = Column(Integer, default=0)
    again_count = Column(Integer, default=0)

    # Spaced Repetition
    last_reviewed = Column(DateTime, nullable=True)
    next_review = Column(DateTime, nullable=True)
    interval_days = Column(Integer, default=1)

    # Learning Progress
    mastery_score = Column(Integer, default=0)
