from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database.config import get_db
from ..models.user import User
from ..models.loan import Loan
from ..schemas.loan import LoanCreate, LoanUpdate, LoanResponse
from ..middleware.auth import get_current_user

router = APIRouter(tags=["Loans"])

@router.post("/add-loan", response_model=LoanResponse)
def add_loan(loan: LoanCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    new_loan = Loan(**loan.dict(), user_id=current_user.id)
    db.add(new_loan)
    db.commit()
    db.refresh(new_loan)
    return new_loan

@router.get("/loans", response_model=List[LoanResponse])
def get_loans(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Loan).filter(Loan.user_id == current_user.id).all()

@router.put("/update-loan/{loan_id}", response_model=LoanResponse)
def update_loan(loan_id: int, loan_update: LoanUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_loan = db.query(Loan).filter(Loan.id == loan_id, Loan.user_id == current_user.id).first()
    if not db_loan:
        raise HTTPException(status_code=404, detail="Loan not found")
    
    update_data = loan_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_loan, key, value)
        
    db.commit()
    db.refresh(db_loan)
    return db_loan

@router.delete("/delete-loan/{loan_id}")
def delete_loan(loan_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_loan = db.query(Loan).filter(Loan.id == loan_id, Loan.user_id == current_user.id).first()
    if not db_loan:
        raise HTTPException(status_code=404, detail="Loan not found")
    
    db.delete(db_loan)
    db.commit()
    return {"message": "Loan deleted successfully"}
