from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..database.config import Base

class Loan(Base):
    __tablename__ = "loans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    loan_name = Column(String, index=True)
    lender_name = Column(String)
    loan_type = Column(String)
    loan_amount = Column(Float)
    outstanding_amount = Column(Float)
    interest_rate = Column(Float)
    emi = Column(Float)
    monthly_income = Column(Float)
    overdue_months = Column(Integer, default=0)
    status = Column(String, default="active")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", backref="loans")
