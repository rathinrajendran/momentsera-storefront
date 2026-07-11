"use client";

import { useQuery } from "@tanstack/react-query";
import { User } from "../types/auth";
import { getCurrentUser } from "../auth/session";
import { getAccessToken } from "../lib/api/apiClient";

export function useSession() {
  const hasToken = !!getAccessToken();

  const query = useQuery<User | null>({
    queryKey: ["session"],
    queryFn: getCurrentUser,

    enabled: hasToken,

    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,

    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  return {
    user: query.data ?? null,
    isAuthenticated: !!query.data,
    loading: hasToken ? query.isPending : false,
    fetching: query.isFetching,
    error: query.error,
    refresh: query.refetch,
  };
}
