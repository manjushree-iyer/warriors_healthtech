const pool = require("../db/db");

// GET ALL DOCTORS (for booking)
exports.getAllDoctors = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT d.id, u.name, d.specialization, d.hospital 
       FROM doctors d 
       JOIN users u ON d.user_id = u.id`
    );
    res.json({ success: true, doctors: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET DOCTOR'S FULL SCHEDULE
exports.getDoctorSchedule = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const result = await pool.query(
      `SELECT a.*, u.name as patient_name 
       FROM appointments a 
       JOIN users u ON a.patient_id = u.id 
       JOIN doctors d ON a.doctor_id = d.id
       WHERE d.user_id = $1 
       ORDER BY a.scheduled_time ASC`,
      [doctorId]
    );
    res.json({ success: true, appointments: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET PATIENTS TREATED BY DOCTOR
exports.getTreatedPatients = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const result = await pool.query(
      `SELECT DISTINCT u.id, u.name, u.email, p.abha_id 
       FROM users u 
       JOIN patients p ON u.id = p.user_id 
       JOIN appointments a ON p.id = a.patient_id 
       JOIN doctors d ON a.doctor_id = d.id
       WHERE d.user_id = $1`,
      [doctorId]
    );
    res.json({ success: true, patients: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET SPECIFIC PATIENT HISTORY
exports.getPatientHistory = async (req, res) => {
  try {
    const { patientId } = req.params;
    
    // Map user.id to internal patient_id
    const patientRes = await pool.query("SELECT id FROM patients WHERE user_id = $1", [patientId]);
    const internalId = patientRes.rows.length > 0 ? patientRes.rows[0].id : patientId;

    // Get consultations
    const consultations = await pool.query(
      `SELECT c.*, u.name as doctor_name 
       FROM consultations c 
       JOIN appointments a ON c.appointment_id = a.id 
       JOIN doctors d ON a.doctor_id = d.id 
       JOIN users u ON d.user_id = u.id 
       WHERE a.patient_id = $1 
       ORDER BY a.scheduled_time DESC`,
      [internalId]
    );

    // Get prescriptions
    const prescriptions = await pool.query(
      `SELECT * FROM prescriptions 
       WHERE patient_id = $1 
       ORDER BY created_at DESC`,
      [internalId]
    );

    // Get symptom logs
    const symptomLogs = await pool.query(
      `SELECT * FROM symptom_logs 
       WHERE patient_id = $1 
       ORDER BY created_at DESC`,
      [internalId]
    );

    res.json({
      success: true,
      history: {
        consultations: consultations.rows,
        prescriptions: prescriptions.rows,
        symptomLogs: symptomLogs.rows
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
