"use client";

import { createContext, useContext, ReactNode } from "react";
import { useSession } from "../hooks/useSession";
import { useLogout } from "../hooks/useLogout";


type AuthContextType = {
  user: ReturnType<typeof useSession>["user"];
  loading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
  refresh: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, loading, isAuthenticated, refresh } = useSession();
  const { logout } = useLogout();

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        logout,
        refresh: () => {
          void refresh();
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }

  return context;
}
