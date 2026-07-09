import { useState } from "react";
import { useRouter } from "next/navigation";

export function useGoogleLogin() {
  const router = useRouter();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);

  const loginWithGoogleToken = async (idToken: string) => {
    setIsGoogleLoading(true);
    setGoogleError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Google authentication failed.");
      }

      localStorage.setItem("access_token", data.accessToken);
      router.push("/dashboard");
    } catch (err: any) {
      setGoogleError(err.message);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return { loginWithGoogleToken, isGoogleLoading, googleError };
}
