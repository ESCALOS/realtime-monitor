import { PlayCircle, StopCircle } from "lucide-react";
import { SessionStatus } from "../hooks/useTemperatureSession";
import { ConfirmPopup } from "./ConfirmPopup";

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
          onClick={start}
          className="rounded-full bg-green-500 text-white hover:bg-green-700 cursor-pointer"
        >
          <PlayCircle size={iconSize} />
        </button>
      ) : null}

      {(status === "running" || status === "paussed") && (
        <ConfirmPopup onConfirm={stop}>
          <StopCircle size={iconSize} />
        </ConfirmPopup>
      )}
    </div>
  );
}
