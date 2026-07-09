"use client";

const base = process.env.NEXT_PUBLIC_API!.replace(/\/$/, "");

/* ---------- COMMON FETCH ---------- */

async function apiFetch(url: string, options: RequestInit = {}) {
  const res = await fetch(`${base}${url}`, {
    credentials: "include",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Request failed");
  }

  return res.json();
}

/* ---------- CREATE / ONBOARDING ---------- */

export type UpsertOnboardingPayload = {
  invite_key: string;
  event_type: string;
  stage: string;
  data?: Record<string, any>;
};

export function upsertOnboarding(payload: UpsertOnboardingPayload) {
  return apiFetch("/events/onboarding", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/* ---------- SAVE SECTION ---------- */

export function saveEventSection(eventId: number, path: string, data: Record<string, any>, stage?: string) {
  return apiFetch(`/events/${eventId}/section`, {
    method: "PATCH",
    body: JSON.stringify({
      path,
      data,
      stage,
    }),
  });
}

/* ---------- PUBLISH ---------- */

export function publishEvent(eventId: number) {
  return apiFetch(`/events/${eventId}/publish`, {
    method: "POST",
  });
}
