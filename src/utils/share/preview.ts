import { SharePreviewType, type ShareData } from "./types";

export function buildPreviewImage(share: ShareData, inviteUrl: string): string | undefined {
  switch (share.previewType) {
    case SharePreviewType.BASIC:
      return undefined;

    case SharePreviewType.LARGE:
      return share.coverImage || undefined;

    case SharePreviewType.PREMIUM:
      return `${inviteUrl}/opengraph-image`;

    default:
      return share.coverImage || undefined;
  }
}
