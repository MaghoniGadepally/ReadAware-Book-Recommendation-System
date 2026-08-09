from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import SessionLocal
from ..models import Wishlist, Rating, Feedback, Book

router = APIRouter(prefix="/library", tags=["Library"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/history/{user_id}")
def get_history(user_id: int, db: Session = Depends(get_db)):

    ratings_raw = db.query(Rating).filter(
        Rating.user_id == user_id
    ).all()

    feedback_raw = db.query(Feedback).filter(
        Feedback.user_id == user_id
    ).all()

    ratings = []
    for r in ratings_raw:
        book = db.query(Book).filter(Book.isbn == r.isbn).first()

        ratings.append({
            "title": book.title if book else r.isbn,
            "rating": r.rating
        })

    feedbacks = []
    for f in feedback_raw:
        book = db.query(Book).filter(Book.isbn == f.isbn).first()

        feedbacks.append({
            "title": book.title if book else f.isbn,
            "message": f.message
        })

    return {
        "ratings": ratings,
        "feedbacks": feedbacks
    }