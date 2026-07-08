import { useMemo } from "react";
import { filterInvites } from "../utils/inviteFilters";
import { sortInvites } from "../utils/inviteSort";


export function useInviteFilters(
  invites: any[],
  filters: {
    search: string;
    category: string;
    type: string;
    style: string;
    price: string;
    sort: string;
  },
) {
  return useMemo(() => {
    const filtered = filterInvites(invites, filters);

    return sortInvites(filtered, filters.sort);
  }, [invites, filters]);
}
