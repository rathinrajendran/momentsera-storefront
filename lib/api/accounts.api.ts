import API from "./config";

export const fetchAccounts = async () => {
  const res = await fetch(`${API}/accounts`);
  if (!res.ok) throw new Error("Failed to load accounts");
  return res.json();
};

export const createAccount = async (payload: any) => {
  const res = await fetch(`${API}/accounts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to create account");
  return res.json();
};

export const updateAccount = async (id: number, patch: any) => {
  const res = await fetch(`${API}/accounts/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });

  if (!res.ok) throw new Error("Failed to update account");
  return res.json();
};

export const deleteAccount = async (id: number) => {
  const res = await fetch(`${API}/accounts/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Failed to delete account");
  return res.json();
};

export async function checkAccountExists(params: {
  email?: string;
  phone?: string;
}) {
  const qs = new URLSearchParams(params as any).toString();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API}/accounts/check?${qs}`
  );

  if (!res.ok) {
    throw new Error("Check failed");
  }

  return res.json() as Promise<{ exists: boolean }>;
}
