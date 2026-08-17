import { THEME_EDITOR_CONFIG } from "./theme-editor-config";
import type { EditorPage, EditorSection, EditorMediaRule } from "./editor-schema";

/** Single source of truth: theme-editor-config owns fields and section media. */
export function getThemeEditorSections(themeKey: string, page: EditorPage): EditorSection[] {
  return THEME_EDITOR_CONFIG[themeKey]?.[page] ?? [];
}

export function hasThemeEditorPage(themeKey: string, page: EditorPage): boolean {
  return getThemeEditorSections(themeKey, page).length > 0;
}

/** Collect all media declared by sections on the requested editor page. */
export function getThemeEditorMedia(themeKey: string, page: EditorPage): EditorMediaRule[] {
  return getThemeEditorSections(themeKey, page).flatMap((section) => section.media ?? []);
}

export function hasThemeEditorMedia(themeKey: string, page: EditorPage): boolean {
  return getThemeEditorMedia(themeKey, page).length > 0;
}
