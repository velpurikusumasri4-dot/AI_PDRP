def calculate_financial_health(loans, monthly_income):
    if not loans or monthly_income <= 0:
        return {
            "total_debt": 0,
            "monthly_emi": 0,
            "dti_ratio": 0,
            "monthly_surplus": monthly_income,
            "health_score": 100,
            "risk_category": "Safe"
        }

    total_debt = sum(loan.outstanding_amount for loan in loans)
    monthly_emi = sum(loan.emi for loan in loans)
    
    dti_ratio = (monthly_emi / monthly_income) * 100
    monthly_surplus = monthly_income - monthly_emi
    
    # Simple heuristic for health score
    health_score = max(0, 100 - (dti_ratio * 1.5))
    
    if health_score > 75:
        risk_category = "Safe"
    elif health_score > 50:
        risk_category = "Moderate Risk"
    elif health_score > 25:
        risk_category = "High Risk"
    else:
        risk_category = "Severe Risk"

    return {
        "total_debt": total_debt,
        "monthly_emi": monthly_emi,
        "dti_ratio": round(dti_ratio, 2),
        "monthly_surplus": monthly_surplus,
        "health_score": round(health_score, 2),
        "risk_category": risk_category
    }
