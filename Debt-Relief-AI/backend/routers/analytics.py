from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database.config import get_db
from ..models.user import User
from ..models.loan import Loan
from ..middleware.auth import get_current_user
from ..services.financial_engine import calculate_financial_health

router = APIRouter(tags=["Analytics"])

@router.get("/dashboard")
def get_dashboard_stats(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    loans = db.query(Loan).filter(Loan.user_id == current_user.id).all()
    
    # Need user's monthly income. We can assume the max of loan monthly incomes or a default if 0.
    monthly_income = max([loan.monthly_income for loan in loans], default=5000)
    
    financial_health = calculate_financial_health(loans, monthly_income)
    
    return {
        "user_name": current_user.name,
        "total_loans_count": len(loans),
        "financial_health": financial_health,
        "loans_distribution": [
            {"name": loan.loan_name, "amount": loan.outstanding_amount} for loan in loans
        ]
    }

@router.post("/financial-analysis")
def get_financial_analysis(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    loans = db.query(Loan).filter(Loan.user_id == current_user.id).all()
    monthly_income = max([loan.monthly_income for loan in loans], default=5000)
    return calculate_financial_health(loans, monthly_income)
