"use client";

import React, { useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useThemeAnimation } from "../../../../../hooks/useThemeAnimations";
import { useInviteData } from "../../../../../hooks/useInviteData";
import { getAnimationKey } from "../../../../../utils/animation";
import WeddingCalendar from "../../../../../components/ui/WeddingCalendar";
import GallerySection from "../components/common/GallerySection";
import { getSectionConfig } from "../../../../../utils/section-visibility";
import { useUnlockedSections } from "../../../../../hooks/useUnlockedSections";
import WishesSection from "../components/common/WishesSection";
import AudioPlayer from "../../../../../components/ui/AudioPlayer";

interface IrisProps {
  data: any;
  eventKey: string;
  motionData: any;
  settings: any;
  music?: any;
}

// Unsplash photography matching high-fashion editorial aesthetics
const DEFAULT_HERO = "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85";
const DEFAULT_PORTRAIT_1 = "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80";
const DEFAULT_PORTRAIT_2 = "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80";
const PAPER_TEXTURE = "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80";

/* Editorial Vector Icons */
const SparkleIcon = ({ className = "w-5 h-5", color = "currentColor" }) => (
  <svg className={className} viewBox="0 0 24 24" fill={color}>
    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
  </svg>
);

const CalendarIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2V6M8 2V6M3 10H21" />
  </svg>
);

const ClockIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="9" />
    <polyline points="12 7 12 12 15 15" />
  </svg>
);

const MapPinIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 21C16 16.5 19 12.2426 19 9C19 5.13401 15.866 2 12 2C8.13401 2 5 5.13401 5 9C5 12.2426 8 16.5 12 21Z" />
    <circle cx="12" cy="9" r="2.5" />
  </svg>
);

const MenuIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <line x1="3" y1="8" x2="21" y2="8" />
    <line x1="3" y1="16" x2="21" y2="16" />
  </svg>
);

const CloseIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export default function Iris({ data, eventKey, motionData, settings, music }: IrisProps) {
  const IrisData = useInviteData(data);
  const { getMotionProps } = useThemeAnimation(motionData);
  const animationKey = useMemo(() => getAnimationKey(motionData), [motionData]);

  const [menuOpen, setMenuOpen] = useState(false);
  const [rsvpStatus, setRsvpStatus] = useState<"yes" | "no" | null>(null);
  const [wishRefreshKey, setWishRefreshKey] = useState(0);
  const { unlockedSections, setUnlockedSections } = useUnlockedSections(eventKey);

  // Dynamic names with Evin & Aparna as fallback
  const brideName = IrisData.brideName || IrisData.firstName || "Aparna";
  const groomName = IrisData.groomName || IrisData.secondName || "Evin";
  const heroImage = IrisData.heroImage || DEFAULT_HERO;

  const gallery = getSectionConfig(settings?.section_visibility, "gallery");
  const wishes = getSectionConfig(settings?.section_visibility, "wishes");

  const functions = IrisData.eventFunctions?.length
    ? IrisData.eventFunctions
    : [
        { title: "Haldi & Mehndi", date: "2026-11-14", locationName: "The Courtyard Garden", time: "10:00 AM" },
        { title: "Sangeet Night", date: "2026-11-15", locationName: "The Crystal Ballroom", time: "7:00 PM" },
        { title: "Holy Matrimony", date: "2026-11-16", locationName: "St. Andrews Sanctuary", time: "4:00 PM" },
        { title: "Grand Reception", date: "2026-11-16", locationName: "Grand Palace Hotel", time: "7:30 PM" },
      ];

  const primaryFunction = IrisData.primaryFunction || functions[2] || functions[0];
  const primaryDate = primaryFunction?.date ? new Date(primaryFunction.date) : new Date("2026-11-16");

  const primaryDay = primaryDate.toLocaleDateString("en-US", { weekday: "long" });
  const primaryFormattedDate = primaryDate.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }).toUpperCase();
  const primaryVenue = primaryFunction?.locationName || "Taj Falaknuma Palace";

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
      key={animationKey}
      className="relative mx-auto min-h-screen w-full max-w-[430px] overflow-x-hidden bg-[#ECE8E1] font-serif text-[#23211E] md:max-w-[1100px]"
      style={
        {
          "--animation-enabled": motionData?.animations === false ? "0" : "1",
          "--animation-style": motionData?.animation_style ?? "smooth",
          "--animation-scroll": motionData?.scroll_behavior ?? "on-scroll",
          "--animation-duration": motionData?.animation_duration ?? "1s",
        } as CSSProperties
      }
    >
      {/* VINTAGE PAPER TEXTURE OVERLAY */}
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-cover bg-center opacity-[0.04]"
        style={{ backgroundImage: `url(${PAPER_TEXTURE})` }}
      />

      {/* HEADER / NAVIGATION */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-[#DCD5CB] bg-[#ECE8E1]/90 px-6 py-4 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="font-sans text-[9px] font-medium tracking-[0.3em] text-[#5A544B] uppercase">
            BY {groomName} & {brideName}
          </span>
        </div>

        <nav className="hidden items-center gap-8 font-sans text-[11px] tracking-[0.2em] text-[#5A544B] md:flex">
          <button onClick={() => scrollTo("about")} className="transition-colors hover:text-[#23211E]">
            ABOUT
          </button>
          <button onClick={() => scrollTo("schedule")} className="transition-colors hover:text-[#23211E]">
            EVENTS
          </button>
          <button onClick={() => scrollTo("gallery")} className="transition-colors hover:text-[#23211E]">
            GALLERY
          </button>
          <button onClick={() => scrollTo("rsvp")} className="transition-colors hover:text-[#23211E]">
            RSVP
          </button>
        </nav>

        <button aria-label="Toggle Menu" onClick={() => setMenuOpen(!menuOpen)} className="p-1 text-[#23211E] md:hidden">
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </header>

      {/* SECTION 1: HERO (Replicating Hyphenated Big Typography "Micro-blading" Layout) */}
      <motion.section
        key={`hero-${animationKey}`}
        {...motionFor(0)}
        className="relative overflow-hidden px-5 pt-8 pb-12 md:px-12 md:pt-14 md:pb-20"
      >
        <div className="mx-auto max-w-[1000px]">
          {/* Top Label */}
          <div className="mb-2 flex items-center justify-between">
            <span className="font-sans text-[10px] tracking-[0.25em] text-[#736B60] uppercase">#WEDDING FOREVER</span>
            <span className="font-sans text-[10px] tracking-[0.2em] text-[#736B60] uppercase">{primaryFormattedDate}</span>
          </div>

          {/* Large Editorial Hyphenated Title */}
          <div className="relative">
            <h1 className="font-serif text-[58px] leading-[0.88] font-normal tracking-tight text-[#23211E] md:text-[110px]">
              Wed– <br />
              ding.
            </h1>

            {/* Floating Dark Olive Badge */}
            <div className="absolute top-2 right-12 flex items-center gap-1.5 rounded-full bg-[#444D3C] px-4 py-2 font-sans text-[9px] tracking-[0.2em] text-white uppercase shadow-md md:right-48">
              <SparkleIcon className="h-2.5 w-2.5 fill-current" />
              Evin & Aparna
            </div>

            {/* Main Portrait Collage Stack */}
            <div className="relative mt-6 grid grid-cols-12 items-start gap-2">
              <div className="col-span-8 h-[280px] overflow-hidden rounded-sm shadow-md md:col-span-9 md:h-[420px]">
                <img src={heroImage} alt="Bride & Groom" className="h-full w-full object-cover object-center" />
              </div>

              {/* Offset Small Photo Overlay */}
              <div className="z-10 col-span-4 mt-12 -ml-4 h-[140px] overflow-hidden rounded-sm border-2 border-[#ECE8E1] shadow-lg md:col-span-3 md:h-[220px]">
                <img src={DEFAULT_PORTRAIT_1} alt="Couple Moment" className="h-full w-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* SECTION 2: EDITORIAL QUOTE BLOCK (Replicating "Brow perfection, one hair stroke at a time.") */}
      <motion.section
        id="about"
        key={`about-${animationKey}`}
        {...motionFor(0.1)}
        className="relative border-y border-[#DCD5CB] bg-[#E3DDD4] px-5 py-14 md:px-12 md:py-20"
      >
        <div className="mx-auto max-w-[900px]">
          <p className="mb-3 font-sans text-[10px] tracking-[0.25em] text-[#736B60] uppercase">ABOUT OUR UNION</p>
          <h2 className="mb-8 max-w-[700px] font-serif text-3xl leading-tight font-normal text-[#23211E] italic md:text-5xl">
            Two lives, two hearts, joined in <span className="font-normal not-italic">everlasting promise.</span>
          </h2>

          <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-12">
            {/* White Floating Card */}
            <div className="rounded-sm border border-[#DCD5CB] bg-[#F5F2EC] p-6 shadow-sm md:col-span-6">
              <p className="mb-3 font-serif text-lg text-[#23211E] italic">
                "You are our highest priority — we're here to celebrate love and look forward to having you with us!"
              </p>
              <p className="font-sans text-[11px] leading-relaxed text-[#5A544B]">
                With joyful hearts, {groomName} and {brideName} request the honour of your presence as they exchange vows and step into a
                new chapter of togetherness.
              </p>
            </div>

            {/* Secondary Photo Box */}
            <div className="h-[220px] overflow-hidden rounded-sm shadow-sm md:col-span-6">
              <img src={DEFAULT_PORTRAIT_2} alt="Evin & Aparna portrait" className="h-full w-full object-cover" />
            </div>
          </div>
        </div>
      </motion.section>

      {/* SECTION 3: TREND HEADER (Replicating "Hottest brow trend" Section) */}
      <motion.section id="schedule" key={`events-${animationKey}`} {...motionFor(0.12)} className="px-5 py-16 md:px-12 md:py-24">
        <div className="mx-auto max-w-[1000px]">
          {/* Big Header */}
          <div className="mb-10">
            <h2 className="font-serif text-[48px] leading-[0.9] font-normal text-[#23211E] md:text-[80px]">
              Main <br />
              <span className="font-light text-[#444D3C] italic">events</span> trend.
            </h2>
          </div>

          {/* Numbered Event Block 01 */}
          <div className="space-y-12">
            {functions.map((fn: any, idx: number) => {
              const eventDate = fn.date ? new Date(fn.date) : new Date();
              const dateStr = eventDate.toLocaleDateString("en-US", { month: "short", day: "2-digit" }).toUpperCase();

              return (
                <motion.div
                  key={idx}
                  {...motionFor(0.15 + idx * 0.05)}
                  className="grid grid-cols-1 items-center gap-6 rounded-sm border border-[#DCD5CB] bg-[#F5F2EC] p-6 shadow-sm md:grid-cols-12 md:p-8"
                >
                  {/* Numbering */}
                  <div className="md:col-span-2">
                    <span className="font-serif text-4xl font-light text-[#736B60] md:text-5xl">0{idx + 1}</span>
                  </div>

                  {/* Details */}
                  <div className="md:col-span-7">
                    <h3 className="mb-2 font-serif text-2xl text-[#23211E]">{fn.title}</h3>
                    <p className="mb-4 font-sans text-[12px] leading-relaxed text-[#5A544B]">
                      Join us for an unforgettable gathering filled with music, warmth, and celebration at {fn.locationName || primaryVenue}
                      .
                    </p>

                    <div className="grid grid-cols-2 gap-4 border-t border-[#DCD5CB] pt-3 font-sans text-[11px] text-[#736B60]">
                      <div>
                        <span className="block text-[9px] tracking-wider text-[#A0988C] uppercase">Date</span>
                        <span className="font-medium text-[#23211E]">{dateStr}</span>
                      </div>
                      <div>
                        <span className="block text-[9px] tracking-wider text-[#A0988C] uppercase">Time</span>
                        <span className="font-medium text-[#23211E]">{fn.time || "4:00 PM"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Olive Button */}
                  <div className="text-left md:col-span-3 md:text-right">
                    <button
                      onClick={() => scrollTo("rsvp")}
                      className="inline-block rounded-full bg-[#444D3C] px-5 py-3 font-sans text-[10px] tracking-[0.2em] text-white uppercase transition-colors hover:bg-[#2F3629]"
                    >
                      Attend Event
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* WEDDING CALENDAR SECTION */}
      <section className="border-t border-[#DCD5CB] bg-[#E3DDD4] px-5 py-12 md:px-12">
        <div className="mx-auto max-w-[450px] text-center">
          <p className="mb-2 font-sans text-[10px] tracking-[0.25em] text-[#736B60] uppercase">Save The Date</p>
          <h3 className="mb-6 font-serif text-2xl text-[#23211E] italic">
            {primaryDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </h3>
          <div className="rounded-sm border border-[#DCD5CB] bg-[#F5F2EC] p-4 shadow-sm">
            <WeddingCalendar year={primaryDate.getFullYear()} month={primaryDate.getMonth()} selectedDate={primaryDate.getDate()} />
          </div>
        </div>
      </section>

      {/* SECTION 4: FAQ / EXPECTATIONS (Replicating "What should I expect from the service?") */}
      <section className="bg-[#ECE8E1] px-5 py-16 md:px-12 md:py-20">
        <div className="mx-auto max-w-[900px]">
          <h2 className="mb-8 font-serif text-3xl text-[#23211E] md:text-4xl">
            What should I expect <br />
            <span className="font-light italic">from the celebration?</span>
          </h2>

          <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-12">
            {/* Green Dark Box Note */}
            <div className="rounded-sm bg-[#444D3C] p-6 text-white shadow-md md:col-span-5">
              <span className="mb-2 block font-sans text-[9px] tracking-[0.2em] uppercase opacity-70">Important Note</span>
              <p className="font-sans text-[12px] leading-relaxed">
                We kindly request our guests to arrive 15 minutes prior to ceremony start times. Traditional or formal evening attire is
                encouraged.
              </p>
            </div>

            {/* Checklist */}
            <div className="space-y-4 font-serif text-lg text-[#23211E] md:col-span-7">
              <div className="flex items-center justify-between border-b border-[#DCD5CB] pb-3">
                <span>1. Welcome Drinks & Reception</span>
                <span className="font-sans text-[11px] text-[#736B60]">4:00 PM</span>
              </div>
              <div className="flex items-center justify-between border-b border-[#DCD5CB] pb-3">
                <span>2. Holy Vows & Garland Exchange</span>
                <span className="font-sans text-[11px] text-[#736B60]">5:15 PM</span>
              </div>
              <div className="flex items-center justify-between border-b border-[#DCD5CB] pb-3">
                <span>3. Dinner & Toasting</span>
                <span className="font-sans text-[11px] text-[#736B60]">7:30 PM</span>
              </div>
              <div className="flex items-center justify-between border-b border-[#DCD5CB] pb-3">
                <span>4. Music & Dancing</span>
                <span className="font-sans text-[11px] text-[#736B60]">Late Night</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY SECTION */}
      {!gallery.hidden && (
        <section id="gallery" className="border-t border-[#DCD5CB] bg-[#F5F2EC] px-5 py-12 md:px-12">
          <GallerySection
            animationKey={animationKey}
            getMotionProps={getMotionProps}
            layout={IrisData.galleryLayout}
            urls={IrisData.galleryUrls}
            fallback={heroImage}
            title="Captured Moments"
            isProtected={gallery.protected}
            password={gallery.password}
            unlockedSections={unlockedSections}
            setUnlockedSections={setUnlockedSections}
          />
        </section>
      )}

      {/* MUSIC AUDIO PLAYER SECTION */}
      {music?.background_audio && (
        <section className="border-y border-[#DCD5CB] bg-[#E3DDD4] px-5 py-8">
          <div className="mx-auto max-w-[500px] text-center">
            <p className="mb-2 font-sans text-[10px] tracking-[0.2em] text-[#736B60] uppercase">Background Score</p>
            <AudioPlayer
              src={music.background_audio}
              name={music?.background_audio_name ?? "Celebration Melody"}
              cover={DEFAULT_PORTRAIT_1}
              variant={music?.audio_player_variant || "minimal"}
              allowMute={music?.allow_mute ?? true}
              loop={music?.loop_music ?? true}
              fadeIn={music?.fade_in ?? false}
              fadeOut={music?.fade_out ?? false}
              volume={music?.volume_level ?? 60}
            />
          </div>
        </section>
      )}

      {/* WISHES SECTION */}
      {!wishes.hidden && (
        <section className="bg-[#ECE8E1] px-5 py-12">
          <WishesSection
            animationKey={animationKey}
            getMotionProps={getMotionProps}
            eventKey={eventKey}
            wishesRaw={IrisData.wishesRaw}
            wishesContainerRef={useRef<HTMLElement | null>(null)}
            wishRefreshKey={wishRefreshKey}
            setWishRefreshKey={setWishRefreshKey}
            title={IrisData.wishesTitle ?? "Send Your Blessings"}
            isIcon={false}
            isProtected={wishes.protected}
            password={wishes.password}
            unlockedSections={unlockedSections}
            setUnlockedSections={setUnlockedSections}
          />
        </section>
      )}

      {/* RSVP SECTION */}
      <motion.section
        id="rsvp"
        key={`rsvp-${animationKey}`}
        {...motionFor(0.15)}
        className="bg-[#444D3C] px-5 py-16 text-center text-white md:px-12 md:py-24"
      >
        <div className="mx-auto max-w-[500px]">
          <SparkleIcon className="mx-auto mb-3 h-6 w-6 fill-current text-[#DCD5CB]" />
          <h2 className="mb-2 font-serif text-3xl font-normal md:text-4xl">Kindly Confirm Attendance</h2>
          <p className="mb-8 font-sans text-[11px] font-light tracking-wider text-[#DCD5CB] uppercase">
            Please respond by October 15, 2026
          </p>

          <div className="mb-6 grid grid-cols-2 gap-4">
            <button
              onClick={() => setRsvpStatus("yes")}
              className={`border px-4 py-3 font-sans text-[11px] tracking-[0.2em] uppercase transition-all ${
                rsvpStatus === "yes"
                  ? "border-white bg-white text-[#444D3C]"
                  : "border-white/30 bg-transparent text-white hover:border-white"
              }`}
            >
              Accepts With Joy
            </button>
            <button
              onClick={() => setRsvpStatus("no")}
              className={`border px-4 py-3 font-sans text-[11px] tracking-[0.2em] uppercase transition-all ${
                rsvpStatus === "no"
                  ? "border-white bg-white text-[#444D3C]"
                  : "border-white/30 bg-transparent text-white hover:border-white"
              }`}
            >
              Declines With Regret
            </button>
          </div>

          <button className="w-full bg-[#E3DDD4] py-3.5 font-sans text-[11px] font-medium tracking-[0.25em] text-[#23211E] uppercase transition-colors hover:bg-white">
            Send RSVP
          </button>
        </div>
      </motion.section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-[#23211E] px-6 py-12 text-center font-sans text-[#A0988C]">
        <div className="mx-auto max-w-[600px]">
          <p className="mb-2 text-[11px] tracking-[0.3em] text-white/80 uppercase">
            {groomName} & {brideName}
          </p>
          <p className="mb-6 text-[10px] tracking-widest text-white/40 uppercase">{primaryFormattedDate}</p>
          <div className="mx-auto mb-6 h-px w-12 bg-white/20" />
          <p className="text-[9px] tracking-wider text-white/30">© 2026 ALL RIGHTS RESERVED. DESIGNED FOR CELEBRATION.</p>
        </div>
      </footer>

      {/* MOBILE FULL-SCREEN NAVIGATION */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-50 flex flex-col justify-between bg-[#ECE8E1] p-8 md:hidden"
          >
            <div className="flex items-center justify-between border-b border-[#DCD5CB] pb-4">
              <span className="font-sans text-[10px] tracking-[0.2em] text-[#23211E] uppercase">
                {groomName} & {brideName}
              </span>
              <button onClick={() => setMenuOpen(false)} aria-label="Close menu">
                <CloseIcon />
              </button>
            </div>

            <nav className="my-auto flex flex-col items-center gap-6 font-serif text-2xl text-[#23211E]">
              <button onClick={() => scrollTo("about")} className="hover:italic">
                About
              </button>
              <button onClick={() => scrollTo("schedule")} className="hover:italic">
                Events
              </button>
              <button onClick={() => scrollTo("gallery")} className="hover:italic">
                Gallery
              </button>
              <button onClick={() => scrollTo("rsvp")} className="hover:italic">
                RSVP
              </button>
            </nav>

            <div className="border-t border-[#DCD5CB] pt-4 text-center">
              <p className="font-sans text-[10px] tracking-[0.2em] text-[#736B60] uppercase">{primaryFormattedDate}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
