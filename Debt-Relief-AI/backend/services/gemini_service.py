import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

def generate_negotiation_letter(loan_details, tone, strategy):
    if not GEMINI_API_KEY or GEMINI_API_KEY == "your-gemini-api-key":
        return f"[MOCK LETTER] Please configure GEMINI_API_KEY in .env to generate real letters.\n\nDear Lender,\nI am writing to discuss my loan {loan_details['loan_name']} with outstanding amount {loan_details['outstanding_amount']}..."

    prompt = f"""
    You are an expert financial advisor and debt negotiator.
    Write a {tone} negotiation letter to a bank/lender regarding a loan settlement.
    
    Loan Details:
    - Lender: {loan_details['lender_name']}
    - Loan Type: {loan_details['loan_type']}
    - Outstanding Amount: ${loan_details['outstanding_amount']}
    - Overdue Months: {loan_details['overdue_months']}
    
    Strategy: {strategy}
    
    The letter should be professional, clear, and focused on reaching a settlement based on the strategy.
    Do not include any placeholders like [Your Name] if possible, just write the body and sign off as "The Borrower".
    """
    
    try:
        model = genai.GenerativeModel('gemini-pro')
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Error generating letter: {str(e)}"
