"use client";

import { useMemo, useRef, useState } from "react";
import type { CSSProperties, FormEvent } from "react";
import { motion } from "framer-motion";
import { useThemeAnimation } from "../../../../../hooks/useThemeAnimations";
import { useInviteData } from "../../../../../hooks/useInviteData";
import { getAnimationKey } from "../../../../../utils/animation";
import WeddingCalendar from "../../../../../components/ui/WeddingCalendar";
import GallerySection from "../components/common/GallerySection";
import { getSectionConfig } from "../../../../../utils/section-visibility";
import { useUnlockedSections } from "../../../../../hooks/useUnlockedSections";
import WishesSection from "../components/common/WishesSection";
import { THEME_COLORS } from "../../core/core/themeColors";
import { ThemeIcon, type ThemeIconName } from "../../core/core/themeIcons";
import { THEME_TYPOGRAPHY } from "../../core/core/themeTypography";
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
 * CLEO — Indian editorial wedding invitation.
 *
 * The composition intentionally follows an editorial/portfolio rhythm:
 * oversized type, asymmetric image blocks, thin rules, numbered sections,
 * generous paper space and overlapping cards. Wedding content comes from
 * LunaData first, with wedding-specific fallbacks only where data is absent.
 */
const DUMMY_HERO = "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=88";

const DUMMY_GALLERY = [
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=82",
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=82",
  "https://images.unsplash.com/photo-1519225421980-da6f2b4f5f0e?auto=format&fit=crop&w=900&q=82",
  "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=900&q=82",
  "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=900&q=82",
  "https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=900&q=82",
];

const PALETTE = {
  ink: "#241A17",
  wine: "#681E2D",
  wineDeep: "#43131F",
  saffron: "#C79235",
  marigold: "#D7A42C",
  leaf: "#315344",
  paper: "#F4EEE4",
  paper2: "#EAE0D1",
  blush: "#D9C7BD",
  line: "rgba(73, 47, 38, .20)",
  muted: "#75665D",
};

const navItems: Array<[string, string, ThemeIconName]> = [
  ["story", "OUR STORY", "heart"],
  ["events", "CELEBRATIONS", "calendar"],
  ["gallery", "MEMORIES", "image"],
  ["venue", "VENUE", "venue"],
  ["rsvp", "RSVP", "phone"],
  ["wishes", "WISHES", "heart"],
];

function Mandala({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 180 180" className={`pointer-events-none ${className}`} fill="none">
      <circle cx="90" cy="90" r="72" stroke="currentColor" strokeWidth="0.8" opacity=".35" />
      <circle cx="90" cy="90" r="56" stroke="currentColor" strokeWidth="0.7" opacity=".35" />
      <circle cx="90" cy="90" r="25" stroke="currentColor" strokeWidth="0.8" />
      {Array.from({ length: 12 }).map((_, i) => (
        <g key={i} transform={`rotate(${i * 30} 90 90)`}>
          <path d="M90 18 C104 35 104 49 90 62 C76 49 76 35 90 18Z" stroke="currentColor" strokeWidth="0.7" opacity=".4" />
          <path d="M90 65 C97 73 97 81 90 87 C83 81 83 73 90 65Z" stroke="currentColor" strokeWidth=".7" />
        </g>
      ))}
      <circle cx="90" cy="90" r="7" fill="currentColor" opacity=".75" />
    </svg>
  );
}

function Diya({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 90 70" className={className} fill="none">
      <path d="M22 42 Q45 57 68 42 Q62 58 45 62 Q28 58 22 42Z" fill="currentColor" opacity=".8" />
      <path d="M45 41 C36 32 44 24 45 14 C55 26 54 35 45 41Z" fill="currentColor" />
      <path d="M45 31 C41 26 44 21 45 18 C49 24 49 28 45 31Z" fill={PALETTE.saffron} />
    </svg>
  );
}

function SectionKicker({ number, label, light = false }: { number: string; label: string; light?: boolean }) {
  return (
    <div
      className="mb-5 flex items-center gap-3 text-[8px] font-medium tracking-[.22em]"
      style={{ color: light ? "rgba(255,255,255,.7)" : PALETTE.muted }}
    >
      <span>{number}</span>
      <span className="h-px w-8" style={{ background: light ? "rgba(255,255,255,.35)" : PALETTE.line }} />
      <span>{label}</span>
    </div>
  );
}

