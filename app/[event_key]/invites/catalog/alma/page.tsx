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
import WishesSection from "../components/common/WishesSection";
import { ThemeIcon, type ThemeIconName } from "../../core/core/themeIcons";
import { ThemeSectionTitle } from "../../core/core/ThemeSectionTitle";
import AudioPlayer from "../../../../../components/ui/AudioPlayer";

interface LunaProps {
  data: any;
  eventKey: string;
  motionData: any;
  settings: any;
  theme?: any;
  music?: any;
}

/**
 * ALMA
 * A completely new Indian editorial wedding invitation.
 *
 * Design language:
 * - warm ivory paper
 * - vermilion / sindoor red
 * - muted haldi yellow
 * - antique gold
 * - Indian mandala + arch geometry
 * - editorial typography
 * - asymmetric portfolio-inspired composition, but designed as an invitation
 *
 * Content remains data-first: LunaData is the primary source.
 * The fallback values are only wedding-specific demo values.
 */

const FALLBACK_HERO = "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=88";

const FALLBACK_GALLERY = [
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=900&q=85",
];

const COLORS = {
  ivory: "#F7F0E4",
  paper: "#FFF9EF",
  ink: "#241B18",
  vermilion: "#A63D2F",
  vermilionDark: "#75261F",
  haldi: "#D5A743",
  sage: "#777C5E",
  line: "rgba(72, 47, 37, .18)",
  white: "#FFFDF8",
};

const bodyFont = "var(--font-body, Inter, ui-sans-serif, system-ui, sans-serif)";
const displayFont = "var(--font-accent, 'Cormorant Garamond', Georgia, serif)";

function Mandala({ size = 220, className = "" }: { size?: number; className?: string }) {
  const petals = Array.from({ length: 12 }, (_, i) => i * 30);

  return (
    <svg width={size} height={size} viewBox="0 0 220 220" aria-hidden="true" className={className}>
      <g fill="none" stroke={COLORS.haldi} strokeWidth="1">
        <circle cx="110" cy="110" r="88" opacity=".55" />
        <circle cx="110" cy="110" r="65" opacity=".5" />
        <circle cx="110" cy="110" r="38" opacity=".7" />
        {petals.map((angle) => (
          <ellipse key={angle} cx="110" cy="43" rx="18" ry="54" transform={`rotate(${angle} 110 110)`} opacity=".42" />
        ))}
        <path d="M110 74 L146 110 L110 146 L74 110 Z" opacity=".75" />
        <circle cx="110" cy="110" r="8" fill={COLORS.haldi} opacity=".8" />
      </g>
    </svg>
  );
}

function CornerMotif() {
  return (
    <svg viewBox="0 0 100 100" className="h-20 w-20" aria-hidden="true">
      <path d="M10 90 C15 55 32 30 62 18 C73 14 84 12 92 10" fill="none" stroke={COLORS.haldi} strokeWidth="1.2" />
      <path d="M22 88 C26 62 42 42 67 30 C76 26 84 23 91 20" fill="none" stroke={COLORS.vermilion} strokeWidth=".8" opacity=".7" />
      <circle cx="69" cy="29" r="3" fill={COLORS.haldi} />
      <circle cx="82" cy="19" r="2" fill={COLORS.vermilion} />
    </svg>
  );
}

