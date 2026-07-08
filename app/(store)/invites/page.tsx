import { fetchInvites } from "../../../lib/api";
import InviteLists from "./InviteLists";

export const metadata = {
  title: "Invitation Invites",
  description: "Browse premium invitation invites",
};

export default async function Invites() {
  const invites = await fetchInvites();

  const filters = {
    categories: ["all", ...Array.from(new Set<string>(invites.map((item: any) => item.main_category)))],

    types: ["all", ...Array.from(new Set<string>(invites.map((item: any) => item.type)))],

    styles: ["all", ...Array.from(new Set<string>(invites.map((item: any) => item.style_category)))],
  };

  return <InviteLists invites={invites} filters={filters} />;
}
