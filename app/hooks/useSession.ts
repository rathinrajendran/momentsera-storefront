import { useEffect } from "react";

export function useSession() {
  useEffect(() => {
    let mounted = true;

    const refresh = async () => {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`, {
          method: "POST",
          credentials: "include",
        });
      } catch {
        // Ignore refresh failures
      }
    };

    refresh();

    const interval = setInterval(refresh, 10 * 60 * 1000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);
}
