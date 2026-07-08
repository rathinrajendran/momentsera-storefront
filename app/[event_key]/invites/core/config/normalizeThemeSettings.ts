import {
  ThemeKey,
  AccentKey,
  AccentFontKey,
  TypographyFontKey,
  TypographyColorKey,
  ACCENT_COLORS,
  ACCENT_FONTS,
  TYPOGRAPHY_FONTS,
  TYPOGRAPHY_COLORS,
  THEMES,
} from "./themeConfigs";

export function normalizeThemeSettings(appearance: any): {
  theme?: ThemeKey;
  accentColor?: AccentKey;
  accentFont?: AccentFontKey;
  typographyFont?: TypographyFontKey;
  typographyColor?: TypographyColorKey;
} {
  return {
    theme: appearance.theme_mode in THEMES ? appearance.theme_mode : "Rose & Cream",
    accentColor: appearance.accent_color in ACCENT_COLORS ? appearance.accent_color : "sage",
    accentFont: appearance.accent_font in ACCENT_FONTS ? appearance.accent_font : "Pinyon Script",
    typographyFont: appearance.typography_font in TYPOGRAPHY_FONTS ? appearance.typography_font : "Pinyon Script",
    typographyColor: appearance.typography_color in TYPOGRAPHY_COLORS ? appearance.typography_color : "Rose & Cream",
  };
}
