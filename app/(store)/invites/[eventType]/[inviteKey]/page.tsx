import { notFound } from "next/navigation";
import { fetchInviteByKey } from "../../../../../lib/api";
import InviteInner from "./InviteInner";

export default async function InviteDetailPage({ params }: { params: { inviteKey: string; eventType?: string } }) {
  const { inviteKey, eventType } = await params;

  const invite = await fetchInviteByKey(inviteKey);

  if (!invite) {
    notFound();
  }

  return <InviteInner invite={invite} inviteKey={inviteKey} eventType={eventType} />;
}
