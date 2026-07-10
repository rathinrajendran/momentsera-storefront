"use client";

import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../lib/api/auth.api";

export function useAuth() {
  const {
    data: user,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["auth-user"],
    queryFn: getCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  return {
    user: user ?? null,
    loading: isLoading,
    isLoggedIn: !!user,
    refreshUser: refetch,
  };
}