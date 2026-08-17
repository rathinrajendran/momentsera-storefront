"use client";

import { useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { motion } from "framer-motion";
import { useThemeAnimation } from "../../../../../hooks/useThemeAnimations";
import { useInviteData } from "../../../../../hooks/useInviteData";
import { getAnimationKey } from "../../../../../utils/animation";
import GallerySection from "../components/common/GallerySection";
import WishesSection from "../components/common/WishesSection";
import { getSectionConfig } from "../../../../../utils/section-visibility";
import { useUnlockedSections } from "../../../../../hooks/useUnlockedSections";
import { ThemeIcon, type ThemeIconName } from "../../core/core/themeIcons";
import { THEME_COLORS } from "../../core/core/themeColors";
import { THEME_TYPOGRAPHY } from "../../core/core/themeTypography";
import AudioPlayer from "../../../../../components/ui/AudioPlayer";

interface AthelProps {
  data: any;
  eventKey: string;
  motionData: any;
  settings: any;
  theme?: any;
  music?: any;
}

/*
  WEDDING CELEBRATION
  ---------------------------------------------------------
  Concept:
  Editorial Indian wedding invitation inspired by the supplied
  portfolio reference.

  Visual language:
  - near-black / warm ivory editorial pages
  - oversized condensed-style headings
  - asymmetrical photography
  - Indian line-art graphics
  - palace / jaali / paisley geometry
  - magazine metadata
  - chapter-based storytelling
  - floating photo cards
  - mobile = intentional vertical editorial pages
  - desktop = wide magazine composition

  IMPORTANT:
  This is an invitation presentation, not an editor UI.
  All event content is resolved from Luna data.
*/

const FREE_IMAGES = {
  palace: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1400&q=88",
  couple: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=88",
  ceremony: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=88",
  flowers: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=1000&q=88",
  architecture: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=88",
  decor: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1100&q=88",
};

const FALLBACK_FUNCTIONS = [{ title: "Mehndi" }, { title: "Sangeet" }, { title: "Wedding" }, { title: "Reception" }];

function CrestMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 190" className={className} aria-hidden="true">
      <path
        d="M80 8L93 29L119 22L116 49L143 61L123 79L137 103L109 106L102 134L80 117L58 134L51 106L23 103L37 79L17 61L44 49L41 22L67 29Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M80 34C61 49 52 67 55 87C58 106 70 119 80 130C90 119 102 106 105 87C108 67 99 49 80 34Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M80 47C69 59 66 72 68 84C70 95 76 103 80 108C84 103 90 95 92 84C94 72 91 59 80 47Z" fill="currentColor" opacity=".14" />
      <circle cx="80" cy="77" r="8" fill="none" stroke="currentColor" />
      <path d="M80 60V94M63 77H97" stroke="currentColor" strokeWidth="1" />
      <text x="80" y="154" textAnchor="middle" fontSize="9" letterSpacing="3" fill="currentColor">
        ATHEL
      </text>
      <text x="80" y="169" textAnchor="middle" fontSize="7" letterSpacing="2" fill="currentColor">
        CREST
      </text>
    </svg>
  );
}

function DiyaGraphic() {
  return (
    <svg viewBox="0 0 160 110" className="h-20 w-28" aria-hidden="true">
      <path d="M42 62C51 48 109 48 118 62C115 83 45 83 42 62Z" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M58 62C63 56 97 56 102 62" fill="none" stroke="currentColor" />
      <path d="M80 52C72 42 76 28 80 18C84 28 88 42 80 52Z" fill="currentColor" opacity=".3" />
      <path d="M80 20C76 11 80 6 85 2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="80" cy="2" r="2" fill="currentColor" />
      <path d="M35 89H125" stroke="currentColor" strokeWidth="1" opacity=".55" />
    </svg>
  );
}

function JaaliPattern() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 opacity-[0.07]"
      style={{
        backgroundImage: `
          linear-gradient(45deg, transparent 43%, currentColor 44%, currentColor 46%, transparent 47%),
          linear-gradient(-45deg, transparent 43%, currentColor 44%, currentColor 46%, transparent 47%)
        `,
        backgroundSize: "24px 24px",
      }}
    />
  );
}

function EditorialImage({ src, alt = "", className = "" }: { src: string; alt?: string; className?: string }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img src={src} alt={alt} className="h-full w-full object-cover" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,.16)",
        }}
      />
    </div>
  );
}

function MetaLine({ left, right, dark = false }: { left: string; right: string; dark?: boolean }) {
  return (
    <div
      className="flex items-center justify-between border-b pb-2"
      style={{
        ...THEME_TYPOGRAPHY.heading,
        color: THEME_COLORS.text,

        borderColor: dark ? "rgba(255,255,255,.2)" : "rgba(30,30,30,.16)",
      }}
    >
      <span>{left}</span>
      <span>{right}</span>
    </div>
  );
}