export default function Alma({ data, eventKey, motionData, settings, music }: LunaProps) {
  const luna = useInviteData(data);
  const { getMotionProps } = useThemeAnimation(design?.motion);
  const animationKey = useMemo(() => getAnimationKey(design?.motion), [design?.motion]);

  const [menuOpen, setMenuOpen] = useState(false);
  const [rsvp, setRsvp] = useState<"yes" | "no" | null>(null);
  const [wishRefreshKey, setWishRefreshKey] = useState(0);
  const wishesContainerRef = useRef<HTMLElement | null>(null);

  const galleryConfig = getSectionConfig(settings?.section_visibility, "gallery");
  const wishesConfig = getSectionConfig(settings?.section_visibility, "wishes");
  const { unlockedSections, setUnlockedSections } = useUnlockedSections(eventKey);

  /*
   * Explicit bride/groom fallbacks keep the demo wedding coherent.
   * When real Luna data exists, it always wins.
   */
  const brideName = luna.brideName || luna.announcement?.couple?.brideName || luna.firstName || "Aparna";

  const groomName = luna.groomName || luna.announcement?.couple?.groomName || luna.secondName || "Evin";

  const monogram = luna.announcement?.couple?.monogram || `${brideName.charAt(0)}${groomName.charAt(0)}`;

  const familyLabel = luna.announcement?.couple?.familyLabel || "WITH THE BLESSINGS OF OUR FAMILIES";

  const announcementTitle = luna.announcement?.announcement?.title || "We are getting married";

  const announcementMessage = luna.announcement?.announcement?.message || "Two families, one beautiful beginning.";

  const heroImage = luna.heroImage || FALLBACK_HERO;
  const galleryUrls = Array.isArray(luna.galleryUrls) && luna.galleryUrls.length ? luna.galleryUrls : FALLBACK_GALLERY;

  const functions = luna.eventFunctions?.length
    ? luna.eventFunctions
    : [
        {
          function_key: "haldi",
          title: "Haldi",
          date: "2026-12-10",
          locationName: "The Courtyard, Jaipur",
          description: "An afternoon of sunshine, marigolds & laughter.",
        },
        {
          function_key: "mehndi",
          title: "Mehndi",
          date: "2026-12-11",
          locationName: "The Courtyard, Jaipur",
          description: "Henna, music and an evening under the stars.",
        },
        {
          function_key: "wedding",
          title: "Wedding",
          date: "2026-12-12",
          locationName: "The Palace Lawn, Jaipur",
          description: "The sacred ceremony begins at 5:30 PM.",
        },
        {
          function_key: "reception",
          title: "Reception",
          date: "2026-12-12",
          locationName: "The Palace Courtyard, Jaipur",
          description: "Dinner, dancing and our first celebration as a married couple.",
        },
      ];

  const primaryFunction =
    luna.primaryFunction ||
    functions.find((fn: any) =>
      String(fn.function_key || fn.title || "")
        .toLowerCase()
        .includes("wedding"),
    ) ||
    functions[0];

  const primaryDate = primaryFunction?.startTime
    ? new Date(primaryFunction.startTime)
    : primaryFunction?.date
      ? new Date(primaryFunction.date)
      : new Date("2026-12-12T17:30:00");

  const primaryDateValid = !Number.isNaN(primaryDate.getTime());

  const primaryDay = primaryDateValid ? primaryDate.toLocaleDateString("en-IN", { weekday: "long" }) : "Saturday";

  const primaryDateLabel = primaryDateValid
    ? primaryDate
        .toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
        .toUpperCase()
    : "12 DECEMBER 2026";

  const primaryTime = primaryDateValid
    ? primaryDate.toLocaleTimeString("en-IN", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    : "5:30 PM";

  const primaryVenue = primaryFunction?.locationName || "The Palace Lawn, Jaipur";

  const primaryYear = primaryDateValid ? primaryDate.getFullYear() : 2026;
  const primaryMonth = primaryDateValid ? primaryDate.getMonth() : 11;
  const primaryDayNumber = primaryDateValid ? primaryDate.getDate() : 12;

  const dressCode =
    Array.isArray(luna.dressCode) && luna.dressCode.length
      ? luna.dressCode
      : [
          {
            title: "Wedding Day",
            description: "Jewel tones, ivory, muted gold and festive Indian silhouettes.",
            hexColors: ["#8E2F28", "#D6A94B", "#F5E8D0", "#3F5142"],
          },
        ];

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const motionFor = (delay: number) => {
    const { key: _key, ...props } = getMotionProps(delay);
    return props;
  };

  const navItems: Array<[string, string, ThemeIconName]> = [
    ["story", "OUR STORY", "heart"],
    ["functions", "CELEBRATIONS", "calendar"],
    ["gallery", "MOMENTS", "image"],
    ["music", "MUSIC", "music"],
    ["dress-code", "DRESS", "shirt"],
    ["rsvp", "RSVP", "phone"],
  ];

  return (
    <main
      key={animationKey}
      className="relative mx-auto min-h-screen w-full max-w-[1440px] overflow-x-hidden"
      style={
        {
          "--animation-enabled": design?.motion?.animations === false ? "0" : "1",
          "--animation-style": design?.motion?.animation_style ?? "smooth",
          "--animation-scroll": design?.motion?.scroll_behavior ?? "on-scroll",
          "--animation-duration": design?.motion?.animation_duration ?? "1s",
          "--animation-delay": design?.motion?.animation_delay ?? "0ms",
          "--animation-speed": `${design?.motion?.animation_speed ?? 50}`,
          "--animation-loop": design?.motion?.animation_loop ? "1" : "0",
          background: COLORS.ivory,
          color: COLORS.ink,
          fontFamily: bodyFont,
        } as CSSProperties
      }
    >
      {/* Floating mobile navigation */}
      <div className="fixed right-4 bottom-4 z-50 md:hidden">
        <button
          type="button"
          aria-label="Open invitation menu"
          onClick={() => setMenuOpen(true)}
          className="flex h-12 w-12 items-center justify-center rounded-full border shadow-lg backdrop-blur"
          style={{
            borderColor: COLORS.vermilion,
            background: COLORS.paper,
            color: COLORS.vermilion,
          }}
        >
          <ThemeIcon name="menu" size={22} />
        </button>
      </div>

      <div className="relative">
        {/* Decorative edge motifs */}
        <div className="pointer-events-none absolute top-0 left-0 z-0 opacity-70">
          <CornerMotif />
        </div>
        <div className="pointer-events-none absolute top-24 right-[-36px] z-0 opacity-50">
          <Mandala size={180} />
        </div>

        {/* HERO */}
        <motion.section {...motionFor(0)} className="relative px-5 pt-7 pb-8 sm:px-8 md:px-12 md:pt-10 lg:px-20">
          <div
            className="mx-auto grid max-w-[1180px] overflow-hidden border-y md:grid-cols-[1.1fr_.9fr]"
            style={{ borderColor: COLORS.line }}
          >
            <div
              className="relative flex min-h-[570px] flex-col justify-between overflow-hidden p-6 sm:p-9 md:min-h-[690px] md:p-12"
              style={{ background: COLORS.paper }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[9px] font-medium tracking-[.3em]" style={{ color: COLORS.vermilion }}>
                    ALMA / WEDDING EDITION
                  </p>
                  <p className="mt-2 text-[8px] tracking-[.18em]" style={{ color: COLORS.sage }}>
                    {primaryYear}
                  </p>
                </div>

                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full border text-[10px]"
                  style={{
                    borderColor: COLORS.haldi,
                    color: COLORS.vermilion,
                    fontFamily: displayFont,
                  }}
                >
                  {monogram}
                </div>
              </div>

              <div className="relative z-10 mt-14">
                <p className="mb-4 text-[9px] tracking-[.26em]" style={{ color: COLORS.sage }}>
                  {familyLabel}
                </p>

                <h1
                  className="max-w-[680px] text-[70px] leading-[.78] tracking-[-.055em] sm:text-[92px] md:text-[116px] lg:text-[132px]"
                  style={{
                    color: COLORS.vermilionDark,
                    fontFamily: displayFont,
                    fontWeight: 500,
                  }}
                >
                  {brideName}
                  <span className="block pl-[.22em]" style={{ color: COLORS.ink }}>
                    {groomName}
                  </span>
                </h1>

                <div className="mt-7 flex items-center gap-3">
                  <span className="h-px w-12" style={{ background: COLORS.haldi }} />
                  <span className="text-[10px] tracking-[.24em] uppercase" style={{ color: COLORS.vermilion }}>
                    {announcementTitle}
                  </span>
                </div>

                <p className="mt-5 max-w-[390px] text-[12px] leading-6" style={{ color: COLORS.sage }}>
                  {announcementMessage}
                </p>
              </div>

              <div className="mt-10 flex items-end justify-between">
                <div>
                  <p className="text-[8px] tracking-[.2em] uppercase" style={{ color: COLORS.sage }}>
                    SAVE THE DATE
                  </p>
                  <p className="mt-1 text-[17px]" style={{ color: COLORS.ink, fontFamily: displayFont }}>
                    {primaryDateLabel}
                  </p>
                </div>

                <Mandala size={110} className="-mb-4 opacity-70" />
              </div>
            </div>

            <div className="relative min-h-[520px] md:min-h-[690px]">
              <img src={heroImage} alt={`${brideName} and ${groomName}`} className="h-full w-full object-cover" />

              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(180deg, rgba(30,18,13,.02), rgba(70,20,14,.30))",
                }}
              />

              <div className="absolute top-5 right-5 left-5 flex justify-between text-[8px] tracking-[.22em] text-white/90">
                <span>SHUBH VIVAH</span>
                <span>01 / 06</span>
              </div>

              <div className="absolute right-5 bottom-5 left-5 flex items-end justify-between">
                <div className="max-w-[240px] text-white">
                  <p className="text-[8px] tracking-[.22em] uppercase">{primaryVenue}</p>
                  <p className="mt-2 text-[28px] leading-none" style={{ fontFamily: displayFont }}>
                    Together, by grace.
                  </p>
                </div>

                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-xs"
                  style={{ color: COLORS.vermilion }}
                >
                  <ThemeIcon name="heart" size={18} />
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* INTRO STRIP */}
        <motion.section
          {...motionFor(0.08)}
          className="border-y px-5 py-7 sm:px-8 md:px-12 lg:px-20"
          style={{
            borderColor: COLORS.line,
            background: COLORS.vermilion,
            color: COLORS.paper,
          }}
        >
          <div className="mx-auto grid max-w-[1180px] gap-5 md:grid-cols-[.7fr_1.6fr_.7fr] md:items-center">
            <div className="text-center md:text-left">
              <span className="text-[8px] tracking-[.25em] opacity-75">OUR DAY</span>
              <strong className="mt-1 block text-[18px]" style={{ fontFamily: displayFont }}>
                {primaryDay}
              </strong>
            </div>

            <p className="text-center text-[14px] leading-6 md:text-[16px]" style={{ fontFamily: displayFont }}>
              “A marriage is not only a promise between two hearts, but a celebration shared by every heart that brought them here.”
            </p>

            <div className="text-center md:text-right">
              <span className="text-[8px] tracking-[.25em] opacity-75">CEREMONY</span>
              <strong className="mt-1 block text-[18px]" style={{ fontFamily: displayFont }}>
                {primaryTime}
              </strong>
            </div>
          </div>
        </motion.section>

        {/* NAV */}
        <section className="hidden border-b md:block" style={{ borderColor: COLORS.line, background: COLORS.paper }}>
          <div className="mx-auto grid max-w-[1180px] grid-cols-6">
            {navItems.map(([id, label, icon]) => (
              <button
                key={id}
                type="button"
                onClick={() => scrollTo(id)}
                className="group flex min-h-[84px] flex-col items-center justify-center gap-2 border-r px-3 transition hover:bg-white"
                style={{ borderColor: COLORS.line }}
              >
                <span className="transition-transform group-hover:-translate-y-0.5" style={{ color: COLORS.vermilion }}>
                  <ThemeIcon name={icon} size={19} />
                </span>
                <span className="text-[8px] tracking-[.18em]" style={{ color: COLORS.ink }}>
                  {label}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* STORY */}
        <motion.section id="story" {...motionFor(0.1)} className="relative px-5 py-14 sm:px-8 md:px-12 md:py-20 lg:px-20">
          <div className="mx-auto grid max-w-[1180px] gap-10 md:grid-cols-[.75fr_1.25fr] md:items-center">
            <div className="relative">
              <p className="text-[8px] tracking-[.28em]" style={{ color: COLORS.vermilion }}>
                CHAPTER ONE
              </p>
              <h2
                className="mt-3 text-[58px] leading-[.84] md:text-[82px]"
                style={{
                  fontFamily: displayFont,
                  color: COLORS.ink,
                  fontWeight: 500,
                }}
              >
                Our
                <br />
                <span style={{ color: COLORS.vermilion }}>story.</span>
              </h2>
              <p className="mt-7 max-w-[340px] text-[12px] leading-6" style={{ color: COLORS.sage }}>
                From a simple hello to a thousand little memories, Evin and Aparna found a home in each other. Now they are bringing the
                people they love together to begin their next chapter.
              </p>

              <div className="mt-8 flex items-center gap-3">
                <span className="h-9 w-9 rounded-full border" style={{ borderColor: COLORS.haldi }} />
                <span className="h-px w-20" style={{ background: COLORS.haldi }} />
                <span className="text-[8px] tracking-[.22em]" style={{ color: COLORS.vermilion }}>
                  TWO HEARTS / ONE HOME
                </span>
              </div>
            </div>

            <div className="relative">
              <div className="grid grid-cols-[1.05fr_.95fr] gap-3">
                <div
                  className="relative overflow-hidden"
                  style={{
                    borderRadius: "110px 110px 8px 8px",
                    background: COLORS.paper,
                  }}
                >
                  <img src={galleryUrls[0]} alt="Wedding moment" className="h-[430px] w-full object-cover" />
                  <div
                    className="absolute right-3 bottom-3 left-3 rounded-sm p-3 backdrop-blur-sm"
                    style={{ background: "rgba(255,249,239,.88)" }}
                  >
                    <p className="text-[8px] tracking-[.18em]" style={{ color: COLORS.vermilion }}>
                      A LITTLE BIT OF MAGIC
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <div
                    className="flex flex-1 items-center justify-center border p-5"
                    style={{
                      borderColor: COLORS.line,
                      background: COLORS.paper,
                    }}
                  >
                    <Mandala size={150} />
                  </div>
                  <div className="overflow-hidden" style={{ background: COLORS.sage }}>
                    <img
                      src={galleryUrls[1] || heroImage}
                      alt="Celebration detail"
                      className="h-[180px] w-full object-cover opacity-90 mix-blend-luminosity"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* TIMELINE */}
        <motion.section
          id="functions"
          {...motionFor(0.14)}
          className="border-y px-5 py-14 sm:px-8 md:px-12 md:py-20 lg:px-20"
          style={{ borderColor: COLORS.line, background: COLORS.paper }}
        >
          <div className="mx-auto max-w-[1180px]">
            <div className="mb-10 flex items-end justify-between gap-5">
              <div>
                <p className="text-[8px] tracking-[.28em]" style={{ color: COLORS.vermilion }}>
                  THE CELEBRATIONS
                </p>
                <h2 className="mt-2 text-[54px] leading-none md:text-[76px]" style={{ fontFamily: displayFont, fontWeight: 500 }}>
                  Three days,
                  <br />
                  <span style={{ color: COLORS.vermilion }}>many memories.</span>
                </h2>
              </div>
              <Mandala size={120} className="hidden md:block" />
            </div>

            <div className="divide-y" style={{ borderColor: COLORS.line }}>
              {functions.map((fn: any, index: number) => {
                const date = fn.date ? new Date(fn.date) : null;
                const valid = date && !Number.isNaN(date.getTime());
                const day = valid ? date!.getDate() : index + 10;
                const month = valid ? date!.toLocaleString("en-IN", { month: "short" }).toUpperCase() : "DEC";

                return (
                  <motion.div
                    key={fn.function_key ?? `${fn.title}-${index}`}
                    {...motionFor(0.18 + index * 0.06)}
                    className="grid gap-5 py-6 md:grid-cols-[100px_1fr_260px_40px] md:items-center"
                  >
                    <div className="flex items-center gap-3 md:block">
                      <div
                        className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-full"
                        style={{
                          background: COLORS.vermilion,
                          color: COLORS.paper,
                        }}
                      >
                        <span className="text-[20px] leading-none" style={{ fontFamily: displayFont }}>
                          {day}
                        </span>
                        <span className="text-[7px] tracking-[.1em]">{month}</span>
                      </div>
                    </div>

                    <div>
                      <p className="text-[9px] tracking-[.25em]" style={{ color: COLORS.vermilion }}>
                        {String(fn.title || "Celebration").toUpperCase()}
                      </p>
                      <h3 className="mt-1 text-[31px] leading-none" style={{ fontFamily: displayFont }}>
                        {fn.title || "Wedding Celebration"}
                      </h3>
                      <p className="mt-2 max-w-[560px] text-[11px] leading-5" style={{ color: COLORS.sage }}>
                        {fn.description || "Come celebrate this beautiful moment with us."}
                      </p>
                    </div>

                    <div className="md:text-right">
                      <p className="text-[10px]" style={{ color: COLORS.ink }}>
                        {fn.locationName || primaryVenue}
                      </p>
                      <p className="mt-1 text-[9px] tracking-[.1em]" style={{ color: COLORS.sage }}>
                        {fn.startTime
                          ? new Date(fn.startTime).toLocaleTimeString("en-IN", {
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            })
                          : "Details to follow"}
                      </p>
                    </div>

                    <div
                      className="hidden h-9 w-9 items-center justify-center rounded-full border md:flex"
                      style={{
                        borderColor: COLORS.line,
                        color: COLORS.vermilion,
                      }}
                    >
                      <ThemeIcon name={index === 1 ? "music" : index === 3 ? "gift" : "heart"} size={16} />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.section>

        {/* CALENDAR + LOCATION */}
        <motion.section {...motionFor(0.17)} className="px-5 py-14 sm:px-8 md:px-12 md:py-20 lg:px-20">
          <div className="mx-auto grid max-w-[1180px] gap-4 md:grid-cols-[.8fr_1.2fr]">
            <div
              className="relative overflow-hidden p-6 sm:p-9"
              style={{
                background: COLORS.vermilion,
                color: COLORS.paper,
              }}
            >
              <div className="absolute top-0 right-0 opacity-20">
                <Mandala size={210} />
              </div>

              <p className="relative text-[8px] tracking-[.28em] opacity-75">MARK YOUR CALENDAR</p>
              <h2 className="relative mt-3 text-[48px] leading-[.86] sm:text-[60px]" style={{ fontFamily: displayFont }}>
                {primaryDay}
                <br />
                <span style={{ color: "#E9C86B" }}>{primaryDateLabel}</span>
              </h2>

              <div className="relative mt-8 flex items-center gap-3">
                <ThemeIcon name="clock" size={18} />
                <span className="text-[10px] tracking-[.12em]">CEREMONY FROM {primaryTime}</span>
              </div>

              <div className="relative mt-4 flex items-start gap-3">
                <ThemeIcon name="venue" size={18} />
                <span className="text-[10px] leading-5">{primaryVenue}</span>
              </div>
            </div>

            <div
              className="flex items-center justify-center border p-5 sm:p-8"
              style={{
                borderColor: COLORS.line,
                background: COLORS.paper,
              }}
            >
              <WeddingCalendar year={primaryYear} month={primaryMonth} selectedDate={primaryDayNumber} />
            </div>
          </div>
        </motion.section>

        {/* GALLERY */}
        {!galleryConfig.hidden && (
          <motion.section id="gallery" {...motionFor(0.2)} className="px-5 py-14 sm:px-8 md:px-12 md:py-20 lg:px-20">
            <div className="mx-auto max-w-[1180px]">
              <div className="mb-8 flex items-end justify-between">
                <div>
                  <p className="text-[8px] tracking-[.28em]" style={{ color: COLORS.vermilion }}>
                    FRAMES FROM US
                  </p>
                  <h2 className="mt-2 text-[58px] leading-none md:text-[80px]" style={{ fontFamily: displayFont }}>
                    Little
                    <br />
                    <span style={{ color: COLORS.vermilion }}>moments.</span>
                  </h2>
                </div>
                <div className="hidden text-right text-[8px] tracking-[.2em] md:block" style={{ color: COLORS.sage }}>
                  LOVE / FAMILY / LAUGHTER
                  <br />
                  {String(galleryUrls.length).padStart(2, "0")} FRAMES
                </div>
              </div>

              <GallerySection
                animationKey={animationKey}
                getMotionProps={getMotionProps}
                layout={luna.galleryLayout}
                urls={galleryUrls}
                fallback={heroImage}
                title=""
                isProtected={galleryConfig.protected}
                password={galleryConfig.password}
                unlockedSections={unlockedSections}
                setUnlockedSections={setUnlockedSections}
              />
            </div>
          </motion.section>
        )}

        {/* MUSIC */}
        <motion.section
          id="music"
          {...motionFor(0.21)}
          className="border-y px-5 py-12 sm:px-8 md:px-12 md:py-16 lg:px-20"
          style={{ borderColor: COLORS.line, background: COLORS.sage }}
        >
          <div className="mx-auto grid max-w-[1180px] gap-8 md:grid-cols-[.7fr_1.3fr] md:items-center">
            <div style={{ color: COLORS.paper }}>
              <p className="text-[8px] tracking-[.28em] opacity-75">PLAY OUR CHAPTER</p>
              <h2 className="mt-2 text-[52px] leading-[.86] md:text-[70px]" style={{ fontFamily: displayFont }}>
                A song for
                <br />
                our forever.
              </h2>
              <p className="mt-4 max-w-[320px] text-[11px] leading-5 opacity-80">
                A little soundtrack for the people who are joining us on this beautiful day.
              </p>
            </div>

            <div className="rounded-sm p-3 sm:p-5" style={{ background: COLORS.paper }}>
              <AudioPlayer
                src={data?.music?.background_audio ?? ""}
                name={data?.music?.background_audio_name ?? "Our Wedding Song"}
                cover={galleryUrls[2] || heroImage}
                variant={data?.music?.audio_player_variant}
                allowMute={data?.music?.allow_mute ?? true}
                loop={data?.music?.loop_music ?? true}
                fadeIn={data?.music?.fade_in ?? false}
                fadeOut={data?.music?.fade_out ?? false}
                volume={data?.music?.volume_level ?? 60}
              />
            </div>
          </div>
        </motion.section>

        {/* DRESS */}
        <motion.section id="dress-code" {...motionFor(0.22)} className="px-5 py-14 sm:px-8 md:px-12 md:py-20 lg:px-20">
          <div className="mx-auto max-w-[1180px]">
            <div className="grid gap-8 md:grid-cols-[.8fr_1.2fr] md:items-start">
              <div>
                <p className="text-[8px] tracking-[.28em]" style={{ color: COLORS.vermilion }}>
                  COME AS YOU ARE
                </p>
                <h2 className="mt-2 text-[58px] leading-[.84] md:text-[78px]" style={{ fontFamily: displayFont }}>
                  Festive
                  <br />
                  <span style={{ color: COLORS.vermilion }}>and joyful.</span>
                </h2>
              </div>

              <div className="space-y-5">
                {dressCode.map((dress: any, index: number) => (
                  <motion.div
                    key={`dress-${index}`}
                    {...motionFor(0.25 + index * 0.08)}
                    className="border p-5 sm:p-7"
                    style={{
                      borderColor: COLORS.line,
                      background: COLORS.paper,
                    }}
                  >
                    <div className="flex items-start justify-between gap-5">
                      <div>
                        <p className="text-[9px] tracking-[.2em]" style={{ color: COLORS.vermilion }}>
                          DRESS NOTE
                        </p>
                        <h3 className="mt-1 text-[28px]" style={{ fontFamily: displayFont }}>
                          {dress.title || "Wedding Day"}
                        </h3>
                      </div>
                      <ThemeIcon name="shirt" size={20} />
                    </div>

                    <p className="mt-3 max-w-[520px] text-[11px] leading-5" style={{ color: COLORS.sage }}>
                      {dress.description || "Wear something festive, comfortable and full of colour."}
                    </p>

                    {Array.isArray(dress.hexColors) && dress.hexColors.length > 0 && (
                      <div className="mt-6 flex gap-3">
                        {dress.hexColors.map((color: string, colorIndex: number) => (
                          <span
                            key={`${color}-${colorIndex}`}
                            className="h-8 w-8 rounded-full border"
                            style={{
                              backgroundColor: color,
                              borderColor: COLORS.paper,
                              boxShadow: `0 0 0 1px ${COLORS.line}`,
                            }}
                            title={color}
                          />
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* WISHES */}
        {!wishesConfig.hidden && (
          <section
            id="wishes"
            className="border-t px-5 py-14 sm:px-8 md:px-12 md:py-20 lg:px-20"
            style={{
              borderColor: COLORS.line,
              background: COLORS.paper,
            }}
          >
            <div className="mx-auto max-w-[1180px]">
              <div className="mb-8 flex items-end justify-between">
                <div>
                  <p className="text-[8px] tracking-[.28em]" style={{ color: COLORS.vermilion }}>
                    FROM OUR PEOPLE
                  </p>
                  <h2 className="mt-2 text-[56px] leading-none md:text-[76px]" style={{ fontFamily: displayFont }}>
                    Your words,
                    <br />
                    <span style={{ color: COLORS.vermilion }}>our keepsake.</span>
                  </h2>
                </div>
                <div className="hidden md:block">
                  <Mandala size={120} />
                </div>
              </div>

              <WishesSection
                animationKey={animationKey}
                getMotionProps={getMotionProps}
                eventKey={eventKey}
                wishesRaw={luna.wishesRaw}
                wishesContainerRef={wishesContainerRef}
                wishRefreshKey={wishRefreshKey}
                setWishRefreshKey={setWishRefreshKey}
                title={luna.wishesTitle ?? "Best Wishes"}
                isIcon={false}
                isProtected={wishesConfig.protected}
                password={wishesConfig.password}
                unlockedSections={unlockedSections}
                setUnlockedSections={setUnlockedSections}
              />
            </div>
          </section>
        )}

        {/* RSVP */}
        <motion.section
          id="rsvp"
          {...motionFor(0.24)}
          className="relative overflow-hidden px-5 py-16 sm:px-8 md:px-12 md:py-24 lg:px-20"
          style={{
            background: COLORS.ink,
            color: COLORS.paper,
          }}
        >
          <div className="pointer-events-none absolute top-1/2 right-[-70px] -translate-y-1/2 opacity-20">
            <Mandala size={420} />
          </div>

          <div className="relative mx-auto grid max-w-[900px] gap-10 md:grid-cols-[1fr_330px] md:items-center">
            <div>
              <p className="text-[8px] tracking-[.3em] opacity-60">WE HOPE YOU&apos;LL JOIN US</p>
              <h2 className="mt-3 text-[62px] leading-[.82] md:text-[88px]" style={{ fontFamily: displayFont }}>
                Say
                <br />
                <span style={{ color: "#D6A94B" }}>yes.</span>
              </h2>
              <p className="mt-5 max-w-[400px] text-[11px] leading-5 opacity-70">
                Your presence will make our celebration complete. Kindly let us know if you can join us for this special day.
              </p>
            </div>

            <div className="p-5 sm:p-7" style={{ background: COLORS.paper, color: COLORS.ink }}>
              <p className="text-[8px] tracking-[.2em]" style={{ color: COLORS.vermilion }}>
                RSVP
              </p>

              <p className="mt-3 text-[30px] leading-none" style={{ fontFamily: displayFont }}>
                Will we see you there?
              </p>

              <div className="mt-6 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRsvp("yes")}
                  className="flex items-center justify-center gap-2 border py-3 text-[8px] tracking-[.15em]"
                  style={{
                    borderColor: COLORS.vermilion,
                    background: rsvp === "yes" ? COLORS.vermilion : "transparent",
                    color: rsvp === "yes" ? COLORS.paper : COLORS.vermilion,
                  }}
                >
                  <ThemeIcon name="check" size={14} />
                  YES
                </button>

                <button
                  type="button"
                  onClick={() => setRsvp("no")}
                  className="flex items-center justify-center gap-2 border py-3 text-[8px] tracking-[.15em]"
                  style={{
                    borderColor: COLORS.line,
                    background: rsvp === "no" ? COLORS.ink : "transparent",
                    color: rsvp === "no" ? COLORS.paper : COLORS.sage,
                  }}
                >
                  <ThemeIcon name="close" size={14} />
                  SORRY
                </button>
              </div>

              <button
                type="button"
                className="mt-3 w-full py-3 text-[8px] tracking-[.2em]"
                style={{
                  background: COLORS.haldi,
                  color: COLORS.ink,
                }}
              >
                SEND RSVP
              </button>
            </div>
          </div>
        </motion.section>

        {/* FOOTER */}
        <footer className="px-5 py-12 sm:px-8 md:px-12 md:py-16 lg:px-20" style={{ background: COLORS.paper }}>
          <div className="mx-auto max-w-[1180px]">
            <div className="grid gap-10 md:grid-cols-[1.2fr_.8fr] md:items-end">
              <div>
                <p className="text-[8px] tracking-[.28em]" style={{ color: COLORS.vermilion }}>
                  ALMA / 2026
                </p>
                <p
                  className="mt-3 text-[58px] leading-[.82] md:text-[80px]"
                  style={{
                    fontFamily: displayFont,
                    color: COLORS.ink,
                  }}
                >
                  {brideName}
                  <span style={{ color: COLORS.vermilion }}> & </span>
                  {groomName}
                </p>
                <p className="mt-5 max-w-[430px] text-[11px] leading-5" style={{ color: COLORS.sage }}>
                  Thank you for being part of our story. We cannot wait to celebrate every ritual, every laugh and every little moment with
                  you.
                </p>
              </div>

              <div className="md:text-right">
                <div
                  className="ml-auto flex h-14 w-14 items-center justify-center rounded-full border"
                  style={{
                    borderColor: COLORS.haldi,
                    color: COLORS.vermilion,
                    fontFamily: displayFont,
                  }}
                >
                  {monogram}
                </div>

                <div className="mt-6 grid grid-cols-2 gap-x-7 gap-y-3 text-[8px] tracking-[.15em] md:justify-items-end">
                  {navItems.map(([id, label]) => (
                    <button key={id} type="button" onClick={() => scrollTo(id)} className="text-left" style={{ color: COLORS.sage }}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div
              className="mt-10 border-t pt-5 text-[7px] tracking-[.12em]"
              style={{
                borderColor: COLORS.line,
                color: COLORS.sage,
              }}
            >
              © {primaryYear} {brideName} & {groomName}. MADE WITH LOVE.
            </div>
          </div>
        </footer>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div
            className="fixed inset-0 z-[100] overflow-y-auto md:hidden"
            style={{ background: COLORS.vermilionDark, color: COLORS.paper }}
          >
            <div className="flex items-center justify-between px-6 py-6">
              <div>
                <p className="text-[8px] tracking-[.28em] opacity-60">ALMA</p>
                <p className="mt-1 text-[22px]" style={{ fontFamily: displayFont }}>
                  {brideName} & {groomName}
                </p>
              </div>

              <button type="button" onClick={() => setMenuOpen(false)} aria-label="Close menu">
                <ThemeIcon name="close" size={25} />
              </button>
            </div>

            <nav className="px-7 pt-10 pb-10">
              {navItems.map(([id, label, icon], index) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => scrollTo(id)}
                  className="flex w-full items-center justify-between border-b py-5 text-left"
                  style={{ borderColor: "rgba(255,255,255,.16)" }}
                >
                  <span className="flex items-center gap-4">
                    <span className="text-[9px] opacity-50">{String(index + 1).padStart(2, "0")}</span>
                    <span className="text-[11px] tracking-[.2em]">{label}</span>
                  </span>
                  <ThemeIcon name={icon} size={17} />
                </button>
              ))}
            </nav>

            <div className="flex justify-center pb-14 opacity-60">
              <Mandala size={180} />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
