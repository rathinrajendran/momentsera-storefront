export type AnnouncementField = {
  key: string;
  type: "text" | "textarea" | "radio";
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: {
    label: string;
    value: string;
  }[];
};

export const themeAnnouncementFields: Record<string, AnnouncementField[]> = {
  aura: [
    {
      key: "groom.name",
      label: "Groom Name",
      type: "text",
      required: true,
    },
    {
      key: "bride.name",
      label: "Bride Name",
      type: "text",
      required: true,
    },
    {
      key: "message",
      label: "Invitation Message",
      type: "textarea",
    },
  ],

  luna: [
    // ─────────────────────────────────────
    // Couple / Header
    // ─────────────────────────────────────
    {
      key: "couple.monogram",
      label: "Couple Monogram",
      type: "text",
      required: false,
      placeholder: "A | E",
    },
    {
      key: "couple.familyLabel",
      label: "Family Invitation Label",
      type: "text",
      required: false,
      placeholder: "Together with their families",
    },
    {
      key: "announcement.title",
      label: "Invitation Title",
      type: "text",
      required: true,
      placeholder: "The Wedding",
    },
    {
      key: "bride.name",
      label: "Bride Name",
      type: "text",
      required: true,
    },
    {
      key: "groom.name",
      label: "Groom Name",
      type: "text",
      required: true,
    },

    // ─────────────────────────────────────
    // Announcement
    // ─────────────────────────────────────
    {
      key: "announcement.message",
      label: "Invitation Message",
      type: "textarea",
      required: false,
      placeholder: "Invite you to celebrate their wedding",
    },
  ],

  mira: [
    {
      key: "groom.name",
      label: "Groom Name",
      type: "text",
      required: true,
    },
    {
      key: "bride.name",
      label: "Bride Name",
      type: "text",
      required: true,
    },
    {
      key: "message",
      label: "Invitation Message",
      type: "textarea",
    },
  ],

  nexa: [
    {
      key: "groom.name",
      label: "Groom Name",
      type: "text",
      required: true,
    },
    {
      key: "bride.name",
      label: "Bride Name",
      type: "text",
      required: true,
    },
    {
      key: "message",
      label: "Invitation Message",
      type: "textarea",
    },
  ],

  nuvo: [
    {
      key: "groom.name",
      label: "Groom Name",
      type: "text",
      required: true,
    },
    {
      key: "bride.name",
      label: "Bride Name",
      type: "text",
      required: true,
    },
    {
      key: "message",
      label: "Invitation Message",
      type: "textarea",
    },
  ],

  sora: [
    {
      key: "groom.name",
      label: "Groom Name",
      type: "text",
      required: true,
    },
    {
      key: "bride.name",
      label: "Bride Name",
      type: "text",
      required: true,
    },
    {
      key: "message",
      label: "Invitation Message",
      type: "textarea",
    },
  ],

  vibe: [
    {
      key: "groom.name",
      label: "Groom Name",
      type: "text",
      required: true,
    },
    {
      key: "bride.name",
      label: "Bride Name",
      type: "text",
      required: true,
    },
    {
      key: "message",
      label: "Invitation Message",
      type: "textarea",
    },
  ],

  new: [
    {
      key: "groom.name",
      label: "Groom Name",
      type: "text",
      required: true,
    },
    {
      key: "bride.name",
      label: "Bride Name",
      type: "text",
      required: true,
    },
    {
      key: "groom.parents",
      label: "Groom Parents",
      type: "text",
    },
    {
      key: "bride.parents",
      label: "Bride Parents",
      type: "text",
    },
    {
      key: "familyName",
      label: "Family Name",
      type: "text",
    },
    {
      key: "message",
      label: "Invitation Message",
      type: "textarea",
    },
  ],
};
