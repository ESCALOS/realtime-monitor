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
    <div className="p-4 mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:justify-center items-center w-full">
        <h1 className="text-xl font-bold text-center uppercase md:order-2 md:ml-4 mb-4 md:mb-0 lg:text-3xl lg:py-6">
          Temperatura de tostado
        </h1>
        <img
          src="https://res.cloudinary.com/defhixtcv/image/upload/v1745198691/logo2_udxykj.webp"
          className="h-12 lg:h-16"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div className="bg-gray-100 p-4 rounded shadow">
          <p className="text-sm lg:text-2xl text-gray-500">
            Tiempo transcurrido
          </p>
          <p className="text-xl lg:text-4xl font-semibold">
            {formatTime(elapsedTime)}
          </p>
        </div>
        <div className="bg-gray-100 p-4 rounded shadow">
          <p className="text-sm lg:text-2xl text-gray-500">
            Temperatura actual
          </p>
          <p className="text-xl lg:text-4xl font-semibold">
            {lastTemp !== null ? `${lastTemp.toFixed(2)} °C` : "--"}
          </p>
        </div>
        <div className="bg-gray-100 p-4 rounded shadow">
          <p className="text-sm lg:text-2xl text-gray-500">
            Δ Temp. (últ. min)
          </p>
          <p className="text-xl lg:text-4xl font-semibold">
            {deltaTemp !== null ? `${deltaTemp} °C` : "--"}
          </p>
        </div>
      </div>

      <TemperatureChart data={data} />

      <div className="flex gap-2 justify-center mt-4">
        {status === "idle" || status === "stopped" ? (
          <button
            onClick={start}
            className="px-4 py-2 lg:px-6 lg:py-4 lg:text-4xl font-bold bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer"
          >
            Iniciar
          </button>
        ) : null}

        {status === "running" && (
          <button
            onClick={pause}
            className="px-4 py-2 lg:px-6 lg:py-4 lg:text-4xl font-bold bg-yellow-500 text-white rounded hover:bg-yellow-600 cursor-pointer"
          >
            Pausar
          </button>
        )}

        {status === "paussed" && (
          <button
            onClick={resume}
            className="px-4 py-2 lg:px-6 lg:py-4 lg:text-4xl font-bold bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
          >
            Reanudar
          </button>
        )}

        {(status === "running" || status === "paussed") && (
          <button
            onClick={stop}
            className="px-4 py-2 lg:px-6 lg:py-4 lg:text-4xl font-bold bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer"
          >
            Detener
          </button>
        )}
      </div>
    </div>
  );
};

export default Monitor;
