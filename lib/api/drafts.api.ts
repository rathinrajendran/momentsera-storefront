const BASE = process.env.NEXT_PUBLIC_API!;

function authHeaders() {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Not authenticated");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

/* ---------- CREATE ---------- */
export async function createDraft(payload: {
  type: string;
  invite_key: string;
  data: any;
}) {
  const res = await fetch(`${BASE}/drafts`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to create draft");
  return res.json(); // { draft_id }
}

/* ---------- UPDATE ---------- */
export async function updateDraft(
  draftId: number,
  payload: { invite_key?: string; data?: any }
) {
  const res = await fetch(`${BASE}/drafts/${draftId}`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to update draft");
  return res.json();
}

/* ---------- LIST ---------- */
export async function fetchDrafts() {
  const res = await fetch(`${BASE}/drafts`, {
    headers: authHeaders(),
  });

  if (!res.ok) throw new Error("Failed to fetch drafts");
  return res.json();
}

/* ---------- GET BY ID ---------- */
export async function fetchDraftById(draftId: number) {
  const res = await fetch(`${BASE}/drafts/${draftId}`, {
    headers: authHeaders(),
  });

  if (!res.ok) throw new Error("Draft not found");
  return res.json();
}

/* ---------- CONVERT ---------- */
export async function convertDraftToEvent(draftId: number) {
  const res = await fetch(`${BASE}/drafts/convert/${draftId}`, {
    method: "POST",
    headers: authHeaders(),
  });

  if (!res.ok) throw new Error("Failed to convert draft");
  return res.json(); // { event_key }
}
