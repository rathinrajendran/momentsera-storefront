import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { fetchEventByKey } from "../../lib/api";
import Catalog from "./invites/catalog/page";

type PageProps = {
  params: Promise<{
    event_key: string;
  }>;
};

/* ---------------------------------------------
 * Dynamic SEO + WhatsApp/Facebook Preview
 * --------------------------------------------*/
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { event_key } = await params;

  const data = await fetchEventByKey(event_key);

  if (!data) {
    return {
      title: "Invitation Not Found",
      description: "The invitation you're looking for does not exist.",
    };
  }

  const announcement = data.announcement ?? {};
  const invite = data.invite ?? {};

  const bride = announcement?.bride?.name ?? invite?.firstName ?? "";

  const groom = announcement?.groom?.name ?? invite?.secondName ?? "";

  const couple = [bride, groom].filter(Boolean).join(" & ") || "Wedding Invitation";

  const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL ?? "https://invite.momentsera.com";

  const inviteUrl = `${frontendUrl}/${event_key}`;

  const coverImage = data.gallery?.coverImage || data.gallery?.cover || `${frontendUrl}/images/default-og.jpg`;

  return {
    title: `${couple} | Momentsera`,

    description: "You're invited to celebrate our special day.",

    alternates: {
      canonical: inviteUrl,
    },

    openGraph: {
      type: "website",
      url: inviteUrl,

      title: `${couple} | Wedding Invitation`,

      description: "You're invited to celebrate our special day.",

      images: [
        {
          url: coverImage,
          width: 1200,
          height: 630,
          alt: couple,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",

      title: `${couple} | Wedding Invitation`,

      description: "You're invited to celebrate our special day.",

      images: [coverImage],
    },
  };
}

/* ---------------------------------------------
 * Invitation Page
 * --------------------------------------------*/
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
      isLive={true}
      motion={motion}
      sharing={sharing}
      privacy={privacy}
    />
  );
}
