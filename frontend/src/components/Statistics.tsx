import { formatTime } from "../utils";

type Props = {
  elapsedTime: number;
  lastTemp: number | null;
  deltaTemp: string | null;
};

export default function Statistics({
  elapsedTime,
  lastTemp,
  deltaTemp,
}: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center w-full">
      <div className="bg-gray-100 p-4 rounded shadow">
        <p className="text-sm lg:text-2xl text-gray-500">Tiempo transcurrido</p>
        <p className="text-xl lg:text-4xl font-semibold">
          {formatTime(elapsedTime)}
        </p>
      </div>
      <div className="bg-gray-100 p-4 rounded shadow">
        <p className="text-sm lg:text-2xl text-gray-500">Temperatura actual</p>
        <p className="text-xl lg:text-4xl font-semibold">
          {lastTemp !== null ? `${lastTemp.toFixed(2)} °C` : "--"}
        </p>
      </div>
      <div className="bg-gray-100 p-4 rounded shadow">
        <p className="text-sm lg:text-2xl text-gray-500">Δ Temp. (últ. min)</p>
        <p className="text-xl lg:text-4xl font-semibold">
          {deltaTemp !== null ? `${deltaTemp} °C` : "--"}
        </p>
      </div>
    </div>
  );
}
