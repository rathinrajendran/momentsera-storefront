import type { CSSProperties } from "react";

export const THEME_SHAPES = {
  radius: "var(--radius-theme, 10px)",
  borderWidth: "var(--shape-border-width, 0px)",
  borderStyle: "var(--shape-border-style, solid)",
  shadow: "var(--shape-shadow, none)",
  imageRadius: "var(--shape-image-radius, var(--radius-theme, 10px))",
} as const;

export function getShapeBorderStyle(): CSSProperties {
  return {
    borderWidth: THEME_SHAPES.borderWidth,
    borderStyle: THEME_SHAPES.borderStyle,
  };
}

export function getShapeCardStyle(): CSSProperties {
  return {
    ...getShapeBorderStyle(),
    boxShadow: THEME_SHAPES.shadow,
    borderRadius: THEME_SHAPES.radius,
  };
}
