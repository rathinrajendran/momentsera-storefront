"use client";

import { useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useThemeAnimation } from "../../../../../hooks/useThemeAnimations";
import { useInviteData } from "../../../../../hooks/useInviteData";
import { getAnimationKey } from "../../../../../utils/animation";
import WeddingCalendar from "../../../../../components/ui/WeddingCalendar";
import GallerySection from "../components/common/GallerySection";
import { getSectionConfig } from "../../../../../utils/section-visibility";
import { useUnlockedSections } from "../../../../../hooks/useUnlockedSections";
import WishesSection from "../components/common/WishesSection";
import { THEME_COLORS } from "../../core/core/themeColors";
import { getShapeBorderStyle, THEME_SHAPES, getShapeCardStyle } from "../../core/core/themeShapes";
import { ThemeIcon, type ThemeIconName } from "../../core/core/themeIcons";
import { ThemeSectionTitle } from "../../core/core/ThemeSectionTitle";
import { THEME_TYPOGRAPHY } from "../../core/core/themeTypography";
import AudioPlayer from "../../../../../components/ui/AudioPlayer";

interface ZivaProps {
  data: any;
  eventKey: string;
  motionData: any;
  settings: any;
  theme?: any;
}

const DUMMY_HERO = "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=85";

const DUMMY_GALLERY = [
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1519225421980-da6f2b4f5f0e?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=600&q=80",
];

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
const toRoman = (n: number) => ROMAN[n - 1] ?? String(n);

