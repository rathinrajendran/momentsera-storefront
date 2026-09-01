"use client";
import React, { useMemo } from "react";
import { ThemeWrapper } from "../core/wrappers/ThemeWrapper";
import Luna from "./luna/page";
import Sora from "./sora/page";
import { getThemeRadius } from "../core/config/themeConfigs";
import EventCalendar from "../../../../components/ui/EventCalendar";
import DesignedByFooter from "../../../editor/[event_key]/components/DesignedByFooter";
import { useUnlockedSections } from "../../../../hooks/useUnlockedSections";
import { PasswordDialog } from "../../../editor/[event_key]/components/publish/PasswordDialog";
import Aura from "./aura/page";
import Nuvo from "./nuvo/page";
import Mira from "./mira/page";
import Vibe from "./vibe/page";
import Nexa from "./nexa/page";
import Ziva from "./nexa/page";
import Veda from "./veda/page";
import Heritage from "./heritage/page";
import Athel from "./athel/page";
import Zora from "./zora/page";
import Lumi from "./lumi/page";
import Alma from "./alma/page";
import Nora from "./nora/page";
import Remi from "./remi/page";
import Cleo from "./cleo/page";
import Milo from "./milo/page";
import Crescent from "./crescent/page";
import Iris from "./iris/page";

/* ─────────────────────────────────────────────
    HELPERS & TYPES
  ───────────────────────────────────────────── */

function normalizeHex(value: unknown, fallback: string): string {
  return typeof value === "string" && /^#[0-9A-Fa-f]{6}$/.test(value) ? value : fallback;
}

function getContrastColor(hex: string): string {
  const value = hex.replace("#", "");
  const r = Number.parseInt(value.slice(0, 2), 16);
  const g = Number.parseInt(value.slice(2, 4), 16);
  const b = Number.parseInt(value.slice(4, 6), 16);

  const toLinear = (channel: number) => {
    const normalized = channel / 255;
    return normalized <= 0.03928 ? normalized / 12.92 : Math.pow((normalized + 0.055) / 1.055, 2.4);
  };

  const luminance = 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);

  return luminance > 0.52 ? "#171717" : "#FFFFFF";
}

interface CatalogProps {
  data: any;
  design: any;
  settings: any;
  eventKey: string;
  isLive?: boolean;
}

/* ─────────────────────────────────────────────
    COMPONENT
  ───────────────────────────────────────────── */

