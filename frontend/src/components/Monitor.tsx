import React from "react";
import { useTemperatureSession } from "../hooks/useTemperatureSession";
import TemperatureChart from "./TemperatureChart";

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
};

const Monitor: React.FC = () => {
  const {
    status,
    data,
    start,
    pause,
    resume,
    stop,
    elapsedTime,
    lastTemp,
    deltaTemp,
  } = useTemperatureSession();

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-center uppercase">
        Temperatura de tostado
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div className="bg-gray-100 p-4 rounded shadow">
          <p className="text-sm text-gray-500">Tiempo transcurrido</p>
          <p className="text-xl font-semibold">{formatTime(elapsedTime)}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded shadow">
          <p className="text-sm text-gray-500">Temperatura actual</p>
          <p className="text-xl font-semibold">
            {lastTemp !== null ? `${lastTemp.toFixed(2)} °C` : "--"}
          </p>
        </div>
        <div className="bg-gray-100 p-4 rounded shadow">
          <p className="text-sm text-gray-500">Δ Temp. (últ. min)</p>
          <p className="text-xl font-semibold">
            {deltaTemp !== null ? `${deltaTemp} °C` : "--"}
          </p>
        </div>
      </div>

      <TemperatureChart data={data} />

      <div className="flex gap-2 justify-center mt-4">
        {status === "idle" || status === "stopped" ? (
          <button
            onClick={start}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Iniciar
          </button>
        ) : null}

        {status === "running" && (
          <button
            onClick={pause}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Pausar
          </button>
        )}

        {status === "paussed" && (
          <button
            onClick={resume}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Reanudar
          </button>
        )}

        {(status === "running" || status === "paussed") && (
          <button
            onClick={stop}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Detener
          </button>
        )}
      </div>
    </div>
  );
};

export default Monitor;
