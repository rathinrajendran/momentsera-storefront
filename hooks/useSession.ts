"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { User } from "../types/auth";
import { getCurrentUser } from "../auth/session";
import { getAccessToken, refreshSession } from "../lib/api/apiClient";

export function useSession() {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function initializeSession() {
      try {
        // Access token is memory-only, so after a full
        // browser reload it will normally be missing.
        //
        // Use the HttpOnly refresh cookie to obtain
        // a new access token.
        if (!getAccessToken()) {
          await refreshSession();
        }
      } catch {
        // No valid refresh session.
        // User is simply unauthenticated.
      } finally {
        if (mounted) {
          setInitialized(true);
        }
      }
    }

    void initializeSession();

    return () => {
      mounted = false;
    };
  }, []);

  const query = useQuery<User | null>({
    queryKey: ["session"],
    queryFn: getCurrentUser,

    // Don't call /me until the refresh attempt has
    // finished and an access token is available.
    enabled: initialized && !!getAccessToken(),

    staleTime: 1000 * 60 * 5,

    gcTime: 1000 * 60 * 30,

    retry: false,

    refetchOnWindowFocus: false,

    refetchOnReconnect: false,

    refetchOnMount: false,
  });

  return {
    user: query.data ?? null,

    isAuthenticated: initialized && !!query.data,

    loading: !initialized || query.isPending,

    fetching: query.isFetching,

    error: query.error,

    refresh: query.refetch,
  };
}
