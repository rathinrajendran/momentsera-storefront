// lib/auth/token.ts

export interface JwtPayload {
  sub?: string;
  id?: number;
  email?: string;
  role?: string;
  exp?: number;
  iat?: number;
}

/**
 * Decode a JWT payload without verifying the signature.
 * Use only for reading claims on the client.
 */
export function decodeToken(token: string): JwtPayload | null {
  try {
    const payload = token.split(".")[1];

    if (!payload) return null;

    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(base64);

    return JSON.parse(json);
  } catch {
    return null;
  }
}

/**
 * Check whether a JWT has expired.
 */
export function isTokenExpired(token: string): boolean {
  const payload = decodeToken(token);

  if (!payload?.exp) return true;

  return payload.exp * 1000 <= Date.now();
}