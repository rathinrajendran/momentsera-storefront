import { getProfile } from "../lib/api/user.api";

export async function getCurrentUser() {
  try {
    return await getProfile();
  } catch {
    return null;
  }
}

export async function isLoggedIn() {
  return (await getCurrentUser()) !== null;
}
