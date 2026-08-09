from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel

from ..database import SessionLocal
from ..models import Feedback

router = APIRouter(prefix="/feedback", tags=["Feedback"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# 💬 Add feedback

class FeedbackCreate(BaseModel):
    user_id: int
    isbn: str
    message: str


@router.post("/")
def add_feedback(data: FeedbackCreate, db: Session = Depends(get_db)):

    fb = Feedback(
        user_id=data.user_id,
        isbn=data.isbn,
        message=data.message
    )

    db.add(fb)
    db.commit()

    return {"message": "Feedback added"}

@router.delete("/{id}")
def delete_feedback(id: int, db: Session = Depends(get_db)):

    fb = db.query(Feedback).filter(Feedback.id == id).first()

    if not fb:
        return {"error": "Not found"}

    db.delete(fb)
    db.commit()

    return {"message": "Deleted"}

# 📋 Get feedback for a book
@router.get("/")
def get_all_feedback(db: Session = Depends(get_db)):
    return db.query(Feedback).all()

# 📋 Get all feedbacks (for admin)
@router.get("/all")
def get_all_feedback(db: Session = Depends(get_db)):
    return db.query(Feedback).all()