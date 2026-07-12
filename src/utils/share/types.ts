export enum SharePreviewType {
  BASIC = "basic",

  COVER = "cover",

  PREMIUM = "premium",

  HERO = "hero",
}
export interface ShareCardProps extends ShareData {
  description: string;
}
export interface ShareData {
  bride: string;
  groom: string;
  couple: string;

  eventType: string; // Wedding, Birthday, Engagement...
  eventTitle: string; // Wedding Invitation, Birthday Invitation...

  title: string; // Aarav & Diya | Wedding Invitation

  shareMessage: string;

  eventDate?: string;
  eventTime?: string;
  venue?: string;

  inviteUrl?: string;
  coverImage?: string;

  previewType: SharePreviewType;

  logo?: string;
  themeColor?: string;
}
export interface ShareCardData extends ShareData {
  description: string;
}