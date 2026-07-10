import { User } from "../../types/auth";
import { apiClient } from "./apiClient";

export const getProfile = () =>
  apiClient("/auth/me", {
    method: "GET",
    requireAuth: true,
  });

export const updateProfile = (patch: { name?: string; phone?: string }): Promise<User> =>
  apiClient("/user/me", {
    method: "PUT",
    body: JSON.stringify(patch),
  });

export const getMyEvents = (): Promise<Event[]> => apiClient("/user/me/events");
