import { notFound } from "next/navigation";
import { fetchEventByKey } from "../../../lib/api";
import PreviewClient from "./PreviewClient";

export default async function EventPage({ params }: { params: { event_key: string } }) {
  const { event_key } = await params;

  const data = await fetchEventByKey(event_key);

  if (!data) notFound();

  return <PreviewClient initialData={data} eventKey={event_key} />;
}
