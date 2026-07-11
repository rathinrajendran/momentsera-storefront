"use client";

import { createContext, useContext, useState, useTransition, startTransition, useCallback } from "react";
import { fetchEventByKey } from "../../../lib/api";

/* ---------------- TYPES ---------------- */
type Draft = {
  invite: any;
  settings: any;
  theme: any;
  music: any;
  dressCode: any;
  timeline: any;
  rsvp: any;
  print: any;
  announcement: any;
  gallery: any;
  motion: any;
  schedule?: any;
  privacy?: any;
  sharing?: any;
  wishes?: any;
  frontendUrl?: string;
};

type DraftSection = keyof Draft;

type DraftContextType = {
  draft: Draft;
  showFooterDialog: boolean;
  isRefreshing: boolean;
  setShowFooterDialog: React.Dispatch<React.SetStateAction<boolean>>;
  updateSection: <K extends DraftSection>(section: K, patch: Partial<Draft[K]>) => void;
  replaceSection: <K extends DraftSection>(section: K, value: Draft[K]) => void;
  resetDraft: () => void;
  refreshDraft: (data: Draft) => void;
  refreshEvent: (eventKey: string) => Promise<void>;
};

const DraftContext = createContext<DraftContextType | null>(null);

/* ---------------- PROVIDER ---------------- */
export function PreviewDraftProvider({ initialData, children }: { initialData: Draft; children: React.ReactNode }) {
  const frontendUrl = process.env.FRONTEND_URL ?? window.location.origin;

  const [draft, setDraft] = useState<Draft>({
    ...initialData,
    frontendUrl,
  });

  const [serverData, setServerData] = useState<Draft>({
    ...initialData,
    frontendUrl,
  });

  const [showFooterDialog, setShowFooterDialog] = useState(false);
  const [isRefreshing, startRefreshTransition] = useTransition();

  /* ---------------- UPDATE (PATCH) ---------------- */
  const updateSection = useCallback(<K extends DraftSection>(section: K, patch: Partial<Draft[K]>) => {
    setDraft((prev) => {
      const currentSection = prev[section];
      const nextSection = Array.isArray(patch)
        ? patch
        : { ...(typeof currentSection === "object" && currentSection ? currentSection : {}), ...patch };

      return { ...prev, [section]: nextSection };
    });
  }, []);

  /* ---------------- REPLACE ---------------- */
  const replaceSection = useCallback(<K extends DraftSection>(section: K, value: Draft[K]) => {
    setDraft((prev) => ({ ...prev, [section]: value }));
  }, []);

  /* ---------------- RESET / REFRESH ---------------- */
  const resetDraft = useCallback(() => setDraft(serverData), [serverData]);

const refreshDraft = useCallback(
  (data: Draft) => {
    setServerData({
      ...data,
      frontendUrl,
    });

    setDraft({
      ...data,
      frontendUrl,
    });
  },
  [frontendUrl],
);

  const refreshEvent = useCallback(async (eventKey: string) => {
    startRefreshTransition(async () => {
      try {
        // Cache bust query parameter ensures network request bypasses aggressive router/browser caches
        const freshEvent = await fetchEventByKey(`${eventKey}?timestamp=${Date.now()}`);
        if (freshEvent) {
         setServerData({
           ...freshEvent,
           frontendUrl,
         });

         setDraft({
           ...freshEvent,
           frontendUrl,
         });
        }
      } catch (error) {
        console.error("Failed to refresh event draft:", error);
      }
    });
  }, []);

  return (
    <DraftContext.Provider
      value={{
        draft,
        showFooterDialog,
        isRefreshing,
        setShowFooterDialog,
        updateSection,
        replaceSection,
        resetDraft,
        refreshDraft,
        refreshEvent,
      }}
    >
      {children}
    </DraftContext.Provider>
  );
}

export function usePreviewDraft() {
  const ctx = useContext(DraftContext);
  if (!ctx) throw new Error("usePreviewDraft must be used inside PreviewDraftProvider");
  return ctx;
}
