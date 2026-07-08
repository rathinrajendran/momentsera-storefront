import type { SubmitWishPayload } from "../../hooks/useWishes";

/* ---------------- UPDATE WISH CONFIG ---------------- */

export async function updateWishes(eventId: number, wishes: Record<string, any>) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API}/events/${eventId}/wishes`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(wishes),
  });

  if (!res.ok) throw new Error("Failed to update wishes");
  return res.json();
}

/* ---------------- SUBMIT WISH ---------------- */

export async function submitWish(eventKey: string, payload: SubmitWishPayload) {
  // TEXT
  if (payload.wishesType === "text") {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/invites/${eventKey}/wishes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Failed to submit text wish");
    return res.json();
  }

  // AUDIO / VIDEO
  payload.formData.append("wishesFrom", payload.wishesFrom);
  payload.formData.append("phone", payload.phone);
  payload.formData.append("wishesType", payload.wishesType);

  const res = await fetch(`${process.env.NEXT_PUBLIC_API}/invites/${eventKey}/wishes/upload`, {
    method: "POST",
    body: payload.formData,
  });

  if (!res.ok) throw new Error("Failed to upload wish");
  return res.json();
}

/* ---------------- FETCH WISHES ---------------- */

export async function fetchWishes(eventKey: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API}/invites/${eventKey}/wishes`, { cache: "no-store" });

  if (!res.ok) throw new Error("Failed to fetch wishes");
  return res.json();
}

/* ---------------- FETCH MY WISHES ---------------- */

export async function fetchMyWishes(token: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API}/account/wishes`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch wishes");
  }

  return res.json();
}