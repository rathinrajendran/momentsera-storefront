// app/editor/[event_key]/page.tsx
import { fetchEventByKey } from "../../../lib/api";
import InviteEditorClient from "./InviteEditorClient";
import { notFound } from "next/navigation";

// Force Next.js to bypass the build-time / layout cache for the editor
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Page({ params }: { params: { event_key: string } }) {
  // Await params properly according to Next.js APIs
  const { event_key } = await params;

  // Append a cache-busting timestamp internally if fetchEventByKey uses standard fetch
  const res = await fetchEventByKey(event_key);

  if (!res) notFound();

  return <InviteEditorClient eventKey={event_key} initialData={res} eventId={res?.invite?.id} />;
}
