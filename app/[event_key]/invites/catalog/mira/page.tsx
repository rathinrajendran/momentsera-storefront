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
import { THEME_COLORS } from "../../core/core/themeColors";
import { ThemeIcon, type ThemeIconName } from "../../core/core/themeIcons";
import AudioPlayer from "../../../../../components/ui/AudioPlayer";

interface MiraProps {
  data: any;
  eventKey: string;
  motionData: any;
  settings: any;
  theme?: any;
  music?: any;
}

const FALLBACK_HERO = "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=85";

const FALLBACK_GALLERY = [
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1519225421980-da6f2b4f5f0e?auto=format&fit=crop&w=700&q=80",
];

const FLOWER = "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=500&q=60";

function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export default function Mira({ data, eventKey, motionData, settings, music }: MiraProps) {
  const invite = useInviteData(data);
  const { getMotionProps } = useThemeAnimation(design?.motion);

  const animationKey = useMemo(() => getAnimationKey(design?.motion), [design?.motion]);

  const [menuOpen, setMenuOpen] = useState(false);
  const [rsvp, setRsvp] = useState<"yes" | "no" | null>(null);
  const [wishRefreshKey, setWishRefreshKey] = useState(0);
  const wishesContainerRef = useRef<HTMLElement | null>(null);

  const firstName = invite.firstName || invite.brideName || "Noah";
  const secondName = invite.secondName || invite.groomName || "Liv";
  const heroImage = invite.heroImage || FALLBACK_HERO;

  const gallery = getSectionConfig(settings?.section_visibility, "gallery");
  const wishes = getSectionConfig(settings?.section_visibility, "wishes");

  const { unlockedSections, setUnlockedSections } = useUnlockedSections(eventKey);

  const functions = invite.eventFunctions?.length
    ? invite.eventFunctions
    : [
        {
          title: "Ceremony",
          date: "2026-06-19",
          startTime: "2026-06-19T15:00:00",
          locationName: 'Join us as we say "I do"',
        },
        {
          title: "Cocktail Hour",
          date: "2026-06-19",
          startTime: "2026-06-19T16:00:00",
          locationName: "Drinks & canapés in the garden",
        },
        {
          title: "Photos",
          date: "2026-06-19",
          startTime: "2026-06-19T17:30:00",
          locationName: "Let's capture some memories",
        },
        {
          title: "Dinner",
          date: "2026-06-19",
          startTime: "2026-06-19T19:00:00",
          locationName: "A delicious meal & heartfelt toasts",
        },
        {
          title: "Dancing",
          date: "2026-06-19",
          startTime: "2026-06-19T21:00:00",
          locationName: "Let's dance the night away!",
        },
      ];

  const primaryFunction = invite.primaryFunction || functions[0];

  const primaryDate = primaryFunction?.startTime
    ? new Date(primaryFunction.startTime)
    : primaryFunction?.date
      ? new Date(primaryFunction.date)
      : null;

  const year = primaryDate?.getFullYear() || 2026;
  const monthIndex = primaryDate?.getMonth() ?? 5;
  const day = primaryDate?.getDate() ?? 19;

  const dateLabel = primaryDate
    ? primaryDate
        .toLocaleDateString("en-US", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
        .replace(/\//g, ".")
    : "19.06.2026";

  const longDate = primaryDate
    ? primaryDate.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "19 June 2026";

  const monthLabel = primaryDate
    ? primaryDate
        .toLocaleDateString("en-US", {
          month: "long",
        })
        .toUpperCase()
    : "JUNE 2026";

  const venue = primaryFunction?.venueName || primaryFunction?.locationName || "Villa di Lusso";

  const venueLocation = primaryFunction?.address || primaryFunction?.location || "Tuscany, Italy";

  const motionFor = (delay: number) => {
    const { key: _key, ...props } = getMotionProps(delay);
    return props;
  };

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const shellStyle = {
    "--animation-enabled": design?.motion?.animations === false ? "0" : "1",
    "--animation-style": design?.motion?.animation_style ?? "smooth",
    "--animation-scroll": design?.motion?.scroll_behavior ?? "on-scroll",
    "--animation-duration": design?.motion?.animation_duration ?? "1s",
    "--animation-delay": design?.motion?.animation_delay ?? "0ms",
    "--animation-speed": `${design?.motion?.animation_speed ?? 50}`,
    "--animation-loop": design?.motion?.animation_loop ? "1" : "0",
    background: "#d9d9d0",
    color: "#45483f",
    ...({
      backgroundImage: "var(--bg-image, none)",
      backgroundPosition: "var(--bg-position, center)",
      backgroundSize: "var(--bg-size, cover)",
      backgroundRepeat: "var(--bg-repeat, repeat)",
    } as CSSProperties),
  } as CSSProperties;

  const panelStyle: CSSProperties = {
    background: "#f3f2ec",
    border: "1px solid rgba(68,72,63,.10)",
    boxShadow: "0 18px 45px rgba(38,43,35,.16), 0 2px 8px rgba(38,43,35,.08)",
    borderRadius: 15,
  };

  const serifStyle: CSSProperties = {
    fontFamily: "var(--font-accent, Georgia), Georgia, 'Times New Roman', serif",
  };

  const scriptStyle: CSSProperties = {
    fontFamily: "var(--font-accent, 'Segoe Script'), 'Brush Script MT', cursive",
    fontWeight: 400,
  };

  const ink = "#4b4d45";
  const olive = "#56604b";
  const oliveDark = "#404a3d";
  const sage = "#9b9e8f";
  const stone = "#c7c4b8";
  const blush = "#d7c0b9";
  const champagne = "#ded0b3";
  const panel = "#f3f2ec";
  const soft = "#e8e7df";
  const rule = "rgba(67,72,61,.22)";

  const calendar = useMemo(() => {
    const first = new Date(year, monthIndex, 1);
    const last = new Date(year, monthIndex + 1, 0);
    const start = first.getDay();
    const days = last.getDate();

    const cells: Array<number | null> = [];
    for (let i = 0; i < start; i++) cells.push(null);
    for (let i = 1; i <= days; i++) cells.push(i);

    return cells;
  }, [year, monthIndex]);

  const formatTime = (fn: any) => {
    if (!fn?.startTime) return "";
    return new Date(fn.startTime).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const eventIcon = (index: number): ThemeIconName => {
    const icons: ThemeIconName[] = ["heart", "music", "image", "venue", "music", "gift"];
    return icons[index] || "heart";
  };

  return (
    <main key={animationKey} className="min-h-screen overflow-x-hidden" style={shellStyle}>
      {/* ============================================================
          MIRA DESKTOP BOARD
      ============================================================ */}
      <div className="mx-auto max-w-[1500px] px-3 py-3 md:px-5 md:py-5 lg:px-8">
        <div className="mb-3 flex items-center justify-between px-2 md:hidden">
          <button onClick={() => scrollTo("mira-home")} className="text-[10px] tracking-[0.22em] uppercase" style={{ color: oliveDark }}>
            {firstName} &amp; {secondName}
          </button>

          <button
            onClick={() => setMenuOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-full border"
            style={{ borderColor: rule, color: oliveDark }}
            aria-label="Open menu"
          >
            <ThemeIcon name="menu" size={18} />
          </button>
        </div>

        <div id="mira-home" className="grid gap-4 lg:grid-cols-3 lg:items-stretch">
          {/* ============================================================
              PANEL 1 — HERO + PHOTO + WELCOME
          ============================================================ */}
          <section id="story" className="relative flex min-h-[760px] flex-col overflow-hidden md:min-h-[850px]" style={panelStyle}>
            <motion.div {...motionFor(0)} className="relative flex flex-1 flex-col">
              {/* Top decorative header */}
              <div className="relative px-7 pt-8 pb-5 text-center md:px-8 md:pt-10">
                <div className="absolute top-4 left-4 opacity-60">
                  <span className="text-[27px]" style={{ color: sage }}>
                    ❧
                  </span>
                </div>

                <div className="absolute top-4 right-4 opacity-60">
                  <span className="block rotate-[135deg] text-[27px]" style={{ color: sage }}>
                    ❧
                  </span>
                </div>

                <button
                  onClick={() => setMenuOpen(true)}
                  className="absolute top-7 right-6 hidden md:block"
                  aria-label="Open menu"
                  style={{ color: ink }}
                >
                  <ThemeIcon name="menu" size={18} />
                </button>

                <span className="block text-[8px] tracking-[0.3em] uppercase" style={{ color: sage }}>
                  The wedding of
                </span>

                <h1 className="mt-6 text-[40px] leading-[1.05] tracking-[0.18em] uppercase" style={{ ...serifStyle, color: ink }}>
                  {firstName}
                </h1>

                <div className="my-1 text-[26px] leading-none" style={{ ...scriptStyle, color: olive }}>
                  &amp;
                </div>

                <h2 className="text-[40px] leading-[1.05] tracking-[0.18em] uppercase" style={{ ...serifStyle, color: ink }}>
                  {secondName}
                </h2>

                <div className="mx-auto mt-4 flex w-[110px] items-center justify-center gap-2">
                  <span className="h-px flex-1" style={{ background: rule }} />
                  <span className="text-[12px]" style={{ color: sage }}>
                    ❧
                  </span>
                  <span className="h-px flex-1" style={{ background: rule }} />
                </div>

                <p className="mt-4 text-[9px] tracking-[0.24em]" style={{ color: olive }}>
                  {dateLabel}
                </p>
              </div>

              {/* Torn-photo treatment */}
              <div className="relative mt-1 h-[310px] overflow-hidden md:h-[350px]">
                <div
                  className="absolute inset-0 z-10"
                  style={{
                    clipPath:
                      "polygon(0 8%, 5% 5%, 10% 7%, 15% 4%, 20% 7%, 25% 3%, 31% 7%, 37% 4%, 43% 7%, 49% 3%, 56% 7%, 63% 4%, 70% 7%, 77% 3%, 84% 7%, 91% 4%, 100% 8%, 100% 94%, 94% 97%, 87% 94%, 80% 98%, 73% 95%, 65% 98%, 57% 94%, 50% 98%, 42% 95%, 34% 98%, 26% 94%, 18% 97%, 10% 94%, 0 97%)",
                  }}
                >
                  <img src={heroImage} alt={`${firstName} and ${secondName}`} className="h-full w-full object-cover grayscale-[30%]" />
                </div>

                <div
                  className="absolute inset-x-0 bottom-0 z-20 h-24"
                  style={{
                    background: "linear-gradient(to bottom, transparent, rgba(64,74,61,.12))",
                  }}
                />
              </div>

              {/* Welcome olive block */}
              <div
                className="relative mt-[-2px] flex flex-1 flex-col justify-between overflow-hidden px-7 pt-8 pb-8 md:px-8"
                style={{
                  background: oliveDark,
                  color: panel,
                }}
              >
                <div
                  className="pointer-events-none absolute right-0 -bottom-4 left-0 h-[130px] opacity-25"
                  style={{
                    backgroundImage: `url(${FLOWER})`,
                    backgroundPosition: "bottom center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "260px",
                    filter: "grayscale(1) brightness(1.8)",
                  }}
                />

                <div className="relative text-center">
                  <h3 className="text-[28px]" style={{ ...scriptStyle, color: panel }}>
                    Dear Guests,
                  </h3>

                  <p className="mx-auto mt-6 max-w-[300px] text-[9px] leading-5 opacity-80">
                    {invite.announcement?.announcement?.message ||
                      "We are so excited to celebrate our wedding with you. Your love and support mean the world to us, and we can't wait to create beautiful memories together."}
                  </p>

                  <p className="mt-7 text-[9px] opacity-70">With love,</p>

                  <p className="mt-1 text-[19px]" style={{ ...scriptStyle, color: panel }}>
                    {firstName} &amp; {secondName}
                  </p>
                </div>

                <div className="relative mt-6 text-center">
                  <span className="text-[36px] opacity-50">❦</span>
                </div>
              </div>
            </motion.div>
          </section>

          {/* ============================================================
              PANEL 2 — DETAILS + CALENDAR + DAY + DRESS
          ============================================================ */}
          <section id="events" className="relative overflow-hidden" style={panelStyle}>
            <motion.div {...motionFor(0.1)}>
              <div className="px-6 pt-9 pb-4 text-center md:px-8 md:pt-11">
                <span className="text-[30px] italic" style={{ ...scriptStyle, color: ink }}>
                  The Details
                </span>

                <div className="mx-auto mt-3 h-px w-12" style={{ background: rule }} />
              </div>

              {/* Calendar */}
              <div className="px-7 pt-3 md:px-9">
                <p className="mb-4 text-center text-[8px] tracking-[0.28em]" style={{ color: olive }}>
                  {monthLabel}
                </p>

                <div className="grid grid-cols-7 gap-y-2 text-center">
                  {["M", "T", "W", "T", "F", "S", "S"].map((dayName) => (
                    <span key={dayName} className="text-[7px]" style={{ color: sage }}>
                      {dayName}
                    </span>
                  ))}

                  {calendar.map((cell, index) => {
                    const jsDay = cell ? new Date(year, monthIndex, cell).getDay() : -1;

                    const isSelected = cell === day;
                    const isSunday = jsDay === 0;

                    return (
                      <span
                        key={`${cell}-${index}`}
                        className="mx-auto flex h-7 w-7 items-center justify-center text-[8px]"
                        style={{
                          borderRadius: "50%",
                          background: isSelected ? oliveDark : "transparent",
                          color: isSelected ? panel : isSunday ? olive : ink,
                        }}
                      >
                        {cell}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Day title */}
              <div className="px-7 pt-9 pb-5 text-center md:px-9">
                <span className="text-[29px]" style={{ ...scriptStyle, color: ink }}>
                  The Day
                </span>
              </div>

              {/* Event timeline */}
              <div className="px-7 md:px-9">
                <div className="space-y-0">
                  {functions.slice(0, 5).map((fn: any, index: number) => (
                    <motion.div
                      key={fn.function_key ?? `${fn.title}-${index}`}
                      {...motionFor(0.16 + index * 0.06)}
                      className="grid grid-cols-[26px_42px_1fr] items-center gap-2 border-b py-3"
                      style={{ borderColor: "rgba(67,72,61,.13)" }}
                    >
                      <div className="flex justify-center" style={{ color: olive }}>
                        <ThemeIcon name={eventIcon(index)} size={16} />
                      </div>

                      <span className="text-[8px]" style={{ color: sage }}>
                        {formatTime(fn) || ["15:00", "16:00", "17:30", "19:00", "21:00"][index]}
                      </span>

                      <div>
                        <p className="text-[8px] font-semibold tracking-[0.13em] uppercase" style={{ color: ink }}>
                          {fn.title}
                        </p>
                        <p className="mt-1 text-[7px] leading-3" style={{ color: sage }}>
                          {fn.locationName || "Join us for this special moment."}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Dress code */}
              <div
                id="dress-code"
                className="relative mt-6 overflow-hidden px-7 pt-8 pb-9 md:px-9"
                style={{ background: oliveDark, color: panel }}
              >
                <div className="text-center">
                  <span className="text-[28px]" style={{ ...scriptStyle, color: panel }}>
                    Dress Code
                  </span>

                  <div className="mx-auto mt-3 h-px w-12 bg-white/30" />
                </div>

                <div className="mt-7 grid grid-cols-3 gap-x-3 gap-y-5">
                  {(invite?.dressCode?.length
                    ? invite.dressCode
                    : [
                        {
                          title: "Sage",
                          hexColors: ["#a8aa9a"],
                        },
                        {
                          title: "Olive",
                          hexColors: ["#777968"],
                        },
                        {
                          title: "Stone",
                          hexColors: ["#c8c3b8"],
                        },
                        {
                          title: "Dusty Rose",
                          hexColors: ["#d3b9b2"],
                        },
                        {
                          title: "Taupe",
                          hexColors: ["#a69d90"],
                        },
                        {
                          title: "Champagne",
                          hexColors: ["#ddd0b5"],
                        },
                      ]
                  )
                    .slice(0, 6)
                    .map((dress: any, index: number) => {
                      const color = dress?.hexColors?.[0] || ["#a8aa9a", "#777968", "#c8c3b8", "#d3b9b2", "#a69d90", "#ddd0b5"][index];

                      return (
                        <div key={`${dress.title}-${index}`} className="text-center">
                          <span className="mx-auto block h-10 w-10 rounded-full border border-white/40" style={{ background: color }} />
                          <span className="mt-2 block text-[6px] tracking-[0.08em] uppercase opacity-80">
                            {dress.title || `Tone ${index + 1}`}
                          </span>
                        </div>
                      );
                    })}
                </div>

                <p className="mx-auto mt-7 max-w-[250px] text-center text-[8px] leading-4 opacity-75">
                  We kindly ask our guests to wear the above colours.
                </p>

                <div className="mt-5 text-center text-[26px] opacity-60">❧ ❧ ❧</div>
              </div>
            </motion.div>
          </section>

          {/* ============================================================
              PANEL 3 — VENUE + MAP + RSVP
          ============================================================ */}
          <section id="rsvp" className="relative overflow-hidden" style={panelStyle}>
            <motion.div {...motionFor(0.2)}>
              {/* Venue */}
              <div id="venue" className="px-7 pt-9 pb-5 text-center md:px-8 md:pt-11">
                <span className="text-[30px]" style={{ ...scriptStyle, color: ink }}>
                  The Venue
                </span>

                <div className="mx-auto mt-3 h-px w-12" style={{ background: rule }} />
              </div>

              <div className="relative h-[225px] overflow-hidden">
                <img
                  src={heroImage}
                  alt={venue}
                  className="h-full w-full object-cover"
                  style={{
                    filter: "sepia(.18) saturate(.65) contrast(.95)",
                  }}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(to bottom, rgba(45,53,43,.05), rgba(45,53,43,.2))",
                  }}
                />
              </div>

              <div className="px-7 py-6 text-center md:px-8">
                <h3 className="text-[14px] tracking-[0.18em] uppercase" style={{ ...serifStyle, color: ink }}>
                  {venue}
                </h3>

                <p className="mt-2 text-[8px] tracking-[0.2em] uppercase" style={{ color: sage }}>
                  {venueLocation}
                </p>

                <button
                  className="mt-5 border px-6 py-2.5 text-[7px] tracking-[0.18em] uppercase"
                  style={{ borderColor: rule, color: ink }}
                >
                  View Location
                </button>
              </div>

              {/* Decorative map */}
              <div
                className="relative h-[190px] overflow-hidden border-y"
                style={{
                  borderColor: "rgba(67,72,61,.10)",
                  background:
                    "linear-gradient(35deg, transparent 0 20%, rgba(86,96,75,.06) 21% 22%, transparent 23% 100%), linear-gradient(120deg, transparent 0 48%, rgba(86,96,75,.07) 49% 50%, transparent 51%), #e8e7df",
                }}
              >
                <div className="absolute top-[25%] left-[18%] h-px w-[55%] rotate-[23deg] bg-black/10" />
                <div className="absolute top-[55%] left-[35%] h-px w-[70%] -rotate-[13deg] bg-black/10" />
                <div className="absolute top-[72%] left-[20%] h-px w-[45%] rotate-[8deg] bg-black/10" />
                <div className="absolute top-[25%] left-[63%] h-[130px] w-px rotate-[25deg] bg-black/10" />

                <div className="absolute top-[48%] left-[58%] flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-full"
                    style={{
                      background: oliveDark,
                      color: panel,
                      boxShadow: "0 3px 10px rgba(0,0,0,.15)",
                    }}
                  >
                    <ThemeIcon name="venue" size={15} />
                  </div>
                  <span className="mt-2 bg-white/70 px-2 py-1 text-[6px] tracking-[0.12em] uppercase" style={{ color: ink }}>
                    {venue}
                  </span>
                </div>
              </div>

              {/* RSVP olive block */}
              <div className="px-7 pt-8 pb-9 md:px-8" style={{ background: oliveDark, color: panel }}>
                <div className="text-center">
                  <span className="text-[28px]" style={{ ...scriptStyle, color: panel }}>
                    Kindly Reply
                  </span>

                  <p className="mt-5 text-[7px] opacity-75">Please RSVP by 19.04.2026.</p>
                </div>

                <div className="mt-5 space-y-4">
                  <label className="block">
                    <span className="mb-1.5 block text-[6px] tracking-[0.18em] uppercase opacity-70">Name(s)</span>
                    <input
                      className="w-full border bg-transparent px-3 py-2 text-[8px] outline-none placeholder:text-white/35"
                      style={{ borderColor: "rgba(255,255,255,.35)" }}
                      placeholder="e.g. Noah & Liv"
                    />
                  </label>

                  <div>
                    <span className="mb-2 block text-[6px] tracking-[0.18em] uppercase opacity-70">Will you be joining us?</span>

                    <div className="space-y-2">
                      <button onClick={() => setRsvp("yes")} className="flex items-center gap-2 text-[7px] tracking-[0.12em] uppercase">
                        <span
                          className="flex h-3 w-3 items-center justify-center rounded-full border"
                          style={{
                            borderColor: "rgba(255,255,255,.65)",
                            background: rsvp === "yes" ? panel : "transparent",
                          }}
                        >
                          {rsvp === "yes" && <span className="h-1.5 w-1.5 rounded-full" style={{ background: oliveDark }} />}
                        </span>
                        Accepts with pleasure
                      </button>

                      <button onClick={() => setRsvp("no")} className="flex items-center gap-2 text-[7px] tracking-[0.12em] uppercase">
                        <span
                          className="flex h-3 w-3 items-center justify-center rounded-full border"
                          style={{
                            borderColor: "rgba(255,255,255,.65)",
                            background: rsvp === "no" ? panel : "transparent",
                          }}
                        >
                          {rsvp === "no" && <span className="h-1.5 w-1.5 rounded-full" style={{ background: oliveDark }} />}
                        </span>
                        Declines with regret
                      </button>
                    </div>
                  </div>

                  <label className="block">
                    <span className="mb-1.5 block text-[6px] tracking-[0.18em] uppercase opacity-70">Dietary requirements</span>
                    <input
                      className="w-full border bg-transparent px-3 py-2 text-[8px] outline-none placeholder:text-white/35"
                      style={{ borderColor: "rgba(255,255,255,.35)" }}
                      placeholder="e.g. vegetarian, allergies"
                    />
                  </label>

                  <button
                    className="mx-auto mt-1 block bg-white px-8 py-3 text-[7px] tracking-[0.2em] uppercase"
                    style={{ color: oliveDark }}
                  >
                    Submit RSVP
                  </button>
                </div>

                <div className="mt-6 text-center text-[20px] opacity-50">❧</div>
              </div>
            </motion.div>
          </section>
        </div>

        {/* ============================================================
            GALLERY — EXISTING COMPONENT
        ============================================================ */}
        {!gallery.hidden && (
          <div id="gallery" className="mx-auto mt-4 max-w-[1240px]" style={panelStyle}>
            <GallerySection
              animationKey={animationKey}
              getMotionProps={getMotionProps}
              layout={invite.galleryLayout}
              urls={invite.galleryUrls}
              fallback={heroImage}
              title="Gallery"
              isProtected={gallery.protected}
              password={gallery.password}
              unlockedSections={unlockedSections}
              setUnlockedSections={setUnlockedSections}
            />
          </div>
        )}

        {/* ============================================================
            MUSIC — EXISTING COMPONENT
        ============================================================ */}
        <section id="music" className="mx-auto mt-4 max-w-[1240px] overflow-hidden" style={panelStyle}>
          <div className="px-7 pt-8 pb-5 text-center md:px-10">
            <span className="text-[30px]" style={{ ...scriptStyle, color: ink }}>
              Our Soundtrack
            </span>
          </div>

          <div className="px-6 pb-8 md:px-10 md:pb-10">
            <AudioPlayer
              src={data?.music?.background_audio ?? ""}
              name={data?.music?.background_audio_name ?? "Our soundtrack"}
              cover={FALLBACK_GALLERY[1]}
              variant={data?.music?.audio_player_variant}
              allowMute={data?.music?.allow_mute ?? true}
              loop={data?.music?.loop_music ?? true}
              fadeIn={data?.music?.fade_in ?? false}
              fadeOut={data?.music?.fade_out ?? false}
              volume={data?.music?.volume_level ?? 60}
            />
          </div>
        </section>

        {/* ============================================================
            WISHES — EXISTING COMPONENT
        ============================================================ */}
        {!wishes.hidden && (
          <div id="wishes" className="mx-auto mt-4 max-w-[1240px] overflow-hidden" style={panelStyle}>
            <WishesSection
              animationKey={animationKey}
              getMotionProps={getMotionProps}
              eventKey={eventKey}
              wishesRaw={invite.wishesRaw}
              wishesContainerRef={wishesContainerRef}
              wishRefreshKey={wishRefreshKey}
              setWishRefreshKey={setWishRefreshKey}
              title={invite.wishesTitle ?? "Best Wishes"}
              isIcon={false}
              isProtected={wishes.protected}
              password={wishes.password}
              unlockedSections={unlockedSections}
              setUnlockedSections={setUnlockedSections}
            />
          </div>
        )}

        {/* ============================================================
            FOOTER
        ============================================================ */}
        <footer className="mx-auto max-w-[1240px] px-3 pt-4 pb-4 md:px-0">
          <div
            className="overflow-hidden px-7 py-10 text-center"
            style={{
              ...panelStyle,
              background: oliveDark,
              color: panel,
            }}
          >
            <span className="text-[28px]" style={{ ...scriptStyle, color: panel }}>
              See you there
            </span>

            <p className="mt-4 text-[8px] tracking-[0.25em] uppercase opacity-65">{longDate}</p>

            <p className="mt-3 text-[14px] tracking-[0.16em] uppercase" style={{ ...serifStyle }}>
              {firstName} &amp; {secondName}
            </p>

            <div className="mt-5 text-[18px] opacity-50">❧</div>
          </div>
        </footer>
      </div>

      {/* ============================================================
          MOBILE MENU
      ============================================================ */}
      {menuOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col" style={{ background: oliveDark, color: panel }}>
          <div className="flex items-center justify-between px-6 py-6">
            <span className="text-[18px]" style={{ ...serifStyle, letterSpacing: ".15em" }}>
              {firstName} &amp; {secondName}
            </span>

            <button onClick={() => setMenuOpen(false)} aria-label="Close menu">
              <ThemeIcon name="close" size={23} />
            </button>
          </div>

          <nav className="flex flex-1 flex-col justify-center px-8">
            {[
              ["01", "Our Story", "story"],
              ["02", "The Day", "events"],
              ["03", "The Venue", "venue"],
              ["04", "Dress Code", "dress-code"],
              ["05", "Gallery", "gallery"],
              ["06", "Music", "music"],
              ["07", "Wishes", "wishes"],
              ["08", "Kindly Reply", "rsvp"],
            ].map(([number, label, id]) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="flex items-center justify-between border-b py-5 text-left"
                style={{ borderColor: "rgba(255,255,255,.16)" }}
              >
                <span className="text-[7px] opacity-45">{number}</span>
                <span className="text-[15px]" style={{ ...serifStyle, letterSpacing: ".12em" }}>
                  {label}
                </span>
                <span className="text-[10px] opacity-45">↗</span>
              </button>
            ))}
          </nav>

          <div className="px-8 pb-8 text-center text-[7px] tracking-[0.2em] uppercase opacity-45">{longDate}</div>
        </div>
      )}
    </main>
  );
}
