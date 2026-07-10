import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMyEvents, getProfile, updateProfile } from "../lib/api/user.api";

/* ---------------------------------
   GET MY PROFILE
---------------------------------- */

export function useMyProfile() {
  return useQuery({
    queryKey: ["me"],
    queryFn: getProfile,
    staleTime: 1000 * 60 * 5,
  });
}

/* ---------------------------------
   UPDATE MY PROFILE
---------------------------------- */

export function useUpdateMyProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["me"],
      });

      queryClient.invalidateQueries({
        queryKey: ["session"],
      });
    },
  });
}

/* ---------------------------------
   GET MY EVENTS
---------------------------------- */

export function useMyEvents() {
  return useQuery({
    queryKey: ["me-events"],
    queryFn: getMyEvents,
    staleTime: 1000 * 60,
  });
}
