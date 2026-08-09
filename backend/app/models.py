from sqlalchemy import Column, Integer, String, Text, ForeignKey
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    user_id = Column(String(50), unique=True)
    name = Column(String(100))
    email = Column(String(100), unique=True)
    phone = Column(String(15)) 
    security_question = Column(String(255))     
    security_answer = Column(String(255))

    password = Column(String(255))

    role = Column(String(20), default="user")
    status = Column(String(20), default="inactive")  
    # inactive, active, archived, deleted

    otp_secret = Column(String(32))


class Book(Base):

    __tablename__ = "books"

    isbn = Column(String(20), primary_key=True)
    title = Column(String(255))
    author = Column(String(255))
    genre = Column(String(100))

    image_url = Column(Text)
    summary = Column(Text)


class Rating(Base):

    __tablename__ = "ratings"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    isbn = Column(String(20), ForeignKey("books.isbn"))
    rating = Column(Integer)


class Wishlist(Base):

    __tablename__ = "wishlist"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    isbn = Column(String(20), ForeignKey("books.isbn"))


class Feedback(Base):

    __tablename__ = "feedback"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    isbn = Column(String(20), ForeignKey("books.isbn"))
    message = Column(Text)
    
class Click(Base):
    __tablename__ = "clicks"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    book_title = Column(String(255))