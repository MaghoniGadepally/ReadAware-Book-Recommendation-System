from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.database import SessionLocal

router = APIRouter(prefix="/clicks")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/click")
def track_click(data: dict, db: Session = Depends(get_db)):
    click = Click(
        user_id=data["user_id"],
        book_title=data["book"]
    )

    db.add(click)
    db.commit()

    return {"message": "tracked"}