"use client";

import { RefObject, useEffect, useCallback } from "react";

type UseIframeDraftSyncProps = {
  iframeRef: RefObject<HTMLIFrameElement | null>;
  enabled: boolean;
  draft: unknown;
};

export function useIframeDraftSync({ iframeRef, enabled, draft }: UseIframeDraftSyncProps) {
  // Highly optimized postMessage dispatcher
  const syncDraft = useCallback(() => {
    if (!enabled || !draft || !iframeRef.current?.contentWindow) {
      return;
    }

    try {
      iframeRef.current.contentWindow.postMessage(
        {
          type: "UPDATE_DRAFT",
          payload: JSON.parse(JSON.stringify(draft)), // Deep clone ensures structured clone algorithm doesn't drop proxy-wrapped states
        },
        window.location.origin,
      );
    } catch (error) {
      console.error("[IframeSync] Core postMessage transmission failed:", error);
    }
  }, [enabled, draft, iframeRef]);

  // Effect 1: Sync whenever the parent state updates
  useEffect(() => {
    syncDraft();
  }, [syncDraft]);

  // Effect 2: Bi-directional Handshake
  // If the iframe refreshes or hard-loads, it signals it's ready. We push immediately.
  useEffect(() => {
    if (!enabled) return;

    const handleHandshake = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data?.type === "IFRAME_READY") {
        syncDraft();
      }
    };

    window.addEventListener("message", handleHandshake);
    return () => window.removeEventListener("message", handleHandshake);
  }, [enabled, syncDraft]);
}
