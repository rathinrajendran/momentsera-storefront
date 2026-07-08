import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchMyWishes, fetchWishes, submitWish, updateWishes } from "../lib/api/wishes.api";

export type WishType = "text" | "audio" | "video";

export type SubmitWishPayload =
  | {
      wishesFrom: string;
      phone: string;
      wishesType: "text";
      wishes: string;
    }
  | {
      wishesFrom: string;
      phone: string;
      wishesType: "audio" | "video";
      formData: FormData;
    };

export function useUpdateWishes(eventKey: string, eventId: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (wishes: Record<string, any>) => updateWishes(eventId, wishes),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["event", eventKey] });
    },
  });
}

export function useSubmitWish(eventKey: string) {
  return useMutation({
    mutationFn: (payload: SubmitWishPayload) => submitWish(eventKey, payload),
  });
}

export function useWishes(eventKey: string) {
  return useQuery({
    queryKey: ["wishes", eventKey],
    queryFn: () => fetchWishes(eventKey),
    enabled: !!eventKey,
    staleTime: 0,
  });
}

export function useMyWishes(token: string) {
  return useQuery({
    queryKey: ["my-wishes"],
    queryFn: () => fetchMyWishes(token),
    enabled: !!token,
  });
}