import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { fetchEventByKey } from "../../lib/api";
import Catalog from "./invites/catalog/page";
import { buildShare } from "@/utils/share/builder";
import { buildMetadata } from "@/utils/share/metadata";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

type PageProps = {
  params: Promise<{
    event_key: string;
  }>;
};

/* -------------------------------------------------------------------------- */
/*                                Dynamic SEO                                 */
/* -------------------------------------------------------------------------- */

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { event_key } = await params;

  const data = await fetchEventByKey(event_key);

  if (!data) {
    return {
      title: "Invitation Not Found | Momentsera",
      description: "The invitation you're looking for could not be found.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL ?? "https://invite.momentsera.com";

  const share = buildShare(data);

  return buildMetadata(share, {
    frontendUrl,
    eventKey: event_key,
  });
}

/* -------------------------------------------------------------------------- */
/*                                  Page                                      */
/* -------------------------------------------------------------------------- */

export default async function EventPage({ params }: PageProps) {
  const { event_key } = await params;

  const data = await fetchEventByKey(event_key);

  if (!data) {
    notFound();
  }

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
      isLive
      motion={motion}
      sharing={sharing}
      privacy={privacy}
    />
  );
}
