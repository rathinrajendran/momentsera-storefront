# Momentsera editor configuration — final

## Architecture

```text
momentsera-editor-config/
├── editor-schema.ts
├── field-catalog.ts
├── media-catalog.ts
├── theme-editor-config.ts
├── editor-resolver.ts
├── AnnouncementEditor.tsx
└── README.md
```

`theme-editor-config.ts` is the single source of truth for fields and section-owned media. `editor-resolver.ts` collects media directly from `section.media`; there is no separate `theme-media-config.ts`.

## Image description

Each media rule can have both:

- `description`: helper text/instructions shown to the editor.
- `descriptionKey`, `descriptionLabel`, `descriptionPlaceholder`, `descriptionRequired`: configuration for an editable image-description field.

The actual description is stored with the media item:

```ts
announcement.media.main.description
```

Replacing an image preserves the existing description.

## Example

```ts
media("main", {
  type: "image",
  label: "Main Couple Image",
  description: "Upload the main portrait photograph of the couple.",
  descriptionKey: "media.main.description",
  descriptionLabel: "Image Description",
  descriptionPlaceholder: "Describe this photograph...",
  required: true,
  width: 480,
  height: 770,
  aspectRatio: 480 / 770,
})
```

Media keys are open-ended, so every invitation can define its own image slots.

Display Order is also schema-driven through `FIELDS.coupleDisplayOrder()` and is not hard-coded into `AnnouncementEditor`.
