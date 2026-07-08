import { Invite } from "../types/invite";

interface FilterParams {
  search: string;
  category: string;
  type: string;
  style: string;
  price: string;
}

export function filterInvites(invites: Invite[], filters: FilterParams) {
  return invites.filter((invite) => {
    const matchSearch = invite.shortname
      ?.toLowerCase()
      .includes(filters.search.toLowerCase());

    const matchCategory =
      filters.category === "all" || invite.main_category === filters.category;

    const matchType = filters.type === "all" || invite.type === filters.type;

    const matchStyle =
      filters.style === "all" || invite.style_category === filters.style;

    let matchPrice = true;

    switch (filters.price) {
      case "under-1000":
        matchPrice = invite.price < 1000;
        break;

      case "1000-3000":
        matchPrice = invite.price >= 1000 && invite.price <= 3000;
        break;

      case "premium":
        matchPrice = invite.price > 3000;
        break;
    }

    return (
      matchSearch && matchCategory && matchType && matchStyle && matchPrice
    );
  });
}
