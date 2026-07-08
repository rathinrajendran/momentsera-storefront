// useUrlSuggestions.ts

"use client";

import { useMemo } from "react";

export function useUrlSuggestions(firstName?: string, secondName?: string, year?: number) {
  return useMemo(() => {
    const first = firstName?.trim().toLowerCase().replace(/\s+/g, "-");
    const second = secondName?.trim().toLowerCase().replace(/\s+/g, "-");

    return [
      `${first}-and-${second}`,
      `${first}-with-${second}`,
      `${first}-${second}`,
      `${first}-${second}-wedding`,
      `${first}-${second}-forever`,
      `${first}-weds-${second}`,
      `celebrating-${first}-${second}`,
      `${first}-${second}-${year}`,
    ].filter(Boolean);
  }, [firstName, secondName, year]);
}
