import { useEffect, useState } from "react";
import io from "socket.io-client";
import dayjs from "dayjs";

export interface TemperatureData {
  value: number;
  timestamp: string;
}

const host = import.meta.env.VITE_API_HOST;
const socket = io(host);

export function useTemperatureData() {
  const [data, setData] = useState<TemperatureData[]>([]);

  useEffect(() => {
    const fecha = dayjs().locale("America/Lima").format("YYYY-MM-DD");

    fetch(`${host}/api/temperature?from=${fecha}`)
      .then((res) => res.json())
      .then((res) => setData(res));

    socket.on("new-temperature", (newData: TemperatureData) => {
      setData((prev) => [...prev, newData]);
    });

    return () => {
      socket.off("new-temperature");
    };
  }, []);

  return data;
}
