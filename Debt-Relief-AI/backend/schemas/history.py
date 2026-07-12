from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from .loan import LoanResponse

class SettlementHistoryResponse(BaseModel):
    id: int
    user_id: int
    loan_id: int
    recommended_amount: float
    settlement_percentage: float
    created_at: datetime
    loan: Optional[LoanResponse] = None

    class Config:
        from_attributes = True

class AINegotiationHistoryResponse(BaseModel):
    id: int
    loan_id: int
    generated_letter: str
    strategy: str
    created_at: datetime
    loan: Optional[LoanResponse] = None

    class Config:
        from_attributes = True

class AIGenerateRequest(BaseModel):
    loan_id: int
    tone: str
    strategy: str
