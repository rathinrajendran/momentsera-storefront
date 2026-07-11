import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "../lib/api/apiClient";

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["session"],
      });
    },
  });
}
