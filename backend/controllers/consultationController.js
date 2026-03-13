const db = require("../db/db");

/*
Start consultation
*/
exports.startConsultation = async (req, res) => {

  try {

    const { appointment_id, call_type } = req.body;

    const consultation = await db.query(
      `INSERT INTO consultations
       (appointment_id, call_type)
       VALUES ($1,$2)
       RETURNING *`,
      [appointment_id, call_type]
    );

    await db.query(
      `UPDATE appointments
       SET status='active'
       WHERE id=$1`,
      [appointment_id]
    );

    const patientRecord = await db.query(
      `SELECT * FROM patients
       WHERE id = (
         SELECT patient_id FROM appointments WHERE id=$1
       )`,
      [appointment_id]
    );

    const patient_id_res = await db.query(
      `SELECT patient_id FROM appointments WHERE id=$1`,
      [appointment_id]
    );

    res.json({
      consultation: {
        ...consultation.rows[0],
        patient_id: patient_id_res.rows[0].patient_id
      },
      patient_records: patientRecord.rows[0]
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};


/*
Consultation history
*/
exports.getConsultationHistory = async (req, res) => {

  try {

    const { patientId } = req.params;

    // Map user.id to internal patient_id if necessary
    const patientRes = await db.query("SELECT id FROM patients WHERE user_id = $1", [patientId]);
    const internalId = patientRes.rows.length > 0 ? patientRes.rows[0].id : patientId;

    const result = await db.query(
      `SELECT c.*, u.name as doctor_name
       FROM consultations c
       JOIN appointments a ON c.appointment_id = a.id
       JOIN doctors d ON a.doctor_id = d.id
       JOIN users u ON d.user_id = u.id
       WHERE a.patient_id=$1
       ORDER BY c.created_at DESC`,
      [internalId]
    );

    res.json({
      history: result.rows
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};


/*
Doctor writes consultation notes
*/
exports.addDoctorNotes = async (req, res) => {

  try {

    const { consultation_id, doctor_notes } = req.body;

    const result = await db.query(
      `UPDATE consultations
       SET doctor_notes=$1
       WHERE id=$2
       RETURNING *`,
      [doctor_notes, consultation_id]
    );

    res.json({
      consultation: result.rows[0]
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};