import { useQuery } from "@tanstack/react-query";
import { apiClient, getAccessToken } from "../utils/apiClient";

export function useAuthUser() {
  return useQuery({
    queryKey: ["authUser"],
    enabled: !!getAccessToken(), // ✅ Don't call when logged out
    queryFn: async () => {
      const data = await apiClient("/auth/me");
      return data.user;
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}
