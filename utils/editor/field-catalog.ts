import { field, type EditorField } from "./editor-schema";

/**
 * Shared semantic field definitions.
 *
 * IMPORTANT:
 * These are defaults only. A theme can override label, placeholder,
 * required state, default value, or even use a completely different
 * field id/path when its design/content is genuinely different.
 */
export const FIELDS = {
  groomName: () =>
    field("groomName", "groom.name", "text", {
      label: "Groom Name",
      required: true,
      placeholder: "Enter groom name",
    }),

  brideName: () =>
    field("brideName", "bride.name", "text", {
      label: "Bride Name",
      required: true,
      placeholder: "Enter bride name",
    }),

  groomDetails: () =>
    field("groomDetails", "groom.details", "textarea", {
      label: "Groom Details",
      placeholder: "Enter groom details",
    }),

  brideDetails: () =>
    field("brideDetails", "bride.details", "textarea", {
      label: "Bride Details",
      placeholder: "Enter bride details",
    }),

  familyLabel: () =>
    field("familyLabel", "couple.familyLabel", "text", {
      label: "Family Invitation Label",
      placeholder: "Together with their families",
    }),

  monogram: () =>
    field("monogram", "couple.monogram", "text", {
      label: "Couple Monogram",
      placeholder: "A | E",
    }),

  coupleDisplayOrder: () =>
    field("coupleDisplayOrder", "couple.displayOrder", "radio", {
      label: "Display Order",
      defaultValue: "bride-first",
      options: [
        {
          label: "Bride & Groom",
          value: "bride-first",
        },
        {
          label: "Groom & Bride",
          value: "groom-first",
        },
      ],
    }),

  invitationTitle: () =>
    field("invitationTitle", "announcement.title", "text", {
      label: "Invitation Title",
      placeholder: "We're getting married",
    }),

  invitationMessage: () =>
    field("invitationMessage", "announcement.message", "textarea", {
      label: "Invitation Message",
      placeholder:
        "We are getting married and would love to celebrate this new chapter with you.",
    }),

  eventTitle: () =>
    field("eventTitle", "primaryFunction.title", "text", {
      label: "Wedding Event",
      placeholder: "Wedding Ceremony",
    }),

  heroImage: () =>
    field("heroImage", "heroImage", "image", {
      label: "Hero Image",
    }),
} satisfies Record<string, () => EditorField>;

/**
 * Clone + override a shared field for a particular invitation.
 * This is the key to supporting different labels/placeholders without
 * duplicating the whole field definition.
 */
export function customizeField(
  create: () => EditorField,
  overrides: Partial<Omit<EditorField, "id" | "key" | "type">> = {},
): EditorField {
  return {
    ...create(),
    ...overrides,
  };
}
