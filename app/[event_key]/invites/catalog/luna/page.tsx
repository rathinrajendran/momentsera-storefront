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
import { THEME_COLORS } from "../../core/core/themeColors";
import { getShapeBorderStyle, THEME_SHAPES, getShapeCardStyle } from "../../core/core/themeShapes";
import { ThemeIcon, type ThemeIconName } from "../../core/core/themeIcons";
import { ThemeSectionTitle } from "../../core/core/ThemeSectionTitle";
import { THEME_TYPOGRAPHY } from "../../core/core/themeTypography";
import AudioPlayer from "../../../../../components/ui/AudioPlayer";

interface LunaProps {
  data: any;
  eventKey: string;
  motionData: any;
  settings: any;
  theme?: any;
}

const DUMMY_HERO = "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=85";

 
export default function Luna({ data, eventKey, motionData, settings, music }: LunaProps) {
  const LunaData = useInviteData(data);
  const { getMotionProps } = useThemeAnimation(motionData);
  const animationKey = useMemo(() => getAnimationKey(motionData), [motionData]);
  const [wishRefreshKey, setWishRefreshKey] = useState(0);
  const wishesContainerRef = useRef<HTMLElement | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [rsvp, setRsvp] = useState<"yes" | "no" | null>(null);
  const [wishSent, setWishSent] = useState(false);
  const [wish, setWish] = useState("");
  const wishesRef = useRef<HTMLTextAreaElement>(null);

  const firstName = LunaData.firstName || LunaData.brideName || "Ananya";
  const secondName = LunaData.secondName || LunaData.groomName || "Ritvik";
  const heroImage = LunaData.heroImage || DUMMY_HERO;
  const gallery = getSectionConfig(settings?.section_visibility, "gallery");
  const wishes = getSectionConfig(settings?.section_visibility, "wishes");
  const { unlockedSections, setUnlockedSections } = useUnlockedSections(eventKey);

  const functions = LunaData.eventFunctions?.length
    ? LunaData.eventFunctions
    : [
        { title: "Mehndi", date: "2025-11-14", locationName: "Friday, 3:00 PM onwards" },
        { title: "Sangeet", date: "2025-11-15", locationName: "Saturday, 6:00 PM onwards" },
        { title: "Wedding", date: "2025-11-16", locationName: "Sunday, 6:00 PM onwards" },
        { title: "Reception", date: "2025-11-16", locationName: "Sunday, 8:30 PM onwards" },
      ];

  const navItems: Array<[string, string, ThemeIconName]> = [
    ["story", "OUR STORY", "heart"],
    ["events", "EVENTS", "calendar"],
    ["gallery", "GALLERY", "image"],
    ["wishes", "WISHES", "heart"],
    ["dress", "DRESS CODE", "shirt"],
    ["music", "MUSIC", "music"],
    ["rsvp", "RSVP", "phone"],
    ["details", "DETAILS", "info"],
    ["gift", "GIFT REGISTRY", "gift"],
  ];

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const motionFor = (delay: number) => {
    const { key: _key, ...props } = getMotionProps(delay);
    return props;
  };
  const primaryFunction = LunaData.primaryFunction;

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
  console.log("primaryFunction", music);

  return (
    <main
      key={animationKey}
      className="main-block relative mx-auto min-h-screen w-full max-w-[430px] overflow-x-hidden md:max-w-[1100px]"
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
          overflow: "hidden",
        } as CSSProperties
      }
    >
      {/* BACKGROUND PHOTO OVERLAY */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-white" style={{ opacity: "var(--bg-overlay-opacity, 0)" }} />

      <div className="relative z-10 md:px-8 lg:px-12">
        {/* TOP / HERO */}
        <motion.section key={`hero-${animationKey}`} {...motionFor(0)} className="relative px-5 pt-7 pb-9 md:px-0 md:pt-10 md:pb-12">
          <header className="mb-7 flex items-center justify-between">
            <div
              style={{
                ...THEME_TYPOGRAPHY.body,
                color: THEME_COLORS.burgundy,
              }}
            >
              {LunaData.announcement?.couple?.monogram}
            </div>

            <button
              aria-label="Open menu"
              onClick={() => setMenuOpen(true)}
              className="rounded-full p-1 md:hidden"
              style={{ color: THEME_COLORS.burgundy }}
            >
              <ThemeIcon name="menu" size={28} />
            </button>
          </header>

          <div className="text-center">
            <p className="mb-4" style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.text }}>
              {LunaData.announcement?.couple?.familyLabel}
            </p>

            <h1
              style={{
                ...THEME_TYPOGRAPHY.heading,
                color: THEME_COLORS.burgundy,
              }}
            >
              {LunaData.announcement?.announcement?.title}
            </h1>

            <div className="my-5 flex items-center justify-center gap-3">
              <span className="h-px w-12" style={{ ...THEME_TYPOGRAPHY.heading, background: THEME_COLORS.line }} />
              <span style={{ ...THEME_TYPOGRAPHY.accent, color: THEME_COLORS.gold }}>
                {firstName} &amp; {secondName}
              </span>
              <span className="h-px w-12" style={{ background: THEME_COLORS.line }} />
            </div>

            <motion.div {...motionFor(0.15)} className="overflow-hidden">
              <img
                src={heroImage}
                alt="Wedding couple"
                className="h-[238px] w-full object-cover md:h-[400px]"
                style={{
                  borderRadius: THEME_SHAPES.imageRadius,
                  boxShadow: THEME_SHAPES.shadow,
                }}
              />
            </motion.div>

            <div className="my-4 flex items-center justify-center gap-2">
              <span style={{ color: THEME_COLORS.gold }}>❧</span>
              <span style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.text }}>{LunaData.announcement?.announcement?.message}</span>
              <span style={{ color: THEME_COLORS.gold }}>❧</span>
            </div>
          </div>
          <WeddingCalendar
            year={functions[0]?.date ? new Date(functions[0].date).getFullYear() : 2025}
            month={functions[0]?.date ? new Date(functions[0].date).getMonth() : 10}
            selectedDate={functions[0]?.date ? new Date(functions[0].date).getDate() : 16}
          />

          {/* MAIN DETAILS */}
          <div
            className="mx-auto mt-4 grid max-w-[760px] grid-cols-3 p-4 md:mt-6 md:p-6"
            style={{
              ...getShapeCardStyle(),
              borderColor: THEME_COLORS.line,
              background: THEME_COLORS.paper,
            }}
          >
            {[
              ["calendar", primaryDay, primaryDateLabel],
              ["clock", primaryTime, "Onwards"],
              ["venue", primaryVenue],
            ].map(([icon, a, b], i) => (
              <motion.div key={a} {...motionFor(0.18 + i * 0.07)} className="text-center">
                <div className="mb-2 flex justify-center" style={{ color: THEME_COLORS.gold }}>
                  <ThemeIcon name={icon as ThemeIconName} size={23} />
                </div>
                <p style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.text }}>{a}</p>
                <p className="mt-1" style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.muted }}>
                  {b}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* NAV GRID */}
        <section className="hidden px-5 pb-4 md:block md:px-0 md:pb-8">
          <div className="mx-auto grid max-w-[760px] grid-cols-3 border-t border-l" style={{ borderColor: THEME_COLORS.line }}>
            {navItems.map(([id, label, icon]) => (
              <button
                key={id}
                onClick={() => scrollTo(id === "dress" ? "dress-code" : id === "gift" ? "gift-registry" : id)}
                className="flex min-h-[76px] flex-col items-center justify-center gap-2 border-r border-b md:min-h-[92px]"
                style={{ borderColor: THEME_COLORS.line, color: THEME_COLORS.text }}
              >
                <span style={{ color: THEME_COLORS.gold }}>
                  <ThemeIcon name={icon as ThemeIconName} size={22} />
                </span>
                <span style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.text }}>{label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* OUR STORY */}
        <motion.section id="story" key={`story-${animationKey}`} {...motionFor(0.1)} className="px-5 py-8 md:px-8 md:py-12">
          <ThemeSectionTitle decoration="floral">OUR STORY</ThemeSectionTitle>
          <div className="relative">
            <div className="absolute top-5 right-5 left-5 h-px" style={{ background: THEME_COLORS.line }} />
            <div className="mx-auto grid max-w-[760px] grid-cols-4 gap-2 text-center md:gap-8">
              {[
                ["♡", "WE MET", "12 MAY 2018"],
                ["☕", "FIRST DATE", "02 JUNE 2018"],
                ["♢", "SHE SAID YES", "24 DEC 2023"],
                ["♡", "FOREVER STARTS", "16 NOV 2025"],
              ].map(([icon, title, date], i) => (
                <motion.div key={title} {...motionFor(0.18 + i * 0.08)} className="relative">
                  <div
                    className="relative z-10 mx-auto flex h-10 w-10 items-center justify-center rounded-full"
                    style={{
                      ...getShapeBorderStyle(),
                      ...THEME_TYPOGRAPHY.body,
                      borderColor: THEME_COLORS.line,
                      background: THEME_COLORS.page,
                      color: THEME_COLORS.gold,
                      boxShadow: THEME_SHAPES.shadow,
                    }}
                  >
                    {icon}
                  </div>
                  <p className="mt-3" style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.text }}>
                    {title}
                  </p>
                  <p className="mt-1" style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.muted }}>
                    {date}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
        {/* EVENTS */}
        <motion.section id="events" key={`events-${animationKey}`} {...motionFor(0.15)} className="px-5 py-8 md:px-8 md:py-12">
          <ThemeSectionTitle decoration="floral">FUNCTIONS</ThemeSectionTitle>
          <div className="space-y-2">
            {functions.map((fn: any, i: number) => {
              const fallbackDates = ["14", "15", "16", "16"];
              const dateNum = fn.date ? new Date(fn.date).getDate() : fallbackDates[i];
              const month = fn.date ? new Date(fn.date).toLocaleString("en-US", { month: "short" }).toUpperCase() : "NOV";
              return (
                <motion.div
                  key={fn.function_key ?? i}
                  {...motionFor(0.22 + i * 0.08)}
                  className="flex items-center gap-3 border-b py-2.5 md:gap-5 md:py-4"
                  style={{ borderColor: THEME_COLORS.line }}
                >
                  <div
                    className="flex h-11 w-11 shrink-0 flex-col items-center justify-center text-center"
                    style={{
                      ...getShapeBorderStyle(),
                      ...THEME_TYPOGRAPHY.body,
                      borderColor: THEME_COLORS.line,
                      borderRadius: THEME_SHAPES.radius,
                      background: THEME_COLORS.burgundy,
                      color: THEME_COLORS.paper,
                    }}
                  >
                    <span style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.paper }}>{dateNum}</span>
                    <span
                      style={{
                        ...THEME_TYPOGRAPHY.body,
                        color: THEME_COLORS.paper,
                      }}
                    >
                      {month}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.muted }}>{fn.title}</p>
                    <p className="mt-1" style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.muted }}>
                      {fn.locationName || "Taj Falaknuma Palace"}
                    </p>
                  </div>
                  <span style={{ color: THEME_COLORS.gold }}>
                    <ThemeIcon name={i === 1 ? "music" : i === 3 ? "gift" : "heart"} size={20} />
                  </span>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* GALLERY */}
        {!gallery.hidden && (
          <GallerySection
            animationKey={animationKey}
            getMotionProps={getMotionProps}
            layout={LunaData.galleryLayout}
            urls={LunaData.galleryUrls}
            fallback={LunaData.heroImage}
            title="Gallery"
            isProtected={gallery.protected}
            password={gallery.password}
            unlockedSections={unlockedSections}
            setUnlockedSections={setUnlockedSections}
          />
        )}

        {/* MUSIC */}
        <motion.section id="music" key={`music-${animationKey}`} {...motionFor(0.2)} className="px-5 py-8 md:px-8 md:py-12">
          <ThemeSectionTitle decoration="floral">MUSIC</ThemeSectionTitle>

          <motion.div {...motionFor(0.3)}>
            <AudioPlayer
              src={music?.background_audio ?? ""}
              name={music?.background_audio_name ?? "Background Music"}
              variant={music.audio_player_variant}
              allowMute={music?.allow_mute ?? true}
              loop={music?.loop_music ?? true}
              fadeIn={music?.fade_in ?? false}
              fadeOut={music?.fade_out ?? false}
              volume={music?.volume_level ?? 60}
            />
          </motion.div>
        </motion.section>

        {/* DRESS CODE */}
        <motion.section id="dress-code" key={`dress-code-${animationKey}`} {...motionFor(0.2)} className="px-5 py-9 md:px-8 md:py-12">
          <ThemeSectionTitle decoration="floral">DRESS CODE</ThemeSectionTitle>
          <div className="space-y-6">
            {LunaData?.dressCode?.map((dress: any, dressIndex: number) => (
              <motion.div key={`dress-${dressIndex}`} {...motionFor(0.2 + dressIndex * 0.08)} className="text-center">
                {Array.isArray(dress.hexColors) && dress.hexColors.length > 0 && (
                  <div className="mt-5 flex justify-center gap-5">
                    {dress.hexColors.map((color: string, colorIndex: number) => (
                      <motion.span
                        key={`${color}-${colorIndex}`}
                        {...motionFor(0.28 + dressIndex * 0.08 + colorIndex * 0.06)}
                        className="h-9 w-9 rounded-full border border-white shadow-sm"
                        style={{
                          backgroundColor: color,
                        }}
                        title={color}
                        aria-label={`Dress color ${color}`}
                      />
                    ))}
                  </div>
                )}
                {dress.title && (
                  <h3
                    style={{
                      ...THEME_TYPOGRAPHY.body,
                      color: THEME_COLORS.text,
                    }}
                    className="mt-8"
                  >
                    {dress.title}
                  </h3>
                )}

                {dress.description && (
                  <p
                    className="mx-auto mt-2 max-w-[420px]"
                    style={{
                      ...THEME_TYPOGRAPHY.body,
                      color: THEME_COLORS.muted,
                    }}
                  >
                    {dress.description}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </motion.section>

        {!wishes.hidden && (
          <WishesSection
            animationKey={animationKey}
            getMotionProps={getMotionProps}
            eventKey={eventKey}
            wishesRaw={LunaData.wishesRaw}
            wishesContainerRef={wishesContainerRef}
            wishRefreshKey={wishRefreshKey}
            setWishRefreshKey={setWishRefreshKey}
            title={LunaData.wishesTitle ?? "Best Wishes"}
            isIcon={false}
            isProtected={wishes.protected}
            password={wishes.password}
            unlockedSections={unlockedSections}
            setUnlockedSections={setUnlockedSections}
          />
        )}
        {/* QUOTE / FOOTER */}
        <motion.section
          key={`quote-${animationKey}`}
          {...motionFor(0.15)}
          className="relative overflow-hidden px-6 py-16 text-center md:px-16 md:py-24"
          style={{ background: THEME_COLORS.dark, color: THEME_COLORS.paper }}
        >
          <img
            src={heroImage}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-25"
            style={{
              filter: "grayscale(100%)",
              borderRadius: THEME_SHAPES.imageRadius,
            }}
          />
          <div className="relative">
            <p className="mx-auto max-w-[260px]" style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.paper }}>
              The best thing to hold onto in life is each other.
            </p>
            <div className="mt-3" style={{ color: THEME_COLORS.gold }}>
              ♥
            </div>
          </div>
        </motion.section>
        {/* RSVP */}
        <motion.section id="rsvp" key={`rsvp-${animationKey}`} {...motionFor(0.15)} className="px-5 py-9 md:px-8 md:py-12">
          <ThemeSectionTitle decoration="floral">KINDLY RSVP</ThemeSectionTitle>
          <p className="mx-auto max-w-[245px] text-center" style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.muted }}>
            We request the pleasure of your response by <strong>15 October 2025.</strong>
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <motion.button
              {...motionFor(0.25)}
              onClick={() => setRsvp("yes")}
              className="flex items-center justify-center gap-2 py-3"
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
              className="flex items-center justify-center gap-2 py-3"
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
          <button className="mx-auto mt-5 block border px-8 py-3" style={{ ...THEME_TYPOGRAPHY.body, borderColor: THEME_COLORS.gold }}>
            RSVP NOW
          </button>
        </motion.section>

        {/* DETAILS */}
        <motion.section
          id="details"
          key={`details-${animationKey}`}
          {...motionFor(0.15)}
          className="hidden px-5 py-9 md:px-8 md:py-12"
          style={{ background: THEME_COLORS.paper }}
        >
          <ThemeSectionTitle decoration="floral">THE DETAILS</ThemeSectionTitle>
          <div className="divide-y" style={{ borderColor: THEME_COLORS.line }}>
            {(
              [
                ["venue", "ACCOMMODATION", "View recommended hotels"],
                ["car", "TRANSPORTATION", "Airport pickup & local travel"],
                ["calendar", "PARKING", "Valet parking available"],
                ["info", "FAQS", "Find answers to common questions"],
              ] as Array<[ThemeIconName, string, string]>
            ).map(([icon, title, text]) => (
              <button key={title} className="flex w-full items-center gap-4 py-4 text-left" style={{ borderColor: THEME_COLORS.line }}>
                <span style={{ color: THEME_COLORS.gold }}>
                  <ThemeIcon name={icon as ThemeIconName} size={22} />
                </span>
                <span className="flex-1">
                  <span className="block" style={{ ...THEME_TYPOGRAPHY.body }}>
                    {title}
                  </span>
                  <span className="mt-1 block" style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.muted }}>
                    {text}
                  </span>
                </span>
                <span style={{ color: THEME_COLORS.gold }}>
                  <ThemeIcon name="chevron" size={15} />
                </span>
              </button>
            ))}
          </div>
        </motion.section>

        {/* GIFT REGISTRY */}
        <motion.section
          id="gift-registry"
          key={`gift-registry-${animationKey}`}
          {...motionFor(0.15)}
          className="hidden px-5 py-9 text-center md:px-8 md:py-12"
        >
          <ThemeSectionTitle decoration="floral">GIFT REGISTRY</ThemeSectionTitle>
          <p className="mx-auto max-w-[260px]" style={{ color: THEME_COLORS.muted }}>
            Your presence is our greatest gift.
            <br />
            If you wish to bless us, here are our preferred options.
          </p>
          <button
            className="mx-auto mt-5 flex items-center gap-2 border px-7 py-3"
            style={{ ...THEME_TYPOGRAPHY.body, borderColor: THEME_COLORS.gold }}
          >
            <ThemeIcon name="gift" size={15} /> VIEW REGISTRY
          </button>
        </motion.section>

        <motion.footer
          key={`footer-${animationKey}`}
          {...motionFor(0.2)}
          className="px-6 pt-9 pb-8 text-center md:px-12 md:pt-12 md:pb-10"
          style={{ background: THEME_COLORS.paper }}
        >
          <div style={{ ...THEME_TYPOGRAPHY.heading, color: THEME_COLORS.burgundy }}>{LunaData.announcement?.couple?.monogram}</div>
          <div className="mt-2" style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.gold }}>
            ❧
          </div>
          <p className="mt-4" style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.muted }}>
            CAN'T WAIT TO CELEBRATE WITH YOU!
          </p>
          <div className="mt-6 flex justify-center gap-6" style={{ color: THEME_COLORS.burgundy }}>
            <span aria-label="Instagram">◎</span>
            <span aria-label="Facebook">f</span>
            <span aria-label="WhatsApp">◌</span>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-y-3 text-left" style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.muted }}>
            <button onClick={() => scrollTo("story")}>OUR STORY</button>
            <button onClick={() => scrollTo("details")}>DETAILS</button>
            <button onClick={() => scrollTo("events")}>EVENTS</button>
            <button onClick={() => scrollTo("dress-code")}>DRESS CODE</button>
            <button onClick={() => scrollTo("gallery")}>GALLERY</button>
            <button onClick={() => scrollTo("music")}>MUSIC</button>
            <button onClick={() => scrollTo("wishes")}>WISHES</button>
            <button onClick={() => scrollTo("gift-registry")}>GIFT REGISTRY</button>
            <button onClick={() => scrollTo("rsvp")}>RSVP</button>
          </div>

          <div
            className="mt-8 pt-5"
            style={{
              ...THEME_TYPOGRAPHY.body,
              borderTopColor: THEME_COLORS.line,
              color: THEME_COLORS.muted,
            }}
          >
            © 2025 {firstName} &amp; {secondName}. ALL RIGHTS RESERVED.
          </div>
        </motion.footer>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div className="fixed inset-0 z-50 mx-auto w-full max-w-[430px] md:hidden" style={{ background: THEME_COLORS.burgundy }}>
            <div className="flex items-center justify-between px-6 py-7" style={{ color: THEME_COLORS.paper }}>
              <div>{LunaData.announcement?.couple?.monogram}</div>
              <button onClick={() => setMenuOpen(false)} aria-label="Close menu">
                <ThemeIcon name="close" size={27} />
              </button>
            </div>
            <nav className="flex flex-col px-10 pt-10 text-center">
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
                  onClick={() => scrollTo(id)}
                  className="border-b py-5"
                  style={{ ...THEME_TYPOGRAPHY.body, borderColor: "rgba(255,255,255,.18)", color: THEME_COLORS.paper }}
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
