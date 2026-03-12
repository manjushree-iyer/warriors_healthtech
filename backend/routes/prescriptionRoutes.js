const express = require("express");
const router = express.Router();

const prescriptionController = require("../controllers/prescriptionController");

// doctor sends prescription
router.post("/", prescriptionController.createPrescription);

// pharmacy sees prescriptions
router.get("/pharmacy", prescriptionController.getPharmacyPrescriptions);

// update status
router.put("/:id/status", prescriptionController.updatePrescriptionStatus);

module.exports = router;