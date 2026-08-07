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

  // luna: [
  //   {
  //     key: "groom.name",
  //     label: "Groom Name",
  //     type: "text",
  //     required: true,
  //   },
  //   {
  //     key: "bride.name",
  //     label: "Bride Name",
  //     type: "text",
  //     required: true,
  //   },
  //   {
  //     key: "message",
  //     label: "Invitation Message",
  //     type: "textarea",
  //   },
  // ],

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

  luna: [
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
