const express = require("express");
const router = express.Router();
const doctorController = require("../controllers/doctorController");
const auth = require("../middleware/authMiddleware");

// Public (to be filtered by frontend/role if needed)
router.get("/", doctorController.getAllDoctors);

// Doctor specific
router.get("/schedule", auth, doctorController.getDoctorSchedule);
router.get("/patients", auth, doctorController.getTreatedPatients);
router.get("/patient-history/:patientId", auth, doctorController.getPatientHistory);

module.exports = router;
