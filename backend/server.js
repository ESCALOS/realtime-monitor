const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());
app.use(express.json());

// Conexión a MongoDB
const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/monitor";
mongoose
  .connect(mongoUri)
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch((err) => console.error("❌ Error en MongoDB:", err));

// Modelo de temperatura
const TemperatureSchema = new mongoose.Schema({
  value: Number,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Temperature = mongoose.model("Temperature", TemperatureSchema);

// Ruta para recibir datos del ESP32
app.post("/api/temperature", async (req, res) => {
  const { value } = req.body;

  if (typeof value !== "number") {
    return res.status(400).json({ error: "Valor inválido" });
  }

  const temperature = new Temperature({ value });
  await temperature.save();

  // Emitimos a todos los clientes conectados
  io.emit("new-temperature", {
    value: temperature.value,
    timestamp: temperature.timestamp,
  });

  res.status(201).json({ success: true });
});

// Ruta para obtener los últimos N registros
app.get("/api/temperature", async (req, res) => {
  const data = await Temperature.find().sort({ timestamp: -1 }).limit(20);
  res.json(data.reverse()); // para que se muestre en orden cronológico
});

io.on("connection", (socket) => {
  console.log("📡 Cliente conectado");

  socket.on("disconnect", () => {
    console.log("🔌 Cliente desconectado");
  });
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`🚀 Backend corriendo en http://localhost:${PORT}`);
});
