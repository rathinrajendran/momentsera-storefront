import { useEffect, useState } from "react";
import { apiClient } from "../../utils/apiClient";

interface AuthUser {
  id: number;
  full_name: string;
  email: string;
  role: "admin" | "user" | "guest";
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadUser = async () => {
      try {
        const data = await apiClient("/auth/me");

        if (mounted) {
          setUser(data.user);
        }
      } catch {
        if (mounted) {
          setUser(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadUser();

    return () => {
      mounted = false;
    };
  }, []);

  return {
    user,
    loading,
    isAuthenticated: !!user,
    setUser,
  };
}