export default function Catalog({ data, design, settings, eventKey, isLive = false }: CatalogProps) {
  /* ─────────────────────────────────────────────
      STATE
    ───────────────────────────────────────────── */
  const MAIN_ACCESS_KEY = "__invite__";
  const { unlockedSections, setUnlockedSections } = useUnlockedSections(eventKey);
  const inviteProtected = settings?.privacy === "protected";
  const invitePassword = settings?.password ?? "";
  const inviteUnlocked = unlockedSections.includes(MAIN_ACCESS_KEY);
  const showInvitePassword = inviteProtected && invitePassword && !inviteUnlocked;

  /* ─────────────────────────────────────────────
      THEME & COLORS
    ───────────────────────────────────────────── */
  const primaryColor = normalizeHex(design?.color?.primary, "#FFFDF9");
  const secondaryColor = normalizeHex(design?.color?.secondary, "#F8E8EC");
  const accentColor = normalizeHex(design?.color?.accent, "#E7A1B0");

  // Prefer custom text colors from the theme editor, falling back to auto contrast
  const textPrimary = design?.color?.text_primary
    ? normalizeHex(design?.color.text_primary, getContrastColor(primaryColor))
    : getContrastColor(primaryColor);

  const textSecondary = design?.color?.text_secondary
    ? normalizeHex(design?.color.text_secondary, getContrastColor(secondaryColor))
    : getContrastColor(secondaryColor);

  const textAccent = getContrastColor(accentColor);

  const backgroundColors = {
    primary: primaryColor,
    secondary: secondaryColor,
    accent: accentColor,
  };

  const textColors = {
    primary: textPrimary,
    secondary: textSecondary,
    accent: textAccent,
  };

  /* ─────────────────────────────────────────────
      TYPOGRAPHY
    ───────────────────────────────────────────── */

  const typography = {
    headingFont: design?.font?.heading_font ?? "Bodoni Moda",
    accentFont: design?.font?.accent_font ?? "Parisienne",
    bodyFont: design?.font?.body_font ?? "DM Sans",

    headingSize: design?.font?.heading_font_size ?? 28,
    accentSize: design?.font?.accent_font_size ?? 35,
    bodySize: design?.font?.body_font_size ?? 16,

    headingWeight: design?.font?.heading_font_weight ?? "400",
    accentWeight: design?.font?.accent_font_weight ?? "400",
    bodyWeight: design?.font?.body_font_weight ?? "400",

    headingSpacing: design?.font?.heading_letter_spacing ?? "0em",
    accentSpacing: design?.font?.accent_letter_spacing ?? "0em",
    bodySpacing: design?.font?.body_letter_spacing ?? "0em",

    headingLineHeight: design?.font?.heading_line_height ?? "1.2",
    accentLineHeight: design?.font?.accent_line_height ?? "1.2",
    bodyLineHeight: design?.font?.body_line_height ?? "1.5",

    headingTransform: design?.font?.heading_text_transform ?? "none",
    accentTransform: design?.font?.accent_text_transform ?? "none",
    bodyTransform: design?.font?.body_text_transform ?? "none",
  };

  /* ─────────────────────────────────────────────
      BACKGROUND SETTINGS
    ───────────────────────────────────────────── */

  const backgroundSettings = {
    type: design?.color?.background_type ?? "solid",
    image: design?.color?.background_image ?? "",
    overlayOpacity: design?.color?.background_type === "solid" ? 0 : (design?.color?.background_overlay_opacity ?? 45),
    position: design?.color?.background_position ?? "center",
    size: design?.color?.background_size ?? "cover",
    repeat: design?.color?.background_repeat ?? "repeat",
  };

  const inviteKey = data?.invite?.invite_key;

  /* ─────────────────────────────────────────────
      THEME MAPPING
    ───────────────────────────────────────────── */
  const ThemeComponent = useMemo(() => {
    const map: Record<string, React.ComponentType<any>> = {
      luna: Luna,
      sora: Sora,
      aura: Aura,
      nuvo: Nuvo,
      mira: Mira,
      vibe: Vibe,
      nexa: Nexa,
      ziva: Ziva,
      veda: Veda,
      zora: Zora,
      athel: Athel,
      lumi: Lumi,
      alma: Alma,
      nora: Nora,
      remi: Remi,
      cleo: Cleo,
      milo: Milo,
      crescent: Crescent,
      iris: Iris,
      heritage: Heritage,
    };

    return map[inviteKey] || Sora;
  }, [inviteKey]);

  /* Primary function */
  const primaryFunction = data?.schedule?.functions?.find((fn: any) => fn?.isPrimary) ?? data?.schedule?.functions?.[0];

  if (showInvitePassword) {
    return (
      <PasswordDialog
        open
        title={data?.invite?.title || "Wedding Invitation"}
        password={invitePassword}
        onClose={() => {}}
        onSuccess={() => {
          setUnlockedSections((prev) => (prev.includes(MAIN_ACCESS_KEY) ? prev : [...prev, MAIN_ACCESS_KEY]));
        }}
      />
    );
  }

  return (
    <ThemeWrapper
      className={`invite-${data?.invite?.invite_key}`}
      style={
        {
          /* ================================================================
           * PRIMARY PAGE BACKGROUND
           * ================================================================ */
          backgroundColor: backgroundColors.primary,

          /* ================================================================
           * BACKGROUND COLOR TOKENS
           * ================================================================ */
          "--bg-primary": backgroundColors.primary,
          "--bg-secondary": backgroundColors.secondary,
          "--bg-accent": backgroundColors.accent,
          "--color-primary": primaryColor,
          "--color-secondary": secondaryColor,
          "--color-accent": accentColor,

          /* Section Aliases */
          "--bg-page": backgroundColors.primary,
          "--bg-section-1": backgroundColors.secondary,
          "--bg-section-2": backgroundColors.accent,
          "--bg-section-3": backgroundColors.secondary,

          /* ================================================================
           * SURFACE TOKENS
           * ================================================================ */
          "--surface": backgroundColors.secondary,
          "--surface-card": backgroundColors.secondary,
          "--surface-secondary": backgroundColors.secondary,
          "--surface-accent": backgroundColors.accent,
          "--surface-overlay": "rgba(255, 255, 255, 0.72)",
          "--border": "rgba(47, 42, 38, 0.12)",

          /* ================================================================
           * TEXT COLOR TOKENS
           * ================================================================ */
          "--text-primary": textColors.primary,
          "--text-secondary": textColors.secondary,
          "--text-accent": textColors.accent,

          /* Font Aliases */
          "--primary": textColors.primary,
          "--secondary": textColors.secondary,
          "--heading": textColors.primary,
          "--link": textColors.accent,
          "--accent": accentColor,
          "--accent-text": textColors.accent,

          /* ================================================================
           * TYPOGRAPHY
           * ================================================================ */
          "--font-heading": typography.headingFont,
          "--font-accent": typography.accentFont,
          "--font-body": typography.bodyFont,

          "--font-primary": typography.headingFont,
          "--font-secondary": typography.bodyFont,

          "--font-size-heading": `${typography.headingSize}px`,
          "--font-size-accent": `${typography.accentSize}px`,
          "--font-size-body": `${typography.bodySize}px`,

          "--font-size-primary": `${typography.bodySize}px`,
          "--font-size-secondary": `${typography.bodySize}px`,

          "--font-weight-heading": typography.headingWeight,
          "--font-weight-accent": typography.accentWeight,
          "--font-weight-body": typography.bodyWeight,

          "--letter-spacing-heading": typography.headingSpacing,
          "--letter-spacing-accent": typography.accentSpacing,
          "--letter-spacing-body": typography.bodySpacing,

          "--line-height-heading": typography.headingLineHeight,
          "--line-height-accent": typography.accentLineHeight,
          "--line-height-body": typography.bodyLineHeight,

          "--text-transform-heading": typography.headingTransform,
          "--text-transform-accent": typography.accentTransform,
          "--text-transform-body": typography.bodyTransform,

          /* Typography role aliases used by theme components */
          "--font-heading-family": typography.headingFont,
          "--font-accent-family": typography.accentFont,
          "--font-body-family": typography.bodyFont,
          "--font-heading-size": `${typography.headingSize}px`,
          "--font-accent-size": `${typography.accentSize}px`,
          "--font-body-size": `${typography.bodySize}px`,
          "--font-heading-weight": typography.headingWeight,
          "--font-accent-weight": typography.accentWeight,
          "--font-body-weight": typography.bodyWeight,
          "--font-heading-spacing": typography.headingSpacing,
          "--font-accent-spacing": typography.accentSpacing,
          "--font-body-spacing": typography.bodySpacing,
          "--font-heading-line-height": typography.headingLineHeight,
          "--font-accent-line-height": typography.accentLineHeight,
          "--font-body-line-height": typography.bodyLineHeight,
          "--font-heading-transform": typography.headingTransform,
          "--font-accent-transform": typography.accentTransform,
          "--font-body-transform": typography.bodyTransform,

          /* ================================================================
           * BACKGROUND SETTINGS & IMAGE TOKENS
           * ================================================================ */
          "--background-type": backgroundSettings.type,
          "--bg-image": backgroundSettings.image ? `url("${backgroundSettings.image}")` : "none",
          "--bg-overlay-opacity": `${backgroundSettings.overlayOpacity / 100}`,
          "--bg-position": backgroundSettings.position,
          "--bg-size": backgroundSettings.size,
          "--bg-repeat": backgroundSettings.repeat,

          /* ================================================================
           * SHAPE SYSTEM
           * ================================================================ */
          "--radius-theme": getThemeRadius(design?.shape?.border_radius ?? "soft"),

          "--shape-border-width":
            design?.shape?.border_width === "thin"
              ? "1px"
              : design?.shape?.border_width === "medium"
                ? "2px"
                : design?.shape?.border_width === "thick"
                  ? "3px"
                  : "0px",

          "--shape-border-style":
            design?.shape?.border_style === "dashed"
              ? "dashed"
              : design?.shape?.border_style === "dotted"
                ? "dotted"
                : design?.shape?.border_style === "double"
                  ? "double"
                  : "solid",

          "--shape-shadow":
            design?.shape?.shadow === "soft"
              ? "0 4px 14px rgba(20, 20, 20, 0.08)"
              : design?.shape?.shadow === "medium"
                ? "0 10px 28px rgba(20, 20, 20, 0.12)"
                : design?.shape?.shadow === "floating"
                  ? "0 18px 42px rgba(20, 20, 20, 0.16)"
                  : "none",

          "--shape-image-radius":
            design?.shape?.image_shape === "rectangle"
              ? "0px"
              : design?.shape?.image_shape === "rounded"
                ? "12px"
                : design?.shape?.image_shape === "circle"
                  ? "9999px"
                  : design?.shape?.image_shape === "arch"
                    ? "9999px 9999px 0 0"
                    : "var(--radius-theme)",

          /* ================================================================
           * ANIMATION SETTINGS
           * ================================================================ */
          "--animation-enabled": design?.motion?.animations === false ? "0" : "1",
          "--animation-style": design?.motion?.animation_style ?? "smooth",
          "--animation-entry": design?.motion?.animation_entry ?? "fade-up",
          "--animation-scroll": design?.motion?.scroll_behavior ?? "on-scroll",
          "--animation-duration": design?.motion?.animation_duration ?? "1s",
          "--animation-delay": design?.motion?.animation_delay ?? "0ms",
          "--animation-speed": `${design?.motion?.animation_speed ?? 50}`,
          "--animation-loop": design?.motion?.animation_loop ? "1" : "0",
        } as React.CSSProperties
      }
    >
      {settings?.print?.enable ? <>testttt</> : <ThemeComponent data={data} design={design} settings={settings} eventKey={eventKey} />}

      {/* CALENDAR */}
      {settings?.show_calendar && primaryFunction && (
        <EventCalendar
          title={primaryFunction?.title || "Event"}
          startDate={primaryFunction?.startTime}
          location={primaryFunction?.locationName}
          isLive={isLive}
          audio={data?.music?.music}
        />
      )}

      <DesignedByFooter settings={settings} />
    </ThemeWrapper>
  );
}
