"use client";

import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useThemeAnimation } from "../../../../../hooks/useThemeAnimations";
import { useInviteData } from "../../../../../hooks/useInviteData";
import { getAnimationKey } from "../../../../../utils/animation";
import WeddingCalendar from "../../../../../components/ui/WeddingCalendar";
import GallerySection from "../components/common/GallerySection";
import { getSectionConfig } from "../../../../../utils/section-visibility";
import { useUnlockedSections } from "../../../../../hooks/useUnlockedSections";
import WishesSection from "../components/common/WishesSection";

interface LunaProps {
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

/*
 * Theme tokens are supplied by Catalog through CSS custom properties.
 */
const COLORS = {
  page: "var(--bg-primary, #f8f3eb)",
  paper: "var(--bg-secondary, #fcf8f1)",

  /* Highlight and Accent colors derived dynamically */
  burgundy: "var(--accent, var(--text-primary, #5b1117))",
  burgundy2: "var(--color-accent, #74171e)",
  gold: "var(--accent, #a17b50)",

  text: "var(--text-primary, #3f302a)",
  muted: "var(--text-secondary, #8c7b6e)",
  line: "color-mix(in srgb, var(--text-primary, #3f302a) 14%, transparent)",

  /* Dark background fallback shade */
  dark: "color-mix(in srgb, var(--color-accent, #5b1117) 92%, #000 8%)",
};

function Icon({ name, size = 22 }: { name: string; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  const paths: Record<string, React.ReactNode> = {
    calendar: (
      <>
        <rect x="3" y="4.5" width="18" height="16" rx="1.5" />
        <path d="M7 2.8v4M17 2.8v4M3 9h18M8 13h.01M12 13h.01M16 13h.01M8 17h.01M12 17h.01M16 17h.01" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    venue: (
      <>
        <path d="M4 21V9l8-5 8 5v12M2.5 21h19M7 21v-7h3v7M14 21v-7h3v7M8 9h.01M12 9h.01M16 9h.01" />
      </>
    ),
    heart: <path d="M20.8 8.8c0 5.2-8.8 10-8.8 10S3.2 14 3.2 8.8A4.8 4.8 0 0 1 12 6.2a4.8 4.8 0 0 1 8.8 2.6Z" />,
    image: (
      <>
        <rect x="3" y="4" width="18" height="16" rx="1.5" />
        <circle cx="8.5" cy="9" r="1.5" />
        <path d="m21 16-5-5-7 7-3-3-3 3" />
      </>
    ),
    music: (
      <>
        <path d="M9 18V5l10-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="16" cy="16" r="3" />
      </>
    ),
    phone: (
      <path d="M7.2 3.5 5 4.8c-.9.5-1.3 1.6-1 2.6 2 6.5 6.1 10.6 12.6 12.6 1 .3 2.1-.1 2.6-1l1.3-2.2-4.2-2.2-1.6 2c-2.5-1.1-4.4-3-5.5-5.5l2-1.6-2-4.2Z" />
    ),
    gift: (
      <>
        <rect x="3" y="10" width="18" height="11" rx="1" />
        <path d="M12 10v11M2 10h20M5 6.5c0-1.4 1.1-2.5 2.5-2.5C10 4 12 8 12 10H7.5A2.5 2.5 0 0 1 5 7.5V6.5ZM19 6.5c0-1.4-1.1-2.5-2.5-2.5C14 4 12 8 12 10h4.5A2.5 2.5 0 0 0 19 7.5V6.5Z" />
      </>
    ),
    shirt: (
      <>
        <path d="m8 4 4 2 4-2 4 3-2 4-2-1v10H8V10l-2 1-2-4 4-3Z" />
      </>
    ),
    map: (
      <>
        <path d="M3 6.5 8 4l8 3 5-2.5V18l-5 2.5-8-3L3 20V6.5Z" />
        <path d="M8 4v13.5M16 7v13.5" />
      </>
    ),
    info: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 10v6M12 7h.01" />
      </>
    ),
    chevron: <path d="m9 6 6 6-6 6" />,
    menu: (
      <>
        <path d="M4 7h16M4 12h16M4 17h16" />
      </>
    ),
    play: <path d="m9 6 10 6-10 6V6Z" fill="currentColor" stroke="none" />,
    pause: (
      <>
        <path d="M8 6v12M16 6v12" strokeWidth="2" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    close: (
      <>
        <path d="m6 6 12 12M18 6 6 18" />
      </>
    ),
    car: (
      <>
        <path d="m5 17-1-5 2-5h12l2 5-1 5M4 12h16M7 17h.01M17 17h.01M6 7l-1 5h14l-1-5" />
      </>
    ),
  };

  return <svg {...common}>{paths[name] ?? paths.info}</svg>;
}

function SectionTitle({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <div className="mb-7 text-center">
      <h2
        className="text-[21px] tracking-[0.08em]"
        style={{
          color: dark ? COLORS.paper : COLORS.text,
          fontFamily: "var(--font-heading, var(--font-accent))",
        }}
      >
        {children}
      </h2>
      <div className="mt-2 flex items-center justify-center gap-2" style={{ color: COLORS.gold }}>
        <span className="h-px w-7 bg-current" />
        <span className="text-[12px]">❧</span>
        <span className="h-px w-7 bg-current" />
      </div>
    </div>
  );
}

export default function Luna({ data, eventKey, motionData, settings }: LunaProps) {
  const LunaData = useInviteData(data);
  const { getMotionProps } = useThemeAnimation(motionData);
  const animationKey = useMemo(() => getAnimationKey(motionData), [motionData]);
  const [wishRefreshKey, setWishRefreshKey] = useState(0);
  const wishesContainerRef = useRef<HTMLElement | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
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

  const navItems = [
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

  return (
    <main
      key={animationKey}
      className="relative mx-auto min-h-screen w-full max-w-[430px] overflow-x-hidden"
      style={{
        background: COLORS.page,
        backgroundImage: "var(--bg-image, none)",
        backgroundPosition: "var(--bg-position, center)",
        backgroundSize: "var(--bg-size, cover)",
        color: COLORS.text,
        fontFamily: "var(--font-body, var(--font-primary))",
        boxShadow: "0 0 50px rgba(40,20,10,.08)",
      }}
    >
      {/* BACKGROUND PHOTO OVERLAY */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-white" style={{ opacity: "var(--bg-overlay-opacity, 0)" }} />

      <div className="relative z-10">
        {/* TOP / HERO */}
        <section className="relative px-5 pt-7 pb-9">
          <header className="mb-7 flex items-center justify-between">
            <div className="text-[20px] tracking-[0.25em]" style={{ color: COLORS.burgundy }}>
              {LunaData.announcement?.couple?.monogram}
            </div>

            <button
              aria-label="Open menu"
              onClick={() => setMenuOpen(true)}
              className="rounded-full p-1"
              style={{ color: COLORS.burgundy }}
            >
              <Icon name="menu" size={28} />
            </button>
          </header>

          <div className="text-center">
            <p className="mb-4 text-[8px] font-medium tracking-[0.24em]" style={{ color: COLORS.text }}>
              {LunaData.announcement?.couple?.familyLabel}
            </p>

            <h1
              className="text-[49px] leading-[.88]"
              style={{
                color: COLORS.burgundy,
                fontFamily: "var(--font-accent)",
                fontWeight: 400,
              }}
            >
              {LunaData.announcement?.announcement?.title}
            </h1>

            <div className="my-5 flex items-center justify-center gap-3">
              <span className="h-px w-12" style={{ background: COLORS.line }} />
              <span className="text-[11px] tracking-[0.28em]" style={{ color: COLORS.gold }}>
                {firstName.toUpperCase()} &amp; {secondName.toUpperCase()}
              </span>
              <span className="h-px w-12" style={{ background: COLORS.line }} />
            </div>

            <motion.div {...motionFor(0.15)} className="overflow-hidden">
              <img
                src={heroImage}
                alt="Wedding couple"
                className="h-[238px] w-full object-cover"
                style={{ filter: "grayscale(100%) contrast(.92)" }}
              />
            </motion.div>

            <div className="my-4 flex items-center justify-center gap-2 text-[8px] tracking-[0.16em]">
              <span style={{ color: COLORS.gold }}>❧</span>
              <span>{LunaData.announcement?.announcement?.message}</span>
              <span style={{ color: COLORS.gold }}>❧</span>
            </div>
          </div>
          <WeddingCalendar
            year={functions[0]?.date ? new Date(functions[0].date).getFullYear() : 2025}
            month={functions[0]?.date ? new Date(functions[0].date).getMonth() : 10}
            selectedDate={functions[0]?.date ? new Date(functions[0].date).getDate() : 16}
          />

          {/* MAIN DETAILS */}
          <div className="mt-4 grid grid-cols-3 rounded-[9px] border p-4" style={{ borderColor: COLORS.line, background: COLORS.paper }}>
            {[
              ["calendar", "SUNDAY", "16 NOV 2025"],
              ["clock", "6:00 PM", "ONWARDS"],
              ["venue", "TAJ FALAKNUMA", "PALACE • HYDERABAD"],
            ].map(([icon, a, b]) => (
              <div key={a} className="text-center">
                <div className="mb-2 flex justify-center" style={{ color: COLORS.gold }}>
                  <Icon name={icon} size={23} />
                </div>
                <p className="text-[7px] font-semibold tracking-[0.1em]">{a}</p>
                <p className="mt-1 text-[6.5px] leading-3" style={{ color: COLORS.muted }}>
                  {b}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* NAV GRID */}
        <section className="hidden px-5 pb-4">
          <div className="grid grid-cols-3 border-t border-l" style={{ borderColor: COLORS.line }}>
            {navItems.map(([id, label, icon]) => (
              <button
                key={id}
                onClick={() => scrollTo(id === "dress" ? "dress-code" : id === "gift" ? "gift-registry" : id)}
                className="flex min-h-[76px] flex-col items-center justify-center gap-2 border-r border-b"
                style={{ borderColor: COLORS.line, color: COLORS.text }}
              >
                <span style={{ color: COLORS.gold }}>
                  <Icon name={icon} size={22} />
                </span>
                <span className="text-[7px] tracking-[0.1em]">{label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* OUR STORY */}
        <section id="story" className="px-5 py-8">
          <SectionTitle>OUR STORY</SectionTitle>
          <div className="relative">
            <div className="absolute top-5 right-5 left-5 h-px" style={{ background: COLORS.line }} />
            <div className="grid grid-cols-4 gap-2 text-center">
              {[
                ["♡", "WE MET", "12 MAY 2018"],
                ["☕", "FIRST DATE", "02 JUNE 2018"],
                ["♢", "SHE SAID YES", "24 DEC 2023"],
                ["♡", "FOREVER STARTS", "16 NOV 2025"],
              ].map(([icon, title, date]) => (
                <div key={title} className="relative">
                  <div
                    className="relative z-10 mx-auto flex h-10 w-10 items-center justify-center rounded-full border"
                    style={{ borderColor: COLORS.line, background: COLORS.page, color: COLORS.gold }}
                  >
                    {icon}
                  </div>
                  <p className="mt-3 text-[6.5px] font-semibold tracking-[0.08em]">{title}</p>
                  <p className="mt-1 text-[5.8px]" style={{ color: COLORS.muted }}>
                    {date}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={() => alert("Full story can be connected to your CMS/content editor.")}
            className="mx-auto mt-7 block border px-7 py-3 text-[7px] tracking-[0.16em]"
            style={{ borderColor: COLORS.burgundy, color: COLORS.burgundy }}
          >
            READ OUR STORY
          </button>
        </section>

        {/* GALLERY */}
        <section id="gallery" className="px-5 py-8">
          <SectionTitle>GALLERY</SectionTitle>
          <div className="grid grid-cols-3 gap-2">
            {DUMMY_GALLERY.map((src, i) => (
              <motion.img
                {...motionFor(i * 0.05)}
                key={src}
                src={src}
                alt={`Wedding gallery ${i + 1}`}
                className={`h-[112px] w-full object-cover ${i === 0 ? "row-span-2 h-full" : ""}`}
                style={{ filter: i === 1 ? "grayscale(100%)" : "none" }}
              />
            ))}
          </div>
          <button className="mx-auto mt-5 block border px-7 py-3 text-[7px] tracking-[0.16em]" style={{ borderColor: COLORS.gold }}>
            VIEW FULL GALLERY
          </button>
        </section>
        {!gallery.hidden && (
          <GallerySection
            animationKey={animationKey}
            getMotionProps={getMotionProps}
            layout={LunaData.galleryLayout}
            urls={LunaData.galleryUrls}
            fallback={LunaData.heroImage}
            title="Gallery"
            textColor="accent"
            fontSize="accent"
            fontFamily="accent"
            isProtected={gallery.protected}
            password={gallery.password}
            unlockedSections={unlockedSections}
            setUnlockedSections={setUnlockedSections}
          />
        )}
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
            textColor="accent"
            fontSize="accent"
            fontFamily="accent"
            isIcon={false}
            isProtected={wishes.protected}
            password={wishes.password}
            unlockedSections={unlockedSections}
            setUnlockedSections={setUnlockedSections}
          />
        )}

        {/* MUSIC */}
        <section id="music" className="px-5 py-8">
          <SectionTitle>MUSIC</SectionTitle>
          <div className="rounded-[8px] border p-3" style={{ borderColor: COLORS.line, background: COLORS.paper }}>
            <div className="flex items-center gap-3">
              <img src={DUMMY_GALLERY[2]} alt="Music cover" className="h-14 w-14 object-cover" />
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold">Better Together</p>
                <p className="mt-1 text-[8px]" style={{ color: COLORS.muted }}>
                  Jack Johnson
                </p>
                <div className="mt-3 h-px w-full" style={{ background: COLORS.line }} />
                <div className="mt-1 flex justify-between text-[6px]" style={{ color: COLORS.muted }}>
                  <span>00:45</span>
                  <span>03:50</span>
                </div>
              </div>
              <button
                onClick={() => setPlaying((v) => !v)}
                className="flex h-11 w-11 items-center justify-center rounded-full"
                style={{ background: COLORS.burgundy, color: COLORS.paper }}
                aria-label={playing ? "Pause music" : "Play music"}
              >
                <Icon name={playing ? "pause" : "play"} size={19} />
              </button>
            </div>
            <p className="mt-4 text-center text-[7px] tracking-[0.08em]" style={{ color: COLORS.gold }}>
              ♡ ADD THIS SONG TO YOUR WISHES
            </p>
          </div>
        </section>

        {/* EVENTS */}
        <section id="events" className="px-5 py-8">
          <SectionTitle>WEDDING FUNCTIONS</SectionTitle>
          <div className="space-y-2">
            {functions.map((fn: any, i: number) => {
              const fallbackDates = ["14", "15", "16", "16"];
              const dateNum = fn.date ? new Date(fn.date).getDate() : fallbackDates[i];
              const month = fn.date ? new Date(fn.date).toLocaleString("en-US", { month: "short" }).toUpperCase() : "NOV";
              return (
                <div key={fn.function_key ?? i} className="flex items-center gap-3 border-b py-2.5" style={{ borderColor: COLORS.line }}>
                  <div
                    className="flex h-11 w-11 shrink-0 flex-col items-center justify-center text-center"
                    style={{ background: COLORS.burgundy, color: COLORS.paper }}
                  >
                    <span className="text-[16px]" style={{ fontFamily: "var(--font-accent)" }}>
                      {dateNum}
                    </span>
                    <span className="text-[6px] tracking-[0.12em]">{month}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[9px] font-semibold tracking-[0.08em] uppercase">{fn.title}</p>
                    <p className="mt-1 text-[7px]" style={{ color: COLORS.muted }}>
                      {fn.locationName || "Taj Falaknuma Palace"}
                    </p>
                  </div>
                  <span style={{ color: COLORS.gold }}>
                    <Icon name={i === 1 ? "music" : i === 3 ? "gift" : "heart"} size={20} />
                  </span>
                </div>
              );
            })}
          </div>
          <button className="mx-auto mt-5 block border px-7 py-3 text-[7px] tracking-[0.16em]" style={{ borderColor: COLORS.gold }}>
            VIEW ALL EVENTS
          </button>
        </section>

        {/* DRESS CODE */}
        <section id="dress-code" className="px-5 py-9">
          <SectionTitle>DRESS CODE</SectionTitle>
          <div className="flex justify-center gap-5">
            {["#67171b", "#b28a56", "#1f3048", "#687054", "#aa7b75"].map((c) => (
              <span key={c} className="h-9 w-9 rounded-full border border-white shadow-sm" style={{ background: c }} />
            ))}
          </div>
          <p className="mt-5 text-center text-[8px] tracking-[0.16em]">ETHNIC FORMAL</p>
          <button
            className="mx-auto mt-4 flex items-center gap-2 border px-6 py-3 text-[7px] tracking-[0.16em]"
            style={{ borderColor: COLORS.line }}
          >
            <Icon name="shirt" size={14} /> STYLE GUIDE
          </button>
        </section>

        {/* WISHES */}
        <section id="wishes" className="px-5 py-9" style={{ background: COLORS.paper }}>
          <SectionTitle>LEAVE YOUR WISHES</SectionTitle>
          <p className="mx-auto mb-6 max-w-[250px] text-center text-[8px] leading-4" style={{ color: COLORS.muted }}>
            Your kind words and blessings mean the world to us.
          </p>
          <div className="space-y-3">
            <input
              placeholder="Your Name"
              className="w-full border bg-transparent px-4 py-3 text-[8px] outline-none"
              style={{ borderColor: COLORS.line }}
            />
            <input
              placeholder="Your Email"
              className="w-full border bg-transparent px-4 py-3 text-[8px] outline-none"
              style={{ borderColor: COLORS.line }}
            />
            <textarea
              ref={wishesRef}
              value={wish}
              onChange={(e) => setWish(e.target.value)}
              placeholder="Write your wishes..."
              rows={5}
              className="w-full resize-none border bg-transparent px-4 py-3 text-[8px] outline-none"
              style={{ borderColor: COLORS.line }}
            />
            <button
              onClick={() => {
                setWishSent(true);
                setWish("");
              }}
              className="mx-auto block px-8 py-3 text-[7px] tracking-[0.16em]"
              style={{ background: COLORS.burgundy, color: COLORS.paper }}
            >
              {wishSent ? "WISH SENT ♥" : "SEND WISHES ♥"}
            </button>
          </div>
          <button className="mx-auto mt-5 block text-[7px] tracking-[0.15em]" style={{ color: COLORS.gold }}>
            SEE ALL WISHES →
          </button>
        </section>

        {/* RSVP */}
        <section id="rsvp" className="px-5 py-9">
          <SectionTitle>KINDLY RSVP</SectionTitle>
          <p className="mx-auto max-w-[245px] text-center text-[8px] leading-4" style={{ color: COLORS.muted }}>
            We request the pleasure of your response by <strong>15 October 2025.</strong>
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              onClick={() => setRsvp("yes")}
              className="flex items-center justify-center gap-2 rounded-full border py-3 text-[7px] tracking-[0.13em]"
              style={{
                borderColor: COLORS.burgundy,
                background: rsvp === "yes" ? COLORS.burgundy : "transparent",
                color: rsvp === "yes" ? COLORS.paper : COLORS.burgundy,
              }}
            >
              <Icon name="check" size={14} /> ACCEPTS
            </button>
            <button
              onClick={() => setRsvp("no")}
              className="flex items-center justify-center gap-2 rounded-full border py-3 text-[7px] tracking-[0.13em]"
              style={{
                borderColor: COLORS.line,
                background: rsvp === "no" ? COLORS.burgundy : "transparent",
                color: rsvp === "no" ? COLORS.paper : COLORS.muted,
              }}
            >
              <Icon name="close" size={14} /> REGRETS
            </button>
          </div>
          <button className="mx-auto mt-5 block border px-8 py-3 text-[7px] tracking-[0.16em]" style={{ borderColor: COLORS.gold }}>
            RSVP NOW
          </button>
        </section>

        {/* DETAILS */}
        <section id="details" className="px-5 py-9" style={{ background: COLORS.paper }}>
          <SectionTitle>THE DETAILS</SectionTitle>
          <div className="divide-y" style={{ borderColor: COLORS.line }}>
            {[
              ["venue", "ACCOMMODATION", "View recommended hotels"],
              ["car", "TRANSPORTATION", "Airport pickup & local travel"],
              ["calendar", "PARKING", "Valet parking available"],
              ["info", "FAQS", "Find answers to common questions"],
            ].map(([icon, title, text]) => (
              <button key={title} className="flex w-full items-center gap-4 py-4 text-left" style={{ borderColor: COLORS.line }}>
                <span style={{ color: COLORS.gold }}>
                  <Icon name={icon} size={22} />
                </span>
                <span className="flex-1">
                  <span className="block text-[8px] font-semibold tracking-[0.08em]">{title}</span>
                  <span className="mt-1 block text-[7px]" style={{ color: COLORS.muted }}>
                    {text}
                  </span>
                </span>
                <span style={{ color: COLORS.gold }}>
                  <Icon name="chevron" size={15} />
                </span>
              </button>
            ))}
          </div>
          <button className="mx-auto mt-5 block border px-7 py-3 text-[7px] tracking-[0.16em]" style={{ borderColor: COLORS.gold }}>
            VIEW ALL DETAILS
          </button>
        </section>

        {/* GIFT REGISTRY */}
        <section id="gift-registry" className="px-5 py-9 text-center">
          <SectionTitle>GIFT REGISTRY</SectionTitle>
          <p className="mx-auto max-w-[260px] text-[8px] leading-4" style={{ color: COLORS.muted }}>
            Your presence is our greatest gift.
            <br />
            If you wish to bless us, here are our preferred options.
          </p>
          <button
            className="mx-auto mt-5 flex items-center gap-2 border px-7 py-3 text-[7px] tracking-[0.16em]"
            style={{ borderColor: COLORS.gold }}
          >
            <Icon name="gift" size={15} /> VIEW REGISTRY
          </button>
        </section>

        {/* QUOTE / FOOTER */}
        <section className="relative overflow-hidden px-6 py-16 text-center" style={{ background: COLORS.dark, color: COLORS.paper }}>
          <img
            src={heroImage}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-25"
            style={{ filter: "grayscale(100%)" }}
          />
          <div className="relative">
            <p className="mx-auto max-w-[260px] text-[17px] leading-6" style={{ fontFamily: "var(--font-accent)" }}>
              The best thing to hold onto in life is each other.
            </p>
            <div className="mt-3 text-[14px]" style={{ color: COLORS.gold }}>
              ♥
            </div>
          </div>
        </section>

        <footer className="px-6 pt-9 pb-8 text-center" style={{ background: COLORS.paper }}>
          <div className="text-[28px] tracking-[0.25em]" style={{ color: COLORS.burgundy }}>
            {LunaData.announcement?.couple?.monogram}
          </div>
          <div className="mt-2 text-[10px]" style={{ color: COLORS.gold }}>
            ❧
          </div>
          <p className="mt-4 text-[8px] tracking-[0.17em]">CAN'T WAIT TO CELEBRATE WITH YOU!</p>
          <div className="mt-6 flex justify-center gap-6" style={{ color: COLORS.burgundy }}>
            <span aria-label="Instagram">◎</span>
            <span aria-label="Facebook">f</span>
            <span aria-label="WhatsApp">◌</span>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-y-3 text-left text-[7px] tracking-[0.08em]" style={{ color: COLORS.muted }}>
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

          <div className="mt-8 border-t pt-5 text-[6px] tracking-[0.08em]" style={{ borderColor: COLORS.line, color: COLORS.muted }}>
            © 2025 {firstName} &amp; {secondName}. ALL RIGHTS RESERVED.
          </div>
        </footer>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div className="fixed inset-0 z-50 mx-auto w-full max-w-[430px]" style={{ background: COLORS.burgundy }}>
            <div className="flex items-center justify-between px-6 py-7" style={{ color: COLORS.paper }}>
              <div className="text-[20px] tracking-[0.25em]">{LunaData.announcement?.couple?.monogram}</div>
              <button onClick={() => setMenuOpen(false)} aria-label="Close menu">
                <Icon name="close" size={27} />
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
                  className="border-b py-5 text-[10px] tracking-[0.25em]"
                  style={{ borderColor: "rgba(255,255,255,.18)", color: COLORS.paper }}
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
