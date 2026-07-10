"use client";

import { useQuery } from "@tanstack/react-query";
import { User } from "../types/auth";
import { getCurrentUser } from "../auth/session";

export function useSession() {
  const query = useQuery<User | null>({
    queryKey: ["session"],
    queryFn: getCurrentUser,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: false,
  });

  return {
    user: query.data ?? null,
    isAuthenticated: !!query.data,
    loading: query.isPending,
    fetching: query.isFetching,
    error: query.error,
    refresh: query.refetch,
  };
}
