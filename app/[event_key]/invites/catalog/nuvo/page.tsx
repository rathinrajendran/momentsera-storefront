"use client";

import { useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { motion } from "framer-motion";
import { useThemeAnimation } from "../../../../../hooks/useThemeAnimations";
import { useInviteData } from "../../../../../hooks/useInviteData";
import { getAnimationKey } from "../../../../../utils/animation";
import GallerySection from "../components/common/GallerySection";
import { getSectionConfig } from "../../../../../utils/section-visibility";
import { useUnlockedSections } from "../../../../../hooks/useUnlockedSections";
import WishesSection from "../components/common/WishesSection";
import { ThemeIcon, type ThemeIconName } from "../../core/core/themeIcons";
import { THEME_COLORS } from "../../core/core/themeColors";
import { THEME_TYPOGRAPHY } from "../../core/core/themeTypography";
import { THEME_SHAPES } from "../../core/core/themeShapes";
import AudioPlayer from "../../../../../components/ui/AudioPlayer";

interface NuvoProps {
  data: any;
  design?: any;
  settings: any;
  eventKey: string;
}

const DUMMY_HERO = "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=88";

const DUMMY_GALLERY = [
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=82",
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=82",
  "https://images.unsplash.com/photo-1519225421980-da6f2b4f5f0e?auto=format&fit=crop&w=900&q=82",
];

const navItems = [
  ["story", "Story"],
  ["events", "Events"],
  ["gallery", "Gallery"],
  ["music", "Music"],
  ["dress-code", "Style"],
  ["wishes", "Wishes"],
  ["rsvp", "RSVP"],
] as const;

export default function Nuvo({ data, eventKey, design, settings }: NuvoProps) {
  const invite = useInviteData(data);
  const { getMotionProps } = useThemeAnimation(design?.motion);
  const animationKey = useMemo(() => getAnimationKey(design?.motion), [design?.motion]);

  const [menuOpen, setMenuOpen] = useState(false);
  const [rsvp, setRsvp] = useState<"yes" | "no" | null>(null);
  const [wishRefreshKey, setWishRefreshKey] = useState(0);
  const wishesContainerRef = useRef<HTMLElement | null>(null);

  const firstName = invite.firstName || invite.brideName || "Ananya";
  const secondName = invite.secondName || invite.groomName || "Ritvik";
  const heroImage = invite.heroImage || DUMMY_HERO;

  const gallery = getSectionConfig(settings?.section_visibility, "gallery");
  const wishes = getSectionConfig(settings?.section_visibility, "wishes");

  const { unlockedSections, setUnlockedSections } = useUnlockedSections(eventKey);

  const functions = invite.eventFunctions?.length
    ? invite.eventFunctions
    : [
        {
          title: "Mehndi",
          date: "2025-11-14",
          locationName: "Friday · 3:00 PM onwards",
        },
        {
          title: "Sangeet",
          date: "2025-11-15",
          locationName: "Saturday · 6:00 PM onwards",
        },
        {
          title: "Wedding",
          date: "2025-11-16",
          locationName: "Sunday · 6:00 PM onwards",
        },
        {
          title: "Reception",
          date: "2025-11-16",
          locationName: "Sunday · 8:30 PM onwards",
        },
      ];

  const primaryFunction = invite.primaryFunction || functions[0];
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

  const primaryVenue = primaryFunction?.locationName ?? "";

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const motionFor = (delay: number) => {
    const { key: _key, ...props } = getMotionProps(delay);
    return props;
  };

  return (
    <main
      id="nuvo-root"
      key={animationKey}
      className="relative mx-auto min-h-screen w-full max-w-[1440px]"
      style={
        {
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
          borderRadius: THEME_SHAPES.radius,
          borderWidth: THEME_SHAPES.borderWidth,
          borderStyle: THEME_SHAPES.borderStyle,
          boxShadow: THEME_SHAPES.shadow,
          overflow: "hidden",
        } as CSSProperties
      }
    >
      <div className="pointer-events-none absolute inset-0 z-0" style={{ opacity: "var(--bg-overlay-opacity, 0)" }} />

      <div className="relative z-10">
        {/* =========================================================
            NUVO HEADER
        ========================================================= */}
        <header
          className="sticky top-0 z-40 border-b backdrop-blur-xl"
          style={{
            borderColor: THEME_COLORS.line,
            background: `color-mix(in srgb, ${THEME_COLORS.page} 88%, transparent)`,
          }}
        >
          <div className="mx-auto flex h-16 max-w-[1240px] items-center justify-between px-5 md:h-[74px] md:px-8">
            <button onClick={() => scrollTo("top")} className="text-left" aria-label="Back to top">
              <span className="mt-0.5 block" style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.text }}>
                <span style={{ ...THEME_TYPOGRAPHY.accent, color: THEME_COLORS.burgundy }}>{firstName}</span>
                <span style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.muted }}> &amp; </span>
                <span style={{ ...THEME_TYPOGRAPHY.accent, color: THEME_COLORS.burgundy }}>{secondName}</span>
              </span>
            </button>

            <nav className="hidden items-center gap-7 md:flex">
              {navItems.map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  className="transition-opacity hover:opacity-60"
                  style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.text }}
                >
                  {label}
                </button>
              ))}
            </nav>

            <button
              className="flex h-10 w-10 items-center justify-center rounded-full border md:hidden"
              style={{ ...THEME_TYPOGRAPHY.body, borderColor: THEME_COLORS.line, color: THEME_COLORS.text }}
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <ThemeIcon name="menu" size={18} />
            </button>
          </div>
        </header>

        {/* =========================================================
            HERO — ASYMMETRIC EDITORIAL LAYOUT
        ========================================================= */}
        <section id="top" className="relative">
          <div className="mx-auto grid max-w-[1240px] md:min-h-[760px] md:grid-cols-[0.78fr_1.22fr]">
            <motion.div {...motionFor(0)} className="flex flex-col justify-between px-6 pt-12 pb-10 md:px-12 md:pt-20 md:pb-14">
              <div>
                <p className="max-w-[360px]" style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.muted }}>
                  {invite.announcement?.couple?.familyLabel || "Together with their families"}
                </p>

                <h1 className="mt-6" style={{ ...THEME_TYPOGRAPHY.heading, color: THEME_COLORS.text }}>
                  <span style={{ ...THEME_TYPOGRAPHY.accent, color: THEME_COLORS.burgundy }}>{firstName}</span>
                  <span className="my-1 block pl-7 md:pl-12" style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.muted }}>
                    &
                  </span>
                  <span className="block" style={{ ...THEME_TYPOGRAPHY.accent, color: THEME_COLORS.burgundy }}>
                    {secondName}
                  </span>
                </h1>

                <p className="mt-9 max-w-[330px]" style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.muted }}>
                  {invite.announcement?.announcement?.message ||
                    "We are getting married and would love to celebrate this new chapter with you."}
                </p>
              </div>

              <div className="mt-14 grid grid-cols-[auto_1fr] gap-5 border-t pt-5 md:mt-0" style={{ borderColor: THEME_COLORS.line }}>
                <span style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.burgundy }}>01</span>
                <div>
                  <p style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.text }}>{primaryDay || "Wedding day"}</p>
                  <p className="mt-1" style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.muted }}>
                    {primaryDateLabel || "16 NOVEMBER 2025"}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div {...motionFor(0.12)} className="relative min-h-[510px] overflow-hidden md:min-h-0">
              <img src={heroImage} alt={`${firstName} and ${secondName}`} className="absolute inset-0 h-full w-full object-cover" />

              <div
                className="absolute inset-x-0 bottom-0 h-1/3"
                style={{
                  background: `linear-gradient(to top, color-mix(in srgb, ${THEME_COLORS.burgundy} 48%, transparent), transparent)`,
                }}
              />

              <div
                className="absolute right-6 bottom-7 left-6 flex items-end justify-between md:right-10 md:bottom-10 md:left-10"
                style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.paper }}
              >
                <div>
                  <span className="block opacity-75" style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.paper }}>
                    A new chapter
                  </span>
                  <span className="mt-1 block" style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.paper }}>
                    begins here
                  </span>
                </div>
                <span style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.paper }}>Scroll ↓</span>
              </div>
            </motion.div>
          </div>

          <div className="mx-auto grid max-w-[1240px] grid-cols-3 border-y md:grid-cols-3" style={{ borderColor: THEME_COLORS.line }}>
            {[
              ["DATE", primaryDateLabel || "16 NOV 2025"],
              ["TIME", primaryTime || "06:00 PM"],
              ["PLACE", primaryVenue || "Taj Falaknuma Palace"],
            ].map(([label, value], i) => (
              <div
                key={label}
                className={`px-4 py-5 md:px-10 md:py-7 ${i !== 0 ? "border-l" : ""}`}
                style={{ borderColor: THEME_COLORS.line }}
              >
                <span className="block" style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.burgundy }}>
                  {label}
                </span>
                <span className="mt-2 block" style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.text }}>
                  {value}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================================
            INTRO / STORY
        ========================================================= */}
        <motion.section
          id="story"
          {...motionFor(0.12)}
          className="mx-auto grid max-w-[1240px] gap-12 px-6 py-20 md:grid-cols-[0.8fr_1.2fr] md:px-12 md:py-28"
        >
          <div>
            <span style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.burgundy }}>02 / Our story</span>
            <h2 className="mt-5 max-w-[400px]" style={{ ...THEME_TYPOGRAPHY.heading, color: THEME_COLORS.text }}>
              One story.
              <br />
              Many moments.
              <br />
              <span style={{ ...THEME_TYPOGRAPHY.heading, color: THEME_COLORS.burgundy }}>One forever.</span>
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {[
              ["WE MET", "12 MAY 2018", "A simple beginning that neither of us expected to become our favorite story."],
              ["FIRST DATE", "02 JUNE 2018", "Coffee, long conversations, and the first glimpse of everything ahead."],
              ["SHE SAID YES", "24 DEC 2023", "A question, a little nervousness, and the easiest yes."],
              ["FOREVER STARTS", "16 NOV 2025", "The next chapter starts with the people who mean the most to us."],
            ].map(([title, date, copy], i) => (
              <motion.article
                key={title}
                {...motionFor(0.18 + i * 0.07)}
                className="border-t pt-5"
                style={{ borderColor: THEME_COLORS.line }}
              >
                <div className="flex items-start justify-between gap-5">
                  <span style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.burgundy }}>0{i + 1}</span>
                  <span style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.muted }}>{date}</span>
                </div>
                <h3 className="mt-8" style={{ ...THEME_TYPOGRAPHY.heading, color: THEME_COLORS.text }}>
                  {title}
                </h3>
                <p className="mt-3" style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.muted }}>
                  {copy}
                </p>
              </motion.article>
            ))}
          </div>
        </motion.section>

        {/* =========================================================
            EVENTS — MODERN TIMELINE
        ========================================================= */}
        <motion.section
          id="events"
          {...motionFor(0.15)}
          className="border-y"
          style={{ borderColor: THEME_COLORS.line, background: THEME_COLORS.paper }}
        >
          <div className="mx-auto max-w-[1240px] px-6 py-20 md:px-12 md:py-28">
            <div className="mb-12 flex items-end justify-between gap-8">
              <div>
                <span style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.burgundy }}>03 / The celebration</span>
                <h2 className="mt-4" style={{ ...THEME_TYPOGRAPHY.heading, color: THEME_COLORS.text }}>
                  Meet us there.
                </h2>
              </div>
              <span className="hidden max-w-[230px] text-right md:block" style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.muted }}>
                Four moments. One unforgettable weekend.
              </span>
            </div>

            <div className="divide-y" style={{ borderColor: THEME_COLORS.line }}>
              {functions.map((fn: any, i: number) => {
                const date = fn.date ? new Date(fn.date) : null;
                const dateNum = date ? String(date.getDate()).padStart(2, "0") : String(14 + i);
                const month = date ? date.toLocaleString("en-US", { month: "short" }).toUpperCase() : "NOV";

                return (
                  <motion.div
                    key={fn.function_key ?? i}
                    {...motionFor(0.2 + i * 0.08)}
                    className="grid grid-cols-[54px_1fr_auto] items-center gap-5 py-7 md:grid-cols-[90px_1fr_240px_30px] md:gap-8 md:py-9"
                  >
                    <div>
                      <span className="block" style={{ ...THEME_TYPOGRAPHY.heading, color: THEME_COLORS.burgundy }}>
                        {dateNum}
                      </span>
                      <span className="mt-1 block" style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.muted }}>
                        {month}
                      </span>
                    </div>

                    <div>
                      <h3 style={{ ...THEME_TYPOGRAPHY.heading, color: THEME_COLORS.text }}>{fn.title}</h3>
                      <p className="mt-2" style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.muted }}>
                        {fn.description || "Join us for an evening filled with good food, music and beautiful memories."}
                      </p>
                    </div>

                    <div className="hidden md:block">
                      <p style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.text }}>{fn.locationName || "Taj Falaknuma Palace"}</p>
                      <p className="mt-1" style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.muted }}>
                        {fn.startTime
                          ? new Date(fn.startTime).toLocaleTimeString("en-US", {
                              hour: "numeric",
                              minute: "2-digit",
                            })
                          : "Onwards"}
                      </p>
                    </div>

                    <span style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.burgundy }}>
                      <ThemeIcon name={i === 1 ? "music" : i === 3 ? "gift" : "heart"} size={17} />
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.section>

        {/* =========================================================
            GALLERY — PRESERVED
        ========================================================= */}
        {!gallery.hidden && (
          <GallerySection
            animationKey={animationKey}
            getMotionProps={getMotionProps}
            layout={invite.galleryLayout}
            urls={invite.galleryUrls}
            fallback={invite.heroImage}
            title="Gallery"
            isProtected={gallery.protected}
            password={gallery.password}
            unlockedSections={unlockedSections}
            setUnlockedSections={setUnlockedSections}
          />
        )}

        {/* =========================================================
            MUSIC — PRESERVED
        ========================================================= */}
        <motion.section id="music" {...motionFor(0.18)} className="mx-auto max-w-[1240px] px-6 py-20 md:px-12 md:py-28">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <span style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.burgundy }}>04 / Soundtrack</span>
              <h2 className="mt-4" style={{ ...THEME_TYPOGRAPHY.heading, color: THEME_COLORS.text }}>
                Press play.
              </h2>
            </div>
            <span style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.burgundy }}>
              <ThemeIcon name="music" size={21} />
            </span>
          </div>

          <AudioPlayer
            src={data?.music?.background_audio ?? ""}
            name={data?.music?.background_audio_name ?? "Our soundtrack"}
            cover={DUMMY_GALLERY[2]}
            variant={data?.music?.audio_player_variant}
            allowMute={data?.music?.allow_mute ?? true}
            loop={data?.music?.loop_music ?? true}
            fadeIn={data?.music?.fade_in ?? false}
            fadeOut={data?.music?.fade_out ?? false}
            volume={data?.music?.volume_level ?? 60}
          />
        </motion.section>

        {/* =========================================================
            DRESS CODE
        ========================================================= */}
        <motion.section
          id="dress-code"
          {...motionFor(0.18)}
          className="border-y"
          style={{ borderColor: THEME_COLORS.line, background: THEME_COLORS.paper }}
        >
          <div className="mx-auto grid max-w-[1240px] gap-10 px-6 py-20 md:grid-cols-[0.55fr_1fr] md:px-12 md:py-28">
            <div>
              <span style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.burgundy }}>05 / Dress code</span>
              <h2 className="mt-4" style={{ ...THEME_TYPOGRAPHY.heading, color: THEME_COLORS.text }}>
                Come as
                <br />
                your best self.
              </h2>
              <p className="mt-5 max-w-[300px]" style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.muted }}>
                A little guidance for the celebration. Wear something that feels like you.
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2">
              {invite?.dressCode?.length ? (
                invite.dressCode.map((dress: any, dressIndex: number) => (
                  <motion.div
                    key={`dress-${dressIndex}`}
                    {...motionFor(0.22 + dressIndex * 0.08)}
                    className="border-t pt-5"
                    style={{ borderColor: THEME_COLORS.line }}
                  >
                    <div className="flex gap-2">
                      {(dress.hexColors || []).map((color: string, colorIndex: number) => (
                        <span
                          key={`${color}-${colorIndex}`}
                          className="h-7 w-7 rounded-full border shadow-sm"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>

                    <h3 className="mt-6" style={{ ...THEME_TYPOGRAPHY.heading, color: THEME_COLORS.text }}>
                      {dress.title || "Celebration style"}
                    </h3>
                    <p className="mt-2" style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.muted }}>
                      {dress.description || "Elegant, comfortable and celebration-ready."}
                    </p>
                  </motion.div>
                ))
              ) : (
                <div className="border-t pt-5" style={{ borderColor: THEME_COLORS.line }}>
                  <div className="flex gap-2">
                    {[THEME_COLORS.burgundy, THEME_COLORS.burgundy, THEME_COLORS.paper].map((color) => (
                      <span
                        key={color}
                        className="h-7 w-7 rounded-full border"
                        style={{ backgroundColor: color, borderColor: THEME_COLORS.line }}
                      />
                    ))}
                  </div>
                  <h3 className="mt-6" style={{ ...THEME_TYPOGRAPHY.heading, color: THEME_COLORS.text }}>
                    Modern festive
                  </h3>
                  <p className="mt-2" style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.muted }}>
                    Elegant, comfortable and celebration-ready.
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.section>

        {/* =========================================================
            WISHES — PRESERVED
        ========================================================= */}
        {!wishes.hidden && (
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
        )}

        {/* =========================================================
            RSVP — BOLD PANEL
        ========================================================= */}
        <motion.section id="rsvp" {...motionFor(0.18)} className="mx-auto max-w-[1240px] px-6 py-20 md:px-12 md:py-28">
          <div
            className="grid overflow-hidden md:grid-cols-[1fr_0.8fr]"
            style={{ background: THEME_COLORS.burgundy, color: THEME_COLORS.paper }}
          >
            <div className="px-7 py-12 md:px-14 md:py-16">
              <span className="opacity-70" style={{ ...THEME_TYPOGRAPHY.body }}>
                06 / RSVP
              </span>
              <h2 className="mt-5 max-w-[480px]" style={{ ...THEME_TYPOGRAPHY.heading }}>
                Will we
                <br />
                see you?
              </h2>
              <p className="mt-6 max-w-[390px] opacity-75" style={{ ...THEME_TYPOGRAPHY.body }}>
                We would love to know if you can join us. Your presence will make the celebration complete.
              </p>
            </div>

            <div
              className="flex flex-col justify-center border-t px-7 py-10 md:border-t-0 md:border-l md:px-12"
              style={{ borderColor: `color-mix(in srgb, ${THEME_COLORS.paper} 18%, transparent)` }}
            >
              <span className="opacity-65" style={{ ...THEME_TYPOGRAPHY.body }}>
                Please respond by
              </span>
              <span className="mt-2" style={{ ...THEME_TYPOGRAPHY.body }}>
                15 October 2025
              </span>

              <div className="mt-8 grid grid-cols-2 gap-2">
                <button
                  onClick={() => setRsvp("yes")}
                  className="flex items-center justify-center gap-2 border px-3 py-4"
                  style={{
                    ...THEME_TYPOGRAPHY.body,
                    borderColor: `color-mix(in srgb, ${THEME_COLORS.paper} 45%, transparent)`,
                    background: rsvp === "yes" ? THEME_COLORS.paper : "transparent",
                    color: rsvp === "yes" ? THEME_COLORS.burgundy : THEME_COLORS.paper,
                  }}
                >
                  <ThemeIcon name="check" size={14} />
                  Accept
                </button>
                <button
                  onClick={() => setRsvp("no")}
                  className="flex items-center justify-center gap-2 border px-3 py-4"
                  style={{
                    ...THEME_TYPOGRAPHY.body,
                    borderColor: `color-mix(in srgb, ${THEME_COLORS.paper} 45%, transparent)`,
                    background: rsvp === "no" ? THEME_COLORS.paper : "transparent",
                    color: rsvp === "no" ? THEME_COLORS.burgundy : THEME_COLORS.paper,
                  }}
                >
                  <ThemeIcon name="close" size={14} />
                  Regret
                </button>
              </div>

              <button
                className="nuvo-rsvp-action mt-3 border px-4 py-4 transition-colors"
                style={{
                  ...THEME_TYPOGRAPHY.body,
                  borderColor: `color-mix(in srgb, ${THEME_COLORS.paper} 40%, transparent)`,
                  color: THEME_COLORS.paper,
                }}
              >
                RSVP now →
              </button>
            </div>
          </div>
        </motion.section>

        {/* =========================================================
            CLOSING
        ========================================================= */}
        <motion.footer {...motionFor(0.2)} className="border-t" style={{ borderColor: THEME_COLORS.line }}>
          <div className="mx-auto grid max-w-[1240px] gap-12 px-6 py-16 md:grid-cols-[1fr_auto] md:px-12 md:py-20">
            <div>
              <span style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.muted }}>Until then</span>
              <h2 className="mt-5 max-w-[700px]" style={{ ...THEME_TYPOGRAPHY.heading, color: THEME_COLORS.burgundy }}>
                We can't wait
                <br />
                to celebrate
                <br />
                with you.
              </h2>
            </div>

            <div className="flex flex-col justify-end md:text-right">
              <p style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.text }}>
                {firstName} + {secondName}
              </p>
              <p className="mt-2" style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.muted }}>
                {primaryDateLabel || "16 NOVEMBER 2025"}
              </p>
              <div className="mt-7 flex gap-5 md:justify-end" style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.burgundy }}>
                <button aria-label="Instagram">◎</button>
                <button aria-label="Facebook">f</button>
                <button aria-label="WhatsApp">◌</button>
              </div>
            </div>
          </div>

          <div
            className="mx-auto flex max-w-[1240px] flex-col gap-4 border-t px-6 py-6 md:flex-row md:items-center md:justify-between md:px-12"
            style={{ borderColor: THEME_COLORS.line }}
          >
            <span style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.muted }}>
              © 2025 {firstName} &amp; {secondName}
            </span>

            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {navItems.map(([id, label]) => (
                <button key={id} onClick={() => scrollTo(id)} style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.muted }}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </motion.footer>

        {/* =========================================================
            MOBILE MENU
        ========================================================= */}
        {menuOpen && (
          <div
            className="fixed inset-0 z-[100] flex flex-col md:hidden"
            style={{ background: THEME_COLORS.burgundy, color: THEME_COLORS.paper }}
          >
            <div className="flex items-center justify-between px-6 py-6">
              <div>
                <span className="block opacity-60" style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.paper }}>
                  Invitation
                </span>
                <span className="mt-1 block" style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.paper }}>
                  {firstName} + {secondName}
                </span>
              </div>
              <button onClick={() => setMenuOpen(false)} aria-label="Close menu">
                <ThemeIcon name="close" size={24} />
              </button>
            </div>

            <nav className="flex flex-1 flex-col justify-center px-8">
              {navItems.map(([id, label], i) => (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  className="flex items-center justify-between border-b py-5 text-left"
                  style={{ ...THEME_TYPOGRAPHY.body, borderColor: `color-mix(in srgb, ${THEME_COLORS.paper} 18%, transparent)` }}
                >
                  <span className="opacity-50" style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.paper }}>
                    0{i + 1}
                  </span>
                  <span style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.paper }}>{label}</span>
                  <span className="opacity-50" style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.paper }}>
                    ↗
                  </span>
                </button>
              ))}
            </nav>

            <div className="px-8 pb-8 opacity-50" style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.paper }}>
              {primaryDateLabel || "Save the date"}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
