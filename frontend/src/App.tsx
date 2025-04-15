import { useEffect, useState } from "react";
import io from "socket.io-client";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const socket = io("http://192.168.0.119:4000"); // En producción puede ser sin host

interface TemperatureData {
  value: number;
  timestamp: string;
}

function App() {
  const [data, setData] = useState<TemperatureData[]>([]);

  useEffect(() => {
    // Obtener datos históricos al cargar
    fetch("http://192.168.0.119:4000/api/temperature")
      .then((res) => res.json())
      .then((res) => setData(res));

    // Escuchar nuevos datos en tiempo real
    socket.on("new-temperature", (newData: TemperatureData) => {
      setData((prev) => [...prev.slice(-19), newData]); // solo los últimos 20
    });

    return () => {
      socket.off("new-temperature");
    };
  }, []);

  const chartData = {
    labels: data.map((d) => new Date(d.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: "Temperatura (°C)",
        data: data.map((d) => d.value),
        fill: false,
        borderColor: "rgb(75,192,192)",
        tension: 0.3,
      },
    ],
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Monitor de Temperatura</h1>
      <Line data={chartData} />
    </div>
  );
}

export default App;
