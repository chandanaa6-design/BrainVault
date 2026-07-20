from pydantic import BaseModel


class FlashcardCreate(BaseModel):
    question: str
    answer: str
    subject: str
    difficulty: str


class FlashcardResponse(FlashcardCreate):
    id: int

    class Config:
        from_attributes = True
