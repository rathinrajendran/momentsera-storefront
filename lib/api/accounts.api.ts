import { apiClient } from "./apiClient";
import API from "./config";

export const fetchAccounts = () =>
  apiClient("/accounts", {
    requireAuth: true,
  });

export const createAccount = (payload: any) =>
  apiClient("/accounts", {
    method: "POST",
    requireAuth: true,
    body: JSON.stringify(payload),
  });

export const updateAccount = (id: number, patch: any) =>
  apiClient(`/accounts/${id}`, {
    method: "PUT",
    requireAuth: true,
    body: JSON.stringify(patch),
  });

export const deleteAccount = (id: number) =>
  apiClient(`/accounts/${id}`, {
    method: "DELETE",
    requireAuth: true,
  });

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
