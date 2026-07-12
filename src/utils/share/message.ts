import type { ShareData } from "./types";

interface Options {
  includeUrl?: boolean;
  inviteUrl?: string;
}

export function buildShareMessage(share: ShareData, options: Options = {}) {
  const { includeUrl = true, inviteUrl = "" } = options;

  const lines: string[] = [];

  if (share.shareMessage) lines.push(share.shareMessage);

  if (share.couple) lines.push(share.couple);

  if (share.eventDate) lines.push(share.eventDate);

  if (share.eventTime) lines.push(share.eventTime);

  if (share.venue) lines.push(share.venue);

  if (includeUrl && inviteUrl) lines.push(inviteUrl);

  return lines.join("\n");
}
