import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import dayjs from "dayjs";
import { SensorsData } from "../types";

export type SessionStatus = "idle" | "running" | "paussed" | "stopped";

const host = import.meta.env.VITE_API_HOST;
const socket = io(host);

export function useTemperatureSession() {
  const [status, setStatus] = useState<SessionStatus>("idle");
  const [data, setData] = useState<SensorsData[]>([]);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0); // en segundos
  const [lastTemp, setLasTemp] = useState<number | null>(null);
  const [lastRpm, setLasRpm] = useState<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [firstCrackTime, setFirstCrackTime] = useState<Date | null>(null);
  const [elapsedSinceFirstCrack, setElapsedSinceFirstCrack] =
    useState<number>(0);
  const [showFirstCrackTimer, setShowFirstCrackTimer] = useState(false);

  useEffect(() => {
    if (status === "running") {
      intervalRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
        if (firstCrackTime) {
          const now = new Date();
          const diff = Math.floor(
            (now.getTime() - firstCrackTime.getTime()) / 1000
          );
          setElapsedSinceFirstCrack(diff);
        }
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [status, firstCrackTime]);

  // Socket
  useEffect(() => {
    const handleNewSensorsData = (newData: SensorsData) => {
      const adjustedData: SensorsData = {
        ...newData,
        timestamp: dayjs(newData.timestamp)
          .subtract(5, "h")
          .format("YYYY-MM-DDTHH:mm:ss"),
      };

      setLasTemp(adjustedData.temperature);

      setLasRpm(adjustedData.rpm);

      if (status === "running") {
        setData((prev) => [...prev, adjustedData]);
      }
    };

    socket.on("new-sensors-data", handleNewSensorsData);

    return () => {
      socket.off("new-sensors-data", handleNewSensorsData);
    };
  }, [status]);

  //Acciones
  const start = () => {
    setData([]);
    setStartTime(new Date());
    setElapsedTime(0);
    resetFirstCrack();
    setStatus("running");
  };

  const pause = () => {
    if (status === "running") {
      setStatus("paussed");
    }
  };

  const resume = () => {
    if (status === "paussed") {
      setStatus("running");
    }
  };

  const stop = () => {
    setStatus("stopped");
  };

  const resetFirstCrack = () => {
    setFirstCrackTime(null);
    setElapsedSinceFirstCrack(0);
    setShowFirstCrackTimer(false);
  };

  // Delta de temperatura en el último minuto
  const deltaTemp = (() => {
    if (data.length < 2) return null;

    const now = dayjs().subtract(5, "h");
    const oneMinuteAgo = now.subtract(1, "minute");

    const lastMinuteData = data.filter((d) =>
      dayjs(d.timestamp).isAfter(oneMinuteAgo)
    );

    if (lastMinuteData.length < 2) return null;

    const first = lastMinuteData[0].temperature;
    const last = lastMinuteData[lastMinuteData.length - 1].temperature;

    return (last - first).toFixed(2);
  })();

  const markFirstCrack = () => {
    if (!firstCrackTime) {
      const now = new Date();
      setFirstCrackTime(now);
      setElapsedSinceFirstCrack(0);
      setShowFirstCrackTimer(true);
    }
  };

  const toggleView = () => {
    setShowFirstCrackTimer((prev) => !prev);
  };

  return {
    status,
    data,
    start,
    pause,
    resume,
    stop,
    elapsedTime,
    lastTemp,
    lastRpm,
    deltaTemp,
    startTime,
    firstCrackTime,
    elapsedSinceFirstCrack,
    markFirstCrack,
    toggleView,
    showFirstCrackTimer,
  };
}
