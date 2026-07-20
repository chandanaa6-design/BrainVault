from sqlalchemy import Column, Integer, String, Text
from .database import Base


class Flashcard(Base):
    __tablename__ = "flashcards"

    id = Column(Integer, primary_key=True, index=True)
    question = Column(Text, nullable=False)
    answer = Column(Text, nullable=False)
    subject = Column(String, default="General")
    difficulty = Column(String, default="Medium")
