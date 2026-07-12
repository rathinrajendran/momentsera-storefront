import { ImageResponse } from "next/og";

import { fetchEventByKey } from "../../lib/api";

import { buildShare } from "@/utils/share/builder";
import { buildShareMessage } from "@/utils/share/message";
import { SharePreviewType, type ShareCardData } from "@/utils/share/types";
import { BasicCard, CoverCard, HeroCard, PremiumCard } from "@/utils/share/cards";

export const runtime = "nodejs";

export const alt = "Momentsera Invitation";

const IMAGE_SIZE = Object.freeze({
  width: 1200,
  height: 630,
});

export const size = IMAGE_SIZE;

export const contentType = "image/png";

type Props = {
  params: Promise<{
    event_key: string;
  }>;
};

function NotFoundImage() {
  return (
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
    </div>
  );
}

export default async function OpenGraphImage({ params }: Props) {
  const { event_key } = await params;

  let event = null;

  try {
    event = await fetchEventByKey(event_key);
  } catch (error) {
    console.error("[OpenGraph] Failed to fetch event:", error);
  }

  if (!event) {
    return new ImageResponse(<NotFoundImage />, IMAGE_SIZE);
  }

  try {
    const share = buildShare(event);

    const card: ShareCardData = {
      ...share,
      description: buildShareMessage(share, {
        includeUrl: false,
      }),
    };

    const CardComponent =
      share.previewType === SharePreviewType.BASIC
        ? BasicCard
        : share.previewType === SharePreviewType.COVER
          ? CoverCard
          : share.previewType === SharePreviewType.PREMIUM
            ? PremiumCard
            : HeroCard;

    return new ImageResponse(<CardComponent {...card} />, IMAGE_SIZE);
  } catch (error) {
    console.error("[OpenGraph] Failed to generate image:", error);

    return new ImageResponse(<NotFoundImage />, IMAGE_SIZE);
  }
}
