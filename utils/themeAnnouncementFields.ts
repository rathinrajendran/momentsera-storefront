export type EditorPage =
  "announcement" | "wedding-details" | "story" | "functions" | "gallery" | "dress-code" | "music" | "wishes" | "rsvp";

export type AnnouncementFieldType = "text" | "textarea" | "radio" | "date" | "time" | "image" | "image-list" | "audio" | "color-list";

export type AnnouncementField = {
  key: string;
  type: AnnouncementFieldType;
  label: string;
  placeholder?: string;
  required?: boolean;
  defaultValue?: string;
  options?: {
    label: string;
    value: string;
  }[];
};

export type AnnouncementGroup = {
  key: string;
  label: string;
  type: "group";
  fields: AnnouncementField[];
};

export type AnnouncementRepeater = {
  key: string;
  label: string;
  type: "repeater";
  itemLabel?: string;
  fields: AnnouncementField[];
};

export type AnnouncementSection = {
  key: string;
  label: string;
  type: "section";
  editorPage: EditorPage;
  fields: (AnnouncementField | AnnouncementGroup | AnnouncementRepeater)[];
};

export type ThemeAnnouncementField = AnnouncementField | AnnouncementGroup | AnnouncementRepeater | AnnouncementSection;

export const themeAnnouncementFields: Record<string, ThemeAnnouncementField[]> = {
  // =========================================================
  // AURA
  // =========================================================
  aura: [
    {
      key: "couple",
      label: "Couple",
      type: "section",
      editorPage: "announcement",
      fields: [
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
      ],
    },

    {
      key: "announcement",
      label: "Announcement",
      type: "section",
      editorPage: "announcement",
      fields: [
        {
          key: "message",
          label: "Invitation Message",
          type: "textarea",
        },
      ],
    },
  ],

  // =========================================================
  // LUNA
  // =========================================================
  luna: [
    {
      key: "couple",
      label: "Couple",
      type: "section",
      editorPage: "announcement",
      fields: [
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
        {
          key: "couple.monogram",
          label: "Couple Monogram",
          type: "text",
          placeholder: "A | E",
        },
        {
          key: "couple.familyLabel",
          label: "Family Invitation Label",
          type: "text",
          placeholder: "Together with their families",
        },
      ],
    },

    {
      key: "announcement",
      label: "Announcement",
      type: "section",
      editorPage: "announcement",
      fields: [
        {
          key: "announcement.title",
          label: "Invitation Title",
          type: "text",
          required: true,
          placeholder: "The Wedding",
        },
        {
          key: "announcement.message",
          label: "Invitation Message",
          type: "textarea",
          placeholder: "Invite you to celebrate their wedding",
        },
      ],
    },
  ],

  // =========================================================
  // MIRA
  // =========================================================
  mira: [
    {
      key: "couple",
      label: "Couple",
      type: "section",
      editorPage: "announcement",
      fields: [
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
      ],
    },

    {
      key: "announcement",
      label: "Announcement",
      type: "section",
      editorPage: "announcement",
      fields: [
        {
          key: "message",
          label: "Invitation Message",
          type: "textarea",
        },
      ],
    },
  ],

  // =========================================================
  // NEXA
  // =========================================================
  nexa: [
    {
      key: "couple",
      label: "Couple",
      type: "section",
      editorPage: "announcement",
      fields: [
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
      ],
    },

    {
      key: "announcement",
      label: "Announcement",
      type: "section",
      editorPage: "announcement",
      fields: [
        {
          key: "message",
          label: "Invitation Message",
          type: "textarea",
        },
      ],
    },
  ],

  // =========================================================
  // NUVO
  // =========================================================
  nuvo: [
    // ---------------------------------------------------------
    // COUPLE
    // ---------------------------------------------------------
    {
      key: "couple",
      label: "Couple",
      type: "section",
      editorPage: "announcement",
      fields: [
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
          key: "couple.familyLabel",
          label: "Family Label",
          type: "text",
          defaultValue: "Together with their families",
        },
        {
          key: "couple.monogram",
          label: "Couple Monogram",
          type: "text",
        },
      ],
    },

    // ---------------------------------------------------------
    // HERO
    // ---------------------------------------------------------
    {
      key: "hero",
      label: "Hero",
      type: "section",
      editorPage: "announcement",
      fields: [
        {
          key: "announcement.title",
          label: "Invitation Title",
          type: "text",
          defaultValue: "We're getting married",
        },
        {
          key: "message",
          label: "Invitation Message",
          type: "textarea",
          defaultValue: "We are getting married and would love to celebrate this new chapter with you.",
        },
        {
          key: "heroImage",
          label: "Hero Image",
          type: "image",
        },
      ],
    },

    // ---------------------------------------------------------
    // WEDDING DETAILS
    // ---------------------------------------------------------
    {
      key: "wedding-details",
      label: "Wedding Details",
      type: "section",
      editorPage: "wedding-details",
      fields: [
        {
          key: "primaryFunction.title",
          label: "Wedding Event",
          type: "text",
        },
        {
          key: "primaryFunction.date",
          label: "Wedding Date",
          type: "date",
        },
        {
          key: "primaryFunction.startTime",
          label: "Wedding Time",
          type: "time",
        },
        {
          key: "primaryFunction.locationName",
          label: "Wedding Venue",
          type: "text",
        },
      ],
    },

    // ---------------------------------------------------------
    // OUR STORY
    // ---------------------------------------------------------
    {
      key: "story",
      label: "Our Story",
      type: "section",
      editorPage: "story",
      fields: [
        {
          key: "story.weMet",
          label: "We Met",
          type: "group",
          fields: [
            {
              key: "title",
              label: "Title",
              type: "text",
              defaultValue: "WE MET",
            },
            {
              key: "date",
              label: "Date",
              type: "date",
            },
            {
              key: "description",
              label: "Description",
              type: "textarea",
            },
          ],
        },

        {
          key: "story.firstDate",
          label: "First Date",
          type: "group",
          fields: [
            {
              key: "title",
              label: "Title",
              type: "text",
              defaultValue: "FIRST DATE",
            },
            {
              key: "date",
              label: "Date",
              type: "date",
            },
            {
              key: "description",
              label: "Description",
              type: "textarea",
            },
          ],
        },

        {
          key: "story.engagement",
          label: "Proposal",
          type: "group",
          fields: [
            {
              key: "title",
              label: "Title",
              type: "text",
              defaultValue: "SHE SAID YES",
            },
            {
              key: "date",
              label: "Date",
              type: "date",
            },
            {
              key: "description",
              label: "Description",
              type: "textarea",
            },
          ],
        },

        {
          key: "story.forever",
          label: "Forever Starts",
          type: "group",
          fields: [
            {
              key: "title",
              label: "Title",
              type: "text",
              defaultValue: "FOREVER STARTS",
            },
            {
              key: "date",
              label: "Date",
              type: "date",
            },
            {
              key: "description",
              label: "Description",
              type: "textarea",
            },
          ],
        },
      ],
    },

    // ---------------------------------------------------------
    // WEDDING FUNCTIONS
    // ---------------------------------------------------------
    {
      key: "events",
      label: "Wedding Functions",
      type: "section",
      editorPage: "functions",
      fields: [
        {
          key: "eventFunctions",
          label: "Functions",
          type: "repeater",
          itemLabel: "Function",
          fields: [
            {
              key: "title",
              label: "Function Name",
              type: "text",
              required: true,
            },
            {
              key: "date",
              label: "Date",
              type: "date",
              required: true,
            },
            {
              key: "startTime",
              label: "Start Time",
              type: "time",
            },
            {
              key: "locationName",
              label: "Venue",
              type: "text",
            },
            {
              key: "description",
              label: "Description",
              type: "textarea",
            },
          ],
        },
      ],
    },

    // ---------------------------------------------------------
    // GALLERY
    // ---------------------------------------------------------
    {
      key: "gallery",
      label: "Gallery",
      type: "section",
      editorPage: "gallery",
      fields: [
        {
          key: "galleryUrls",
          label: "Gallery Images",
          type: "image-list",
        },
      ],
    },

    // ---------------------------------------------------------
    // DRESS CODE
    // ---------------------------------------------------------
    {
      key: "dress-code",
      label: "Dress Code",
      type: "section",
      editorPage: "dress-code",
      fields: [
        {
          key: "dressCode",
          label: "Dress Codes",
          type: "repeater",
          itemLabel: "Dress Code",
          fields: [
            {
              key: "title",
              label: "Title",
              type: "text",
            },
            {
              key: "description",
              label: "Description",
              type: "textarea",
            },
            {
              key: "hexColors",
              label: "Colors",
              type: "color-list",
            },
          ],
        },
      ],
    },

    // ---------------------------------------------------------
    // MUSIC
    // ---------------------------------------------------------
    {
      key: "music",
      label: "Music",
      type: "section",
      editorPage: "music",
      fields: [
        {
          key: "music.background_audio",
          label: "Background Music",
          type: "audio",
        },
        {
          key: "music.background_audio_name",
          label: "Music Name",
          type: "text",
        },
      ],
    },

    // ---------------------------------------------------------
    // WISHES
    // ---------------------------------------------------------
    {
      key: "wishes",
      label: "Wishes",
      type: "section",
      editorPage: "wishes",
      fields: [
        {
          key: "wishesTitle",
          label: "Wishes Title",
          type: "text",
          defaultValue: "Best Wishes",
        },
      ],
    },

    // ---------------------------------------------------------
    // RSVP
    // ---------------------------------------------------------
    {
      key: "rsvp",
      label: "RSVP",
      type: "section",
      editorPage: "rsvp",
      fields: [
        {
          key: "rsvp.deadline",
          label: "RSVP Deadline",
          type: "date",
        },
        {
          key: "rsvp.message",
          label: "RSVP Message",
          type: "textarea",
        },
      ],
    },
  ],

  // =========================================================
  // SORA
  // =========================================================
  sora: [
    {
      key: "couple",
      label: "Couple",
      type: "section",
      editorPage: "announcement",
      fields: [
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
      ],
    },

    {
      key: "announcement",
      label: "Announcement",
      type: "section",
      editorPage: "announcement",
      fields: [
        {
          key: "message",
          label: "Invitation Message",
          type: "textarea",
        },
      ],
    },
  ],

  // =========================================================
  // VIBE
  // =========================================================
  vibe: [
    {
      key: "couple",
      label: "Couple",
      type: "section",
      editorPage: "announcement",
      fields: [
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
      ],
    },

    {
      key: "announcement",
      label: "Announcement",
      type: "section",
      editorPage: "announcement",
      fields: [
        {
          key: "message",
          label: "Invitation Message",
          type: "textarea",
        },
      ],
    },
  ],

  // =========================================================
  // NEW
  // =========================================================
  new: [
    {
      key: "couple",
      label: "Couple",
      type: "section",
      editorPage: "announcement",
      fields: [
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
      ],
    },

    {
      key: "family",
      label: "Family",
      type: "section",
      editorPage: "announcement",
      fields: [
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
      ],
    },

    {
      key: "announcement",
      label: "Announcement",
      type: "section",
      editorPage: "announcement",
      fields: [
        {
          key: "message",
          label: "Invitation Message",
          type: "textarea",
        },
      ],
    },
  ],
};

export function getThemeEditorFields(themeKey: string, editorPage: EditorPage): AnnouncementSection[] {
  const fields = themeAnnouncementFields[themeKey] ?? themeAnnouncementFields["aura"];

  return fields.filter((field): field is AnnouncementSection => field.type === "section" && field.editorPage === editorPage);
}
