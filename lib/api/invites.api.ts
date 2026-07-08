import API from "./config";

 
/* ---------------------------
   FETCH ALL INVITES
---------------------------- */
export async function fetchInvites() {
  console.log("API URL:", `${API}/invites`);

  const res = await fetch(`${API}/invites`, {
    cache: "no-store",
  });

  console.log("Status:", res.status);

  const data = await res.json();

  console.log("Response:", data);

  return data;
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

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const res = await fetch(`${base}/events/${eventId}/event-key`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
    },
    body: JSON.stringify({
      event_key: eventKey,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);

    throw new Error(err?.error ?? "Failed to update event key");
  }

  return res.json();
}
