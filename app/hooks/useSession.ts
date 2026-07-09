import { useEffect } from "react";

export function useSession() {
  useEffect(() => {
    // Setup a dynamic check loop to transparently fetch fresh tokens
    const silentRefresh = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`, {
          method: "POST",
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem("access_token", data.accessToken);
        }
      } catch (error) {
        console.error("Failed silent authentication token rotation cycle:", error);
      }
    };

    // Spin up token rotation background timers (e.g., refresh every 10 minutes)
    const interval = setInterval(silentRefresh, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);
}
