import React from "react";

interface PasswordStrengthProps {
  password?: string;
}

export default function PasswordStrength({ password = "" }: PasswordStrengthProps) {
  const calculateStrength = (pass: string) => {
    let score = 0;
    if (!pass) return 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const score = calculateStrength(password);
  const strengthLabels = ["Too Short", "Weak", "Fair", "Good", "Strong"];
  const strengthColors = ["bg-gray-200", "bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500"];

  if (!password) return null;

  return (
    <div className="mt-2 w-full">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-xs font-medium text-gray-600">Password Strength:</span>
        <span className="text-xs font-semibold text-gray-700">{strengthLabels[score]}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
        <div className={`h-full transition-all duration-300 ${strengthColors[score]}`} style={{ width: `${(score / 4) * 100}%` }} />
      </div>
    </div>
  );
}
