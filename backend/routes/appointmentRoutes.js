const express = require("express");
const router = express.Router();

const {
  createAppointment,
  getDoctorQueue
} = require("../controllers/appointmentController");

const auth = require("../middleware/authMiddleware");

router.post("/appointments", auth, createAppointment);

router.get("/doctor/queue", auth, getDoctorQueue);

module.exports = router;