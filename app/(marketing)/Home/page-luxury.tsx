"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Image, { type StaticImageData } from "next/image";
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowDown, ArrowUpRight, ChevronLeft, ChevronRight, Heart, Menu, Minus, X } from "lucide-react";

import { Footer } from "../components/footer/Footer";

import mockup from "../../../public/images/banner/mockup.png";
import mockup1 from "../../../public/images/banner/mockup1.png";
import mockup2 from "../../../public/images/banner/mockup2.png";
import grid from "../../../public/images/banner/grid.jpg";

import celeb1 from "../../../public/images/celebrations/1.webp";
import celeb2 from "../../../public/images/celebrations/2.webp";
import celeb3 from "../../../public/images/celebrations/3.webp";
import celeb4 from "../../../public/images/celebrations/4.webp";

import AudioPlayerWave from "../../[event_key]/invites/catalog/components/icons/AudioPlayerWave";
import AnimatedGalleryIcon from "../../[event_key]/invites/catalog/components/icons/AnimatedGalleryIcon";
import AnimatedLockIcon from "../../[event_key]/invites/catalog/components/icons/AnimatedLockIcon";
import AnimatedFlipClock from "../../[event_key]/invites/catalog/components/icons/AnimatedFlipClock";

const ease = [0.19, 1, 0.22, 1] as const;

type HeroSlide = {
  id: string;
  number: string;
  category: string;
  title: string;
  accent: string;
  description: string;
  image: StaticImageData;
};

const heroSlides: HeroSlide[] = [
  {
    id: "eternal",
    number: "01",
    category: "WEDDING",
    title: "Eternal",
    accent: "Moments",
    description: "An invitation experience for the beginning of something beautiful.",
    image: mockup,
  },
  {
    id: "afterglow",
    number: "02",
    category: "BIRTHDAY",
    title: "Afterglow",
    accent: "Stories",
    description: "A warm, expressive invitation shaped around the people who matter.",
    image: mockup1,
  },
  {
    id: "heirloom",
    number: "03",
    category: "ANNIVERSARY",
    title: "Heirloom",
    accent: "Elegance",
    description: "Timeless typography and considered details for a celebration remembered.",
    image: mockup2,
  },
  {
    id: "gallery",
    number: "04",
    category: "GATHERING",
    title: "Gallery",
    accent: "Edition",
    description: "A contemporary invitation where photographs and details become the story.",
    image: grid,
  },
];

const collections = [
  {
    number: "01",
    category: "Wedding",
    title: "The Wedding Edit",
    description: "Romantic, intimate and made for the beginning of forever.",
    image: celeb1,
  },
  {
    number: "02",
    category: "Birthday",
    title: "The Birthday Edit",
    description: "A celebration of personality, people and little moments.",
    image: celeb2,
  },
  {
    number: "03",
    category: "Anniversary",
    title: "The Anniversary Edit",
    description: "A quiet expression of everything shared along the way.",
    image: celeb3,
  },
  {
    number: "04",
    category: "Gathering",
    title: "The Gathering Edit",
    description: "Considered invitations for modern celebrations and occasions.",
    image: celeb4,
  },
];

const experiences = [
  {
    number: "01",
    title: "Welcome Music",
    eyebrow: "Atmosphere",
    description: "Set the mood before your guests even arrive.",
    icon: <AudioPlayerWave />,
  },
  {
    number: "02",
    title: "Memory Gallery",
    eyebrow: "Story",
    description: "Let photographs and memories become part of the invitation.",
    icon: <AnimatedGalleryIcon />,
  },
  {
    number: "03",
    title: "Event Countdown",
    eyebrow: "Anticipation",
    description: "Turn the wait into part of the celebration.",
    icon: <AnimatedFlipClock />,
  },
  {
    number: "04",
    title: "Event Schedule",
    eyebrow: "Details",
    description: "Every ceremony, venue and moment in one elegant flow.",
    icon: <Minus className="h-5 w-5" strokeWidth={1} />,
  },
  {
    number: "05",
    title: "Guest Wishes",
    eyebrow: "Connection",
    description: "Give every guest a beautiful place to leave their words.",
    icon: <Heart className="h-5 w-5" strokeWidth={1} />,
  },
  {
    number: "06",
    title: "Private Details",
    eyebrow: "Privacy",
    description: "Keep selected information visible only to the right people.",
    icon: <AnimatedLockIcon />,
  },
];

