import React, { useState, useRef, useEffect } from "react";

export const ConfirmPopup = ({
  message = "¿Detener?",
  onConfirm,
  children,
}: {
  message?: string;
  onConfirm: () => void;
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen(true)}
        className="rounded-full bg-red-500 text-white hover:bg-red-700 cursor-pointer"
      >
        {children}
      </button>

      {open && (
        <div
          ref={popupRef}
          className="absolute z-10 mt-2 w-32 p-4 bg-white rounded shadow-lg border border-gray-200"
        >
          <p className="text-gray-700 font-bold">{message}</p>
          <div className="mt-4 flex justify-end space-x-2">
            <button
              onClick={() => setOpen(false)}
              className="px-3 py-1 text-gray-700 border border-gray-300 rounded hover:bg-gray-100"
            >
              No
            </button>
            <button
              onClick={() => {
                onConfirm();
                setOpen(false);
              }}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Sí
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
