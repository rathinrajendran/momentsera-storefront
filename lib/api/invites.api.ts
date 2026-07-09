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

export async function updateEventKey(eventId: number, eventKey: string) {
  const base = process.env.NEXT_PUBLIC_API?.replace(/\/$/, "");

  const res = await fetch(`${base}/events/${eventId}/event-key`, {
    method: "PATCH",
    credentials: "include", // ✅ Send HttpOnly cookie
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      event_key: eventKey,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);

    throw new Error(err?.message ?? err?.error ?? "Failed to update event key");
  }

  return res.json();
}
