"use client";

import { useMemo, useRef, useState, CSSProperties } from "react";
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
import { ThemeIcon, type ThemeIconName } from "../../core/core/themeIcons";
import AudioPlayer from "../../../../../components/ui/AudioPlayer";

interface NoraProps {
  data: any;
  eventKey: string;
  motionData: any;
  settings: any;
  theme?: any;
  music?: any;
}

const DUMMY_COLLAGE = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80",
];

export default function Nora({ data, eventKey, motionData, settings, music }: NoraProps) {
  // Using Luna Data structure without using Luna UI
  const noraData = useInviteData(data);
  const { getMotionProps } = useThemeAnimation(design?.motion);
  const animationKey = useMemo(() => getAnimationKey(design?.motion), [design?.motion]);

  const [wishRefreshKey, setWishRefreshKey] = useState(0);
  const wishesContainerRef = useRef<HTMLElement | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [rsvp, setRsvp] = useState<"yes" | "no" | null>(null);

  // Dynamic names with fallback to Evin & Aparna
  const brideName = noraData.brideName || noraData.firstName || "Aparna";
  const groomName = noraData.groomName || noraData.secondName || "Evin";

  const gallery = getSectionConfig(settings?.section_visibility, "gallery");
  const wishes = getSectionConfig(settings?.section_visibility, "wishes");
  const { unlockedSections, setUnlockedSections } = useUnlockedSections(eventKey);

  const functions = noraData.eventFunctions?.length
    ? noraData.eventFunctions
    : [
        { title: "Mehndi & Haldi", date: "2025-11-14", locationName: "The Heritage Lawn, 3:00 PM" },
        { title: "Sangeet Night", date: "2025-11-15", locationName: "Grand Ballroom, 7:00 PM" },
        { title: "Wedding Ceremony", date: "2025-11-16", locationName: "Royal Pavilion, 10:00 AM" },
        { title: "Reception", date: "2025-11-16", locationName: "Palace Gardens, 7:00 PM" },
      ];

  const primaryFunction = noraData.primaryFunction || functions[2];
  const primaryDate = primaryFunction?.date ? new Date(primaryFunction.date) : new Date("2025-11-16");

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
      className="relative mx-auto min-h-screen w-full max-w-[430px] overflow-x-hidden bg-[#fbf9f5] font-serif text-[#2b2b2b] shadow-2xl md:max-w-[1080px]"
      style={
        {
          background: THEME_COLORS?.page || "#fbf9f5",
        } as CSSProperties
      }
    >
      {/* HEADER / NAVIGATION (Editorial Style) */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-[#e5dfd5] bg-[#fbf9f5]/90 px-6 py-4 backdrop-blur-md">
        <div className="text-xl font-light tracking-widest uppercase italic">
          {brideName[0]} & {groomName[0]}
        </div>

        <nav className="hidden items-center gap-8 font-sans text-xs tracking-[0.2em] text-[#666] uppercase md:flex">
          <button onClick={() => scrollTo("our-story")} className="transition hover:text-black">
            Story
          </button>
          <button onClick={() => scrollTo("events")} className="transition hover:text-black">
            Events
          </button>
          <button onClick={() => scrollTo("gallery")} className="transition hover:text-black">
            Gallery
          </button>
          <button onClick={() => scrollTo("rsvp")} className="transition hover:text-black">
            RSVP
          </button>
        </nav>

        <button onClick={() => setMenuOpen(!menuOpen)} className="p-1 text-[#2b2b2b] md:hidden" aria-label="Toggle menu">
          <ThemeIcon name={menuOpen ? "close" : "menu"} size={24} />
        </button>
      </header>

      {/* MOBILE NAV OVERLAY */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 bg-[#1c1a17] font-sans text-sm tracking-[0.25em] text-[#fbf9f5] uppercase">
          <button onClick={() => scrollTo("our-story")}>Our Story</button>
          <button onClick={() => scrollTo("events")}>Events</button>
          <button onClick={() => scrollTo("gallery")}>Gallery</button>
          <button onClick={() => scrollTo("dress-code")}>Dress Code</button>
          <button onClick={() => scrollTo("wishes")}>Wishes</button>
          <button onClick={() => scrollTo("rsvp")}>RSVP</button>
          <button onClick={() => setMenuOpen(false)} className="mt-8 rounded-full border border-white/20 p-3">
            <ThemeIcon name="close" size={20} />
          </button>
        </div>
      )}

      {/* HERO SECTION - COLLAGE / PORTFOLIO STYLE */}
      <section className="px-6 pt-10 pb-16 md:px-16 md:pt-16">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <span className="mb-3 block font-sans text-xs tracking-[0.3em] text-[#8c8275] uppercase">Together with their families</span>
          <h1 className="mb-4 text-4xl leading-tight font-normal tracking-wide italic md:text-7xl">
            {brideName} <span className="font-sans text-2xl not-italic md:text-4xl">&</span> {groomName}
          </h1>
          <p className="font-sans text-xs tracking-[0.2em] text-[#555] uppercase">Are getting married</p>
        </div>

        {/* Editorial Photo Collage Grid (Inspired by Reference) */}
        <div className="my-8 grid grid-cols-12 items-center gap-3 md:gap-6">
          <motion.div {...motionFor(0.1)} className="relative z-10 col-span-7">
            <div className="rounded-sm border border-[#eae4d9] bg-white p-2 shadow-md">
              <img
                src={noraData.heroImage || DUMMY_COLLAGE[0]}
                alt={`${brideName} and ${groomName}`}
                className="h-[260px] w-full object-cover md:h-[450px]"
              />
            </div>
          </motion.div>

          <motion.div {...motionFor(0.2)} className="z-20 col-span-5 -ml-4 md:-ml-12">
            <div className="rounded-sm border border-[#e2dacd] bg-[#f4efe6] p-2 shadow-lg">
              <img src={DUMMY_COLLAGE[1]} alt="Details" className="h-[180px] w-full object-cover md:h-[320px]" />
            </div>
          </motion.div>
        </div>

        {/* Key Event Banner */}
        <div className="mt-12 rounded-sm border border-[#e5ded3] bg-[#f3eee6] p-6 text-center md:p-8">
          <p className="mb-2 font-sans text-xs tracking-[0.25em] text-[#7a7063] uppercase">Save The Date</p>
          <div className="text-2xl font-light tracking-widest text-[#2b2b2b] md:text-4xl">
            {primaryDate.toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </div>
          <p className="mt-2 font-sans text-xs tracking-wider text-[#666]">
            {primaryFunction.locationName || "Taj Falaknuma Palace, Hyderabad"}
          </p>
        </div>
      </section>

      {/* WEDDING CALENDAR */}
      <section className="border-y border-[#ece6dc] bg-white px-6 py-12">
        <div className="mx-auto max-w-md text-center">
          <h2 className="mb-6 font-sans text-xs tracking-[0.3em] text-[#7a7063] uppercase">Mark Your Calendar</h2>
          <WeddingCalendar year={primaryDate.getFullYear()} month={primaryDate.getMonth()} selectedDate={primaryDate.getDate()} />
        </div>
      </section>

      {/* OUR STORY SECTION */}
      <motion.section id="our-story" {...motionFor(0.15)} className="bg-[#fbf9f5] px-6 py-16 md:px-16">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-[#d8d0c3]" />
            <h2 className="font-sans text-xs tracking-[0.3em] text-[#7a7063] uppercase">Our Story</h2>
            <div className="h-px flex-1 bg-[#d8d0c3]" />
          </div>

          <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
            <div className="space-y-4 font-sans text-sm leading-relaxed font-light text-[#4a4640]">
              <p className="font-serif text-lg text-[#2b2b2b] italic">
                "Two lives, two hearts, joined together in friendship, united forever in love."
              </p>
              <p>
                From simple beginnings to unforgettable milestones, our journey together has brought us to this magical moment. We can't
                wait to begin this next chapter with our favorite people by our side.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <img src={DUMMY_COLLAGE[2]} alt="Story moment" className="h-40 w-full rounded-sm border border-[#e5ded3] object-cover" />
              <img src={DUMMY_COLLAGE[3]} alt="Story moment" className="h-40 w-full rounded-sm border border-[#e5ded3] object-cover" />
            </div>
          </div>
        </div>
      </motion.section>

      {/* FUNCTIONS & SCHEDULE */}
      <section id="events" className="bg-[#f4efe6] px-6 py-16 md:px-16">
        <div className="mx-auto max-w-3xl">
          <div className="mb-12 text-center">
            <h2 className="mb-2 font-sans text-xs tracking-[0.3em] text-[#7a7063] uppercase">Celebration Schedule</h2>
            <p className="text-2xl italic">The Wedding Events</p>
          </div>

          <div className="space-y-6">
            {functions.map((fn: any, index: number) => (
              <motion.div
                key={index}
                {...motionFor(0.1 + index * 0.05)}
                className="flex flex-col justify-between gap-4 rounded-sm border border-[#e8e2d7] bg-white p-6 shadow-sm md:flex-row md:items-center"
              >
                <div>
                  <span className="mb-1 block font-sans text-xs tracking-widest text-[#a09484] uppercase">{fn.date}</span>
                  <h3 className="text-xl font-normal text-[#2b2b2b]">{fn.title}</h3>
                  <p className="mt-1 font-sans text-xs text-[#666]">{fn.locationName}</p>
                </div>
                <div className="self-end md:self-center">
                  <span className="inline-block rounded-full border border-[#e5ded3] bg-[#fbf9f5] p-2 text-[#8c8275]">
                    <ThemeIcon name="calendar" size={18} />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* DRESS CODE */}
      {noraData?.dressCode && (
        <section id="dress-code" className="bg-[#fbf9f5] px-6 py-16 text-center md:px-16">
          <div className="mx-auto max-w-xl">
            <h2 className="mb-3 font-sans text-xs tracking-[0.3em] text-[#7a7063] uppercase">Attire</h2>
            <p className="mb-8 text-2xl italic">Dress Code</p>

            <div className="grid gap-6">
              {/* {noraData.dressCode.map((dress: any, idx: number) => (
                <div key={idx} className="rounded-sm border border-[#e8e2d7] bg-white p-6">
                  <h3 className="mb-2 text-lg font-medium">{dress.title}</h3>
                  <p className="mb-4 font-sans text-xs text-[#666]">{dress.description}</p>

                  {dress.hexColors && (
                    <div className="flex justify-center gap-3">
                      {dress.hexColors.map((hex: string, cIdx: number) => (
                        <span
                          key={cIdx}
                          className="h-6 w-6 rounded-full border border-black/10 shadow-inner"
                          style={{ backgroundColor: hex }}
                          title={hex}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))} */}
            </div>
          </div>
        </section>
      )}

      {/* GALLERY SECTION */}
      {!gallery.hidden && (
        <section id="gallery" className="bg-white px-6 py-16">
          <GallerySection
            animationKey={animationKey}
            getMotionProps={getMotionProps}
            layout={noraData.galleryLayout}
            urls={noraData.galleryUrls}
            fallback={noraData.heroImage || DUMMY_COLLAGE[0]}
            title="Moments"
            isProtected={gallery.protected}
            password={gallery.password}
            unlockedSections={unlockedSections}
            setUnlockedSections={setUnlockedSections}
          />
        </section>
      )}

      {/* BACKGROUND MUSIC */}
      {music && (
        <section className="border-y border-[#e5ded3] bg-[#f4efe6] px-6 py-8">
          <div className="mx-auto max-w-md">
            <AudioPlayer
              src={data?.music?.background_audio ?? ""}
              name={data?.music?.background_audio_name ?? "Wedding Melody"}
              cover={DUMMY_COLLAGE[1]}
              variant={music.audio_player_variant}
              allowMute={data?.music?.allow_mute ?? true}
              loop={data?.music?.loop_music ?? true}
              fadeIn={data?.music?.fade_in ?? false}
              fadeOut={data?.music?.fade_out ?? false}
              volume={data?.music?.volume_level ?? 60}
            />
          </div>
        </section>
      )}

      {/* WISHES SECTION */}
      {!wishes.hidden && (
        <section id="wishes" className="bg-[#fbf9f5] px-6 py-16">
          <WishesSection
            animationKey={animationKey}
            getMotionProps={getMotionProps}
            eventKey={eventKey}
            wishesRaw={noraData.wishesRaw}
            wishesContainerRef={wishesContainerRef}
            wishRefreshKey={wishRefreshKey}
            setWishRefreshKey={setWishRefreshKey}
            title={noraData.wishesTitle ?? "Blessings & Wishes"}
            isIcon={false}
            isProtected={wishes.protected}
            password={wishes.password}
            unlockedSections={unlockedSections}
            setUnlockedSections={setUnlockedSections}
          />
        </section>
      )}

      {/* RSVP SECTION */}
      <section id="rsvp" className="bg-[#2b2b2b] px-6 py-16 text-center text-[#fbf9f5]">
        <div className="mx-auto max-w-md space-y-6">
          <h2 className="font-sans text-xs tracking-[0.3em] text-[#a09484] uppercase">RSVP</h2>
          <p className="text-3xl italic">Are You Attending?</p>
          <p className="font-sans text-xs tracking-wider text-[#ccc]">Please kindly respond before October 15, 2025.</p>

          <div className="flex justify-center gap-4 pt-4">
            <button
              onClick={() => setRsvp("yes")}
              className={`flex-1 border py-3 font-sans text-xs tracking-[0.2em] uppercase transition ${
                rsvp === "yes" ? "border-[#fbf9f5] bg-[#fbf9f5] text-[#2b2b2b]" : "border-white/30 text-white hover:border-white"
              }`}
            >
              Joyfully Accept
            </button>
            <button
              onClick={() => setRsvp("no")}
              className={`flex-1 border py-3 font-sans text-xs tracking-[0.2em] uppercase transition ${
                rsvp === "no" ? "border-[#fbf9f5] bg-[#fbf9f5] text-[#2b2b2b]" : "border-white/30 text-white hover:border-white"
              }`}
            >
              Regretfully Decline
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-[#1c1a17] px-6 py-12 text-center font-sans text-xs tracking-widest text-[#8c8275]">
        <p className="mb-2 font-serif text-lg text-[#fbf9f5] italic">
          {brideName} & {groomName}
        </p>
        <p className="text-[10px] uppercase">Forever & Always</p>
        <p className="mt-8 text-[9px] text-[#555]">
          © 2025 {brideName} & {groomName}. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
