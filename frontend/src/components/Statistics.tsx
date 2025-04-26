import { SessionStatus } from "../hooks/useTemperatureSession";
import { formatTime } from "../utils";
import { Flame, Clock } from "lucide-react"; // o cualquier icono de tu preferencia

type Props = {
  elapsedTime: number;
  elapsedSinceFirstCrack: number;
  showFirstCrackTimer: boolean;
  toggleView: () => void;
  markFirstCrack: () => void;
  firstCrackTime: Date | null;
  lastTemp: number | null;
  deltaTemp: string | null;
  status: SessionStatus;
};

export default function Statistics({
  elapsedTime,
  elapsedSinceFirstCrack,
  showFirstCrackTimer,
  toggleView,
  markFirstCrack,
  firstCrackTime,
  lastTemp,
  deltaTemp,
  status,
}: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center w-full">
      <div className="relative bg-gray-100 p-4 rounded shadow">
        <p className="text-sm lg:text-2xl text-gray-500">
          {showFirstCrackTimer ? "Desde primer crack" : "Tiempo transcurrido"}
        </p>
        <p className="text-xl lg:text-4xl font-semibold">
          {showFirstCrackTimer
            ? formatTime(elapsedSinceFirstCrack)
            : formatTime(elapsedTime)}
        </p>

        <div className="absolute top-2 right-2 flex gap-2">
          {firstCrackTime && (
            <button
              onClick={toggleView}
              className="text-gray-500 hover:text-black transition"
              title="Alternar vista"
            >
              <Clock className="w-5 h-5" />
            </button>
          )}
          {!firstCrackTime && status === "running" && (
            <button
              onClick={markFirstCrack}
              className="text-red-500 hover:text-red-700 transition"
              title="Marcar primer crack"
            >
              <Flame className="w-5 h-5" />
            </button>
          )}
        </div>
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
