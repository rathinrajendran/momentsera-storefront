import {
  THEMES,
  ACCENT_COLORS,
  ACCENT_FONTS,
  TYPOGRAPHY_FONTS,
  TYPOGRAPHY_COLORS,
  normalizeAccent,
  ThemeKey,
  AccentKey,
  AccentFontKey,
  TypographyFontKey,
  TypographyColorKey,
} from "./themeConfigs";
export function resolveTheme(appearance: {
  theme?: ThemeKey;
  accentColor?: AccentKey;
  accentFont?: AccentFontKey;
  typographyFont?: TypographyFontKey;
  typographyColor?: TypographyColorKey;
}) {
  /* =====================================================     SAFE THEME  ===================================================== */
  const safeThemeKey: ThemeKey = appearance.theme && appearance.theme in THEMES ? appearance.theme : "Rose & Cream";
  /* =====================================================     SAFE FONTS  ===================================================== */
  const safeAccentFontKey: AccentFontKey =
    appearance.accentFont && appearance.accentFont in ACCENT_FONTS ? appearance.accentFont : "Pinyon Script";
  const safeTypographyFontKey: TypographyFontKey =
    appearance.typographyFont && appearance.typographyFont in TYPOGRAPHY_FONTS ? appearance.typographyFont : "Playfair Display";
  /* =====================================================     SAFE TEXT COLORS  ===================================================== */
  const safeTypographyColorKey: TypographyColorKey =
    appearance.typographyColor && appearance.typographyColor in TYPOGRAPHY_COLORS ? appearance.typographyColor : "Rose & Cream";
  /* =====================================================     SAFE ACCENT  ===================================================== */
  const safeAccentKey = normalizeAccent(safeThemeKey, appearance.accentColor ?? "sage");
  /* =====================================================     RESOLVE  ===================================================== */
  const theme = THEMES[safeThemeKey];
  const accent = ACCENT_COLORS[safeAccentKey];
  const accentFonts = ACCENT_FONTS[safeAccentFontKey];
  const typographyFonts = TYPOGRAPHY_FONTS[safeTypographyFontKey];
  const typographyColor = TYPOGRAPHY_COLORS[safeTypographyColorKey];
  /* =====================================================     RETURN  ===================================================== */ return {
    bg: theme.bg,
    surfaceTokens: theme.surfaceTokens,
    textTokens: {
      primary: typographyColor.primary,
      secondary: typographyColor.secondary,
      heading: typographyColor.heading,
      link: typographyColor.link,
      accent,
    },
    accent,
    accentFont: accentFonts.accent,
    primaryFont: typographyFonts.primary,
    secondaryFont: typographyFonts.secondary,
  };
}
