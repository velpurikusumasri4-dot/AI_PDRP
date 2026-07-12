from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database.config import get_db
from ..models.user import User
from ..models.loan import Loan
from ..models.history import SettlementHistory, AINegotiationHistory
from ..schemas.history import AIGenerateRequest, SettlementHistoryResponse, AINegotiationHistoryResponse
from ..middleware.auth import get_current_user
from ..services.settlement_engine import predict_settlement
from ..services.gemini_service import generate_negotiation_letter

router = APIRouter(tags=["AI & Settlement"])

@router.post("/settlement-predict")
def get_settlement_prediction(loan_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    loan = db.query(Loan).filter(Loan.id == loan_id, Loan.user_id == current_user.id).first()
    if not loan:
        raise HTTPException(status_code=404, detail="Loan not found")
    
    prediction = predict_settlement(loan)
    
    # Save to history
    history = SettlementHistory(
        user_id=current_user.id,
        loan_id=loan.id,
        recommended_amount=prediction["recommended_amount"],
        settlement_percentage=prediction["settlement_percentage"]
    )
    db.add(history)
    db.commit()
    
    return prediction

@router.post("/generate-letter")
def generate_letter(request: AIGenerateRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    loan = db.query(Loan).filter(Loan.id == request.loan_id, Loan.user_id == current_user.id).first()
    if not loan:
        raise HTTPException(status_code=404, detail="Loan not found")
    
    loan_details = {
        "loan_name": loan.loan_name,
        "lender_name": loan.lender_name,
        "loan_type": loan.loan_type,
        "outstanding_amount": loan.outstanding_amount,
        "overdue_months": loan.overdue_months
    }
    
    letter = generate_negotiation_letter(loan_details, request.tone, request.strategy)
    
    # Save to history
    history = AINegotiationHistory(
        loan_id=loan.id,
        generated_letter=letter,
        strategy=request.strategy
    )
    db.add(history)
    db.commit()
    
    return {"letter": letter}

@router.get("/history", response_model=List[AINegotiationHistoryResponse])
def get_history(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Get all loans for user
    user_loans = db.query(Loan.id).filter(Loan.user_id == current_user.id).all()
    loan_ids = [loan.id for loan in user_loans]
    
    history = db.query(AINegotiationHistory).filter(AINegotiationHistory.loan_id.in_(loan_ids)).all()
    return history
