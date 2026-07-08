import { useMutation, useQueryClient } from "@tanstack/react-query";
import { saveEventSection } from "../lib/api";
import { EventFunction } from "../types/eventFunction";

export function useUpdateFunctions(
  eventKey: string,
  eventId: number
) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ functions }: { functions: EventFunction[] }) =>
      saveEventSection(
        eventId,
        "functions",
        functions,
        "functions"
      ),

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["event", eventKey] });
    },
  });
}
