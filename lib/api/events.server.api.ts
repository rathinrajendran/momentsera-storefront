// events.server.api.ts

import { getAccessToken } from "./apiClient";

export async function fetchEventByKey(eventKey: string) {
  if (!eventKey) return null;

  const base = process.env.NEXT_PUBLIC_API;

  if (!base) {
    throw new Error("NEXT_PUBLIC_API is missing. Check your .env.local file.");
  }

  const res = await fetch(`${base.replace(/\/$/, "")}/events/key/${encodeURIComponent(eventKey)}`, {
    cache: "no-store",
  });

  if (!res.ok) return null;

  return res.json();
}

// events.server.api.ts

export async function deleteEvent(eventId: number) {
  if (!eventId) {
    return null;
  }

  const base = process.env.NEXT_PUBLIC_API!.replace(/\/$/, "");
  const token = getAccessToken();

  const res = await fetch(`${base}/events/${eventId}`, {
    method: "DELETE",
    credentials: "include",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message ?? "Failed to delete event");
  }

  return res.json();
}

export async function checkEventKeyAvailability(eventKey: string) {
  const base = process.env.NEXT_PUBLIC_API?.replace(/\/$/, "");
  const url = `${base}/events/check-event-key/${eventKey}`;
  const res = await fetch(url, {
    cache: "no-store",
  });
  return res.json();
}
