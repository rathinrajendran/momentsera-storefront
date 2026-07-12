import { SharePreviewType, type ShareData } from "./types";

export function buildPreviewImage(share: ShareData, inviteUrl: string): string | undefined {
  switch (share.previewType) {
    case SharePreviewType.BASIC:
      return undefined;

    case SharePreviewType.COVER:
      return share.coverImage || undefined;

    case SharePreviewType.HERO:
    case SharePreviewType.PREMIUM:
      return `${inviteUrl}/opengraph-image`;

    default:
      return share.coverImage || undefined;
  }
}
