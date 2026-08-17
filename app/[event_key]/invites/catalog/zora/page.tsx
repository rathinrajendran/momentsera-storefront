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
import AudioPlayer from "../../../../../components/ui/AudioPlayer";

interface ZoraProps {
  data: any;
  eventKey: string;
  motionData: any;
  settings: any;
  theme?: any;
  music?: any;
}

const DUMMY_HERO = "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=88";

const DUMMY_GALLERY = [
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1519225421980-da6f2b4f5f0e?auto=format&fit=crop&w=900&q=85",
];

const INDIA_PALETTE = {
  ivory: "#F8F1E6",
  paper: "#FFFDF8",
  maroon: "#721C2B",
  deep: "#3D1520",
  saffron: "#C87925",
  gold: "#B68A45",
  rose: "#C58A83",
  sage: "#7D8065",
  line: "rgba(114, 28, 43, .18)",
  muted: "#756760",
};

const FALLBACK_FUNCTIONS = [
  {
    title: "Haldi",
    date: "2026-11-19",
    locationName: "Aparna's Home · 10:30 AM onwards",
  },
  {
    title: "Mehndi & Sangeet",
    date: "2026-11-20",
    locationName: "The Courtyard, Jaipur · 6:30 PM onwards",
  },
  {
    title: "Wedding Ceremony",
    date: "2026-11-21",
    locationName: "The Courtyard, Jaipur · 10:30 AM onwards",
  },
  {
    title: "Reception",
    date: "2026-11-21",
    locationName: "The Courtyard, Jaipur · 7:30 PM onwards",
  },
];

const FALLBACK_STORY = [
  ["01", "THE FIRST HELLO", "A coffee, a long conversation, and the beginning of something quietly beautiful."],
  ["02", "THE YES", "Two families met, stories were shared, and forever started feeling wonderfully real."],
  ["03", "THE CELEBRATION", "Now we gather the people we love most to celebrate the next chapter together."],
];

const FALLBACK_DRESS = [
  {
    title: "Mehndi & Sangeet",
    description: "Jewel tones, florals and a little sparkle. Come ready for music and merriment.",
    hexColors: ["#8A2434", "#D4A72C", "#275C4A", "#D48A74"],
  },
  {
    title: "Wedding Day",
    description: "Traditional Indian festive wear in elegant, joyful colours.",
    hexColors: ["#721C2B", "#C87925", "#E6C98B", "#F5E8D3"],
  },
];

function OrnamentalMark({ size = 42, className = "" }: { size?: number; className?: string }) {
  return (
    <div aria-hidden="true" className={`relative shrink-0 ${className}`} style={{ width: size, height: size }}>
      <span className="absolute inset-[12%] rotate-45 border" style={{ borderColor: INDIA_PALETTE.gold }} />
      <span className="absolute inset-[27%] rotate-45 border" style={{ borderColor: INDIA_PALETTE.maroon }} />
      <span className="absolute inset-[39%] rounded-full" style={{ background: INDIA_PALETTE.saffron }} />
      <span className="absolute top-0 left-1/2 h-[22%] w-px -translate-x-1/2" style={{ background: INDIA_PALETTE.gold }} />
      <span className="absolute bottom-0 left-1/2 h-[22%] w-px -translate-x-1/2" style={{ background: INDIA_PALETTE.gold }} />
      <span className="absolute top-1/2 left-0 h-px w-[22%] -translate-y-1/2" style={{ background: INDIA_PALETTE.gold }} />
      <span className="absolute top-1/2 right-0 h-px w-[22%] -translate-y-1/2" style={{ background: INDIA_PALETTE.gold }} />
    </div>
  );
}

function SectionKicker({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="mb-3 flex items-center justify-center gap-3 text-[9px] font-semibold tracking-[0.28em] uppercase"
      style={{ color: INDIA_PALETTE.saffron }}
    >
      <span className="h-px w-8" style={{ background: INDIA_PALETTE.gold }} />
      <span>{children}</span>
      <span className="h-px w-8" style={{ background: INDIA_PALETTE.gold }} />
    </div>
  );
}

