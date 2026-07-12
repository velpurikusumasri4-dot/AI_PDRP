def predict_settlement(loan):
    outstanding = loan.outstanding_amount
    overdue = loan.overdue_months
    
    if overdue == 0:
        settlement_percentage = 0
        recommended_amount = outstanding
        advice = "Loan is current. Settlement not advised as it damages credit score."
        priority = "Low"
    elif overdue < 3:
        settlement_percentage = 80
        recommended_amount = outstanding * 0.80
        advice = "Early stage delinquency. Negotiate for restructured EMI or minor haircut."
        priority = "Medium"
    elif overdue < 6:
        settlement_percentage = 50
        recommended_amount = outstanding * 0.50
        advice = "Account likely entering NPA. Good chance to settle for 50-60%."
        priority = "High"
    else:
        settlement_percentage = 30
        recommended_amount = outstanding * 0.30
        advice = "Severely overdue account. Lenders may accept 30-40% one-time settlement."
        priority = "Critical"

    return {
        "loan_id": loan.id,
        "outstanding_amount": outstanding,
        "overdue_months": overdue,
        "settlement_percentage": settlement_percentage,
        "recommended_amount": round(recommended_amount, 2),
        "advice": advice,
        "priority": priority
    }
