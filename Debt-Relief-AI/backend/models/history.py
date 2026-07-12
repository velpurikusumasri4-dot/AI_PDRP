from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..database.config import Base

class SettlementHistory(Base):
    __tablename__ = "settlement_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    loan_id = Column(Integer, ForeignKey("loans.id"))
    recommended_amount = Column(Float)
    settlement_percentage = Column(Float)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User")
    loan = relationship("Loan")

class AINegotiationHistory(Base):
    __tablename__ = "ai_negotiation_history"

    id = Column(Integer, primary_key=True, index=True)
    loan_id = Column(Integer, ForeignKey("loans.id"))
    generated_letter = Column(Text)
    strategy = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    loan = relationship("Loan")
