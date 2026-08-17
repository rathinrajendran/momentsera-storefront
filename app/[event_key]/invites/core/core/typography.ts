import { getResponsiveFontSize, TypographyRole } from "./responsiveTypography";

export type TypographyTheme = {
  heading_font?: string;
  heading_font_size?: number;
  heading_font_weight?: string;
  heading_letter_spacing?: string;
  heading_line_height?: string;
  heading_text_transform?: string;

  accent_font?: string;
  accent_font_size?: number;
  accent_font_weight?: string;
  accent_letter_spacing?: string;
  accent_line_height?: string;
  accent_text_transform?: string;

  body_font?: string;
  body_font_size?: number;
  body_font_weight?: string;
  body_letter_spacing?: string;
  body_line_height?: string;
  body_text_transform?: string;
};

export function getTypographyStyles(theme: TypographyTheme): Record<TypographyRole, React.CSSProperties> {
  const headingSize = Number(theme.heading_font_size ?? 28);
  const accentSize = Number(theme.accent_font_size ?? 24);
  const bodySize = Number(theme.body_font_size ?? 16);

  return {
    heading: {
      fontFamily: "var(--font-heading-family, var(--font-heading, serif))",
      fontSize: getResponsiveFontSize(headingSize, "heading"),
      fontWeight: theme.heading_font_weight ?? "400",
      letterSpacing: theme.heading_letter_spacing ?? "0em",
      lineHeight: theme.heading_line_height ?? "1.2",
      textTransform: theme.heading_text_transform ?? "none",
    },

    accent: {
      fontFamily: "var(--font-accent-family, var(--font-accent, cursive))",
      fontSize: getResponsiveFontSize(accentSize, "accent"),
      fontWeight: theme.accent_font_weight ?? "400",
      letterSpacing: theme.accent_letter_spacing ?? "0em",
      lineHeight: theme.accent_line_height ?? "1.2",
      textTransform: theme.accent_text_transform ?? "none",
    },

    body: {
      fontFamily: "var(--font-body-family, var(--font-body, sans-serif))",
      fontSize: getResponsiveFontSize(bodySize, "body"),
      fontWeight: theme.body_font_weight ?? "400",
      letterSpacing: theme.body_letter_spacing ?? "0em",
      lineHeight: theme.body_line_height ?? "1.2",
      textTransform: theme.body_text_transform ?? "none",
    },
  };
}
