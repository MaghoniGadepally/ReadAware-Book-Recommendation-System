from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import engine
from . import models

# Routes
from .routes import auth
from .routes import admin
from .routes import books
from .routes import ratings
from .routes import wishlist
from .routes import feedback
from .routes import recommend
from .routes import library
from .routes import collaborative

# Create Tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Book Recommendation System")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Home Route
@app.get("/")
def home():
    return {"message": "Book Recommendation API running"}

# Include Routers
app.include_router(auth.router)
app.include_router(admin.router)
app.include_router(books.router)
app.include_router(ratings.router)
app.include_router(wishlist.router)
app.include_router(feedback.router)
app.include_router(recommend.router)
app.include_router(library.router)
app.include_router(collaborative.router)