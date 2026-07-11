import { fetchInvites } from "../../../lib/api";
import InviteLists from "./InviteLists";

export const metadata = {
  title: "Invitation Invites",
  description: "Browse premium invitation invites",
};

// This page depends on the API.
// Don't prerender it during build.
export const dynamic = "force-dynamic";

export default async function Invites() {
  let invites: any[] = [];

  try {
    invites = await fetchInvites();
  } catch (error) {
    console.error("Failed to fetch invites:", error);

    // Prevent build/runtime failure
    invites = [];
  }

  const filters = {
    categories: ["all", ...Array.from(new Set(invites.map((item: any) => item.main_category).filter(Boolean)))],

    types: ["all", ...Array.from(new Set(invites.map((item: any) => item.type).filter(Boolean)))],

    styles: ["all", ...Array.from(new Set(invites.map((item: any) => item.style_category).filter(Boolean)))],
  };

  return <InviteLists invites={invites} filters={filters} />;
}
