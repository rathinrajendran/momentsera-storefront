import { useState, useEffect } from "react";

interface AuthUser {
  name: string;
  email: string;
  role: "admin" | "user" | "guest";
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Attempt to verify the presence of a valid runtime session
    const token = localStorage.getItem("access_token");
    if (!token) {
      setLoading(false);
      return;
    }

    // Optional: Decode JWT in frontend to set user info locally, or fetch user profile data
    // Here we assume a fast verification/profile endpoint
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.success) {
          setUser(data.user);
        } else {
          localStorage.removeItem("access_token");
        }
      })
      .catch(() => localStorage.removeItem("access_token"))
      .finally(() => setLoading(false));
  }, []);

  return { user, loading, isAuthenticated: !!user, setUser };
}
