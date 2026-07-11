"use client";

import { apiClient } from "./apiClient";

export type UpsertOnboardingPayload = {
  invite_key: string;
  event_type: string;
  stage: string;
  data?: Record<string, any>;
};

export function upsertOnboarding(payload: UpsertOnboardingPayload) {
  return apiClient("/events/onboarding", {
    method: "POST",
    requireAuth: true,
    body: JSON.stringify(payload),
  });
}

export function saveEventSection(eventId: number, path: string, data: Record<string, any>, stage?: string) {
  return apiClient(`/events/${eventId}/section`, {
    method: "PATCH",
    requireAuth: true,
    body: JSON.stringify({
      path,
      data,
      stage,
    }),
  });
}

export function publishEvent(eventId: number) {
  return apiClient(`/events/${eventId}/publish`, {
    method: "POST",
    requireAuth: true,
  });
}
