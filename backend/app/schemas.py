from pydantic import BaseModel


# ---------------- USER ----------------

class UserCreate(BaseModel):
    name: str
    email: str
    user_id: str
    phone: str
    security_question: str
    security_answer: str
    password: str

class UserLogin(BaseModel):
    user_id: str
    password: str


class OTPVerify(BaseModel):

    email: str
    otp: str


# ---------------- BOOK ----------------

class BookCreate(BaseModel):

    isbn: str
    title: str
    author: str
    genre: str
    image_url: str
    summary: str


# ---------------- RATING ----------------

class RatingCreate(BaseModel):

    user_id: int
    isbn: str
    rating: int


# ---------------- WISHLIST ----------------

class WishlistCreate(BaseModel):

    user_id: int
    isbn: str


# ---------------- FEEDBACK ----------------

class FeedbackCreate(BaseModel):

    user_id: int
    isbn: str
    message: str
    
#----------------RESET PASSWORD----------------
class ResetPassword(BaseModel):
    user_id: str
    security_answer: str
    new_password: str