"use client";

import { useState } from "react";

export function useUnlockedSections(eventKey: string) {
  const storageKey = `invite-${eventKey}-access`;

  const [unlockedSections, setUnlockedSections] = useState<string[]>(() => {
    try {
      if (typeof window === "undefined") return [];

      const stored = sessionStorage.getItem(storageKey);

      if (!stored) return [];

      const parsed = JSON.parse(stored);

      return Array.isArray(parsed.sections) ? parsed.sections : [];
    } catch (error) {
      console.error("Failed to load unlocked sections", error);
      return [];
    }
  });

  const updateUnlockedSections = (
    value: string[] | ((prev: string[]) => string[]),
  ) => {
    setUnlockedSections((prev) => {
      const next = typeof value === "function" ? value(prev) : value;

      sessionStorage.setItem(
        storageKey,
        JSON.stringify({
          sections: next,
        }),
      );

      return next;
    });
  };

  return {
    unlockedSections,
    setUnlockedSections: updateUnlockedSections,
  };
}
