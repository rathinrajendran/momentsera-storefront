import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../utils/apiClient";

export function useAuthUser() {
  return useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const data = await apiClient("/auth/me");
      return data.user;
    },
    staleTime: 1000 * 60 * 5, // Keep configuration valid for 5 minutes
    retry: false,
  });
}
