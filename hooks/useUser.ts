import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchMyProfile,
  updateMyProfile,
  fetchMyEvents,
} from "../lib/api/user.api";

/* ---------------------------------
   GET MY PROFILE
---------------------------------- */
export const useMyProfile = (token: string) =>
  useQuery({
    queryKey: ["me"],
    queryFn: () => fetchMyProfile(token),
    enabled: !!token,
    staleTime: Infinity,
  });

/* ---------------------------------
   UPDATE MY PROFILE
---------------------------------- */
export function useUpdateMyProfile(token: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (patch: { full_name?: string; phone?: string }) =>
      updateMyProfile(token, patch),

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["me"] });
    },
  });
}

/* ---------------------------------
   GET MY EVENTS
---------------------------------- */
export const useMyEvents = (token: string) =>
  useQuery({
    queryKey: ["me-events"],
    queryFn: () => fetchMyEvents(token),
    enabled: !!token,
    staleTime: 0,
  });