// lib/auth/permissions.ts

export enum UserRole {
  USER = "user",
  ADMIN = "admin",
  SUPER_ADMIN = "super_admin",
}

export interface AuthUser {
  id: number;
  email: string;
  role: UserRole | string;
}

/**
 * Check if the user has one of the allowed roles.
 */
export function hasRole(user: Pick<AuthUser, "role"> | null | undefined, roles: UserRole | UserRole[]): boolean {
  if (!user) return false;

  const allowed = Array.isArray(roles) ? roles : [roles];

  return allowed.includes(user.role as UserRole);
}

/**
 * Check if the user is an administrator.
 */
export function isAdmin(user: Pick<AuthUser, "role"> | null | undefined): boolean {
  return hasRole(user, [UserRole.ADMIN, UserRole.SUPER_ADMIN]);
}

/**
 * Check if the user is a super administrator.
 */
export function isSuperAdmin(user: Pick<AuthUser, "role"> | null | undefined): boolean {
  return hasRole(user, UserRole.SUPER_ADMIN);
}
