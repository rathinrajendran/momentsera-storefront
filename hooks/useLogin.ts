import { useMutation } from "@tanstack/react-query";
import { login } from "../lib/api/apiClient";

/* ---------------------------------
   LOGIN
---------------------------------- */
export function useLogin() {
  return useMutation({
    mutationFn: login,
  });
}
