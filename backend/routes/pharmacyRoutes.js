const express = require("express");
const router = express.Router();

const pharmacyController = require("../controllers/pharmacyController");

router.get("/search", pharmacyController.searchMedicine);

router.post("/medicine", pharmacyController.addMedicine);

router.put("/medicine/:id", pharmacyController.updateStock);

module.exports = router;