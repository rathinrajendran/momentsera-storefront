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
import AudioPlayer from "../../../../../components/ui/AudioPlayer";

interface LumiProps {
  data: any;
  eventKey: string;
  motionData: any;
  settings: any;
  theme?: any;
  music?: any;
}

/**
 * LUMI
 * -------------------------------------------------------------
 * A contemporary Indian wedding story inspired by the uploaded
 * editorial / wellness portfolio reference.
 *
 * The reference language is translated into:
 * - soft editorial image windows
 * - large serif headlines
 * - airy alternating sections
 * - botanical graphics
 * - Indian architectural arches
 * - diya / lotus / toran motifs
 * - a strong mobile-first reading rhythm
 *
 * It is intentionally NOT an editor/dashboard UI.
 *
 * Event content comes from Luna data. Wedding values below are
 * only fallbacks so the theme remains visually complete when a
 * new invitation has empty fields.
 */

const FREE_IMAGES = {
  couple: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1500&q=88",
  bride: "https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&w=1100&q=88",
  ceremony: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1300&q=88",
  flowers: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=1100&q=88",
  palace: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1400&q=88",
  celebration: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=88",
  details: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=88",
};

const FALLBACK_FUNCTIONS = [
  {
    function_key: "haldi",
    title: "Haldi",
    date: "2027-01-16T11:00:00",
    locationName: "The Family Courtyard",
    description: "A morning of turmeric, laughter and blessings with our closest family.",
  },
  {
    function_key: "sangeet",
    title: "Sangeet",
    date: "2027-01-16T19:00:00",
    locationName: "The Celebration Hall",
    description: "An evening of music, dance and stories from both our families.",
  },
  {
    function_key: "wedding",
    title: "Wedding",
    date: "2027-01-17T17:30:00",
    locationName: "The Heritage Mandap",
    description: "Join us as we exchange vows surrounded by the people we love.",
  },
  {
    function_key: "reception",
    title: "Reception",
    date: "2027-01-17T20:30:00",
    locationName: "The Grand Courtyard",
    description: "Dinner, dancing and one more reason to celebrate together.",
  },
];

function LotusGraphic({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 180 100" className={className} style={style} fill="none" aria-hidden="true">
      <path
        d="M90 79C58 79 29 67 14 47C39 44 65 52 90 72C115 52 141 44 166 47C151 67 122 79 90 79Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path d="M90 72C68 54 62 31 68 10C85 20 92 40 90 72Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M90 72C112 54 118 31 112 10C95 20 88 40 90 72Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M90 73C77 50 79 26 90 5C101 26 103 50 90 73Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M43 65C30 57 23 47 20 35C35 38 47 47 53 59" stroke="currentColor" strokeWidth="1.4" />
      <path d="M137 65C150 57 157 47 160 35C145 38 133 47 127 59" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function DiyaGraphic({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 150 130" className={className} style={style} fill="none" aria-hidden="true">
      <path d="M42 73C49 90 101 90 108 73" stroke="currentColor" strokeWidth="2" />
      <path d="M35 70C48 79 102 79 115 70C111 103 39 103 35 70Z" stroke="currentColor" strokeWidth="2" />
      <path d="M75 70C70 58 72 49 75 38C78 49 80 58 75 70Z" stroke="currentColor" strokeWidth="2" />
      <path d="M75 38C66 30 66 20 75 10C84 20 84 30 75 38Z" fill="currentColor" opacity=".16" stroke="currentColor" strokeWidth="1.5" />
      <path d="M20 110H130" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

function ArchGraphic({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 280 330" className={className} style={style} fill="none" aria-hidden="true">
      <path d="M27 315V105C27 51 69 20 140 20C211 20 253 51 253 105V315" stroke="currentColor" strokeWidth="2.5" />
      <path d="M52 315V111C52 75 85 47 140 47C195 47 228 75 228 111V315" stroke="currentColor" strokeWidth="1.3" />
      <path d="M78 315V117C78 94 102 73 140 73C178 73 202 94 202 117V315" stroke="currentColor" strokeWidth="1" />
      <path d="M104 315V126C104 111 119 99 140 99C161 99 176 111 176 126V315" stroke="currentColor" />
      <path d="M39 89Q140 14 241 89" stroke="currentColor" strokeWidth="1" strokeDasharray="4 6" />
      <circle cx="140" cy="134" r="17" stroke="currentColor" />
      <path d="M140 121V147M127 134H153" stroke="currentColor" />
      <path d="M73 63C61 53 55 44 55 33M207 63C219 53 225 44 225 33" stroke="currentColor" />
    </svg>
  );
}

function ToranGraphic({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 600 170" className={className} style={style} fill="none" aria-hidden="true">
      <path d="M24 28C138 82 236 28 300 28C364 28 462 82 576 28" stroke="currentColor" strokeWidth="2" />
      {[
        [70, 49],
        [150, 62],
        [225, 53],
        [300, 42],
        [375, 53],
        [450, 62],
        [530, 49],
      ].map(([x, y], i) => (
        <g key={i}>
          <path d={`M${x} ${y}V${y + 57}`} stroke="currentColor" />
          <path d={`M${x - 12} ${y + 57}Q${x} ${y + 78} ${x + 12} ${y + 57}`} stroke="currentColor" />
          <path d={`M${x - 11} ${y + 14}Q${x} ${y + 2} ${x + 11} ${y + 14}`} stroke="currentColor" />
          <circle cx={x} cy={y + 14} r="4" stroke="currentColor" />
        </g>
      ))}
    </svg>
  );
}

function ImageWindow({
  src,
  className = "",
  rounded = "rounded-[42%_42%_18%_18%/28%_28%_14%_14%]",
  rotate = 0,
}: {
  src: string;
  className?: string;
  rounded?: string;
  rotate?: number;
}) {
  return (
    <div className={`relative overflow-hidden ${rounded} ${className}`} style={{ transform: `rotate(${rotate}deg)` }}>
      <img src={src} alt="" className="h-full w-full object-cover" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "linear-gradient(135deg,rgba(255,255,255,.16),transparent 42%,rgba(80,29,39,.12))",
        }}
      />
    </div>
  );
}

function SectionIntro({ number, eyebrow, title, description }: { number: string; eyebrow: string; title: string; description?: string }) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <span
          className="flex h-7 w-7 items-center justify-center rounded-full text-[7px] font-bold"
          style={{
            background: THEME_COLORS.burgundy,
            color: THEME_COLORS.paper,
          }}
        >
          {number}
        </span>
        <span className="text-[7px] font-bold tracking-[0.27em]" style={{ color: THEME_COLORS.burgundy }}>
          {eyebrow}
        </span>
      </div>

      <h2
        className="mt-5 max-w-[700px] text-[47px] leading-[.86] font-semibold tracking-[-.05em] md:text-[78px]"
        style={{ color: THEME_COLORS.burgundy }}
      >
        {title}
      </h2>

      {description && (
        <p className="mt-6 max-w-[450px] text-[8px] leading-5" style={{ color: THEME_COLORS.muted }}>
          {description}
        </p>
      )}
    </div>
  );
}

