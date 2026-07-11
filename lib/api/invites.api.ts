import { apiClient } from "./apiClient";

const API = process.env.NEXT_PUBLIC_API;

/* ---------------------------
   FETCH ALL INVITES
---------------------------- */
export async function fetchInvites() {
  const res = await fetch(`${API}/invites`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) throw new Error("Failed to fetch invites");
  return res.json();
}

/* ---------------------------
   FETCH INVITES BY CATEGORY
---------------------------- */
export async function fetchInvitesByCategory(eventType: string) {
  const res = await fetch(`${API}/invites/category/${eventType}`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch invites by category");
  return res.json();
}

/* ---------------------------
   FETCH INVITE BY KEY
---------------------------- */
export async function fetchInviteByKey(inviteKey: string) {
  const res = await fetch(`${API}/invites/${inviteKey}`, {
    cache: "no-store",
  });

  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to fetch invite");

  return res.json();
}

export function updateEventKey(eventId: number, eventKey: string) {
  return apiClient(`/events/${eventId}/event-key`, {
    method: "PATCH",
    requireAuth: true,
    body: JSON.stringify({
      event_key: eventKey,
    }),
  });
}