const db = require("../db/db");

/*
Patient requests appointment
*/
exports.createAppointment = async (req, res) => {

  try {

    const { doctor_id, scheduled_time } = req.body;
    const patient_id = req.user.id;

    const result = await db.query(
      `INSERT INTO appointments
       (patient_id, doctor_id, scheduled_time)
       VALUES ($1,$2,$3)
       RETURNING *`,
      [patient_id, doctor_id, scheduled_time]
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
*/
exports.getDoctorQueue = async (req, res) => {

  try {

    const doctorId = req.user.id;

    const result = await db.query(
      `SELECT * FROM appointments
       WHERE doctor_id=$1
       AND status='pending'
       ORDER BY created_at ASC`,
      [doctorId]
    );

    res.json({
      queue: result.rows
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};