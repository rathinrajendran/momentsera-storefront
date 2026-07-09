let memoizedAccessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  memoizedAccessToken = token;
};
export const getAccessToken = () => memoizedAccessToken;

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export async function apiClient(endpoint: string, options: RequestInit & { skipAuth?: boolean } = {}) {
  const { skipAuth = false, headers, ...customConfig } = options;

  // Change type from HeadersInit to Record<string, string>
  const reqHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(headers as Record<string, string>),
  };

  const token = getAccessToken();
  if (token && !skipAuth) {
    reqHeaders["Authorization"] = `Bearer ${token}`; // No more error!
  }

  const config: RequestInit = { ...customConfig, headers: reqHeaders, credentials: "include" };

  try {
    let response = await fetch(`${BASE_URL}${endpoint}`, config);

    if (response.status === 401 && !skipAuth) {
      const refreshedToken = await attemptTokenRefresh();
      if (refreshedToken) {
        (config.headers as Record<string, string>)["Authorization"] = `Bearer ${refreshedToken}`;
        response = await fetch(`${BASE_URL}${endpoint}`, config);
      } else {
        setAccessToken(null);
        if (typeof window !== "undefined") window.location.href = "/login?error=session_expired";
      }
    }

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || `HTTP error ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    return Promise.reject(error);
  }
}

async function attemptTokenRefresh(): Promise<string | null> {
  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, { method: "POST", credentials: "include" });
    if (!res.ok) return null;
    const data = await res.json();
    if (data?.success && data?.accessToken) {
      setAccessToken(data.accessToken);
      return data.accessToken;
    }
    return null;
  } catch {
    return null;
  }
}
