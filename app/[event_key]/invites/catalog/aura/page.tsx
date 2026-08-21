"use client";

import { useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

// Custom Hooks & Utilities
import { useThemeAnimation } from "../../../../../hooks/useThemeAnimations";
import { useInviteData } from "../../../../../hooks/useInviteData";
import { getAnimationKey } from "../../../../../utils/animation";
import { getSectionConfig } from "../../../../../utils/section-visibility";
import { useUnlockedSections } from "../../../../../hooks/useUnlockedSections";

// Core Components
import WeddingCalendar from "../../../../../components/ui/WeddingCalendar";
import GallerySection from "../components/common/GallerySection";
import WishesSection from "../components/common/WishesSection";
import AudioPlayer from "../../../../../components/ui/AudioPlayer";
import { THEME_COLORS } from "../../core/core/themeColors";
import { ThemeIcon, type ThemeIconName } from "../../core/core/themeIcons";
import { THEME_TYPOGRAPHY } from "../../core/core/themeTypography";

interface AuraProps {
  data: any;
  eventKey: string;
  motionData: any;
  settings: any;
  music?: any;
}

const DUMMY_HERO = "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85";

export default function Aura({ data, eventKey, motionData, settings, music }: AuraProps) {
  const auraData = useInviteData(data);
  const { getMotionProps } = useThemeAnimation(design?.motion);
  const animationKey = useMemo(() => getAnimationKey(design?.motion), [design?.motion]);

  // Scroll Progress References for Complex Parallax
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Parallax Mechanics
  const heroImageScale = useTransform(scrollYProgress, [0, 0.25], [1, 1.15]);
  const heroParallaxY = useTransform(scrollYProgress, [0, 0.3], ["0%", "25%"]);
  const floatBadgeY = useTransform(scrollYProgress, [0, 0.5], ["0px", "-120px"]);
  const auraOrbRotate = useTransform(scrollYProgress, [0, 1], [0, 360]);

  // Interactive States
  const [activeTab, setActiveTab] = useState<"story" | "events" | "details">("events");
  const [rsvp, setRsvp] = useState<"yes" | "no" | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [wishRefreshKey, setWishRefreshKey] = useState(0);
  const wishesContainerRef = useRef<HTMLElement | null>(null);

  // Content Hooks
  const firstName = auraData.firstName || auraData.brideName || "Ananya";
  const secondName = auraData.secondName || auraData.groomName || "Ritvik";
  const heroImage = auraData.heroImage || DUMMY_HERO;

  const gallery = getSectionConfig(settings?.section_visibility, "gallery");
  const wishes = getSectionConfig(settings?.section_visibility, "wishes");
  const { unlockedSections, setUnlockedSections } = useUnlockedSections(eventKey);

  const functions = auraData.eventFunctions?.length
    ? auraData.eventFunctions
    : [
        { title: "Mehndi", date: "2025-11-14", locationName: "Friday, 3:00 PM onwards" },
        { title: "Sangeet", date: "2025-11-15", locationName: "Saturday, 6:00 PM onwards" },
        { title: "Wedding", date: "2025-11-16", locationName: "Sunday, 6:00 PM onwards" },
        { title: "Reception", date: "2025-11-16", locationName: "Sunday, 8:30 PM onwards" },
      ];

  const motionFor = (delay: number) => {
    const { key: _key, ...props } = getMotionProps(delay);
    return props;
  };

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main
      ref={containerRef}
      key={animationKey}
      className="relative min-h-screen w-full overflow-x-hidden bg-[#0d0d11] font-sans text-slate-100 selection:bg-amber-400 selection:text-black"
    >
      {/* BACKGROUND ATMOSPHERIC ORBS (PARALLAX ROTATING) */}
      <motion.div
        style={{ rotate: auraOrbRotate }}
        className="pointer-events-none fixed -top-40 -left-40 z-0 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-amber-500/10 via-rose-500/10 to-transparent blur-[120px]"
      />
      <motion.div
        style={{ rotate: auraOrbRotate }}
        className="pointer-events-none fixed -right-40 -bottom-40 z-0 h-[700px] w-[700px] rounded-full bg-gradient-to-tl from-purple-600/10 via-amber-500/10 to-transparent blur-[140px]"
      />

      {/* FLOATING GLASS NAVIGATION BAR */}
      <nav className="fixed inset-x-4 top-4 z-50 mx-auto flex max-w-4xl items-center justify-between rounded-full border border-white/10 bg-black/40 px-6 py-3 shadow-2xl backdrop-blur-xl">
        <span className="text-sm font-light tracking-[0.3em] text-amber-200 uppercase">
          {auraData.announcement?.couple?.monogram || `${firstName[0]} + ${secondName[0]}`}
        </span>

        <div className="hidden items-center gap-6 text-xs tracking-widest text-slate-300 md:flex">
          <button onClick={() => scrollTo("events")} className="transition-colors hover:text-amber-300">
            EVENTS
          </button>
          <button onClick={() => scrollTo("gallery")} className="transition-colors hover:text-amber-300">
            GALLERY
          </button>
          <button onClick={() => scrollTo("wishes")} className="transition-colors hover:text-amber-300">
            WISHES
          </button>
          <button onClick={() => scrollTo("rsvp")} className="transition-colors hover:text-amber-300">
            RSVP
          </button>
        </div>

        <button onClick={() => setMenuOpen(!menuOpen)} className="rounded-full p-1 text-amber-200 md:hidden">
          <ThemeIcon name={menuOpen ? "close" : "menu"} size={22} />
        </button>
      </nav>

      {/* MOBILE MENU DROPDOWN */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 flex flex-col gap-6 bg-black/95 px-8 pt-24 text-center text-lg font-light tracking-widest backdrop-blur-2xl"
          >
            <button onClick={() => scrollTo("events")} className="border-b border-white/10 py-2">
              EVENTS
            </button>
            <button onClick={() => scrollTo("gallery")} className="border-b border-white/10 py-2">
              GALLERY
            </button>
            <button onClick={() => scrollTo("music")} className="border-b border-white/10 py-2">
              MUSIC
            </button>
            <button onClick={() => scrollTo("wishes")} className="border-b border-white/10 py-2">
              WISHES
            </button>
            <button onClick={() => scrollTo("rsvp")} className="border-b border-white/10 py-2">
              RSVP
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO SECTION: MODERN EDITORIAL COVER */}
      <section className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-end px-4 pt-28 pb-16 md:px-12">
        <div className="absolute inset-0 top-20 mx-4 overflow-hidden rounded-3xl border border-white/10 md:mx-12">
          <motion.img
            style={{ scale: heroImageScale, y: heroParallaxY }}
            src={heroImage}
            alt="Hero Background"
            className="h-full w-full object-cover brightness-[0.65] contrast-[1.05] filter"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d11] via-[#0d0d11]/40 to-transparent" />
        </div>

        {/* HERO CONTENT OVERLAY */}
        <div className="relative z-10 max-w-3xl px-4 pb-8 md:pb-16">
          <motion.div
            {...motionFor(0)}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-500/10 px-3 py-1 text-xs tracking-[0.25em] text-amber-200 uppercase backdrop-blur-md"
          >
            <span>✨</span> {auraData.announcement?.couple?.familyLabel || "Together with families"}
          </motion.div>

          <motion.h1
            {...motionFor(0.1)}
            className="mb-6 text-5xl leading-none font-extralight tracking-tight text-white sm:text-7xl md:text-8xl"
          >
            {firstName} <span className="font-serif text-amber-300 italic">&amp;</span> {secondName}
          </motion.h1>

          <motion.p {...motionFor(0.2)} className="max-w-xl text-sm leading-relaxed font-light tracking-wide text-slate-300 md:text-base">
            {auraData.announcement?.announcement?.message || "Join us as we write our next chapter in love, celebration, and joy."}
          </motion.p>
        </div>

        {/* FLOATING CALENDAR BADGE */}
        <motion.div
          style={{ y: floatBadgeY }}
          className="absolute right-8 bottom-12 z-20 hidden w-80 rounded-2xl border border-white/15 bg-white/5 p-6 shadow-2xl backdrop-blur-2xl lg:block"
        >
          <WeddingCalendar
            year={functions[0]?.date ? new Date(functions[0].date).getFullYear() : 2025}
            month={functions[0]?.date ? new Date(functions[0].date).getMonth() : 10}
            selectedDate={functions[0]?.date ? new Date(functions[0].date).getDate() : 16}
          />
        </motion.div>
      </section>

      {/* DUAL-COLUMN INTERACTIVE CONTENT STREAM */}
      <section id="events" className="relative z-10 mx-auto max-w-7xl px-4 py-16 md:px-12">
        {/* TABS CONTROLLER */}
        <div className="mb-12 flex items-center justify-center gap-2 border-b border-white/10 pb-4">
          {(["events", "story", "details"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-full px-6 py-2.5 text-xs font-medium tracking-widest uppercase transition-all ${
                activeTab === tab
                  ? "bg-amber-300 text-black shadow-lg shadow-amber-300/20"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* TAB PANELS */}
        <div className="min-h-[400px]">
          {activeTab === "events" && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {functions.map((fn: any, i: number) => (
                <div
                  key={i}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all hover:border-amber-300/40 hover:bg-white/[0.07]"
                >
                  <div className="mb-6 flex items-start justify-between">
                    <div>
                      <span className="font-mono text-xs tracking-widest text-amber-300/80 uppercase">
                        {fn.date ? new Date(fn.date).toDateString() : `DAY 0${i + 1}`}
                      </span>
                      <h3 className="mt-1 text-2xl font-light text-white">{fn.title}</h3>
                    </div>
                    <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-amber-300">
                      <ThemeIcon name={i % 2 === 0 ? "calendar" : "music"} size={20} />
                    </div>
                  </div>
                  <p className="text-sm text-slate-400">{fn.locationName || "Taj Falaknuma Palace"}</p>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === "story" && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-2xl space-y-8">
              {[
                { title: "First Met", date: "May 2018", text: "A chance encounter that turned into endless hours of conversation." },
                { title: "The Proposal", date: "Dec 2023", text: "Under a sky of stars, a promise for forever was made." },
              ].map((item, idx) => (
                <div key={idx} className="relative flex items-start gap-6 border-l-2 border-amber-300/30 pl-6">
                  <div className="absolute top-1 -left-[9px] h-4 w-4 rounded-full bg-amber-300 shadow-md shadow-amber-300/50" />
                  <div>
                    <span className="font-mono text-xs text-amber-300 uppercase">{item.date}</span>
                    <h4 className="mt-1 text-xl font-light text-white">{item.title}</h4>
                    <p className="mt-2 text-sm text-slate-400">{item.text}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === "details" && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {[
                { title: "Accommodation", info: "Recommended luxury hotels nearby", icon: "venue" },
                { title: "Transportation", icon: "car", info: "Airport transfer shuttles available" },
                { title: "Valet Parking", icon: "info", info: "Complimentary valet on premises" },
              ].map((det, i) => (
                <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                  <div className="mb-4 text-amber-300">
                    <ThemeIcon name={det.icon as ThemeIconName} size={24} />
                  </div>
                  <h4 className="text-base font-light text-white">{det.title}</h4>
                  <p className="mt-2 text-xs leading-relaxed text-slate-400">{det.info}</p>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* GALLERY SECTION */}
      {!gallery.hidden && (
        <section id="gallery" className="relative z-10 mx-auto max-w-7xl px-4 py-16 md:px-12">
          <GallerySection
            animationKey={animationKey}
            getMotionProps={getMotionProps}
            layout={auraData.galleryLayout}
            urls={auraData.galleryUrls}
            fallback={auraData.heroImage}
            title="Moments"
            isProtected={gallery.protected}
            password={gallery.password}
            unlockedSections={unlockedSections}
            setUnlockedSections={setUnlockedSections}
          />
        </section>
      )}

      {/* MUSIC AUDIO PLAYER */}
      <section id="music" className="relative z-10 mx-auto max-w-3xl px-4 py-12">
        <AudioPlayer
          src={data?.music?.background_audio ?? ""}
          name={data?.music?.background_audio_name ?? "Atmospheric Soundtrack"}
          variant={data?.music?.audio_player_variant}
          allowMute={data?.music?.allow_mute ?? true}
          loop={data?.music?.loop_music ?? true}
          fadeIn={data?.music?.fade_in ?? false}
          fadeOut={data?.music?.fade_out ?? false}
          volume={data?.music?.volume_level ?? 60}
        />
      </section>

      {/* WISHES SECTION */}
      {!wishes.hidden && (
        <section id="wishes" className="relative z-10 mx-auto max-w-5xl px-4 py-16 md:px-12">
          <WishesSection
            animationKey={animationKey}
            getMotionProps={getMotionProps}
            eventKey={eventKey}
            wishesRaw={auraData.wishesRaw}
            wishesContainerRef={wishesContainerRef}
            wishRefreshKey={wishRefreshKey}
            setWishRefreshKey={setWishRefreshKey}
            title={auraData.wishesTitle ?? "Guestbook"}
            isIcon={false}
            isProtected={wishes.protected}
            password={wishes.password}
            unlockedSections={unlockedSections}
            setUnlockedSections={setUnlockedSections}
          />
        </section>
      )}

      {/* MODERN GLASS RSVP SECTION */}
      <section id="rsvp" className="relative z-10 mx-auto max-w-2xl px-4 py-20 text-center">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-8 shadow-2xl backdrop-blur-2xl md:p-12">
          <span className="font-mono text-xs tracking-widest text-amber-300 uppercase">RSVP</span>
          <h2 className="mt-2 mb-4 text-3xl font-extralight text-white md:text-4xl">Will You Join Us?</h2>
          <p className="mx-auto mb-8 max-w-md text-xs text-slate-400">
            Please respond by October 15, 2025 so we can prepare for your presence.
          </p>

          <div className="mx-auto mb-6 flex max-w-xs gap-4">
            <button
              onClick={() => setRsvp("yes")}
              className={`flex-1 rounded-xl border py-3 text-xs tracking-widest uppercase transition-all ${
                rsvp === "yes"
                  ? "border-amber-300 bg-amber-300 font-semibold text-black shadow-lg shadow-amber-300/20"
                  : "border-white/20 text-white hover:bg-white/5"
              }`}
            >
              Attending
            </button>
            <button
              onClick={() => setRsvp("no")}
              className={`flex-1 rounded-xl border py-3 text-xs tracking-widest uppercase transition-all ${
                rsvp === "no"
                  ? "border-rose-500 bg-rose-500 font-semibold text-white shadow-lg shadow-rose-500/20"
                  : "border-white/20 text-slate-400 hover:bg-white/5"
              }`}
            >
              Regrets
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/10 py-12 text-center text-xs tracking-widest text-slate-500 uppercase">
        <p>
          © 2025 {firstName} &amp; {secondName}. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