export default function Ziva({ data, eventKey, motionData, settings, music }: zivaProps) {
  const zivaData = useInviteData(data);
  const { getMotionProps } = useThemeAnimation(motionData);
  const animationKey = useMemo(() => getAnimationKey(motionData), [motionData]);
  const [wishRefreshKey, setWishRefreshKey] = useState(0);
  const wishesContainerRef = useRef<HTMLElement | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [rsvp, setRsvp] = useState<"yes" | "no" | null>(null);
  const wishesRef = useRef<HTMLTextAreaElement>(null);

  const firstName = zivaData.firstName || zivaData.brideName || "Ananya";
  const secondName = zivaData.secondName || zivaData.groomName || "Ritvik";
  const heroImage = zivaData.heroImage || DUMMY_HERO;
  const gallery = getSectionConfig(settings?.section_visibility, "gallery");
  const wishes = getSectionConfig(settings?.section_visibility, "wishes");
  const { unlockedSections, setUnlockedSections } = useUnlockedSections(eventKey);

  const functions = zivaData.eventFunctions?.length
    ? zivaData.eventFunctions
    : [
        { title: "Mehndi", date: "2025-11-14", locationName: "Friday, 3:00 PM onwards" },
        { title: "Sangeet", date: "2025-11-15", locationName: "Saturday, 6:00 PM onwards" },
        { title: "Wedding", date: "2025-11-16", locationName: "Sunday, 6:00 PM onwards" },
        { title: "Reception", date: "2025-11-16", locationName: "Sunday, 8:30 PM onwards" },
      ];

  // Chapters replace the old flat nav — the invite is told as a bound story, in order.
  const chapters: Array<[string, string, ThemeIconName]> = [
    ["story", "Our Story", "heart"],
    ["events", "The Functions", "calendar"],
    ["gallery", "Gallery", "image"],
    ["music", "A Song For Us", "music"],
    ["dress-code", "Dress Code", "shirt"],
    ["wishes", "Wishes", "heart"],
    ["rsvp", "R.S.V.P.", "phone"],
    ["details", "The Details", "info"],
    ["gift-registry", "Gift Registry", "gift"],
  ];

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const motionFor = (delay: number) => {
    const { key: _key, ...props } = getMotionProps(delay);
    return props;
  };
  const primaryFunction = zivaData.primaryFunction;

  const primaryDate = primaryFunction?.startTime
    ? new Date(primaryFunction.startTime)
    : primaryFunction?.date
      ? new Date(primaryFunction.date)
      : null;

  const primaryDay = primaryDate
    ? primaryDate.toLocaleDateString("en-US", {
        weekday: "long",
      })
    : "";

  const primaryDateLabel = primaryDate
    ? primaryDate
        .toLocaleDateString("en-US", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
        .toUpperCase()
    : "";

  const primaryTime = primaryDate
    ? primaryDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    : "";

  const primaryVenue = primaryFunction?.locationName ?? "";

  return (
    <main
      key={animationKey}
      className="ziva-main relative mx-auto min-h-screen w-full max-w-[430px] overflow-x-hidden md:max-w-none"
      style={
        {
          "--animation-enabled": motionData?.animations === false ? "0" : "1",
          "--animation-style": motionData?.animation_style ?? "smooth",
          "--animation-scroll": motionData?.scroll_behavior ?? "on-scroll",
          "--animation-duration": motionData?.animation_duration ?? "1s",
          "--animation-delay": motionData?.animation_delay ?? "0ms",
          "--animation-speed": `${motionData?.animation_speed ?? 50}`,
          "--animation-loop": motionData?.animation_loop ? "1" : "0",
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
      {/* subtle page overlay, driven by the theme's background photo settings */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-white" style={{ opacity: "var(--bg-overlay-opacity, 0)" }} />

      {/* ---------------------------------------------------------------- */}
      {/* THE SPINE — a fixed vertical table-of-contents, like the spine   */}
      {/* of a bound book. Desktop only; this is the piece the rest of    */}
      {/* the page is built around.                                      */}
      {/* ---------------------------------------------------------------- */}
      <aside
        className="fixed top-0 left-0 z-30 hidden h-full w-[68px] flex-col items-center justify-between border-r py-9 md:flex"
        style={{ borderColor: THEME_COLORS.line, background: THEME_COLORS.paper }}
      >
        <div
          className="select-none"
          style={{
            writingMode: "vertical-rl",
            ...THEME_TYPOGRAPHY.heading,
            letterSpacing: "0.3em",
            color: THEME_COLORS.burgundy,
          }}
        >
          {zivaData.announcement?.couple?.monogram || `${firstName[0]}&${secondName[0]}`}
        </div>

        <nav className="flex flex-col items-center gap-5">
          {chapters.map(([id, label], i) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              aria-label={label}
              className="ziva-spine-link group relative flex flex-col items-center"
            >
              <span style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.gold }} className="block leading-none">
                {toRoman(i + 1)}
              </span>
              <span
                className="ziva-spine-tooltip pointer-events-none absolute top-1/2 left-[38px] z-10 -translate-y-1/2 rounded-sm px-2 py-1 text-[9px] whitespace-nowrap opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                style={{
                  ...THEME_TYPOGRAPHY.body,
                  background: THEME_COLORS.burgundy,
                  color: THEME_COLORS.paper,
                  letterSpacing: "0.08em",
                }}
              >
                {label}
              </span>
            </button>
          ))}
        </nav>

        <div style={{ color: THEME_COLORS.gold, fontSize: 13 }}>❧</div>
      </aside>

      <div className="relative z-10 md:pl-[68px]">
        {/* -------------------------------------------------------------- */}
        {/* MOBILE TOP BAR                                                */}
        {/* -------------------------------------------------------------- */}
        <header className="flex items-center justify-between px-6 py-5 md:hidden" style={{ color: THEME_COLORS.burgundy }}>
          <span style={{ ...THEME_TYPOGRAPHY.heading, letterSpacing: "0.18em" }}>{zivaData.announcement?.couple?.monogram}</span>
          <button aria-label="Open chapters" onClick={() => setMenuOpen(true)} className="rounded-full p-1">
            <ThemeIcon name="menu" size={26} />
          </button>
        </header>

        {/* -------------------------------------------------------------- */}
        {/* PROLOGUE — asymmetric split hero. Photo as a full-bleed        */}
        {/* panel on one side, the announcement set as a title page on     */}
        {/* the other, rather than the usual centered stack.               */}
        {/* -------------------------------------------------------------- */}
        <motion.section key={`hero-${animationKey}`} {...motionFor(0)} className="grid md:min-h-[94vh] md:grid-cols-[1.05fr_1fr]">
          <div className="relative h-[52vh] md:h-auto">
            <img src={heroImage} alt="Wedding couple" className="h-full w-full object-cover" style={{ filter: "saturate(0.94)" }} />
            <div className="absolute inset-0" style={{ background: `linear-gradient(0deg, ${THEME_COLORS.dark}55, transparent 45%)` }} />
            <div
              className="absolute top-5 left-5 flex flex-col items-start gap-1 px-3 py-2"
              style={{
                ...getShapeBorderStyle(),
                borderColor: "rgba(255,255,255,.55)",
                color: "#fff",
              }}
            >
              <span style={{ ...THEME_TYPOGRAPHY.body, letterSpacing: "0.16em" }}>SAVE THE DATE</span>
              <span style={{ ...THEME_TYPOGRAPHY.body, fontSize: 9, letterSpacing: "0.1em", opacity: 0.85 }}>{primaryDateLabel}</span>
            </div>
          </div>

          <div className="flex flex-col justify-center px-6 py-10 md:px-14 md:py-0">
            <p className="mb-5 text-[8px] font-medium tracking-[0.3em]" style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.muted }}>
              {zivaData.announcement?.couple?.familyLabel}
            </p>

            <motion.h1
              {...motionFor(0.1)}
              className="leading-[0.92]"
              style={{ ...THEME_TYPOGRAPHY.accent, color: THEME_COLORS.burgundy, fontSize: "17vw" }}
            >
              {firstName}
            </motion.h1>
            <div className="my-2 flex items-center gap-3">
              <span className="h-px w-10" style={{ background: THEME_COLORS.line }} />
              <span style={{ ...THEME_TYPOGRAPHY.heading, color: THEME_COLORS.gold }}>and</span>
              <span className="h-px w-10" style={{ background: THEME_COLORS.line }} />
            </div>
            <motion.h1
              {...motionFor(0.18)}
              className="leading-[0.92]"
              style={{ ...THEME_TYPOGRAPHY.accent, color: THEME_COLORS.burgundy, fontSize: "17vw" }}
            >
              {secondName}
            </motion.h1>

            <p className="mt-7 max-w-[320px] text-[8px] leading-5" style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.text }}>
              <span style={{ color: THEME_COLORS.gold }}>❧ &nbsp;</span>
              {zivaData.announcement?.announcement?.title || "Together with their families"}
              {zivaData.announcement?.announcement?.message ? ` — ${zivaData.announcement.announcement.message}` : ""}
            </p>

            <button
              onClick={() => scrollTo("story")}
              className="mt-9 flex items-center gap-2 self-start text-[7px] tracking-[0.2em]"
              style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.burgundy }}
            >
              BEGIN THE STORY
              <ThemeIcon name="chevron" size={13} />
            </button>
          </div>
        </motion.section>

        {/* -------------------------------------------------------------- */}
        {/* TICKET STUB — the essential when/where, styled as a torn stub  */}
        {/* rather than an icon grid.                                      */}
        {/* -------------------------------------------------------------- */}
        <motion.section key={`stub-${animationKey}`} {...motionFor(0.1)} className="px-5 py-8 md:px-14 md:py-10">
          <div
            className="ziva-stub mx-auto grid max-w-[860px] grid-cols-3 divide-x"
            style={{
              ...getShapeCardStyle(),
              borderColor: THEME_COLORS.line,
              background: THEME_COLORS.paper,
            }}
          >
            {[
              ["calendar", primaryDay, primaryDateLabel],
              ["clock", primaryTime, "ONWARDS"],
              ["venue", primaryVenue, "VENUE"],
            ].map(([icon, a, b], i) => (
              <motion.div
                key={String(a)}
                {...motionFor(0.16 + i * 0.06)}
                className="flex flex-col items-center gap-2 px-3 py-6 text-center"
                style={{ borderColor: THEME_COLORS.line }}
              >
                <span style={{ color: THEME_COLORS.gold }}>
                  <ThemeIcon name={icon as ThemeIconName} size={20} />
                </span>
                <p style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.text }}>{a}</p>
                <p style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.muted, fontSize: 7 }}>{b}</p>
              </motion.div>
            ))}
          </div>
          <div className="mx-auto mt-6 max-w-[860px]">
            <WeddingCalendar
              year={functions[0]?.date ? new Date(functions[0].date).getFullYear() : 2025}
              month={functions[0]?.date ? new Date(functions[0].date).getMonth() : 10}
              selectedDate={functions[0]?.date ? new Date(functions[0].date).getDate() : 16}
            />
          </div>
        </motion.section>

        {/* -------------------------------------------------------------- */}
        {/* CHAPTER I — OUR STORY, told as a letter: a large drop cap and  */}
        {/* a narrow ledger of dated moments running beside it, instead    */}
        {/* of four equal icon columns.                                   */}
        {/* -------------------------------------------------------------- */}
        <motion.section
          id="story"
          key={`story-${animationKey}`}
          {...motionFor(0.1)}
          className="grid gap-8 px-5 py-14 md:grid-cols-[120px_1fr] md:gap-14 md:px-14 md:py-20"
        >
          <div className="flex items-start gap-3 md:flex-col md:items-start">
            <span style={{ ...THEME_TYPOGRAPHY.heading, color: THEME_COLORS.gold, fontSize: 26 }}>{toRoman(1)}</span>
            <span style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.muted, letterSpacing: "0.2em" }}>CHAPTER</span>
          </div>

          <div>
            <ThemeSectionTitle decoration="floral">OUR STORY</ThemeSectionTitle>

            <p className="ziva-dropcap max-w-[560px] text-[8px] leading-6" style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.text }}>
              {zivaData.storyText ||
                `It started quietly, the way the truest things do — a shared laugh, a second glance, a coffee that ran long. What followed was years of small, ordinary days that somehow added up to the extraordinary decision to spend all the rest of them together.`}
            </p>

            <div className="mt-9 space-y-0 border-l" style={{ borderColor: THEME_COLORS.line }}>
              {[
                ["♡", "We Met", "12 MAY 2018"],
                ["☕", "First Date", "02 JUNE 2018"],
                ["♢", "She Said Yes", "24 DEC 2023"],
                ["♡", "Forever Starts", "16 NOV 2025"],
              ].map(([icon, title, date], i) => (
                <motion.div key={title} {...motionFor(0.18 + i * 0.07)} className="relative flex items-center gap-4 py-4 pl-6">
                  <span
                    className="absolute -left-[9px] flex h-4 w-4 items-center justify-center rounded-full"
                    style={{
                      background: THEME_COLORS.page,
                      border: `1px solid ${THEME_COLORS.gold}`,
                      color: THEME_COLORS.gold,
                      fontSize: 8,
                    }}
                  >
                    {icon}
                  </span>
                  <span className="w-[92px] shrink-0" style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.muted, fontSize: 7 }}>
                    {date}
                  </span>
                  <span style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.text }}>{title}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* -------------------------------------------------------------- */}
        {/* CHAPTER II — THE FUNCTIONS, as a ledger rather than a card     */}
        {/* grid: each event is a line entry with a large stamped date.    */}
        {/* -------------------------------------------------------------- */}
        <motion.section
          id="events"
          key={`events-${animationKey}`}
          {...motionFor(0.12)}
          className="grid gap-8 px-5 py-14 md:grid-cols-[120px_1fr] md:gap-14 md:px-14 md:py-20"
          style={{ background: THEME_COLORS.paper }}
        >
          <div className="flex items-start gap-3 md:flex-col md:items-start">
            <span style={{ ...THEME_TYPOGRAPHY.heading, color: THEME_COLORS.gold, fontSize: 26 }}>{toRoman(2)}</span>
            <span style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.muted, letterSpacing: "0.2em" }}>CHAPTER</span>
          </div>

          <div>
            <ThemeSectionTitle decoration="floral">THE FUNCTIONS</ThemeSectionTitle>

            <div>
              {functions.map((fn: any, i: number) => {
                const fallbackDates = ["14", "15", "16", "16"];
                const dateNum = fn.date ? new Date(fn.date).getDate() : fallbackDates[i];
                const month = fn.date ? new Date(fn.date).toLocaleString("en-US", { month: "short" }).toUpperCase() : "NOV";
                return (
                  <motion.div
                    key={fn.function_key ?? i}
                    {...motionFor(0.2 + i * 0.08)}
                    className="flex items-center gap-5 border-b py-5 md:gap-8"
                    style={{ borderColor: THEME_COLORS.line }}
                  >
                    <div className="flex w-14 shrink-0 flex-col items-center text-center">
                      <span style={{ ...THEME_TYPOGRAPHY.accent, color: THEME_COLORS.burgundy, fontSize: 30, lineHeight: 1 }}>
                        {dateNum}
                      </span>
                      <span style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.gold, fontSize: 7, letterSpacing: "0.14em" }}>
                        {month}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        style={{
                          ...THEME_TYPOGRAPHY.heading,
                          color: THEME_COLORS.text,
                          fontSize: THEME_TYPOGRAPHY.body.fontSize,
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                        }}
                      >
                        {fn.title}
                      </p>
                      <p className="mt-1" style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.muted }}>
                        {fn.locationName || "Taj Falaknuma Palace"}
                      </p>
                    </div>
                    <span style={{ color: THEME_COLORS.gold }}>
                      <ThemeIcon name={i === 1 ? "music" : i === 3 ? "gift" : "heart"} size={19} />
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.section>

        {/* -------------------------------------------------------------- */}
        {/* CHAPTER III — GALLERY                                          */}
        {/* -------------------------------------------------------------- */}
        {!gallery.hidden && (
          <section className="grid gap-8 px-5 pt-14 md:grid-cols-[120px_1fr] md:gap-14 md:px-14 md:pt-20">
            <div className="flex items-start gap-3 md:flex-col md:items-start">
              <span style={{ ...THEME_TYPOGRAPHY.heading, color: THEME_COLORS.gold, fontSize: 26 }}>{toRoman(3)}</span>
              <span style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.muted, letterSpacing: "0.2em" }}>CHAPTER</span>
            </div>
            <div className="min-w-0">
              <GallerySection
                animationKey={animationKey}
                getMotionProps={getMotionProps}
                layout={zivaData.galleryLayout}
                urls={zivaData.galleryUrls}
                fallback={zivaData.heroImage}
                title="Gallery"
                isProtected={gallery.protected}
                password={gallery.password}
                unlockedSections={unlockedSections}
                setUnlockedSections={setUnlockedSections}
              />
            </div>
          </section>
        )}

        {/* -------------------------------------------------------------- */}
        {/* CHAPTER IV — MUSIC, framed as a record sleeve instead of a     */}
        {/* plain player.                                                  */}
        {/* -------------------------------------------------------------- */}
        <motion.section
          id="music"
          key={`music-${animationKey}`}
          {...motionFor(0.14)}
          className="grid gap-8 px-5 py-14 md:grid-cols-[120px_1fr] md:gap-14 md:px-14 md:py-20"
        >
          <div className="flex items-start gap-3 md:flex-col md:items-start">
            <span style={{ ...THEME_TYPOGRAPHY.heading, color: THEME_COLORS.gold, fontSize: 26 }}>{toRoman(4)}</span>
            <span style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.muted, letterSpacing: "0.2em" }}>CHAPTER</span>
          </div>
          <div>
            <ThemeSectionTitle decoration="floral">A SONG FOR US</ThemeSectionTitle>
            <div
              className="mx-auto max-w-[420px] p-5"
              style={{ ...getShapeCardStyle(), borderColor: THEME_COLORS.line, background: THEME_COLORS.paper }}
            >
              <motion.div {...motionFor(0.24)}>
                <AudioPlayer
                  src={music?.background_audio ?? ""}
                  name={music?.background_audio_name ?? "Background Music"}
                  cover={DUMMY_GALLERY[2]}
                  variant={music.audio_player_variant}
                  allowMute={music?.allow_mute ?? true}
                  loop={music?.loop_music ?? true}
                  fadeIn={music?.fade_in ?? false}
                  fadeOut={music?.fade_out ?? false}
                  volume={music?.volume_level ?? 60}
                />
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* -------------------------------------------------------------- */}
        {/* CHAPTER V — DRESS CODE, as fabric swatch cards.                 */}
        {/* -------------------------------------------------------------- */}
        <motion.section
          id="dress-code"
          key={`dress-code-${animationKey}`}
          {...motionFor(0.14)}
          className="grid gap-8 px-5 py-14 md:grid-cols-[120px_1fr] md:gap-14 md:px-14 md:py-20"
          style={{ background: THEME_COLORS.paper }}
        >
          <div className="flex items-start gap-3 md:flex-col md:items-start">
            <span style={{ ...THEME_TYPOGRAPHY.heading, color: THEME_COLORS.gold, fontSize: 26 }}>{toRoman(5)}</span>
            <span style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.muted, letterSpacing: "0.2em" }}>CHAPTER</span>
          </div>
          <div>
            <ThemeSectionTitle decoration="floral">DRESS CODE</ThemeSectionTitle>
            <div className="grid gap-5 sm:grid-cols-2">
              {/* {zivaData?.dressCode?.map((dress: any, dressIndex: number) => (
                <motion.div
                  key={`dress-${dressIndex}`}
                  {...motionFor(0.2 + dressIndex * 0.08)}
                  className="p-5 text-left"
                  style={{ ...getShapeCardStyle(), borderColor: THEME_COLORS.line, background: THEME_COLORS.page }}
                >
                  {dress.title && (
                    <h3 style={{ ...THEME_TYPOGRAPHY.heading, color: THEME_COLORS.text, fontSize: THEME_TYPOGRAPHY.body.fontSize }}>
                      {dress.title}
                    </h3>
                  )}
                  {Array.isArray(dress.hexColors) && dress.hexColors.length > 0 && (
                    <div className="mt-4 flex gap-3">
                      {dress.hexColors.map((color: string, colorIndex: number) => (
                        <motion.span
                          key={`${color}-${colorIndex}`}
                          {...motionFor(0.28 + dressIndex * 0.08 + colorIndex * 0.06)}
                          className="h-8 w-8 rounded-full border shadow-sm"
                          style={{ backgroundColor: color, borderColor: THEME_COLORS.paper }}
                          title={color}
                          aria-label={`Dress color ${color}`}
                        />
                      ))}
                    </div>
                  )}
                  {dress.description && (
                    <p className="mt-4" style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.muted }}>
                      {dress.description}
                    </p>
                  )}
                </motion.div>
              ))} */}
            </div>
          </div>
        </motion.section>

        {/* -------------------------------------------------------------- */}
        {/* CHAPTER VI — WISHES                                            */}
        {/* -------------------------------------------------------------- */}
        {!wishes.hidden && (
          <section className="grid gap-8 px-5 pt-14 md:grid-cols-[120px_1fr] md:gap-14 md:px-14 md:pt-20">
            <div className="flex items-start gap-3 md:flex-col md:items-start">
              <span style={{ ...THEME_TYPOGRAPHY.heading, color: THEME_COLORS.gold, fontSize: 26 }}>{toRoman(6)}</span>
              <span style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.muted, letterSpacing: "0.2em" }}>CHAPTER</span>
            </div>
            <div className="min-w-0">
              <WishesSection
                animationKey={animationKey}
                getMotionProps={getMotionProps}
                eventKey={eventKey}
                wishesRaw={zivaData.wishesRaw}
                wishesContainerRef={wishesContainerRef}
                wishRefreshKey={wishRefreshKey}
                setWishRefreshKey={setWishRefreshKey}
                title={zivaData.wishesTitle ?? "Best Wishes"}
                isIcon={false}
                isProtected={wishes.protected}
                password={wishes.password}
                unlockedSections={unlockedSections}
                setUnlockedSections={setUnlockedSections}
              />
            </div>
          </section>
        )}

        {/* -------------------------------------------------------------- */}
        {/* INTERLUDE — full-bleed dark pull quote between the story and   */}
        {/* the practicalities.                                            */}
        {/* -------------------------------------------------------------- */}
        <motion.section
          key={`quote-${animationKey}`}
          {...motionFor(0.14)}
          className="relative overflow-hidden px-6 py-20 text-center md:px-16 md:py-28"
          style={{ background: THEME_COLORS.dark, color: THEME_COLORS.paper }}
        >
          <img
            src={heroImage}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-20"
            style={{ filter: "grayscale(100%)" }}
          />
          <div className="relative">
            <span style={{ color: THEME_COLORS.gold, fontSize: 20 }}>❝</span>
            <p className="mx-auto mt-3 max-w-[300px] text-[17px] leading-6" style={{ fontFamily: "var(--font-accent)" }}>
              The best thing to hold onto in life is each other.
            </p>
            <div className="mt-4 text-[13px]" style={{ color: THEME_COLORS.gold }}>
              ♥
            </div>
          </div>
        </motion.section>

        {/* -------------------------------------------------------------- */}
        {/* CHAPTER VII — R.S.V.P., styled as a tear-off reply card.       */}
        {/* -------------------------------------------------------------- */}
        <motion.section
          id="rsvp"
          key={`rsvp-${animationKey}`}
          {...motionFor(0.14)}
          className="grid gap-8 px-5 py-14 md:grid-cols-[120px_1fr] md:gap-14 md:px-14 md:py-20"
        >
          <div className="flex items-start gap-3 md:flex-col md:items-start">
            <span style={{ ...THEME_TYPOGRAPHY.heading, color: THEME_COLORS.gold, fontSize: 26 }}>{toRoman(7)}</span>
            <span style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.muted, letterSpacing: "0.2em" }}>CHAPTER</span>
          </div>

          <div className="mx-auto w-full max-w-[420px]">
            <ThemeSectionTitle decoration="floral">KINDLY RSVP</ThemeSectionTitle>
            <div
              className="ziva-reply-card relative p-6 text-center"
              style={{ ...getShapeCardStyle(), borderColor: THEME_COLORS.gold, background: THEME_COLORS.paper }}
            >
              <p style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.muted }}>
                We request the pleasure of your response by <strong style={{ color: THEME_COLORS.text }}>15 October 2025.</strong>
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <motion.button
                  {...motionFor(0.25)}
                  onClick={() => setRsvp("yes")}
                  className="flex items-center justify-center gap-2 py-3 text-[7px] tracking-[0.13em]"
                  style={{
                    ...getShapeBorderStyle(),
                    ...THEME_TYPOGRAPHY.body,
                    borderColor: THEME_COLORS.burgundy,
                    borderRadius: THEME_SHAPES.radius,
                    boxShadow: THEME_SHAPES.shadow,
                    background: rsvp === "yes" ? THEME_COLORS.burgundy : "transparent",
                    color: rsvp === "yes" ? THEME_COLORS.paper : THEME_COLORS.burgundy,
                  }}
                >
                  <ThemeIcon name="check" size={14} /> ACCEPTS
                </motion.button>
                <motion.button
                  {...motionFor(0.32)}
                  onClick={() => setRsvp("no")}
                  className="flex items-center justify-center gap-2 py-3 text-[7px] tracking-[0.13em]"
                  style={{
                    ...getShapeBorderStyle(),
                    ...THEME_TYPOGRAPHY.body,
                    borderColor: THEME_COLORS.line,
                    borderRadius: THEME_SHAPES.radius,
                    boxShadow: THEME_SHAPES.shadow,
                    background: rsvp === "no" ? THEME_COLORS.burgundy : "transparent",
                    color: rsvp === "no" ? THEME_COLORS.paper : THEME_COLORS.muted,
                  }}
                >
                  <ThemeIcon name="close" size={14} /> REGRETS
                </motion.button>
              </div>
              <button
                className="mx-auto mt-5 block border px-8 py-3 text-[7px] tracking-[0.16em]"
                style={{ ...THEME_TYPOGRAPHY.body, borderColor: THEME_COLORS.gold, color: THEME_COLORS.burgundy }}
              >
                SEND RSVP
              </button>
              <div className="ziva-reply-perf absolute right-0 -bottom-3 left-0 flex justify-center" aria-hidden="true">
                <span style={{ color: THEME_COLORS.line, fontSize: 10, letterSpacing: "6px" }}>
                  ✂ ・・・・・・・・・・・・・・・・・・・・・・
                </span>
              </div>
            </div>
          </div>
        </motion.section>

        {/* -------------------------------------------------------------- */}
        {/* CHAPTER VIII — DETAILS                                         */}
        {/* -------------------------------------------------------------- */}
        <motion.section
          id="details"
          key={`details-${animationKey}`}
          {...motionFor(0.15)}
          className="hidden grid-cols-[120px_1fr] gap-14 px-14 py-20 md:grid"
          style={{ background: THEME_COLORS.paper }}
        >
          <div className="flex flex-col items-start gap-3">
            <span style={{ ...THEME_TYPOGRAPHY.heading, color: THEME_COLORS.gold, fontSize: 26 }}>{toRoman(8)}</span>
            <span style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.muted, letterSpacing: "0.2em" }}>CHAPTER</span>
          </div>
          <div>
            <ThemeSectionTitle decoration="floral">THE DETAILS</ThemeSectionTitle>
            <div className="grid grid-cols-2 gap-4">
              {(
                [
                  ["venue", "ACCOMMODATION", "View recommended hotels"],
                  ["car", "TRANSPORTATION", "Airport pickup & local travel"],
                  ["calendar", "PARKING", "Valet parking available"],
                  ["info", "FAQS", "Find answers to common questions"],
                ] as Array<[ThemeIconName, string, string]>
              ).map(([icon, title, text]) => (
                <button
                  key={title}
                  className="flex items-center gap-4 border p-4 text-left"
                  style={{ borderColor: THEME_COLORS.line, background: THEME_COLORS.page }}
                >
                  <span style={{ color: THEME_COLORS.gold }}>
                    <ThemeIcon name={icon} size={22} />
                  </span>
                  <span className="flex-1">
                    <span className="block text-[8px] font-semibold tracking-[0.08em]">{title}</span>
                    <span className="mt-1 block text-[7px]" style={{ color: THEME_COLORS.muted }}>
                      {text}
                    </span>
                  </span>
                  <span style={{ color: THEME_COLORS.gold }}>
                    <ThemeIcon name="chevron" size={15} />
                  </span>
                </button>
              ))}
            </div>
          </div>
        </motion.section>

        {/* -------------------------------------------------------------- */}
        {/* CHAPTER IX — GIFT REGISTRY                                     */}
        {/* -------------------------------------------------------------- */}
        <motion.section
          id="gift-registry"
          key={`gift-registry-${animationKey}`}
          {...motionFor(0.15)}
          className="hidden grid-cols-[120px_1fr] gap-14 px-14 py-20 text-center md:grid"
        >
          <div className="flex flex-col items-start gap-3 text-left">
            <span style={{ ...THEME_TYPOGRAPHY.heading, color: THEME_COLORS.gold, fontSize: 26 }}>{toRoman(9)}</span>
            <span style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.muted, letterSpacing: "0.2em" }}>CHAPTER</span>
          </div>
          <div>
            <ThemeSectionTitle decoration="floral">GIFT REGISTRY</ThemeSectionTitle>
            <p className="mx-auto max-w-[260px] text-[8px] leading-4" style={{ color: THEME_COLORS.muted }}>
              Your presence is our greatest gift.
              <br />
              If you wish to bless us, here are our preferred options.
            </p>
            <button
              className="mx-auto mt-5 flex items-center gap-2 border px-7 py-3 text-[7px] tracking-[0.16em]"
              style={{ borderColor: THEME_COLORS.gold, color: THEME_COLORS.burgundy }}
            >
              <ThemeIcon name="gift" size={15} /> VIEW REGISTRY
            </button>
          </div>
        </motion.section>

        {/* -------------------------------------------------------------- */}
        {/* CLOSING PAGE / FOOTER                                          */}
        {/* -------------------------------------------------------------- */}
        <motion.footer
          key={`footer-${animationKey}`}
          {...motionFor(0.2)}
          className="px-6 pt-10 pb-9 text-center md:px-14 md:pt-14 md:pb-11"
          style={{ background: THEME_COLORS.dark, color: THEME_COLORS.paper }}
        >
          <div style={{ ...THEME_TYPOGRAPHY.heading, letterSpacing: "0.2em" }}>{zivaData.announcement?.couple?.monogram}</div>
          <div className="mt-2 text-[10px]" style={{ color: THEME_COLORS.gold }}>
            ❧
          </div>
          <p className="mt-4" style={{ ...THEME_TYPOGRAPHY.body, opacity: 0.75 }}>
            THE END OF ONE STORY, THE START OF ANOTHER
          </p>
          <div className="mt-6 flex justify-center gap-6" style={{ color: THEME_COLORS.gold }}>
            <span aria-label="Instagram">◎</span>
            <span aria-label="Facebook">f</span>
            <span aria-label="WhatsApp">◌</span>
          </div>

          <div className="mt-9 flex flex-wrap justify-center gap-x-6 gap-y-3" style={{ ...THEME_TYPOGRAPHY.body, opacity: 0.7 }}>
            {chapters.map(([id, label]) => (
              <button key={id} onClick={() => scrollTo(id)}>
                {label.toUpperCase()}
              </button>
            ))}
          </div>

          <div
            className="mt-8 border-t pt-5 text-[6px] tracking-[0.08em]"
            style={{ ...THEME_TYPOGRAPHY.body, borderTopColor: "rgba(255,255,255,.16)", opacity: 0.55 }}
          >
            © 2025 {firstName} &amp; {secondName}. ALL RIGHTS RESERVED.
          </div>
        </motion.footer>

        {/* -------------------------------------------------------------- */}
        {/* MOBILE MENU — a full-screen "table of contents" page rather    */}
        {/* than a plain link list, matching the spine on desktop.         */}
        {/* -------------------------------------------------------------- */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 mx-auto w-full max-w-[430px] md:hidden"
              style={{ background: THEME_COLORS.dark }}
            >
              <div className="flex items-center justify-between px-6 py-7" style={{ color: THEME_COLORS.paper }}>
                <div>
                  <p style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.gold, letterSpacing: "0.2em" }}>CONTENTS</p>
                  <div className="text-[20px] tracking-[0.25em]">{zivaData.announcement?.couple?.monogram}</div>
                </div>
                <button onClick={() => setMenuOpen(false)} aria-label="Close menu">
                  <ThemeIcon name="close" size={27} />
                </button>
              </div>
              <nav className="flex flex-col px-8 pt-6">
                {chapters.map(([id, label], i) => (
                  <motion.button
                    key={id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * i }}
                    onClick={() => scrollTo(id)}
                    className="flex items-baseline gap-4 border-b py-4 text-left"
                    style={{ borderColor: "rgba(255,255,255,.14)", color: THEME_COLORS.paper }}
                  >
                    <span style={{ color: THEME_COLORS.gold, fontSize: 11 }}>{toRoman(i + 1)}</span>
                    <span className="text-[13px] tracking-[0.1em]">{label}</span>
                  </motion.button>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx global>{`
        .ziva-spine-tooltip {
          transform: translateY(-50%) translateX(-4px);
        }
        .ziva-spine-link:hover .ziva-spine-tooltip {
          transform: translateY(-50%) translateX(0);
        }
        .ziva-dropcap::first-letter {
          float: left;
          font-family: var(--font-accent);
          font-size: 46px;
          line-height: 0.8;
          padding-right: 8px;
          padding-top: 4px;
          color: ${THEME_COLORS.burgundy};
        }
      `}</style>
    </main>
  );
}
