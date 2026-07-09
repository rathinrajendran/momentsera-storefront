"use client";

import { Suspense, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { setAccessToken } from "../../../utils/apiClient";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const processed = useRef(false);

  useEffect(() => {
    if (processed.current) return;

    processed.current = true;

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

    setAccessToken(token);

    queryClient.invalidateQueries({
      queryKey: ["authUser"],
    });

    // Restore pending invite if available
    const pending = sessionStorage.getItem("pending_event");

    if (pending) {
      try {
        const invite = JSON.parse(pending);

        sessionStorage.removeItem("pending_event");

        router.replace(`/invites/${invite.event_type}/${invite.invite_key}/onboarding`);
        return;
      } catch {
        sessionStorage.removeItem("pending_event");
      }
    }

    router.replace("/invites");
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
