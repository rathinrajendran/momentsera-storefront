import { ImageResponse } from "next/og";

import { fetchEventByKey } from "../../lib/api";

import { buildShare } from "@/utils/share/builder";
import { buildShareMessage } from "@/utils/share/message";
import { SharePreviewType, type ShareCardData } from "@/utils/share/types";
import { BasicCard, LargeCard, PremiumCard } from "@/utils/share/cards";

export const runtime = "nodejs";

export const alt = "Momentsera Invitation";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

type Props = {
  params: Promise<{
    event_key: string;
  }>;
};

export default async function OpenGraphImage({ params }: Props) {
  const { event_key } = await params;

  const event = await fetchEventByKey(event_key);

  if (!event) {
    return new ImageResponse(
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#ffffff",
          color: "#111827",
          fontSize: 48,
          fontWeight: 700,
        }}
      >
        Invitation Not Found
      </div>,
      size,
    );
  }

  const share = buildShare(event);

  const card: ShareCardData = {
    ...share,
    description: buildShareMessage(share, {
      includeUrl: false,
    }),
  };

  switch (share.previewType) {
    case SharePreviewType.BASIC:
      return new ImageResponse(<BasicCard {...card} />, size);

    case SharePreviewType.LARGE:
      return new ImageResponse(<LargeCard {...card} />, size);

    case SharePreviewType.PREMIUM:
      return new ImageResponse(<PremiumCard {...card} />, size);

    default:
      return new ImageResponse(<LargeCard {...card} />, size);
  }
}
