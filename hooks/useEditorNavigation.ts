"use client";

import { useEffect, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export type EditorSection =
  | "overview"
  | "invite"
  | "announcement"
  | "schedule"
  | "gallery"
  | "wishes"
  | "theme"
  | "music"
  | "motion"
  | "sharing"
  | "privacy"
  | "print"
  | "settings"
  | "dressCode"
  | "timeline"
  | "rsvp";

export function useEditorNavigation(isDraft: boolean, onDelete: () => void) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get active section from URL (?section=banner) or default to overview
  const activeSection = (searchParams.get("section") as EditorSection) || "overview";

  const setSection = useCallback(
    (section: EditorSection) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("section", section);
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  const handleBack = useCallback(() => {
    setSection("overview");
  }, [setSection]);

  // Handle the Browser Back Button / Page Exit
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDraft) return; // Don't warn if it's just a draft
      e.preventDefault();
      e.returnValue = ""; // Triggers browser confirmation dialog
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDraft]);

  return { activeSection, setSection, handleBack };
}
