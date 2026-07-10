// lib/auth/authGuard.ts

import { redirect } from "next/navigation";
import { isLoggedIn, getCurrentUser } from "./session";

/**
 * Protect server routes/pages.
 * Redirects to login if the user is not authenticated.
 */
export async function requireAuth() {
  const authenticated = await isLoggedIn();

  if (!authenticated) {
    redirect("/login");
  }

  return getCurrentUser();
}

/**
 * Protect routes requiring specific roles.
 */
export async function requireRole(roles: string | string[]) {
  const user = await requireAuth();

  const allowedRoles = Array.isArray(roles) ? roles : [roles];

  if (!user || !allowedRoles.includes(user.role)) {
    redirect("/403");
  }

  return user;
}

/**
 * Redirect authenticated users away from guest-only pages
 * (e.g. Login, Register, Forgot Password).
 */
export async function requireGuest() {
  const authenticated = await isLoggedIn();

  if (authenticated) {
    redirect("/onboarding");
  }
}
