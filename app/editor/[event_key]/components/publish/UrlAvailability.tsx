"use client";

import { Check, Loader2, X } from "lucide-react";

type Props = {
  available?: boolean;
  isLoading: boolean;
};

export function UrlAvailability({ available, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="absolute bottom-0 flex items-center gap-2 text-sm">
        <Loader2 size={14} className="animate-spin" />
        <span>Checking availability...</span>
      </div>
    );
  }

  if (available === true) {
    return (
      <div className="absolute bottom-0 flex items-center gap-2 text-sm">
        <Check size={14} className="text-green-600" />
        <span className="text-green-600">This URL is available.</span>
      </div>
    );
  }

  if (available === false) {
    return (
      <div className="absolute bottom-0 flex items-center gap-2 text-sm">
        <X size={14} className="text-red-600" />
        <span className="text-red-600">This URL is already in use.</span>
      </div>
    );
  }

  return null;
}
