"use client";

import { useEffect, useRef, useState } from "react";
import { Lock, X } from "lucide-react";
import { isValidPassword, sanitizePassword } from "../../../../../utils/password";

type Props = {
  open: boolean;
  title?: string;
  password: string;
  onClose: () => void;
  onSuccess: () => void;
};

const PASSWORD_LENGTH = 4;

export function PasswordDialog({ open, title, password, onClose, onSuccess }: Props) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  const passwordValid = isValidPassword(value, PASSWORD_LENGTH);

  /*
   * Effect is only used for DOM synchronization:
   * focus the input when the dialog becomes visible.
   */
  useEffect(() => {
    if (!open) return;

    const frame = requestAnimationFrame(() => {
      inputRef.current?.focus();
    });

    return () => cancelAnimationFrame(frame);
  }, [open]);

  if (!open) return null;

  const handleChange = (inputValue: string) => {
    const sanitizedValue = sanitizePassword(inputValue, PASSWORD_LENGTH);

    setValue(sanitizedValue);
    setError("");

    // Automatically validate after 4 digits.
    if (sanitizedValue.length === PASSWORD_LENGTH) {
      if (sanitizedValue === password) {
        setValue("");
        setError("");

        onSuccess();
        onClose();

        return;
      }

      setError("Incorrect password");

      setTimeout(() => {
        setValue("");
        inputRef.current?.focus();
      }, 500);
    }
  };

  const handleUnlock = () => {
    if (!passwordValid) {
      setError("Password must contain exactly 4 digits");
      return;
    }

    if (value === password) {
      setValue("");
      setError("");

      onSuccess();
      onClose();

      return;
    }

    setError("Incorrect password");
    setValue("");

    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

  const handleClose = () => {
    setValue("");
    setError("");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="password-dialog-title"
    >
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        {/* Close */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full text-black/50 transition hover:bg-black/5 hover:text-black"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Lock icon */}
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-black/5">
          <Lock className="h-5 w-5 text-black/70" />
        </div>

        {/* Title */}
        <h2 id="password-dialog-title" className="text-center text-lg font-semibold text-black">
          Protected Content
        </h2>

        {/* Description */}
        <p className="mt-2 mb-5 text-center text-sm text-black/60">
          Enter password to access <span className="font-medium text-black/80">{title || "this section"}</span>
        </p>

        {/* Password input */}
        <input
          ref={inputRef}
          type="password"
          value={value}
          maxLength={PASSWORD_LENGTH}
          inputMode="numeric"
          autoComplete="one-time-code"
          onChange={(e) => {
            handleChange(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleUnlock();
            }

            if (e.key === "Escape") {
              handleClose();
            }
          }}
          placeholder="Enter 4 digit password"
          className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-center text-lg tracking-[0.4em] transition outline-none focus:border-black/30 focus:ring-2 focus:ring-black/5"
        />

        {/* PIN progress */}
        <div className="mt-3 flex justify-center gap-2">
          {Array.from({
            length: PASSWORD_LENGTH,
          }).map((_, index) => (
            <span
              key={index}
              className={["h-1.5 w-1.5 rounded-full transition-all", index < value.length ? "scale-110 bg-black" : "bg-black/15"].join(" ")}
            />
          ))}
        </div>

        {/* Error */}
        {error && <p className="mt-3 text-center text-sm text-red-500">{error}</p>}

        {/* Hint */}
        {!error && value.length > 0 && !passwordValid && <p className="mt-3 text-center text-xs text-black/50">Enter 4 digits to unlock</p>}
      </div>
    </div>
  );
}
