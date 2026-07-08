"use client";

import { useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

const IDLE_LIMIT = 60 * 60 * 1000; // 1 hour

export function useIdleLogout({ enabled }: { enabled: boolean }) {
  const router = useRouter();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const logout = useCallback(() => {
    console.log("Auto logout due to inactivity");

    // Clear ONLY auth-related keys
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("uid");
    localStorage.removeItem("active_event_key");
    localStorage.removeItem("pending_event");
    localStorage.removeItem("last_activity");

    router.replace("/account/login");
  }, [router]);

  const resetTimer = useCallback(() => {
    localStorage.setItem("last_activity", Date.now().toString());

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(logout, IDLE_LIMIT);
  }, [logout]);

  useEffect(() => {
    if (!enabled) return;

    // 🔐 Cold-start inactivity check
    const lastActivity = Number(
      localStorage.getItem("last_activity")
    );

    if (
      lastActivity &&
      Date.now() - lastActivity > IDLE_LIMIT
    ) {
      logout();
      return;
    }

    const events = [
      "mousedown",
      "mousemove",
      "keydown",
      "scroll",
      "touchstart",
    ];

    events.forEach((event) =>
      document.addEventListener(event, resetTimer, true)
    );

    document.addEventListener("visibilitychange", resetTimer);

    // Start fresh timer
    resetTimer();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      events.forEach((event) =>
        document.removeEventListener(event, resetTimer, true)
      );

      document.removeEventListener(
        "visibilitychange",
        resetTimer
      );
    };
  }, [enabled, resetTimer, logout]);
}
