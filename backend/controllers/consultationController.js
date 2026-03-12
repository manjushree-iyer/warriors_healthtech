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

    res.json({
      consultation: consultation.rows[0],
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

    const result = await db.query(
      `SELECT c.*, a.doctor_id
       FROM consultations c
       JOIN appointments a
       ON c.appointment_id = a.id
       WHERE a.patient_id=$1`,
      [patientId]
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