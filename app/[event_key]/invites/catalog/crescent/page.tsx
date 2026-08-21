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

interface CrescentProps {
  data: any;
  eventKey: string;
  motionData: any;
  settings: any;
  theme?: any;
  music?: any;
}

// Indian Cultural Free Royalty High-Res Images
const DUMMY_INDIAN_HERO = "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85";
const DUMMY_GANESHA = "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=300&q=80";

const DUMMY_GALLERY = [
  "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80",
];

export default function Crescent({ data, eventKey, motionData, settings, music }: CrescentProps) {
  // Extract content dynamically from Luna Data without using Luna UI
  const crescentData = useInviteData(data);
  const { getMotionProps } = useThemeAnimation(design?.motion);
  const animationKey = useMemo(() => getAnimationKey(design?.motion), [design?.motion]);

  const [wishRefreshKey, setWishRefreshKey] = useState(0);
  const wishesContainerRef = useRef<HTMLElement | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [rsvp, setRsvp] = useState<"yes" | "no" | null>(null);

  // Dynamic names with required fallbacks: Evin & Aparna
  const brideName = crescentData.brideName || crescentData.firstName || "Aparna";
  const groomName = crescentData.groomName || crescentData.secondName || "Evin";

  const gallery = getSectionConfig(settings?.section_visibility, "gallery");
  const wishes = getSectionConfig(settings?.section_visibility, "wishes");
  const { unlockedSections, setUnlockedSections } = useUnlockedSections(eventKey);

  // Indian Wedding Functions fallback
  const functions = crescentData.eventFunctions?.length
    ? crescentData.eventFunctions
    : [
        { title: "Haldi & Mehndi Ceremony", date: "2025-11-14", locationName: "The Royal Lawns, 10:00 AM" },
        { title: "Sangeet & Cocktail Night", date: "2025-11-15", locationName: "Grand Ballroom, 7:00 PM" },
        { title: "Muhurtham & Pheras", date: "2025-11-16", locationName: "Sacred Pavilion, 9:30 AM" },
        { title: "Grand Wedding Reception", date: "2025-11-16", locationName: "Palace Gardens, 7:30 PM" },
      ];

  const primaryFunction = crescentData.primaryFunction || functions[2];
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
      className="relative mx-auto min-h-screen w-full max-w-[430px] overflow-x-hidden bg-[#580b1e] font-serif text-[#fbebd4] shadow-2xl md:max-w-[1080px]"
      style={
        {
          background: THEME_COLORS?.page || "#580b1e",
        } as CSSProperties
      }
    >
      {/* TRADITIONAL INDIAN BORDER OVERLAY */}
      <div className="pointer-events-none fixed inset-0 z-30 border-[10px] border-double border-[#d4af37]/40 md:border-[16px]" />

      {/* HEADER / NAVIGATION */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-[#d4af37]/30 bg-[#3b0612]/90 px-6 py-4 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="text-xl text-[#d4af37]">🪔</span>
          <span className="text-lg font-bold tracking-widest text-[#d4af37] uppercase md:text-xl">
            {brideName[0]} &amp; {groomName[0]}
          </span>
        </div>

        <nav className="hidden items-center gap-8 font-sans text-xs tracking-[0.25em] text-[#fbebd4] uppercase md:flex">
          <button onClick={() => scrollTo("blessings")} className="transition hover:text-[#d4af37]">
            Invocation
          </button>
          <button onClick={() => scrollTo("events")} className="transition hover:text-[#d4af37]">
            Events
          </button>
          <button onClick={() => scrollTo("gallery")} className="transition hover:text-[#d4af37]">
            Gallery
          </button>
          <button onClick={() => scrollTo("rsvp")} className="transition hover:text-[#d4af37]">
            RSVP
          </button>
        </nav>

        <button onClick={() => setMenuOpen(!menuOpen)} className="p-1 text-[#d4af37] md:hidden" aria-label="Toggle menu">
          <ThemeIcon name={menuOpen ? "close" : "menu"} size={26} />
        </button>
      </header>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 bg-[#3b0612] font-sans text-sm tracking-[0.25em] text-[#fbebd4] uppercase">
          <button onClick={() => scrollTo("blessings")}>Invocation</button>
          <button onClick={() => scrollTo("our-story")}>Our Journey</button>
          <button onClick={() => scrollTo("events")}>Functions</button>
          <button onClick={() => scrollTo("gallery")}>Gallery</button>
          <button onClick={() => scrollTo("dress-code")}>Dress Code</button>
          <button onClick={() => scrollTo("wishes")}>Wishes</button>
          <button onClick={() => scrollTo("rsvp")}>RSVP</button>
          <button onClick={() => setMenuOpen(false)} className="mt-8 rounded-full border border-[#d4af37] p-3 text-[#d4af37]">
            <ThemeIcon name="close" size={20} />
          </button>
        </div>
      )}

      {/* INVOCATION & BLESSINGS */}
      <section id="blessings" className="px-6 pt-10 pb-6 text-center">
        <motion.div {...motionFor(0.05)} className="mx-auto mb-4 max-w-xs">
          <img
            src={DUMMY_GANESHA}
            alt="Lord Ganesha"
            className="mx-auto h-20 w-20 object-contain drop-shadow-[0_0_12px_rgba(212,175,55,0.6)]"
          />
        </motion.div>
        <p className="mb-2 font-sans text-xs tracking-[0.3em] text-[#d4af37] uppercase">|| Shree Ganeshay Namah ||</p>
        <p className="text-xs text-[#e6c9a8] italic">
          "With the blessings of our ancestors and elders, we invite you to celebrate our union."
        </p>
      </section>

      {/* HERO SECTION WITH ROYAL INDIAN FRAME */}
      <section className="px-6 pb-12 text-center md:px-16 md:pb-16">
        <motion.div {...motionFor(0.1)} className="mx-auto mb-8 max-w-3xl">
          <h1 className="my-2 font-serif text-4xl leading-tight font-bold tracking-wide text-[#f3d38c] md:text-7xl">
            {brideName} <span className="font-sans text-2xl text-[#d4af37] md:text-5xl">&amp;</span> {groomName}
          </h1>
          <p className="mt-2 font-sans text-xs tracking-[0.25em] text-[#e5b382] uppercase">Are tying the knot</p>
        </motion.div>

        {/* Hero Arch Frame Image */}
        <motion.div
          {...motionFor(0.2)}
          className="relative mx-auto my-6 max-w-2xl rounded-t-full bg-gradient-to-b from-[#d4af37] to-[#8a6d20] p-3 shadow-2xl"
        >
          <div className="overflow-hidden rounded-t-full bg-[#4a0818] p-2">
            <img
              src={crescentData.heroImage || DUMMY_INDIAN_HERO}
              alt={`${brideName} & ${groomName}`}
              className="h-[320px] w-full rounded-t-full object-cover md:h-[500px]"
            />
          </div>
        </motion.div>

        {/* DATE & VENUE BADGE */}
        <div className="mx-auto mt-8 max-w-xl rounded-sm border border-[#d4af37]/40 bg-[#3b0612] p-6 shadow-xl">
          <span className="mb-2 block font-sans text-[10px] tracking-[0.3em] text-[#d4af37] uppercase">Auspicious Date</span>
          <div className="font-serif text-2xl text-[#f3d38c] md:text-4xl">
            {primaryDate.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </div>
          <p className="mt-2 font-sans text-xs tracking-wider text-[#e6c9a8]">
            📍 {primaryFunction.locationName || "The Taj Mahal Palace, Mumbai"}
          </p>
        </div>
      </section>

      {/* WEDDING CALENDAR */}
      <section className="border-y border-[#d4af37]/30 bg-[#3b0612] px-6 py-10">
        <div className="mx-auto max-w-md text-center">
          <h2 className="mb-6 flex items-center justify-center gap-2 font-sans text-xs tracking-[0.3em] text-[#d4af37] uppercase">
            <span>🌸</span> Wedding Calendar <span>🌸</span>
          </h2>
          <div className="rounded-md border border-[#d4af37]/20 bg-[#580b1e] p-4">
            <WeddingCalendar year={primaryDate.getFullYear()} month={primaryDate.getMonth()} selectedDate={primaryDate.getDate()} />
          </div>
        </div>
      </section>

      {/* OUR STORY */}
      <motion.section id="our-story" {...motionFor(0.15)} className="px-6 py-16 md:px-16">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 flex items-center justify-center gap-4">
            <span className="h-px w-12 bg-[#d4af37]/50" />
            <h2 className="font-sans text-xs tracking-[0.3em] text-[#d4af37] uppercase">Two Souls, One Destiny</h2>
            <span className="h-px w-12 bg-[#d4af37]/50" />
          </div>

          <p className="mb-8 font-serif text-base leading-relaxed text-[#fbebd4] italic md:text-lg">
            "What started as a destined meeting has bloomed into a lifetime of love, laughter, and togetherness. With immense joy, we step
            into our forever."
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {DUMMY_GALLERY.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt="Story memory"
                className="h-36 w-full rounded-md border border-[#d4af37]/40 object-cover shadow-md"
              />
            ))}
          </div>
        </div>
      </motion.section>

      {/* INDIAN CEREMONIES SCHEDULE */}
      <section id="events" className="bg-[#3b0612] px-6 py-16 md:px-16">
        <div className="mx-auto max-w-3xl">
          <div className="mb-12 text-center">
            <h2 className="mb-2 font-sans text-xs tracking-[0.3em] text-[#d4af37] uppercase">Wedding Festivities</h2>
            <p className="text-2xl text-[#f3d38c] italic md:text-3xl">The Auspicious Functions</p>
          </div>

          <div className="space-y-6">
            {functions.map((fn: any, index: number) => (
              <motion.div
                key={index}
                {...motionFor(0.1 + index * 0.05)}
                className="relative flex flex-col justify-between gap-4 overflow-hidden rounded-md border border-[#d4af37]/30 bg-[#580b1e] p-6 shadow-lg md:flex-row md:items-center"
              >
                <div className="pointer-events-none absolute -right-4 -bottom-4 text-6xl opacity-10">🪷</div>
                <div>
                  <span className="mb-1 block font-sans text-xs tracking-widest text-[#d4af37] uppercase">{fn.date}</span>
                  <h3 className="text-xl font-semibold text-[#f3d38c]">{fn.title}</h3>
                  <p className="mt-1 font-sans text-xs text-[#e6c9a8]">{fn.locationName}</p>
                </div>
                <div className="self-end md:self-center">
                  <span className="inline-block rounded-full border border-[#d4af37]/40 bg-[#3b0612] p-3 text-[#d4af37]">
                    <ThemeIcon name="calendar" size={18} />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* DRESS CODE / ATTIRE */}
      {crescentData?.dressCode && (
        <section id="dress-code" className="px-6 py-16 text-center md:px-16">
          <div className="mx-auto max-w-xl">
            <h2 className="mb-2 font-sans text-xs tracking-[0.3em] text-[#d4af37] uppercase">Royal Palette</h2>
            <p className="mb-8 text-2xl text-[#f3d38c] italic">Attire &amp; Dress Code</p>

            <div className="grid gap-6">
              {/* {crescentData.dressCode.map((dress: any, idx: number) => (
                <div key={idx} className="rounded-md border border-[#d4af37]/30 bg-[#3b0612] p-6">
                  <h3 className="mb-2 text-lg font-medium text-[#f3d38c]">{dress.title}</h3>
                  <p className="mb-4 font-sans text-xs text-[#e6c9a8]">{dress.description}</p>

                  {dress.hexColors && (
                    <div className="flex justify-center gap-3">
                      {dress.hexColors.map((hex: string, cIdx: number) => (
                        <span
                          key={cIdx}
                          className="h-7 w-7 rounded-full border border-[#d4af37] shadow-lg"
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
        <section id="gallery" className="bg-[#3b0612] px-6 py-16">
          <GallerySection
            animationKey={animationKey}
            getMotionProps={getMotionProps}
            layout={crescentData.galleryLayout}
            urls={crescentData.galleryUrls}
            fallback={crescentData.heroImage || DUMMY_INDIAN_HERO}
            title="Celebration Moments"
            isProtected={gallery.protected}
            password={gallery.password}
            unlockedSections={unlockedSections}
            setUnlockedSections={setUnlockedSections}
          />
        </section>
      )}

      {/* BACKGROUND MUSIC */}
      {music && (
        <section className="border-y border-[#d4af37]/30 bg-[#580b1e] px-6 py-8">
          <div className="mx-auto max-w-md">
            <AudioPlayer
              src={data?.music?.background_audio ?? ""}
              name={data?.music?.background_audio_name ?? "Shenai & Festive Sangeet"}
              cover={DUMMY_GALLERY[0]}
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
        <section id="wishes" className="px-6 py-16">
          <WishesSection
            animationKey={animationKey}
            getMotionProps={getMotionProps}
            eventKey={eventKey}
            wishesRaw={crescentData.wishesRaw}
            wishesContainerRef={wishesContainerRef}
            wishRefreshKey={wishRefreshKey}
            setWishRefreshKey={setWishRefreshKey}
            title={crescentData.wishesTitle ?? "Blessings & Good Wishes"}
            isIcon={false}
            isProtected={wishes.protected}
            password={wishes.password}
            unlockedSections={unlockedSections}
            setUnlockedSections={setUnlockedSections}
          />
        </section>
      )}

      {/* RSVP SECTION */}
      <section id="rsvp" className="border-t border-[#d4af37]/30 bg-[#3b0612] px-6 py-16 text-center">
        <div className="mx-auto max-w-md space-y-6">
          <h2 className="font-sans text-xs tracking-[0.3em] text-[#d4af37] uppercase">RSVP</h2>
          <p className="text-3xl text-[#f3d38c] italic">Will You Grace Us With Your Presence?</p>
          <p className="font-sans text-xs tracking-wider text-[#e6c9a8]">Kindly confirm your presence by October 15, 2025.</p>

          <div className="flex justify-center gap-4 pt-4">
            <button
              onClick={() => setRsvp("yes")}
              className={`flex-1 rounded-sm border py-3 font-sans text-xs tracking-[0.2em] uppercase transition ${
                rsvp === "yes"
                  ? "border-[#d4af37] bg-[#d4af37] font-bold text-[#3b0612]"
                  : "border-[#d4af37]/50 text-[#fbebd4] hover:border-[#d4af37]"
              }`}
            >
              Joyfully Accept
            </button>
            <button
              onClick={() => setRsvp("no")}
              className={`flex-1 rounded-sm border py-3 font-sans text-xs tracking-[0.2em] uppercase transition ${
                rsvp === "no"
                  ? "border-[#d4af37] bg-[#d4af37] font-bold text-[#3b0612]"
                  : "border-[#d4af37]/50 text-[#fbebd4] hover:border-[#d4af37]"
              }`}
            >
              Regretfully Decline
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#d4af37]/20 bg-[#25030b] px-6 py-12 text-center font-sans text-xs tracking-widest text-[#d4af37]">
        <p className="mb-2 font-serif text-xl text-[#f3d38c] italic">
          {brideName} &amp; {groomName}
        </p>
        <p className="text-[10px] text-[#e6c9a8] uppercase">#EvinWedsAparna</p>
        <p className="mt-8 text-[9px] text-[#8c6b4f]">
          © 2025 {brideName} &amp; {groomName}. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
