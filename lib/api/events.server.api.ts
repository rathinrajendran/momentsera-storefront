// events.server.api.ts

export async function fetchEventByKey(eventKey: string) {
  if (!eventKey) return null;

  const base = process.env.NEXT_PUBLIC_API?.replace(/\/$/, "");
  const res = await fetch(`${base}/events/key/${eventKey}`, {
    cache: "no-store",
  });

  if (!res.ok) return null;

  return res.json();
}

// events.server.api.ts

export async function deleteEvent(eventId: number) {
  if (!eventId) return null;

  const base = process.env.NEXT_PUBLIC_API?.replace(/\/$/, "");
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const res = await fetch(`${base}/events/${eventId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.error ?? "Failed to delete event");
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