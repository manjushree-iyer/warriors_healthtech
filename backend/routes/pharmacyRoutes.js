const express = require("express");
const router = express.Router();

const pharmacyController = require("../controllers/pharmacyController");

router.get("/search", pharmacyController.searchMedicine);

module.exports = router;