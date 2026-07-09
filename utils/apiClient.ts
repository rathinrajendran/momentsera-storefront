let memoizedAccessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  memoizedAccessToken = token;
};

export const getAccessToken = () => memoizedAccessToken;

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

// Added requireAuth to the options type
export async function apiClient(endpoint: string, options: RequestInit & { skipAuth?: boolean; requireAuth?: boolean } = {}) {
  // requireAuth defaults to false so public storefront pages don't force login redirects
  const { skipAuth = false, requireAuth = false, headers, ...customConfig } = options;

  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(headers as Record<string, string>),
  };

  const token = getAccessToken();

  if (token && !skipAuth) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  let response = await fetch(`${BASE_URL}${endpoint}`, {
    ...customConfig,
    headers: requestHeaders,
    credentials: "include",
  });

  // Access token expired or missing
  if (response.status === 401 && !skipAuth) {
    const refreshedToken = await attemptTokenRefresh();

    if (!refreshedToken) {
      setAccessToken(null);

      // ONLY redirect to login if the page or request explicitly requires authentication
      if (requireAuth && typeof window !== "undefined") {
        sessionStorage.clear();
        window.location.replace("/account/login?error=session_expired");
      }

      // If auth is not required, throw the error silently or catch it below to let the UI handle it gracefully
      throw new Error("Session expired or unauthorized");
    }

    response = await fetch(`${BASE_URL}${endpoint}`, {
      ...customConfig,
      credentials: "include",
      headers: {
        ...requestHeaders,
        Authorization: `Bearer ${refreshedToken}`,
      },
    });
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message ?? error.error ?? `HTTP ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

async function attemptTokenRefresh(): Promise<string | null> {
  try {
    const response = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (!data?.accessToken) {
      return null;
    }

    setAccessToken(data.accessToken);
    return data.accessToken;
  } catch {
    return null;
  }
}

export async function logout() {
  try {
    await fetch(`${BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  } finally {
    setAccessToken(null);

    if (typeof window !== "undefined") {
      sessionStorage.clear();
      window.location.replace("/account/login");
    }
  }
}
