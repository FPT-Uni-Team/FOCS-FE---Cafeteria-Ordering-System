import React, { useRef, useState } from "react";
import { CiLock } from "react-icons/ci";

export default function OtpInput({
  onVerify,
  t,
  registerError,
}: {
  onVerify: (otp: string) => void;
  t: (key: string) => string;
  registerError?: string | null;
}) {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex gap-8 flex-col items-center">
      <div className="flex items-center gap-2 bg-green-800 rounded-full p-2">
        <CiLock className="size-12" />
      </div>
      <div className="flex gap-2">
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={(el) => {
              inputs.current[i] = el;
            }}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e.target.value, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            className="w-12 h-12 text-center text-xl border rounded-lg focus:outline-none text-black border-gray-300"
          />
        ))}
      </div>
      {registerError && (
        <div className="text-red-500 text-sm text-center">{registerError}</div>
      )}

      <button
        className="px-6 py-2 rounded-xl bg-green-800 text-white font-semibold w-full disabled:opacity-70"
        onClick={() => onVerify(otp.join(""))}
        disabled={otp.join("").length < 6}
      >
        {t("verify")}
      </button>
    </div>
  );
}
