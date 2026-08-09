from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import pyotp
import secrets

from ..database import SessionLocal
from .. import models, schemas
from ..utils.security import hash_password, verify_password
from backend.app import models
import smtplib
from email.mime.text import MIMEText

def send_otp_email(to_email, otp):
    sender = "readaware26@gmail.com"
    password = "YOUR_API_KEY_HERE" 

    msg = MIMEText(f"Your OTP is: {otp}")
    msg["Subject"] = "ReadAware Login OTP"
    msg["From"] = sender
    msg["To"] = to_email

    server = smtplib.SMTP_SSL("smtp.gmail.com", 465)
    server.login(sender, password)
    server.send_message(msg)
    server.quit()

router = APIRouter(prefix="/auth", tags=["Auth"])


# ---------------- DATABASE ----------------

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------------- USER SIGNUP ----------------

@router.post("/signup")
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):

    existing_user = db.query(models.User).filter(models.User.email == user.email).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    otp_secret = pyotp.random_base32()

    new_user = models.User(
    name=user.name,
    email=user.email,
    user_id=user.user_id,
    phone=user.phone,
    security_question=user.security_question,
    security_answer=user.security_answer,
    password=hash_password(user.password),
    otp_secret=pyotp.random_base32(),
    status="inactive"
    )

    db.add(new_user)
    db.commit()

    return {"message": "Signup successful. Wait for admin approval."}


# ---------------- USER LOGIN ----------------

@router.post("/login")
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):

    db_user = db.query(models.User).filter(models.User.user_id == user.user_id).first()

    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    if db_user.status != "active":
        raise HTTPException(status_code=403, detail="User not approved")

    if not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid password")

    totp = pyotp.TOTP(db_user.otp_secret)
    otp = totp.now()
    
    send_otp_email(db_user.email, otp)

    return {
        "message": "OTP sent to email",
        "email": db_user.email
    }


# ---------------- VERIFY OTP ----------------

@router.post("/verify-otp")
def verify_otp(data: schemas.OTPVerify, db: Session = Depends(get_db)):

    db_user = db.query(models.User).filter(
        models.User.email == data.email
    ).first()

    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    totp = pyotp.TOTP(db_user.otp_secret)

    if not totp.verify(data.otp, valid_window=1):
        raise HTTPException(status_code=401, detail="Invalid OTP")

    return {
        "message": "Login successful",
        "user_id": db_user.id,
        "role": db_user.role,
        "name": db_user.name
    }


# ---------------- ADMIN LOGIN ----------------

@router.post("/admin-login")
def admin_login(user: schemas.UserLogin, db: Session = Depends(get_db)):

    db_user = db.query(models.User).filter(
        models.User.user_id == user.user_id
    ).first()

    if not db_user:
        raise HTTPException(status_code=404, detail="Admin not found")

    if db_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not an admin")

    if not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid password")

    return {"message": "Admin login successful"}

# ---------------- FORGOT PASSWORD ----------------

@router.get("/forgot/{user_id}")
def get_security_question(user_id: str, db: Session = Depends(get_db)):

    user = db.query(models.User).filter(models.User.user_id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "question": user.security_question
    }
    
@router.post("/reset-password")
def reset_password(data: schemas.ResetPassword, db: Session = Depends(get_db)):

    user = db.query(models.User).filter(models.User.user_id == data.user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.security_answer != data.security_answer:
        raise HTTPException(status_code=401, detail="Wrong answer")

    user.password = hash_password(data.new_password)
    db.commit()

    return {"message": "Password reset successful"}