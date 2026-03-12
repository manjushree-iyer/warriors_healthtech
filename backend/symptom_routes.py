"""
backend/symptom_routes.py  —  Backend API for Symptom Checker
Warriors HealthTech | Hawkathon 2026

Handles:
  POST /symptoms/check  — receive symptoms, call ML service, log to DB, return result
  GET  /symptoms/logs   — fetch symptom log history for a patient
"""

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, validator
from typing import List, Optional
import httpx
import sqlite3
import uuid
from datetime import datetime
import logging
import os

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("backend")

# ─────────────────────────────────────────────
# Config
# ─────────────────────────────────────────────
ML_SERVICE_URL = os.getenv("ML_SERVICE_URL", "http://localhost:8001/ml/predict")
DB_PATH = os.getenv("DB_PATH", "healthtech.db")

app = FastAPI(
    title="Warriors HealthTech — Backend API",
    description="Telemedicine backend with AI symptom checker",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─────────────────────────────────────────────
# Database Setup
# ─────────────────────────────────────────────

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()


def init_db():
    """Create tables if they don't exist."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.executescript("""
        CREATE TABLE IF NOT EXISTS symptom_logs (
            id          TEXT PRIMARY KEY,
            patient_id  TEXT NOT NULL,
            symptoms    TEXT NOT NULL,          -- JSON array stored as text
            triage_result TEXT NOT NULL,
            conditions  TEXT,                  -- JSON array stored as text
            advice      TEXT,
            confidence  REAL,
            created_at  TEXT NOT NULL
        );

        CREATE INDEX IF NOT EXISTS idx_patient ON symptom_logs(patient_id);
        CREATE INDEX IF NOT EXISTS idx_created ON symptom_logs(created_at);
    """)
    conn.commit()
    conn.close()
    logger.info("Database initialised.")


# ─────────────────────────────────────────────
# Schemas
# ─────────────────────────────────────────────

class SymptomCheckRequest(BaseModel):
    patient_id: Optional[str] = "anonymous"
    symptoms: List[str]

    @validator("symptoms")
    def validate_symptoms(cls, v):
        if not v:
            raise ValueError("symptoms list cannot be empty")
        return [s.strip() for s in v if s.strip()]


class SymptomCheckResponse(BaseModel):
    log_id: str
    patient_id: str
    possible_conditions: List[str]
    triage: str
    advice: str
    confidence: float
    matched_symptoms: List[str]
    timestamp: str


class SymptomLog(BaseModel):
    id: str
    patient_id: str
    symptoms: str
    triage_result: str
    conditions: Optional[str]
    advice: Optional[str]
    confidence: Optional[float]
    created_at: str


# ─────────────────────────────────────────────
# Startup
# ─────────────────────────────────────────────

@app.on_event("startup")
def startup():
    init_db()


# ─────────────────────────────────────────────
# Routes
# ─────────────────────────────────────────────

@app.get("/health")
def health():
    return {"status": "ok", "service": "warriors-healthtech-backend"}


@app.post("/symptoms/check", response_model=SymptomCheckResponse)
async def check_symptoms(req: SymptomCheckRequest, db: sqlite3.Connection = Depends(get_db)):
    """
    Main symptom checker endpoint.
    1. Forwards symptoms to ML service
    2. Logs result to database
    3. Returns structured triage response
    """
    import json

    # ── 1. Call ML Service ──
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            ml_response = await client.post(
                ML_SERVICE_URL,
                json={"symptoms": req.symptoms},
            )
            ml_response.raise_for_status()
            ml_data = ml_response.json()
    except httpx.ConnectError:
        raise HTTPException(
            status_code=503,
            detail="ML service unavailable. Please try again shortly."
        )
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=502, detail=f"ML service error: {e.response.text}")

    # ── 2. Log to Database ──
    log_id = str(uuid.uuid4())
    now = datetime.utcnow().isoformat()

    db.execute(
        """INSERT INTO symptom_logs
           (id, patient_id, symptoms, triage_result, conditions, advice, confidence, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
        (
            log_id,
            req.patient_id,
            json.dumps(req.symptoms),
            ml_data["triage"],
            json.dumps(ml_data["possible_conditions"]),
            ml_data.get("advice", ""),
            ml_data.get("confidence", 0.0),
            now,
        ),
    )
    db.commit()
    logger.info(f"Logged symptom check [{log_id}] for patient [{req.patient_id}] — triage: {ml_data['triage']}")

    # ── 3. Return Response ──
    return SymptomCheckResponse(
        log_id=log_id,
        patient_id=req.patient_id,
        possible_conditions=ml_data["possible_conditions"],
        triage=ml_data["triage"],
        advice=ml_data["advice"],
        confidence=ml_data["confidence"],
        matched_symptoms=ml_data["matched_symptoms"],
        timestamp=now,
    )


@app.get("/symptoms/logs/{patient_id}")
def get_patient_logs(patient_id: str, limit: int = 10, db: sqlite3.Connection = Depends(get_db)):
    """Fetch symptom check history for a specific patient."""
    import json
    rows = db.execute(
        "SELECT * FROM symptom_logs WHERE patient_id = ? ORDER BY created_at DESC LIMIT ?",
        (patient_id, limit),
    ).fetchall()

    logs = []
    for row in rows:
        logs.append({
            "id": row["id"],
            "patient_id": row["patient_id"],
            "symptoms": json.loads(row["symptoms"]),
            "triage_result": row["triage_result"],
            "conditions": json.loads(row["conditions"]) if row["conditions"] else [],
            "advice": row["advice"],
            "confidence": row["confidence"],
            "created_at": row["created_at"],
        })
    return {"patient_id": patient_id, "logs": logs, "count": len(logs)}


# ─────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("symptom_routes:app", host="0.0.0.0", port=8000, reload=True)