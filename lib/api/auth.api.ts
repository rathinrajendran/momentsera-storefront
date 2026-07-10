import { apiClient } from "../../utils/apiClient";

export async function login(payload: { email: string; password: string }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Login failed");
  return res.json();
}

export async function getCurrentUser() {
  const data = await apiClient("/auth/me");
  return data.user;
}