function OrnamentalPattern({ dark = false, className = "" }: { dark?: boolean; className?: string }) {
  const stroke = dark ? "#F5F1EA" : "#3B0A14";

  return (
    <svg aria-hidden="true" viewBox="0 0 600 600" className={`pointer-events-none absolute h-[600px] w-[600px] ${className}`} fill="none">
      <defs>
        <pattern id={dark ? "luxury-ornament-dark" : "luxury-ornament-light"} width="72" height="72" patternUnits="userSpaceOnUse">
          <circle cx="36" cy="36" r="15" stroke={stroke} strokeWidth="0.7" />
          <path d="M36 3C40 17 50 27 69 36C50 45 40 55 36 69C32 55 22 45 3 36C22 27 32 17 36 3Z" stroke={stroke} strokeWidth="0.7" />
          <path
            d="M0 36C18 36 24 24 24 0M72 36C54 36 48 24 48 0M0 36C18 36 24 48 24 72M72 36C54 36 48 48 48 72"
            stroke={stroke}
            strokeWidth="0.55"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${dark ? "luxury-ornament-dark" : "luxury-ornament-light"})`} />
    </svg>
  );
}

function SectionEyebrow({ number, children, dark = false }: { number: string; children: ReactNode; dark?: boolean }) {
  return (
    <div className={`flex items-center gap-3 text-[8px] tracking-[0.32em] uppercase ${dark ? "text-[#F5F1EA]/55" : "text-[#3B0A14]/45"}`}>
      <span>{number}</span>
      <span className={`h-px w-8 ${dark ? "bg-[#B99A68]/60" : "bg-[#3B0A14]/20"}`} />
      <span>{children}</span>
    </div>
  );
}

function LuxuryButton({ children, onClick, dark = false }: { children: ReactNode; onClick?: () => void; dark?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group inline-flex h-12 items-center gap-5 rounded-full px-5 text-[9px] tracking-[0.22em] uppercase transition-all duration-500 sm:h-14 sm:px-6 ${
        dark ? "bg-[#F5F1EA] text-[#3B0A14] hover:bg-white" : "bg-[#3B0A14] text-[#F5F1EA] hover:bg-[#4A0E1A]"
      }`}
    >
      <span>{children}</span>
      <span
        className={`flex h-8 w-8 items-center justify-center rounded-full transition-transform duration-500 group-hover:rotate-45 ${
          dark ? "bg-[#3B0A14] text-[#F5F1EA]" : "bg-[#F5F1EA] text-[#3B0A14]"
        }`}
      >
        <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.3} />
      </span>
    </button>
  );
}

function EditorialImage({
  src,
  alt,
  className = "",
  sizes = "100vw",
}: {
  src: StaticImageData;
  alt: string;
  className?: string;
  sizes?: string;
}) {
  return <Image src={src} alt={alt} fill sizes={sizes} className={`object-cover ${className}`} />;
}

