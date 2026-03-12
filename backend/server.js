const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  credentials: true
}));
app.use(express.json());

// Import routes
const authRoutes = require("./routes/authRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const consultationRoutes = require("./routes/consultationRoutes");
const pharmacyRoutes = require("./routes/pharmacyRoutes");
const prescriptionRoutes = require("./routes/prescriptionRoutes");
const symptomRoutes = require("./routes/symptomRoutes");

// Route middlewares
app.use("/auth", authRoutes);
app.use("/api", appointmentRoutes);
app.use("/consultations", consultationRoutes);
app.use("/pharmacy", pharmacyRoutes);
app.use("/prescriptions", prescriptionRoutes);
app.use("/symptoms", symptomRoutes);

// Health check route
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "CareConnect Telehealth Backend API Running",
    timestamp: new Date().toISOString()
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "healthy" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV !== "production" ? err.message : undefined
  });
});

// Server start
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Database: Supabase (CareConnect)`);
});