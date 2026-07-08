import { Invite } from "../types/invite";

export function sortInvites(invites: Invite[], sort: string) {
  const sorted = [...invites];

  switch (sort) {
    case "low-high":
      return sorted.sort((a, b) => a.price - b.price);

    case "high-low":
      return sorted.sort((a, b) => b.price - a.price);

    case "latest":
    default:
      return sorted;
  }
}
