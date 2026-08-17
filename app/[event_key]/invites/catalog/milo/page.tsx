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

interface MiloProps {
  data: any;
  eventKey: string;
  motionData: any;
  settings: any;
  music?: any;
}

// Default high-resolution imagery for creative editorial feel
const DEFAULT_HERO = "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=85";
const DEFAULT_COUPLE_1 = "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80";
const DEFAULT_COUPLE_2 = "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80";
const DEFAULT_TEXTURE = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80";

/* SVG Vector Icons for Luxury Mediterranean/Editorial Vibe */
const CompassRoseIcon = ({ className = "w-6 h-6", color = "currentColor" }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" stroke={color} strokeWidth="2">
    <circle cx="50" cy="50" r="45" strokeOpacity="0.3" />
    <circle cx="50" cy="50" r="38" strokeOpacity="0.15" />
    <path d="M50 5 L50 95 M5 50 L95 50" strokeOpacity="0.25" />
    <polygon points="50,10 55,45 90,50 55,55 50,90 45,55 10,50 45,45" fill={color} fillOpacity="0.8" />
    <polygon points="50,25 53,47 75,50 53,53 50,75 47,53 25,50 47,47" fill="#FFF" />
  </svg>
);

const ArchIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M4 21V10C4 5.58172 7.58172 2 12 2C16.4183 2 20 5.58172 20 10V21" />
    <path d="M2 21H22" />
  </svg>
);

const CalendarIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="4" width="18" height="18" rx="2" strokeWidth="1.5" />
    <path d="M16 2V6M8 2V6M3 10H21" />
  </svg>
);

const ClockIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="9" />
    <polyline points="12 7 12 12 15 15" />
  </svg>
);

