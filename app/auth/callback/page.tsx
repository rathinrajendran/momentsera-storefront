"use client";

import { Suspense, useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { setAccessToken } from "../../../lib/api/apiClient";
import { QUERY_KEYS } from "../../../lib/queryKeys";
import { getCurrentUser } from "../../../auth/session";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const processed = useRef(false);

  useEffect(() => {
    if (processed.current) return;

    processed.current = true;

    async function handleCallback() {
      const token = searchParams.get("token");
      const error = searchParams.get("error");

      if (error) {
        router.replace(`/account/login?error=${encodeURIComponent(error)}`);
        return;
      }

      if (!token) {
        router.replace("/account/login");
        return;
      }

      // Save access token in memory
      setAccessToken(token);

      // Force authenticated session refresh
      await queryClient.fetchQuery({
        queryKey: QUERY_KEYS.session,
        queryFn: getCurrentUser,
      });

      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.me,
      });

      const pending = sessionStorage.getItem("pending_event");

      if (pending) {
        try {
          const invite = JSON.parse(pending) as {
            invite_key: string;
            event_type: string;
            created_at: number;
          };

          sessionStorage.removeItem("pending_event");

          const expired = Date.now() - invite.created_at > 30 * 60 * 1000;

          if (!expired && invite.invite_key && invite.event_type) {
            router.replace(`/invites/${invite.event_type}/${invite.invite_key}/onboarding`);
            return;
          }
        } catch {
          sessionStorage.removeItem("pending_event");
        }
      }

      router.replace("/invites");
    }

    void handleCallback();
  }, [router, searchParams, queryClient]);

  return (
    <div className="flex h-screen items-center justify-center bg-zinc-50">
      <p className="animate-pulse text-sm font-medium text-zinc-500">Authenticating...</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-zinc-50">
          <p className="animate-pulse text-sm font-medium text-zinc-500">Loading...</p>
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
