"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import Catalog from "../../[event_key]/invites/catalog/page";

interface PreviewClientProps {
  initialData: any;
  eventKey: string;
}

export default function PreviewClient({ initialData, eventKey }: PreviewClientProps) {
  const [data, setData] = useState(initialData);
  const previousDataRef = useRef(initialData);

  // 1. Hard refresh state alignment
  useEffect(() => {
    setData(initialData);
    previousDataRef.current = initialData;

    // Signal to parent window that this iframe instance is mounted and ready for synchronization
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: "IFRAME_READY" }, window.location.origin);
    }
  }, [initialData]);

  // 2. Incoming message processing
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      const { type, payload } = event.data || {};
      if (type !== "UPDATE_DRAFT" || !payload) return;

      // Micro-optimization: Fast structural comparison check to prevent layout thrashing
      if (JSON.stringify(previousDataRef.current) === JSON.stringify(payload)) {
        return;
      }

      previousDataRef.current = payload;
      setData(payload);
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const catalogProps = useMemo(() => {
    if (!data) return null;
    return {
      data: {
        invite: data.invite,
        announcement: data.announcement,
        schedule: data.schedule,
        gallery: data.gallery,
        wishes: data.wishes,
        dressCode: data.dressCode,
        timeline: data.timeline,
        rsvp: data.rsvp,
      },
      theme: data.theme,
      music: data.music,
      motion: data.motion,
      sharing: data.sharing,
      privacy: data.privacy,
      print: data.print,
      settings: data.settings,
    };
  }, [data]);

  if (!catalogProps) return null;

  return <Catalog {...catalogProps} eventKey={eventKey} isLive={true} />;
}
