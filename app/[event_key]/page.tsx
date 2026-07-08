import { notFound } from "next/navigation";
import { fetchEventByKey } from "../../lib/api";
import Catalog from "./invites/catalog/page";

export default async function EventPage({ params }: { params: { event_key: string } }) {
  const { event_key } = await params;
  const data = await fetchEventByKey(event_key);
  if (!data) notFound();

  const {
    announcement,
    invite,
    schedule,
    gallery,
    dressCode,
    rsvp,
    timeline,
    settings,
    wishes,
    music,
    theme,
    print,
    sharing,
    motion,
    privacy,
  } = data;

  return (
    <Catalog
      data={{
        announcement,
        invite,
        schedule,
        gallery,
        wishes,
        dressCode,
        rsvp,
        timeline,
      }}
      settings={settings}
      music={music}
      theme={theme}
      eventKey={event_key}
      print={print}
      isLive={true}
      motion={motion}
      sharing={sharing}
      privacy={privacy}
    />
  );
}
