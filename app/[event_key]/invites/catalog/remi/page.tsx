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
import AudioPlayer from "../../../../../components/ui/AudioPlayer";

interface RemiProps {
  data: any;
  eventKey: string;
  motionData: any;
  settings: any;
  theme?: any;
  music?: any;
}

/* -------------------------------------------------------
   REMI FALLBACK ASSETS
------------------------------------------------------- */

const REMI_HERO = "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=88";

const REMI_IMAGES = [
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=900&q=85",
];

/* -------------------------------------------------------
   REMI VISUAL SYSTEM
------------------------------------------------------- */

const COLORS = {
  ivory: "#F6F0E6",
  paper: "#FBF8F1",
  maroon: "#671C27",
  maroonDark: "#421119",
  gold: "#B18A4A",
  goldLight: "#D8C28B",
  ink: "#211B19",
  muted: "#756A63",
  black: "#171413",
  line: "rgba(103,28,39,.20)",
};

const serif = "Georgia, 'Times New Roman', serif";

const sans = "Inter, ui-sans-serif, system-ui, sans-serif";

/* -------------------------------------------------------
   DECORATIVE INDIAN GRAPHICS
------------------------------------------------------- */

function LotusMark({ size = 42, color = COLORS.gold }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
      <path
        d="M50 82C35 72 22 61 22 47C22 38 29 31 37 31C44 31 49 37 50 45C51 37 56 31 63 31C71 31 78 38 78 47C78 61 65 72 50 82Z"
        stroke={color}
        strokeWidth="1.6"
      />
      <path d="M50 45C43 35 42 24 50 14C58 24 57 35 50 45Z" stroke={color} strokeWidth="1.6" />
      <path d="M50 45C37 43 28 37 25 27C37 27 46 32 50 45Z" stroke={color} strokeWidth="1.6" />
      <path d="M50 45C63 43 72 37 75 27C63 27 54 32 50 45Z" stroke={color} strokeWidth="1.6" />
    </svg>
  );
}

function Mandala({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 300" className={className} fill="none" aria-hidden="true">
      <circle cx="150" cy="150" r="115" stroke={COLORS.gold} strokeWidth="1" opacity=".45" />
      <circle cx="150" cy="150" r="92" stroke={COLORS.gold} strokeWidth="1" opacity=".35" />
      <circle cx="150" cy="150" r="66" stroke={COLORS.gold} strokeWidth="1" opacity=".3" />

      {Array.from({ length: 12 }).map((_, i) => (
        <ellipse
          key={i}
          cx="150"
          cy="150"
          rx="18"
          ry="62"
          transform={`rotate(${i * 30} 150 150)`}
          stroke={COLORS.gold}
          strokeWidth="1"
          opacity=".32"
        />
      ))}

      <circle cx="150" cy="150" r="14" stroke={COLORS.maroon} strokeWidth="1.2" />
    </svg>
  );
}

function Paisley({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 180 240" className={className} fill="none" aria-hidden="true">
      <path
        d="M101 14C45 18 18 60 29 106C39 150 76 178 93 216C99 229 111 230 119 219C129 205 121 187 106 171C89 153 68 143 61 117C52 86 67 55 95 49C119 44 137 57 136 78C135 96 121 107 108 113"
        stroke={COLORS.gold}
        strokeWidth="1.3"
      />
      <path d="M108 113C128 106 146 88 147 67C148 39 126 18 101 14" stroke={COLORS.gold} strokeWidth="1.3" />
      <path d="M88 63C75 75 72 91 79 105C85 117 98 121 108 113" stroke={COLORS.maroon} strokeWidth="1" opacity=".7" />
    </svg>
  );
}

/* -------------------------------------------------------
   SMALL REUSABLE ELEMENTS
------------------------------------------------------- */

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-3 text-[8px] font-medium tracking-[.32em]" style={{ color: COLORS.gold }}>
      <span className="h-px w-8" style={{ background: COLORS.gold }} />
      <span>{children}</span>
      <span className="h-px w-8" style={{ background: COLORS.gold }} />
    </div>
  );
}

function OrnamentDivider() {
  return (
    <div className="flex items-center justify-center gap-4 py-5">
      <span className="h-px w-12" style={{ background: COLORS.line }} />

      <LotusMark size={25} />

      <span className="h-px w-12" style={{ background: COLORS.line }} />
    </div>
  );
}

