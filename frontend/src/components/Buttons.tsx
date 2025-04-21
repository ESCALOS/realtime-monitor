import { PlayCircle, StopCircle } from "lucide-react";
import { SessionStatus } from "../hooks/useTemperatureSession";

type Props = {
  start: () => void;
  stop: () => void;
  status: SessionStatus;
};

const iconSize = 65;

export default function Buttons({ start, stop, status }: Props) {
  return (
    <div className="flex justify-around items-center">
      {status === "idle" || status === "stopped" ? (
        <button
          className="rounded-full bg-green-500 text-white hover:bg-green-700 cursor-pointer"
          onClick={start}
        >
          <PlayCircle size={iconSize} />
        </button>
      ) : null}

      {(status === "running" || status === "paussed") && (
        <button
          onClick={stop}
          className="rounded-full bg-red-500 text-white hover:bg-red-700 cursor-pointer"
        >
          <StopCircle size={iconSize} />
        </button>
      )}
    </div>
  );
}
