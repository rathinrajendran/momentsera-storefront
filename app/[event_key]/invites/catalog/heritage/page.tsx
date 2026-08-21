"use client";

import { useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { motion } from "framer-motion";
import { useThemeAnimation } from "../../../../../hooks/useThemeAnimations";
import { useInviteData } from "../../../../../hooks/useInviteData";
import { getAnimationKey } from "../../../../../utils/animation";
import WeddingCalendar from "../../../../../components/ui/WeddingCalendar";
import GallerySection from "../components/common/GallerySection";
import { getSectionConfig } from "../../../../../utils/section-visibility";
import { useUnlockedSections } from "../../../../../hooks/useUnlockedSections";
import { THEME_COLORS } from "../../core/core/themeColors";
import { getShapeBorderStyle, THEME_SHAPES, getShapeCardStyle } from "../../core/core/themeShapes";
import { ThemeIcon, type ThemeIconName } from "../../core/core/themeIcons";
import { THEME_TYPOGRAPHY } from "../../core/core/themeTypography";
import AudioPlayer from "../../../../../components/ui/AudioPlayer";
import WishesSection from "../components/common/WishesSection";

interface HeritageProps {
  data: any;
  eventKey: string;
  motionData: any;
  settings: any;
  theme?: any;
  music?: any;
}

const FREE_IMAGES = {
  palace: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1200&q=85",
  wedding: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85",
  flowers: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=900&q=85",
};

function HeritageFrame() {
  return (
    <div className="pointer-events-none absolute inset-3 rounded-[24px] border border-[rgba(184,134,11,.35)] md:inset-5">
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[var(--heritage-paper)] px-3 text-[16px] text-[var(--heritage-gold)]">
        ✦
      </div>
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[var(--heritage-paper)] px-3 text-[16px] text-[var(--heritage-gold)]">
        ✦
      </div>
    </div>
  );
}

function PeacockMark() {
  return (
    <svg viewBox="0 0 120 70" className="h-12 w-24" aria-hidden="true">
      <path
        d="M60 62C42 50 35 35 39 20c3-11 13-17 21-14 8 3 11 13 7 22-3 7-10 11-16 9 8 9 15 17 9 25Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M60 61C73 46 80 31 76 17c-3-10-12-15-20-11" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="51" cy="21" r="3" fill="currentColor" />
      <circle cx="70" cy="20" r="3" fill="currentColor" />
      <path d="M60 9V1M51 13l-6-6M69 13l6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function Heritage({ data, eventKey, motionData, settings, music }: HeritageProps) {
  const lunaData = useInviteData(data);
  const { getMotionProps } = useThemeAnimation(design?.motion);
  const animationKey = useMemo(() => getAnimationKey(design?.motion), [design?.motion]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [rsvp, setRsvp] = useState<"yes" | "no" | null>(null);
  const wishesContainerRef = useRef<HTMLElement | null>(null);
  const [wishRefreshKey, setWishRefreshKey] = useState(0);

  const firstName = lunaData.firstName || lunaData.brideName || "";
  const secondName = lunaData.secondName || lunaData.groomName || "";
  const heroImage = lunaData.heroImage || FREE_IMAGES.wedding;

  const gallery = getSectionConfig(settings?.section_visibility, "gallery");
  const wishes = getSectionConfig(settings?.section_visibility, "wishes");
  const { unlockedSections, setUnlockedSections } = useUnlockedSections(eventKey);

  const functions = Array.isArray(lunaData.eventFunctions) ? lunaData.eventFunctions : [];
  const primaryFunction = lunaData.primaryFunction || functions[0];

  const primaryDate = primaryFunction?.startTime
    ? new Date(primaryFunction.startTime)
    : primaryFunction?.date
      ? new Date(primaryFunction.date)
      : null;

  const primaryDay = primaryDate ? primaryDate.toLocaleDateString("en-IN", { weekday: "long" }) : "";
  const primaryDateLabel = primaryDate
    ? primaryDate.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "";
  const primaryTime = primaryDate
    ? primaryDate.toLocaleTimeString("en-IN", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    : "";
  const primaryVenue = primaryFunction?.locationName || "";

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const motionFor = (delay: number) => {
    const { key: _key, ...props } = getMotionProps(delay);
    return props;
  };

  const navItems: Array<[string, string, ThemeIconName]> = [
    ["story", "THEIR STORY", "heart"],
    ["events", "CELEBRATIONS", "calendar"],
    ["gallery", "MEMORIES", "image"],
    ["dress-code", "ATTIRE", "shirt"],
    ["music", "MUSIC", "music"],
    ["wishes", "BLESSINGS", "heart"],
    ["rsvp", "RSVP", "phone"],
    ["details", "TRAVEL", "info"],
    ["gift-registry", "GIFTS", "gift"],
  ];

  return (
    <main
      key={animationKey}
      className="relative mx-auto min-h-screen w-full max-w-[430px] overflow-x-hidden md:max-w-[1180px]"
      style={
        {
          "--heritage-paper": THEME_COLORS.page,
          "--animation-enabled": design?.motion?.animations === false ? "0" : "1",
          "--animation-style": design?.motion?.animation_style ?? "smooth",
          "--animation-scroll": design?.motion?.scroll_behavior ?? "on-scroll",
          "--animation-duration": design?.motion?.animation_duration ?? "1s",
          "--animation-delay": design?.motion?.animation_delay ?? "0ms",
          "--animation-speed": `${design?.motion?.animation_speed ?? 50}`,
          "--animation-loop": design?.motion?.animation_loop ? "1" : "0",
          background: THEME_COLORS.page,
          backgroundImage: "var(--bg-image, none)",
          backgroundPosition: "var(--bg-position, center)",
          backgroundSize: "var(--bg-size, cover)",
          backgroundRepeat: "var(--bg-repeat, repeat)",
          color: THEME_COLORS.text,
          ...THEME_TYPOGRAPHY.body,
        } as CSSProperties
      }
    >
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 10% 12%, rgba(184,134,11,.10) 0 1px, transparent 1px), radial-gradient(circle at 90% 82%, rgba(125,30,43,.08) 0 1px, transparent 1px)",
          backgroundSize: "22px 22px, 28px 28px",
          opacity: 0.8,
        }}
      />

      <div className="relative z-10 md:px-7 lg:px-12">
        {/* HERITAGE HERO */}
        <motion.section {...motionFor(0)} className="relative overflow-hidden px-5 pt-6 pb-10 md:px-0 md:pt-10 md:pb-16">
          <HeritageFrame />

          <header className="relative mx-auto flex max-w-[980px] items-center justify-between px-2">
            <div className="flex items-center gap-2 text-[8px] tracking-[0.28em]" style={{ color: THEME_COLORS.gold }}>
              <span>शुभ</span>
              <span>•</span>
              <span>विवाह</span>
            </div>

            <button
              aria-label="Open menu"
              onClick={() => setMenuOpen(true)}
              className="rounded-full p-2 md:hidden"
              style={{ color: THEME_COLORS.burgundy }}
            >
              <ThemeIcon name="menu" size={25} />
            </button>

            <div className="hidden text-[8px] tracking-[0.24em] md:block" style={{ color: THEME_COLORS.muted }}>
              {lunaData.announcement?.couple?.familyLabel || "A CELEBRATION OF LOVE & LEGACY"}
            </div>
          </header>

          <div className="relative mx-auto max-w-[900px] pt-8 text-center md:pt-12">
            <PeacockMark />

            <p className="mt-2 text-[8px] font-semibold tracking-[0.34em]" style={{ color: THEME_COLORS.muted }}>
              {lunaData.announcement?.announcement?.message || "WITH THE BLESSINGS OF OUR FAMILIES"}
            </p>

            <h1
              className="mt-5 text-[58px] leading-[0.88] md:text-[92px]"
              style={{ ...THEME_TYPOGRAPHY.accent, color: THEME_COLORS.burgundy }}
            >
              {firstName}
              <span className="mx-2 align-middle text-[28px] md:text-[42px]" style={{ color: THEME_COLORS.gold }}>
                &
              </span>
              {secondName}
            </h1>

            <div className="mx-auto mt-5 flex max-w-[570px] items-center justify-center gap-3">
              <span className="h-px flex-1" style={{ background: THEME_COLORS.line }} />
              <span className="text-[9px] tracking-[0.3em]" style={{ color: THEME_COLORS.gold }}>
                {lunaData.announcement?.announcement?.title || "A HERITAGE WEDDING"}
              </span>
              <span className="h-px flex-1" style={{ background: THEME_COLORS.line }} />
            </div>

            <motion.div {...motionFor(0.18)} className="relative mx-auto mt-8 max-w-[760px]">
              <div className="absolute inset-0 m-4 rounded-[90px] border md:m-7" style={{ borderColor: "rgba(255,255,255,.65)" }} />
              <img
                src={heroImage}
                alt="Wedding couple"
                className="h-[350px] w-full object-cover md:h-[510px]"
                style={{
                  borderRadius: "110px 110px 24px 24px",
                  boxShadow: THEME_SHAPES.shadow,
                }}
              />
              <div
                className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full px-5 py-2 text-[7px] tracking-[0.24em] backdrop-blur-sm md:bottom-7"
                style={{ background: "rgba(255,250,240,.88)", color: THEME_COLORS.burgundy }}
              >
                {primaryDateLabel || "THE CELEBRATION BEGINS"}
              </div>
            </motion.div>

            <div className="mx-auto mt-7 flex max-w-[760px] items-center justify-center gap-5">
              <span className="text-[18px]" style={{ color: THEME_COLORS.gold }}>
                ❧
              </span>
              <p className="max-w-[460px] text-[10px] leading-5" style={{ color: THEME_COLORS.text }}>
                {lunaData.announcement?.announcement?.message ||
                  "Two families, one beautiful beginning, and a celebration rooted in Indian tradition."}
              </p>
              <span className="text-[18px]" style={{ color: THEME_COLORS.gold }}>
                ❧
              </span>
            </div>
          </div>

          {primaryDate && (
            <div className="relative mx-auto mt-8 max-w-[820px]">
              <WeddingCalendar year={primaryDate.getFullYear()} month={primaryDate.getMonth()} selectedDate={primaryDate.getDate()} />
            </div>
          )}

          <div
            className="relative mx-auto mt-5 grid max-w-[820px] grid-cols-3 overflow-hidden rounded-[18px] border"
            style={{ borderColor: THEME_COLORS.line, background: THEME_COLORS.paper }}
          >
            {[
              ["calendar", primaryDay, primaryDateLabel],
              ["clock", primaryTime, "ONWARDS"],
              ["venue", primaryVenue, "VENUE"],
            ].map(([icon, value, sub], i) => (
              <motion.div
                key={`${icon}-${i}`}
                {...motionFor(0.25 + i * 0.07)}
                className="border-r p-4 text-center last:border-r-0 md:p-6"
                style={{ borderColor: THEME_COLORS.line }}
              >
                <div className="mb-2 flex justify-center" style={{ color: THEME_COLORS.gold }}>
                  <ThemeIcon name={icon as ThemeIconName} size={21} />
                </div>
                <p className="text-[9px] font-semibold tracking-[0.08em] uppercase" style={{ color: THEME_COLORS.text }}>
                  {value}
                </p>
                <p className="mt-1 text-[7px] tracking-[0.12em] uppercase" style={{ color: THEME_COLORS.muted }}>
                  {sub}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* DESKTOP NAV */}
        <section className="hidden pb-7 md:block">
          <div
            className="mx-auto grid max-w-[820px] grid-cols-5 overflow-hidden rounded-[18px] border"
            style={{ borderColor: THEME_COLORS.line, background: THEME_COLORS.paper }}
          >
            {navItems.map(([id, label, icon]) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="flex min-h-[82px] flex-col items-center justify-center gap-2 border-r last:border-r-0"
                style={{ borderColor: THEME_COLORS.line, color: THEME_COLORS.text }}
              >
                <span style={{ color: THEME_COLORS.gold }}>
                  <ThemeIcon name={icon} size={20} />
                </span>
                <span className="text-[7px] font-semibold tracking-[0.16em]">{label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* STORY */}
        <motion.section id="story" {...motionFor(0.1)} className="px-5 py-12 md:px-8 md:py-16">
          <div className="mx-auto max-w-[820px]">
            <div className="grid gap-8 md:grid-cols-[1fr_1.15fr] md:items-center">
              <div className="relative">
                <img
                  src={FREE_IMAGES.palace}
                  alt=""
                  className="h-[360px] w-full object-cover"
                  style={{ borderRadius: "160px 160px 18px 18px" }}
                />
                <div
                  className="absolute -right-3 -bottom-5 rounded-full border px-4 py-3 text-[7px] tracking-[0.16em]"
                  style={{ borderColor: THEME_COLORS.gold, background: THEME_COLORS.paper, color: THEME_COLORS.burgundy }}
                >
                  OUR HERITAGE
                </div>
              </div>

              <div className="text-center md:text-left">
                <p className="text-[8px] font-semibold tracking-[0.28em]" style={{ color: THEME_COLORS.gold }}>
                  THE BEGINNING
                </p>
                <h2
                  className="mt-3 text-[34px] leading-none md:text-[48px]"
                  style={{ ...THEME_TYPOGRAPHY.accent, color: THEME_COLORS.burgundy }}
                >
                  Our Story
                </h2>
                <div className="my-5 text-[18px]" style={{ color: THEME_COLORS.gold }}>
                  ❋
                </div>
                <p className="text-[11px] leading-6" style={{ color: THEME_COLORS.text }}>
                  {lunaData.announcement?.announcement?.message ||
                    "A new chapter begins where two families, two traditions and two hearts come together."}
                </p>
                <p className="mt-4 text-[10px] leading-5" style={{ color: THEME_COLORS.muted }}>
                  Every celebration is a thread in a larger story — carried through generations, shared around a table, and remembered long
                  after the music fades.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* FUNCTIONS */}
        <motion.section id="events" {...motionFor(0.12)} className="px-5 py-12 md:px-8 md:py-16">
          <div className="mx-auto max-w-[820px]">
            <div className="mb-8 text-center">
              <p className="text-[8px] font-semibold tracking-[0.3em]" style={{ color: THEME_COLORS.gold }}>
                THE CELEBRATIONS
              </p>
              <h2 className="mt-2 text-[38px]" style={{ ...THEME_TYPOGRAPHY.accent, color: THEME_COLORS.burgundy }}>
                A Week of Festivities
              </h2>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {functions.map((fn: any, i: number) => {
                const date = fn.date ? new Date(fn.date) : null;
                return (
                  <motion.article
                    key={fn.function_key ?? i}
                    {...motionFor(0.18 + i * 0.06)}
                    className="relative overflow-hidden rounded-[20px] border p-5"
                    style={{ borderColor: THEME_COLORS.line, background: THEME_COLORS.paper }}
                  >
                    <div className="absolute top-4 right-4 opacity-10" style={{ color: THEME_COLORS.burgundy }}>
                      <ThemeIcon name={i % 2 ? "music" : "flower"} size={52} />
                    </div>
                    <div className="flex items-start gap-4">
                      <div
                        className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-full"
                        style={{ background: THEME_COLORS.burgundy, color: THEME_COLORS.paper }}
                      >
                        <span className="text-[18px] leading-none">{date ? date.getDate() : "—"}</span>
                        <span className="mt-1 text-[6px] tracking-[0.12em]">
                          {date ? date.toLocaleString("en-IN", { month: "short" }).toUpperCase() : ""}
                        </span>
                      </div>
                      <div className="min-w-0 pt-1">
                        <p className="text-[8px] font-semibold tracking-[0.2em]" style={{ color: THEME_COLORS.gold }}>
                          {fn.title || "CELEBRATION"}
                        </p>
                        <p className="mt-2 text-[10px]" style={{ color: THEME_COLORS.text }}>
                          {fn.locationName || ""}
                        </p>
                        {fn.description && (
                          <p className="mt-2 text-[8px] leading-4" style={{ color: THEME_COLORS.muted }}>
                            {fn.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </motion.section>

        {/* GALLERY */}
        {!gallery.hidden && (
          <GallerySection
            animationKey={animationKey}
            getMotionProps={getMotionProps}
            layout={lunaData.galleryLayout}
            urls={lunaData.galleryUrls}
            fallback={heroImage}
            title="MEMORIES"
            isProtected={gallery.protected}
            password={gallery.password}
            unlockedSections={unlockedSections}
            setUnlockedSections={setUnlockedSections}
          />
        )}

        {/* ATTIRE */}
        <motion.section id="dress-code" {...motionFor(0.15)} className="px-5 py-12 md:px-8 md:py-16">
          <div
            className="mx-auto max-w-[820px] overflow-hidden rounded-[26px] border p-7 text-center md:p-12"
            style={{ borderColor: THEME_COLORS.line, background: THEME_COLORS.paper }}
          >
            <img src={FREE_IMAGES.flowers} alt="" className="mx-auto mb-6 h-28 w-28 rounded-full object-cover" />
            <p className="text-[8px] font-semibold tracking-[0.3em]" style={{ color: THEME_COLORS.gold }}>
              DRESS WITH THE OCCASION
            </p>
            <h2 className="mt-2 text-[38px]" style={{ ...THEME_TYPOGRAPHY.accent, color: THEME_COLORS.burgundy }}>
              Attire
            </h2>
            <div className="mt-7 space-y-7">
              {/* {lunaData?.dressCode?.map((dress: any, index: number) => (
                <div key={`dress-${index}`}>
                  {dress.title && (
                    <h3 className="text-[11px] font-semibold tracking-[0.14em]" style={{ color: THEME_COLORS.text }}>
                      {dress.title}
                    </h3>
                  )}
                  {dress.description && (
                    <p className="mx-auto mt-2 max-w-[460px] text-[9px] leading-5" style={{ color: THEME_COLORS.muted }}>
                      {dress.description}
                    </p>
                  )}
                  {Array.isArray(dress.hexColors) && dress.hexColors.length > 0 && (
                    <div className="mt-4 flex justify-center gap-3">
                      {dress.hexColors.map((color: string, i: number) => (
                        <span
                          key={`${color}-${i}`}
                          className="h-8 w-8 rounded-full border-2 border-white shadow-sm"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))} */}
            </div>
          </div>
        </motion.section>

        {/* MUSIC */}
        <motion.section id="music" {...motionFor(0.16)} className="px-5 py-12 md:px-8 md:py-16">
          <div
            className="mx-auto max-w-[820px] rounded-[26px] p-7 text-center md:p-12"
            style={{ background: THEME_COLORS.burgundy, color: THEME_COLORS.paper }}
          >
            <div
              className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border"
              style={{ borderColor: THEME_COLORS.gold, color: THEME_COLORS.gold }}
            >
              <ThemeIcon name="music" size={24} />
            </div>
            <p className="text-[8px] tracking-[0.3em]" style={{ color: THEME_COLORS.gold }}>
              A SOUNDTRACK FOR THE EVENING
            </p>
            <h2 className="mt-2 mb-7 text-[34px]" style={THEME_TYPOGRAPHY.accent}>
              Our Celebration
            </h2>
            <AudioPlayer
              src={data?.music?.background_audio ?? ""}
              name={data?.music?.background_audio_name ?? "Background Music"}
              cover={heroImage}
              variant={data?.music?.audio_player_variant}
              allowMute={data?.music?.allow_mute ?? true}
              loop={data?.music?.loop_music ?? true}
              fadeIn={data?.music?.fade_in ?? false}
              fadeOut={data?.music?.fade_out ?? false}
              volume={data?.music?.volume_level ?? 60}
            />
          </div>
        </motion.section>

        {/* WISHES */}
        {!wishes.hidden && (
          <WishesSection
            animationKey={animationKey}
            getMotionProps={getMotionProps}
            eventKey={eventKey}
            wishesRaw={lunaData.wishesRaw}
            wishesContainerRef={wishesContainerRef}
            wishRefreshKey={wishRefreshKey}
            setWishRefreshKey={setWishRefreshKey}
            title={lunaData.wishesTitle ?? "Blessings & Wishes"}
            isIcon={false}
            isProtected={wishes.protected}
            password={wishes.password}
            unlockedSections={unlockedSections}
            setUnlockedSections={setUnlockedSections}
          />
        )}

        {/* RSVP */}
        <motion.section id="rsvp" {...motionFor(0.18)} className="px-5 py-12 md:px-8 md:py-16">
          <div className="mx-auto max-w-[620px] text-center">
            <div
              className="mx-auto mb-5 h-16 w-16 rounded-full border p-4"
              style={{ borderColor: THEME_COLORS.gold, color: THEME_COLORS.burgundy }}
            >
              <ThemeIcon name="heart" size={28} />
            </div>
            <p className="text-[8px] font-semibold tracking-[0.3em]" style={{ color: THEME_COLORS.gold }}>
              YOUR PRESENCE MATTERS
            </p>
            <h2 className="mt-2 text-[40px]" style={{ ...THEME_TYPOGRAPHY.accent, color: THEME_COLORS.burgundy }}>
              Kindly RSVP
            </h2>
            <p className="mx-auto mt-4 max-w-[420px] text-[9px] leading-5" style={{ color: THEME_COLORS.muted }}>
              We would be honoured to celebrate this beautiful chapter with you.
            </p>

            <div className="mt-7 grid grid-cols-2 gap-3">
              <button
                onClick={() => setRsvp("yes")}
                className="flex items-center justify-center gap-2 rounded-full border py-3 text-[8px] font-semibold tracking-[0.14em]"
                style={{
                  borderColor: THEME_COLORS.burgundy,
                  background: rsvp === "yes" ? THEME_COLORS.burgundy : "transparent",
                  color: rsvp === "yes" ? THEME_COLORS.paper : THEME_COLORS.burgundy,
                }}
              >
                <ThemeIcon name="check" size={14} /> ACCEPTS
              </button>
              <button
                onClick={() => setRsvp("no")}
                className="flex items-center justify-center gap-2 rounded-full border py-3 text-[8px] font-semibold tracking-[0.14em]"
                style={{
                  borderColor: THEME_COLORS.line,
                  background: rsvp === "no" ? THEME_COLORS.burgundy : "transparent",
                  color: rsvp === "no" ? THEME_COLORS.paper : THEME_COLORS.muted,
                }}
              >
                <ThemeIcon name="close" size={14} /> REGRETS
              </button>
            </div>

            <button
              className="mt-5 rounded-full px-8 py-3 text-[8px] font-semibold tracking-[0.18em]"
              style={{ background: THEME_COLORS.gold, color: THEME_COLORS.paper }}
            >
              RSVP NOW
            </button>
          </div>
        </motion.section>

        {/* TRAVEL / DETAILS */}
        <motion.section id="details" {...motionFor(0.18)} className="px-5 py-12 md:px-8 md:py-16">
          <div className="mx-auto max-w-[820px]">
            <div className="mb-8 text-center">
              <p className="text-[8px] tracking-[0.3em]" style={{ color: THEME_COLORS.gold }}>
                MAKE YOURSELF AT HOME
              </p>
              <h2 className="mt-2 text-[38px]" style={{ ...THEME_TYPOGRAPHY.accent, color: THEME_COLORS.burgundy }}>
                Travel & Details
              </h2>
            </div>
            <div className="grid gap-3 md:grid-cols-4">
              {[
                ["venue", "STAY", "Recommended accommodation"],
                ["car", "TRAVEL", "Airport pickup & local travel"],
                ["calendar", "PARKING", "Parking information"],
                ["info", "FAQ", "Common questions"],
              ].map(([icon, title, text]) => (
                <button
                  key={title}
                  className="rounded-[18px] border p-5 text-left"
                  style={{ borderColor: THEME_COLORS.line, background: THEME_COLORS.paper }}
                >
                  <span style={{ color: THEME_COLORS.gold }}>
                    <ThemeIcon name={icon as ThemeIconName} size={22} />
                  </span>
                  <span className="mt-4 block text-[8px] font-semibold tracking-[0.14em]" style={{ color: THEME_COLORS.text }}>
                    {title}
                  </span>
                  <span className="mt-2 block text-[8px] leading-4" style={{ color: THEME_COLORS.muted }}>
                    {text}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </motion.section>

        {/* GIFTS */}
        <motion.section id="gift-registry" {...motionFor(0.18)} className="px-5 py-12 md:px-8 md:py-16">
          <div
            className="mx-auto max-w-[720px] rounded-[28px] border p-8 text-center md:p-12"
            style={{ borderColor: THEME_COLORS.line, background: THEME_COLORS.paper }}
          >
            <ThemeIcon name="gift" size={30} />
            <p className="mt-5 text-[8px] tracking-[0.28em]" style={{ color: THEME_COLORS.gold }}>
              A LITTLE BLESSING
            </p>
            <h2 className="mt-2 text-[38px]" style={{ ...THEME_TYPOGRAPHY.accent, color: THEME_COLORS.burgundy }}>
              Your Presence Is Our Gift
            </h2>
            <p className="mx-auto mt-4 max-w-[430px] text-[9px] leading-5" style={{ color: THEME_COLORS.muted }}>
              Your love and blessings are all we ask for. If you would like to honour us further, our preferred options are here.
            </p>
            <button
              className="mt-6 rounded-full border px-7 py-3 text-[8px] tracking-[0.16em]"
              style={{ borderColor: THEME_COLORS.gold, color: THEME_COLORS.burgundy }}
            >
              VIEW GIFT OPTIONS
            </button>
          </div>
        </motion.section>

        {/* FOOTER */}
        <motion.footer
          {...motionFor(0.2)}
          className="relative overflow-hidden px-6 py-14 text-center md:px-12 md:py-20"
          style={{ background: THEME_COLORS.dark, color: THEME_COLORS.paper }}
        >
          <div className="absolute inset-0 opacity-15">
            <img src={FREE_IMAGES.palace} alt="" className="h-full w-full object-cover" />
          </div>
          <div className="relative">
            <PeacockMark />
            <p className="mt-3 text-[8px] tracking-[0.28em]" style={{ color: THEME_COLORS.gold }}>
              WITH LOVE, FROM OUR FAMILIES
            </p>
            <h2 className="mt-4 text-[40px]" style={THEME_TYPOGRAPHY.accent}>
              {firstName} & {secondName}
            </h2>
            <p className="mx-auto mt-4 max-w-[360px] text-[9px] leading-5 opacity-80">
              We cannot wait to welcome you, share our traditions, and make another beautiful memory together.
            </p>

            <div
              className="mx-auto mt-8 grid max-w-[720px] grid-cols-3 gap-2 border-y py-5"
              style={{ borderColor: "rgba(255,255,255,.18)" }}
            >
              {navItems.slice(0, 6).map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  className="py-2 text-[7px] tracking-[0.15em]"
                  style={{ color: THEME_COLORS.paper }}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="mt-8 flex justify-center gap-5" style={{ color: THEME_COLORS.gold }}>
              <span aria-label="Instagram">◎</span>
              <span aria-label="Facebook">f</span>
              <span aria-label="WhatsApp">◌</span>
            </div>
          </div>
        </motion.footer>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div className="fixed inset-0 z-50 mx-auto w-full max-w-[430px] overflow-y-auto" style={{ background: THEME_COLORS.burgundy }}>
            <div className="flex items-center justify-between px-6 py-7" style={{ color: THEME_COLORS.paper }}>
              <div className="text-[16px] tracking-[0.24em]">
                {firstName} & {secondName}
              </div>
              <button onClick={() => setMenuOpen(false)} aria-label="Close menu">
                <ThemeIcon name="close" size={26} />
              </button>
            </div>
            <nav className="flex flex-col px-9 pt-6 text-center">
              {navItems.map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  className="border-b py-5 text-[9px] tracking-[0.25em]"
                  style={{ borderColor: "rgba(255,255,255,.18)", color: THEME_COLORS.paper }}
                >
                  {label}
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>
    </main>
  );
}
