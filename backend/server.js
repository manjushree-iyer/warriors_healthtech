const express = require("express");
const cors = require("cors");
require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

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

});

/* -------------------------
   START SERVER
-------------------------- */

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});