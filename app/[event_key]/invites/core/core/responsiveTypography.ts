export type TypographyRole = "heading" | "accent" | "body";

type ResponsiveTypographyConfig = {
  mobileScale: number;
  viewportScale: string;
};

export const RESPONSIVE_TYPOGRAPHY: Record<TypographyRole, ResponsiveTypographyConfig> = {
  heading: {
    mobileScale: 0.82,
    viewportScale: "2vw",
  },

  accent: {
    mobileScale: 0.78,
    viewportScale: "2vw",
  },

  body: {
    mobileScale: 0.92,
    viewportScale: "1.2vw",
  },
};

export function getResponsiveFontSize(size: number, role: TypographyRole): string {
  const config = RESPONSIVE_TYPOGRAPHY[role];

  const mobile = Math.round(size * config.mobileScale);

  return `clamp(${mobile}px, ${config.viewportScale}, ${size}px)`;
}
