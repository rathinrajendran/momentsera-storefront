"use client";
import React, { useMemo } from "react";
import { ThemeWrapper } from "../core/wrappers/ThemeWrapper";
import Luna from "./luna/page";
import Sora from "./sora/page";
import AudioPlayer from "../../../../components/ui/AudioPlayer";
import { getThemeRadius } from "../core/config/themeConfigs";
import EventCalendar from "../../../../components/ui/EventCalendar";
import DesignedByFooter from "../../../editor/[event_key]/components/DesignedByFooter";
import { useUnlockedSections } from "../../../../hooks/useUnlockedSections";
import { PasswordDialog } from "../../../editor/[event_key]/components/publish/PasswordDialog";

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
  settings: any;
  music: any;
  theme: any;
  motion: any;
  sharing: any;
  privacy: any;
  print: any;
  eventKey: string;
  isLive?: boolean;
}

/* ─────────────────────────────────────────────
    COMPONENT
  ───────────────────────────────────────────── */

export default function Catalog({ data, theme, music, motion, sharing, privacy, print, settings, eventKey, isLive = false }: CatalogProps) {
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
  const primaryColor = normalizeHex(theme?.primary, "#FFFDF9");
  const secondaryColor = normalizeHex(theme?.secondary, "#F8E8EC");
  const accentColor = normalizeHex(theme?.accent, "#E7A1B0");

  // Prefer custom text colors from the theme editor, falling back to auto contrast
  const textPrimary = theme?.text_primary
    ? normalizeHex(theme.text_primary, getContrastColor(primaryColor))
    : getContrastColor(primaryColor);

  const textSecondary = theme?.text_secondary
    ? normalizeHex(theme.text_secondary, getContrastColor(secondaryColor))
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
    headingFont: theme?.heading_font ?? "Bodoni Moda",
    accentFont: theme?.accent_font ?? "Parisienne",
    bodyFont: theme?.body_font ?? "DM Sans",

    headingSize: theme?.heading_font_size ?? 28,
    accentSize: theme?.accent_font_size ?? 35,
    bodySize: theme?.body_font_size ?? 16,

    headingWeight: theme?.heading_font_weight ?? "400",
    accentWeight: theme?.accent_font_weight ?? "400",
    bodyWeight: theme?.body_font_weight ?? "400",

    headingSpacing: theme?.heading_letter_spacing ?? "0em",
    accentSpacing: theme?.accent_letter_spacing ?? "0em",
    bodySpacing: theme?.body_letter_spacing ?? "0em",

    headingTransform: theme?.heading_text_transform ?? "none",
    accentTransform: theme?.accent_text_transform ?? "none",
    bodyTransform: theme?.body_text_transform ?? "none",
  };

  /* ─────────────────────────────────────────────
      BACKGROUND SETTINGS
    ───────────────────────────────────────────── */

  const backgroundSettings = {
    type: theme?.background_type ?? "solid",
    image: theme?.background_image ?? "",
    overlayOpacity: theme?.background_type === "solid" ? 0:  theme?.background_overlay_opacity ?? 45,
    position: theme?.background_position ?? "center",
    size: theme?.background_size ?? "cover",
    texture: theme?.texture ?? "none",
    effect: theme?.background_effect ?? "none",
    blur: theme?.background_blur ?? 0,
    brightness: theme?.background_brightness ?? 100,
    contrast: theme?.background_contrast ?? 100,
  };

  const inviteKey = data?.invite?.invite_key;

  /* ─────────────────────────────────────────────
      THEME MAPPING
    ───────────────────────────────────────────── */
  const ThemeComponent = useMemo(() => {
    const map: Record<string, React.ComponentType<any>> = {
      luna: Luna,
      sora: Sora,
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

          "--text-transform-heading": typography.headingTransform,
          "--text-transform-accent": typography.accentTransform,
          "--text-transform-body": typography.bodyTransform,

          /* ================================================================
           * BACKGROUND SETTINGS & IMAGE TOKENS
           * ================================================================ */
          "--background-type": backgroundSettings.type,
          "--bg-image": backgroundSettings.image ? `url("${backgroundSettings.image}")` : "none",
          "--bg-overlay-opacity": `${backgroundSettings.overlayOpacity / 100}`,
          "--bg-position": backgroundSettings.position,
          "--bg-size": backgroundSettings.size,
          "--background-texture": backgroundSettings.texture,
          "--background-effect": backgroundSettings.effect,
          "--background-blur": `${backgroundSettings.blur}px`,
          "--background-brightness": backgroundSettings.brightness,
          "--background-contrast": backgroundSettings.contrast,

          /* ================================================================
           * BORDER RADIUS
           * ================================================================ */
          "--radius-theme": getThemeRadius(theme?.border_radius ?? "soft"),
        } as React.CSSProperties
      }
    >
      {print?.enable ? <>testttt</> : <ThemeComponent data={data} theme={theme} motion={motion} settings={settings} eventKey={eventKey} />}

      {/* MUSIC */}
      {music?.music && (
        <AudioPlayer
          src={music.background_audio}
          autoplay={music.autoplay_music}
          allowMute={music.allow_mute}
          isLive={isLive}
          loop={music.loop_music}
          fadeIn={music.fade_in}
          fadeOut={music.fade_out}
          volume={music.volume_level}
        />
      )}

      {/* CALENDAR */}
      {settings?.show_calendar && primaryFunction && (
        <EventCalendar
          title={primaryFunction?.title || "Event"}
          startDate={primaryFunction?.startTime}
          location={primaryFunction?.locationName}
          isLive={isLive}
          audio={music?.music}
        />
      )}

      <DesignedByFooter settings={settings} />
    </ThemeWrapper>
  );
}
