import type { Metadata } from "next";
import { type ShareData } from "./types";
import { buildShareMessage } from "./message";
import { buildPreviewImage } from "./preview";

interface Options {
  frontendUrl?: string;
  eventKey: string;
}

function getFrontendUrl(url?: string) {
  const value = url || process.env.FRONTEND_URL || process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000";

  try {
    return new URL(value).toString().replace(/\/$/, "");
  } catch {
    return "http://localhost:3000";
  }
}

export function buildMetadata(share: ShareData, options: Options): Metadata {
  const frontendUrl = getFrontendUrl(options.frontendUrl);

  const inviteUrl = `${frontendUrl}/${options.eventKey}`;

  const description = buildShareMessage(share, {
    includeUrl: false,
  });

  const image = buildPreviewImage(share, inviteUrl);

  return {
    metadataBase: new URL(frontendUrl),

    title: share.title,
    description,

    alternates: {
      canonical: inviteUrl,
    },

    openGraph: {
      type: "website",
      url: inviteUrl,
      title: share.title,
      description,
      images: image
        ? [
            {
              url: image,
              width: 1200,
              height: 630,
              alt: share.couple,
            },
          ]
        : [],
    },

    twitter: {
      card: "summary_large_image",
      title: share.title,
      description,
      images: image ? [image] : [],
    },
  };
}