function IndianBorder() {
  return (
    <div className="flex items-center justify-center gap-2 py-3" aria-hidden="true">
      {Array.from({ length: 9 }).map((_, index) => (
        <span
          key={index}
          className="h-1.5 w-1.5 rotate-45 border"
          style={{ borderColor: index === 4 ? INDIA_PALETTE.saffron : INDIA_PALETTE.gold }}
        />
      ))}
    </div>
  );
}

export default function Zora({ data, eventKey, motionData, settings, music }: ZoraProps) {
  const zoraData = useInviteData(data);
  const { getMotionProps } = useThemeAnimation(motionData);
  const animationKey = useMemo(() => getAnimationKey(motionData), [motionData]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [rsvp, setRsvp] = useState<"yes" | "no" | null>(null);
  const [wishRefreshKey, setWishRefreshKey] = useState(0);
  const wishesContainerRef = useRef<HTMLElement | null>(null);
  const [wishes] = useState("");

  const gallery = getSectionConfig(settings?.section_visibility, "gallery");
  const wishesConfig = getSectionConfig(settings?.section_visibility, "wishes");
  const { unlockedSections, setUnlockedSections } = useUnlockedSections(eventKey);

  const groomName = zoraData.groomName || zoraData.secondName || "Evin";
  const brideName = zoraData.brideName || zoraData.firstName || "Aparna";
  const coupleNames = `${brideName} & ${groomName}`;
  const monogram = zoraData.announcement?.couple?.monogram || `${brideName.charAt(0)}${groomName.charAt(0)}`;

  const announcement = zoraData.announcement?.announcement ?? {};
  const heroTitle = announcement.title || "A New Chapter Begins";
  const heroMessage = announcement.message || "Together with our families, we invite you to celebrate our wedding.";
  const familyLabel = zoraData.announcement?.couple?.familyLabel || "WITH THE BLESSINGS OF OUR FAMILIES";

  const heroImage = zoraData.heroImage || DUMMY_HERO;
  const galleryUrls = zoraData.galleryUrls?.length ? zoraData.galleryUrls : DUMMY_GALLERY;
  const functions = zoraData.eventFunctions?.length ? zoraData.eventFunctions : FALLBACK_FUNCTIONS;
  const storyItems = zoraData.story?.timeline?.length ? zoraData.story.timeline : FALLBACK_STORY;
  const dressCode = zoraData.dressCode?.length ? zoraData.dressCode : FALLBACK_DRESS;

  const primaryFunction = zoraData.primaryFunction || functions[2] || functions[0];
  const primaryDate = primaryFunction?.startTime
    ? new Date(primaryFunction.startTime)
    : primaryFunction?.date
      ? new Date(primaryFunction.date)
      : new Date("2026-11-21T10:30:00");

  const primaryDay = primaryDate.toLocaleDateString("en-US", { weekday: "long" });
  const primaryDateLabel = primaryDate.toLocaleDateString("en-US", { day: "2-digit", month: "long", year: "numeric" }).toUpperCase();
  const primaryTime = primaryDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  const primaryVenue = primaryFunction?.locationName || "The Courtyard, Jaipur";
  const rsvpDeadline = zoraData.rsvp?.deadline || "31 October 2026";
  const quote = zoraData.quote?.text || "Two hearts, two families, one beautiful beginning — and a lifetime of celebrations to come.";

  const navItems: Array<[string, string, ThemeIconName]> = [
    ["story", "Our Story", "heart"],
    ["events", "Functions", "calendar"],
    ["gallery", "Memories", "image"],
    ["dress-code", "Dress Code", "shirt"],
    ["music", "Music", "music"],
    ["wishes", "Wishes", "heart"],
    ["rsvp", "RSVP", "phone"],
  ];

  const motionFor = (delay: number) => {
    const { key: _key, ...props } = getMotionProps(delay);
    return props;
  };

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const pageStyle: CSSProperties = {
    "--animation-enabled": motionData?.animations === false ? "0" : "1",
    "--animation-style": motionData?.animation_style ?? "smooth",
    "--animation-scroll": motionData?.scroll_behavior ?? "on-scroll",
    "--animation-duration": motionData?.animation_duration ?? "1s",
    "--animation-delay": motionData?.animation_delay ?? "0ms",
    "--animation-speed": `${motionData?.animation_speed ?? 50}`,
    "--animation-loop": motionData?.animation_loop ? "1" : "0",
    background: INDIA_PALETTE.ivory,
    color: INDIA_PALETTE.deep,
    overflow: "hidden",
  } as CSSProperties;

  return (
    <main
      key={animationKey}
      className="relative mx-auto min-h-screen w-full max-w-[430px] overflow-x-hidden md:max-w-[1180px]"
      style={pageStyle}
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(200,121,37,.10) 0 1px, transparent 1px), radial-gradient(circle at 80% 70%, rgba(114,28,43,.08) 0 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 px-4 py-4 sm:px-6 md:px-10 md:py-8">
        {/* HERO */}
        <motion.section
          key={`hero-${animationKey}`}
          {...motionFor(0)}
          className="relative overflow-hidden border"
          style={{ borderColor: INDIA_PALETTE.line, background: INDIA_PALETTE.paper }}
        >
          <div
            className="absolute top-0 left-0 h-28 w-28 rounded-br-[70px] border-r border-b"
            style={{ borderColor: INDIA_PALETTE.gold, opacity: 0.55 }}
          />
          <div
            className="absolute right-0 bottom-0 h-32 w-32 rounded-tl-[80px] border-t border-l"
            style={{ borderColor: INDIA_PALETTE.gold, opacity: 0.55 }}
          />

          <div className="relative grid md:grid-cols-[1.05fr_.95fr]">
            <div className="flex flex-col justify-between px-6 pt-7 pb-8 sm:px-10 sm:pt-9 sm:pb-10 md:px-14 md:py-14">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-semibold tracking-[0.28em]" style={{ color: INDIA_PALETTE.maroon }}>
                    WEDLOCK
                  </p>
                  <p className="mt-1 text-[7px] tracking-[0.24em] uppercase" style={{ color: INDIA_PALETTE.muted }}>
                    A celebration of love
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="Open invitation menu"
                  onClick={() => setMenuOpen(true)}
                  className="rounded-full border p-2 md:hidden"
                  style={{ borderColor: INDIA_PALETTE.line, color: INDIA_PALETTE.maroon }}
                >
                  <ThemeIcon name="menu" size={18} />
                </button>
              </div>

              <div className="mt-12 md:mt-20">
                <SectionKicker>{familyLabel}</SectionKicker>
                <h1
                  className="mx-auto max-w-[570px] text-center text-[48px] leading-[.88] sm:text-[66px] md:text-left md:text-[78px]"
                  style={{ fontFamily: "var(--font-accent)", color: INDIA_PALETTE.maroon, letterSpacing: "-0.045em" }}
                >
                  {heroTitle}
                </h1>
                <div className="my-6 flex items-center gap-3 md:justify-start">
                  <span className="h-px flex-1" style={{ background: INDIA_PALETTE.gold }} />
                  <span className="text-[10px] font-semibold tracking-[0.14em]" style={{ color: INDIA_PALETTE.saffron }}>
                    {brideName} <span className="font-normal">&</span> {groomName}
                  </span>
                  <span className="h-px w-8" style={{ background: INDIA_PALETTE.gold }} />
                </div>
                <p className="max-w-[430px] text-center text-[10px] leading-5 md:text-left" style={{ color: INDIA_PALETTE.muted }}>
                  {heroMessage}
                </p>
              </div>

              <div className="mt-10 flex items-center gap-4 md:mt-16">
                <OrnamentalMark size={48} />
                <div>
                  <p className="text-[8px] font-semibold tracking-[0.2em] uppercase" style={{ color: INDIA_PALETTE.maroon }}>
                    {primaryDateLabel}
                  </p>
                  <p className="mt-1 text-[8px] tracking-[0.14em] uppercase" style={{ color: INDIA_PALETTE.muted }}>
                    {primaryVenue}
                  </p>
                </div>
              </div>
            </div>

            <div className="relative min-h-[390px] overflow-hidden md:min-h-[600px]">
              <img src={heroImage} alt={`${coupleNames} wedding`} className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(61,21,32,.03), rgba(61,21,32,.38))" }} />
              <div
                className="absolute right-5 bottom-5 left-5 border p-3 backdrop-blur-[2px]"
                style={{ borderColor: "rgba(255,253,248,.55)", background: "rgba(61,21,32,.48)" }}
              >
                <div className="flex items-center justify-between text-white">
                  <span className="text-[7px] tracking-[0.24em] uppercase">Save the date</span>
                  <span className="text-[9px]" style={{ color: "#E9C878" }}>
                    {monogram}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t px-4" style={{ borderColor: INDIA_PALETTE.line }}>
            <IndianBorder />
          </div>
        </motion.section>

        {/* DATE / VENUE */}
        <motion.section {...motionFor(0.08)} className="relative py-10 md:py-14">
          <div
            className="mx-auto grid max-w-[850px] grid-cols-1 gap-px overflow-hidden border sm:grid-cols-3"
            style={{ borderColor: INDIA_PALETTE.line, background: INDIA_PALETTE.line }}
          >
            {[
              ["calendar", primaryDay, primaryDateLabel],
              ["clock", primaryTime, "Ceremony begins"],
              ["venue", primaryVenue, "Jaipur, Rajasthan"],
            ].map(([icon, title, detail]) => (
              <div key={`${icon}-${title}`} className="bg-white/60 px-5 py-6 text-center" style={{ background: INDIA_PALETTE.paper }}>
                <div className="mb-3 flex justify-center" style={{ color: INDIA_PALETTE.saffron }}>
                  <ThemeIcon name={icon as ThemeIconName} size={20} />
                </div>
                <p className="text-[10px] font-semibold tracking-[0.13em] uppercase" style={{ color: INDIA_PALETTE.maroon }}>
                  {title}
                </p>
                <p className="mt-1 text-[8px] leading-4" style={{ color: INDIA_PALETTE.muted }}>
                  {detail}
                </p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* NAV */}
        <section className="hidden border-y md:block" style={{ borderColor: INDIA_PALETTE.line }}>
          <div className="mx-auto grid max-w-[900px] grid-cols-7">
            {navItems.map(([id, label, icon]) => (
              <button
                key={id}
                type="button"
                onClick={() => scrollTo(id)}
                className="flex min-h-[78px] flex-col items-center justify-center gap-2 border-r first:border-l"
                style={{ borderColor: INDIA_PALETTE.line, color: INDIA_PALETTE.maroon }}
              >
                <ThemeIcon name={icon} size={17} />
                <span className="text-[7px] font-semibold tracking-[0.14em] uppercase">{label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* STORY */}
        <motion.section id="story" {...motionFor(0.12)} className="py-14 md:py-20">
          <SectionKicker>Our journey</SectionKicker>
          <div className="mx-auto max-w-[920px] text-center">
            <h2
              className="text-[38px] leading-none md:text-[58px]"
              style={{ fontFamily: "var(--font-accent)", color: INDIA_PALETTE.maroon }}
            >
              From hello to forever
            </h2>
            <p className="mx-auto mt-5 max-w-[570px] text-[10px] leading-5" style={{ color: INDIA_PALETTE.muted }}>
              A little timeline of the moments that brought Aparna and Evin here — ready to turn a beautiful story into a beautiful life.
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-[1000px] gap-4 md:grid-cols-3">
            {storyItems.map((item: any, index: number) => {
              const [number, title, description] = Array.isArray(item)
                ? item
                : [item.number || `0${index + 1}`, item.title, item.description];
              return (
                <motion.article
                  key={`${number}-${title}`}
                  {...motionFor(0.18 + index * 0.08)}
                  className="relative overflow-hidden border p-6"
                  style={{
                    borderColor: INDIA_PALETTE.line,
                    background: index === 1 ? INDIA_PALETTE.maroon : INDIA_PALETTE.paper,
                    color: index === 1 ? INDIA_PALETTE.paper : INDIA_PALETTE.deep,
                  }}
                >
                  <span
                    className="text-[9px] font-semibold tracking-[0.2em]"
                    style={{ color: index === 1 ? "#E9C878" : INDIA_PALETTE.saffron }}
                  >
                    {number}
                  </span>
                  <div className="my-6 flex items-center justify-between">
                    <OrnamentalMark size={38} />
                    <ThemeIcon name={index === 1 ? "heart" : "calendar"} size={19} />
                  </div>
                  <h3 className="text-[17px] font-semibold tracking-[0.08em] uppercase">{title}</h3>
                  <p className="mt-3 text-[9px] leading-5" style={{ color: index === 1 ? "rgba(255,253,248,.75)" : INDIA_PALETTE.muted }}>
                    {description}
                  </p>
                </motion.article>
              );
            })}
          </div>
        </motion.section>

        {/* FUNCTIONS */}
        <motion.section id="events" {...motionFor(0.14)} className="border-y py-14 md:py-20" style={{ borderColor: INDIA_PALETTE.line }}>
          <SectionKicker>The celebrations</SectionKicker>
          <div className="mx-auto max-w-[920px]">
            <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <h2
                className="text-[38px] leading-none md:text-[54px]"
                style={{ fontFamily: "var(--font-accent)", color: INDIA_PALETTE.maroon }}
              >
                Wedding festivities
              </h2>
              <p className="max-w-[260px] text-[9px] leading-5 sm:text-right" style={{ color: INDIA_PALETTE.muted }}>
                Three days of rituals, music, laughter, family and all the little traditions that make an Indian wedding unforgettable.
              </p>
            </div>

            <div className="space-y-3">
              {functions.map((fn: any, index: number) => {
                const date = fn.startTime ? new Date(fn.startTime) : fn.date ? new Date(fn.date) : null;
                const dateNum = date ? String(date.getDate()).padStart(2, "0") : String(19 + index);
                const month = date ? date.toLocaleString("en-US", { month: "short" }).toUpperCase() : "NOV";
                const title = fn.title || fn.name || ["Haldi", "Mehndi & Sangeet", "Wedding Ceremony", "Reception"][index] || "Celebration";
                const location = fn.locationName || "Jaipur, Rajasthan";
                return (
                  <motion.article
                    key={fn.function_key ?? `${title}-${index}`}
                    {...motionFor(0.18 + index * 0.06)}
                    className="grid grid-cols-[64px_1fr_auto] items-center gap-4 border p-4 sm:grid-cols-[84px_1fr_auto] sm:p-5"
                    style={{
                      borderColor: INDIA_PALETTE.line,
                      background: index === 2 ? INDIA_PALETTE.maroon : INDIA_PALETTE.paper,
                      color: index === 2 ? INDIA_PALETTE.paper : INDIA_PALETTE.deep,
                    }}
                  >
                    <div
                      className="flex h-14 w-14 flex-col items-center justify-center border sm:h-16 sm:w-16"
                      style={{ borderColor: index === 2 ? "rgba(255,253,248,.35)" : INDIA_PALETTE.gold }}
                    >
                      <span className="text-[17px] leading-none font-semibold" style={{ fontFamily: "var(--font-accent)" }}>
                        {dateNum}
                      </span>
                      <span className="mt-1 text-[7px] font-semibold tracking-[0.15em]">{month}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[12px] font-semibold tracking-[0.08em] uppercase">{title}</p>
                      <p
                        className="mt-1 text-[8px] leading-4"
                        style={{ color: index === 2 ? "rgba(255,253,248,.72)" : INDIA_PALETTE.muted }}
                      >
                        {location}
                      </p>
                    </div>
                    <div style={{ color: index === 2 ? "#E9C878" : INDIA_PALETTE.saffron }}>
                      <ThemeIcon name={index === 1 ? "music" : index === 3 ? "gift" : "heart"} size={20} />
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </motion.section>

        {/* GALLERY */}
        {!gallery.hidden && (
          <motion.section id="gallery" {...motionFor(0.16)} className="py-14 md:py-20">
            <SectionKicker>Little moments</SectionKicker>
            <div className="mx-auto max-w-[920px]">
              <div className="flex flex-col items-center text-center">
                <h2
                  className="text-[38px] leading-none md:text-[54px]"
                  style={{ fontFamily: "var(--font-accent)", color: INDIA_PALETTE.maroon }}
                >
                  A glimpse of us
                </h2>
                <p className="mt-4 max-w-[460px] text-[9px] leading-5" style={{ color: INDIA_PALETTE.muted }}>
                  A visual chapter of the people, places and moments leading to our wedding day.
                </p>
              </div>
              <div className="mt-9">
                <GallerySection
                  animationKey={animationKey}
                  getMotionProps={getMotionProps}
                  layout={zoraData.galleryLayout || "masonry"}
                  urls={galleryUrls}
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

        {/* QUOTE / GRAPHICAL PANEL */}
        <motion.section
          {...motionFor(0.18)}
          className="relative overflow-hidden border py-14 text-center sm:py-20"
          style={{ borderColor: INDIA_PALETTE.line, background: INDIA_PALETTE.maroon }}
        >
          <div
            className="absolute top-1/2 left-1/2 h-[260px] w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full border opacity-20"
            style={{ borderColor: "#E9C878" }}
          />
          <div
            className="absolute top-1/2 left-1/2 h-[205px] w-[205px] -translate-x-1/2 -translate-y-1/2 rotate-45 border opacity-20"
            style={{ borderColor: "#E9C878" }}
          />
          <div className="relative mx-auto max-w-[680px] px-6">
            <OrnamentalMark size={58} className="mx-auto" />
            <p
              className="mt-6 text-[25px] leading-8 sm:text-[32px] sm:leading-10"
              style={{ fontFamily: "var(--font-accent)", color: INDIA_PALETTE.paper }}
            >
              “{quote}”
            </p>
            <p className="mt-6 text-[8px] font-semibold tracking-[0.25em] uppercase" style={{ color: "#E9C878" }}>
              {coupleNames}
            </p>
          </div>
        </motion.section>

        {/* DRESS CODE */}
        <motion.section id="dress-code" {...motionFor(0.18)} className="py-14 md:py-20">
          <SectionKicker>Come dressed to celebrate</SectionKicker>
          <div className="mx-auto max-w-[920px]">
            <div className="text-center">
              <h2
                className="text-[38px] leading-none md:text-[54px]"
                style={{ fontFamily: "var(--font-accent)", color: INDIA_PALETTE.maroon }}
              >
                Festive, colourful, you
              </h2>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {dressCode.map((dress: any, index: number) => (
                <article
                  key={`${dress.title}-${index}`}
                  className="border p-6 text-center"
                  style={{ borderColor: INDIA_PALETTE.line, background: INDIA_PALETTE.paper }}
                >
                  <div className="flex justify-center gap-3">
                    {(dress.hexColors || []).map((color: string, colorIndex: number) => (
                      <span
                        key={`${color}-${colorIndex}`}
                        className="h-8 w-8 rounded-full border-2 border-white shadow-sm"
                        style={{ background: color }}
                        title={color}
                      />
                    ))}
                  </div>
                  <h3 className="mt-6 text-[12px] font-semibold tracking-[0.1em] uppercase" style={{ color: INDIA_PALETTE.maroon }}>
                    {dress.title}
                  </h3>
                  <p className="mx-auto mt-3 max-w-[330px] text-[9px] leading-5" style={{ color: INDIA_PALETTE.muted }}>
                    {dress.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </motion.section>

        {/* MUSIC */}
        <motion.section id="music" {...motionFor(0.18)} className="border-y py-14 md:py-20" style={{ borderColor: INDIA_PALETTE.line }}>
          <SectionKicker>Set the mood</SectionKicker>
          <div className="mx-auto max-w-[620px] text-center">
            <h2
              className="text-[38px] leading-none md:text-[52px]"
              style={{ fontFamily: "var(--font-accent)", color: INDIA_PALETTE.maroon }}
            >
              A soundtrack for us
            </h2>
            <p className="mx-auto mt-4 max-w-[430px] text-[9px] leading-5" style={{ color: INDIA_PALETTE.muted }}>
              Press play and let the celebration begin. Your invitation music is powered by the event data and can be changed from the
              editor.
            </p>
            <div className="mt-8 text-left">
              <AudioPlayer
                src={music?.background_audio ?? ""}
                name={music?.background_audio_name ?? "Our Wedding Song"}
                cover={galleryUrls[1] || heroImage}
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

        {/* WISHES */}
        {!wishesConfig.hidden && (
          <div id="wishes" className="py-2">
            <WishesSection
              animationKey={animationKey}
              getMotionProps={getMotionProps}
              eventKey={eventKey}
              wishesRaw={zoraData.wishesRaw}
              wishesContainerRef={wishesContainerRef}
              wishRefreshKey={wishRefreshKey}
              setWishRefreshKey={setWishRefreshKey}
              title={zoraData.wishesTitle ?? "Leave a little love"}
              isIcon={false}
              isProtected={wishesConfig.protected}
              password={wishesConfig.password}
              unlockedSections={unlockedSections}
              setUnlockedSections={setUnlockedSections}
            />
          </div>
        )}

        {/* RSVP */}
        <motion.section id="rsvp" {...motionFor(0.2)} className="py-14 md:py-20">
          <div
            className="mx-auto max-w-[680px] border p-6 text-center sm:p-10"
            style={{ borderColor: INDIA_PALETTE.gold, background: INDIA_PALETTE.paper }}
          >
            <OrnamentalMark size={48} className="mx-auto" />
            <SectionKicker>Will you join us?</SectionKicker>
            <h2
              className="text-[38px] leading-none md:text-[52px]"
              style={{ fontFamily: "var(--font-accent)", color: INDIA_PALETTE.maroon }}
            >
              Kindly RSVP
            </h2>
            <p className="mx-auto mt-4 max-w-[420px] text-[9px] leading-5" style={{ color: INDIA_PALETTE.muted }}>
              We would love to celebrate this new beginning with you. Please let us know by{" "}
              <strong style={{ color: INDIA_PALETTE.maroon }}>{rsvpDeadline}</strong>.
            </p>
            <div className="mx-auto mt-8 grid max-w-[460px] grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRsvp("yes")}
                className="flex items-center justify-center gap-2 border py-3 text-[8px] font-semibold tracking-[0.16em] uppercase"
                style={{
                  borderColor: INDIA_PALETTE.maroon,
                  background: rsvp === "yes" ? INDIA_PALETTE.maroon : "transparent",
                  color: rsvp === "yes" ? INDIA_PALETTE.paper : INDIA_PALETTE.maroon,
                }}
              >
                <ThemeIcon name="check" size={14} /> Joyfully accept
              </button>
              <button
                type="button"
                onClick={() => setRsvp("no")}
                className="flex items-center justify-center gap-2 border py-3 text-[8px] font-semibold tracking-[0.16em] uppercase"
                style={{
                  borderColor: INDIA_PALETTE.line,
                  background: rsvp === "no" ? INDIA_PALETTE.maroon : "transparent",
                  color: rsvp === "no" ? INDIA_PALETTE.paper : INDIA_PALETTE.muted,
                }}
              >
                <ThemeIcon name="close" size={14} /> Regretfully decline
              </button>
            </div>
            <button
              type="button"
              className="mt-5 border px-8 py-3 text-[8px] font-semibold tracking-[0.2em] uppercase"
              style={{ borderColor: INDIA_PALETTE.saffron, color: INDIA_PALETTE.maroon }}
            >
              Continue to RSVP
            </button>
          </div>
        </motion.section>

        {/* FOOTER */}
        <motion.footer
          {...motionFor(0.22)}
          className="relative overflow-hidden border-t px-6 py-12 text-center md:px-12 md:py-16"
          style={{ borderColor: INDIA_PALETTE.line }}
        >
          <div className="mx-auto max-w-[820px]">
            <div className="flex items-center justify-center gap-4">
              <OrnamentalMark size={38} />
              <div className="text-[28px]" style={{ fontFamily: "var(--font-accent)", color: INDIA_PALETTE.maroon }}>
                {coupleNames}
              </div>
              <OrnamentalMark size={38} />
            </div>
            <p className="mt-5 text-[8px] font-semibold tracking-[0.28em] uppercase" style={{ color: INDIA_PALETTE.saffron }}>
              WEDLOCK · {new Date().getFullYear()}
            </p>
            <p className="mx-auto mt-4 max-w-[440px] text-[9px] leading-5" style={{ color: INDIA_PALETTE.muted }}>
              Thank you for being part of our story. We cannot wait to laugh, dance, pray, eat and celebrate with you.
            </p>
            <div className="mt-8 flex justify-center gap-5" style={{ color: INDIA_PALETTE.maroon }}>
              <span
                aria-label="Instagram"
                className="flex h-8 w-8 items-center justify-center rounded-full border"
                style={{ borderColor: INDIA_PALETTE.line }}
              >
                ◎
              </span>
              <span
                aria-label="WhatsApp"
                className="flex h-8 w-8 items-center justify-center rounded-full border"
                style={{ borderColor: INDIA_PALETTE.line }}
              >
                ◌
              </span>
              <span
                aria-label="Share"
                className="flex h-8 w-8 items-center justify-center rounded-full border"
                style={{ borderColor: INDIA_PALETTE.line }}
              >
                ↗
              </span>
            </div>
            <div className="mt-9 border-t pt-6" style={{ borderColor: INDIA_PALETTE.line }}>
              <p className="text-[7px] tracking-[0.18em] uppercase" style={{ color: INDIA_PALETTE.muted }}>
                {monogram} · {brideName} &amp; {groomName} · WEDLOCK
              </p>
            </div>
          </div>
        </motion.footer>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-50 mx-auto w-full max-w-[430px] md:hidden"
          style={{ background: INDIA_PALETTE.maroon, color: INDIA_PALETTE.paper }}
        >
          <div className="flex items-center justify-between px-6 py-7">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.25em]">WEDLOCK</p>
              <p className="mt-1 text-[7px] tracking-[0.2em] uppercase" style={{ color: "#E9C878" }}>
                {coupleNames}
              </p>
            </div>
            <button type="button" onClick={() => setMenuOpen(false)} aria-label="Close invitation menu">
              <ThemeIcon name="close" size={25} />
            </button>
          </div>
          <div className="px-6">
            <IndianBorder />
          </div>
          <nav className="flex flex-col px-9 pt-4">
            {navItems.map(([id, label, icon]) => (
              <button
                key={id}
                type="button"
                onClick={() => scrollTo(id)}
                className="flex items-center gap-4 border-b py-4 text-left text-[9px] font-semibold tracking-[0.2em] uppercase"
                style={{ borderColor: "rgba(255,253,248,.16)" }}
              >
                <span style={{ color: "#E9C878" }}>
                  <ThemeIcon name={icon} size={16} />
                </span>
                {label}
              </button>
            ))}
          </nav>
          <div
            className="absolute right-0 bottom-8 left-0 text-center text-[7px] tracking-[0.25em] uppercase"
            style={{ color: "rgba(255,253,248,.55)" }}
          >
            {monogram} · WEDLOCK
          </div>
        </div>
      )}
    </main>
  );
}
