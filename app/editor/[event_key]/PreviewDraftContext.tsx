"use client";

import { createContext, useCallback, useContext, useState, useTransition } from "react";
import { fetchEventByKey } from "../../../lib/api";

/* ---------------- TYPES ---------------- */

export type Draft = {
  invite: any;
  template: any;
  announcement: any;
  schedule?: any;
  ourStory: any;
  timeline: any;
  gallery: any;
  dressCode: any;
  wishes?: any;
  rsvp: any;
  music: any;
  color: any;
  font: any;
  shape: any;
  motion: any;
  privacy?: any;
  sharing?: any;
  print: any;
  settings: any;
  frontendUrl?: string;
};

/**
 * Global editor save state.
 *
 * saved:
 *    Current draft is synchronized with server.
 *
 * unsaved:
 *    User changed something locally.
 *
 * saving:
 *    Current editor is saving to the server.
 *
 * validation:
 *    Current editor has validation issues.
 *
 * error:
 *    Save request failed.
 */
export type SaveStatus = "saved" | "unsaved" | "saving" | "validation" | "error";

/**
 * Generic validation issue.
 *
 * Each editor can generate its own issues:
 *
 * AnnouncementEditor
 * ScheduleEditor
 * MotionEditor
 * GalleryEditor
 * etc.
 */
export type ValidationIssue = {
  key: string;
  label: string;
};

type DraftSection = keyof Draft;

/* ---------------- CONTEXT TYPE ---------------- */

type DraftContextType = {
  /* Draft */
  draft: Draft;

  /* UI state */
  showFooterDialog: boolean;
  isRefreshing: boolean;

  setShowFooterDialog: React.Dispatch<React.SetStateAction<boolean>>;

  /* Draft operations */
  updateSection: <K extends DraftSection>(section: K, patch: Partial<Draft[K]>) => void;

  replaceSection: <K extends DraftSection>(section: K, value: Draft[K]) => void;

  resetDraft: () => void;

  refreshDraft: (data: Draft) => void;

  refreshEvent: (eventKey: string) => Promise<void>;

  /* Global save state */
  saveStatus: SaveStatus;

  setSaveStatus: React.Dispatch<React.SetStateAction<SaveStatus>>;

  /* Validation */
  issueCount: number;

  setIssueCount: React.Dispatch<React.SetStateAction<number>>;

  validationIssues: ValidationIssue[];

  setValidationIssues: React.Dispatch<React.SetStateAction<ValidationIssue[]>>;
};

/* ---------------- CONTEXT ---------------- */

const DraftContext = createContext<DraftContextType | null>(null);

/* ---------------- PROVIDER ---------------- */

export function PreviewDraftProvider({ initialData, children }: { initialData: Draft; children: React.ReactNode }) {
  /*
   * Keep the existing frontend URL behavior.
   *
   * NEXT_PUBLIC_ is available to the client.
   */
  const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL ?? window.location.origin;

  /* ---------------- DRAFT STATE ---------------- */

  const [draft, setDraft] = useState<Draft>({
    ...initialData,
    frontendUrl,
  });

  /*
   * Last server-synchronized version.
   *
   * Used by resetDraft().
   */
  const [serverData, setServerData] = useState<Draft>({
    ...initialData,
    frontendUrl,
  });

  /* ---------------- UI STATE ---------------- */

  const [showFooterDialog, setShowFooterDialog] = useState(false);

  const [isRefreshing, startRefreshTransition] = useTransition();

  /* ---------------- SAVE STATE ---------------- */

  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");

  /* ---------------- VALIDATION STATE ---------------- */

  const [issueCount, setIssueCount] = useState(0);

  const [validationIssues, setValidationIssues] = useState<ValidationIssue[]>([]);

  /* ---------------- UPDATE SECTION ---------------- */

  const updateSection = useCallback(<K extends DraftSection>(section: K, patch: Partial<Draft[K]>) => {
    setDraft((prev) => {
      const currentSection = prev[section];

      const nextSection = Array.isArray(patch)
        ? patch
        : {
            ...(typeof currentSection === "object" && currentSection !== null ? currentSection : {}),
            ...patch,
          };

      return {
        ...prev,
        [section]: nextSection,
      };
    });

    /*
     * Any editor changing its draft automatically
     * marks the editor as unsaved.
     *
     * This means all editors get the same behavior:
     *
     * AnnouncementEditor
     * ScheduleEditor
     * MotionEditor
     * GalleryEditor
     * RSVP
     * Color
     * Font
     * etc.
     */
    setSaveStatus("unsaved");

    /*
     * The previous validation result is no longer
     * guaranteed to represent the current data.
     *
     * Validation will happen again when Next is clicked.
     */
    setIssueCount(0);
    setValidationIssues([]);
  }, []);

  /* ---------------- REPLACE SECTION ---------------- */

  const replaceSection = useCallback(<K extends DraftSection>(section: K, value: Draft[K]) => {
    setDraft((prev) => ({
      ...prev,
      [section]: value,
    }));

    setSaveStatus("unsaved");

    setIssueCount(0);
    setValidationIssues([]);
  }, []);

  /* ---------------- RESET DRAFT ---------------- */

  const resetDraft = useCallback(() => {
    setDraft(serverData);

    setSaveStatus("saved");

    setIssueCount(0);
    setValidationIssues([]);
  }, [serverData]);

  /* ---------------- REFRESH DRAFT ---------------- */

  const refreshDraft = useCallback(
    (data: Draft) => {
      const nextData: Draft = {
        ...data,
        frontendUrl,
      };

      /*
       * Both local and server copies now point
       * to the newly refreshed version.
       */
      setServerData(nextData);
      setDraft(nextData);

      setSaveStatus("saved");

      setIssueCount(0);
      setValidationIssues([]);
    },
    [frontendUrl],
  );

  /* ---------------- REFRESH EVENT ---------------- */

  const refreshEvent = useCallback(
    async (eventKey: string) => {
      try {
        const freshEvent = await fetchEventByKey(eventKey);

        if (!freshEvent) {
          return;
        }

        const nextData: Draft = {
          ...freshEvent,
          frontendUrl,
        };

        /*
         * Update React state inside a transition so
         * refreshing a large editor does not block UI.
         */
        startRefreshTransition(() => {
          setServerData(nextData);
          setDraft(nextData);
        });

        /*
         * The fetched event represents the latest
         * server state.
         */
        setSaveStatus("saved");

        setIssueCount(0);
        setValidationIssues([]);
      } catch (error) {
        console.error("Failed to refresh event draft:", error);

        /*
         * Do not automatically mark this as a save
         * error. Refresh failure and save failure are
         * different operations.
         *
         * Let the caller decide how to handle it.
         */
        throw error;
      }
    },
    [frontendUrl],
  );

  /* ---------------- PROVIDER ---------------- */

  return (
    <DraftContext.Provider
      value={{
        /* Draft */
        draft,

        /* UI */
        showFooterDialog,
        isRefreshing,
        setShowFooterDialog,

        /* Draft operations */
        updateSection,
        replaceSection,
        resetDraft,
        refreshDraft,
        refreshEvent,

        /* Save state */
        saveStatus,
        setSaveStatus,

        /* Validation */
        issueCount,
        setIssueCount,
        validationIssues,
        setValidationIssues,
      }}
    >
      {children}
    </DraftContext.Provider>
  );
}

/* ---------------- HOOK ---------------- */

export function usePreviewDraft() {
  const context = useContext(DraftContext);

  if (!context) {
    throw new Error("usePreviewDraft must be used inside PreviewDraftProvider");
  }

  return context;
}
