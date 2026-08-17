import type { CSSProperties } from "react";

export const THEME_TYPOGRAPHY = {
  heading: {
    fontFamily: "var(--font-heading-family, var(--font-heading, serif))",
    fontSize: "var(--font-heading-size, 28px)",
    fontWeight: "var(--font-heading-weight, 400)",
    letterSpacing: "var(--font-heading-spacing, 0em)",
    lineHeight: "var(--font-heading-line-height, 1.2)",
    textTransform: "var(--font-heading-transform, none)" as CSSProperties["textTransform"],
  },

  accent: {
    fontFamily: "var(--font-accent-family, var(--font-accent, cursive))",
    fontSize: "var(--font-accent-size, 35px)",
    fontWeight: "var(--font-accent-weight, 400)",
    letterSpacing: "var(--font-accent-spacing, 0em)",
    lineHeight: "var(--font-accent-line-height, 1.2)",
    textTransform: "var(--font-accent-transform, none)" as CSSProperties["textTransform"],
  },

  body: {
    fontFamily: "var(--font-body-family, var(--font-body, sans-serif))",
    fontSize: "var(--font-body-size, 16px)",
    fontWeight: "var(--font-body-weight, 400)",
    letterSpacing: "var(--font-body-spacing, 0em)",
    lineHeight: "var(--font-body-line-height, 1.5)",
    textTransform: "var(--font-body-transform, none)" as CSSProperties["textTransform"],
  },
} satisfies Record<string, CSSProperties>;

export function getThemeTypography() {
  return THEME_TYPOGRAPHY;
}
