const express = require("express");
const pharmacyRoutes = require("./routes/pharmacyRoutes");
const prescriptionRoutes = require("./routes/prescriptionRoutes");

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