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

// Ruta para exportar los datos en XLSX
app.get("/api/temperature/export/xlsx", async (req, res) => {
  try {
    const { from, to } = req.query;

    const filter = {};
    if (from && to) {
      if (from == to) {
        filter.timestamp = new Date(from);
      } else {
        filter.timestamp = {
          $gte: new Date(from),
          $lte: new Date(to),
        };
      }
    } else if (from) {
      filter.timestamp = { $gte: new Date(from) };
    } else if (to) {
      filter.timestamp = { $lte: new Date(to) };
    }
    const data = await Temperature.find(filter).sort({ timestamp: 1 });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Temperaturas");

    worksheet.columns = [
      { header: "Fecha y hora", key: "timestamp", width: 30 },
      { header: "Temperatura (°C)", key: "value", width: 20 },
    ];

    data.forEach((item) => {
      worksheet.addRow({
        timestamp: item.timestamp,
        value: item.value,
      });
    });

    // Formato de la columna de fecha (como fecha y hora en Excel)
    worksheet.getColumn("timestamp").numFmt = "dd-mm-yyyy hh:mm:ss";

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=temperaturas.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error("❌ Error exportando XLSX:", err);
    res.status(500).send("Error al generar el archivo");
  }
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
