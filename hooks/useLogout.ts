import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "../lib/api/apiClient";

export function useLogout() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: logout,

    onSuccess: () => {
      queryClient.setQueryData(["session"], null);

      queryClient.removeQueries({
        queryKey: ["session"],
      });
    },
  });

  return {
    logout: mutation.mutate,
    logoutAsync: mutation.mutateAsync,
    ...mutation,
  };
}
