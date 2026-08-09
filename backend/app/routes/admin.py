from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import SessionLocal
from ..models import User, Feedback

router = APIRouter(prefix="/admin", tags=["Admin"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# 🔍 Get all users
@router.get("/users")
def get_users(db: Session = Depends(get_db)):
    return db.query(User).all()


# ✅ Approve user
@router.put("/approve/{user_id}")
def approve_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).get(user_id)
    user.status = "active"
    db.commit()
    return {"message": "User approved"}


# ❌ Reject user
@router.delete("/delete/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).get(user_id)
    db.delete(user)
    db.commit()
    return {"message": "User deleted"}


# 📦 Archive user
@router.put("/archive/{user_id}")
def archive_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).get(user_id)
    user.status = "archived"
    db.commit()
    return {"message": "User archived"}


# 📝 Delete feedback
@router.delete("/feedback/{id}")
def delete_feedback(id: int, db: Session = Depends(get_db)):
    fb = db.query(Feedback).get(id)
    db.delete(fb)
    db.commit()
    return {"message": "Feedback deleted"}

# 📊 Admin Dashboard Stats
@router.get("/stats")
def admin_stats(db: Session = Depends(get_db)):
    return {
        "active": db.query(User).filter(User.status=="active").count(),
        "inactive": db.query(User).filter(User.status=="inactive").count(),
        "archived": db.query(User).filter(User.status=="archived").count(),
        "deleted": db.query(User).filter(User.status=="deleted").count(),
    }