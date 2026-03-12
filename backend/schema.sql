-- ============================================================
-- Warriors HealthTech — Database Schema
-- Symptom Checker Module
-- Hawkathon 2026
-- ============================================================

-- symptom_logs: stores every symptom check result
CREATE TABLE IF NOT EXISTS symptom_logs (
    id            TEXT PRIMARY KEY,          -- UUID
    patient_id    TEXT NOT NULL,             -- Patient identifier (can be anonymous)
    symptoms      TEXT NOT NULL,             -- JSON array: ["fever","cough"]
    triage_result TEXT NOT NULL,             -- "Home Care" | "Consult Doctor" | "Emergency"
    conditions    TEXT,                      -- JSON array: ["Flu","Viral Infection"]
    advice        TEXT,                      -- Plain-text advice for patient
    confidence    REAL,                      -- ML confidence score 0.0 – 1.0
    created_at    TEXT NOT NULL              -- ISO 8601 UTC timestamp
);

-- Indexes for fast lookup by patient and time
CREATE INDEX IF NOT EXISTS idx_symptom_logs_patient   ON symptom_logs(patient_id);
CREATE INDEX IF NOT EXISTS idx_symptom_logs_triage    ON symptom_logs(triage_result);
CREATE INDEX IF NOT EXISTS idx_symptom_logs_created   ON symptom_logs(created_at DESC);

-- ============================================================
-- Example rows
-- ============================================================
/*
INSERT INTO symptom_logs VALUES (
    'a1b2c3d4-0000-0000-0000-000000000001',
    'patient_101',
    '["fever","cough","fatigue"]',
    'Consult Doctor',
    '["Influenza (Flu)","COVID-19"]',
    'Likely flu. Consult a doctor for antiviral medication. Rest and hydrate well.',
    0.75,
    '2026-03-15T10:30:00'
);

INSERT INTO symptom_logs VALUES (
    'a1b2c3d4-0000-0000-0000-000000000002',
    'patient_202',
    '["chest pain","breathlessness","sweating"]',
    'Emergency',
    '["Heart Attack"]',
    'EMERGENCY: Could be cardiac event. Call ambulance immediately.',
    0.90,
    '2026-03-15T11:00:00'
);
*/