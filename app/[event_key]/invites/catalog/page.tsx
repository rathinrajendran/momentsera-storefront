"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useResolvedTheme } from "../core/config/useResolvedTheme";
import { ThemeWrapper } from "../core/wrappers/ThemeWrapper";
// import Aura from "./aura/page";
// import Luna from "./luna/page";
// import Mira from "./mira/page";
// import Nexa from "./nexa/page";
// import Nuvo from "./nuvo/page";
// import Vibe from "./vibe/page";
// import Ziva from "./ziva/page";
import AudioPlayer from "../../../../components/ui/AudioPlayer";
import { getThemeRadius } from "../core/config/themeConfigs";
import { useRouter } from "next/navigation";
import Aurelia from "../../cards/Aurelia";
import EventCalendar from "../../../../components/ui/EventCalendar";
import { X } from "lucide-react";
import DesignedByFooter from "../../../editor/[event_key]/components/DesignedByFooter";
import { useUnlockedSections } from "../../../../hooks/useUnlockedSections";
import { PasswordDialog } from "../../../editor/[event_key]/components/publish/PasswordDialog";
import Sora from "./sora/page";

/* ─────────────────────────────────────────────
    TYPES
  ───────────────────────────────────────────── */

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
      THEME
    ───────────────────────────────────────────── */

  const inviteTheme = useResolvedTheme(theme);
  const inviteKey = data?.invite?.invite_key;

  /* ─────────────────────────────────────────────
      BACKGROUND
    ───────────────────────────────────────────── */

  const isImageBg = theme.background_type === "image" && !!theme.background_image;
  const overlayOpacity = (theme.background_overlay_opacity ?? 45) / 100;
  const bgOverlay = theme.theme_mode === "Navy & Gold" ? `rgba(0,0,0,${overlayOpacity})` : `rgba(255,255,255,${overlayOpacity})`;

  /* ─────────────────────────────────────────────
      THEME MAPPING
    ───────────────────────────────────────────── */
  const ThemeComponent = useMemo(() => {
    const map: Record<string, React.ComponentType<any>> = {
      // aura: Aura,
      // luna: Luna,
      // mira: Mira,
      // nexa: Nexa,
      // nuvo: Nuvo,
      sora: Sora,
      // vibe: Vibe,
      // ziva: Ziva,
    };

    return map[inviteKey] || Sora;
  }, [inviteKey]);

  /* ─────────────────────────────────────────────
      UI
    ───────────────────────────────────────────── */
  const router = useRouter();

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
      className={`invite-${data?.invite.invite_key}`}
      style={
        {
          /* PAGE BACKGROUND */
          background: isImageBg
            ? `
                  linear-gradient(
                    ${bgOverlay},
                    ${bgOverlay}
                  ),
                  url(${theme.background_image})
                  top center / 100% no-repeat
                `
            : inviteTheme.bg.page,
            backgroundSize:"cover",
          /* SECTION BACKGROUNDS */
          "--bg-page": isImageBg ? bgOverlay : inviteTheme.bg.page,
          "--bg-section-1": isImageBg ? bgOverlay : inviteTheme.bg.section1,
          "--bg-section-2": isImageBg ? bgOverlay : inviteTheme.bg.section2,
          "--bg-section-3": isImageBg ? bgOverlay : inviteTheme.bg.section3,
          /* SURFACES */
          "--surface": inviteTheme.surfaceTokens.card,
          "--surface-card": isImageBg ? `rgba(from ${inviteTheme.surfaceTokens.card} r g b / 0.82)` : inviteTheme.surfaceTokens.card,
          "--surface-overlay": inviteTheme.surfaceTokens.overlay,
          "--border": inviteTheme.surfaceTokens.border,
          /* TEXT */
          "--primary": inviteTheme.textTokens.primary,
          "--secondary": inviteTheme.textTokens.secondary,
          "--heading": inviteTheme.textTokens.heading,
          "--link": inviteTheme.textTokens.link,
          /* ACCENT */
          "--accent": inviteTheme.textTokens.accent,
          /* FONTS */
          "--font-accent": inviteTheme.accentFont,
          "--font-primary": inviteTheme.primaryFont,
          "--font-secondary": inviteTheme.secondaryFont,
          /* FONT SIZES */
          "--font-size-accent": `${theme.accent_font_size ?? 32}px`,
          "--font-size-primary": `${theme.typography_font_size ?? 16}px`,
          "--font-size-secondary": `${theme.typography_font_size ?? 16}px`,
          "--radius-theme": getThemeRadius(theme.border_radius),
        } as React.CSSProperties
      }
    >
      {print?.enable ? (
        // <Aurelia data={events} theme={theme} motion={motion} settings={settings} print={print} eventKey={eventKey} />
        <>testttt</>
      ) : (
        <ThemeComponent data={data} motion={motion} settings={settings} eventKey={eventKey} />
      )}
      {/* MUSIC */}
      {music.music && (
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
      {settings.show_calendar && primaryFunction && (
        <EventCalendar
          title={primaryFunction?.title || "Event"}
          startDate={primaryFunction?.startTime}
          location={primaryFunction?.locationName}
          isLive={isLive}
          audio={music.music}
        />
      )}
      <DesignedByFooter settings={settings} />
    </ThemeWrapper>
  );
}
