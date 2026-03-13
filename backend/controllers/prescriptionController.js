const pool = require("../db/db");

// DOCTOR SENDS PRESCRIPTION
exports.createPrescription = async (req, res) => {
  const {
    consultation_id,
    patient_id,
    pharmacy_id,
    medicine_name,
    dosage,
    instructions
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO prescriptions
      (consultation_id, patient_id, pharmacy_id, medicine_name, dosage, instructions)
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING *`,
      [consultation_id, patient_id, pharmacy_id, medicine_name, dosage, instructions]
    );

    res.json({
      success: true,
      message: "Prescription created",
      data: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// PHARMACY VIEW PRESCRIPTIONS
exports.getPharmacyPrescriptions = async (req, res) => {
  const { pharmacy_id } = req.query;
  try {
    const result = await pool.query(
      `SELECT * FROM prescriptions WHERE pharmacy_id = $1 ORDER BY created_at DESC`,
      [pharmacy_id]
    );
    res.json({ success: true, prescriptions: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// UPDATE PRESCRIPTION STATUS
exports.updatePrescriptionStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const result = await pool.query(
      `UPDATE prescriptions SET status = $1 WHERE id = $2 RETURNING *`,
      [status, id]
    );
    res.json({
      success: true,
      message: "Prescription status updated",
      data: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// PATIENT VIEW OWN PRESCRIPTIONS
exports.getMyPrescriptions = async (req, res) => {
  try {
    const userId = req.user.id;
    const patientRes = await pool.query("SELECT id FROM patients WHERE user_id = $1", [userId]);
    if (patientRes.rows.length === 0) return res.status(404).json({ success: false, message: "Patient profile not found" });
    const patientId = patientRes.rows[0].id;

    const result = await pool.query(
      `SELECT p.*, u.name as doctor_name
       FROM prescriptions p
       LEFT JOIN consultations c ON p.consultation_id = c.id
       LEFT JOIN appointments a ON c.appointment_id = a.id
       LEFT JOIN doctors d ON a.doctor_id = d.id
       LEFT JOIN users u ON d.user_id = u.id
       WHERE p.patient_id = $1
       ORDER BY p.created_at DESC`,
      [patientId]
    );

    res.json({ success: true, prescriptions: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};