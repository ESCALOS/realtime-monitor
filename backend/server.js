const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
require("dotenv").config();
const ExcelJS = require("exceljs");

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
const mongoUri = process.env.MONGO_URI || "mongodb://localhost/monitor";
mongoose
  .connect(mongoUri)
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch((err) => console.error("❌ Error en MongoDB:", err));

// Modelo de temperatura
const SensorsSchema = new mongoose.Schema({
  temperature: Number,
  rpm: Number,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Sensors = mongoose.model("Sensors", SensorsSchema);

// Ruta para recibir datos del ESP32
app.post("/api/sensors", async (req, res) => {
  const { temperature, rpm } = req.body;

  if (typeof temperature !== "number") {
    return res.status(400).json({ error: "Temperatura inválida" });
  }

  if (typeof rpm !== "number") {
    return res.status(400).json({ error: "RPM inválida" });
  }

  const sensors = new Sensors({ temperature, rpm });
  await sensors.save();

  // Emitimos a todos los clientes conectados
  io.emit("new-sensors-data", {
    temperature: sensors.temperature,
    rpm: sensors.rpm,
    timestamp: sensors.timestamp,
  });

  res.status(201).json({ success: true });
});

// Ruta para obtener los registros
app.get("/api/sensors", async (req, res) => {
  const { from, to } = req.query;

  const filter = {};
  if (from && to) {
    filter.timestamp = {
      $gte: new Date(from),
      $lte: new Date(to),
    };
  } else if (from) {
    filter.timestamp = { $gte: new Date(from) };
  } else if (to) {
    filter.timestamp = { $lte: new Date(to) };
  }

  const data = await Sensors.find(filter).sort({ timestamp: 1 });

  res.json(data);
});

// Ruta para exportar los datos en XLSX
app.get("/api/sensors/export/xlsx", async (req, res) => {
  try {
    const { from, to } = req.query;

    const filter = {};
    if (from && to) {
      filter.timestamp = {
        $gte: new Date(from),
        $lte: new Date(to),
      };
    } else if (from) {
      filter.timestamp = { $gte: new Date(from) };
    } else if (to) {
      filter.timestamp = { $lte: new Date(to) };
    }
    const data = await Sensors.find(filter).sort({ timestamp: 1 });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sensores");

    worksheet.columns = [
      { header: "Fecha y hora", key: "timestamp", width: 30 },
      { header: "Temperatura (°C)", key: "value", width: 20 },
      { header: "RPM", key: "rpm", width: 10 },
    ];

    data.forEach((item) => {
      worksheet.addRow({
        timestamp: item.timestamp,
        temperature: item.temperature,
        rpm: item.rpm,
      });
    });

    // Formato de la columna de fecha (como fecha y hora en Excel)
    worksheet.getColumn("timestamp").numFmt = "dd-mm-yyyy hh:mm:ss";

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=sensores.xlsx");

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
