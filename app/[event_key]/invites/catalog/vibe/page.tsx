"use client";

import { useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Custom Hooks & Utilities
import { useThemeAnimation } from "../../../../../hooks/useThemeAnimations";
import { useInviteData } from "../../../../../hooks/useInviteData";
import { getAnimationKey } from "../../../../../utils/animation";
import { getSectionConfig } from "../../../../../utils/section-visibility";
import { useUnlockedSections } from "../../../../../hooks/useUnlockedSections";

// Core Custom Components (Untouched Layouts)
import WeddingCalendar from "../../../../../components/ui/WeddingCalendar";
import GallerySection from "../components/common/GallerySection";
import WishesSection from "../components/common/WishesSection";
import AudioPlayer from "../../../../../components/ui/AudioPlayer";
import { THEME_COLORS } from "../../core/core/themeColors";
import { ThemeIcon, type ThemeIconName } from "../../core/core/themeIcons";
import { THEME_TYPOGRAPHY } from "../../core/core/themeTypography";

interface VibeProps {
  data: any;
  eventKey: string;
  motionData: any;
  settings: any;
  music?: any;
}

const DUMMY_HERO = "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85";

export default function Vibe({ data, eventKey, motionData, settings, music }: VibeProps) {
  const vibeData = useInviteData(data);
  const { getMotionProps } = useThemeAnimation(motionData);
  const animationKey = useMemo(() => getAnimationKey(motionData), [motionData]);

  // State
  const [activeTab, setActiveTab] = useState<"schedule" | "story" | "details">("schedule");
  const [menuOpen, setMenuOpen] = useState(false);
  const [wishRefreshKey, setWishRefreshKey] = useState(0);
  const wishesContainerRef = useRef<HTMLElement | null>(null);

  // Expanded RSVP Dummy State
  const [rsvpAttending, setRsvpAttending] = useState<"yes" | "no" | "virtual" | null>(null);
  const [guestName, setGuestName] = useState("");
  const [plusOne, setPlusOne] = useState(false);
  const [plusOneName, setPlusOneName] = useState("");
  const [mealChoice, setMealChoice] = useState("Chef's Tasting Menu");
  const [songRequest, setSongRequest] = useState("");
  const [dietaryNotes, setDietaryNotes] = useState("");
  const [submittedRsvp, setSubmittedRsvp] = useState(false);

  // Content Hooks
  const firstName = vibeData.firstName || vibeData.brideName || "Ananya";
  const secondName = vibeData.secondName || vibeData.groomName || "Ritvik";
  const heroImage = vibeData.heroImage || DUMMY_HERO;

  const gallery = getSectionConfig(settings?.section_visibility, "gallery");
  const wishes = getSectionConfig(settings?.section_visibility, "wishes");
  const { unlockedSections, setUnlockedSections } = useUnlockedSections(eventKey);

  const functions = vibeData.eventFunctions?.length
    ? vibeData.eventFunctions
    : [
        { title: "Mehndi Rituals", date: "2025-11-14", locationName: "The Courtyard, 3:00 PM" },
        { title: "Sangeet Soirée", date: "2025-11-15", locationName: "Grand Ballroom, 7:00 PM" },
        { title: "Wedding Ceremony", date: "2025-11-16", locationName: "Palace Amphitheatre, 5:00 PM" },
        { title: "Grand Reception", date: "2025-11-16", locationName: "Royal Gardens, 8:00 PM" },
      ];

  const motionFor = (delay: number) => {
    const { key: _key, ...props } = getMotionProps(delay);
    return props;
  };

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedRsvp(true);
  };

  return (
    <main
      key={animationKey}
      className="relative min-h-screen w-full overflow-x-hidden bg-[#0b0c10] font-sans text-stone-200 selection:bg-amber-400 selection:text-black"
    >
      {/* CREATIVE BACKGROUND GLOW ORBS */}
      <div className="pointer-events-none fixed -top-32 -left-32 z-0 h-[550px] w-[550px] rounded-full bg-gradient-to-br from-amber-500/10 via-rose-500/5 to-transparent blur-[140px]" />
      <div className="pointer-events-none fixed top-1/2 -right-32 z-0 h-[600px] w-[600px] rounded-full bg-gradient-to-tl from-indigo-500/10 via-amber-400/5 to-transparent blur-[160px]" />

      {/* FLOATING GLASS HEADER */}
      <header className="fixed inset-x-4 top-4 z-50 mx-auto flex max-w-6xl items-center justify-between rounded-2xl border border-white/10 bg-black/50 px-6 py-3.5 shadow-2xl backdrop-blur-2xl">
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 animate-pulse rounded-full bg-amber-400" />
          <span className="font-mono text-xs tracking-[0.3em] text-amber-200 uppercase">
            {vibeData.announcement?.couple?.monogram || `${firstName[0]} + ${secondName[0]}`}
          </span>
        </div>

        <nav className="hidden items-center gap-8 font-mono text-[11px] tracking-[0.25em] text-stone-400 md:flex">
          <button onClick={() => scrollTo("experience")} className="uppercase transition-colors hover:text-amber-200">
            EXPERIENCE
          </button>
          <button onClick={() => scrollTo("gallery")} className="uppercase transition-colors hover:text-amber-200">
            GALLERY
          </button>
          <button onClick={() => scrollTo("wishes")} className="uppercase transition-colors hover:text-amber-200">
            WISHES
          </button>
          <button onClick={() => scrollTo("rsvp")} className="uppercase transition-colors hover:text-amber-200">
            RSVP
          </button>
        </nav>

        <button onClick={() => setMenuOpen(!menuOpen)} className="rounded-lg p-1 text-amber-200 hover:bg-white/5 md:hidden">
          <ThemeIcon name={menuOpen ? "close" : "menu"} size={22} />
        </button>
      </header>

      {/* MOBILE MENU DROPDOWN */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 flex flex-col gap-6 bg-black/95 px-8 pt-28 text-center font-mono text-sm tracking-[0.2em] text-stone-300 backdrop-blur-3xl"
          >
            <button onClick={() => scrollTo("experience")} className="border-b border-white/10 py-3">
              EXPERIENCE
            </button>
            <button onClick={() => scrollTo("gallery")} className="border-b border-white/10 py-3">
              GALLERY
            </button>
            <button onClick={() => scrollTo("music")} className="border-b border-white/10 py-3">
              MUSIC
            </button>
            <button onClick={() => scrollTo("wishes")} className="border-b border-white/10 py-3">
              WISHES
            </button>
            <button onClick={() => scrollTo("rsvp")} className="border-b border-white/10 py-3">
              RSVP
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN LAYOUT WRAPPER */}
      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 pt-28 pb-20 lg:grid-cols-12 lg:px-8">
        {/* LEFT COLUMN: STICKY EDITORIAL HERO PANEL */}
        <div className="lg:sticky lg:top-28 lg:col-span-5 lg:h-[calc(100vh-8rem)]">
          <div className="relative flex h-full min-h-[520px] w-full flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-stone-900/40 p-8 shadow-2xl backdrop-blur-xl">
            <img
              src={heroImage}
              alt="Hero Backdrop"
              className="absolute inset-0 h-full w-full object-cover brightness-[0.5] contrast-[1.1] filter"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

            {/* TOP BADGE */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="rounded-full border border-amber-300/30 bg-black/50 px-3.5 py-1 font-mono text-[10px] tracking-[0.25em] text-amber-200 uppercase backdrop-blur-md">
                EXCLUSIVE INVITATION
              </span>
              <span className="font-mono text-xs text-stone-400">NOV 2025</span>
            </div>

            {/* BOTTOM TITLE CARD */}
            <div className="relative z-10 space-y-4">
              <span className="font-mono text-xs tracking-widest text-amber-300 uppercase">
                {vibeData.announcement?.couple?.familyLabel || "Together with our families"}
              </span>
              <h1 className="text-5xl leading-[0.95] font-light tracking-tight text-white sm:text-6xl">
                {firstName} <br />
                <span className="font-serif text-amber-300 italic">&amp;</span> {secondName}
              </h1>
              <p className="max-w-xs text-xs leading-relaxed font-light text-stone-300">
                {vibeData.announcement?.announcement?.message || "Join us for a celebration of love, culture, and new beginnings."}
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: INTERACTIVE CONTENT STREAM */}
        <div className="space-y-16 lg:col-span-7">
          {/* CALENDAR BLOCK */}
          <section className="rounded-3xl border border-white/10 bg-stone-900/30 p-6 shadow-xl backdrop-blur-xl sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-mono text-xs tracking-[0.3em] text-amber-300 uppercase">Save The Date</h2>
              <span className="font-mono text-xs text-stone-500">2025</span>
            </div>
            <WeddingCalendar
              year={functions[0]?.date ? new Date(functions[0].date).getFullYear() : 2025}
              month={functions[0]?.date ? new Date(functions[0].date).getMonth() : 10}
              selectedDate={functions[0]?.date ? new Date(functions[0].date).getDate() : 16}
            />
          </section>

          {/* TABBED EXPERIENCE CONTROLLER */}
          <section id="experience" className="space-y-6">
            <div className="flex items-center gap-2 overflow-x-auto border-b border-white/10 pb-4">
              {(["schedule", "story", "details"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-xl px-5 py-2 font-mono text-xs tracking-widest whitespace-nowrap uppercase transition-all ${
                    activeTab === tab
                      ? "bg-amber-300 font-semibold text-black shadow-lg shadow-amber-300/20"
                      : "text-stone-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* TAB PANELS */}
            <div>
              {activeTab === "schedule" && (
                <div className="space-y-4">
                  {functions.map((fn: any, i: number) => (
                    <motion.div
                      key={i}
                      {...motionFor(0.05 * i)}
                      className="group rounded-2xl border border-white/10 bg-stone-900/20 p-6 backdrop-blur-md transition-all hover:border-amber-300/40 hover:bg-stone-900/50"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="font-mono text-[10px] tracking-widest text-amber-300 uppercase">
                            {fn.date ? new Date(fn.date).toDateString() : `EVENT 0${i + 1}`}
                          </span>
                          <h3 className="mt-1 text-2xl font-light text-white">{fn.title}</h3>
                          <p className="mt-2 flex items-center gap-2 text-xs text-stone-400">
                            <ThemeIcon name="venue" size={14} />
                            {fn.locationName}
                          </p>
                        </div>
                        <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-amber-300 transition-colors group-hover:bg-amber-300 group-hover:text-black">
                          <ThemeIcon name="calendar" size={18} />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {activeTab === "story" && (
                <div className="space-y-6 rounded-2xl border border-white/10 bg-stone-900/20 p-6 backdrop-blur-md sm:p-8">
                  {[
                    {
                      title: "First Chapter",
                      date: "May 2018",
                      text: "A chance meeting at an art exhibition that sparked late-night conversations.",
                    },
                    {
                      title: "The Promise",
                      date: "December 2023",
                      text: "Surrounded by mountain peaks, he proposed under the twilight sky.",
                    },
                  ].map((story, idx) => (
                    <div key={idx} className="space-y-1 border-l-2 border-amber-300/40 pl-6">
                      <span className="font-mono text-[10px] tracking-widest text-amber-300 uppercase">{story.date}</span>
                      <h4 className="text-xl font-light text-white">{story.title}</h4>
                      <p className="text-xs leading-relaxed text-stone-400">{story.text}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "details" && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {[
                    { title: "Stay & Accommodations", desc: "Special group rates reserved at the palace suites.", icon: "venue" },
                    { title: "Airport Chauffeurs", desc: "Private transfers available upon request.", icon: "car" },
                    { title: "Valet Parking", desc: "Complimentary valet service available on venue grounds.", icon: "info" },
                  ].map((det, i) => (
                    <div key={i} className="rounded-2xl border border-white/10 bg-stone-900/20 p-6 backdrop-blur-md">
                      <div className="mb-3 text-amber-300">
                        <ThemeIcon name={det.icon as ThemeIconName} size={22} />
                      </div>
                      <h4 className="text-sm font-light text-white">{det.title}</h4>
                      <p className="mt-1 text-xs leading-relaxed text-stone-400">{det.desc}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* GALLERY SECTION (CUSTOM UNTOUCHED LAYOUT) */}
          {!gallery.hidden && (
            <section id="gallery">
              <GallerySection
                animationKey={animationKey}
                getMotionProps={getMotionProps}
                layout={vibeData.galleryLayout}
                urls={vibeData.galleryUrls}
                fallback={vibeData.heroImage}
                title="Curated Moments"
                isProtected={gallery.protected}
                password={gallery.password}
                unlockedSections={unlockedSections}
                setUnlockedSections={setUnlockedSections}
              />
            </section>
          )}

          {/* MUSIC AUDIO PLAYER (CUSTOM UNTOUCHED LAYOUT) */}
          <section id="music" className="rounded-2xl border border-white/10 bg-stone-900/30 p-6 backdrop-blur-xl">
            <AudioPlayer
              src={music?.background_audio ?? ""}
              name={music?.background_audio_name ?? "Signature Wedding Vibe"}
              variant={music?.audio_player_variant}
              allowMute={music?.allow_mute ?? true}
              loop={music?.loop_music ?? true}
              fadeIn={music?.fade_in ?? false}
              fadeOut={music?.fade_out ?? false}
              volume={music?.volume_level ?? 60}
            />
          </section>

          {/* WISHES SECTION (CUSTOM UNTOUCHED LAYOUT) */}
          {!wishes.hidden && (
            <section id="wishes">
              <WishesSection
                animationKey={animationKey}
                getMotionProps={getMotionProps}
                eventKey={eventKey}
                wishesRaw={vibeData.wishesRaw}
                wishesContainerRef={wishesContainerRef}
                wishRefreshKey={wishRefreshKey}
                setWishRefreshKey={setWishRefreshKey}
                title={vibeData.wishesTitle ?? "Blessings & Wishes"}
                isIcon={false}
                isProtected={wishes.protected}
                password={wishes.password}
                unlockedSections={unlockedSections}
                setUnlockedSections={setUnlockedSections}
              />
            </section>
          )}

          {/* ADVANCED CUSTOM DUMMY RSVP FORM */}
          <section
            id="rsvp"
            className="rounded-3xl border border-white/10 bg-gradient-to-b from-stone-900/80 to-stone-900/40 p-6 shadow-2xl backdrop-blur-2xl sm:p-10"
          >
            <div className="mb-6 border-b border-white/10 pb-4">
              <span className="font-mono text-xs tracking-[0.3em] text-amber-300 uppercase">R.S.V.P.</span>
              <h2 className="mt-1 text-2xl font-light text-white">Request of Presence</h2>
            </div>

            {submittedRsvp ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3 py-12 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-amber-300/30 bg-amber-300/10 text-xl text-amber-300">
                  ✓
                </div>
                <h3 className="text-2xl font-light text-white">Response Confirmed</h3>
                <p className="text-xs text-stone-400">Thank you for letting us know! We look forward to celebrating with you.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleRsvpSubmit} className="space-y-6">
                {/* FULL NAME */}
                <div className="space-y-2">
                  <label className="font-mono text-xs text-stone-300 uppercase">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-xs text-white placeholder-stone-600 focus:border-amber-300 focus:outline-none"
                  />
                </div>

                {/* ATTENDANCE OPTIONS */}
                <div className="space-y-2">
                  <label className="font-mono text-xs text-stone-300 uppercase">Will you be joining us?</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: "yes", label: "In Person" },
                      { id: "virtual", label: "Virtual Stream" },
                      { id: "no", label: "Decline" },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setRsvpAttending(opt.id as any)}
                        className={`rounded-xl border px-2 py-3 font-mono text-xs tracking-wider transition-all ${
                          rsvpAttending === opt.id
                            ? "border-amber-300 bg-amber-300 font-semibold text-black"
                            : "border-white/10 text-stone-400 hover:bg-white/5"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* CONDITIONAL DETAILS FOR IN-PERSON ATTENDANCE */}
                {rsvpAttending === "yes" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-6 border-t border-white/10 pt-4"
                  >
                    {/* PLUS ONE TOGGLE */}
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs text-stone-300 uppercase">Bringing a +1 Guest?</span>
                      <button
                        type="button"
                        onClick={() => setPlusOne(!plusOne)}
                        className={`h-6 w-12 rounded-full p-1 transition-colors ${plusOne ? "bg-amber-300" : "bg-stone-800"}`}
                      >
                        <div
                          className={`h-4 w-4 rounded-full bg-black transition-transform ${plusOne ? "translate-x-6" : "translate-x-0"}`}
                        />
                      </button>
                    </div>

                    {plusOne && (
                      <input
                        type="text"
                        placeholder="+1 Guest Full Name"
                        value={plusOneName}
                        onChange={(e) => setPlusOneName(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-xs text-white placeholder-stone-600 focus:border-amber-300 focus:outline-none"
                      />
                    )}

                    {/* MEAL SELECTION */}
                    <div className="space-y-2">
                      <label className="font-mono text-xs text-stone-300 uppercase">Dinner Tasting Preference</label>
                      <div className="grid grid-cols-2 gap-2">
                        {["Chef's Tasting Menu", "Vegetarian / Jain", "Vegan Organic", "Seafood Special"].map((meal) => (
                          <button
                            key={meal}
                            type="button"
                            onClick={() => setMealChoice(meal)}
                            className={`rounded-lg border px-3 py-2 text-left text-[11px] transition-all ${
                              mealChoice === meal
                                ? "border-amber-300 bg-amber-300/10 text-amber-200"
                                : "border-white/10 text-stone-400 hover:bg-white/5"
                            }`}
                          >
                            {meal}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* DIETARY RESTRICTIONS */}
                    <div className="space-y-2">
                      <label className="font-mono text-xs text-stone-300 uppercase">Dietary Restrictions or Allergies</label>
                      <input
                        type="text"
                        placeholder="e.g. Gluten-free, Nut allergy..."
                        value={dietaryNotes}
                        onChange={(e) => setDietaryNotes(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-xs text-white placeholder-stone-600 focus:border-amber-300 focus:outline-none"
                      />
                    </div>

                    {/* DANCE FLOOR SONG REQUEST */}
                    <div className="space-y-2">
                      <label className="font-mono text-xs text-stone-300 uppercase">Sangeet Dance Floor Song Request</label>
                      <input
                        type="text"
                        placeholder="Song Title & Artist"
                        value={songRequest}
                        onChange={(e) => setSongRequest(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-xs text-white placeholder-stone-600 focus:border-amber-300 focus:outline-none"
                      />
                    </div>
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={!rsvpAttending}
                  className="w-full rounded-xl bg-amber-300 py-3.5 font-mono text-xs font-semibold tracking-widest text-black uppercase shadow-lg shadow-amber-300/10 transition-colors hover:bg-amber-200 disabled:opacity-40"
                >
                  Submit RSVP Response
                </button>
              </form>
            )}
          </section>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/10 py-10 text-center font-mono text-xs tracking-widest text-stone-500 uppercase">
        <p>
          © 2025 {firstName} &amp; {secondName}. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
