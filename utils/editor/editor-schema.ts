export type EditorPage =
  "announcement" | "wedding-details" | "story" | "functions" | "gallery" | "dress-code" | "music" | "wishes" | "rsvp";

export type EditorFieldType = "text" | "textarea" | "radio" | "date" | "time" | "image" | "image-list" | "audio" | "color-list";

export type EditorOption = {
  label: string;
  value: string;
};

export type EditorField = {
  /** Stable semantic id. Never use the UI label as an id. */
  id: string;

  /** Path into the announcement/event data object. */
  key: string;

  type: EditorFieldType;
  label: string;
  placeholder?: string;
  required?: boolean;
  defaultValue?: string;
  options?: EditorOption[];
};

export type EditorGroup = {
  key: string;
  label: string;
  type: "group";
  fields: EditorField[];
};

export type EditorRepeater = {
  key: string;
  label: string;
  type: "repeater";
  itemLabel?: string;
  fields: EditorField[];
};

/**
 * Media keys are intentionally open-ended.
 * Different invitations can use different image keys.
 */
export type EditorMediaKey = string;
export type AnnouncementImageKey = EditorMediaKey;

export type EditorMediaRule = {
  key: EditorMediaKey;
  type: "image";

  /** Label displayed above the upload control. */
  label: string;

  /** Helper/instruction shown to the editor. */
  description?: string;

  /** Enables an editable description field for the uploaded image. */
  descriptionKey?: string;
  descriptionLabel?: string;
  descriptionPlaceholder?: string;
  descriptionRequired?: boolean;

  required?: boolean;
  width: number;
  height: number;
  aspectRatio: number;
};

export type EditorSection = {
  key: string;
  label: string;
  type: "section";
  editorPage: EditorPage;

  fields: (EditorField | EditorGroup | EditorRepeater)[];

  /**
   * Optional media belonging to this section.
   * Example: Couple -> couple image, Hero -> hero image.
   */
  media?: EditorMediaRule[];
};

export type ThemeEditorConfig = Partial<Record<EditorPage, EditorSection[]>>;

export type ThemeEditorRegistry = Record<string, ThemeEditorConfig>;


/**
 * Creates a normal editor field.
 *
 * `label` is intentionally required. Every rendered editor field
 * must have a label, so the options argument cannot default to `{}`.
 */
export function field(id: string, key: string, type: EditorFieldType, options: Omit<EditorField, "id" | "key" | "type">): EditorField {
  return {
    id,
    key,
    type,
    ...options,
  };
}

/**
 * Creates an editor section.
 *
 * `key` -> EditorSection.key
 * `page` -> EditorSection.editorPage
 */
export function section(
  key: string,
  label: string,
  page: EditorPage,
  fields: (EditorField | EditorGroup | EditorRepeater)[],
  options: {
    media?: EditorMediaRule[];
  } = {},
): EditorSection {
  return {
    key,
    label,
    type: "section",
    editorPage: page,
    fields,
    ...(options.media ? { media: options.media } : {}),
  };
}

export function group(key: string, label: string, fields: EditorField[]): EditorGroup {
  return {
    key,
    label,
    type: "group",
    fields,
  };
}

export function repeater(key: string, label: string, fields: EditorField[], itemLabel?: string): EditorRepeater {
  return {
    key,
    label,
    type: "repeater",
    itemLabel,
    fields,
  };
}

/**
 * Convenience helper for image/media definitions.
 */
export function media(key: EditorMediaKey, options: Omit<EditorMediaRule, "key">): EditorMediaRule {
  return {
    key,
    ...options,
  };
}
