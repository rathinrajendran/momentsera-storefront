import { fetchInvitesByCategory } from "../../../../lib/api";
import EventLists from "./EventLists";

export default async function InvitesCategoryPage({ params }: { params: { eventType: string } }) {
  const { eventType } = await params;

  const invites = await fetchInvitesByCategory(eventType);

  return <EventLists invites={invites} />;
}
