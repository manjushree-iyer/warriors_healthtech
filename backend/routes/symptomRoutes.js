const express = require("express");
const router = express.Router();
const pool = require("../db/db");
const authMiddleware = require("../middleware/authMiddleware");

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:8000";

/**
 * POST /symptoms/check
 * Patient submits symptoms -> forwards to ML service -> logs to DB
 */
router.post("/check", authMiddleware, async (req, res) => {
  const { symptoms } = req.body;
  const patient_id = req.user.id;

  if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Please provide a non-empty symptoms array"
    });
  }

  try {
    // Forward to Python ML service
    const fetch = require("node-fetch");
    const mlResponse = await fetch(`${ML_SERVICE_URL}/ml/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symptoms })
    });

    if (!mlResponse.ok) {
      throw new Error(`ML service returned ${mlResponse.status}`);
    }

    const mlData = await mlResponse.json();

    // Log to Supabase DB
    const logResult = await pool.query(
      `INSERT INTO symptom_logs (patient_id, symptoms, triage_result)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [patient_id, symptoms.join(", "), mlData.triage || "unknown"]
    );

    res.json({
      success: true,
      log: logResult.rows[0],
      result: mlData
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Symptom check failed",
      error: error.message
    });
  }
});

/**
 * GET /symptoms/logs/:patientId
 * Fetch symptom history for a patient
 */
router.get("/logs/:patientId", authMiddleware, async (req, res) => {
  const { patientId } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM symptom_logs
       WHERE patient_id = $1
       ORDER BY created_at DESC
       LIMIT 20`,
      [patientId]
    );

    res.json({
      success: true,
      logs: result.rows
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch symptom logs",
      error: error.message
    });
  }
});

/**
 * GET /symptoms/my-logs
 * Fetch symptom history for authenticated patient
 */
router.get("/my-logs", authMiddleware, async (req, res) => {
  const patient_id = req.user.id;

  try {
    const result = await pool.query(
      `SELECT * FROM symptom_logs
       WHERE patient_id = $1
       ORDER BY created_at DESC
       LIMIT 20`,
      [patient_id]
    );

    res.json({
      success: true,
      logs: result.rows
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch symptom logs",
      error: error.message
    });
  }
});

module.exports = router;