export default function Athel({ data, eventKey, motionData, settings, music, theme }: AthelProps) {
  const lunaData = useInviteData(data);
  const { getMotionProps } = useThemeAnimation(motionData);
  const animationKey = useMemo(() => getAnimationKey(motionData), [motionData]);

  const [menuOpen, setMenuOpen] = useState(false);
  const [rsvp, setRsvp] = useState<"yes" | "no" | null>(null);
  const [wishRefreshKey, setWishRefreshKey] = useState(0);
  const wishesContainerRef = useRef<HTMLElement | null>(null);

  const firstName = lunaData.firstName || lunaData.brideName || "Aarav";
  const secondName = lunaData.secondName || lunaData.groomName || "Meera";

  const heroImage = lunaData.heroImage || FREE_IMAGES.couple;

  const gallery = getSectionConfig(settings?.section_visibility, "gallery");
  const wishes = getSectionConfig(settings?.section_visibility, "wishes");

  const { unlockedSections, setUnlockedSections } = useUnlockedSections(eventKey);

  const functions = Array.isArray(lunaData.eventFunctions) && lunaData.eventFunctions.length ? lunaData.eventFunctions : FALLBACK_FUNCTIONS;

  const primaryFunction = lunaData.primaryFunction || functions[0] || {};

  const primaryDate = primaryFunction?.startTime
    ? new Date(primaryFunction.startTime)
    : primaryFunction?.date
      ? new Date(primaryFunction.date)
      : null;

  const primaryYear = primaryDate?.getFullYear() || new Date().getFullYear();

  const primaryDay = primaryDate
    ? primaryDate.toLocaleDateString("en-IN", {
        weekday: "long",
      })
    : "";

  const primaryDateNumber = primaryDate ? String(primaryDate.getDate()).padStart(2, "0") : "";

  const primaryMonth = primaryDate ? primaryDate.toLocaleString("en-IN", { month: "short" }).toUpperCase() : "";

  const primaryMonthLong = primaryDate ? primaryDate.toLocaleString("en-IN", { month: "long" }).toUpperCase() : "";

  const primaryTime = primaryDate
    ? primaryDate.toLocaleTimeString("en-IN", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    : "";

  const primaryVenue = primaryFunction?.locationName || "Venue details to follow";

  const announcementTitle = lunaData.announcement?.announcement?.title || "A new chapter begins";

  const announcementMessage =
    lunaData.announcement?.announcement?.message || "With the blessings of our families, we invite you to celebrate our wedding.";

  const motionFor = (delay: number) => {
    const { key: _key, ...props } = getMotionProps(delay);
    return props;
  };

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const navItems: Array<[string, string, ThemeIconName]> = [
    ["story", "STORY", "heart"],
    ["events", "CELEBRATIONS", "calendar"],
    ["gallery", "MEMORIES", "image"],
    ["dress-code", "ATTIRE", "shirt"],
    ["music", "MUSIC", "music"],
    ["wishes", "BLESSINGS", "heart"],
    ["rsvp", "RSVP", "phone"],
  ];

  const hasThemeBackgroundImage =
    typeof theme?.background_image === "string" && theme.background_image.trim() !== "" && theme.background_image.trim() !== "none";
  return (
    <main
      key={animationKey}
      className="relative mx-auto w-full"
      style={
        {
          "--animation-enabled": motionData?.animations === false ? "0" : "1",
          "--animation-style": motionData?.animation_style ?? "smooth",
          "--animation-scroll": motionData?.scroll_behavior ?? "on-scroll",
          "--animation-duration": motionData?.animation_duration ?? "1s",
          "--animation-delay": motionData?.animation_delay ?? "0ms",
          "--animation-speed": `${motionData?.animation_speed ?? 50}`,
          "--animation-loop": motionData?.animation_loop ? "1" : "0",
          "--section-bg-primary": THEME_COLORS.page,
          "--section-bg-secondary": THEME_COLORS.paper,
          backgroundImage: hasThemeBackgroundImage ? `url(${theme.background_image.trim()})` : "none",
          backgroundPosition: "var(--bg-position, center)",
          backgroundSize: "var(--bg-size, cover)",
          backgroundRepeat: "var(--bg-repeat, repeat)",
          color: THEME_COLORS.text,
          ...THEME_TYPOGRAPHY.body,
          overflow: "hidden",
        } as CSSProperties
      }
    >
      <style>{`
        .relative.z-10 > section:nth-of-type(odd) {
          background: ${hasThemeBackgroundImage ? "transparent" : "var(--section-bg-primary)"} !important;
        }

        .relative.z-10 > section:nth-of-type(even) {
          background: ${hasThemeBackgroundImage ? "transparent" : "var(--section-bg-secondary)"} !important;
        }
      `}</style>

      {/* ==========================================================
          PAGE BACKGROUND
         ========================================================== */}
      <div className="pointer-events-none absolute inset-0 opacity-25">
        <JaaliPattern />
      </div>

      <div className="relative z-10">
        {/* ==========================================================
            COVER
           ========================================================== */}
        <motion.section
          {...motionFor(0)}
          className="relative min-h-[720px] overflow-hidden px-5 pt-6 pb-10 md:min-h-[820px] md:px-14 md:pt-10"
        >
          <div
            className="absolute inset-0 opacity-[0.08]"
            // style={{
            //   backgroundImage: `url(${FREE_IMAGES.architecture})`,
            //   backgroundSize: "cover",
            //   backgroundPosition: "center",
            //   filter: "grayscale(1)",
            // }}
          />

          <div className="relative mx-auto max-w-[1040px]">
            <MetaLine left="WEDDING CELEBRATION" right={String(primaryYear)} dark />

            <div className="mt-5 flex items-center justify-between">
              <div className="" style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.gold }}>
                शुभ विवाह
              </div>

              <button
                onClick={() => setMenuOpen(true)}
                className="rounded-full border p-2 md:hidden"
                style={{
                  borderColor: "rgba(255,255,255,.25)",
                  color: THEME_COLORS.paper,
                }}
                aria-label="Open menu"
              >
                <ThemeIcon name="menu" size={18} />
              </button>

              <div className="hidden items-center gap-2 md:flex">
                <span className="opacity-60" style={{ ...THEME_TYPOGRAPHY.body }}>
                  A DIGITAL INVITATION
                </span>
                <span className="h-px w-12" style={{ background: THEME_COLORS.gold }} />
                <span className="" style={{ ...THEME_TYPOGRAPHY.body }}>
                  ↗
                </span>
              </div>
            </div>

            <div className="relative mt-12 md:mt-20">
              {/* portrait */}
              <div className="absolute top-0 right-[4%] h-[290px] w-[62%] overflow-hidden md:right-[8%] md:h-[500px] md:w-[48%]">
                <img src={heroImage} alt="Wedding couple" className="h-full w-full object-cover" />
                <div
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(180deg, transparent 50%, rgba(17,17,17,.38) 100%)",
                  }}
                />
              </div>

              {/* giant editorial title */}
              <div className="relative z-10 pt-14 md:pt-28">
                <p className="ml-1" style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.gold }}>
                  THE
                </p>

                <h1
                  className="mt-0 max-w-[95%]"
                  style={{
                    ...THEME_TYPOGRAPHY.heading,
                    textTransform: "uppercase",

                    color: THEME_COLORS.paper,
                    WebkitTextStroke: `1px rgba(242,233,216,.18)`,
                  }}
                >
                  {firstName}
                </h1>

                <h2
                  className="relative mt-1 ml-[8%] max-w-[90%]"
                  style={{
                    ...THEME_TYPOGRAPHY.heading,
                    textTransform: "uppercase",

                    color: "transparent",
                    WebkitTextStroke: `1px ${THEME_COLORS.gold}`,
                  }}
                >
                  {secondName}
                </h2>
              </div>

              <div className="relative z-20 mt-12 max-w-[440px] md:mt-16 md:ml-[8%]">
                <p className="" style={{ ...THEME_TYPOGRAPHY.body, color: "rgba(242,233,216,.68)" }}>
                  {announcementMessage}
                </p>

                <div className="mt-6 flex items-center gap-4">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-full border"
                    style={{
                      borderColor: THEME_COLORS.gold,
                      color: THEME_COLORS.gold,
                    }}
                  >
                    <ThemeIcon name="heart" size={18} />
                  </div>

                  <div>
                    <p className="" style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.gold }}>
                      {firstName} &amp; {secondName}
                    </p>
                    <p className="mt-1 opacity-60" style={{ ...THEME_TYPOGRAPHY.body }}>
                      {primaryDate ? `${primaryDay.toUpperCase()} · ${primaryDateNumber} ${primaryMonth} ${primaryYear}` : "SAVE THE DATE"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* bottom cover meta */}
            <div className="absolute right-0 bottom-5 left-0 grid grid-cols-3 md:bottom-0" style={{ ...THEME_TYPOGRAPHY.body }}>
              <span>WITH THE BLESSINGS OF OUR FAMILIES</span>
              <span className="" style={{ ...THEME_TYPOGRAPHY.body, textAlign: "center" }}>
                SHUBH VIVAH
              </span>
              <span className="" style={{ ...THEME_TYPOGRAPHY.body, textAlign: "right" }}>
                {primaryVenue}
              </span>
            </div>
          </div>
        </motion.section>

        {/* ==========================================================
            TABLE OF CONTENTS
           ========================================================== */}
        <motion.section {...motionFor(0.08)} className="relative px-5 py-14 md:px-14 md:py-20" style={{}}>
          <div className="mx-auto max-w-[1040px]">
            <MetaLine left="WEDDING · CONTENTS" right="01 — 07" />

            <div className="mt-10 grid gap-10 md:grid-cols-[1.2fr_.8fr] md:items-end">
              <div>
                <p className="" style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.muted }}>
                  WELCOME TO THE CELEBRATION
                </p>

                <h2 className="mt-3" style={{ ...THEME_TYPOGRAPHY.heading, color: THEME_COLORS.text }}>
                  TABLE
                  <br />
                  OF
                  <br />
                  CONTENTS
                </h2>

                <p className="mt-7 max-w-[470px] opacity-60" style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.muted }}>
                  A modern wedding story rooted in Indian celebration, family, colour, ritual and the people who make every moment worth
                  remembering.
                </p>
              </div>

              <div className="relative">
                <CrestMark className="absolute -top-20 -right-2 h-32 w-28 opacity-20" />

                <div className="space-y-2">
                  {navItems.map(([id, label, icon], index) => (
                    <button
                      key={id}
                      onClick={() => scrollTo(id)}
                      className="group flex w-full items-center justify-between border-b py-3"
                      style={{
                        ...THEME_TYPOGRAPHY.body,
                        textAlign: "left",

                        borderColor: "rgba(17,17,17,.16)",
                      }}
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className="flex h-7 w-7 items-center justify-center rounded-full border"
                          style={{
                            borderColor: THEME_COLORS.burgundy,
                            color: THEME_COLORS.burgundy,
                          }}
                        >
                          <ThemeIcon name={icon} size={12} />
                        </span>
                        <span className="" style={{ ...THEME_TYPOGRAPHY.body }}>
                          {label}
                        </span>
                      </span>

                      <span
                        className="transition-transform group-hover:translate-x-1"
                        style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.burgundy }}
                      >
                        0{index + 1} ↗
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ==========================================================
            INTRODUCTION / STORY
           ========================================================== */}
        <motion.section id="story" {...motionFor(0.1)} className="relative px-5 py-14 md:px-14 md:py-24">
          <div className="mx-auto max-w-[1040px]">
            <MetaLine left="WEDDING · 02" right="INTRODUCTION ↗" dark />

            <div className="relative mt-12 grid items-center gap-8 md:grid-cols-[1.1fr_.9fr]">
              <div className="relative">
                <EditorialImage src={FREE_IMAGES.ceremony} className="h-[270px] w-[86%] md:h-[420px]" />

                <div className="absolute right-[4%] -bottom-8 h-[145px] w-[48%] md:h-[210px]">
                  <EditorialImage src={FREE_IMAGES.flowers} className="h-full w-full" />
                </div>

                <div
                  className="absolute top-8 -left-3 flex h-16 w-16 items-center justify-center rounded-full border"
                  style={{
                    ...THEME_TYPOGRAPHY.body,

                    borderColor: THEME_COLORS.gold,
                    color: THEME_COLORS.gold,
                  }}
                >
                  02
                </div>
              </div>

              <div className="pt-6 md:pt-0">
                <h2 className="" style={{ ...THEME_TYPOGRAPHY.heading, textTransform: "uppercase", color: THEME_COLORS.paper }}>
                  HELLO
                  <br />
                  <span style={{ color: THEME_COLORS.gold }}>THERE</span>
                </h2>

                <p className="mt-8 max-w-[420px]" style={{ ...THEME_TYPOGRAPHY.body, color: "rgba(242,233,216,.68)" }}>
                  {announcementMessage}
                </p>

                <p className="mt-4 max-w-[420px]" style={{ ...THEME_TYPOGRAPHY.body, color: "rgba(242,233,216,.42)" }}>
                  This is where two stories become one. A celebration of families, rituals, laughter, music and everything that makes an
                  Indian wedding feel larger than life.
                </p>

                <div className="mt-8 flex items-center gap-3" style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.gold }}>
                  <span>THE STORY STARTS HERE</span>
                  <span>→</span>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ==========================================================
            DATE / VENUE EDITORIAL PAGE
           ========================================================== */}
        <motion.section
          {...motionFor(0.12)}
          className="px-5 py-14 md:px-14 md:py-20"
          style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.text }}
        >
          <div className="mx-auto max-w-[1040px]">
            <MetaLine left="WEDDING · THE DAY" right="03" />

            <div className="mt-12 grid gap-10 md:grid-cols-[.7fr_1.5fr_.8fr] md:items-center">
              <div>
                <p className="" style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.burgundy }}>
                  SAVE THIS DATE
                </p>

                <p className="mt-2 opacity-55" style={{ ...THEME_TYPOGRAPHY.body }}>
                  The day when every road leads to one celebration.
                </p>
              </div>

              <div className="" style={{ ...THEME_TYPOGRAPHY.body, textAlign: "center" }}>
                <div className="flex items-center justify-center gap-3">
                  <span className="h-px w-16" style={{ background: THEME_COLORS.gold }} />
                  <span className="" style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.burgundy }}>
                    {primaryDay.toUpperCase() || "THE DAY"}
                  </span>
                  <span className="h-px w-16" style={{ background: THEME_COLORS.gold }} />
                </div>

                <div className="mt-1" style={{ ...THEME_TYPOGRAPHY.heading, color: THEME_COLORS.burgundy }}>
                  {primaryDateNumber || "—"}
                </div>

                <div className="mt-4" style={{ ...THEME_TYPOGRAPHY.body }}>
                  {primaryMonthLong || "DATE"} {primaryYear}
                </div>
              </div>

              <div className="border-l pl-6">
                <div className="flex items-center gap-3" style={{ color: THEME_COLORS.burgundy }}>
                  <ThemeIcon name="clock" size={18} />
                  <span className="" style={{ ...THEME_TYPOGRAPHY.body }}>
                    MUHURAT
                  </span>
                </div>

                <p className="mt-3" style={{ ...THEME_TYPOGRAPHY.body }}>
                  {primaryTime || "ONWARDS"}
                </p>

                <div className="mt-5 flex items-start gap-3" style={{ color: THEME_COLORS.burgundy }}>
                  <ThemeIcon name="venue" size={18} />
                  <div>
                    <span className="" style={{ ...THEME_TYPOGRAPHY.body }}>
                      VENUE
                    </span>
                    <p className="mt-2 opacity-65" style={{ ...THEME_TYPOGRAPHY.body }}>
                      {primaryVenue}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4">
              {[
                ["calendar", "DATE", primaryDateNumber || "—"],
                ["clock", "TIME", primaryTime || "—"],
                ["venue", "VENUE", primaryVenue],
                ["heart", "OCCASION", "WEDDING"],
              ].map(([icon, label, value]) => (
                <div key={label} className="border p-4" style={{ borderColor: "rgba(17,17,17,.16)" }}>
                  <ThemeIcon name={icon as ThemeIconName} size={17} />
                  <p className="mt-5 opacity-45" style={{ ...THEME_TYPOGRAPHY.body }}>
                    {label}
                  </p>
                  <p className="mt-2 line-clamp-2" style={{ ...THEME_TYPOGRAPHY.body }}>
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ==========================================================
            CELEBRATIONS
           ========================================================== */}
        <motion.section id="events" {...motionFor(0.14)} className="relative px-5 py-14 md:px-14 md:py-24" style={{}}>
          <div className="mx-auto max-w-[1040px]">
            <MetaLine left="WEDDING · CELEBRATIONS" right="04" dark />

            <div className="mt-10 flex items-end justify-between">
              <div>
                <p className="" style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.gold }}>
                  THE FESTIVITIES
                </p>
                <h2 className="mt-2" style={{ ...THEME_TYPOGRAPHY.heading, textTransform: "uppercase", color: THEME_COLORS.paper }}>
                  LET'S
                  <br />
                  CELEBRATE
                </h2>
              </div>

              <div className="hidden pb-2 md:block">
                <DiyaGraphic />
              </div>
            </div>

            <div className="mt-12 grid gap-0 md:grid-cols-2">
              {functions.map((fn: any, index: number) => {
                const date = fn.date ? new Date(fn.date) : null;

                const image = [FREE_IMAGES.flowers, FREE_IMAGES.decor, FREE_IMAGES.ceremony, FREE_IMAGES.palace][index % 4];

                return (
                  <motion.article
                    key={fn.function_key ?? index}
                    {...motionFor(0.2 + index * 0.06)}
                    className="group grid min-h-[240px] grid-cols-[.95fr_1.05fr] border-b py-6 md:min-h-[290px]"
                    style={{
                      borderColor: "rgba(242,233,216,.16)",
                    }}
                  >
                    <div className="relative pr-5">
                      <EditorialImage src={image} className="h-full min-h-[190px] w-full" />
                      <span
                        className="absolute top-2 left-2 flex h-8 w-8 items-center justify-center rounded-full"
                        style={{
                          ...THEME_TYPOGRAPHY.body,

                          background: THEME_COLORS.gold,
                          color: THEME_COLORS.text,
                        }}
                      >
                        0{index + 1}
                      </span>
                    </div>

                    <div className="flex flex-col justify-center pl-3">
                      <p className="" style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.gold }}>
                        {date
                          ? date
                              .toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                              })
                              .toUpperCase()
                          : "THE DAY"}
                      </p>

                      <h3 className="mt-3" style={{ ...THEME_TYPOGRAPHY.heading, textTransform: "uppercase", color: THEME_COLORS.paper }}>
                        {fn.title || "Celebration"}
                      </h3>

                      <div className="mt-5 flex items-start gap-2">
                        <ThemeIcon name="venue" size={14} />
                        <p
                          className=""
                          style={{
                            ...THEME_TYPOGRAPHY.body,

                            color: "rgba(242,233,216,.58)",
                          }}
                        >
                          {fn.locationName || "Venue details"}
                        </p>
                      </div>

                      {fn.description && (
                        <p
                          className="mt-3"
                          style={{
                            ...THEME_TYPOGRAPHY.body,

                            color: "rgba(242,233,216,.4)",
                          }}
                        >
                          {fn.description}
                        </p>
                      )}
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </motion.section>

        {/* ==========================================================
            GRAPHIC INTERLUDE
           ========================================================== */}
        <motion.section
          {...motionFor(0.14)}
          className="relative overflow-hidden px-5 py-12 md:px-14 md:py-16"
          style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.text }}
        >
          <JaaliPattern />

          <div
            className="relative mx-auto flex max-w-[1040px] flex-col items-center"
            style={{ ...THEME_TYPOGRAPHY.body, textAlign: "center" }}
          >
            <CrestMark className="h-36 w-32" />

            <p className="mt-2" style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.burgundy }}>
              ROOTED IN TRADITION
            </p>

            <h2 className="mt-4 max-w-[700px]" style={{ ...THEME_TYPOGRAPHY.heading, textTransform: "uppercase" }}>
              Tradition,
              <br />
              Reimagined.
            </h2>

            <p className="mt-5 max-w-[520px] opacity-55" style={{ ...THEME_TYPOGRAPHY.body }}>
              A contemporary celebration with the soul of an Indian wedding — rituals, family, flowers, music and unforgettable moments.
            </p>
          </div>
        </motion.section>

        {/* ==========================================================
            GALLERY
           ========================================================== */}
        {!gallery.hidden && (
          <motion.section id="gallery" {...motionFor(0.16)} className="px-5 py-14 md:px-14 md:py-24" style={{}}>
            <div className="mx-auto max-w-[1040px]">
              <MetaLine left="WEDDING · PHOTO STORY" right="05" dark />

              <div className="mt-10 grid items-end gap-7 md:grid-cols-[.75fr_1.25fr]">
                <div>
                  <p className="" style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.gold }}>
                    THE MEMORIES
                  </p>
                  <h2 className="mt-2" style={{ ...THEME_TYPOGRAPHY.heading, textTransform: "uppercase", color: THEME_COLORS.paper }}>
                    PHOTO
                    <br />
                    STORY
                  </h2>
                  <p className="mt-6 max-w-[320px]" style={{ ...THEME_TYPOGRAPHY.body, color: "rgba(242,233,216,.5)" }}>
                    Little details, big celebrations, people we love and moments we never want to forget.
                  </p>
                </div>

                <div className="relative">
                  <EditorialImage src={heroImage} className="h-[300px] md:h-[430px]" />
                  <div
                    className="absolute -bottom-4 -left-4 px-4 py-2"
                    style={{
                      ...THEME_TYPOGRAPHY.body,

                      background: THEME_COLORS.gold,
                      color: THEME_COLORS.text,
                    }}
                  >
                    OUR PEOPLE · OUR PLACE · OUR STORY
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <GallerySection
                  animationKey={animationKey}
                  getMotionProps={getMotionProps}
                  layout={lunaData.galleryLayout}
                  urls={lunaData.galleryUrls}
                  fallback={heroImage}
                  title="Memories"
                  isProtected={gallery.protected}
                  password={gallery.password}
                  unlockedSections={unlockedSections}
                  setUnlockedSections={setUnlockedSections}
                />
              </div>
            </div>
          </motion.section>
        )}

        {/* ==========================================================
            ATTIRE
           ========================================================== */}
        <motion.section
          id="dress-code"
          {...motionFor(0.17)}
          className="px-5 py-14 md:px-14 md:py-20"
          style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.text }}
        >
          <div className="mx-auto max-w-[1040px]">
            <MetaLine left="WEDDING · ATTIRE" right="06" />

            <div className="mt-10 grid gap-8 md:grid-cols-[.8fr_1.2fr]">
              <div>
                <p className="" style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.burgundy }}>
                  DRESS FOR THE MOMENT
                </p>

                <h2 className="mt-2" style={{ ...THEME_TYPOGRAPHY.heading, textTransform: "uppercase" }}>
                  WHAT
                  <br />
                  TO
                  <br />
                  WEAR
                </h2>

                <div className="mt-7 flex items-center gap-4">
                  <DiyaGraphic />
                  <p className="max-w-[220px] opacity-55" style={{ ...THEME_TYPOGRAPHY.body }}>
                    Traditional silhouettes, festive colour and your own beautiful style are all welcome.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {lunaData?.dressCode?.length ? (
                  lunaData.dressCode.map((dress: any, index: number) => (
                    <div
                      key={`dress-${index}`}
                      className="relative min-h-[230px] overflow-hidden border p-5"
                      style={{
                        borderColor: "rgba(17,17,17,.16)",
                      }}
                    >
                      <span className="absolute top-4 right-4" style={{ ...THEME_TYPOGRAPHY.heading, color: THEME_COLORS.gold }}>
                        ✦
                      </span>

                      <p className="" style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.burgundy }}>
                        0{index + 1} · ATTIRE
                      </p>

                      <h3 className="mt-12" style={{ ...THEME_TYPOGRAPHY.heading, textTransform: "uppercase", color: THEME_COLORS.text }}>
                        {dress.title || "FESTIVE"}
                      </h3>

                      <p className="mt-4 opacity-55" style={{ ...THEME_TYPOGRAPHY.body }}>
                        {dress.description || "Indian festive wear"}
                      </p>

                      {Array.isArray(dress.hexColors) && dress.hexColors.length > 0 && (
                        <div className="absolute bottom-5 left-5 flex gap-2">
                          {dress.hexColors.map((color: string, colorIndex: number) => (
                            <span
                              key={`${color}-${colorIndex}`}
                              className="h-6 w-6 rounded-full border-2 border-white shadow"
                              style={{
                                backgroundColor: color,
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div
                    className="col-span-full min-h-[230px] border p-5"
                    style={{
                      borderColor: "rgba(17,17,17,.16)",
                    }}
                  >
                    <p className="" style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.burgundy }}>
                      ATTIRE
                    </p>
                    <p className="mt-10" style={{ ...THEME_TYPOGRAPHY.heading, textTransform: "uppercase" }}>
                      FESTIVE
                      <br />
                      INDIAN WEAR
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.section>

        {/* ==========================================================
            MUSIC
           ========================================================== */}
        <motion.section id="music" {...motionFor(0.18)} className="px-5 py-14 md:px-14 md:py-20">
          <div className="mx-auto max-w-[1040px]">
            <MetaLine left="WEDDING · SOUNDTRACK" right="07" dark />

            <div className="mt-10 grid items-center gap-8 md:grid-cols-[.7fr_1.3fr]">
              <div className="relative mx-auto h-[220px] w-[220px]">
                <div className="absolute inset-0 rounded-full border border-white/10" />
                <div className="absolute inset-4 rounded-full border border-white/10" />
                <img src={heroImage} alt="" className="absolute inset-10 h-[140px] w-[140px] rounded-full object-cover" />
                <div
                  className="absolute top-1/2 left-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
                  style={{
                    background: THEME_COLORS.gold,
                    color: THEME_COLORS.text,
                  }}
                >
                  <ThemeIcon name="music" size={20} />
                </div>
              </div>

              <div>
                <p className="" style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.gold }}>
                  PRESS PLAY
                </p>

                <h2 className="mt-2" style={{ ...THEME_TYPOGRAPHY.heading, textTransform: "uppercase", color: THEME_COLORS.paper }}>
                  OUR
                  <br />
                  SOUNDTRACK
                </h2>

                <p className="mt-5 max-w-[430px]" style={{ ...THEME_TYPOGRAPHY.body, color: "rgba(242,233,216,.5)" }}>
                  A little music for the moments between rituals, laughter, dancing and everything in between.
                </p>

                <div className="mt-7">
                  <AudioPlayer
                    src={music?.background_audio ?? ""}
                    name={music?.background_audio_name || `${firstName} & ${secondName} · Wedding Soundtrack`}
                    cover={heroImage}
                    variant={music?.audio_player_variant}
                    allowMute={music?.allow_mute ?? true}
                    loop={music?.loop_music ?? true}
                    fadeIn={music?.fade_in ?? false}
                    fadeOut={music?.fade_out ?? false}
                    volume={music?.volume_level ?? 60}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ==========================================================
            BLESSINGS
           ========================================================== */}
        {!wishes.hidden && (
          <motion.section
            id="wishes"
            {...motionFor(0.19)}
            className="relative px-5 py-14 md:px-14 md:py-20"
            style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.text }}
          >
            <div className="mx-auto max-w-[1040px]">
              <MetaLine left="WEDDING · BLESSINGS" right="08" />

              <div className="mt-10 grid gap-8 md:grid-cols-[.85fr_1.15fr] md:items-start">
                <div>
                  <CrestMark className="h-40 w-32" />

                  <h2 className="mt-2" style={{ ...THEME_TYPOGRAPHY.heading, textTransform: "uppercase" }}>
                    SEND
                    <br />
                    SOME
                    <br />
                    LOVE
                  </h2>
                </div>

                <WishesSection
                  animationKey={animationKey}
                  getMotionProps={getMotionProps}
                  eventKey={eventKey}
                  wishesRaw={lunaData.wishesRaw}
                  wishesContainerRef={wishesContainerRef}
                  wishRefreshKey={wishRefreshKey}
                  setWishRefreshKey={setWishRefreshKey}
                  title={lunaData.wishesTitle || "Blessings & Wishes"}
                  isIcon={false}
                  isProtected={wishes.protected}
                  password={wishes.password}
                  unlockedSections={unlockedSections}
                  setUnlockedSections={setUnlockedSections}
                />
              </div>
            </div>
          </motion.section>
        )}

        {/* ==========================================================
            RSVP
           ========================================================== */}
        <motion.section id="rsvp" {...motionFor(0.2)} className="px-5 py-16 md:px-14 md:py-24">
          <div className="mx-auto max-w-[850px]" style={{ ...THEME_TYPOGRAPHY.body, textAlign: "center" }}>
            <MetaLine left="WEDDING · RSVP" right="09" dark />

            <div className="mt-12">
              <p className="" style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.gold }}>
                YOUR PRESENCE MATTERS
              </p>

              <h2 className="mt-3" style={{ ...THEME_TYPOGRAPHY.heading, textTransform: "uppercase", color: THEME_COLORS.paper }}>
                WILL
                <br />
                YOU JOIN
                <br />
                US?
              </h2>

              <p className="mx-auto mt-6 max-w-[420px]" style={{ ...THEME_TYPOGRAPHY.body, color: "rgba(242,233,216,.5)" }}>
                We would be honoured to celebrate this beautiful beginning with you.
              </p>

              <div className="mx-auto mt-8 grid max-w-[560px] gap-3 sm:grid-cols-2">
                <button
                  onClick={() => setRsvp("yes")}
                  className="flex items-center justify-center gap-2 py-4"
                  style={{
                    ...THEME_TYPOGRAPHY.body,

                    background: rsvp === "yes" ? THEME_COLORS.gold : "transparent",
                    border: `1px solid ${THEME_COLORS.gold}`,
                    color: rsvp === "yes" ? THEME_COLORS.text : THEME_COLORS.gold,
                  }}
                >
                  <ThemeIcon name="check" size={14} />
                  YES, I'LL BE THERE
                </button>

                <button
                  onClick={() => setRsvp("no")}
                  className="flex items-center justify-center gap-2 py-4"
                  style={{
                    ...THEME_TYPOGRAPHY.body,

                    background: rsvp === "no" ? THEME_COLORS.gold : "transparent",
                    border: "1px solid rgba(242,233,216,.25)",
                    color: rsvp === "no" ? THEME_COLORS.text : "rgba(242,233,216,.65)",
                  }}
                >
                  <ThemeIcon name="close" size={14} />
                  SEND REGRETS
                </button>
              </div>

              <button
                className="mt-5 px-8 py-3"
                style={{
                  ...THEME_TYPOGRAPHY.body,

                  background: THEME_COLORS.gold,
                  color: THEME_COLORS.text,
                }}
              >
                RSVP NOW ↗
              </button>
            </div>
          </div>
        </motion.section>

        {/* ==========================================================
            BACK COVER
           ========================================================== */}
        <motion.section
          {...motionFor(0.22)}
          className="relative min-h-[520px] overflow-hidden px-5 py-14 md:min-h-[650px] md:px-14 md:py-20"
          style={{ ...THEME_TYPOGRAPHY.body, textAlign: "center" }}
        >
          <img src={FREE_IMAGES.palace} alt="" className="absolute inset-0 h-full w-full object-cover opacity-[0.18] grayscale" />

          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(180deg, rgba(17,17,17,.45), rgba(17,17,17,.94))",
            }}
          />

          <div className="relative mx-auto flex max-w-[1040px] flex-col items-center">
            <MetaLine left="WEDDING CELEBRATION" right="THE END" dark />

            <CrestMark className="mt-14 h-48 w-40" />

            <p className="mt-3" style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.gold }}>
              WITH LOVE FROM OUR FAMILIES
            </p>

            <h2 className="mt-4" style={{ ...THEME_TYPOGRAPHY.heading, textTransform: "uppercase", color: THEME_COLORS.paper }}>
              SEE YOU
              <br />
              THERE.
            </h2>

            <p className="mt-6 max-w-[400px]" style={{ ...THEME_TYPOGRAPHY.body, color: "rgba(242,233,216,.52)" }}>
              {firstName} &amp; {secondName}
              <br />
              {primaryDate ? `${primaryDay} · ${primaryDateNumber} ${primaryMonth} ${primaryYear}` : "A beautiful beginning"}
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-x-5 gap-y-3">
              {navItems.map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  className=""
                  style={{ ...THEME_TYPOGRAPHY.body, color: "rgba(242,233,216,.58)" }}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="mt-9 flex gap-5" style={{ color: THEME_COLORS.gold }}>
              <span aria-label="Instagram">◎</span>
              <span aria-label="Facebook">f</span>
              <span aria-label="WhatsApp">◌</span>
            </div>
          </div>
        </motion.section>

        {/* ==========================================================
            MOBILE MENU
           ========================================================== */}
        {menuOpen && (
          <div
            className="fixed inset-0 z-50 mx-auto w-full max-w-[430px] overflow-y-auto"
            style={{ background: THEME_COLORS.text, color: THEME_COLORS.paper }}
          >
            <div className="px-6 pt-7 pb-6">
              <div className="flex items-center justify-between border-b pb-5">
                <div className="" style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.gold }}>
                  WEDDING CELEBRATION
                </div>

                <button onClick={() => setMenuOpen(false)} aria-label="Close menu">
                  <ThemeIcon name="close" size={24} />
                </button>
              </div>

              <div className="mt-8">
                {navItems.map(([id, label, icon], index) => (
                  <button
                    key={id}
                    onClick={() => scrollTo(id)}
                    className="flex w-full items-center justify-between border-b py-5"
                    style={{
                      borderColor: "rgba(242,233,216,.14)",
                    }}
                  >
                    <span className="flex items-center gap-4">
                      <span
                        className="flex h-8 w-8 items-center justify-center rounded-full border"
                        style={{
                          borderColor: THEME_COLORS.gold,
                          color: THEME_COLORS.gold,
                        }}
                      >
                        <ThemeIcon name={icon} size={13} />
                      </span>
                      <span className="" style={{ ...THEME_TYPOGRAPHY.body }}>
                        {label}
                      </span>
                    </span>

                    <span className="" style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.gold }}>
                      0{index + 1}
                    </span>
                  </button>
                ))}
              </div>

              <div className="mt-12" style={{ ...THEME_TYPOGRAPHY.body, textAlign: "center" }}>
                <p className="" style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.gold }}>
                  {firstName} &amp; {secondName}
                </p>
                <p className="mt-2 opacity-45" style={{ ...THEME_TYPOGRAPHY.body }}>
                  {primaryVenue}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
