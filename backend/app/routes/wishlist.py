from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import SessionLocal
from ..models import Wishlist, Book

router = APIRouter(prefix="/wishlist", tags=["Wishlist"])


# ---------------- DATABASE ----------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ===================================================
# ❤️ ADD TO WISHLIST
# ===================================================
@router.post("/")
def add_to_wishlist(
    user_id: int,
    isbn: str,
    db: Session = Depends(get_db)
):

    # prevent duplicate
    existing = db.query(Wishlist).filter(
        Wishlist.user_id == user_id,
        Wishlist.isbn == isbn
    ).first()

    if existing:
        return {
            "message": "Already in wishlist"
        }

    item = Wishlist(
        user_id=user_id,
        isbn=isbn
    )

    db.add(item)
    db.commit()

    return {
        "message": "Added to wishlist"
    }


# ===================================================
# 📚 GET FULL USER WISHLIST
# ===================================================
@router.get("/{user_id}")
def get_wishlist(
    user_id: int,
    db: Session = Depends(get_db)
):

    rows = db.query(
        Wishlist,
        Book
    ).join(
        Book,
        Wishlist.isbn == Book.isbn
    ).filter(
        Wishlist.user_id == user_id
    ).all()

    result = []

    for wish, book in rows:
        result.append({
            "wishlist_id": wish.id,
            "isbn": book.isbn,
            "title": book.title,
            "author": book.author,
            "genre": book.genre,
            "summary": book.summary,
            "image_url": book.image_url
        })

    return result


# ===================================================
# ❌ REMOVE FROM WISHLIST
# ===================================================
@router.delete("/")
def remove_from_wishlist(
    user_id: int,
    isbn: str,
    db: Session = Depends(get_db)
):

    item = db.query(Wishlist).filter(
        Wishlist.user_id == user_id,
        Wishlist.isbn == isbn
    ).first()

    if item:
        db.delete(item)
        db.commit()

    return {
        "message": "Removed from wishlist"
    }