const express = require("express");
const router = express.Router();
const prescriptionController = require("../controllers/prescriptionController");
const auth = require("../middleware/authMiddleware");

// doctor sends prescription
router.post("/", auth, prescriptionController.createPrescription);

// pharmacy sees prescriptions
router.get("/pharmacy", prescriptionController.getPharmacyPrescriptions);

// patient sees their own
router.get("/me", auth, prescriptionController.getMyPrescriptions);

// update status
router.put("/:id/status", auth, prescriptionController.updatePrescriptionStatus);

module.exports = router;