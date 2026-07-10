import { User } from "../../types/auth";
import { AuthResponse, ForgotPasswordPayload, LoginPayload, RegisterPayload, ResetPasswordPayload, VerifyEmailPayload } from "./auth.api";

let memoizedAccessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  memoizedAccessToken = token;
};

export const getAccessToken = () => memoizedAccessToken;

if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is missing");
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

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
if (response.status === 401 && requireAuth && !skipAuth) {
  const refreshedToken = await attemptTokenRefresh();

if (!refreshedToken) {
  setAccessToken(null);
  throw new Error("UNAUTHORIZED");
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
  }
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const data = await apiClient("/auth/login", {
    method: "POST",
    skipAuth: true,
    body: JSON.stringify(payload),
  });

  setAccessToken(data.accessToken);

  return data;
}

export async function register(payload: RegisterPayload) {
  return apiClient("/auth/register", {
    method: "POST",
    skipAuth: true,
    body: JSON.stringify(payload),
  });
}

export async function refreshSession() {
  const data = await apiClient("/auth/refresh", {
    method: "POST",
    skipAuth: true,
  });

  if (data?.accessToken) {
    setAccessToken(data.accessToken);
  }

  return data;
}

export async function googleLogin(credential: string): Promise<AuthResponse> {
  const data = await apiClient("/auth/google", {
    method: "POST",
    skipAuth: true,
    body: JSON.stringify({
      credential,
    }),
  });

  setAccessToken(data.accessToken);

  return data;
}

export async function forgotPassword(payload: ForgotPasswordPayload) {
  return apiClient("/auth/forgot-password", {
    method: "POST",
    skipAuth: true,
    body: JSON.stringify(payload),
  });
}

export async function resetPassword(payload: ResetPasswordPayload) {
  return apiClient("/auth/reset-password", {
    method: "POST",
    skipAuth: true,
    body: JSON.stringify(payload),
  });
}

export async function verifyEmail(payload: VerifyEmailPayload) {
  return apiClient("/auth/verify-email", {
    method: "POST",
    skipAuth: true,
    body: JSON.stringify(payload),
  });
}
