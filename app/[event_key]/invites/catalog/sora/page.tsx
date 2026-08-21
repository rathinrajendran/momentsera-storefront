"use client";

import { useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { motion } from "framer-motion";

import { useThemeAnimation } from "../../../../../hooks/useThemeAnimations";
import { useInviteData } from "../../../../../hooks/useInviteData";
import { getAnimationKey } from "../../../../../utils/animation";
import { getSectionConfig } from "../../../../../utils/section-visibility";
import { useUnlockedSections } from "../../../../../hooks/useUnlockedSections";

import GallerySection from "../components/common/GallerySection";
import WishesSection from "../components/common/WishesSection";

import { ThemeSectionTitle } from "../../core/core/ThemeSectionTitle";
import { ThemeIcon, type ThemeIconName } from "../../core/core/themeIcons";

import { THEME_COLORS } from "../../core/core/themeColors";
import { THEME_TYPOGRAPHY } from "../../core/core/themeTypography";

import AudioPlayer from "../../../../../components/ui/AudioPlayer";

interface SoraProps {
  data: any;
  eventKey: string;
  motionData: any;
  settings: any;
  theme?: any;
  music?: any;
}

/* -------------------------------------------------------------------------- */
/* FALLBACK ASSETS                                                            */
/* -------------------------------------------------------------------------- */

const DUMMY_HERO = "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=85";

const DUMMY_GALLERY = [
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=85",
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=85",
  "https://images.unsplash.com/photo-1519225421980-da6f2b4f5f0e?auto=format&fit=crop&w=800&q=85",
  "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=85",
  "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=85",
];

/* -------------------------------------------------------------------------- */
/* COMPONENT                                                                  */
/* -------------------------------------------------------------------------- */

export default function Sora({ data, eventKey, motionData, settings, music }: SoraProps) {
  const SoraData = useInviteData(data);

  const { getMotionProps } = useThemeAnimation(design?.motion);

  const animationKey = useMemo(() => getAnimationKey(design?.motion), [design?.motion]);

  const [menuOpen, setMenuOpen] = useState(false);

  const [rsvp, setRsvp] = useState<"yes" | "no" | null>(null);

  const [wishRefreshKey, setWishRefreshKey] = useState(0);

  const wishesContainerRef = useRef<HTMLElement | null>(null);

  /* ------------------------------------------------------------------------ */
  /* BASIC DATA                                                               */
  /* ------------------------------------------------------------------------ */

  const firstName = SoraData.firstName || SoraData.brideName || "Ananya";

  const secondName = SoraData.secondName || SoraData.groomName || "Ritvik";

  const heroImage = SoraData.heroImage || DUMMY_HERO;

  const gallery = getSectionConfig(settings?.section_visibility, "gallery");

  const wishes = getSectionConfig(settings?.section_visibility, "wishes");

  const { unlockedSections, setUnlockedSections } = useUnlockedSections(eventKey);

  /* ------------------------------------------------------------------------ */
  /* FUNCTIONS                                                                */
  /* ------------------------------------------------------------------------ */

  const functions = SoraData.eventFunctions?.length
    ? SoraData.eventFunctions
    : [
        {
          title: "Mehndi",
          date: "2025-11-14",
          locationName: "Friday, 3:00 PM onwards",
        },
        {
          title: "Sangeet",
          date: "2025-11-15",
          locationName: "Saturday, 6:00 PM onwards",
        },
        {
          title: "Wedding",
          date: "2025-11-16",
          locationName: "Sunday, 6:00 PM onwards",
        },
        {
          title: "Reception",
          date: "2025-11-16",
          locationName: "Sunday, 8:30 PM onwards",
        },
      ];

  const primaryFunction = SoraData.primaryFunction || functions[0];

  const primaryDate = primaryFunction?.startTime
    ? new Date(primaryFunction.startTime)
    : primaryFunction?.date
      ? new Date(primaryFunction.date)
      : null;

  const primaryDay = primaryDate
    ? primaryDate.toLocaleDateString("en-US", {
        weekday: "long",
      })
    : "SUNDAY";

  const primaryMonth = primaryDate
    ? primaryDate
        .toLocaleDateString("en-US", {
          month: "short",
        })
        .toUpperCase()
    : "NOV";

  const primaryDayNumber = primaryDate ? primaryDate.getDate().toString().padStart(2, "0") : "16";

  const primaryYear = primaryDate ? primaryDate.getFullYear() : 2025;

  const primaryTime = primaryDate
    ? primaryDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    : "6:00 PM";

  const primaryVenue = primaryFunction?.locationName || "TAJ FALAKNUMA PALACE";

  /* ------------------------------------------------------------------------ */
  /* MONOGRAM                                                                 */
  /* ------------------------------------------------------------------------ */

  const monogram = SoraData.announcement?.couple?.monogram || `${firstName.charAt(0)} | ${secondName.charAt(0)}`;

  const announcement = SoraData.announcement?.announcement ?? {};
  const invitationTitle =
    announcement.title ||
    SoraData.eventTitle ||
    "OUR WEDDING";

  const invitationMessage =
    announcement.message ||
    SoraData.invitationMessage ||
    "WE ARE DELIGHTED TO INVITE YOU TO SHARE IN THE JOY OF OUR SPECIAL DAY.";

  const rsvpDeadline =
    SoraData.rsvp?.deadline ||
    SoraData.rsvpDeadline ||
    "";

  const detailsItems: Array<[ThemeIconName, string, string]> =
    Array.isArray(SoraData.details) && SoraData.details.length
      ? SoraData.details.map((item: any) => [
          item.icon ?? "info",
          item.title ?? "DETAILS",
          item.description ?? "",
        ])
      : [
          ["venue", "VENUE", primaryVenue],
          ["venue", "ACCOMMODATION", "Recommended hotels nearby"],
          ["car", "TRANSPORTATION", "Airport pickup & local travel"],
          ["calendar", "PARKING", "Valet parking available"],
          ["info", "FAQS", "Find answers to common questions"],
        ];


  /* ------------------------------------------------------------------------ */
  /* NAVIGATION                                                                */
  /* ------------------------------------------------------------------------ */

  const navItems: Array<[string, string, ThemeIconName]> = [
    ["events", "EVENTS", "calendar"],
    ["story", "OUR STORY", "heart"],
    ["gallery", "GALLERY", "image"],
    ["rsvp", "RSVP", "phone"],
  ];

  const scrollTo = (id: string) => {
    setMenuOpen(false);

    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  /* ------------------------------------------------------------------------ */
  /* MOTION                                                                    */
  /* ------------------------------------------------------------------------ */

  const motionFor = (delay: number) => {
    const { key: _key, ...props } = getMotionProps(delay);

    return props;
  };

  /* ------------------------------------------------------------------------ */
  /* RENDER                                                                    */
                                                                  
  /* ------------------------------------------------------------------------ */

  return (
    <main
      key={animationKey}
      className="relative mx-auto min-h-screen w-full max-w-[430px] overflow-x-hidden md:max-w-[520px]"
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

          overflow: "hidden",
        } as CSSProperties
      }
    >
      {/* ================================================================== */}
      {/* BACKGROUND                                                         */}
      {/* ================================================================== */}

      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          opacity: "var(--bg-overlay-opacity, 0)",
        }}
      />

      <div className="relative z-10">
        {/* ================================================================ */}
        {/* HERO                                                             */}
        {/* ================================================================ */}

        <motion.section key={`hero-${animationKey}`} {...motionFor(0)} className="px-6 pt-8 pb-8">
          {/* TOP BAR */}

          <header className="flex items-center justify-between">
            <div
              style={{
                ...THEME_TYPOGRAPHY.heading,
                color: THEME_COLORS.text,
              }}
            >
              {monogram}
            </div>

            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setMenuOpen(true)}
              className="rounded-full p-1 md:hidden"
              style={{
                color: THEME_COLORS.text,
              }}
            >
              <ThemeIcon name="menu" size={22} />
            </button>
          </header>

          {/* HERO TYPOGRAPHY */}

          <div className="pt-12 text-center">
            <p
              className="mb-7"
              style={{
                ...THEME_TYPOGRAPHY.body,
                color: THEME_COLORS.muted,
              }}
            >
              {SoraData.announcement?.couple?.familyLabel || "TOGETHER WITH THEIR FAMILIES"}
            </p>

            <h1
              style={{
                ...THEME_TYPOGRAPHY.accent,
                color: THEME_COLORS.burgundy,
              }}
            >
              {firstName}
            </h1>

            <div
              className="my-2"
              style={{
                ...THEME_TYPOGRAPHY.body,
                color: THEME_COLORS.muted,
              }}
            >
              and
            </div>

            <h2
              style={{
                ...THEME_TYPOGRAPHY.accent,
                color: THEME_COLORS.burgundy2,
              }}
            >
              {secondName}
            </h2>

            <div className="mt-8">
              <p
                style={{
                  ...THEME_TYPOGRAPHY.body,
                  color: THEME_COLORS.text,
                }}
              >
                {SoraData.announcement?.announcement?.message || "INVITE YOU TO CELEBRATE THE EVENT"}
              </p>
            </div>

            {/* DATE */}

            <div className="mt-9">
              <div
                className="flex items-center justify-center gap-3"
                style={{
                  ...THEME_TYPOGRAPHY.heading,
                  color: THEME_COLORS.text,
                }}
              >
                <span>{primaryDayNumber}</span>

                <span
                  className="h-5 w-px"
                  style={{
                    background: THEME_COLORS.line,
                  }}
                />

                <span>{primaryMonth}</span>

                <span
                  className="h-5 w-px"
                  style={{
                    background: THEME_COLORS.line,
                  }}
                />

                <span>{primaryYear}</span>
              </div>

              <p
                className="mt-4"
                style={{
                  ...THEME_TYPOGRAPHY.body,
                  color: THEME_COLORS.text,
                }}
              >
                {primaryDay}
              </p>

              <p
                className="mt-1"
                style={{
                  ...THEME_TYPOGRAPHY.body,
                  color: THEME_COLORS.muted,
                }}
              >
                {primaryTime} ONWARDS
              </p>
            </div>

            {/* VENUE */}

            <div className="mt-7">
              <p
                style={{
                  ...THEME_TYPOGRAPHY.body,
                  color: THEME_COLORS.text,
                }}
              >
                {primaryVenue}
              </p>

              <p
                className="mt-1"
                style={{
                  ...THEME_TYPOGRAPHY.body,
                  color: THEME_COLORS.muted,
                }}
              >
                {SoraData.primaryFunction?.address || "HYDERABAD, INDIA"}
              </p>
            </div>
          </div>
        </motion.section>

        {/* ================================================================ */}
        {/* NAVIGATION                                                        */}
        {/* ================================================================ */}

        <div
          className="mx-6 h-px"
          style={{
            background: THEME_COLORS.line,
          }}
        />

        <motion.section {...motionFor(0.1)} className="px-4 py-4">
          <div className="grid grid-cols-4">
            {navItems.map(([id, label, icon]) => (
              <button
                key={id}
                type="button"
                onClick={() => scrollTo(id)}
                className="flex min-h-[66px] flex-col items-center justify-center gap-2"
                style={{
                  color: THEME_COLORS.text,
                }}
              >
                <span
                  style={{
                    color: THEME_COLORS.muted,
                  }}
                >
                  <ThemeIcon name={icon} size={19} />
                </span>

                <span
                  style={{
                    ...THEME_TYPOGRAPHY.body,
                    color: THEME_COLORS.text,
                  }}
                >
                  {label}
                </span>
              </button>
            ))}
          </div>
        </motion.section>

        {/* ================================================================ */}
        {/* HERO IMAGE                                                        */}
        {/* ================================================================ */}

        <motion.section {...motionFor(0.15)} className="relative overflow-hidden">
          <img src={heroImage} alt="Wedding couple" className="block h-[330px] w-full object-cover grayscale md:h-[430px]" />

          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: "linear-gradient(to bottom, rgba(0,0,0,.02), rgba(0,0,0,.12))",
            }}
          />
        </motion.section>

        {/* ================================================================ */}
        {/* INTRO                                                             */}
        {/* ================================================================ */}

        <motion.section {...motionFor(0.18)} className="px-7 py-12 text-center">
          <span
            className="mx-auto mb-5 block h-px w-10"
            style={{
              background: THEME_COLORS.line,
            }}
          />

          <p
            className="mx-auto max-w-[270px]"
            style={{
              ...THEME_TYPOGRAPHY.body,
              color: THEME_COLORS.muted,
            }}
          >
            {invitationMessage}
          </p>
        </motion.section>

        {/* ================================================================ */}
        {/* OUR STORY — TIMELINE                                              */}
        {/* ================================================================ */}

        <motion.section id="story" key={`story-${animationKey}`} {...motionFor(0.1)} className="px-6 py-14">
          <div className="text-center">
            <span
              style={{
                ...THEME_TYPOGRAPHY.body,
                color: THEME_COLORS.muted,
              }}
            >
              CHAPTER ONE
            </span>

            <h2 className="mt-3" style={THEME_TYPOGRAPHY.heading}>
              Our Story
            </h2>
          </div>

          <div className="relative mx-auto mt-12 max-w-[300px]">
            <div
              className="absolute top-0 bottom-0 left-1/2 w-px -translate-x-1/2"
              style={{
                background: THEME_COLORS.line,
              }}
            />

            {(Array.isArray(SoraData.story?.timeline) && SoraData.story.timeline.length
              ? SoraData.story.timeline.map((item: any) => [item.date ?? "", item.title ?? ""])
              : [
                  ["12 MAY 2018", "WE FIRST MET"],
                  ["02 JUN 2018", "FIRST DATE"],
                  ["24 DEC 2023", "SHE SAID YES"],
                  [`${primaryDayNumber} ${primaryMonth} ${primaryYear}`, "FOREVER STARTS"],
                ]
            ).map(([date, title], index) => (
              <motion.div
                key={title}
                {...motionFor(0.18 + index * 0.08)}
                className={`relative mb-12 flex items-center ${index % 2 === 0 ? "justify-start" : "justify-end"}`}
              >
                <div className="w-[45%] text-center">
                  <p
                    style={{
                      ...THEME_TYPOGRAPHY.body,
                      color: THEME_COLORS.muted,
                    }}
                  >
                    {date}
                  </p>

                  <h3
                    className="mt-2"
                    style={{
                      ...THEME_TYPOGRAPHY.heading,
                      color: THEME_COLORS.text,
                    }}
                  >
                    {title}
                  </h3>
                </div>

                <span
                  className="absolute left-1/2 h-3 w-3 -translate-x-1/2 rounded-full"
                  style={{
                    background: THEME_COLORS.text,
                  }}
                />
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ================================================================ */}
        {/* EVENTS — EDITORIAL                                               */}
        {/* ================================================================ */}

        <motion.section
          id="events"
          key={`events-${animationKey}`}
          {...motionFor(0.15)}
          className="px-6 py-14"
          style={{
            background: THEME_COLORS.paper,
          }}
        >
          <div className="text-center">
            <span
              style={{
                ...THEME_TYPOGRAPHY.body,
                color: THEME_COLORS.muted,
              }}
            >
              THE CELEBRATION
            </span>

            <h2 className="mt-3" style={THEME_TYPOGRAPHY.heading}>
              Events
            </h2>
          </div>

          <div className="mt-10">
            {functions.map((fn: any, index: number) => {
              const date = fn.date ? new Date(fn.date) : null;

              const day = date ? date.getDate().toString().padStart(2, "0") : ["14", "15", "16", "16"][index];

              const month = date
                ? date
                    .toLocaleString("en-US", {
                      month: "short",
                    })
                    .toUpperCase()
                : "NOV";

              const weekday = date
                ? date.toLocaleString("en-US", {
                    weekday: "long",
                  })
                : "";

              return (
                <motion.div
                  key={fn.function_key ?? `${fn.title}-${index}`}
                  {...motionFor(0.2 + index * 0.07)}
                  className="border-t py-7"
                  style={{
                    borderColor: THEME_COLORS.line,
                  }}
                >
                  <div className="grid grid-cols-[65px_1fr] gap-5">
                    <div className="text-center">
                      <div
                        style={{
                          ...THEME_TYPOGRAPHY.heading,
                          color: THEME_COLORS.text,
                        }}
                      >
                        {day}
                      </div>

                      <div
                        className="mt-1"
                        style={{
                          ...THEME_TYPOGRAPHY.body,
                          color: THEME_COLORS.muted,
                        }}
                      >
                        {month}
                      </div>
                    </div>

                    <div className="pt-1">
                      <div className="flex items-center justify-between">
                        <h3
                          style={{
                            ...THEME_TYPOGRAPHY.heading,
                            color: THEME_COLORS.text,
                          }}
                        >
                          {fn.title}
                        </h3>

                        <ThemeIcon name={index === 1 ? "music" : index === 3 ? "gift" : "heart"} size={17} />
                      </div>

                      <p
                        className="mt-2"
                        style={{
                          ...THEME_TYPOGRAPHY.body,
                          color: THEME_COLORS.muted,
                        }}
                      >
                        {weekday ? `${weekday} · ` : ""}
                        {fn.locationName || "Venue details"}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* ================================================================ */}
        {/* GALLERY — EDITORIAL                                              */}
        {/* ================================================================ */}

        {!gallery.hidden && (
          <motion.section id="gallery" key={`gallery-${animationKey}`} {...motionFor(0.15)} className="py-14">
            <div className="px-6 text-center">
              <span
                style={{
                  ...THEME_TYPOGRAPHY.body,
                  color: THEME_COLORS.muted,
                }}
              >
                MOMENTS
              </span>

              <h2 className="mt-3" style={THEME_TYPOGRAPHY.heading}>
                Gallery
              </h2>
            </div>

            <div className="mt-9">
              <GallerySection
                animationKey={animationKey}
                getMotionProps={getMotionProps}
                layout={SoraData.galleryLayout}
                urls={SoraData.galleryUrls?.length ? SoraData.galleryUrls : DUMMY_GALLERY}
                fallback={heroImage}
                title=""
                isProtected={gallery.protected}
                password={gallery.password}
                unlockedSections={unlockedSections}
                setUnlockedSections={setUnlockedSections}
              />
            </div>
          </motion.section>
        )}

        {/* ================================================================ */}
        {/* MUSIC — ALBUM STYLE                                              */}
        {/* ================================================================ */}

        <motion.section
          id="music"
          key={`music-${animationKey}`}
          {...motionFor(0.15)}
          className="px-6 py-14"
          style={{
            background: THEME_COLORS.paper,
          }}
        >
          <div className="text-center">
            <span
              style={{
                ...THEME_TYPOGRAPHY.body,
                color: THEME_COLORS.muted,
              }}
            >
              OUR SONG
            </span>

            <h2 className="mt-3" style={THEME_TYPOGRAPHY.heading}>
              Music
            </h2>
          </div>

          <div className="mt-9">
            <AudioPlayer
              src={data?.music?.background_audio ?? ""}
              name={data?.music?.background_audio_name ?? "Our Wedding Song"}
              cover={SoraData.galleryUrls?.[0] || DUMMY_GALLERY[0]}
              variant={data?.music?.audio_player_variant}
              allowMute={data?.music?.allow_mute ?? true}
              loop={data?.music?.loop_music ?? true}
              fadeIn={data?.music?.fade_in ?? false}
              fadeOut={data?.music?.fade_out ?? false}
              volume={data?.music?.volume_level ?? 60}
            />
          </div>
        </motion.section>

        {/* ================================================================ */}
        {/* DRESS CODE — PALETTE                                             */}
        {/* ================================================================ */}

        <motion.section id="dress-code" key={`dress-${animationKey}`} {...motionFor(0.15)} className="px-6 py-14 text-center">
          <span
            style={{
              ...THEME_TYPOGRAPHY.body,
              color: THEME_COLORS.muted,
            }}
          >
            THE PALETTE
          </span>

          <h2 className="mt-3" style={THEME_TYPOGRAPHY.heading}>
            Dress Code
          </h2>

          <div className="mt-10">
            {SoraData?.dressCode?.length ? (
              SoraData.dressCode.map((dress: any, index: number) => (
                <motion.div
                  key={`dress-${index}`}
                  {...motionFor(0.2 + index * 0.08)}
                  className={index > 0 ? "mt-12 border-t pt-10" : ""}
                  style={{
                    borderColor: THEME_COLORS.line,
                  }}
                >
                  <p
                    style={{
                      ...THEME_TYPOGRAPHY.body,
                      color: THEME_COLORS.muted,
                    }}
                  >
                    {dress.title || `LOOK ${index + 1}`}
                  </p>

                  {Array.isArray(dress.hexColors) && dress.hexColors.length > 0 && (
                    <div className="mt-6 flex justify-center gap-4">
                      {dress.hexColors.map((color: string, colorIndex: number) => (
                        <span
                          key={`${color}-${colorIndex}`}
                          className="h-9 w-9 rounded-full border"
                          style={{
                            backgroundColor: color,
                            borderColor: THEME_COLORS.line,
                          }}
                          title={color}
                        />
                      ))}
                    </div>
                  )}

                  {dress.description && (
                    <p
                      className="mx-auto mt-5 max-w-[270px]"
                      style={{
                        ...THEME_TYPOGRAPHY.body,
                        color: THEME_COLORS.muted,
                      }}
                    >
                      {dress.description}
                    </p>
                  )}
                </motion.div>
              ))
            ) : (
              <div className="py-6">
                <p
                  style={{
                    ...THEME_TYPOGRAPHY.body,
                    color: THEME_COLORS.text,
                  }}
                >
                  Elegant
                  <br />
                  &amp; timeless
                </p>

                <p
                  className="mt-4"
                  style={{
                    ...THEME_TYPOGRAPHY.body,
                    color: THEME_COLORS.muted,
                  }}
                >
                  FORMAL ATTIRE
                </p>
              </div>
            )}
          </div>
        </motion.section>

        {/* ================================================================ */}
        {/* WISHES — QUOTE STYLE                                             */}
        {/* ================================================================ */}

        {!wishes.hidden && (
          <motion.section
            id="wishes"
            key={`wishes-${animationKey}`}
            {...motionFor(0.15)}
            className="py-14"
            style={{
              background: THEME_COLORS.paper,
            }}
          >
            <div className="px-6 text-center">
              <span
                style={{
                  ...THEME_TYPOGRAPHY.body,
                  color: THEME_COLORS.muted,
                }}
              >
                KIND WORDS
              </span>

              <h2 className="mt-3" style={THEME_TYPOGRAPHY.heading}>
                Wishes
              </h2>
            </div>

            <div className="mt-8">
              <WishesSection
                animationKey={animationKey}
                getMotionProps={getMotionProps}
                eventKey={eventKey}
                wishesRaw={SoraData.wishesRaw}
                wishesContainerRef={wishesContainerRef}
                wishRefreshKey={wishRefreshKey}
                setWishRefreshKey={setWishRefreshKey}
                title=""
                isIcon={false}
                isProtected={wishes.protected}
                password={wishes.password}
                unlockedSections={unlockedSections}
                setUnlockedSections={setUnlockedSections}
              />
            </div>
          </motion.section>
        )}

        {/* ================================================================ */}
        {/* RSVP — FOCAL                                                     */}
        {/* ================================================================ */}

        <motion.section id="rsvp" key={`rsvp-${animationKey}`} {...motionFor(0.15)} className="px-6 py-16 text-center">
          <span
            style={{
              ...THEME_TYPOGRAPHY.body,
              color: THEME_COLORS.muted,
            }}
          >
            KINDLY RESPOND
          </span>

          <h2
            className="mx-auto mt-4 max-w-[280px]"
            style={{
              ...THEME_TYPOGRAPHY.heading,
              color: THEME_COLORS.text,
            }}
          >
            Will you
            <br />
            join us?
          </h2>

          <p
            className="mx-auto mt-6 max-w-[250px]"
            style={{
              ...THEME_TYPOGRAPHY.body,
              color: THEME_COLORS.muted,
            }}
          >
            WE WOULD LOVE TO HAVE YOU CELEBRATE THIS SPECIAL DAY WITH US.
          </p>

          <div className="mx-auto mt-8 max-w-[260px] space-y-3">
            <button
              type="button"
              onClick={() => setRsvp("yes")}
              className="flex w-full items-center justify-center gap-2 border py-4"
              style={{
                borderColor: THEME_COLORS.text,
                background: rsvp === "yes" ? THEME_COLORS.text : "transparent",
                color: rsvp === "yes" ? THEME_COLORS.paper : THEME_COLORS.text,
              }}
            >
              <ThemeIcon name="check" size={14} />

              <span
                style={{
                  ...THEME_TYPOGRAPHY.body,
                }}
              >
                YES, I WILL
              </span>
            </button>

            <button
              type="button"
              onClick={() => setRsvp("no")}
              className="flex w-full items-center justify-center gap-2 border py-4"
              style={{
                borderColor: THEME_COLORS.line,
                background: rsvp === "no" ? THEME_COLORS.text : "transparent",
                color: rsvp === "no" ? THEME_COLORS.paper : THEME_COLORS.text,
              }}
            >
              <ThemeIcon name="close" size={14} />

              <span
                style={{
                  ...THEME_TYPOGRAPHY.body,
                }}
              >
                REGRETS
              </span>
            </button>
          </div>

          <p
            className="mt-6"
            style={{
              ...THEME_TYPOGRAPHY.body,
              color: THEME_COLORS.muted,
            }}
          >
            PLEASE RESPOND BY
            <br />
            {rsvpDeadline || `${primaryMonth} ${primaryDayNumber}, ${primaryYear}`}
          </p>
        </motion.section>

        {/* ================================================================ */}
        {/* DETAILS — LIST                                                  */}
        {/* ================================================================ */}

        <motion.section
          id="details"
          key={`details-${animationKey}`}
          {...motionFor(0.15)}
          className="px-6 py-14"
          style={{
            background: THEME_COLORS.paper,
          }}
        >
          <div className="text-center">
            <span
              style={{
                ...THEME_TYPOGRAPHY.body,
                color: THEME_COLORS.muted,
              }}
            >
              EVERYTHING YOU NEED
            </span>

            <h2 className="mt-3" style={THEME_TYPOGRAPHY.heading}>
              Details
            </h2>
          </div>

          <div className="mt-9 divide-y">
            {detailsItems.map(([icon, title, description]) => (
              <button
                key={title}
                type="button"
                className="flex w-full items-center gap-4 py-5 text-left"
                style={{
                  borderColor: THEME_COLORS.line,
                }}
              >
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center border"
                  style={{
                    borderColor: THEME_COLORS.line,
                    color: THEME_COLORS.text,
                  }}
                >
                  <ThemeIcon name={icon} size={17} />
                </span>

                <span className="min-w-0 flex-1">
                  <span
                    className="block"
                    style={{
                      ...THEME_TYPOGRAPHY.body,
                      color: THEME_COLORS.text,
                    }}
                  >
                    {title}
                  </span>

                  <span
                    className="mt-1 block"
                    style={{
                      ...THEME_TYPOGRAPHY.body,
                      color: THEME_COLORS.muted,
                    }}
                  >
                    {description}
                  </span>
                </span>

                <ThemeIcon name="chevron" size={14} />
              </button>
            ))}
          </div>
        </motion.section>

        {/* ================================================================ */}
        {/* GIFT REGISTRY — MINIMAL                                         */}
        {/* ================================================================ */}

        <motion.section id="gift-registry" key={`gift-${animationKey}`} {...motionFor(0.15)} className="px-6 py-16 text-center">
          <span
            style={{
              ...THEME_TYPOGRAPHY.body,
              color: THEME_COLORS.muted,
            }}
          >
            WITH LOVE
          </span>

          <div
            className="mx-auto mt-5"
            style={{
              ...THEME_TYPOGRAPHY.body,
              color: THEME_COLORS.muted,
            }}
          >
            ♡
          </div>

          <p
            className="mx-auto mt-5 max-w-[250px]"
            style={{
              ...THEME_TYPOGRAPHY.body,
              color: THEME_COLORS.muted,
            }}
          >
            YOUR PRESENCE IS OUR GREATEST GIFT.
            <br />
            IF YOU WISH TO BLESS US, HERE ARE OUR PREFERRED OPTIONS.
          </p>

          <button
            type="button"
            className="mx-auto mt-7 flex items-center gap-2 border px-7 py-3"
            style={{
              borderColor: THEME_COLORS.text,
              color: THEME_COLORS.text,
            }}
          >
            <ThemeIcon name="gift" size={15} />

            <span
              style={{
                ...THEME_TYPOGRAPHY.body,
              }}
            >
              VIEW REGISTRY
            </span>
          </button>
        </motion.section>

        {/* ================================================================ */}
        {/* CLOSING IMAGE                                                    */}
        {/* ================================================================ */}

        <motion.section {...motionFor(0.15)} className="relative overflow-hidden">
          <img src={heroImage} alt="" className="block h-[310px] w-full object-cover grayscale" />

          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to bottom, rgba(0,0,0,.04), rgba(0,0,0,.25))",
            }}
          />
        </motion.section>

        {/* ================================================================ */}
        {/* CLOSING MESSAGE                                                  */}
        {/* ================================================================ */}

        <motion.section
          {...motionFor(0.18)}
          className="px-6 py-14 text-center"
          style={{
            background: THEME_COLORS.paper,
          }}
        >
          <p
            className="mx-auto max-w-[260px]"
            style={{
              ...THEME_TYPOGRAPHY.body,
              color: THEME_COLORS.text,
            }}
          >
            WE CAN&apos;T WAIT TO
            <br />
            CELEBRATE WITH YOU!
          </p>

          <div
            className="mt-6"
            style={{
              ...THEME_TYPOGRAPHY.body,
              color: THEME_COLORS.muted,
            }}
          >
            ♥
          </div>
        </motion.section>

        {/* ================================================================ */}
        {/* FOOTER                                                           */}
        {/* ================================================================ */}

        <motion.footer
          key={`footer-${animationKey}`}
          {...motionFor(0.2)}
          className="px-6 pt-9 pb-8"
          style={{
            background: THEME_COLORS.page,
          }}
        >
          <div className="text-center">
            <div
              style={{
                ...THEME_TYPOGRAPHY.heading,
                color: THEME_COLORS.text,
              }}
            >
              {monogram}
            </div>

            <div
              className="mt-4"
              style={{
                color: THEME_COLORS.muted,
              }}
            >
              ❧
            </div>
          </div>

          <div className="mt-9 grid grid-cols-2 gap-y-3">
            {[
              ["OUR STORY", "story"],
              ["DETAILS", "details"],
              ["EVENTS", "events"],
              ["DRESS CODE", "dress-code"],
              ["GALLERY", "gallery"],
              ["MUSIC", "music"],
              ["WISHES", "wishes"],
              ["GIFT REGISTRY", "gift-registry"],
              ["RSVP", "rsvp"],
            ].map(([label, id]) => (
              <button
                key={id}
                type="button"
                onClick={() => scrollTo(id)}
                className="text-left"
                style={{
                  ...THEME_TYPOGRAPHY.body,
                  color: THEME_COLORS.muted,
                }}
              >
                {label}
              </button>
            ))}
          </div>

          <div
            className="mt-9 border-t pt-5 text-center"
            style={{
              borderColor: THEME_COLORS.line,
            }}
          >
            <span
              style={{
                ...THEME_TYPOGRAPHY.body,
                color: THEME_COLORS.muted,
              }}
            >
              © {primaryYear} {firstName} &amp; {secondName}. ALL RIGHTS RESERVED.
            </span>
          </div>
        </motion.footer>

        {/* ================================================================ */}
        {/* MOBILE MENU                                                       */}
        {/* ================================================================ */}

        {menuOpen && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            className="fixed inset-0 z-50 mx-auto w-full max-w-[430px]"
            style={{
              background: THEME_COLORS.paper,
              color: THEME_COLORS.text,
            }}
          >
            <div className="flex items-center justify-between px-6 py-7">
              <div
                style={{
                  ...THEME_TYPOGRAPHY.heading,
                }}
              >
                {monogram}
              </div>

              <button type="button" onClick={() => setMenuOpen(false)} aria-label="Close menu">
                <ThemeIcon name="close" size={23} />
              </button>
            </div>

            <nav className="px-8 pt-7 text-center">
              {[
                ["OUR STORY", "story"],
                ["EVENTS", "events"],
                ["GALLERY", "gallery"],
                ["WISHES", "wishes"],
                ["DRESS CODE", "dress-code"],
                ["MUSIC", "music"],
                ["RSVP", "rsvp"],
                ["DETAILS", "details"],
                ["GIFT REGISTRY", "gift-registry"],
              ].map(([label, id]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => scrollTo(id)}
                  className="block w-full border-b py-5"
                  style={{
                    borderColor: THEME_COLORS.line,
                    ...THEME_TYPOGRAPHY.body,
                    color: THEME_COLORS.text,
                  }}
                >
                  {label}
                </button>
              ))}
            </nav>
          </motion.div>
        )}
      </div>
    </main>
  );
}