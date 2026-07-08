export type AnnouncementImageKey = "main" | "left" | "right";

export type AnnouncementImageRule = {
  key: AnnouncementImageKey;
  label: string;
  required: boolean;
  width: number;
  height: number;
  aspectRatio: number;
};

export const themeAnnouncementMedia: Record<string, AnnouncementImageRule[]> = {
  aura: [
    {
      key: "main",
      label: "Main Couple Image",
      required: true,
      width: 768,
      height: 695,
      aspectRatio: 768 / 695,
    },
  ],

  luna: [
    {
      key: "main",
      label: "Main Couple Image",
      required: true,
      width: 600,
      height: 350,
      aspectRatio: 600 / 350,
    },
  ],
  mira: [
    {
      key: "main",
      label: "Main Couple Image",
      required: true,
      width: 530,
      height: 615,
      aspectRatio: 530 / 615,
    },
    {
      key: "left",
      label: "Left Decoration Image",
      required: false,
      width: 1,
      height: 1,
      aspectRatio: 1,
    },
    {
      key: "right",
      label: "Right Decoration Image",
      required: false,
      width: 1,
      height: 1,
      aspectRatio: 1,
    },
  ],

  nexa: [
    {
      key: "main",
      label: "Main Couple Image",
      required: true,
      width: 770,
      height: 480,
      aspectRatio: 770 / 480,
    },
  ],

  sora: [
    {
      key: "main",
      label: "Main Couple Image",
      required: true,
      width: 480,
      height: 770,
      aspectRatio: 480 / 770,
    },
  ],

  vibe: [
    {
      key: "main",
      label: "Main Couple Image",
      required: true,
      width: 1530,
      height: 2880,
      aspectRatio: 1530 / 2880,
    },
  ],
};