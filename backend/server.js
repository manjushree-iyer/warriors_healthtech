const express = require("express");
const pharmacyRoutes = require("./routes/pharmacyRoutes");
const prescriptionRoutes = require("./routes/prescriptionRoutes");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("TeleHealth Backend Running 🚀");
});

app.use("/pharmacy", pharmacyRoutes);
app.use("/prescriptions", prescriptionRoutes);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.stdin.resume();
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(`Server running on port ${PORT}`);

});
