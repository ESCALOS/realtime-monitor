import React from "react";
import { useTemperatureSession } from "../hooks/useTemperatureSession";
import TemperatureChart from "./TemperatureChart";
import Buttons from "./Buttons";
import Stadistics from "./Statistics";

const Monitor: React.FC = () => {
  const { status, data, start, stop, elapsedTime, lastTemp, deltaTemp } =
    useTemperatureSession();

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

      <div className="flex gap-4 w-full justify-center items-center">
        <Buttons start={start} stop={stop} status={status} />
        <Stadistics
          elapsedTime={elapsedTime}
          lastTemp={lastTemp}
          deltaTemp={deltaTemp}
        />
      </div>

      <TemperatureChart data={data} />
    </div>
  );
};

export default Monitor;
