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
