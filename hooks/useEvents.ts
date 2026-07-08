import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  upsertOnboarding,
  saveEventSection,
  publishEvent,
  deleteEvent,
  checkEventKeyAvailability,
  updateEventKey,
} from "../lib/api";

export function useUpsertOnboarding() {
  return useMutation({
    mutationFn: upsertOnboarding,
  });
}

export function useSaveEventSection(eventKey: string, eventId: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      path,
      data,
      stage,
    }: {
      path: string;
      data: Record<string, any>;
      stage?: string;
    }) => saveEventSection(eventId, path, data, stage),

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["event", eventKey],
      });
    },
  });
}

export function usePublishEvent(eventKey: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (eventId: number) => publishEvent(eventId),

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["event", eventKey],
      });
    },
  });
}

export function useDeleteEvent() {
  return useMutation({
    mutationFn: (eventId: number) => deleteEvent(eventId),
  });
}

export function useCheckEventKey(eventKey: string) {
  return useQuery({
    queryKey: ["event-key", eventKey],
    queryFn: () => checkEventKeyAvailability(eventKey),
    enabled: eventKey.trim().length > 2,
    retry: false,
    staleTime: 0,
    gcTime: 0,
  });
}

export function useUpdateEventKey(eventId: number, currentEventKey: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (eventKey: string) => updateEventKey(eventId, eventKey),

    onSuccess: (_, newEventKey) => {
      qc.invalidateQueries({
        queryKey: ["event", currentEventKey],
      });

      qc.invalidateQueries({
        queryKey: ["event-key", newEventKey],
      });
    },
  });
}
