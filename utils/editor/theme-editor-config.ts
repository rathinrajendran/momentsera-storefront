import { section, media, type EditorPage, type EditorSection, type ThemeEditorRegistry } from "./editor-schema";

import { FIELDS, customizeField } from "./field-catalog";

/**
 * Each theme defines only what that invitation actually needs.
 *
 * A theme can have:
 * - different fields
 * - different field order
 * - different labels
 * - different placeholders
 * - different required fields
 * - different media
 * - different media descriptions/dimensions
 * - different editor pages
 */
export const THEME_EDITOR_CONFIG: ThemeEditorRegistry = {
  // =========================================================
  // AURA
  // =========================================================
  aura: {
    announcement: [
      section("couple", "Couple", "announcement", [FIELDS.groomName(), FIELDS.brideName()]),

      section("hero", "Hero", "announcement", [
        customizeField(FIELDS.invitationMessage, {
          label: "Invitation Message",
          placeholder: "Write your wedding invitation...",
        }),
      ]),
    ],
  },

  // =========================================================
  // LUNA
  // =========================================================
  luna: {
    announcement: [
      section("couple", "Couple", "announcement", [
        FIELDS.brideName(),
        FIELDS.groomName(),

        customizeField(FIELDS.monogram, {
          label: "Couple Monogram",
          placeholder: "A | E",
        }),

        customizeField(FIELDS.familyLabel, {
          label: "Family Invitation Label",
          placeholder: "Together with their families",
        }),
      ]),

      section("hero", "Hero", "announcement", [
        customizeField(FIELDS.invitationTitle, {
          label: "Wedding Title",
          placeholder: "The Wedding",
          required: true,
        }),

        customizeField(FIELDS.invitationMessage, {
          label: "Invitation Message",
          placeholder: "Invite you to celebrate their wedding",
        }),
      ]),
    ],
  },

  // =========================================================
  // NUVO
  // =========================================================
  nuvo: {
    announcement: [
      // -------------------------------------------------------
      // COUPLE
      // -------------------------------------------------------
      section(
        "couple",
        "Couple",
        "announcement",
        [
          FIELDS.groomName(),

          FIELDS.brideName(),

          customizeField(FIELDS.familyLabel, {
            label: "Together With",
            placeholder: "Together with their families",
          }),

          customizeField(FIELDS.monogram, {
            label: "Monogram",
            placeholder: "A & E",
          }),

          FIELDS.coupleDisplayOrder(),

          customizeField(FIELDS.invitationMessage, {
            label: "Opening Message",
            placeholder: "We are getting married and would love to celebrate this new chapter with you.",
          }),
        ],
        {
          media: [
            media("main", {
              type: "image",
              label: "Couple Image",
              description: "Upload a portrait photograph of the couple for the Nuvo announcement.",
              descriptionKey: "media.main.description",
              descriptionLabel: "Image Description",
              descriptionPlaceholder: "Describe this photograph...",
              required: false,
              width: 480,
              height: 770,
              aspectRatio: 480 / 770,
            }),
            media("secondary", {
              type: "image",
              label: "Secondary Couple Image",
              description: "Upload a second portrait photograph of the couple for the Nuvo announcement.",
              descriptionKey: "media.secondary.description",
              descriptionLabel: "Image Description",
              descriptionPlaceholder: "Describe this photograph...",
              required: false,
              width: 480,
              height: 770,
              aspectRatio: 480 / 770,
            }),
          ],
        },
      ),

      // -------------------------------------------------------
      // HERO
      // -------------------------------------------------------
      // section("hero", "Hero", "announcement", [
      //   customizeField(FIELDS.invitationTitle, {
      //     label: "Wedding Title",
      //     placeholder: "The Wedding",
      //   }),
      // ]),
    ],

    // ---------------------------------------------------------
    // WEDDING DETAILS
    // ---------------------------------------------------------
    "wedding-details": [
      section("wedding-details", "Wedding Details", "wedding-details", [
        customizeField(FIELDS.eventTitle, {
          label: "Event Title",
          placeholder: "Wedding Ceremony",
        }),
      ]),
    ],
  },
  sora: {
    announcement: [
      // -------------------------------------------------------
      // COUPLE
      // -------------------------------------------------------
      section(
        "couple",
        "Couple",
        "announcement",
        [
          FIELDS.groomName(),

          FIELDS.brideName(),

          customizeField(FIELDS.familyLabel, {
            label: "Together With",
            placeholder: "Together with their families",
          }),

          customizeField(FIELDS.monogram, {
            label: "Monogram",
            placeholder: "A & E",
          }),

          FIELDS.coupleDisplayOrder(),

          customizeField(FIELDS.invitationMessage, {
            label: "Opening Message",
            placeholder: "Invite you to celebrate their wedding",
          }),
        ],
        {
          media: [
            media("main", {
              type: "image",
              label: "Couple Image",
              description: "Upload a portrait photograph of the couple for the Nuvo announcement.",
              descriptionKey: "media.main.description",
              descriptionLabel: "Image Description",
              descriptionPlaceholder: "Describe this photograph...",
              required: false,
              width: 480,
              height: 770,
              aspectRatio: 480 / 770,
            }),
            media("secondary", {
              type: "image",
              label: "Secondary Couple Image",
              description: "Upload a second portrait photograph of the couple for the Nuvo announcement.",
              descriptionKey: "media.secondary.description",
              descriptionLabel: "Image Description",
              descriptionPlaceholder: "Describe this photograph...",
              required: false,
              width: 480,
              height: 770,
              aspectRatio: 480 / 770,
            }),
          ],
        },
      ),

      // -------------------------------------------------------
      // HERO
      // -------------------------------------------------------
      // section("hero", "Hero", "announcement", [
      //   customizeField(FIELDS.invitationTitle, {
      //     label: "Wedding Title",
      //     placeholder: "The Wedding",
      //   }),
      // ]),
    ],

    // ---------------------------------------------------------
    // WEDDING DETAILS
    // ---------------------------------------------------------
    "wedding-details": [
      section("wedding-details", "Wedding Details", "wedding-details", [
        customizeField(FIELDS.eventTitle, {
          label: "Event Title",
          placeholder: "Wedding Ceremony",
        }),
      ]),
    ],
  },

  // =========================================================
  // MIRA
  // =========================================================
  mira: {
    announcement: [
      section("couple", "The Couple", "announcement", [
        customizeField(FIELDS.brideName, {
          label: "Bride",
          placeholder: "Enter her name",
        }),

        customizeField(FIELDS.groomName, {
          label: "Groom",
          placeholder: "Enter his name",
        }),
      ]),

      section("hero", "Invitation", "announcement", [
        customizeField(FIELDS.invitationTitle, {
          label: "Title of the Celebration",
          placeholder: "A celebration of love",
        }),

        customizeField(FIELDS.invitationMessage, {
          label: "Invitation",
          placeholder: "Write your invitation message",
        }),
      ]),
    ],
  },
};

/**
 * Resolve sections for a particular theme + editor page.
 *
 * Example:
 *
 * getThemeEditorSections("nuvo", "announcement")
 *
 * returns only Nuvo's:
 *   - Couple
 *   - Hero
 *
 * getThemeEditorSections("nuvo", "wedding-details")
 *
 * returns only:
 *   - Wedding Details
 */
export function getThemeEditorSections(themeKey: string, page: EditorPage): EditorSection[] {
  const theme = THEME_EDITOR_CONFIG[themeKey];

  return theme?.[page] ?? [];
}
