"use client";

import { FaSpinner } from "react-icons/fa";

type LoadingOverlayProps = {
  visible: boolean;
};

export default function LoadingOverlay({ visible }: LoadingOverlayProps) {
  if (!visible) return null;

  return (
    <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-5 rounded-lg">
      <div className="flex flex-col items-center space-y-2">
        <FaSpinner className="animate-spin text-orange-500 text-2xl" />
      </div>
    </div>
  );
}