function IndianCorner({ position }: { position: "top-left" | "top-right" | "bottom-left" | "bottom-right" }) {
  const positions = {
    "top-left": "left-0 top-0",
    "top-right": "right-0 top-0 rotate-90",
    "bottom-left": "bottom-0 left-0 -rotate-90",
    "bottom-right": "bottom-0 right-0 rotate-180",
  };

  return (
    <svg viewBox="0 0 110 110" className={`pointer-events-none absolute h-20 w-20 ${positions[position]}`} fill="none" aria-hidden="true">
      <path d="M5 105C5 50 50 5 105 5" stroke={COLORS.gold} strokeWidth="1" />
      <path d="M20 105C20 58 58 20 105 20" stroke={COLORS.gold} strokeWidth="1" opacity=".55" />
      <path d="M38 105C38 68 68 38 105 38" stroke={COLORS.gold} strokeWidth="1" opacity=".35" />
      <circle cx="40" cy="40" r="5" stroke={COLORS.maroon} strokeWidth="1" />
    </svg>
  );
}

/* -------------------------------------------------------
   MAIN REMI INVITATION
------------------------------------------------------- */

export default function Remi({ data, eventKey, motionData, settings, music }: RemiProps) {
  const remiData = useInviteData(data);

  const { getMotionProps } = useThemeAnimation(motionData);

  const animationKey = useMemo(() => getAnimationKey(motionData), [motionData]);

  const [menuOpen, setMenuOpen] = useState(false);
  const [rsvp, setRsvp] = useState<"yes" | "no" | null>(null);

  const wishesContainerRef = useRef<HTMLElement | null>(null);

  const [wishRefreshKey, setWishRefreshKey] = useState(0);

  const [wish, setWish] = useState("");

  const firstName = remiData.firstName || remiData.brideName || "Aparna";

  const secondName = remiData.secondName || remiData.groomName || "Evin";

  const heroImage = remiData.heroImage || REMI_HERO;

  const gallery = getSectionConfig(settings?.section_visibility, "gallery");

  const wishes = getSectionConfig(settings?.section_visibility, "wishes");

  const { unlockedSections, setUnlockedSections } = useUnlockedSections(eventKey);

  const functions = remiData.eventFunctions?.length
    ? remiData.eventFunctions
    : [
        {
          title: "Haldi",
          date: "2026-11-13",
          locationName: "The Courtyard, Jaipur · 10:00 AM",
        },
        {
          title: "Mehndi",
          date: "2026-11-13",
          locationName: "Haveli Garden · 5:00 PM",
        },
        {
          title: "Sangeet",
          date: "2026-11-14",
          locationName: "Rambagh Palace · 7:00 PM",
        },
        {
          title: "Wedding",
          date: "2026-11-15",
          locationName: "Rambagh Palace · 11:00 AM",
        },
        {
          title: "Reception",
          date: "2026-11-15",
          locationName: "Rambagh Palace Lawn · 7:30 PM",
        },
      ];

  const primaryFunction = remiData.primaryFunction || functions[3];

  const primaryDate = primaryFunction?.startTime
    ? new Date(primaryFunction.startTime)
    : primaryFunction?.date
      ? new Date(primaryFunction.date)
      : null;

  const primaryDay = primaryDate ? primaryDate.toLocaleDateString("en-US", { weekday: "long" }) : "";

  const primaryDateLabel = primaryDate
    ? primaryDate
        .toLocaleDateString("en-US", {
          day: "2-digit",
          month: "long",
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

  const primaryVenue = primaryFunction?.locationName || "Rambagh Palace, Jaipur";

  const navItems = [
    ["story", "OUR STORY", "heart"],
    ["events", "CELEBRATIONS", "calendar"],
    ["gallery", "MEMORIES", "image"],
    ["music", "MUSIC", "music"],
    ["dress-code", "DRESS CODE", "shirt"],
    ["rsvp", "RSVP", "phone"],
    ["wishes", "WISHES", "heart"],
  ] as Array<[string, string, ThemeIconName]>;

  const scrollTo = (id: string) => {
    setMenuOpen(false);

    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const motionFor = (delay: number) => {
    const { key: _key, ...props } = getMotionProps(delay);

    return props;
  };

  const galleryUrls = remiData.galleryUrls?.length ? remiData.galleryUrls : REMI_IMAGES;

  return (
    <main
      key={animationKey}
      className="mx-auto min-h-screen w-full overflow-x-hidden"
      style={
        {
          background: COLORS.ivory,
          color: COLORS.ink,
          fontFamily: sans,

          "--animation-enabled": motionData?.animations === false ? "0" : "1",
        } as CSSProperties
      }
    >
      {/* ==================================================
          MOBILE TOP BAR
      ================================================== */}

      <div
        className="sticky top-0 z-40 flex items-center justify-between border-b px-5 py-3 backdrop-blur-md md:hidden"
        style={{
          background: "rgba(246,240,230,.92)",
          borderColor: COLORS.line,
        }}
      >
        <span
          className="text-[11px] tracking-[.28em]"
          style={{
            fontFamily: serif,
            color: COLORS.maroon,
          }}
        >
          REMI
        </span>

        <button onClick={() => setMenuOpen(true)} aria-label="Open menu" style={{ color: COLORS.maroon }}>
          <ThemeIcon name="menu" size={22} />
        </button>
      </div>

      {/* ==================================================
          HERO — EDITORIAL INDIAN PORTRAIT
      ================================================== */}

      <motion.section {...motionFor(0)} className="relative px-5 pt-8 pb-14 md:px-10 md:pt-14 md:pb-24">
        <IndianCorner position="top-left" />
        <IndianCorner position="bottom-right" />

        <div className="mx-auto max-w-[1180px]">
          {/* desktop mini navigation */}
          <div className="mb-16 hidden items-center justify-between md:flex">
            <div
              className="text-[11px] tracking-[.35em]"
              style={{
                color: COLORS.maroon,
              }}
            >
              REMI
            </div>

            <nav className="flex gap-8">
              {navItems.slice(0, 5).map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  className="text-[8px] tracking-[.2em]"
                  style={{
                    color: COLORS.muted,
                  }}
                >
                  {label}
                </button>
              ))}
            </nav>

            <button
              onClick={() => scrollTo("rsvp")}
              className="border px-5 py-2 text-[8px] tracking-[.2em]"
              style={{
                borderColor: COLORS.maroon,
                color: COLORS.maroon,
              }}
            >
              RSVP
            </button>
          </div>

          <div className="grid items-center gap-10 md:grid-cols-[.72fr_1.28fr] md:gap-16">
            {/* left typography */}
            <div className="relative z-10">
              <SectionEyebrow>A WEDDING CELEBRATION</SectionEyebrow>

              <h1
                className="text-[62px] leading-[.84] tracking-[-.055em] md:text-[108px]"
                style={{
                  fontFamily: serif,
                  color: COLORS.maroon,
                }}
              >
                {firstName}
                <br />
                <span
                  className="ml-10"
                  style={{
                    color: COLORS.gold,
                    fontStyle: "italic",
                  }}
                >
                  &
                </span>
                <br />
                <span className="ml-16">{secondName}</span>
              </h1>

              <p
                className="mt-8 max-w-[320px] text-[10px] leading-5 md:text-[11px]"
                style={{
                  color: COLORS.muted,
                }}
              >
                Two families, two journeys,
                <br />
                one beautiful beginning.
                <br />
                With love and blessings, we invite you to celebrate our wedding.
              </p>

              <div className="mt-9 flex items-center gap-4">
                <LotusMark size={34} />

                <div>
                  <p
                    className="text-[9px] tracking-[.16em]"
                    style={{
                      color: COLORS.maroon,
                    }}
                  >
                    {primaryDateLabel}
                  </p>

                  <p
                    className="mt-1 text-[8px]"
                    style={{
                      color: COLORS.muted,
                    }}
                  >
                    {primaryVenue}
                  </p>
                </div>
              </div>
            </div>

            {/* editorial photo stack */}
            <div className="relative mx-auto w-full max-w-[610px]">
              <div className="absolute -top-7 -right-2 h-36 w-36 md:-top-12 md:-right-8 md:h-64 md:w-64">
                <Mandala className="h-full w-full" />
              </div>

              <div
                className="absolute -bottom-8 -left-8 z-20 hidden h-36 w-28 border bg-white p-2 md:block"
                style={{
                  borderColor: COLORS.line,
                  transform: "rotate(-6deg)",
                }}
              >
                <div
                  className="flex h-full flex-col items-center justify-center"
                  style={{
                    background: COLORS.paper,
                  }}
                >
                  <LotusMark size={32} />
                  <span
                    className="mt-3 text-[7px] tracking-[.2em]"
                    style={{
                      color: COLORS.maroon,
                    }}
                  >
                    REMI
                  </span>
                  <span
                    className="mt-1 text-[6px]"
                    style={{
                      color: COLORS.muted,
                    }}
                  >
                    EST. 2026
                  </span>
                </div>
              </div>

              <div
                className="relative ml-auto w-[88%] overflow-hidden border p-2 md:w-[82%]"
                style={{
                  borderColor: COLORS.gold,
                  background: COLORS.paper,
                  transform: "rotate(2deg)",
                }}
              >
                <img src={heroImage} alt={`${firstName} and ${secondName}`} className="aspect-[4/5] w-full object-cover" />

                <div
                  className="absolute right-5 bottom-5 left-5 p-4 backdrop-blur-sm"
                  style={{
                    background: "rgba(251,248,241,.90)",
                  }}
                >
                  <p
                    className="text-[8px] tracking-[.25em]"
                    style={{
                      color: COLORS.maroon,
                    }}
                  >
                    TOGETHER WITH
                  </p>

                  <p
                    className="mt-1 text-[13px]"
                    style={{
                      fontFamily: serif,
                      color: COLORS.ink,
                    }}
                  >
                    their families
                  </p>
                </div>
              </div>

              <div className="absolute right-0 -bottom-12 md:-bottom-20">
                <Paisley className="h-36 w-28 md:h-56 md:w-40" />
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ==================================================
          INVITATION BAND
      ================================================== */}

      <section
        className="relative overflow-hidden px-5 py-12 md:px-10 md:py-16"
        style={{
          background: COLORS.maroon,
          color: COLORS.paper,
        }}
      >
        <div className="absolute top-1/2 -left-10 -translate-y-1/2 opacity-20">
          <Mandala className="h-52 w-52" />
        </div>

        <div className="absolute top-1/2 -right-10 -translate-y-1/2 rotate-180 opacity-20">
          <Mandala className="h-52 w-52" />
        </div>

        <div className="relative mx-auto max-w-[900px] text-center">
          <LotusMark size={38} color={COLORS.goldLight} />

          <p className="mt-5 text-[8px] tracking-[.32em]">SHUBH VIVAH</p>

          <h2
            className="mt-3 text-[31px] leading-tight md:text-[46px]"
            style={{
              fontFamily: serif,
            }}
          >
            A celebration of love,
            <br />
            family & forever.
          </h2>

          <p
            className="mx-auto mt-5 max-w-[520px] text-[10px] leading-5"
            style={{
              color: "rgba(251,248,241,.72)",
            }}
          >
            {remiData.announcement?.announcement?.message ||
              `Together with their families, ${firstName} and ${secondName} invite you to witness the beginning of their forever.`}
          </p>
        </div>
      </section>

      {/* ==================================================
          DATE / CALENDAR
      ================================================== */}

      <motion.section {...motionFor(0.1)} className="relative px-5 py-16 md:px-10 md:py-24">
        <IndianCorner position="top-right" />

        <div className="mx-auto grid max-w-[1000px] items-center gap-12 md:grid-cols-[.8fr_1.2fr]">
          <div>
            <SectionEyebrow>MARK THE DATE</SectionEyebrow>

            <h2
              className="text-[45px] leading-[.92] md:text-[72px]"
              style={{
                fontFamily: serif,
                color: COLORS.maroon,
              }}
            >
              The day
              <br />
              we become
              <br />
              <i>one.</i>
            </h2>

            <OrnamentDivider />

            <div className="flex items-center gap-3">
              <span
                className="text-[9px] tracking-[.18em]"
                style={{
                  color: COLORS.gold,
                }}
              >
                {primaryDay.toUpperCase()}
              </span>

              <span
                className="h-px w-10"
                style={{
                  background: COLORS.gold,
                }}
              />

              <span
                className="text-[9px]"
                style={{
                  color: COLORS.muted,
                }}
              >
                {primaryTime}
              </span>
            </div>
          </div>

          <div
            className="border p-4 md:p-7"
            style={{
              borderColor: COLORS.line,
              background: COLORS.paper,
            }}
          >
            <div
              className="border p-5 md:p-8"
              style={{
                borderColor: COLORS.gold,
              }}
            >
              <WeddingCalendar
                year={primaryDate?.getFullYear() ?? 2026}
                month={primaryDate?.getMonth() ?? 10}
                selectedDate={primaryDate?.getDate() ?? 15}
              />
            </div>
          </div>
        </div>
      </motion.section>

      {/* ==================================================
          STORY
      ================================================== */}

      <motion.section
        id="story"
        {...motionFor(0.15)}
        className="relative overflow-hidden px-5 py-16 md:px-10 md:py-24"
        style={{
          background: COLORS.paper,
        }}
      >
        <div className="absolute top-0 right-0 opacity-40">
          <Paisley className="h-64 w-48" />
        </div>

        <div className="relative mx-auto max-w-[1000px]">
          <div className="grid gap-12 md:grid-cols-[.85fr_1.15fr] md:items-center">
            <div>
              <SectionEyebrow>OUR STORY</SectionEyebrow>

              <h2
                className="text-[48px] leading-[.9] md:text-[70px]"
                style={{
                  fontFamily: serif,
                  color: COLORS.maroon,
                }}
              >
                From
                <br />
                <i>two paths</i>
                <br />
                to one.
              </h2>
            </div>

            <div>
              <p
                className="text-[11px] leading-6"
                style={{
                  color: COLORS.muted,
                }}
              >
                What began as two individual journeys slowly became a shared story. Somewhere between laughter, family dinners, endless
                conversations and quiet promises, Aparna and Evin found something worth choosing every day.
              </p>

              <p
                className="mt-5 text-[11px] leading-6"
                style={{
                  color: COLORS.muted,
                }}
              >
                Now, surrounded by the people they love, they are ready to begin their next chapter together.
              </p>

              <div className="mt-8 flex items-center gap-5">
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-full"
                  style={{
                    border: `1px solid ${COLORS.gold}`,
                  }}
                >
                  <LotusMark size={32} />
                </div>

                <div>
                  <p
                    className="text-[9px] tracking-[.18em]"
                    style={{
                      color: COLORS.maroon,
                    }}
                  >
                    APARNA & EVIN
                  </p>

                  <p
                    className="mt-1 text-[8px]"
                    style={{
                      color: COLORS.muted,
                    }}
                  >
                    forever begins here
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ==================================================
          CELEBRATIONS
      ================================================== */}

      <motion.section id="events" {...motionFor(0.15)} className="relative px-5 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-[1050px]">
          <div className="mb-10 grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <SectionEyebrow>THE CELEBRATIONS</SectionEyebrow>

              <h2
                className="text-[48px] leading-none md:text-[70px]"
                style={{
                  fontFamily: serif,
                  color: COLORS.maroon,
                }}
              >
                Three days.
                <br />
                <i>Many memories.</i>
              </h2>
            </div>

            <p
              className="max-w-[260px] text-[9px] leading-5 md:text-right"
              style={{
                color: COLORS.muted,
              }}
            >
              Join us for a beautiful celebration of Indian traditions, music, family and togetherness.
            </p>
          </div>

          <div
            className="divide-y border-y"
            style={{
              borderColor: COLORS.line,
            }}
          >
            {functions.map((fn: any, index: number) => {
              const date = fn.date ? new Date(fn.date) : null;

              return (
                <motion.div
                  key={fn.function_key ?? `${fn.title}-${index}`}
                  {...motionFor(0.18 + index * 0.06)}
                  className="group grid gap-5 py-7 md:grid-cols-[90px_1fr_auto] md:items-center"
                >
                  <div>
                    <p
                      className="text-[30px] leading-none"
                      style={{
                        fontFamily: serif,
                        color: COLORS.gold,
                      }}
                    >
                      {date ? String(date.getDate()).padStart(2, "0") : String(index + 1).padStart(2, "0")}
                    </p>

                    <p
                      className="mt-1 text-[7px] tracking-[.2em]"
                      style={{
                        color: COLORS.muted,
                      }}
                    >
                      {date
                        ? date
                            .toLocaleString("en-US", {
                              month: "short",
                            })
                            .toUpperCase()
                        : "NOV"}
                    </p>
                  </div>

                  <div>
                    <h3
                      className="text-[24px]"
                      style={{
                        fontFamily: serif,
                        color: COLORS.maroon,
                      }}
                    >
                      {fn.title}
                    </h3>

                    <p
                      className="mt-2 text-[9px]"
                      style={{
                        color: COLORS.muted,
                      }}
                    >
                      {fn.locationName || "Jaipur, Rajasthan"}
                    </p>
                  </div>

                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-full border transition-transform duration-300 group-hover:rotate-12"
                    style={{
                      borderColor: COLORS.gold,
                      color: COLORS.maroon,
                    }}
                  >
                    <ThemeIcon name={index === 1 ? "heart" : index === 2 ? "music" : index === 3 ? "calendar" : "gift"} size={18} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* ==================================================
          PHOTO STORY
      ================================================== */}

      {!gallery.hidden && (
        <motion.section
          id="gallery"
          {...motionFor(0.15)}
          className="relative overflow-hidden px-5 py-16 md:px-10 md:py-24"
          style={{
            background: COLORS.maroonDark,
          }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[.12]">
            <Mandala className="h-[500px] w-[500px]" />
          </div>

          <div className="relative mx-auto max-w-[1050px]">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <SectionEyebrow>MEMORIES</SectionEyebrow>

                <h2
                  className="text-[48px] leading-none md:text-[70px]"
                  style={{
                    fontFamily: serif,
                    color: COLORS.paper,
                  }}
                >
                  Moments
                  <br />
                  <i>to keep.</i>
                </h2>
              </div>

              <LotusMark size={50} color={COLORS.goldLight} />
            </div>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
              {galleryUrls.slice(0, 4).map((url: string, index: number) => (
                <motion.div
                  key={`${url}-${index}`}
                  {...motionFor(0.18 + index * 0.08)}
                  className={`overflow-hidden border ${index === 1 ? "md:mt-14" : index === 3 ? "md:mt-7" : ""}`}
                  style={{
                    borderColor: "rgba(216,194,139,.4)",
                  }}
                >
                  <img
                    src={url}
                    alt={`Wedding memory ${index + 1}`}
                    className="aspect-[3/4] w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                </motion.div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <button
                onClick={() => scrollTo("gallery")}
                className="border px-7 py-3 text-[8px] tracking-[.25em]"
                style={{
                  borderColor: COLORS.goldLight,
                  color: COLORS.paper,
                }}
              >
                VIEW ALL MEMORIES
              </button>
            </div>
          </div>
        </motion.section>
      )}

      {/* ==================================================
          MUSIC
      ================================================== */}

      <motion.section id="music" {...motionFor(0.15)} className="relative px-5 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-[850px] text-center">
          <SectionEyebrow>OUR SOUNDTRACK</SectionEyebrow>

          <h2
            className="text-[48px] leading-none md:text-[68px]"
            style={{
              fontFamily: serif,
              color: COLORS.maroon,
            }}
          >
            A little music
            <br />
            <i>for our story.</i>
          </h2>

          <p
            className="mx-auto mt-5 max-w-[420px] text-[9px] leading-5"
            style={{
              color: COLORS.muted,
            }}
          >
            Press play and stay for a little while. This is the soundtrack to our celebration.
          </p>

          <div className="mx-auto mt-9 max-w-[600px]">
            <AudioPlayer
              src={music?.background_audio ?? ""}
              name={music?.background_audio_name ?? "Aparna & Evin — Wedding Soundtrack"}
              cover={galleryUrls[1]}
              variant={music?.audio_player_variant}
              allowMute={music?.allow_mute ?? true}
              loop={music?.loop_music ?? true}
              fadeIn={music?.fade_in ?? false}
              fadeOut={music?.fade_out ?? false}
              volume={music?.volume_level ?? 60}
            />
          </div>
        </div>
      </motion.section>

      {/* ==================================================
          DRESS CODE
      ================================================== */}

      <motion.section
        id="dress-code"
        {...motionFor(0.15)}
        className="relative overflow-hidden px-5 py-16 md:px-10 md:py-24"
        style={{
          background: COLORS.paper,
        }}
      >
        <IndianCorner position="bottom-left" />

        <div className="mx-auto max-w-[850px] text-center">
          <SectionEyebrow>WHAT TO WEAR</SectionEyebrow>

          <h2
            className="text-[48px] leading-none md:text-[68px]"
            style={{
              fontFamily: serif,
              color: COLORS.maroon,
            }}
          >
            Dress in
            <br />
            <i>celebration.</i>
          </h2>

          <div className="mt-10 grid gap-8 md:grid-cols-2">
            {remiData?.dressCode?.length
              ? remiData.dressCode.map((dress: any, index: number) => (
                  <div
                    key={`dress-${index}`}
                    className="border p-7"
                    style={{
                      borderColor: COLORS.line,
                    }}
                  >
                    <LotusMark size={34} />

                    {dress.title && (
                      <h3
                        className="mt-4 text-[23px]"
                        style={{
                          fontFamily: serif,
                          color: COLORS.maroon,
                        }}
                      >
                        {dress.title}
                      </h3>
                    )}

                    {dress.description && (
                      <p
                        className="mx-auto mt-3 max-w-[280px] text-[9px] leading-5"
                        style={{
                          color: COLORS.muted,
                        }}
                      >
                        {dress.description}
                      </p>
                    )}

                    {Array.isArray(dress.hexColors) && dress.hexColors.length > 0 && (
                      <div className="mt-6 flex justify-center gap-3">
                        {dress.hexColors.map((color: string, colorIndex: number) => (
                          <span
                            key={`${color}-${colorIndex}`}
                            className="h-8 w-8 rounded-full border-2 border-white shadow-sm"
                            style={{
                              backgroundColor: color,
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))
              : ["Festive Indian", "Pastel Elegance"].map((title) => (
                  <div
                    key={title}
                    className="border p-8"
                    style={{
                      borderColor: COLORS.line,
                    }}
                  >
                    <LotusMark size={34} />

                    <h3
                      className="mt-4 text-[24px]"
                      style={{
                        fontFamily: serif,
                        color: COLORS.maroon,
                      }}
                    >
                      {title}
                    </h3>

                    <p
                      className="mt-3 text-[9px] leading-5"
                      style={{
                        color: COLORS.muted,
                      }}
                    >
                      Indian festive silhouettes, beautiful textures and colours inspired by the celebration.
                    </p>
                  </div>
                ))}
          </div>
        </div>
      </motion.section>

      {/* ==================================================
          RSVP
      ================================================== */}

      <motion.section
        id="rsvp"
        {...motionFor(0.15)}
        className="relative overflow-hidden px-5 py-16 text-center md:px-10 md:py-24"
        style={{
          background: COLORS.maroon,
          color: COLORS.paper,
        }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10">
          <Mandala className="h-[460px] w-[460px]" />
        </div>

        <div className="relative mx-auto max-w-[650px]">
          <LotusMark size={42} color={COLORS.goldLight} />

          <p className="mt-5 text-[8px] tracking-[.3em]">KINDLY RESPOND</p>

          <h2
            className="mt-3 text-[48px] leading-none md:text-[68px]"
            style={{
              fontFamily: serif,
            }}
          >
            Will you join
            <br />
            our celebration?
          </h2>

          <p
            className="mx-auto mt-5 max-w-[380px] text-[9px] leading-5"
            style={{
              color: "rgba(251,248,241,.72)",
            }}
          >
            Your presence will make our celebration even more meaningful. Please let us know if you can join us.
          </p>

          <div className="mt-9 grid grid-cols-2 gap-3">
            <button
              onClick={() => setRsvp("yes")}
              className="flex items-center justify-center gap-2 border py-4 text-[8px] tracking-[.2em]"
              style={{
                borderColor: COLORS.goldLight,
                background: rsvp === "yes" ? COLORS.gold : "transparent",
                color: COLORS.paper,
              }}
            >
              <ThemeIcon name="check" size={15} />
              JOYFULLY ACCEPT
            </button>

            <button
              onClick={() => setRsvp("no")}
              className="flex items-center justify-center gap-2 border py-4 text-[8px] tracking-[.2em]"
              style={{
                borderColor: "rgba(251,248,241,.35)",
                background: rsvp === "no" ? COLORS.gold : "transparent",
                color: COLORS.paper,
              }}
            >
              <ThemeIcon name="close" size={15} />
              REGRETS
            </button>
          </div>

          <button
            className="mt-5 border px-10 py-3 text-[8px] tracking-[.25em]"
            style={{
              borderColor: COLORS.goldLight,
              color: COLORS.goldLight,
            }}
          >
            SEND RSVP
          </button>
        </div>
      </motion.section>

      {/* ==================================================
          WISHES
      ================================================== */}

      {!wishes.hidden && (
        <WishesSection
          animationKey={animationKey}
          getMotionProps={getMotionProps}
          eventKey={eventKey}
          wishesRaw={remiData.wishesRaw}
          wishesContainerRef={wishesContainerRef}
          wishRefreshKey={wishRefreshKey}
          setWishRefreshKey={setWishRefreshKey}
          title={remiData.wishesTitle ?? "Words From The Heart"}
          isIcon={false}
          isProtected={wishes.protected}
          password={wishes.password}
          unlockedSections={unlockedSections}
          setUnlockedSections={setUnlockedSections}
        />
      )}

      {/* ==================================================
          FINAL FOOTER
      ================================================== */}

      <footer
        className="relative overflow-hidden px-5 py-16 text-center md:px-10 md:py-24"
        style={{
          background: COLORS.black,
          color: COLORS.paper,
        }}
      >
        <div className="absolute top-0 left-0 opacity-10">
          <Mandala className="h-64 w-64" />
        </div>

        <div className="absolute right-0 bottom-0 rotate-180 opacity-10">
          <Mandala className="h-64 w-64" />
        </div>

        <div className="relative mx-auto max-w-[800px]">
          <LotusMark size={46} color={COLORS.goldLight} />

          <p className="mt-5 text-[8px] tracking-[.32em]">WITH LOVE</p>

          <h2
            className="mt-4 text-[52px] md:text-[82px]"
            style={{
              fontFamily: serif,
            }}
          >
            {firstName}
            <span
              className="mx-3"
              style={{
                color: COLORS.goldLight,
              }}
            >
              &
            </span>
            {secondName}
          </h2>

          <p
            className="mt-5 text-[9px] tracking-[.15em]"
            style={{
              color: "rgba(251,248,241,.55)",
            }}
          >
            CAN'T WAIT TO CELEBRATE WITH YOU
          </p>

          <div className="mt-10 flex justify-center gap-7">
            {["Instagram", "WhatsApp"].map((social) => (
              <button
                key={social}
                className="flex h-9 w-9 items-center justify-center rounded-full border"
                style={{
                  borderColor: "rgba(216,194,139,.5)",
                  color: COLORS.goldLight,
                }}
                aria-label={social}
              >
                {social === "Instagram" ? <span className="text-[15px]">◎</span> : <span className="text-[13px]">◌</span>}
              </button>
            ))}
          </div>

          <div
            className="mx-auto mt-12 h-px max-w-[500px]"
            style={{
              background: "rgba(216,194,139,.2)",
            }}
          />

          <p
            className="mt-6 text-[7px] tracking-[.15em]"
            style={{
              color: "rgba(251,248,241,.35)",
            }}
          >
            REMI · {new Date().getFullYear()} ·{firstName.toUpperCase()} &{secondName.toUpperCase()}
          </p>
        </div>
      </footer>

      {/* ==================================================
          MOBILE MENU
      ================================================== */}

      {menuOpen && (
        <div
          className="fixed inset-0 z-[100] md:hidden"
          style={{
            background: COLORS.maroonDark,
            color: COLORS.paper,
          }}
        >
          <div className="flex items-center justify-between px-6 py-6">
            <span
              className="text-[12px] tracking-[.35em]"
              style={{
                fontFamily: serif,
              }}
            >
              REMI
            </span>

            <button onClick={() => setMenuOpen(false)} aria-label="Close menu">
              <ThemeIcon name="close" size={25} />
            </button>
          </div>

          <nav className="mt-8 px-8">
            {navItems.map(([id, label, icon], index) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="flex w-full items-center gap-4 border-b py-5 text-left"
                style={{
                  borderColor: "rgba(251,248,241,.14)",
                }}
              >
                <span
                  className="text-[8px]"
                  style={{
                    color: COLORS.goldLight,
                  }}
                >
                  0{index + 1}
                </span>

                <ThemeIcon name={icon} size={16} />

                <span className="text-[9px] tracking-[.22em]">{label}</span>
              </button>
            ))}
          </nav>
        </div>
      )}
    </main>
  );
}
