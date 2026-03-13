const db = require("../db/db");

/*
Patient requests appointment
*/
exports.createAppointment = async (req, res) => {

  try {

    const { doctor_id, scheduled_time, notes } = req.body;
    const user_id = req.user.id;

    // Verify patient profile
    const patientCheck = await db.query("SELECT id FROM patients WHERE user_id = $1", [user_id]);
    if (patientCheck.rows.length === 0) {
      return res.status(403).json({ success: false, message: "Patient profile not found" });
    }
    const patient_id = patientCheck.rows[0].id;

    const result = await db.query(
      `INSERT INTO appointments
       (patient_id, doctor_id, scheduled_time, status, notes)
       VALUES ($1,$2,$3,'pending',$4)
       RETURNING *`,
      [patient_id, doctor_id, scheduled_time, notes]
    );

    res.status(201).json({
      success: true,
      appointment: result.rows[0]
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


/*
Doctor dashboard queue
Includes patient details and recent symptom logs
*/
exports.getDoctorQueue = async (req, res) => {
  try {
    const doctorId = req.user.id;

    const result = await db.query(
      `SELECT 
        a.id AS appointment_id,
        a.scheduled_time,
        a.status,
        a.notes,
        u.name AS patient_name,
        p.abha_id,
        (SELECT symptoms FROM symptom_logs WHERE patient_id = a.patient_id ORDER BY id DESC LIMIT 1) AS latest_symptoms,
        (SELECT triage_result FROM symptom_logs WHERE patient_id = a.patient_id ORDER BY id DESC LIMIT 1) AS latest_triage
       FROM appointments a
       JOIN users u ON a.patient_id = u.id
       JOIN patients p ON u.id = p.user_id
       WHERE a.doctor_id = $1
       AND a.status = 'pending'
       ORDER BY a.scheduled_time ASC`,
      [doctorId]
    );

    res.json({
      success: true,
      queue: result.rows
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};