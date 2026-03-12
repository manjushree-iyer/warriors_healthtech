const cors = require("cors");
const express = require("express");
<<<<<<< HEAD
const cors = require("cors");
=======
const pharmacyRoutes = require("./routes/pharmacyRoutes");
const prescriptionRoutes = require("./routes/prescriptionRoutes");
>>>>>>> 2f7b55a (sign in page done)
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  })
);

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

<<<<<<< HEAD
// Test route
app.get("/", (req, res) => {
  res.send("Telehealth Backend API Running");
});

// Server start
const PORT = process.env.PORT || 5000;
=======
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.stdin.resume();
app.use("/auth", authRoutes);

>>>>>>> 2f7b55a (sign in page done)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});