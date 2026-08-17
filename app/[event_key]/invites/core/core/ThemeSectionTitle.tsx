"use client";

import type { ReactNode } from "react";
import type { CSSProperties } from "react";

import { THEME_COLORS } from "./themeColors";
import { THEME_SHAPES } from "./themeShapes";
import { THEME_TYPOGRAPHY } from "./themeTypography";

type ThemeDecoration = "none" | "sparkle" | "floral" | "dots" | "lines";

type ThemeSectionTitleProps = {
  children: ReactNode;
  dark?: boolean;
  decoration?: ThemeDecoration;
};

const DECORATION_SYMBOLS: Record<ThemeDecoration, string> = {
  none: "",
  sparkle: "✦",
  floral: "❧",
  dots: "•",
  lines: "◇",
};

export function ThemeSectionTitle({ children, dark = false, decoration = "none" }: ThemeSectionTitleProps) {
  const symbol = DECORATION_SYMBOLS[decoration];

  return (
    <div className="mb-8 text-center">
      <h2
        className="text-[21px] tracking-[0.08em] md:text-[28px]"
        style={{
          ...THEME_TYPOGRAPHY.heading,
          color: dark ? THEME_COLORS.paper : THEME_COLORS.text,
          textTransform:THEME_TYPOGRAPHY.heading.textTransform
        }}
      >
        {children}
      </h2>

      <div
        className="mt-2 flex items-center justify-center gap-2"
        style={{
          color: THEME_COLORS.gold,
        }}
      >
        <span
          className="w-7"
          style={{
            borderTopColor: "currentColor",
          }}
        />

        {symbol && <span className="text-[12px]">{symbol}</span>}

        <span
          className="w-7"
          style={{
            borderTopColor: "currentColor",
          }}
        />
      </div>
    </div>
  );
}
