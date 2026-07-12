import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { fetchEventByKey } from "../../lib/api";
import { buildShareMessage } from "../../utils/shareMessage";
import Catalog from "./invites/catalog/page";

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

  const announcement = data.announcement ?? {};
  const invite = data.invite ?? {};

  const bride = announcement?.bride?.name?.trim() ?? invite?.firstName?.trim() ?? "";

  const groom = announcement?.groom?.name?.trim() ?? invite?.secondName?.trim() ?? "";

  const couple = [bride, groom].filter(Boolean).join(" & ") || invite?.title || "Wedding Invitation";

  const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL ?? "https://invite.momentsera.com";

  const inviteUrl = `${frontendUrl}/${event_key}`;

  const imagePath = data.gallery?.coverImage || data.gallery?.cover || "/images/default-og.jpg";

  const coverImage = imagePath.startsWith("http") ? imagePath : `${frontendUrl}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;

  // Same message used by SharingEditor + ShareDialog
  const description = buildShareMessage(data, {
    includeUrl: false,
  });

  return {
    metadataBase: new URL(frontendUrl),

    title: `${couple} | Momentsera`,

    description,

    applicationName: "Momentsera",

    keywords: ["Wedding Invitation", "Digital Invitation", "Momentsera", bride, groom],

    robots: {
      index: true,
      follow: true,
    },

    alternates: {
      canonical: inviteUrl,
    },

    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: "Momentsera",

      url: inviteUrl,

      title: `${couple} | Wedding Invitation`,

      description,

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

      description,

      images: [coverImage],
    },
  };
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
