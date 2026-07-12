from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database.config import engine, Base
from .routers import auth, loans, analytics, ai

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Powered Debt Relief & Financial Recovery Platform")

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins, change in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api")
app.include_router(loans.router, prefix="/api")
app.include_router(analytics.router, prefix="/api")
app.include_router(ai.router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Welcome to AI Powered Debt Relief API"}