export default function Lumi({ data, eventKey, motionData, settings, theme, music }: LumiProps) {
  const LunaData = useInviteData(data);
  const { getMotionProps } = useThemeAnimation(motionData);
  const animationKey = useMemo(() => getAnimationKey(motionData), [motionData]);

  const [menuOpen, setMenuOpen] = useState(false);
  const [rsvp, setRsvp] = useState<"yes" | "no" | null>(null);
  const [wishRefreshKey, setWishRefreshKey] = useState(0);
  const wishesContainerRef = useRef<HTMLElement | null>(null);

  // Requested dummy wedding values:
  // Evin = groom, Aparna = bride.
  // Real Luna data always wins when available.
  const groomName = LunaData.groomName || LunaData.secondName || LunaData.announcement?.couple?.groomName || "Evin";

  const brideName = LunaData.brideName || LunaData.firstName || LunaData.announcement?.couple?.brideName || "Aparna";

  const firstName = LunaData.firstName || LunaData.brideName || brideName;

  const secondName = LunaData.secondName || LunaData.groomName || groomName;

  const heroImage = LunaData.heroImage || FREE_IMAGES.couple;

  const gallery = getSectionConfig(settings?.section_visibility, "gallery");

  const wishes = getSectionConfig(settings?.section_visibility, "wishes");

  const { unlockedSections, setUnlockedSections } = useUnlockedSections(eventKey);

  const functions = LunaData.eventFunctions?.length ? LunaData.eventFunctions : FALLBACK_FUNCTIONS;

  const primaryFunction = LunaData.primaryFunction || functions[2];

  const primaryDate = primaryFunction?.startTime
    ? new Date(primaryFunction.startTime)
    : primaryFunction?.date
      ? new Date(primaryFunction.date)
      : null;

  const primaryDay = primaryDate
    ? primaryDate.toLocaleDateString("en-IN", {
        weekday: "long",
      })
    : "";

  const primaryDateLabel = primaryDate
    ? primaryDate.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "17 January 2027";

  const primaryTime = primaryDate
    ? primaryDate.toLocaleTimeString("en-IN", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    : "5:30 PM";

  const primaryVenue = primaryFunction?.locationName || primaryFunction?.venue || "The Heritage Mandap, Bengaluru";

  const year = primaryDate?.getFullYear() || 2027;

  const announcementTitle = LunaData.announcement?.announcement?.title || "A new chapter begins";

  const announcementMessage =
    LunaData.announcement?.announcement?.message ||
    `With the blessings of our families, Evin and Aparna invite you to celebrate their wedding and the beginning of a beautiful new chapter.`;

  const familyLabel = LunaData.announcement?.couple?.familyLabel || "WITH THE BLESSINGS OF OUR FAMILIES";

  const monogram = LunaData.announcement?.couple?.monogram || `${brideName.charAt(0)}${groomName.charAt(0)}`;

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

  const navItems: Array<[string, string, ThemeIconName]> = [
    ["welcome", "WELCOME", "heart"],
    ["celebrations", "CELEBRATIONS", "calendar"],
    ["story", "OUR STORY", "image"],
    ["gallery", "MEMORIES", "image"],
    ["attire", "ATTIRE", "shirt"],
    ["music", "MUSIC", "music"],
    ["wishes", "BLESSINGS", "heart"],
    ["rsvp", "RSVP", "phone"],
  ];

  return (
    <main
      key={animationKey}
      className="relative mx-auto min-h-screen w-full max-w-[430px] overflow-x-hidden md:max-w-[1180px]"
      style={
        {
          background: "linear-gradient(180deg,#FBF3EB 0%,#FFFDF9 39%,#F4E3DA 100%)",
          color: THEME_COLORS.text,
          "--lumi-burgundy": THEME_COLORS.burgundy,
          "--lumi-gold": THEME_COLORS.gold,
        } as CSSProperties
      }
    >
      {/* Subtle paper grain / editorial dots */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.13]"
        style={{
          backgroundImage: "radial-gradient(circle,rgba(104,45,57,.28) 0.7px,transparent .7px)",
          backgroundSize: "23px 23px",
        }}
      />

      <div className="relative z-10">
        {/* ====================================================
            HERO
           ==================================================== */}
        <motion.section {...motionFor(0)} className="relative overflow-hidden px-5 pt-6 pb-12 md:min-h-[760px] md:px-14 md:pt-10 md:pb-20">
          <header className="relative z-30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <LotusGraphic
                className="h-8 w-14"
                style={
                  {
                    color: THEME_COLORS.burgundy,
                  } as CSSProperties
                }
              />
              <div>
                <p
                  className="text-[8px] font-bold tracking-[0.25em]"
                  style={{
                    color: THEME_COLORS.burgundy,
                  }}
                >
                  LUMI
                </p>
                <p
                  className="mt-0.5 text-[5px] tracking-[0.18em]"
                  style={{
                    color: THEME_COLORS.muted,
                  }}
                >
                  WEDDING STORY
                </p>
              </div>
            </div>

            <div className="hidden items-center gap-6 md:flex">
              {navItems.slice(0, 5).map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  className="text-[6px] font-bold tracking-[0.15em]"
                  style={{
                    color: THEME_COLORS.muted,
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            <button
              onClick={() => setMenuOpen(true)}
              className="rounded-full border p-2 md:hidden"
              style={{
                borderColor: THEME_COLORS.line,
                color: THEME_COLORS.burgundy,
              }}
              aria-label="Open menu"
            >
              <ThemeIcon name="menu" size={17} />
            </button>
          </header>

          <ToranGraphic
            className="mx-auto mt-6 h-16 w-full max-w-[820px]"
            style={
              {
                color: THEME_COLORS.gold,
              } as CSSProperties
            }
          />

          <div className="relative mx-auto mt-2 max-w-[1050px] md:mt-7">
            <div className="grid items-center gap-8 md:grid-cols-[.9fr_1.1fr]">
              <div className="relative z-20">
                <p
                  className="text-[7px] font-bold tracking-[0.3em]"
                  style={{
                    color: THEME_COLORS.burgundy,
                  }}
                >
                  {familyLabel}
                </p>

                <h1
                  className="mt-5 max-w-[580px] text-[64px] leading-[.8] font-semibold tracking-[-.06em] md:text-[108px]"
                  style={{
                    color: THEME_COLORS.burgundy,
                  }}
                >
                  {announcementTitle}
                </h1>

                <div className="mt-7 flex items-center gap-4">
                  <span
                    className="h-px w-12"
                    style={{
                      background: THEME_COLORS.gold,
                    }}
                  />
                  <span
                    className="text-[9px] font-semibold tracking-[0.16em]"
                    style={{
                      color: THEME_COLORS.burgundy,
                    }}
                  >
                    {firstName} &amp; {secondName}
                  </span>
                </div>

                <p
                  className="mt-6 max-w-[390px] text-[8px] leading-5"
                  style={{
                    color: THEME_COLORS.muted,
                  }}
                >
                  {announcementMessage}
                </p>

                <div className="mt-8 flex items-center gap-3">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-full"
                    style={{
                      background: THEME_COLORS.burgundy,
                      color: THEME_COLORS.paper,
                    }}
                  >
                    <ThemeIcon name="heart" size={16} />
                  </div>

                  <div>
                    <p
                      className="text-[7px] font-bold tracking-[0.18em]"
                      style={{
                        color: THEME_COLORS.burgundy,
                      }}
                    >
                      SAVE THE DATE
                    </p>
                    <p
                      className="mt-1 text-[6px] tracking-[0.15em]"
                      style={{
                        color: THEME_COLORS.muted,
                      }}
                    >
                      {primaryDateLabel}
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative mx-auto h-[405px] w-full max-w-[480px] md:h-[575px]">
                <div
                  className="absolute top-0 right-0 h-[350px] w-[82%] rounded-[48%_48%_17%_17%]"
                  style={{
                    background: "linear-gradient(145deg,#E9C2B8,#E1A8A5)",
                  }}
                />

                <ImageWindow src={heroImage} className="absolute top-[5%] right-[7%] h-[335px] w-[77%] md:h-[500px]" rotate={1} />

                <div
                  className="absolute bottom-1 left-0 z-20 flex h-24 w-24 items-center justify-center rounded-full md:h-32 md:w-32"
                  style={{
                    background: THEME_COLORS.paper,
                    border: `1px solid ${THEME_COLORS.line}`,
                    color: THEME_COLORS.burgundy,
                  }}
                >
                  <div className="text-center">
                    <span className="block text-[8px] tracking-[0.18em]">{monogram}</span>
                    <span className="mt-2 block text-[6px] tracking-[0.2em]">{year}</span>
                  </div>
                </div>

                <ArchGraphic
                  className="absolute -bottom-7 -left-5 z-10 h-56 w-44"
                  style={
                    {
                      color: THEME_COLORS.gold,
                    } as CSSProperties
                  }
                />
              </div>
            </div>
          </div>

          <div className="mt-5 flex justify-between text-[5px] font-semibold tracking-[0.2em] md:px-1">
            <span>{monogram}</span>
            <span>AN INDIAN WEDDING · {year}</span>
            <span>SCROLL ↓</span>
          </div>
        </motion.section>

        {/* ====================================================
            WELCOME
           ==================================================== */}
        <motion.section id="welcome" {...motionFor(0.07)} className="bg-[#FFFDF9] px-5 py-16 md:px-14 md:py-24">
          <div className="mx-auto max-w-[1050px]">
            <div className="grid items-center gap-12 md:grid-cols-[1fr_1fr]">
              <div className="relative min-h-[410px]">
                <div
                  className="absolute top-0 left-[5%] h-[310px] w-[74%] rounded-[26%_26%_45%_45%]"
                  style={{
                    background: "linear-gradient(160deg,#E9C5B9,#F0D9CF)",
                  }}
                />

                <ImageWindow src={FREE_IMAGES.bride} className="absolute top-[4%] left-[9%] h-[290px] w-[68%]" />

                <div
                  className="absolute right-[3%] bottom-1 flex h-28 w-28 items-center justify-center rounded-full"
                  style={{
                    background: THEME_COLORS.burgundy,
                    color: THEME_COLORS.paper,
                  }}
                >
                  <div className="text-center">
                    <span className="block text-[10px]">शुभ</span>
                    <span className="mt-1 block text-[6px] tracking-[0.2em]">VIVAH</span>
                  </div>
                </div>

                <DiyaGraphic
                  className="absolute -bottom-7 -left-5 h-28 w-28"
                  style={
                    {
                      color: THEME_COLORS.gold,
                    } as CSSProperties
                  }
                />
              </div>

              <div>
                <SectionIntro
                  number="01"
                  eyebrow="A LITTLE ABOUT US"
                  title="Two lives. One beautiful celebration."
                  description={announcementMessage}
                />

                <div className="mt-9 grid grid-cols-2 gap-3">
                  <div
                    className="border p-5"
                    style={{
                      borderColor: THEME_COLORS.line,
                    }}
                  >
                    <ThemeIcon
                      name="heart"
                      size={18}
                      style={
                        {
                          color: THEME_COLORS.burgundy,
                        } as CSSProperties
                      }
                    />
                    <p
                      className="mt-6 text-[7px] font-bold tracking-[0.16em]"
                      style={{
                        color: THEME_COLORS.burgundy,
                      }}
                    >
                      EVIN
                    </p>
                    <p
                      className="mt-2 text-[7px] leading-4"
                      style={{
                        color: THEME_COLORS.muted,
                      }}
                    >
                      The groom, bringing his calm, kindness and a lifetime of stories.
                    </p>
                  </div>

                  <div
                    className="border p-5"
                    style={{
                      borderColor: THEME_COLORS.line,
                    }}
                  >
                    <ThemeIcon
                      name="heart"
                      size={18}
                      style={
                        {
                          color: THEME_COLORS.burgundy,
                        } as CSSProperties
                      }
                    />
                    <p
                      className="mt-6 text-[7px] font-bold tracking-[0.16em]"
                      style={{
                        color: THEME_COLORS.burgundy,
                      }}
                    >
                      APARNA
                    </p>
                    <p
                      className="mt-2 text-[7px] leading-4"
                      style={{
                        color: THEME_COLORS.muted,
                      }}
                    >
                      The bride, bringing warmth, laughter and a heart full of dreams.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ====================================================
            DATE STORY
           ==================================================== */}
        <motion.section
          {...motionFor(0.09)}
          className="relative overflow-hidden px-5 py-16 md:px-14 md:py-24"
          style={{
            background: THEME_COLORS.burgundy,
            color: THEME_COLORS.paper,
          }}
        >
          <LotusGraphic
            className="absolute top-8 -right-8 h-32 w-56 opacity-20"
            style={
              {
                color: THEME_COLORS.gold,
              } as CSSProperties
            }
          />

          <div className="relative mx-auto max-w-[1050px]">
            <div className="grid items-center gap-12 md:grid-cols-[.8fr_1.2fr]">
              <div>
                <p
                  className="text-[7px] font-bold tracking-[0.3em]"
                  style={{
                    color: THEME_COLORS.gold,
                  }}
                >
                  THE DAY WE SAY YES
                </p>

                <p className="mt-5 max-w-[320px] text-[8px] leading-5 opacity-70">
                  A day of sacred promises, family blessings, flowers, music and the people who mean the most.
                </p>

                <div className="mt-8 space-y-4">
                  <div className="flex items-center gap-3">
                    <ThemeIcon name="calendar" size={17} />
                    <span className="text-[8px] tracking-[0.13em]">{primaryDay || "WEDDING DAY"}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <ThemeIcon name="clock" size={17} />
                    <span className="text-[8px] tracking-[0.13em]">{primaryTime}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <ThemeIcon name="venue" size={17} />
                    <span className="text-[8px] leading-5">{primaryVenue}</span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-[7px] tracking-[0.35em] opacity-60">
                  {primaryDate
                    ? primaryDate
                        .toLocaleString("en-IN", {
                          month: "long",
                        })
                        .toUpperCase()
                    : "JANUARY"}
                </p>

                <div className="mt-2 text-[145px] leading-[.68] font-semibold tracking-[-.08em] md:text-[205px]">
                  {primaryDate ? String(primaryDate.getDate()).padStart(2, "0") : "17"}
                </div>

                <div
                  className="mx-auto mt-8 h-px w-32"
                  style={{
                    background: THEME_COLORS.gold,
                  }}
                />

                <p className="mt-5 text-[8px] font-bold tracking-[0.3em]">{year}</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ====================================================
            CELEBRATIONS
           ==================================================== */}
        <motion.section
          id="celebrations"
          {...motionFor(0.1)}
          className="px-5 py-16 md:px-14 md:py-24"
          style={{
            background: "linear-gradient(180deg,#FBF0E8,#FFFDF9)",
          }}
        >
          <div className="mx-auto max-w-[1050px]">
            <SectionIntro
              number="02"
              eyebrow="THE CELEBRATIONS"
              title="A wedding is more than one day."
              description="Come for the rituals, stay for the music, food, laughter and memories."
            />

            <div className="mt-12 grid gap-7 md:grid-cols-2">
              {functions.map((fn: any, index: number) => {
                const date = fn.startTime ? new Date(fn.startTime) : fn.date ? new Date(fn.date) : null;

                const image = [FREE_IMAGES.flowers, FREE_IMAGES.celebration, FREE_IMAGES.ceremony, FREE_IMAGES.details][index % 4];

                return (
                  <motion.article key={fn.function_key ?? `function-${index}`} {...motionFor(0.15 + index * 0.06)} className="relative">
                    <div className="relative h-[310px] overflow-hidden rounded-[30px] md:h-[390px]">
                      <img src={image} alt="" className="h-full w-full object-cover" />

                      <div
                        className="absolute inset-0"
                        style={{
                          background: "linear-gradient(180deg,transparent 35%,rgba(65,24,35,.82) 100%)",
                        }}
                      />

                      <span
                        className="absolute top-5 left-5 flex h-10 w-10 items-center justify-center rounded-full text-[7px] font-bold"
                        style={{
                          background: THEME_COLORS.paper,
                          color: THEME_COLORS.burgundy,
                        }}
                      >
                        0{index + 1}
                      </span>

                      <div className="absolute right-5 bottom-5 left-5 text-white">
                        <p
                          className="text-[7px] font-bold tracking-[0.2em]"
                          style={{
                            color: THEME_COLORS.gold,
                          }}
                        >
                          {date
                            ? date
                                .toLocaleDateString("en-IN", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })
                                .toUpperCase()
                            : "CELEBRATION"}
                        </p>

                        <h3 className="mt-2 text-[37px] leading-[.85] font-semibold tracking-[-.04em]">
                          {fn.title || "Wedding Celebration"}
                        </h3>

                        <p className="mt-3 flex items-center gap-2 text-[7px] opacity-80">
                          <ThemeIcon name="venue" size={12} />
                          {fn.locationName || "Wedding venue"}
                        </p>
                      </div>
                    </div>

                    <p
                      className="mt-4 px-1 text-[8px] leading-5"
                      style={{
                        color: THEME_COLORS.muted,
                      }}
                    >
                      {fn.description || "A special part of our wedding celebration, shared with family and friends."}
                    </p>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </motion.section>

        {/* ====================================================
            HERITAGE STATEMENT
           ==================================================== */}
        <motion.section
          {...motionFor(0.12)}
          className="relative overflow-hidden px-5 py-14 md:px-14 md:py-20"
          style={{
            background: "#E9D1C5",
            color: THEME_COLORS.burgundy,
          }}
        >
          <ToranGraphic
            className="absolute top-0 left-1/2 h-24 w-[800px] -translate-x-1/2 opacity-25"
            style={
              {
                color: THEME_COLORS.burgundy,
              } as CSSProperties
            }
          />

          <div className="relative mx-auto max-w-[900px] text-center">
            <ArchGraphic
              className="mx-auto h-44 w-40"
              style={
                {
                  color: THEME_COLORS.burgundy,
                } as CSSProperties
              }
            />

            <p className="mt-1 text-[7px] font-bold tracking-[0.28em]">ROOTED IN TRADITION</p>

            <h2 className="mt-5 text-[48px] leading-[.84] font-semibold tracking-[-.05em] md:text-[76px]">
              Our traditions
              <br />
              become our memories.
            </h2>

            <p
              className="mx-auto mt-6 max-w-[490px] text-[8px] leading-5"
              style={{
                color: THEME_COLORS.muted,
              }}
            >
              From the first diya to the final dance, every ritual carries a blessing and every celebration becomes part of our family
              story.
            </p>

            <div className="mt-7 flex items-center justify-center gap-4">
              <span
                className="h-px w-12"
                style={{
                  background: THEME_COLORS.gold,
                }}
              />
              <LotusGraphic
                className="h-10 w-20"
                style={
                  {
                    color: THEME_COLORS.burgundy,
                  } as CSSProperties
                }
              />
              <span
                className="h-px w-12"
                style={{
                  background: THEME_COLORS.gold,
                }}
              />
            </div>
          </div>
        </motion.section>

        {/* ====================================================
            STORY
           ==================================================== */}
        <motion.section id="story" {...motionFor(0.13)} className="bg-[#FFFDF9] px-5 py-16 md:px-14 md:py-24">
          <div className="mx-auto max-w-[1050px]">
            <div className="grid items-center gap-12 md:grid-cols-[.95fr_1.05fr]">
              <div className="relative h-[400px]">
                <div
                  className="absolute top-0 right-[5%] h-[330px] w-[72%] rounded-[30%_30%_16%_16%]"
                  style={{
                    background: "#D9E1D8",
                  }}
                />

                <ImageWindow src={FREE_IMAGES.palace} className="absolute top-[4%] right-[9%] h-[310px] w-[65%]" />

                <ImageWindow src={FREE_IMAGES.couple} className="absolute bottom-0 left-[3%] h-32 w-32 rounded-full" rotate={-5} />

                <DiyaGraphic
                  className="absolute right-0 bottom-0 h-28 w-28"
                  style={
                    {
                      color: THEME_COLORS.gold,
                    } as CSSProperties
                  }
                />
              </div>

              <div>
                <SectionIntro number="03" eyebrow="OUR STORY" title="From hello to forever." />

                <div className="mt-9 space-y-6">
                  {[
                    ["01", "THE BEGINNING", "A simple hello became the beginning of something neither of us expected."],
                    ["02", "THE YES", "Somewhere between ordinary days and shared dreams, forever started to feel real."],
                    ["03", "THE CELEBRATION", "Now we get to bring our families together and celebrate the next chapter."],
                  ].map(([number, title, text]) => (
                    <div
                      key={number}
                      className="grid grid-cols-[35px_1fr] gap-4 border-b pb-5"
                      style={{
                        borderColor: THEME_COLORS.line,
                      }}
                    >
                      <span
                        className="text-[7px] font-bold"
                        style={{
                          color: THEME_COLORS.gold,
                        }}
                      >
                        {number}
                      </span>
                      <div>
                        <p
                          className="text-[7px] font-bold tracking-[0.17em]"
                          style={{
                            color: THEME_COLORS.burgundy,
                          }}
                        >
                          {title}
                        </p>
                        <p
                          className="mt-2 text-[8px] leading-5"
                          style={{
                            color: THEME_COLORS.muted,
                          }}
                        >
                          {text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ====================================================
            GALLERY
           ==================================================== */}
        {!gallery.hidden && (
          <motion.section
            id="gallery"
            {...motionFor(0.14)}
            className="px-5 py-16 md:px-14 md:py-24"
            style={{
              background: "linear-gradient(180deg,#F6E8E0,#FFFDF9)",
            }}
          >
            <div className="mx-auto max-w-[1050px]">
              <div className="grid items-end gap-10 md:grid-cols-[.8fr_1.2fr]">
                <SectionIntro
                  number="04"
                  eyebrow="THE MEMORIES"
                  title="Little moments. Big memories."
                  description="A visual chapter of the people, places and moments that make this celebration ours."
                />

                <div className="relative h-[330px]">
                  <ImageWindow src={heroImage} className="absolute top-0 right-0 h-[270px] w-[72%]" />
                  <ImageWindow src={FREE_IMAGES.flowers} className="absolute bottom-0 left-[4%] h-28 w-28 rounded-full" rotate={-7} />
                  <ArchGraphic
                    className="absolute -bottom-9 left-0 h-48 w-36"
                    style={
                      {
                        color: THEME_COLORS.gold,
                      } as CSSProperties
                    }
                  />
                </div>
              </div>

              <div className="mt-12">
                <GallerySection
                  animationKey={animationKey}
                  getMotionProps={getMotionProps}
                  layout={LunaData.galleryLayout}
                  urls={LunaData.galleryUrls}
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

        {/* ====================================================
            ATTIRE
           ==================================================== */}
        <motion.section
          id="attire"
          {...motionFor(0.15)}
          className="px-5 py-16 md:px-14 md:py-24"
          style={{
            background: "#FFFDF9",
          }}
        >
          <div className="mx-auto max-w-[1050px]">
            <div className="grid items-center gap-10 md:grid-cols-[.75fr_1.25fr]">
              <div>
                <SectionIntro
                  number="05"
                  eyebrow="WHAT TO WEAR"
                  title="Come dressed in celebration."
                  description="Indian festive elegance, comfortable enough for every ritual, dance and dinner."
                />
                <LotusGraphic
                  className="mt-8 h-12 w-20"
                  style={
                    {
                      color: THEME_COLORS.gold,
                    } as CSSProperties
                  }
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {LunaData?.dressCode?.length
                  ? LunaData.dressCode.map((dress: any, index: number) => (
                      <article
                        key={`dress-${index}`}
                        className="relative min-h-[250px] overflow-hidden rounded-[28px] border p-7"
                        style={{
                          borderColor: THEME_COLORS.line,
                          background: index % 2 === 0 ? "#F5E1D9" : "#E2E9E0",
                        }}
                      >
                        <span
                          className="flex h-9 w-9 items-center justify-center rounded-full"
                          style={{
                            background: THEME_COLORS.paper,
                            color: THEME_COLORS.burgundy,
                          }}
                        >
                          <ThemeIcon name="shirt" size={15} />
                        </span>

                        <h3
                          className="mt-12 text-[31px] leading-[.88] font-semibold"
                          style={{
                            color: THEME_COLORS.burgundy,
                          }}
                        >
                          {dress.title || "Festive Attire"}
                        </h3>

                        {dress.description && (
                          <p
                            className="mt-4 text-[8px] leading-5"
                            style={{
                              color: THEME_COLORS.muted,
                            }}
                          >
                            {dress.description}
                          </p>
                        )}

                        {Array.isArray(dress.hexColors) && dress.hexColors.length > 0 && (
                          <div className="absolute bottom-6 left-7 flex gap-2">
                            {dress.hexColors.map((color: string, colorIndex: number) => (
                              <span
                                key={`${color}-${colorIndex}`}
                                className="h-7 w-7 rounded-full border-2 border-white shadow"
                                style={{
                                  backgroundColor: color,
                                }}
                              />
                            ))}
                          </div>
                        )}
                      </article>
                    ))
                  : [
                      {
                        title: "Festive Indian Wear",
                        description: "Sarees, lehengas, kurtas and bandhgalas in joyful colours are perfect for our celebrations.",
                      },
                      {
                        title: "Wedding Day Elegance",
                        description: "Choose traditional silhouettes with a touch of your own personality for the ceremony.",
                      },
                    ].map((dress, index) => (
                      <article
                        key={dress.title}
                        className="min-h-[250px] rounded-[28px] border p-7"
                        style={{
                          borderColor: THEME_COLORS.line,
                          background: index === 0 ? "#F5E1D9" : "#E2E9E0",
                        }}
                      >
                        <ThemeIcon
                          name="shirt"
                          size={18}
                          style={
                            {
                              color: THEME_COLORS.burgundy,
                            } as CSSProperties
                          }
                        />
                        <h3
                          className="mt-12 text-[31px] leading-[.88] font-semibold"
                          style={{
                            color: THEME_COLORS.burgundy,
                          }}
                        >
                          {dress.title}
                        </h3>
                        <p
                          className="mt-4 text-[8px] leading-5"
                          style={{
                            color: THEME_COLORS.muted,
                          }}
                        >
                          {dress.description}
                        </p>
                      </article>
                    ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* ====================================================
            MUSIC
           ==================================================== */}
        <motion.section
          id="music"
          {...motionFor(0.16)}
          className="relative overflow-hidden px-5 py-16 md:px-14 md:py-24"
          style={{
            background: THEME_COLORS.burgundy,
            color: THEME_COLORS.paper,
          }}
        >
          <LotusGraphic
            className="absolute -right-12 bottom-4 h-48 w-80 opacity-10"
            style={
              {
                color: THEME_COLORS.gold,
              } as CSSProperties
            }
          />

          <div className="relative mx-auto max-w-[1050px]">
            <div className="grid items-center gap-10 md:grid-cols-[.8fr_1.2fr]">
              <div className="relative mx-auto h-[260px] w-[260px]">
                <div
                  className="absolute inset-0 rounded-full border"
                  style={{
                    borderColor: "rgba(255,255,255,.18)",
                  }}
                />
                <div
                  className="absolute inset-6 rounded-full border"
                  style={{
                    borderColor: "rgba(255,255,255,.1)",
                  }}
                />
                <img src={heroImage} alt="" className="absolute inset-11 h-[172px] w-[172px] rounded-full object-cover" />
                <div
                  className="absolute top-1/2 left-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
                  style={{
                    background: THEME_COLORS.gold,
                    color: THEME_COLORS.burgundy,
                  }}
                >
                  <ThemeIcon name="music" size={18} />
                </div>
              </div>

              <div>
                <p
                  className="text-[7px] font-bold tracking-[0.28em]"
                  style={{
                    color: THEME_COLORS.gold,
                  }}
                >
                  OUR SOUNDTRACK
                </p>

                <h2 className="mt-5 text-[54px] leading-[.82] font-semibold tracking-[-.05em] md:text-[88px]">
                  MUSIC
                  <br />
                  FOR
                  <br />
                  MEMORIES
                </h2>

                <p className="mt-5 max-w-[400px] text-[8px] leading-5 opacity-65">
                  Let the music play while you explore our wedding story.
                </p>

                <div className="mt-8">
                  <AudioPlayer
                    src={music?.background_audio ?? ""}
                    name={music?.background_audio_name || "Our Wedding Soundtrack"}
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

        {/* ====================================================
            WISHES
           ==================================================== */}
        {!wishes.hidden && (
          <motion.section id="wishes" {...motionFor(0.17)} className="bg-[#FFFDF9] px-5 py-16 md:px-14 md:py-24">
            <div className="mx-auto max-w-[1050px]">
              <div className="grid items-start gap-10 md:grid-cols-[.75fr_1.25fr]">
                <div>
                  <SectionIntro
                    number="06"
                    eyebrow="BLESSINGS"
                    title="Leave a little love."
                    description="Your wishes will become part of the memories we keep from this beautiful day."
                  />

                  <DiyaGraphic
                    className="mt-7 h-24 w-24"
                    style={
                      {
                        color: THEME_COLORS.gold,
                      } as CSSProperties
                    }
                  />
                </div>

                <WishesSection
                  animationKey={animationKey}
                  getMotionProps={getMotionProps}
                  eventKey={eventKey}
                  wishesRaw={LunaData.wishesRaw}
                  wishesContainerRef={wishesContainerRef}
                  wishRefreshKey={wishRefreshKey}
                  setWishRefreshKey={setWishRefreshKey}
                  title={LunaData.wishesTitle || "Blessings for Evin & Aparna"}
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

        {/* ====================================================
            RSVP
           ==================================================== */}
        <motion.section
          id="rsvp"
          {...motionFor(0.18)}
          className="relative overflow-hidden px-5 py-16 text-center md:px-14 md:py-24"
          style={{
            background: "#E8D0C6",
            color: THEME_COLORS.burgundy,
          }}
        >
          <ArchGraphic
            className="absolute bottom-0 -left-16 h-72 w-56 opacity-15"
            style={
              {
                color: THEME_COLORS.burgundy,
              } as CSSProperties
            }
          />
          <ArchGraphic
            className="absolute top-0 -right-16 h-72 w-56 opacity-15"
            style={
              {
                color: THEME_COLORS.burgundy,
              } as CSSProperties
            }
          />

          <div className="relative mx-auto max-w-[820px]">
            <LotusGraphic
              className="mx-auto h-12 w-20"
              style={
                {
                  color: THEME_COLORS.burgundy,
                } as CSSProperties
              }
            />

            <p className="mt-5 text-[7px] font-bold tracking-[0.3em]">YOUR PRESENCE MEANS THE WORLD TO US</p>

            <h2 className="mt-5 text-[56px] leading-[.8] font-semibold tracking-[-.055em] md:text-[96px]">
              WILL YOU
              <br />
              CELEBRATE
              <br />
              WITH US?
            </h2>

            <p
              className="mx-auto mt-7 max-w-[420px] text-[8px] leading-5"
              style={{
                color: THEME_COLORS.muted,
              }}
            >
              We would be delighted to welcome you to our wedding celebrations.
            </p>

            <div className="mx-auto mt-8 grid max-w-[520px] grid-cols-2 gap-3">
              <button
                onClick={() => setRsvp("yes")}
                className="flex items-center justify-center gap-2 rounded-full py-4 text-[7px] font-bold tracking-[0.16em]"
                style={{
                  background: rsvp === "yes" ? THEME_COLORS.burgundy : THEME_COLORS.paper,
                  color: rsvp === "yes" ? THEME_COLORS.paper : THEME_COLORS.burgundy,
                  border: `1px solid ${THEME_COLORS.burgundy}`,
                }}
              >
                <ThemeIcon name="check" size={13} />
                YES, I'LL BE THERE
              </button>

              <button
                onClick={() => setRsvp("no")}
                className="flex items-center justify-center gap-2 rounded-full py-4 text-[7px] font-bold tracking-[0.16em]"
                style={{
                  background: rsvp === "no" ? THEME_COLORS.burgundy : "transparent",
                  color: rsvp === "no" ? THEME_COLORS.paper : THEME_COLORS.burgundy,
                  border: `1px solid ${THEME_COLORS.burgundy}`,
                }}
              >
                <ThemeIcon name="close" size={13} />
                SEND REGRETS
              </button>
            </div>

            <button
              className="mt-5 rounded-full px-9 py-3 text-[7px] font-bold tracking-[0.2em]"
              style={{
                background: THEME_COLORS.gold,
                color: THEME_COLORS.burgundy,
              }}
            >
              RSVP NOW ↗
            </button>
          </div>
        </motion.section>

        {/* ====================================================
            CLOSING
           ==================================================== */}
        <motion.footer
          {...motionFor(0.2)}
          className="relative overflow-hidden px-5 py-14 text-center md:px-14 md:py-20"
          style={{
            background: THEME_COLORS.burgundy,
            color: THEME_COLORS.paper,
          }}
        >
          <img src={FREE_IMAGES.palace} alt="" className="absolute inset-0 h-full w-full object-cover opacity-[0.1] grayscale" />

          <div className="relative mx-auto max-w-[1050px]">
            <DiyaGraphic
              className="mx-auto h-20 w-20"
              style={
                {
                  color: THEME_COLORS.gold,
                } as CSSProperties
              }
            />

            <p
              className="mt-2 text-[7px] font-bold tracking-[0.3em]"
              style={{
                color: THEME_COLORS.gold,
              }}
            >
              {monogram}
            </p>

            <h2 className="mt-6 text-[52px] leading-[.82] font-semibold tracking-[-.05em] md:text-[88px]">
              SEE YOU
              <br />
              AT THE
              <br />
              WEDDING
            </h2>

            <p className="mt-7 text-[8px] leading-5 opacity-65">
              {brideName} &amp; {groomName}
              <br />
              {primaryDateLabel}
              <br />
              {primaryVenue}
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-x-5 gap-y-3">
              {navItems.map(([id, label]) => (
                <button key={id} onClick={() => scrollTo(id)} className="text-[6px] font-bold tracking-[0.16em] opacity-70">
                  {label}
                </button>
              ))}
            </div>

            <div
              className="mt-10 flex justify-center gap-5"
              style={{
                color: THEME_COLORS.gold,
              }}
            >
              <span aria-label="Instagram">◎</span>
              <span aria-label="Facebook">f</span>
              <span aria-label="WhatsApp">◌</span>
            </div>
          </div>
        </motion.footer>

        {/* ====================================================
            MOBILE MENU
           ==================================================== */}
        {menuOpen && (
          <div
            className="fixed inset-0 z-50 mx-auto w-full max-w-[430px] overflow-y-auto"
            style={{
              background: THEME_COLORS.burgundy,
              color: THEME_COLORS.paper,
            }}
          >
            <div className="px-6 pt-7 pb-8">
              <div className="flex items-center justify-between border-b pb-5">
                <div className="flex items-center gap-3">
                  <LotusGraphic className="h-7 w-11" />
                  <span className="text-[8px] font-bold tracking-[0.25em]">LUMI</span>
                </div>

                <button onClick={() => setMenuOpen(false)} aria-label="Close menu">
                  <ThemeIcon name="close" size={23} />
                </button>
              </div>

              <nav className="mt-7">
                {navItems.map(([id, label, icon], index) => (
                  <button
                    key={id}
                    onClick={() => scrollTo(id)}
                    className="flex w-full items-center justify-between border-b py-5"
                    style={{
                      borderColor: "rgba(255,255,255,.15)",
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
                      <span className="text-[8px] font-bold tracking-[0.2em]">{label}</span>
                    </span>

                    <span
                      className="text-[7px]"
                      style={{
                        color: THEME_COLORS.gold,
                      }}
                    >
                      0{index + 1}
                    </span>
                  </button>
                ))}
              </nav>

              <div className="mt-12 text-center">
                <p
                  className="text-[6px] tracking-[0.22em]"
                  style={{
                    color: THEME_COLORS.gold,
                  }}
                >
                  {brideName} &amp; {groomName}
                </p>
                <p className="mt-2 text-[6px] opacity-45">{primaryDateLabel}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
