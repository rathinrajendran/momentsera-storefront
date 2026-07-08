import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createDraft,
  updateDraft,
  fetchDrafts,
  fetchDraftById,
  convertDraftToEvent,
} from "../lib/api/drafts.api";

/* ---------- LIST ---------- */
export function useDrafts() {
  return useQuery({
    queryKey: ["drafts"],
    queryFn: fetchDrafts,
  });
}

/* ---------- GET ONE ---------- */
export function useDraftById(draftId: number) {
  return useQuery({
    queryKey: ["draft", draftId],
    queryFn: () => fetchDraftById(draftId),
    enabled: !!draftId,
  });
}

/* ---------- CREATE ---------- */
export function useCreateDraft() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createDraft,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["drafts"] });
    },
  });
}

/* ---------- UPDATE ---------- */
export function useUpdateDraft() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      draftId,
      payload,
    }: {
      draftId: number;
      payload: any;
    }) => updateDraft(draftId, payload),

    onSuccess: (_, { draftId }) => {
      qc.invalidateQueries({ queryKey: ["drafts"] });
      qc.invalidateQueries({ queryKey: ["draft", draftId] });
    },
  });
}

/* ---------- CONVERT ---------- */
export function useConvertDraft() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: convertDraftToEvent,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["drafts"] });
      qc.invalidateQueries({ queryKey: ["events"] });
    },
  });
}
