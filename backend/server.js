const express = require("express");
const pharmacyRoutes = require("./routes/pharmacyRoutes");

const app = express();

// Middleware
app.use(express.json());

// Health check route
app.get("/", (req, res) => {
  res.send("TeleHealth Backend Running 🚀");
});

// Pharmacy routes
app.use("/pharmacy", pharmacyRoutes);

// Server Port
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});