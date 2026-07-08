"use client";

const base = process.env.NEXT_PUBLIC_API!.replace(/\/$/, "");

/* ---------- CREATE / ONBOARDING ---------- */
export type UpsertOnboardingPayload = {
  invite_key: string;
  event_type: string;
  stage: string; // UI progress marker only
  data?: Record<string, any>; // 👈 generic seed data
};

export async function upsertOnboarding(
  payload: UpsertOnboardingPayload
) {
  const res = await fetch(`${base}/events/onboarding`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Onboarding failed");

  return res.json();
}

/* ---------- SAVE SECTION (UNIVERSAL) ---------- */

export async function saveEventSection(
  eventId: number,
  path: string,
  data: Record<string, any>,
  stage?: string
) {
  const res = await fetch(
    `${base}/events/${eventId}/section`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ path, data, stage }),
    }
  );

  if (!res.ok) throw new Error("Save failed");

  return res.json();
}


/* ---------- PUBLISH ---------- */
export async function publishEvent(eventId: number) {
  const res = await fetch(
    `${base}/events/${eventId}/publish`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  if (!res.ok) throw new Error("Publish failed");

  return res.json();
}
