const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend server running");
});

app.post("/classify", async (req, res) => {
  const text = req.body.text;

  try {
    const response = await axios.post(
      "http://127.0.0.1:5001/classify",
      { text: text }
    );

    res.json(response.data);

  } catch (error) {
    res.status(500).json({ error: "ML service failed" });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});