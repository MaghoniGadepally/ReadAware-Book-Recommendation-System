from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import SessionLocal
from ..models import Rating

router = APIRouter(prefix="/ratings", tags=["Ratings"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ⭐ Add rating
@router.post("/")
def add_rating(user_id: int, isbn: str, rating: int, db: Session = Depends(get_db)):
    r = Rating(user_id=user_id, isbn=isbn, rating=rating)

    db.add(r)
    db.commit()

    return {"message": "Rating added"}


# 📊 Get ratings for a book
@router.get("/{isbn}")
def get_ratings(isbn: str, db: Session = Depends(get_db)):
    return db.query(Rating).filter(Rating.isbn == isbn).all()