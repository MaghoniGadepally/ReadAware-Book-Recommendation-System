from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_

from ..database import SessionLocal
from ..models import Book, Rating
from .. import models

from fastapi import Query

import os
import pickle

router = APIRouter(prefix="/books", tags=["Books"])


# -----------------------------------
# DATABASE
# -----------------------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# -----------------------------------
# LOAD ML FILES
# -----------------------------------
BASE_DIR = os.path.dirname(os.path.dirname(__file__))

books_path = os.path.join(
    BASE_DIR,
    "ml_models",
    "books.pkl"
)

similarity_path = os.path.join(
    BASE_DIR,
    "ml_models",
    "similarity.pkl"
)

books = pickle.load(open(books_path, "rb"))
similarity = pickle.load(open(similarity_path, "rb"))


# -----------------------------------
# ALL BOOKS
# -----------------------------------
@router.get("/")
def get_books(db: Session = Depends(get_db)):
    return db.query(Book).all()


# -----------------------------------
# SEARCH BY TITLE
# -----------------------------------
@router.get("/search")
def search_books(
    query: str,
    db: Session = Depends(get_db)
):
    data = db.query(Book).filter(
        Book.title.ilike(f"%{query}%")
    ).all()

    return data


# -----------------------------------
# SMART CONTENT SEARCH (OR SEARCH)
# genre / author / summary
# -----------------------------------
@router.get("/filter")
def filter_books(
    genre: str = "",
    author: str = "",
    theme: str = "",
    db: Session = Depends(get_db)
):
    filters = []

    if genre:
        filters.append(
            Book.genre.ilike(f"%{genre}%")
        )

    if author:
        filters.append(
            Book.author.ilike(f"%{author}%")
        )

    if theme:
        filters.append(
            Book.summary.ilike(f"%{theme}%")
        )

    if not filters:
        return db.query(Book).all()

    result = db.query(Book).filter(
        or_(*filters)
    ).all()

    return result


# -----------------------------------
# ML RECOMMENDATION
# -----------------------------------
@router.get("/recommend")
def recommend_books(book_name: str):

    name = book_name.lower()

    matches = books[
        books["title"]
        .str.lower()
        .str.contains(name, na=False)
    ]

    if matches.empty:
        raise HTTPException(
            status_code=404,
            detail="Book not found"
        )

    index = matches.index[0]

    distances = list(
        enumerate(similarity[index])
    )

    books_sorted = sorted(
        distances,
        key=lambda x: x[1],
        reverse=True
    )[1:7]

    result = []

    for item in books_sorted:
        title = books.iloc[item[0]].title

        db_book = books_db(title)

        if db_book:
            result.append(db_book)
        else:
            result.append({
                "title": title,
                "author": "Unknown",
                "genre": "Unknown",
                "summary": "Recommended book",
                "image_url": ""
            })

    return {"recommendations": result}


def books_db(title):
    from ..database import SessionLocal

    db = SessionLocal()

    try:
        book = db.query(Book).filter(
            Book.title == title
        ).first()

        if book:
            return {
                "isbn": book.isbn,
                "title": book.title,
                "author": book.author,
                "genre": book.genre,
                "summary": book.summary,
                "image_url": book.image_url
            }

        return None

    finally:
        db.close()


# -----------------------------------
# POPULAR BOOKS
# -----------------------------------
@router.get("/popular")
def popular_books(
    db: Session = Depends(get_db)
):
    all_books = db.query(Book).all()

    result = []

    for book in all_books:

        ratings = db.query(Rating).filter(
            Rating.isbn == book.isbn
        ).all()

        avg = 0

        if ratings:
            avg = sum(
                r.rating for r in ratings
            ) / len(ratings)

        result.append({
            "isbn": book.isbn,
            "title": book.title,
            "author": book.author,
            "genre": book.genre,
            "summary": book.summary,
            "image_url": book.image_url,
            "rating": round(avg, 1)
        })

    result.sort(
        key=lambda x: x["rating"],
        reverse=True
    )

    return result[:10]


# -----------------------------------
# HYBRID
# mood + book
# -----------------------------------
@router.get("/hybrid")
def hybrid(
    book: str = "",
    mood: str = "",
    db: Session = Depends(get_db)
):

    query = db.query(Book)

    # mood based search
    if mood == "happy":
        query = query.filter(
            or_(
                Book.genre.ilike("%fiction%"),
                Book.genre.ilike("%fantasy%"),
                Book.summary.ilike("%adventure%")
            )
        )

    elif mood == "sad":
        query = query.filter(
            Book.summary.ilike("%life%")
        )

    elif mood == "calm":
        query = query.filter(
            Book.genre.ilike("%self-help%")
        )

    elif mood == "tired":
        query = query.filter(
            Book.genre.ilike("%fiction%")
        )

    # optional book title mix
    if book:
        query = query.filter(
            Book.title.ilike(f"%{book}%")
        )

    result = query.limit(8).all()

    return {
        "recommendations": result
    }
    
# -----------------------------------
# VOICE-SEARCH
# -----------------------------------
    
@router.get("/voice-search")
def voice_search(q: str = Query(...), db: Session = Depends(get_db)):
    term = f"%{q}%"

    books = db.query(Book).filter(
        or_(
            Book.title.ilike(term),
            Book.author.ilike(term),
            Book.genre.ilike(term)
        )
    ).all()

    return books