const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const authRoutes = require("./routes/authRoutes");
const consultationRoutes = require("./routes/consultationRoutes");
const pharmacyRoutes = require("./routes/pharmacyRoutes");
const prescriptionRoutes = require("./routes/prescriptionRoutes");
const symptomRoutes = require("./routes/symptomRoutes");

// Route middlewares
app.use("/auth", authRoutes);
app.use("/consultations", consultationRoutes);
app.use("/pharmacy", pharmacyRoutes);
app.use("/prescriptions", prescriptionRoutes);
app.use("/symptoms", symptomRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Telehealth Backend API Running");
});

// Server start
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});