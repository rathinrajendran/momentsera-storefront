import { getProfile } from "../lib/api/user.api";
import { getAccessToken } from "../lib/api/apiClient";

export async function getCurrentUser() {
  if (!getAccessToken()) {
    return null;
  }

  try {
    return await getProfile();
  } catch {
    return null;
  }
}

export async function isLoggedIn() {
  return (await getCurrentUser()) !== null;
}
