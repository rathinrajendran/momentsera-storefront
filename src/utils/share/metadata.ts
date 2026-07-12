import type { Metadata } from "next";
import { SharePreviewType, type ShareData } from "./types";
import { buildShareMessage } from "./message";
import { buildPreviewImage } from "./preview";

interface Options {
  frontendUrl: string;
  eventKey: string;
}

export function buildMetadata(share: ShareData, options: Options): Metadata {
  const inviteUrl = `${options.frontendUrl}/${options.eventKey}`;

  const description = buildShareMessage(share, {
    includeUrl: false,
  });

const image = buildPreviewImage(share, inviteUrl);

  return {
    metadataBase: new URL(options.frontendUrl),

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
