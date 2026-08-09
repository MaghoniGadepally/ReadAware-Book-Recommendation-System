from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from ..database import SessionLocal
from ..models import Book, Rating
from ..models import Rating, Book

router = APIRouter(prefix="/recommend", tags=["Recommendation"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ⭐ Popular Books
@router.get("/popular")
def popular_books(db: Session = Depends(get_db)):

    results = db.query(
        Rating.isbn,
        func.avg(Rating.rating).label("avg_rating"),
        func.count(Rating.id).label("count")
    ).group_by(Rating.isbn).order_by(
        func.avg(Rating.rating).desc()
    ).limit(10).all()

    books = []

    for r in results:
        book = db.query(Book).filter(Book.isbn == r.isbn).first()
        if book:
            books.append({
                "title": book.title,
                "author": book.author,
                "image_url": book.image_url,
                "summary": book.summary,
                "avg_rating": float(r.avg_rating)
            })

    return books
  
# 📚 Content-Based Recommendation (by genre)
@router.get("/content/title/{title}")
def content_by_title(title: str, db: Session = Depends(get_db)):

    book = db.query(Book).filter(Book.title.ilike(f"%{title}%")).first()

    if not book:
        return {"error": "Book not found"}

    similar_books = db.query(Book).filter(
        Book.genre == book.genre,
        Book.isbn != book.isbn
    ).limit(10).all()

    return [
        {
            "title": b.title,
            "author": b.author,
            "image_url": b.image_url,
            "summary": b.summary
        }
        for b in similar_books
    ]
    
@router.get("/content/genre/{genre}")
def content_by_genre(genre: str, db: Session = Depends(get_db)):

    books = db.query(Book).filter(
        Book.genre.ilike(f"%{genre}%")
    ).limit(10).all()

    return [
        {
            "title": b.title,
            "author": b.author,
            "image_url": b.image_url,
            "summary": b.summary
        }
        for b in books
    ]
    
@router.get("/content/author/{author}")
def content_by_author(author: str, db: Session = Depends(get_db)):

    books = db.query(Book).filter(
        Book.author.ilike(f"%{author}%")
    ).limit(10).all()

    return [
        {
            "title": b.title,
            "author": b.author,
            "image_url": b.image_url,
            "summary": b.summary
        }
        for b in books
    ]
    

#Collaborative Recommendation
@router.get("/collaborative/{user_id}")
def collaborative(user_id: int, db: Session = Depends(get_db)):

    # Step 1: books rated by current user
    user_books = db.query(Rating.isbn).filter(
        Rating.user_id == user_id
    ).all()

    user_books = [b[0] for b in user_books]

    if not user_books:
        return {"message": "No ratings found for user"}

    # Step 2: find other users who rated same books
    other_users = db.query(Rating.user_id).filter(
        Rating.isbn.in_(user_books),
        Rating.user_id != user_id
    ).distinct().all()

    other_users = [u[0] for u in other_users]

    # Step 3: get books those users rated
    recommended_books = db.query(Rating.isbn).filter(
        Rating.user_id.in_(other_users),
        ~Rating.isbn.in_(user_books)
    ).distinct().limit(10).all()

    recommended_books = [b[0] for b in recommended_books]

    # Step 4: fetch book details
    books = db.query(Book).filter(Book.isbn.in_(recommended_books)).all()

    return [
        {
            "title": b.title,
            "author": b.author,
            "image_url": b.image_url
        }
        for b in books
    ]