const MapPinIcon = ({ className = "w-5 h-5" }) => (
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

export default function Milo({ data, eventKey, motionData, settings, music }: MiloProps) {
  // Access data hooks following Luna specifications
  const inviteData = useInviteData(data);
  const { getMotionProps } = useThemeAnimation(motionData);
  const animationKey = useMemo(() => getAnimationKey(motionData), [motionData]);

  const [menuOpen, setMenuOpen] = useState(false);
  const [rsvpStatus, setRsvpStatus] = useState<"yes" | "no" | null>(null);
  const [wishRefreshKey, setWishRefreshKey] = useState(0);
  const { unlockedSections, setUnlockedSections } = useUnlockedSections(eventKey);

  // Dynamic content resolution with Evin & Aparna as fallback
  const brideName = inviteData.brideName || inviteData.firstName || "Aparna";
  const groomName = inviteData.groomName || inviteData.secondName || "Evin";
  const heroImage = inviteData.heroImage || DEFAULT_HERO;

  const gallery = getSectionConfig(settings?.section_visibility, "gallery");
  const wishes = getSectionConfig(settings?.section_visibility, "wishes");

  const functions = inviteData.eventFunctions?.length
    ? inviteData.eventFunctions
    : [
        { title: "Sangeet & Cocktails", date: "2026-11-14", locationName: "The Ionian Lawn, Sunset Terrace", time: "6:00 PM" },
        { title: "Haldi & Mehndi", date: "2026-11-15", locationName: "Olive Grove Courtyard", time: "10:00 AM" },
        { title: "Holy Matrimony", date: "2026-11-16", locationName: "St. Nicholas Cliffside Chapel", time: "4:00 PM" },
        { title: "Grand Reception", date: "2026-11-16", locationName: "Villa Bella Vista Ballroom", time: "7:30 PM" },
      ];

  const primaryFunction = inviteData.primaryFunction || functions[2] || functions[0];
  const primaryDate = primaryFunction?.date ? new Date(primaryFunction.date) : new Date("2026-11-16");

  const primaryDay = primaryDate.toLocaleDateString("en-US", { weekday: "long" });
  const primaryFormattedDate = primaryDate.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }).toUpperCase();
  const primaryVenue = primaryFunction?.locationName || "Ionian Coast, Greece";

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
      className="relative mx-auto min-h-screen w-full max-w-[430px] overflow-x-hidden bg-[#FBF9F5] font-serif text-[#2C3238] md:max-w-[1100px]"
      style={
        {
          "--animation-enabled": motionData?.animations === false ? "0" : "1",
          "--animation-style": motionData?.animation_style ?? "smooth",
          "--animation-scroll": motionData?.scroll_behavior ?? "on-scroll",
          "--animation-duration": motionData?.animation_duration ?? "1s",
        } as CSSProperties
      }
    >
      {/* GLOBAL ARCHITECTURAL BACKGROUND TEXTURE */}
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-cover bg-center opacity-[0.03]"
        style={{ backgroundImage: `url(${DEFAULT_TEXTURE})` }}
      />

      {/* HEADER / NAVIGATION BAR */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-[#E2DDD5] bg-[#FBF9F5]/90 px-6 py-4 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <CompassRoseIcon className="h-5 w-5 text-[#3A4856]" />
          <span className="font-sans text-[10px] font-light tracking-[0.25em] text-[#5B6770] uppercase">
            {groomName.charAt(0)} & {brideName.charAt(0)}
          </span>
        </div>

        <nav className="hidden items-center gap-8 font-sans text-[11px] tracking-[0.2em] text-[#4A5560] md:flex">
          <button onClick={() => scrollTo("our-story")} className="transition-colors hover:text-[#1A232A]">
            OUR STORY
          </button>
          <button onClick={() => scrollTo("schedule")} className="transition-colors hover:text-[#1A232A]">
            SCHEDULE
          </button>
          <button onClick={() => scrollTo("gallery")} className="transition-colors hover:text-[#1A232A]">
            GALLERY
          </button>
          <button onClick={() => scrollTo("rsvp")} className="transition-colors hover:text-[#1A232A]">
            RSVP
          </button>
        </nav>

        <button aria-label="Toggle Menu" onClick={() => setMenuOpen(!menuOpen)} className="p-1 text-[#2C3238] md:hidden">
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </header>

      {/* HERO SECTION (EDITORIAL FLOATING BADGE & ARCHITECTURAL FRAME) */}
      <motion.section key={`hero-${animationKey}`} {...motionFor(0)} className="relative px-5 pt-6 pb-12 md:px-12 md:pt-12 md:pb-20">
        <div className="relative mx-auto max-w-[1000px]">
          {/* Main Architectural Hero Image */}
          <div className="relative h-[480px] w-full overflow-hidden rounded-t-[140px] shadow-xl md:h-[620px] md:rounded-t-[260px]">
            <img
              src={heroImage}
              alt="Groom & Bride"
              className="h-full w-full scale-105 transform object-cover object-center transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1C252E]/60 via-transparent to-black/20" />

            {/* Hero Overlay Text */}
            <div className="absolute right-0 bottom-8 left-0 px-6 text-center text-white">
              <p className="mb-2 font-sans text-[11px] font-light tracking-[0.3em] text-[#E2DDD5] uppercase">
                Save The Date For The Wedding Of
              </p>
              <h1 className="font-serif text-4xl font-normal tracking-tight italic drop-shadow-sm md:text-7xl">
                {groomName} <span className="text-2xl font-light not-italic opacity-80 md:text-5xl">&</span> {brideName}
              </h1>
            </div>
          </div>

          {/* Floating Editorial Badge (Replicating Reference Design element) */}
          <motion.div
            {...motionFor(0.15)}
            className="relative z-20 mx-auto -mt-16 w-[88%] max-w-[340px] rounded-sm border border-[#E2DDD5] bg-[#FBF9F5] p-6 text-center shadow-lg md:absolute md:top-12 md:left-12 md:mt-0 md:w-[300px]"
          >
            <div className="mb-3 flex justify-center">
              <CompassRoseIcon className="h-8 w-8 text-[#4A5764]" />
            </div>
            <p className="font-sans text-[9px] tracking-[0.25em] text-[#788591] uppercase">Celebration of Love</p>
            <h2 className="my-1 font-serif text-xl font-normal text-[#1F272E] italic">Inspired by Quiet Elegance</h2>
            <div className="mx-auto my-3 h-px w-8 bg-[#C2BBB0]" />
            <p className="font-sans text-[10px] tracking-[0.15em] text-[#4A5560] uppercase">{primaryFormattedDate}</p>
            <p className="mt-0.5 font-sans text-[10px] text-[#788591]">{primaryVenue}</p>
          </motion.div>
        </div>
      </motion.section>

      {/* ESSENTIALS BAR */}
      <section className="border-y border-[#E2DDD5] bg-[#EEECE6] px-5 py-6">
        <div className="mx-auto grid max-w-[800px] grid-cols-3 divide-x divide-[#D6D0C5] text-center">
          <div className="px-2">
            <CalendarIcon className="mx-auto mb-1 h-4 w-4 text-[#4A5764]" />
            <p className="font-sans text-[11px] font-medium text-[#2C3238]">{primaryDay}</p>
            <p className="font-sans text-[9px] tracking-wider text-[#6B7782] uppercase">{primaryFormattedDate}</p>
          </div>
          <div className="px-2">
            <ClockIcon className="mx-auto mb-1 h-4 w-4 text-[#4A5764]" />
            <p className="font-sans text-[11px] font-medium text-[#2C3238]">4:00 PM</p>
            <p className="font-sans text-[9px] tracking-wider text-[#6B7782] uppercase">Ceremony</p>
          </div>
          <div className="px-2">
            <MapPinIcon className="mx-auto mb-1 h-4 w-4 text-[#4A5764]" />
            <p className="truncate font-sans text-[11px] font-medium text-[#2C3238]">{primaryVenue.split(",")[0]}</p>
            <p className="font-sans text-[9px] tracking-wider text-[#6B7782] uppercase">Destination</p>
          </div>
        </div>
      </section>

      {/* EDITORIAL OVERLAPPING IMAGE & QUOTE SECTION */}
      <motion.section
        id="our-story"
        key={`story-${animationKey}`}
        {...motionFor(0.1)}
        className="relative overflow-hidden bg-[#7A8895] px-5 py-16 text-white md:px-12 md:py-24"
      >
        <div className="mx-auto grid max-w-[900px] grid-cols-1 items-center gap-8 md:grid-cols-12">
          {/* Overlapping Photo Collage */}
          <div className="relative md:col-span-6">
            <div className="h-[300px] w-[80%] overflow-hidden rounded-t-[100px] border-2 border-white/20 shadow-2xl md:h-[380px]">
              <img src={DEFAULT_COUPLE_1} alt="Evin & Aparna" className="h-full w-full object-cover" />
            </div>
            <div className="absolute top-1/3 right-0 h-[200px] w-[55%] overflow-hidden rounded-sm border-4 border-[#7A8895] shadow-2xl md:h-[260px]">
              <img src={DEFAULT_COUPLE_2} alt="Couple Moment" className="h-full w-full object-cover" />
            </div>
          </div>

          {/* Story Narrative */}
          <div className="mt-6 text-center md:col-span-6 md:mt-0 md:pl-6 md:text-left">
            <div className="mb-4 inline-block rounded-full border border-white/30 p-2">
              <ArchIcon className="h-5 w-5 text-white/80" />
            </div>
            <h2 className="mb-4 font-serif text-2xl leading-snug font-light md:text-4xl">A Refined Balance of Simplicity & Significance</h2>
            <p className="mb-6 font-sans text-[12px] leading-relaxed font-light text-white/80 md:text-[13px]">
              Together with our families, we, {groomName} and {brideName}, invite you to share in our joy as we exchange vows. Surrounded by
              coastlines, warm breezes, and cherished friends, we begin our greatest journey.
            </p>
            <div className="inline-block border-b border-white/40 pb-1 font-sans text-[10px] tracking-[0.2em] uppercase">
              #EvinFoundHisAparna
            </div>
          </div>
        </div>
      </motion.section>

      {/* CALENDAR SECTION */}
      <section className="bg-[#FBF9F5] px-5 py-12 md:px-12 md:py-16">
        <div className="mx-auto max-w-[500px] text-center">
          <p className="mb-2 font-sans text-[10px] tracking-[0.25em] text-[#788591] uppercase">Mark Your Calendar</p>
          <h3 className="mb-6 font-serif text-2xl text-[#1F272E] italic">The Wedding Month</h3>
          <div className="rounded-md border border-[#E2DDD5] bg-white p-4 shadow-sm">
            <WeddingCalendar year={primaryDate.getFullYear()} month={primaryDate.getMonth()} selectedDate={primaryDate.getDate()} />
          </div>
        </div>
      </section>

      {/* SCHEDULE OF EVENTS SECTION */}
      <motion.section
        id="schedule"
        key={`events-${animationKey}`}
        {...motionFor(0.12)}
        className="border-t border-[#E2DDD5] bg-[#F4F1EA] px-5 py-16 md:px-12 md:py-20"
      >
        <div className="mx-auto max-w-[800px]">
          <div className="mb-12 text-center">
            <CompassRoseIcon className="mx-auto mb-2 h-6 w-6 text-[#4A5764]" />
            <h2 className="font-serif text-3xl font-normal text-[#1F272E]">Wedding Celebrations</h2>
            <p className="mt-1 font-sans text-[11px] tracking-[0.2em] text-[#788591] uppercase">The Order of Events</p>
          </div>

          <div className="space-y-6">
            {functions.map((fn: any, idx: number) => {
              const eventDate = fn.date ? new Date(fn.date) : new Date();
              const dayStr = eventDate.toLocaleDateString("en-US", { day: "2-digit" });
              const monthStr = eventDate.toLocaleDateString("en-US", { month: "short" }).toUpperCase();

              return (
                <motion.div
                  key={idx}
                  {...motionFor(0.15 + idx * 0.05)}
                  className="flex flex-col items-start justify-between gap-4 rounded-sm border border-[#E2DDD5] bg-[#FBF9F5] p-6 shadow-sm transition-colors hover:border-[#C2BBB0] md:flex-row md:items-center"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-t-full bg-[#3A4856] font-serif text-white">
                      <span className="text-base leading-none font-bold">{dayStr}</span>
                      <span className="mt-0.5 font-sans text-[8px] tracking-widest uppercase">{monthStr}</span>
                    </div>
                    <div>
                      <h4 className="font-serif text-lg text-[#1F272E]">{fn.title}</h4>
                      <p className="mt-0.5 flex items-center gap-1 font-sans text-[11px] text-[#6B7782]">
                        <MapPinIcon className="h-3.5 w-3.5" /> {fn.locationName}
                      </p>
                    </div>
                  </div>

                  <div className="w-full border-t border-[#E2DDD5] pt-3 text-right md:w-auto md:border-t-0 md:pt-0">
                    <span className="inline-block rounded-full bg-[#EEECE6] px-3 py-1 font-sans text-[11px] tracking-wider text-[#4A5560] uppercase">
                      {fn.time || "TBA"}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* GALLERY SECTION */}
      {!gallery.hidden && (
        <section id="gallery" className="bg-[#FBF9F5] px-5 py-12 md:px-12">
          <GallerySection
            animationKey={animationKey}
            getMotionProps={getMotionProps}
            layout={inviteData.galleryLayout}
            urls={inviteData.galleryUrls}
            fallback={heroImage}
            title="Moments & Memories"
            isProtected={gallery.protected}
            password={gallery.password}
            unlockedSections={unlockedSections}
            setUnlockedSections={setUnlockedSections}
          />
        </section>
      )}

      {/* MUSIC AUDIO PLAYER SECTION */}
      {music?.background_audio && (
        <section className="border-y border-[#E2DDD5] bg-[#EEECE6] px-5 py-8">
          <div className="mx-auto max-w-[500px] text-center">
            <p className="mb-2 font-sans text-[10px] tracking-[0.2em] text-[#788591] uppercase">Atmosphere</p>
            <AudioPlayer
              src={music.background_audio}
              name={music?.background_audio_name ?? "Soundtrack of Our Love"}
              cover={DEFAULT_COUPLE_2}
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
        <section className="bg-[#FBF9F5] px-5 py-12">
          <WishesSection
            animationKey={animationKey}
            getMotionProps={getMotionProps}
            eventKey={eventKey}
            wishesRaw={inviteData.wishesRaw}
            wishesContainerRef={useRef<HTMLElement | null>(null)}
            wishRefreshKey={wishRefreshKey}
            setWishRefreshKey={setWishRefreshKey}
            title={inviteData.wishesTitle ?? "Blessings & Wishes"}
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
        className="bg-[#3A4856] px-5 py-16 text-center text-white md:px-12 md:py-24"
      >
        <div className="mx-auto max-w-[500px]">
          <CompassRoseIcon className="mx-auto mb-3 h-8 w-8 text-[#C2BBB0]" />
          <h2 className="mb-2 font-serif text-3xl font-light">Kindly Respond</h2>
          <p className="mb-8 font-sans text-[11px] font-light tracking-wider text-[#D0C9BD] uppercase">Please RSVP by October 15, 2026</p>

          <div className="mb-6 grid grid-cols-2 gap-4">
            <button
              onClick={() => setRsvpStatus("yes")}
              className={`border px-4 py-3 font-sans text-[11px] tracking-[0.2em] uppercase transition-all ${
                rsvpStatus === "yes"
                  ? "border-white bg-white text-[#3A4856]"
                  : "border-white/30 bg-transparent text-white hover:border-white"
              }`}
            >
              Joyfully Accepts
            </button>
            <button
              onClick={() => setRsvpStatus("no")}
              className={`border px-4 py-3 font-sans text-[11px] tracking-[0.2em] uppercase transition-all ${
                rsvpStatus === "no"
                  ? "border-white bg-white text-[#3A4856]"
                  : "border-white/30 bg-transparent text-white hover:border-white"
              }`}
            >
              Regretfully Declines
            </button>
          </div>

          <button className="w-full bg-[#C2BBB0] py-3.5 font-sans text-[11px] font-medium tracking-[0.25em] text-[#1F272E] uppercase transition-colors hover:bg-white">
            Confirm Attendance
          </button>
        </div>
      </motion.section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-[#1C252E] px-6 py-12 text-center font-sans text-[#9EAAB5]">
        <div className="mx-auto max-w-[600px]">
          <p className="mb-2 text-[11px] tracking-[0.3em] text-white/80 uppercase">
            {groomName} & {brideName}
          </p>
          <p className="mb-6 text-[10px] tracking-widest text-white/40 uppercase">Greece • 2026</p>
          <div className="mx-auto mb-6 h-px w-12 bg-white/20" />
          <p className="text-[9px] tracking-wider text-white/30">© 2026 ALL RIGHTS RESERVED. DESIGNED FOR CELEBRATION.</p>
        </div>
      </footer>

      {/* MOBILE FULL-SCREEN NAVIGATION OVERLAY */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-50 flex flex-col justify-between bg-[#FBF9F5] p-8 md:hidden"
          >
            <div className="flex items-center justify-between border-b border-[#E2DDD5] pb-4">
              <span className="font-sans text-[11px] tracking-[0.2em] text-[#3A4856] uppercase">
                {groomName} & {brideName}
              </span>
              <button onClick={() => setMenuOpen(false)} aria-label="Close menu">
                <CloseIcon />
              </button>
            </div>

            <nav className="my-auto flex flex-col items-center gap-6 font-serif text-2xl text-[#1F272E]">
              <button onClick={() => scrollTo("our-story")} className="hover:italic">
                Our Story
              </button>
              <button onClick={() => scrollTo("schedule")} className="hover:italic">
                Schedule
              </button>
              <button onClick={() => scrollTo("gallery")} className="hover:italic">
                Gallery
              </button>
              <button onClick={() => scrollTo("rsvp")} className="hover:italic">
                RSVP
              </button>
            </nav>

            <div className="border-t border-[#E2DDD5] pt-4 text-center">
              <p className="font-sans text-[10px] tracking-[0.2em] text-[#788591] uppercase">{primaryFormattedDate}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
