import { fetchInvites } from "../../../lib/api";
import InviteLists from "./InviteLists";

export const metadata = {
  title: "Invitation Invites",
  description: "Browse premium invitation invites",
};

export const dynamic = "force-dynamic";

export default async function Invites() {
  let invites: any[] = [];

  try {
    invites = await fetchInvites();
  } catch (error) {
    console.error("Failed to fetch invites:", error);
  }

  const filters = {
    categories: ["all", ...new Set(invites.map((item) => item.main_category))],
    types: ["all", ...new Set(invites.map((item) => item.type))],
    styles: ["all", ...new Set(invites.map((item) => item.style_category))],
  };

  return <InviteLists invites={invites} filters={filters} />;
}
