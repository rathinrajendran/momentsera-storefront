"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { setAccessToken } from "../../../utils/apiClient";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const processed = useRef(false);

  useEffect(() => {
    if (processed.current) return;

    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (error) {
      router.replace(`/login?error=${encodeURIComponent(error)}`);
      return;
    }

    if (token) {
      processed.current = true;
      setAccessToken(token);

      // Invalidate query to trigger useAuthUser mapping immediately
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      router.replace("/invites");
    } else {
      router.replace("/login");
    }
  }, [searchParams, router, queryClient]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-zinc-50">
      <p className="animate-pulse text-sm font-medium text-zinc-500">Authenticating...</p>
    </div>
  );
}
