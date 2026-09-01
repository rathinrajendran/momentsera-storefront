"use client";

import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { refreshSession } from "../../../lib/api/apiClient";
import { QUERY_KEYS } from "../../../lib/queryKeys";
import { getCurrentUser } from "../../../auth/session";

function AuthCallbackContent() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const processed = useRef(false);

  useEffect(() => {
    if (processed.current) return;

    processed.current = true;

    async function handleCallback() {
      try {
        // The backend already stored the refresh token
        // in an HttpOnly cookie.
        //
        // refreshSession() sends that cookie to:
        // POST /api/auth/refresh
        const data = await refreshSession();

        if (!data?.accessToken) {
          router.replace(`/account/login?error=${encodeURIComponent(data?.message || "Authentication failed")}`);

          return;
        }

        // refreshSession() already calls setAccessToken().
        // No need to call it again here.

        // Load authenticated user
        await queryClient.fetchQuery({
          queryKey: QUERY_KEYS.session,
          queryFn: getCurrentUser,
        });

        await queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.me,
        });

        // Handle pending invite
        const pending = sessionStorage.getItem("pending_event");

        if (pending) {
          try {
            const invite = JSON.parse(pending) as {
              invite_key: string;
              event_type: string;
              created_at: number;
            };

            sessionStorage.removeItem("pending_event");

            const expired = Date.now() - invite.created_at > 60 * 60 * 1000;

            if (!expired && invite.invite_key && invite.event_type) {
              router.replace(`/invites/${invite.event_type}/${invite.invite_key}/onboarding`);

              return;
            }
          } catch {
            sessionStorage.removeItem("pending_event");
          }
        }

        router.replace("/invites");
      } catch (error) {
        console.error("Authentication callback failed:", error);

        router.replace("/account/login?error=authentication_failed");
      }
    }

    void handleCallback();
  }, [router, queryClient]);

  return (
    <div className="flex h-screen items-center justify-center bg-zinc-50">
      <p className="animate-pulse text-sm font-medium text-zinc-500">Authenticating...</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return <AuthCallbackContent />;
}