export default function Luna({ data, eventKey, motionData, settings, music }: LunaProps) {
  const LunaData = useInviteData(data);
  const { getMotionProps } = useThemeAnimation(motionData);
  const animationKey = useMemo(() => getAnimationKey(motionData), [motionData]);

  const [menuOpen, setMenuOpen] = useState(false);
  const [rsvp, setRsvp] = useState<"yes" | "no" | null>(null);
  const [rsvpSent, setRsvpSent] = useState(false);
  const [rsvpName, setRsvpName] = useState("");
  const [guestCount, setGuestCount] = useState("2");
  const [rsvpNote, setRsvpNote] = useState("");
  const [wishRefreshKey, setWishRefreshKey] = useState(0);
  const wishesContainerRef = useRef<HTMLElement | null>(null);

  const firstName = LunaData.firstName || LunaData.brideName || "Aparna";
  const secondName = LunaData.secondName || LunaData.groomName || "Evin";
  const heroImage = LunaData.heroImage || DUMMY_HERO;

  const gallery = getSectionConfig(settings?.section_visibility, "gallery");
  const wishes = getSectionConfig(settings?.section_visibility, "wishes");
  const { unlockedSections, setUnlockedSections } = useUnlockedSections(eventKey);

  const functions = LunaData.eventFunctions?.length
    ? LunaData.eventFunctions
    : [
        {
          title: "Haldi",
          date: "2026-11-14",
          locationName: "Ananya Courtyard · 10:30 AM onwards",
        },
        {
          title: "Sangeet",
          date: "2026-11-14",
          locationName: "The Grand Ballroom · 7:00 PM onwards",
        },
        {
          title: "Muhurtham",
          date: "2026-11-15",
          locationName: "Sri Lakshmi Mandapam · 9:18 AM",
        },
        {
          title: "Reception",
          date: "2026-11-15",
          locationName: "The Garden Pavilion · 7:30 PM onwards",
        },
      ];

  const primaryFunction = LunaData.primaryFunction || functions[2];
  const primaryDate = primaryFunction?.startTime
    ? new Date(primaryFunction.startTime)
    : primaryFunction?.date
      ? new Date(primaryFunction.date)
      : null;

  const primaryDay = primaryDate ? primaryDate.toLocaleDateString("en-US", { weekday: "long" }) : "Sunday";

  const primaryDateLabel = primaryDate
    ? primaryDate.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase()
    : "15 NOV 2026";

  const primaryTime = primaryDate
    ? primaryDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })
    : "9:18 AM";

  const primaryVenue = primaryFunction?.locationName || LunaData.venue?.name || "Sri Lakshmi Mandapam, Chennai";

  const venueName = LunaData.venue?.name || "Sri Lakshmi Mandapam";
  const venueAddress = LunaData.venue?.address || "18 Temple Road, Mylapore, Chennai, Tamil Nadu";
  const venueMapUrl = LunaData.venue?.mapUrl || "https://www.google.com/maps/search/?api=1&query=Sri+Lakshmi+Mandapam+Chennai";

  const storyMilestones = LunaData.story?.milestones?.length
    ? LunaData.story.milestones
    : [
        { year: "2018", title: "WE MET", text: "A chance hello became our favourite beginning." },
        { year: "2021", title: "TWO CITIES", text: "Different roads, one growing story." },
        { year: "2025", title: "SHE SAID YES", text: "A little yes with a very big future." },
        { year: "2026", title: "FOREVER", text: "Now we celebrate with the people we love." },
      ];

  const storyText =
    LunaData.story?.description ||
    "From an ordinary hello to a life full of extraordinary little moments, our story has always felt better when shared. Now we are opening the next chapter with our families, our traditions and everyone who has loved us along the way.";

  const inviteTitle = LunaData.announcement?.announcement?.title || "A Celebration of Two Hearts";
  const hostLine = LunaData.announcement?.couple?.familyLabel || "With the blessings of our families";
  const announcement =
    LunaData.announcement?.announcement?.message ||
    "Please join us for a wedding woven with music, flowers, rituals and a little bit of magic.";

  const mapEmbed = LunaData.venue?.mapEmbedUrl || "";
  const dressCode = LunaData?.dressCode?.[0]?.description || "Festive Indian · jewel tones, silk, florals and your happiest colours";

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const motionFor = (delay: number) => {
    const { key: _key, ...props } = getMotionProps(delay);
    return props;
  };

  const submitRsvp = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setRsvpSent(true);
  };

  return (
    <main
      key={animationKey}
      className="relative mx-auto min-h-screen w-full max-w-[440px] overflow-x-hidden md:max-w-[1180px]"
      style={
        {
          "--animation-enabled": motionData?.animations === false ? "0" : "1",
          "--animation-style": motionData?.animation_style ?? "smooth",
          "--animation-scroll": motionData?.scroll_behavior ?? "on-scroll",
          "--animation-duration": motionData?.animation_duration ?? "1s",
          "--animation-delay": motionData?.animation_delay ?? "0ms",
          background: PALETTE.paper,
          color: PALETTE.ink,
          ...THEME_TYPOGRAPHY.body,
        } as CSSProperties
      }
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <Mandala className="absolute top-40 -right-24 h-72 w-72 text-[#8E6B51] opacity-20 md:top-24 md:right-10 md:h-96 md:w-96" />
        <Mandala className="absolute top-[38rem] -left-36 h-80 w-80 rotate-45 text-[#8E6B51] opacity-[.12] md:left-0" />
      </div>

      <div className="relative z-10">
        {/* TOP BAR */}
        <header
          className="sticky top-0 z-40 border-b px-5 py-4 backdrop-blur-md md:px-10"
          style={{ background: "rgba(244,238,228,.92)", borderColor: PALETTE.line }}
        >
          <div className="mx-auto flex max-w-[1040px] items-center justify-between">
            <button onClick={() => scrollTo("top")} className="text-[12px] tracking-[.34em]" style={{ color: PALETTE.wine }}>
              CLEO
            </button>
            <div className="hidden items-center gap-6 text-[7px] tracking-[.18em] md:flex">
              {navItems.map(([id, label]) => (
                <button key={id} onClick={() => scrollTo(id)} className="transition-opacity hover:opacity-60">
                  {label}
                </button>
              ))}
            </div>
            <button
              aria-label="Open navigation"
              onClick={() => setMenuOpen(true)}
              className="rounded-full p-1 md:hidden"
              style={{ color: PALETTE.wine }}
            >
              <ThemeIcon name="menu" size={23} />
            </button>
          </div>
        </header>

        {/* HERO — editorial cover */}
        <motion.section
          id="top"
          key={`hero-${animationKey}`}
          {...motionFor(0)}
          className="relative px-5 pt-8 pb-10 md:px-10 md:pt-14 md:pb-16"
        >
          <div className="mx-auto max-w-[1040px]">
            <div className="grid items-end gap-7 md:grid-cols-[1.05fr_.95fr] md:gap-10">
              <div className="relative">
                <SectionKicker number="00" label="THE INVITATION" />

                <p className="mb-3 max-w-[260px] text-[8px] tracking-[.17em] uppercase md:text-[9px]" style={{ color: PALETTE.muted }}>
                  {hostLine}
                </p>

                <h1
                  className="max-w-[600px] text-[72px] leading-[.78] tracking-[-.055em] md:text-[112px] lg:text-[126px]"
                  style={{ ...THEME_TYPOGRAPHY.accent, color: PALETTE.wine }}
                >
                  {firstName}
                  <span className="ml-4 inline-block text-[.68em] italic" style={{ color: PALETTE.saffron }}>
                    &
                  </span>
                  <br />
                  <span className="ml-[12%]">{secondName}</span>
                </h1>

                <div className="mt-8 max-w-[430px] border-l pl-4 md:mt-12" style={{ borderColor: PALETTE.saffron }}>
                  <p className="text-[10px] leading-5 md:text-[11px]" style={{ color: PALETTE.muted }}>
                    {announcement}
                  </p>
                </div>

                <div className="mt-8 flex items-center gap-4">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-full border"
                    style={{ borderColor: PALETTE.saffron, color: PALETTE.saffron }}
                  >
                    <Diya className="h-9 w-9" />
                  </div>
                  <div>
                    <p className="text-[7px] tracking-[.18em] uppercase" style={{ color: PALETTE.muted }}>
                      {inviteTitle}
                    </p>
                    <p className="mt-1 text-[10px]" style={{ color: PALETTE.wine }}>
                      {primaryDateLabel} · {primaryTime}
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative md:pb-3">
                <div
                  className="absolute -top-5 -left-5 z-20 hidden w-28 border bg-[#315344] p-3 text-[7px] leading-4 tracking-[.12em] text-white uppercase md:block"
                  style={{ borderColor: PALETTE.paper }}
                >
                  शुभ
                  <br />
                  विवाह
                  <span className="mt-2 block text-[15px] tracking-normal normal-case">शुभम्</span>
                </div>
                <div className="relative ml-auto max-w-[470px]">
                  <img
                    src={heroImage}
                    alt={`${firstName} and ${secondName}`}
                    className="h-[430px] w-full object-cover md:h-[590px]"
                    style={{ borderRadius: "48% 48% 2px 2px", boxShadow: "0 24px 60px rgba(67,19,31,.12)" }}
                  />
                  <div className="absolute -bottom-5 -left-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#D7A42C] p-2 text-center text-[7px] leading-3 tracking-[.1em] text-[#43131F] uppercase md:-left-7">
                    <span>
                      two hearts
                      <br />
                      one sacred
                      <br />
                      journey
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 border-y py-4 md:mt-16" style={{ borderColor: PALETTE.line }}>
              <div className="grid grid-cols-3 text-center md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-center">
                <div>
                  <p className="text-[7px] tracking-[.2em] uppercase" style={{ color: PALETTE.muted }}>
                    Day
                  </p>
                  <p className="mt-1 text-[10px]" style={{ color: PALETTE.wine }}>
                    {primaryDay}
                  </p>
                </div>
                <span className="hidden h-8 w-px md:block" style={{ background: PALETTE.line }} />
                <div>
                  <p className="text-[7px] tracking-[.2em] uppercase" style={{ color: PALETTE.muted }}>
                    Date
                  </p>
                  <p className="mt-1 text-[10px]" style={{ color: PALETTE.wine }}>
                    {primaryDateLabel}
                  </p>
                </div>
                <span className="hidden h-8 w-px md:block" style={{ background: PALETTE.line }} />
                <div>
                  <p className="text-[7px] tracking-[.2em] uppercase" style={{ color: PALETTE.muted }}>
                    Place
                  </p>
                  <p className="mt-1 truncate px-2 text-[10px]" style={{ color: PALETTE.wine }}>
                    {primaryVenue}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* INTRO / ABOUT */}
        <motion.section
          id="story"
          key={`story-${animationKey}`}
          {...motionFor(0.08)}
          className="border-y px-5 py-12 md:px-10 md:py-20"
          style={{ background: PALETTE.paper2, borderColor: PALETTE.line }}
        >
          <div className="mx-auto grid max-w-[1040px] gap-10 md:grid-cols-[.32fr_1fr_.35fr] md:gap-14">
            <SectionKicker number="01" label="ABOUT US" />
            <div>
              <h2
                className="max-w-[720px] text-[42px] leading-[.92] tracking-[-.035em] md:text-[68px]"
                style={{ ...THEME_TYPOGRAPHY.accent, color: PALETTE.ink }}
              >
                A little story,
                <br />
                <em style={{ color: PALETTE.wine }}>a lifetime</em> ahead.
              </h2>
              <p className="mt-7 max-w-[620px] text-[10px] leading-6 md:text-[11px]" style={{ color: PALETTE.muted }}>
                {storyText}
              </p>
            </div>
            <div className="relative hidden md:block">
              <Mandala className="absolute -top-8 -right-10 h-44 w-44 text-[#681E2D]" />
              <p className="relative pt-28 text-right text-[9px] leading-5 tracking-[.12em] uppercase" style={{ color: PALETTE.wine }}>
                family
                <br />
                tradition
                <br />
                music
                <br />
                love
              </p>
            </div>
          </div>

          <div
            className="mx-auto mt-12 grid max-w-[1040px] grid-cols-2 border-t md:mt-16 md:grid-cols-4"
            style={{ borderColor: PALETTE.line }}
          >
            {storyMilestones.map((item: any, i: number) => (
              <motion.div
                key={`${item.title}-${i}`}
                {...motionFor(0.15 + i * 0.06)}
                className={`min-h-[150px] border-b p-5 ${i % 2 === 1 ? "md:border-l" : ""} ${i > 0 ? "border-l md:border-l" : ""}`}
                style={{ borderColor: PALETTE.line }}
              >
                <span className="text-[8px] tracking-[.18em]" style={{ color: PALETTE.saffron }}>
                  {item.year}
                </span>
                <h3 className="mt-8 text-[10px] tracking-[.12em]" style={{ color: PALETTE.wine }}>
                  {item.title}
                </h3>
                <p className="mt-2 text-[8px] leading-4" style={{ color: PALETTE.muted }}>
                  {item.text}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* FUNCTIONS */}
        <motion.section id="events" key={`events-${animationKey}`} {...motionFor(0.12)} className="px-5 py-12 md:px-10 md:py-20">
          <div className="mx-auto max-w-[1040px]">
            <div className="grid gap-8 md:grid-cols-[.38fr_1fr]">
              <div>
                <SectionKicker number="02" label="THE CELEBRATIONS" />
                <h2
                  className="text-[48px] leading-[.84] tracking-[-.04em] md:text-[76px]"
                  style={{ ...THEME_TYPOGRAPHY.accent, color: PALETTE.wine }}
                >
                  Four
                  <br />
                  <em style={{ color: PALETTE.leaf }}>beautiful</em>
                  <br />
                  moments.
                </h2>
                <p className="mt-7 max-w-[250px] text-[9px] leading-5" style={{ color: PALETTE.muted }}>
                  Every function has its own colour, rhythm and ritual. Come for one, stay for all.
                </p>
              </div>

              <div className="border-t" style={{ borderColor: PALETTE.line }}>
                {functions.map((fn: any, i: number) => {
                  const date = fn.date ? new Date(fn.date) : null;
                  const dateNum = date ? String(date.getDate()).padStart(2, "0") : ["14", "14", "15", "15"][i];
                  const month = date ? date.toLocaleString("en-US", { month: "short" }).toUpperCase() : "NOV";
                  const time = fn.startTime
                    ? new Date(fn.startTime).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
                    : fn.time || fn.locationName || "Details to follow";

                  return (
                    <motion.button
                      type="button"
                      key={fn.function_key ?? `${fn.title}-${i}`}
                      {...motionFor(0.18 + i * 0.08)}
                      onClick={() => scrollTo("venue")}
                      className="group grid w-full grid-cols-[60px_1fr_26px] items-center gap-4 border-b py-6 text-left md:grid-cols-[76px_1fr_160px_28px] md:gap-6 md:py-8"
                      style={{ borderColor: PALETTE.line }}
                    >
                      <div
                        className="flex h-14 w-14 flex-col items-center justify-center rounded-full border md:h-[68px] md:w-[68px]"
                        style={{ borderColor: PALETTE.saffron }}
                      >
                        <span className="text-[20px] leading-none" style={{ ...THEME_TYPOGRAPHY.accent, color: PALETTE.wine }}>
                          {dateNum}
                        </span>
                        <span className="mt-1 text-[6px] tracking-[.18em]" style={{ color: PALETTE.muted }}>
                          {month}
                        </span>
                      </div>
                      <div>
                        <p className="text-[9px] tracking-[.18em] uppercase" style={{ color: PALETTE.muted }}>
                          0{i + 1} · {time}
                        </p>
                        <h3
                          className="mt-2 text-[25px] leading-none md:text-[32px]"
                          style={{ ...THEME_TYPOGRAPHY.accent, color: PALETTE.ink }}
                        >
                          {fn.title}
                        </h3>
                        <p className="mt-2 text-[8px]" style={{ color: PALETTE.muted }}>
                          {fn.locationName || "Venue details to follow"}
                        </p>
                      </div>
                      <span className="hidden text-right text-[7px] tracking-[.14em] uppercase md:block" style={{ color: PALETTE.wine }}>
                        View
                        <br />
                        details
                      </span>
                      <span className="transition-transform group-hover:translate-x-1" style={{ color: PALETTE.saffron }}>
                        <ThemeIcon name="chevron" size={17} />
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.section>

        {/* CALENDAR / DATE */}
        <motion.section {...motionFor(0.16)} className="px-5 pb-12 md:px-10 md:pb-20">
          <div className="mx-auto grid max-w-[1040px] items-center gap-8 md:grid-cols-[1fr_1.2fr]">
            <div className="relative overflow-hidden border p-8" style={{ borderColor: PALETTE.line, background: PALETTE.paper2 }}>
              <Mandala className="absolute -right-12 -bottom-12 h-48 w-48 text-[#681E2D] opacity-20" />
              <p className="relative text-[7px] tracking-[.2em] uppercase" style={{ color: PALETTE.muted }}>
                SAVE THE DATE
              </p>
              <p className="relative mt-4 text-[58px] leading-[.82]" style={{ ...THEME_TYPOGRAPHY.accent, color: PALETTE.wine }}>
                {primaryDate ? primaryDate.getDate() : "15"}
              </p>
              <p className="relative mt-2 text-[11px] tracking-[.22em]" style={{ color: PALETTE.saffron }}>
                {primaryDate ? primaryDate.toLocaleString("en-US", { month: "long" }).toUpperCase() : "NOVEMBER"}
              </p>
              <p className="relative mt-1 text-[8px]" style={{ color: PALETTE.muted }}>
                {primaryDate ? primaryDate.getFullYear() : "2026"}
              </p>
            </div>
            <div className="md:pl-8">
              <WeddingCalendar
                year={primaryDate?.getFullYear() ?? 2026}
                month={primaryDate?.getMonth() ?? 10}
                selectedDate={primaryDate?.getDate() ?? 15}
              />
            </div>
          </div>
        </motion.section>

        {/* GALLERY */}
        {!gallery.hidden && (
          <motion.section
            id="gallery"
            {...motionFor(0.14)}
            className="border-y px-5 py-12 md:px-10 md:py-20"
            style={{ background: PALETTE.wineDeep, borderColor: PALETTE.wineDeep }}
          >
            <div className="mx-auto max-w-[1040px]">
              <div className="mb-8 flex items-end justify-between text-white">
                <div>
                  <SectionKicker number="03" label="MEMORIES" light />
                  <h2 className="text-[50px] leading-[.82] md:text-[80px]" style={{ ...THEME_TYPOGRAPHY.accent }}>
                    Love,
                    <br />
                    <em style={{ color: "#D7A42C" }}>framed.</em>
                  </h2>
                </div>
                <span className="hidden max-w-[180px] text-right text-[8px] leading-4 text-white/60 md:block">
                  A visual chapter of the people, places and little details that brought us here.
                </span>
              </div>

              <GallerySection
                animationKey={animationKey}
                getMotionProps={getMotionProps}
                layout={LunaData.galleryLayout || "editorial"}
                urls={LunaData.galleryUrls?.length ? LunaData.galleryUrls : DUMMY_GALLERY}
                fallback={heroImage}
                title="Memories"
                isProtected={gallery.protected}
                password={gallery.password}
                unlockedSections={unlockedSections}
                setUnlockedSections={setUnlockedSections}
              />
            </div>
          </motion.section>
        )}

        {/* VENUE */}
        <motion.section id="venue" key={`venue-${animationKey}`} {...motionFor(0.16)} className="px-5 py-12 md:px-10 md:py-20">
          <div className="mx-auto max-w-[1040px]">
            <SectionKicker number="04" label="THE VENUE" />
            <div className="grid gap-7 md:grid-cols-[1fr_.9fr] md:gap-12">
              <div className="relative min-h-[350px] overflow-hidden border" style={{ borderColor: PALETTE.line, background: "#DED2C2" }}>
                {mapEmbed ? (
                  <iframe
                    title="Wedding venue map"
                    src={mapEmbed}
                    className="h-full min-h-[350px] w-full border-0 grayscale"
                    loading="lazy"
                  />
                ) : (
                  <div className="relative flex min-h-[350px] items-center justify-center">
                    <div
                      className="absolute inset-0 opacity-20"
                      style={{
                        backgroundImage:
                          "linear-gradient(rgba(67,19,31,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(67,19,31,.4) 1px, transparent 1px)",
                        backgroundSize: "38px 38px",
                      }}
                    />
                    <Mandala className="absolute h-80 w-80 text-[#681E2D]" />
                    <div className="relative text-center">
                      <div
                        className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full"
                        style={{ background: PALETTE.wine, color: PALETTE.saffron }}
                      >
                        <ThemeIcon name="venue" size={23} />
                      </div>
                      <p className="text-[8px] tracking-[.2em] uppercase" style={{ color: PALETTE.muted }}>
                        CEREMONY HERE
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col justify-center">
                <p className="text-[7px] tracking-[.2em] uppercase" style={{ color: PALETTE.saffron }}>
                  THE MANDAPAM
                </p>
                <h2 className="mt-3 text-[46px] leading-[.86] md:text-[64px]" style={{ ...THEME_TYPOGRAPHY.accent, color: PALETTE.wine }}>
                  {venueName}
                </h2>
                <p className="mt-5 max-w-[390px] text-[10px] leading-5" style={{ color: PALETTE.muted }}>
                  {venueAddress}
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <a
                    href={venueMapUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 border px-5 py-3 text-[7px] tracking-[.16em] uppercase"
                    style={{ borderColor: PALETTE.wine, color: PALETTE.wine }}
                  >
                    <ThemeIcon name="venue" size={14} /> Open map
                  </a>
                  <button
                    type="button"
                    onClick={() => scrollTo("rsvp")}
                    className="inline-flex items-center gap-2 px-5 py-3 text-[7px] tracking-[.16em] uppercase"
                    style={{ background: PALETTE.wine, color: PALETTE.paper }}
                  >
                    RSVP
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* MUSIC + DRESS */}
        <motion.section
          {...motionFor(0.16)}
          className="border-y px-5 py-12 md:px-10 md:py-16"
          style={{ background: PALETTE.paper2, borderColor: PALETTE.line }}
        >
          <div className="mx-auto grid max-w-[1040px] gap-10 md:grid-cols-2">
            <div id="music">
              <SectionKicker number="05" label="THE SOUNDTRACK" />
              <h2 className="text-[42px] leading-[.86] md:text-[58px]" style={{ ...THEME_TYPOGRAPHY.accent, color: PALETTE.wine }}>
                Press play.
                <br />
                <em style={{ color: PALETTE.leaf }}>Let love</em> begin.
              </h2>
              <div className="mt-7">
                <AudioPlayer
                  src={music?.background_audio ?? ""}
                  name={music?.background_audio_name ?? "Our Wedding Soundtrack"}
                  cover={DUMMY_GALLERY[2]}
                  variant={music?.audio_player_variant}
                  allowMute={music?.allow_mute ?? true}
                  loop={music?.loop_music ?? true}
                  fadeIn={music?.fade_in ?? false}
                  fadeOut={music?.fade_out ?? false}
                  volume={music?.volume_level ?? 60}
                />
              </div>
            </div>

            <div id="dress-code">
              <SectionKicker number="06" label="WHAT TO WEAR" />
              <div className="relative border p-7 md:p-9" style={{ borderColor: PALETTE.line, background: PALETTE.paper }}>
                <div className="absolute top-5 right-5 flex gap-2">
                  {(LunaData?.dressCode?.[0]?.hexColors?.length
                    ? LunaData.dressCode[0].hexColors
                    : [PALETTE.wine, PALETTE.saffron, PALETTE.leaf]
                  )
                    .slice(0, 4)
                    .map((color: string) => (
                      <span
                        key={color}
                        className="h-5 w-5 rounded-full border border-white"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                </div>
                <p className="pt-7 text-[7px] tracking-[.18em] uppercase" style={{ color: PALETTE.muted }}>
                  FESTIVE INDIAN
                </p>
                <h3 className="mt-3 text-[40px] leading-[.85]" style={{ ...THEME_TYPOGRAPHY.accent, color: PALETTE.ink }}>
                  Silk, colour
                  <br />& celebration.
                </h3>
                <p className="mt-6 max-w-[390px] text-[9px] leading-5" style={{ color: PALETTE.muted }}>
                  {dressCode}
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* WISHES */}
        {!wishes.hidden && (
          <WishesSection
            animationKey={animationKey}
            getMotionProps={getMotionProps}
            eventKey={eventKey}
            wishesRaw={LunaData.wishesRaw}
            wishesContainerRef={wishesContainerRef}
            wishRefreshKey={wishRefreshKey}
            setWishRefreshKey={setWishRefreshKey}
            title={LunaData.wishesTitle ?? "Leave a little love"}
            isIcon={false}
            isProtected={wishes.protected}
            password={wishes.password}
            unlockedSections={unlockedSections}
            setUnlockedSections={setUnlockedSections}
          />
        )}

        {/* RSVP */}
        <motion.section id="rsvp" key={`rsvp-${animationKey}`} {...motionFor(0.18)} className="px-5 py-14 md:px-10 md:py-24">
          <div className="mx-auto grid max-w-[1040px] gap-10 md:grid-cols-[.7fr_1fr] md:gap-16">
            <div>
              <SectionKicker number="07" label="KINDLY RESPOND" />
              <h2 className="text-[58px] leading-[.82] md:text-[82px]" style={{ ...THEME_TYPOGRAPHY.accent, color: PALETTE.wine }}>
                Will you
                <br />
                <em style={{ color: PALETTE.leaf }}>join us?</em>
              </h2>
              <p className="mt-6 max-w-[340px] text-[9px] leading-5" style={{ color: PALETTE.muted }}>
                Your presence is the most beautiful gift. Please let us know if we can save you a seat at our celebration.
              </p>
              <p className="mt-5 text-[7px] tracking-[.16em] uppercase" style={{ color: PALETTE.saffron }}>
                RSVP by 01 November 2026
              </p>
            </div>

            <form onSubmit={submitRsvp} className="border p-5 md:p-8" style={{ borderColor: PALETTE.line, background: PALETTE.paper2 }}>
              <div className="grid gap-5">
                <label className="block">
                  <span className="text-[7px] tracking-[.16em] uppercase" style={{ color: PALETTE.muted }}>
                    Your name
                  </span>
                  <input
                    required
                    value={rsvpName}
                    onChange={(e) => setRsvpName(e.target.value)}
                    placeholder="A guest we love"
                    className="mt-2 w-full border-b bg-transparent px-0 py-2 text-[11px] outline-none placeholder:text-[#9C8D82]"
                    style={{ borderColor: PALETTE.line }}
                  />
                </label>

                <div className="grid grid-cols-2 gap-4">
                  <label className="block">
                    <span className="text-[7px] tracking-[.16em] uppercase" style={{ color: PALETTE.muted }}>
                      Response
                    </span>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setRsvp("yes")}
                        className="border py-3 text-[7px] tracking-[.12em]"
                        style={{
                          borderColor: rsvp === "yes" ? PALETTE.wine : PALETTE.line,
                          background: rsvp === "yes" ? PALETTE.wine : "transparent",
                          color: rsvp === "yes" ? PALETTE.paper : PALETTE.ink,
                        }}
                      >
                        JOYFULLY YES
                      </button>
                      <button
                        type="button"
                        onClick={() => setRsvp("no")}
                        className="border py-3 text-[7px] tracking-[.12em]"
                        style={{
                          borderColor: rsvp === "no" ? PALETTE.wine : PALETTE.line,
                          background: rsvp === "no" ? PALETTE.wine : "transparent",
                          color: rsvp === "no" ? PALETTE.paper : PALETTE.ink,
                        }}
                      >
                        SORRY
                      </button>
                    </div>
                  </label>

                  <label className="block">
                    <span className="text-[7px] tracking-[.16em] uppercase" style={{ color: PALETTE.muted }}>
                      Guests
                    </span>
                    <select
                      value={guestCount}
                      onChange={(e) => setGuestCount(e.target.value)}
                      className="mt-2 w-full border-b bg-transparent py-3 text-[10px] outline-none"
                      style={{ borderColor: PALETTE.line }}
                    >
                      {["1", "2", "3", "4", "5", "6+"].map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <label className="block">
                  <span className="text-[7px] tracking-[.16em] uppercase" style={{ color: PALETTE.muted }}>
                    A note for the couple
                  </span>
                  <textarea
                    value={rsvpNote}
                    onChange={(e) => setRsvpNote(e.target.value)}
                    rows={3}
                    placeholder="A blessing, a song request, or simply hello..."
                    className="mt-2 w-full resize-none border-b bg-transparent px-0 py-2 text-[10px] outline-none placeholder:text-[#9C8D82]"
                    style={{ borderColor: PALETTE.line }}
                  />
                </label>

                <button
                  type="submit"
                  disabled={!rsvp}
                  className="mt-2 flex items-center justify-center gap-2 py-4 text-[8px] tracking-[.18em] uppercase disabled:cursor-not-allowed disabled:opacity-40"
                  style={{ background: PALETTE.wine, color: PALETTE.paper }}
                >
                  <ThemeIcon name="check" size={15} />
                  {rsvpSent ? "RESPONSE SAVED" : "SEND MY RSVP"}
                </button>

                {rsvpSent && (
                  <p className="text-center text-[8px] leading-4" style={{ color: PALETTE.leaf }}>
                    Thank you, {rsvpName || "dear guest"}. We have saved your response for the celebration.
                  </p>
                )}
              </div>
            </form>
          </div>
        </motion.section>

        {/* FINAL EDITORIAL PANEL */}
        <motion.section
          {...motionFor(0.18)}
          className="relative overflow-hidden px-6 py-16 text-center md:px-16 md:py-24"
          style={{ background: PALETTE.leaf, color: PALETTE.paper }}
        >
          <Mandala className="absolute -top-20 -left-16 h-72 w-72 text-white opacity-10" />
          <Mandala className="absolute -right-12 -bottom-24 h-80 w-80 text-[#D7A42C] opacity-20" />
          <div className="relative mx-auto max-w-[720px]">
            <p className="text-[7px] tracking-[.3em] text-white/60 uppercase">AND SO, THE STORY CONTINUES</p>
            <h2 className="mt-5 text-[54px] leading-[.82] md:text-[86px]" style={{ ...THEME_TYPOGRAPHY.accent }}>
              See you
              <br />
              <em style={{ color: PALETTE.saffron }}>under the mandap.</em>
            </h2>
            <div className="mx-auto mt-8 flex justify-center">
              <Diya className="h-14 w-20 text-[#D7A42C]" />
            </div>
            <p className="mt-5 text-[8px] tracking-[.22em] text-white/65 uppercase">
              {firstName} & {secondName} · {primaryDateLabel}
            </p>
          </div>
        </motion.section>

        {/* FOOTER */}
        <footer className="px-5 py-10 md:px-10">
          <div className="mx-auto flex max-w-[1040px] flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[15px] tracking-[.28em]" style={{ color: PALETTE.wine }}>
                CLEO
              </p>
              <p className="mt-2 max-w-[300px] text-[7px] leading-4 tracking-[.12em] uppercase" style={{ color: PALETTE.muted }}>
                A modern Indian wedding invitation for {firstName} & {secondName}.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-x-10 gap-y-3 text-[7px] tracking-[.13em] uppercase" style={{ color: PALETTE.muted }}>
              <button onClick={() => scrollTo("story")} className="text-left">
                Our Story
              </button>
              <button onClick={() => scrollTo("events")} className="text-left">
                Celebrations
              </button>
              <button onClick={() => scrollTo("gallery")} className="text-left">
                Memories
              </button>
              <button onClick={() => scrollTo("venue")} className="text-left">
                Venue
              </button>
              <button onClick={() => scrollTo("rsvp")} className="text-left">
                RSVP
              </button>
              <button onClick={() => scrollTo("top")} className="text-left">
                Back to top
              </button>
            </div>
          </div>
          <div
            className="mx-auto mt-8 max-w-[1040px] border-t pt-4 text-[6px] tracking-[.12em] uppercase"
            style={{ borderColor: PALETTE.line, color: PALETTE.muted }}
          >
            © {primaryDate?.getFullYear() ?? 2026} {firstName} & {secondName}. With love, family & tradition.
          </div>
        </footer>

        {/* MOBILE NAV */}
        {menuOpen && (
          <div className="fixed inset-0 z-50 flex flex-col md:hidden" style={{ background: PALETTE.wine }}>
            <div className="flex items-center justify-between px-6 py-6" style={{ color: PALETTE.paper }}>
              <span className="text-[15px] tracking-[.3em]">CLEO</span>
              <button onClick={() => setMenuOpen(false)} aria-label="Close navigation">
                <ThemeIcon name="close" size={26} />
              </button>
            </div>
            <nav className="mt-8 flex flex-col px-8">
              {navItems.map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  className="flex items-center justify-between border-b py-5 text-left text-[9px] tracking-[.2em]"
                  style={{ borderColor: "rgba(255,255,255,.16)", color: PALETTE.paper }}
                >
                  <span>{label}</span>
                  <ThemeIcon name="chevron" size={15} />
                </button>
              ))}
            </nav>
            <div className="mt-auto p-8">
              <Mandala className="mx-auto h-36 w-36 text-[#D7A42C] opacity-40" />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
