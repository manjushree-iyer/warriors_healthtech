const cors = require("cors");
const express = require("express");
<<<<<<< HEAD
const cors = require("cors");
=======
const pharmacyRoutes = require("./routes/pharmacyRoutes");
const prescriptionRoutes = require("./routes/prescriptionRoutes");
>>>>>>> 2f7b55a (sign in page done)
require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");

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

<<<<<<< HEAD
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
=======
/* -------------------------
   EXISTING ROUTES
   (Keep these if they exist)
-------------------------- */

// Example routes – keep your existing ones
// const authRoutes = require("./routes/authRoutes");
// const consultationRoutes = require("./routes/consultationRoutes");
// const pharmacyRoutes = require("./routes/pharmacyRoutes");
// const prescriptionRoutes = require("./routes/prescriptionRoutes");

// app.use("/auth", authRoutes);
// app.use("/consultations", consultationRoutes);
// app.use("/pharmacy", pharmacyRoutes);
// app.use("/prescriptions", prescriptionRoutes);

/* -------------------------
   TEST ROUTE
-------------------------- */

app.get("/", (req, res) => {
  res.send("Telehealth Backend API Running");
});

/* -------------------------
   CREATE HTTP SERVER
-------------------------- */

const server = http.createServer(app);

/* -------------------------
   SOCKET.IO SERVER
-------------------------- */

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

/* -------------------------
   SIGNALING LOGIC
-------------------------- */

io.on("connection", (socket) => {

  console.log("User connected:", socket.id);

  // Join consultation room
  socket.on("join-room", (roomId) => {

    socket.join(roomId);

    console.log(`User ${socket.id} joined room ${roomId}`);

  });

  // Exchange WebRTC signals
  socket.on("signal", (data) => {

    socket.to(data.roomId).emit("signal", data.signal);

  });

  socket.on("disconnect", () => {

    console.log("User disconnected:", socket.id);

  });

>>>>>>> vc
});

/* -------------------------
   START SERVER
-------------------------- */

const PORT = process.env.PORT || 5000;
=======
const PORT = process.env.PORT || 5000;

<<<<<<< HEAD
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.stdin.resume();
app.use("/auth", authRoutes);

>>>>>>> 2f7b55a (sign in page done)

app.listen(PORT, () => {
=======
server.listen(PORT, () => {
>>>>>>> vc
  console.log(`Server running on port ${PORT}`);
});