function LuxuryHeader({
  scrolled,
  open,
  setOpen,
  onInvites,
}: {
  scrolled: boolean;
  open: boolean;
  setOpen: (value: boolean) => void;
  onInvites: () => void;
}) {
  const links = [
    { label: "Collections", id: "collections" },
    { label: "Experience", id: "experience" },
    { label: "Create", id: "create" },
  ];

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 right-0 left-0 z-[100] transition-all duration-700 ${
          scrolled ? "border-b border-[#3B0A14]/10 bg-[#F5F1EA]/95 text-[#3B0A14] backdrop-blur-xl" : "bg-transparent text-[#F5F1EA]"
        }`}
      >
        <div className="mx-auto flex h-[72px] items-center justify-between px-5 sm:px-8 md:h-[82px] md:px-12">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="group flex items-center gap-3"
            aria-label="MomentsEra home"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-current/35">
              <span className="h-1.5 w-1.5 rounded-full bg-[#B99A68]" />
            </span>
            <span className="font-serif text-lg tracking-[-0.04em]">MomentsEra</span>
          </button>

          <nav className="hidden items-center gap-10 md:flex">
            {links.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => scrollTo(link.id)}
                className="text-[8px] tracking-[0.28em] uppercase opacity-65 transition-opacity hover:opacity-100"
              >
                {link.label}
              </button>
            ))}
          </nav>

          <button
            type="button"
            onClick={onInvites}
            className={`hidden rounded-full border px-5 py-2.5 text-[8px] tracking-[0.2em] uppercase transition-all md:block ${
              scrolled ? "border-[#3B0A14]/20 hover:border-[#3B0A14]/50" : "border-[#F5F1EA]/30 hover:border-[#F5F1EA]/70"
            }`}
          >
            Explore Suites
          </button>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen(!open)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-current/20 md:hidden"
          >
            {open ? <X className="h-4 w-4" strokeWidth={1.2} /> : <Menu className="h-4 w-4" strokeWidth={1.2} />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[90] flex flex-col justify-center bg-[#3B0A14] px-8 text-[#F5F1EA] md:hidden"
          >
            <div className="absolute top-8 left-8">
              <span className="text-[8px] tracking-[0.32em] text-[#F5F1EA]/45 uppercase">MomentsEra</span>
            </div>

            <nav className="space-y-5">
              {links.map((link, index) => (
                <motion.button
                  key={link.id}
                  type="button"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.07 }}
                  onClick={() => scrollTo(link.id)}
                  className="block font-serif text-5xl leading-none tracking-[-0.06em]"
                >
                  {link.label}
                </motion.button>
              ))}
            </nav>

            <div className="mt-12">
              <LuxuryButton dark onClick={onInvites}>
                Explore Suites
              </LuxuryButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function FeatureCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 220, damping: 24 }}
      className="border-t border-[#F5F1EA]/15 py-6 text-[#F5F1EA]"
    >
      <div className="flex items-start justify-between gap-6">
        <span className="font-serif text-xl text-[#B99A68]">{number}</span>
        <span className="text-right">
          <span className="block font-serif text-2xl leading-none">{title}</span>
          <span className="mt-3 block max-w-[220px] text-[10px] leading-5 text-[#F5F1EA]/45">{description}</span>
        </span>
      </div>
    </motion.div>
  );
}

export default function Home() {
  const router = useRouter();
  const heroRef = useRef<HTMLElement | null>(null);
  const collectionsRef = useRef<HTMLElement | null>(null);
  const experienceRef = useRef<HTMLElement | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end end"],
  });

  const smoothHeroProgress = useSpring(heroProgress, {
    stiffness: 75,
    damping: 24,
    mass: 0.35,
  });

  const heroImageY = useTransform(smoothHeroProgress, [0, 1], ["0%", "-12%"]);
  const heroImageScale = useTransform(smoothHeroProgress, [0, 0.7, 1], [1, 1.025, 1.055]);
  const heroCopyY = useTransform(smoothHeroProgress, [0, 0.4], ["0px", "-70px"]);
  const heroCopyOpacity = useTransform(smoothHeroProgress, [0, 0.25, 0.48], [1, 1, 0]);
  const heroImageOpacity = useTransform(smoothHeroProgress, [0, 0.5, 0.7], [1, 1, 0]);

  const { scrollYProgress: collectionsProgress } = useScroll({
    target: collectionsRef,
    offset: ["start start", "end end"],
  });

  const collectionsX = useTransform(collectionsProgress, [0, 1], ["0%", "-64%"]);

  const collectionTitleY = useTransform(collectionsProgress, [0, 1], ["0px", "-70px"]);

  const { scrollYProgress: experienceProgress } = useScroll({
    target: experienceRef,
    offset: ["start start", "end end"],
  });

  const experienceTitleY = useTransform(experienceProgress, [0, 1], ["0px", "-60px"]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % heroSlides.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, []);

  const activeSlide = heroSlides[activeIndex];

  const previous = () => {
    setActiveIndex((current) => (current - 1 + heroSlides.length) % heroSlides.length);
  };

  const next = () => {
    setActiveIndex((current) => (current + 1) % heroSlides.length);
  };

  return (
    <>
      <style jsx global>{`
        :root {
          --luxury-burgundy: #3b0a14;
          --luxury-ivory: #f5f1ea;
          --luxury-gold: #b99a68;
          --luxury-espresso: #24171a;
          --luxury-serif: "Playfair Display", "Cormorant Garamond", Georgia, serif;
          --luxury-sans: "Inter", "Helvetica Neue", Helvetica, Arial, sans-serif;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          background: var(--luxury-ivory);
          color: var(--luxury-burgundy);
          font-family: var(--luxury-sans);
        }

        .luxury-serif {
          font-family: var(--luxury-serif);
        }

        .luxury-sans {
          font-family: var(--luxury-sans);
        }

        ::selection {
          background: var(--luxury-burgundy);
          color: var(--luxury-ivory);
        }
      `}</style>

      <main className="relative overflow-x-clip bg-[#F5F1EA] text-[#3B0A14]">
        <LuxuryHeader scrolled={scrolled} open={menuOpen} setOpen={setMenuOpen} onInvites={() => router.push("/invites")} />

        {/* 01 — HERO */}
        <section ref={heroRef} className="relative h-[155vh] bg-[#3B0A14] text-[#F5F1EA]">
          <div className="sticky top-0 h-[100svh] min-h-[640px] overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_52%,rgba(184,154,104,.16),transparent_28%),linear-gradient(115deg,#3B0A14_0%,#4A0E1A_55%,#321019_100%)]" />

            <motion.div
              style={{ y: useTransform(smoothHeroProgress, [0, 1], ["0%", "-8%"]) }}
              className="absolute top-0 right-[-15%] h-full w-[62%] opacity-[0.09]"
            >
              <OrnamentalPattern dark className="top-[12%] right-0" />
            </motion.div>

            <div className="absolute top-[82px] right-6 left-6 hidden h-px bg-[#F5F1EA]/10 md:right-12 md:left-12 md:block" />

            <motion.div
              style={{ opacity: heroCopyOpacity, y: heroCopyY }}
              className="absolute top-[17%] right-6 left-6 z-20 md:top-[22%] md:left-[8vw] md:max-w-[540px]"
            >
              <SectionEyebrow number={activeSlide.number} dark>
                {activeSlide.category} · COLLECTION
              </SectionEyebrow>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSlide.id}
                  initial={{ opacity: 0, y: 25, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
                  transition={{ duration: 0.8, ease }}
                >
                  <h1 className="luxury-serif mt-9 text-[clamp(4.5rem,12vw,9rem)] leading-[0.7] font-normal tracking-[-0.075em]">
                    <span className="block">{activeSlide.title}</span>
                    <span className="mt-4 block text-[0.55em] text-[#F5F1EA]/55 italic">{activeSlide.accent}</span>
                  </h1>

                  <p className="mt-8 max-w-[380px] text-[12px] leading-5 text-[#F5F1EA]/50 sm:text-sm sm:leading-6">
                    {activeSlide.description}
                  </p>

                  <div className="mt-8">
                    <LuxuryButton dark onClick={() => router.push("/invites")}>
                      Begin Your Collection
                    </LuxuryButton>
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>

            <motion.div
              style={{
                opacity: heroImageOpacity,
                y: useTransform(smoothHeroProgress, [0, 1], ["0%", "8%"]),
              }}
              className="absolute top-[39%] right-[9%] bottom-[7%] left-[30%] z-10 sm:left-[40%] md:top-[13%] md:right-[9%] md:bottom-[8%] md:left-[47%]"
            >
              <div className="relative flex h-full items-center justify-center">
                <div className="absolute inset-[7%] border border-[#B99A68]/25" />
                <div className="absolute inset-[9%] border border-[#F5F1EA]/10" />

                <div className="absolute top-[5%] right-0 hidden md:block">
                  <span className="text-[7px] tracking-[0.3em] text-[#F5F1EA]/35 uppercase">Digital stationery</span>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSlide.id}
                    initial={{ opacity: 0, scale: 0.96, y: 25, rotate: 1 }}
                    animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.985, y: -18 }}
                    transition={{ duration: 0.9, ease }}
                    className="relative z-10 h-[51svh] w-[67vw] max-w-[410px] overflow-hidden border-[5px] border-[#F5F1EA]/90 bg-white shadow-[0_40px_100px_rgba(0,0,0,.30)] sm:h-[57svh] sm:w-[54vw] md:h-[73vh] md:w-[35vw] md:max-w-[520px]"
                  >
                    <motion.div style={{ y: heroImageY, scale: heroImageScale }} className="absolute inset-0">
                      <EditorialImage
                        src={activeSlide.image}
                        alt={`${activeSlide.title} invitation`}
                        sizes="(max-width: 768px) 67vw, 35vw"
                      />
                    </motion.div>
                    <div className="pointer-events-none absolute inset-3 border border-[#3B0A14]/15" />
                  </motion.div>
                </AnimatePresence>

                <div className="absolute bottom-[5%] left-0 hidden md:block">
                  <span className="font-serif text-sm text-[#F5F1EA]/45 italic">Designed to be remembered.</span>
                </div>
              </div>
            </motion.div>

            <div className="absolute right-6 bottom-7 left-6 z-30 flex items-end justify-between md:right-12 md:bottom-10 md:left-12">
              <div className="hidden items-center gap-3 md:flex">
                <ArrowDown className="h-3.5 w-3.5 text-[#B99A68]" />
                <span className="text-[7px] tracking-[0.3em] text-[#F5F1EA]/40 uppercase">Scroll to discover</span>
              </div>

              <div className="ml-auto flex items-center gap-2">
                <button
                  type="button"
                  onClick={previous}
                  aria-label="Previous invitation"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#F5F1EA]/15 text-[#F5F1EA]/55 transition-colors hover:border-[#F5F1EA]/40 hover:text-[#F5F1EA]"
                >
                  <ChevronLeft className="h-4 w-4" strokeWidth={1} />
                </button>

                <div className="flex items-center gap-3 px-3">
                  <div className="h-px w-12 bg-[#F5F1EA]/15 sm:w-20">
                    <motion.div
                      key={activeSlide.id}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 6, ease: "linear" }}
                      className="h-full origin-left bg-[#B99A68]"
                    />
                  </div>
                  <span className="font-serif text-sm text-[#F5F1EA]/75">{activeSlide.number} / 04</span>
                </div>

                <button
                  type="button"
                  onClick={next}
                  aria-label="Next invitation"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#F5F1EA]/15 text-[#F5F1EA]/55 transition-colors hover:border-[#F5F1EA]/40 hover:text-[#F5F1EA]"
                >
                  <ChevronRight className="h-4 w-4" strokeWidth={1} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 02 — BRAND STATEMENT */}
        <section className="relative overflow-hidden bg-[#F5F1EA] px-6 py-28 sm:px-10 sm:py-36 md:px-14 md:py-48">
          <OrnamentalPattern className="right-[-15%] bottom-[-20%] opacity-[0.045]" />

          <div className="relative mx-auto max-w-[1450px]">
            <SectionEyebrow number="02">The Atelier</SectionEyebrow>

            <div className="mt-12 grid gap-12 lg:grid-cols-[1.1fr_.9fr] lg:gap-24">
              <h2 className="luxury-serif max-w-[900px] text-[clamp(4rem,9vw,9rem)] leading-[0.72] tracking-[-0.075em]">
                An invitation
                <br />
                <span className="text-[#3B0A14]/35 italic">to remember.</span>
              </h2>

              <div className="self-end lg:pb-4">
                <p className="max-w-[500px] text-base leading-7 text-[#3B0A14]/60 sm:text-lg sm:leading-8">
                  MomentsEra creates digital invitations with the restraint, detail and atmosphere of beautifully printed stationery.
                </p>
                <p className="mt-6 max-w-[450px] text-sm leading-6 text-[#3B0A14]/40">
                  Your photographs, music, schedule, RSVP and story become one seamless experience — designed to feel personal from the
                  first second.
                </p>
              </div>
            </div>

            <div className="mt-20 grid border-y border-[#3B0A14]/15 sm:grid-cols-3">
              {[
                ["01", "Considered", "Every detail has a purpose."],
                ["02", "Personal", "Built around your occasion."],
                ["03", "Timeless", "Designed beyond the moment."],
              ].map(([number, title, text]) => (
                <div
                  key={number}
                  className="border-b border-[#3B0A14]/10 py-7 sm:border-r sm:border-b-0 sm:px-8 sm:first:pl-0 sm:last:border-r-0"
                >
                  <span className="font-serif text-xl text-[#B99A68]">{number}</span>
                  <h3 className="luxury-serif mt-5 text-2xl">{title}</h3>
                  <p className="mt-2 text-[10px] text-[#3B0A14]/40">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 03 — STAT BAR */}
        <section className="relative overflow-hidden bg-[#3B0A14] text-[#F5F1EA]">
          <OrnamentalPattern dark className="top-[-35%] right-[-12%] opacity-[0.07]" />

          <div className="relative mx-auto grid max-w-[1450px] sm:grid-cols-3">
            {[
              ["120+", "Ways to make it yours"],
              ["24/7", "A beautiful guest experience"],
              ["01", "Invitation. Entirely yours."],
            ].map(([number, label], index) => (
              <div
                key={label}
                className={`px-6 py-12 sm:px-10 sm:py-14 md:px-14 md:py-16 ${
                  index !== 2 ? "border-b sm:border-r sm:border-b-0" : ""
                } border-[#F5F1EA]/12`}
              >
                <span className="luxury-serif text-[clamp(3rem,5vw,5.5rem)] leading-none text-[#F5F1EA]">{number}</span>
                <p className="mt-4 max-w-[180px] text-[8px] tracking-[0.2em] text-[#B99A68] uppercase">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 04 — COLLECTIONS */}
        <section id="collections" ref={collectionsRef} className="relative h-[280vh] bg-[#F5F1EA] text-[#3B0A14]">
          <div className="sticky top-0 flex h-[100svh] min-h-[650px] items-center overflow-hidden">
            <motion.div
              style={{
                y: collectionTitleY,
              }}
              className="absolute top-[10%] left-6 z-20 md:left-12 lg:left-[7vw]"
            >
              <SectionEyebrow number="04">The Collections</SectionEyebrow>

              <h2 className="luxury-serif mt-7 max-w-[700px] text-[clamp(3.8rem,8vw,8rem)] leading-[0.72] tracking-[-0.075em]">
                Find your
                <br />
                <span className="text-[#3B0A14]/35 italic">expression.</span>
              </h2>
            </motion.div>

            <motion.div
              style={{ x: collectionsX }}
              className="relative mt-[15vh] flex w-max items-center gap-5 pr-[10vw] pl-[7vw] sm:gap-8"
            >
              {collections.map((item) => (
                <motion.button
                  key={item.title}
                  type="button"
                  onClick={() => router.push("/invites")}
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 210, damping: 24 }}
                  className="group relative h-[60vh] min-h-[400px] w-[77vw] max-w-[570px] overflow-hidden bg-[#E4DBD0] text-left sm:w-[62vw] md:h-[64vh] md:w-[46vw]"
                >
                  <EditorialImage
                    src={item.image}
                    alt={item.title}
                    sizes="(max-width: 768px) 77vw, 46vw"
                    className="transition-transform duration-[1.5s] group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#1D1013]/90 via-transparent to-[#1D1013]/10" />

                  <div className="absolute top-5 right-5 left-5 flex items-start justify-between">
                    <span className="luxury-serif text-2xl text-white/80">{item.number}</span>
                    <span className="text-[7px] tracking-[0.28em] text-white/65 uppercase">{item.category}</span>
                  </div>

                  <div className="absolute right-6 bottom-6 left-6 text-white md:right-9 md:bottom-9 md:left-9">
                    <p className="text-[7px] tracking-[0.25em] text-white/50 uppercase">{item.description}</p>

                    <div className="mt-5 flex items-end justify-between gap-5">
                      <h3 className="luxury-serif max-w-[430px] text-4xl leading-[0.78] tracking-[-0.055em] sm:text-5xl md:text-6xl">
                        {item.title}
                      </h3>

                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F5F1EA] text-[#3B0A14] transition-transform duration-500 group-hover:rotate-45">
                        <ArrowUpRight className="h-4 w-4" strokeWidth={1.1} />
                      </span>
                    </div>
                  </div>
                </motion.button>
              ))}

              <div className="flex h-[60vh] min-h-[400px] w-[77vw] max-w-[570px] items-center bg-[#3B0A14] px-8 text-[#F5F1EA] sm:w-[62vw] md:h-[64vh] md:w-[42vw] md:px-12">
                <div className="max-w-[390px]">
                  <SectionEyebrow number="05" dark>
                    Complete the experience
                  </SectionEyebrow>

                  <h3 className="luxury-serif mt-8 text-6xl leading-[0.72] tracking-[-0.07em] sm:text-7xl">
                    Your event.
                    <br />
                    <span className="text-[#F5F1EA]/50 italic">Your language.</span>
                  </h3>

                  <p className="mt-8 max-w-[320px] text-sm leading-6 text-[#F5F1EA]/45">
                    Begin with a suite, personalise every detail, and share an invitation that feels unmistakably yours.
                  </p>

                  <div className="mt-9">
                    <LuxuryButton dark onClick={() => router.push("/invites")}>
                      Explore all suites
                    </LuxuryButton>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="absolute right-6 bottom-6 left-6 flex items-center justify-between md:right-12 md:bottom-9 md:left-12">
              <span className="hidden text-[7px] tracking-[0.28em] text-[#3B0A14]/35 uppercase sm:block">Move through the collection</span>

              <div className="h-px w-[32vw] max-w-[420px] bg-[#3B0A14]/15">
                <motion.div style={{ scaleX: collectionsProgress }} className="h-full origin-left bg-[#B99A68]" />
              </div>

              <span className="luxury-serif text-sm text-[#3B0A14]/50">04 / 04</span>
            </div>
          </div>
        </section>

        {/* 05 — HOW IT WORKS */}
        <section className="relative overflow-hidden bg-[#E9E0D5] px-6 py-28 text-[#3B0A14] sm:px-10 sm:py-36 md:px-14 md:py-44">
          <div className="mx-auto max-w-[1450px]">
            <SectionEyebrow number="05">The Process</SectionEyebrow>

            <div className="mt-10 grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-24">
              <h2 className="luxury-serif text-[clamp(3.8rem,8vw,7.5rem)] leading-[0.72] tracking-[-0.075em]">
                Three steps.
                <br />
                <span className="text-[#3B0A14]/35 italic">
                  One beautiful
                  <br />
                  beginning.
                </span>
              </h2>

              <div className="border-t border-[#3B0A14]/15">
                {[
                  {
                    number: "01",
                    title: "Design",
                    text: "Choose the invitation suite that feels like your occasion.",
                  },
                  {
                    number: "02",
                    title: "Personalize",
                    text: "Add your story, photographs, music, schedule and details.",
                  },
                  {
                    number: "03",
                    title: "Deliver",
                    text: "Share one elegant invitation with everyone who matters.",
                  },
                ].map((step) => (
                  <div
                    key={step.number}
                    className="grid grid-cols-[50px_1fr] gap-6 border-b border-[#3B0A14]/15 py-8 sm:grid-cols-[70px_1fr_1fr] sm:gap-8"
                  >
                    <span className="luxury-serif text-xl text-[#B99A68]">{step.number}</span>
                    <h3 className="luxury-serif text-3xl leading-none sm:text-4xl">{step.title}</h3>
                    <p className="col-start-2 max-w-[340px] text-xs leading-5 text-[#3B0A14]/45 sm:col-start-auto">{step.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 06 — EXPERIENCE */}
        <section id="experience" ref={experienceRef} className="relative h-[170vh] bg-[#3B0A14] text-[#F5F1EA]">
          <OrnamentalPattern dark className="right-[-20%] bottom-[-18%] opacity-[0.1]" />

          <div className="sticky top-0 h-[100svh] min-h-[650px] overflow-hidden">
            <motion.div style={{ y: experienceTitleY }} className="absolute top-[9%] right-6 left-6 z-20 md:left-[7vw]">
              <SectionEyebrow number="06" dark>
                The Experience
              </SectionEyebrow>

              <h2 className="luxury-serif mt-7 max-w-[700px] text-[clamp(3.8rem,8vw,7.5rem)] leading-[0.72] tracking-[-0.075em]">
                More than
                <br />
                <span className="text-[#F5F1EA]/45 italic">an invitation.</span>
              </h2>

              <p className="mt-7 max-w-[390px] text-sm leading-6 text-[#F5F1EA]/45">
                Thoughtful details that make the digital experience feel as considered as the event itself.
              </p>
            </motion.div>

            <div className="absolute top-[35%] right-6 bottom-[12%] left-6 md:right-[7vw] md:left-[38%]">
              <div className="grid h-full grid-cols-2 grid-rows-3 gap-x-5 lg:grid-cols-3 lg:grid-rows-2">
                {experiences.map((item, index) => (
                  <FeatureCard
                    key={item.number}
                    number={item.number}
                    title={item.title}
                    description={`${item.eyebrow} · ${item.description}`}
                  />
                ))}
              </div>
            </div>

            <div className="absolute right-6 bottom-6 left-6 flex items-center justify-between md:right-[7vw] md:bottom-9 md:left-[7vw]">
              <LuxuryButton dark onClick={() => router.push("/invites")}>
                Build Your Invitation
              </LuxuryButton>

              <div className="hidden items-center gap-4 md:flex">
                <span className="text-[7px] tracking-[0.28em] text-[#F5F1EA]/35 uppercase">Scroll depth</span>
                <div className="h-px w-28 bg-[#F5F1EA]/15">
                  <motion.div style={{ scaleX: experienceProgress }} className="h-full origin-left bg-[#B99A68]" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 07 — EDITOR */}
        <section
          id="create"
          className="relative overflow-hidden bg-[#F5F1EA] px-6 py-28 text-[#3B0A14] sm:px-10 sm:py-36 md:px-14 md:py-44"
        >
          <OrnamentalPattern className="top-[-25%] right-[-25%] opacity-[0.035]" />

          <div className="relative mx-auto max-w-[1450px]">
            <SectionEyebrow number="07">The Studio</SectionEyebrow>

            <div className="mt-10 grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-end lg:gap-24">
              <div>
                <h2 className="luxury-serif text-[clamp(3.8rem,8vw,7.5rem)] leading-[0.72] tracking-[-0.075em]">
                  Made
                  <br />
                  <span className="text-[#3B0A14]/35 italic">entirely yours.</span>
                </h2>
              </div>

              <div className="max-w-[520px]">
                <p className="text-base leading-7 text-[#3B0A14]/55">
                  Personalize the details that make your invitation feel like you — without losing the elegance of the original design.
                </p>
                <p className="mt-5 text-sm leading-6 text-[#3B0A14]/35">Typography · Colour · Music · Photography · Schedule · RSVP</p>
              </div>
            </div>

            <div className="mt-16 grid overflow-hidden border border-[#3B0A14]/12 bg-white md:grid-cols-[1fr_320px]">
              <div className="relative flex min-h-[560px] items-center justify-center overflow-hidden bg-[#E8DED2] p-8">
                <div className="absolute inset-0 [background-image:linear-gradient(rgba(59,10,20,.35)_1px,transparent_1px),linear-gradient(90deg,rgba(59,10,20,.35)_1px,transparent_1px)] [background-size:34px_34px] opacity-[0.13]" />

                <motion.div
                  whileHover={{ y: -8, rotate: -1 }}
                  transition={{ type: "spring", stiffness: 170, damping: 20 }}
                  className="relative h-[430px] w-[270px] overflow-hidden border-[7px] border-[#F5F1EA] bg-white shadow-[0_40px_90px_rgba(59,10,20,.18)]"
                >
                  <EditorialImage src={mockup} alt="MomentsEra invitation preview" sizes="270px" />
                  <div className="pointer-events-none absolute inset-3 border border-[#3B0A14]/15" />
                </motion.div>

                <span className="absolute top-6 left-6 text-[7px] tracking-[0.28em] text-[#3B0A14]/35 uppercase">Live preview</span>

                <span className="absolute right-6 bottom-6 font-serif text-5xl text-[#3B0A14]/10">01</span>
              </div>

              <aside className="border-t border-[#3B0A14]/10 p-6 md:border-t-0 md:border-l md:p-8">
                <div className="flex items-center justify-between border-b border-[#3B0A14]/12 pb-5">
                  <span className="text-[8px] tracking-[0.28em] text-[#3B0A14]/45 uppercase">Customize</span>
                  <span className="luxury-serif text-xl text-[#B99A68]">05</span>
                </div>

                {["Typography", "Colour", "Photography", "Music", "Sections"].map((item, index) => (
                  <button
                    key={item}
                    type="button"
                    className="flex w-full items-center justify-between border-b border-[#3B0A14]/10 py-5 text-left transition-colors hover:border-[#3B0A14]/30"
                  >
                    <span className="text-[10px] text-[#3B0A14]/60">{item}</span>
                    <span className="luxury-serif text-sm text-[#B99A68]">{index === 0 ? "Aa" : "+"}</span>
                  </button>
                ))}

                <div className="mt-7">
                  <LuxuryButton onClick={() => router.push("/invites")}>Start Designing</LuxuryButton>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* 08 — RESPONSIVE */}
        <section className="relative overflow-hidden bg-[#E9E0D5] px-6 py-28 text-[#3B0A14] sm:px-10 sm:py-36 md:px-14 md:py-44">
          <div className="mx-auto grid max-w-[1450px] items-center gap-16 lg:grid-cols-[.75fr_1.25fr] lg:gap-24">
            <div>
              <SectionEyebrow number="08">Every Screen</SectionEyebrow>

              <h2 className="luxury-serif mt-8 text-[clamp(3.8rem,8vw,7rem)] leading-[0.72] tracking-[-0.075em]">
                One story.
                <br />
                <span className="text-[#3B0A14]/35 italic">Everywhere.</span>
              </h2>

              <p className="mt-8 max-w-[400px] text-sm leading-6 text-[#3B0A14]/45">
                Carefully composed for phones, tablets and desktops so every guest receives the same considered experience.
              </p>

              <div className="mt-9">
                <LuxuryButton onClick={() => router.push("/invites")}>Explore Invitations</LuxuryButton>
              </div>
            </div>

            <div className="relative min-h-[560px] overflow-hidden bg-[#F5F1EA]">
              <OrnamentalPattern className="opacity-[0.045]" />

              <motion.div
                whileInView={{ y: [25, 0], opacity: [0, 1] }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease }}
                className="absolute top-12 left-[6%] hidden h-[320px] w-[610px] overflow-hidden border-[6px] border-[#3B0A14]/10 bg-white p-2 shadow-[0_35px_80px_rgba(59,10,20,.14)] sm:block"
              >
                <EditorialImage src={mockup2} alt="Desktop invitation" sizes="610px" />
              </motion.div>

              <motion.div
                whileInView={{ y: [35, 0], rotate: [3, 1.5] }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: 0.12, ease }}
                className="absolute right-[9%] bottom-8 z-20 h-[410px] w-[205px] overflow-hidden border-[7px] border-[#3B0A14]/10 bg-white p-2 shadow-[0_35px_80px_rgba(59,10,20,.18)]"
              >
                <EditorialImage src={mockup} alt="Mobile invitation" sizes="205px" />
              </motion.div>

              <span className="absolute top-7 right-7 border border-[#3B0A14]/15 bg-[#F5F1EA]/90 px-4 py-2 text-[7px] tracking-[0.24em] text-[#3B0A14]/45 uppercase backdrop-blur-sm">
                Adaptive / 01
              </span>
            </div>
          </div>
        </section>

        {/* 09 — FINAL CTA */}
        <section className="relative min-h-[88svh] overflow-hidden bg-[#3B0A14] text-[#F5F1EA]">
          <OrnamentalPattern dark className="top-[10%] right-[-10%] opacity-[0.1]" />

          <div className="relative flex min-h-[88svh] flex-col items-center justify-center px-6 py-28 text-center sm:px-10">
            <div className="absolute top-8 right-6 left-6 flex items-center justify-between md:right-12 md:left-12">
              <SectionEyebrow number="09" dark>
                Begin
              </SectionEyebrow>
              <span className="luxury-serif text-xl text-[#F5F1EA]/40">MomentsEra</span>
            </div>

            <p className="text-[8px] tracking-[0.4em] text-[#B99A68] uppercase">Your occasion deserves a beautiful beginning</p>

            <h2 className="luxury-serif mt-9 text-[clamp(4.8rem,11vw,11rem)] leading-[0.67] tracking-[-0.08em]">
              Begin
              <br />
              <span className="text-[#F5F1EA]/50 italic">beautifully.</span>
            </h2>

            <p className="mx-auto mt-10 max-w-[450px] text-sm leading-6 text-[#F5F1EA]/40">
              Choose your suite, make it personal, and send an invitation that feels like the first page of the celebration.
            </p>

            <div className="mt-10">
              <LuxuryButton dark onClick={() => router.push("/invites")}>
                Begin Your Collection
              </LuxuryButton>
            </div>

            <div className="absolute right-6 bottom-7 left-6 flex items-end justify-between md:right-12 md:bottom-10 md:left-12">
              <div className="text-left">
                <p className="text-[7px] tracking-[0.28em] text-[#F5F1EA]/30 uppercase">MomentsEra</p>
                <p className="mt-2 text-[8px] text-[#F5F1EA]/20">Digital invitations for meaningful occasions</p>
              </div>
              <span className="luxury-serif text-xl text-[#F5F1EA]/30">09 / 09</span>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
