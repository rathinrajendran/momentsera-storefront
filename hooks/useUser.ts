import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMyEvents, getProfile, updateProfile } from "../lib/api/user.api";
import { QUERY_KEYS } from "../lib/queryKeys";

/* ---------------------------------
   GET MY PROFILE
---------------------------------- */

export function useMyProfile() {
  return useQuery({
    queryKey: QUERY_KEYS.me,
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

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.me,
      });

      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.session,
      });
    },
  });
}

/* ---------------------------------
   GET MY EVENTS
---------------------------------- */

export function useMyEvents() {
  return useQuery({
    queryKey: QUERY_KEYS.myEvents,
    queryFn: getMyEvents,
    staleTime: 1000 * 60,
  });
}
