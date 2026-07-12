from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class LoanBase(BaseModel):
    loan_name: str
    lender_name: str
    loan_type: str
    loan_amount: float
    outstanding_amount: float
    interest_rate: float
    emi: float
    monthly_income: float
    overdue_months: Optional[int] = 0

class LoanCreate(LoanBase):
    pass

class LoanUpdate(BaseModel):
    loan_name: Optional[str] = None
    lender_name: Optional[str] = None
    loan_type: Optional[str] = None
    loan_amount: Optional[float] = None
    outstanding_amount: Optional[float] = None
    interest_rate: Optional[float] = None
    emi: Optional[float] = None
    monthly_income: Optional[float] = None
    overdue_months: Optional[int] = None
    status: Optional[str] = None

class LoanResponse(LoanBase):
    id: int
    user_id: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
