import { useMutation } from "@tanstack/react-query";
import { login } from "../lib/api/auth.api";

/* ---------------------------------
   LOGIN
---------------------------------- */
export function useLogin() {
  return useMutation({
    mutationFn: login,
  });
}

// "use client";

// import { useContext } from "react";
// import { AuthContext } from "../context/AuthContext";

// export function useAuth() {
//   const context = useContext(AuthContext);

//   if (!context) {
//     throw new Error("useAuth must be used inside AuthProvider");
//   }

//   return context;
// }