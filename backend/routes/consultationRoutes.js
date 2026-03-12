const express = require("express");
const router = express.Router();

const {
  startConsultation,
  getConsultationHistory,
  addDoctorNotes
} = require("../controllers/consultationController");

const auth = require("../middleware/authMiddleware");

router.post("/consultations/start", auth, startConsultation);

router.get("/consultations/:patientId", auth, getConsultationHistory);

router.post("/consultations/notes", auth, addDoctorNotes);

module.exports = router;