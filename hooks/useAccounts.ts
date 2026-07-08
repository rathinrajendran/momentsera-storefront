import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchAccounts,
  createAccount,
  updateAccount,
  deleteAccount,
  checkAccountExists,
} from "../lib/api/accounts.api";

/* ---------------------------------
   GET ALL ACCOUNTS (ADMIN)
---------------------------------- */
export const useAccounts = () =>
  useQuery({
    queryKey: ["accounts"],
    queryFn: fetchAccounts,
    staleTime: Infinity,
  });

/* ---------------------------------
   CREATE ACCOUNT
---------------------------------- */
export function useCreateAccount() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createAccount,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["accounts"] });
    },
  });
}

/* ---------------------------------
   UPDATE ACCOUNT
---------------------------------- */
export function useUpdateAccount() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, patch }: { id: number; patch: any }) =>
      updateAccount(id, patch),

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["accounts"] });
    },
  });
}

/* ---------------------------------
   DELETE ACCOUNT
---------------------------------- */
export function useDeleteAccount() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["accounts"] });
    },
  });
}
export function useCheckAccountExists() {
  return async (params: { email?: string; phone?: string }) =>
    checkAccountExists(params);
}

