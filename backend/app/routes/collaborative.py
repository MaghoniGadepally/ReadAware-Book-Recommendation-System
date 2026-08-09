from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import SessionLocal
from ..models import Wishlist, Rating, Book

router = APIRouter(prefix="/collaborative", tags=["Collaborative"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/{user_id}")
def collaborative(user_id: int, genre: str = "", db: Session = Depends(get_db)):

    # books liked by current user
    my_books = set()

    ratings = db.query(Rating).filter(Rating.user_id == user_id).all()
    wishlist = db.query(Wishlist).filter(Wishlist.user_id == user_id).all()

    for r in ratings:
        my_books.add(r.isbn)

    for w in wishlist:
        my_books.add(w.isbn)

    # if no history -> return all books
    if not my_books:
        query = db.query(Book)

        if genre.strip():
            query = query.filter(Book.genre.ilike(f"%{genre}%"))

        return query.all()

    # find similar users
    users = db.query(Rating.user_id).distinct().all()

    recommended = []

    for u in users:
        other_id = u[0]

        if other_id == user_id:
            continue

        other_ratings = db.query(Rating).filter(
            Rating.user_id == other_id
        ).all()

        other_books = set([x.isbn for x in other_ratings])

        if my_books.intersection(other_books):

            for x in other_ratings:
                if x.isbn not in my_books:

                    book = db.query(Book).filter(
                        Book.isbn == x.isbn
                    ).first()

                    if book:
                        recommended.append(book)

    # fallback if empty
    if not recommended:
        recommended = db.query(Book).all()

    # genre filter FIXED
    if genre.strip():
        recommended = [
            b for b in recommended
            if genre.lower() in b.genre.lower()
        ]

    # remove duplicates
    final = []
    seen = set()

    for b in recommended:
        if b.isbn not in seen:
            seen.add(b.isbn)
            final.append(b)

    return final