import type { SubmitWishPayload } from "../../hooks/useWishes";

/* ---------------- UPDATE WISH CONFIG ---------------- */

import { apiClient } from "./apiClient";

export function updateWishes(eventId: number, wishes: Record<string, any>) {
  return apiClient(`/events/${eventId}/wishes`, {
    method: "PATCH",
    requireAuth: true,
    body: JSON.stringify(wishes),
  });
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

export function fetchMyWishes() {
  return apiClient("/account/wishes", {
    requireAuth: true,
  });
}