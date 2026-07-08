"use client";
import { useRef } from "react";
import { resolveTheme } from "./resolveTheme";
import { normalizeThemeSettings } from "./normalizeThemeSettings";
export type ResolvedTheme = ReturnType<typeof resolveTheme>;
export type NormalizedSettings = ReturnType<typeof normalizeThemeSettings>;
export function useResolvedTheme(appearance: any) {
  const prevThemeRef = useRef<ResolvedTheme | null>(null);
  const prevSettingsRef = useRef<NormalizedSettings | null>(null);
  const normalized = normalizeThemeSettings(appearance);
  const isAccentOnlyChange =
    prevSettingsRef.current !== null &&
    prevSettingsRef.current.theme === normalized.theme &&
    prevSettingsRef.current.accentFont === normalized.accentFont &&
    prevSettingsRef.current.typographyFont === normalized.typographyFont &&
    prevSettingsRef.current.typographyColor === normalized.typographyColor &&
    prevSettingsRef.current.accentColor !== normalized.accentColor;
  let theme: ResolvedTheme;
  if (isAccentOnlyChange && prevThemeRef.current) {
    const next = resolveTheme(normalized);
    theme = {
      ...prevThemeRef.current,
      accent: next.accent,
      textTokens: { ...prevThemeRef.current.textTokens, accent: next.accent },
    };
  } else {
    theme = resolveTheme(normalized);
  }
  prevThemeRef.current = theme;
  prevSettingsRef.current = normalized;
  return theme;
}
