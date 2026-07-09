"use client";

import { useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import API from "../lib/api/config";

const IDLE_LIMIT = 60 * 60 * 1000; // 1 hour

export function useIdleLogout({ enabled }: { enabled: boolean }) {
  const router = useRouter();

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isLoggingOut = useRef(false);

  const logout = useCallback(async () => {
    if (isLoggingOut.current) return;
    isLoggingOut.current = true;

    try {
      await fetch(`${API}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout failed:", err);
    }

    sessionStorage.clear();

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    router.replace("/account/login");
  }, [router]);

  const resetTimer = useCallback(() => {
    sessionStorage.setItem("last_activity", Date.now().toString());

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      logout();
    }, IDLE_LIMIT);
  }, [logout]);

  useEffect(() => {
    if (!enabled) return;

    const lastActivity = Number(sessionStorage.getItem("last_activity") ?? "0");

    if (lastActivity && Date.now() - lastActivity > IDLE_LIMIT) {
      logout();
      return;
    }

    const events = ["mousedown", "mousemove", "keydown", "scroll", "touchstart", "click"];

    events.forEach((event) =>
      window.addEventListener(event, resetTimer, {
        passive: true,
      }),
    );

    document.addEventListener("visibilitychange", resetTimer);

    resetTimer();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      events.forEach((event) => window.removeEventListener(event, resetTimer));

      document.removeEventListener("visibilitychange", resetTimer);
    };
  }, [enabled, logout, resetTimer]);
}
