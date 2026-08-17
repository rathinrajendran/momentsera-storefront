"use client";

import { RefObject, useCallback, useEffect } from "react";

type UseIframeDraftSyncProps = {
  iframeRef: RefObject<HTMLIFrameElement | null>;
  enabled: boolean;
  draft: unknown;
};

export function useIframeDraftSync({ iframeRef, enabled, draft }: UseIframeDraftSyncProps) {
  const syncDraft = useCallback(() => {
    if (!enabled || !draft) return;

    const iframe = iframeRef.current;

    if (!iframe?.contentWindow) return;

    try {
      iframe.contentWindow.postMessage(
        {
          type: "UPDATE_DRAFT",
          payload: structuredClone(draft),
        },
        window.location.origin,
      );
    } catch (error) {
      console.error("[IframeSync] Failed to sync draft:", error);
    }
  }, [enabled, draft, iframeRef]);

  // Sync whenever the draft changes.
  useEffect(() => {
    syncDraft();
  }, [syncDraft]);

  // Re-sync when the iframe is ready/reloaded.
  useEffect(() => {
    if (!enabled) return;

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data?.type === "IFRAME_READY") {
        syncDraft();
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [enabled, syncDraft]);
}
