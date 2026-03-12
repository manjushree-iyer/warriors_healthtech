"""
ml_api.py  —  ML Service for Symptom Checker
Warriors HealthTech | Hawkathon 2026

Exposes a lightweight REST API consumed by the backend service.
Designed to run with minimal dependencies for low-resource environments.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, validator
from typing import List
import uvicorn
import logging

from symptom_checker import check_symptoms, CheckResult

# ─────────────────────────────────────────────
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ml_api")

app = FastAPI(
    title="Symptom Checker ML Service",
    description="AI-powered symptom analysis for rural telehealth — Warriors HealthTech",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─────────────────────────────────────────────
# Schemas
# ─────────────────────────────────────────────

class SymptomRequest(BaseModel):
    symptoms: List[str]

    @validator("symptoms")
    def must_have_symptoms(cls, v):
        if not v or all(s.strip() == "" for s in v):
            raise ValueError("At least one symptom must be provided.")
        if len(v) > 20:
            raise ValueError("Too many symptoms. Please limit to 20.")
        return v


class SymptomResponse(BaseModel):
    possible_conditions: List[str]
    triage: str
    confidence: float
    advice: str
    matched_symptoms: List[str]


# ─────────────────────────────────────────────
# Routes
# ─────────────────────────────────────────────

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "symptom-checker-ml"}


@app.post("/ml/predict", response_model=SymptomResponse)
def predict(req: SymptomRequest):
    """
    Core ML prediction endpoint.
    Called internally by the backend /symptoms/check route.
    """
    logger.info(f"Received symptoms: {req.symptoms}")
    try:
        result: CheckResult = check_symptoms(req.symptoms)
        logger.info(f"Triage result: {result.triage} | Conditions: {result.possible_conditions}")
        return SymptomResponse(
            possible_conditions=result.possible_conditions,
            triage=result.triage,
            confidence=result.confidence,
            advice=result.advice,
            matched_symptoms=result.matched_symptoms,
        )
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")


# ─────────────────────────────────────────────
if __name__ == "__main__":
    uvicorn.run("ml_api:app", host="0.0.0.0", port=8001, reload=True)