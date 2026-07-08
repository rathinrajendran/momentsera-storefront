"use client";

import { useState } from "react";
import { Lock, X } from "lucide-react";
import { isValidPassword, sanitizePassword } from "../../../../../utils/password";

type Props = {
  open: boolean;
  title?: string;
  password: string;
  onClose: () => void;
  onSuccess: () => void;
};

export function PasswordDialog({ open, title, password, onClose, onSuccess }: Props) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const passwordValid = isValidPassword(value);

  if (!open) return null;

  const handleUnlock = () => {
    if (!passwordValid) {
      setError("Password must be 6 digits");
      return;
    }

    if (value === password) {
      setError("");
      setValue("");
      onSuccess();
      onClose();
      return;
    }

    setError("Incorrect password");
  };
  return (
    <div className="absolute inset-0 z-[9999] flex items-center justify-center bg-black/60 p-5 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock size={18} />
            <h3 className="text-lg font-semibold">Protected Content</h3>
          </div>
        </div>

        <p className="mb-4 text-sm text-black/60">
          Enter password to access <span className="font-medium">{title}</span>
        </p>

        <input
          type="password"
          value={value}
          maxLength={6}
          autoFocus
          inputMode="numeric"
          onChange={(e) => {
            setError("");

            setValue(sanitizePassword(e.target.value));
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleUnlock();
            }
          }}
          placeholder="Enter 6 digit password"
          className="w-full rounded-xl border px-4 py-3 outline-none"
        />

        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        {value.length > 0 && !passwordValid && <p className="mt-2 text-sm text-red-500">Password must contain exactly 6 digits</p>}
        <button
          onClick={handleUnlock}
          disabled={!passwordValid}
          className="mt-4 w-full rounded-xl bg-black py-3 text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          Unlock
        </button>
      </div>
    </div>
  );
}
