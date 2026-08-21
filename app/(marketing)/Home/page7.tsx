"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Image, { type StaticImageData } from "next/image";
import { AnimatePresence, motion, useScroll, useSpring, useTransform, type MotionValue, type Variants } from "framer-motion";
import { ArrowDown, ArrowUpRight, ChevronLeft, ChevronRight, MousePointer2, Sparkles } from "lucide-react";

import { Header } from "../components/header/Header";
import { Footer } from "../components/footer/Footer";

import mockup from "../../../public/images/banner/mockup.png";
import mockup1 from "../../../public/images/banner/mockup1.png";
import mockup2 from "../../../public/images/banner/mockup2.png";
import grid from "../../../public/images/banner/grid.jpg";

import celeb1 from "../../../public/images/celebrations/1.webp";
import celeb2 from "../../../public/images/celebrations/2.webp";
import celeb3 from "../../../public/images/celebrations/3.webp";
import celeb4 from "../../../public/images/celebrations/4.webp";

import HeartBeat from "../../[event_key]/invites/catalog/components/icons/Heart";
import AudioPlayerWave from "../../[event_key]/invites/catalog/components/icons/AudioPlayerWave";
import AnimatedGalleryIcon from "../../[event_key]/invites/catalog/components/icons/AnimatedGalleryIcon";
import AnimatedLockIcon from "../../[event_key]/invites/catalog/components/icons/AnimatedLockIcon";
import AnimatedFlipClock from "../../[event_key]/invites/catalog/components/icons/AnimatedFlipClock";

const ease = [0.19, 1, 0.22, 1] as const;

const reveal: Variants = {
  hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease },
  },
};

type HeroSlide = {
  id: string;
  number: string;
  category: string;
  title: string;
  accent: string;
  description: string;
  image: StaticImageData;
  background: string;
  foreground: string;
};

const heroSlides: HeroSlide[] = [
  {
    id: "eternal",
    number: "01",
    category: "WEDDING COLLECTION",
    title: "Eternal",
    accent: "Moments",
    description: "An editorial invitation experience for the beginning of forever.",
    image: mockup,
    background: "#eee8dc",
    foreground: "#1f1c18",
  },
  {
    id: "afterglow",
    number: "02",
    category: "CELEBRATION COLLECTION",
    title: "Afterglow",
    accent: "Stories",
    description: "A warm, cinematic invitation designed around the memories you create.",
    image: mockup1,
    background: "#e8e9e3",
    foreground: "#20231f",
  },
  {
    id: "heirloom",
    number: "03",
    category: "SIGNATURE COLLECTION",
    title: "Heirloom",
    accent: "Elegance",
    description: "Classic typography, refined details, and a celebration worth remembering.",
    image: mockup2,
    background: "#e9e1dc",
    foreground: "#251f1c",
  },
  {
    id: "gallery",
    number: "04",
    category: "MODERN COLLECTION",
    title: "Gallery",
    accent: "Edition",
    description: "A contemporary digital invitation where photographs become the story.",
    image: grid,
    background: "#e4e6e9",
    foreground: "#1c2025",
  },
];

const collections = [
  { title: "Luxury Wedding Invites", category: "Wedding", image: celeb1 },
  { title: "Birthday Experiences", category: "Birthday", image: celeb2 },
  { title: "Elegant Anniversary Stories", category: "Anniversary", image: celeb3 },
  { title: "Corporate Event Invitations", category: "Corporate", image: celeb4 },
];

const experienceCards: {
  code: string;
  title: string;
  desc: string;
  icon: ReactNode;
}[] = [
  {
    code: "M/01",
    title: "Music",
    desc: "Give the invitation its own soundtrack.",
    icon: <AudioPlayerWave />,
  },
  {
    code: "M/02",
    title: "Gallery",
    desc: "Turn memories into a visual story.",
    icon: <AnimatedGalleryIcon />,
  },
  {
    code: "M/03",
    title: "Countdown",
    desc: "Build anticipation to the moment.",
    icon: <AnimatedFlipClock />,
  },
  {
    code: "M/04",
    title: "Privacy",
    desc: "Protect private celebration details.",
    icon: <AnimatedLockIcon />,
  },
  {
    code: "M/05",
    title: "Wishes",
    desc: "Collect messages from your guests.",
    icon: <HeartBeat />,
  },
  {
    code: "M/06",
    title: "Motion",
    desc: "Give every section a cinematic entrance.",
    icon: <Sparkles className="h-7 w-7" strokeWidth={1} />,
  },
];

function PortalButton({ children, onClick, dark = false }: { children: ReactNode; onClick?: () => void; dark?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full group relative inline-flex items-center gap-5 overflow-hidden border px-3 py-2 text-[9px] tracking-[0.24em] uppercase transition-all duration-500 ${
        dark ? "border-white/15 text-white hover:border-white/35" : "border-black/15 text-black hover:border-black/35"
      }`}
    >
      <span className={`absolute inset-y-0 left-0 w-0 transition-all duration-500 group-hover:w-full ${dark ? "bg-white" : "bg-black"}`} />
      <span className={`relative z-10 pl-3 transition-colors duration-500 ${dark ? "group-hover:text-black" : "group-hover:text-white"}`}>
        {children}
      </span>
      <span
        className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full transition-all duration-500 group-hover:rotate-45 ${
          dark
            ? "bg-white text-black group-hover:bg-black group-hover:text-white"
            : "bg-black text-white group-hover:bg-white group-hover:text-black"
        }`}
      >
        <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.4} />
      </span>
    </button>
  );
}

function ParallaxImage({
  src,
  alt,
  className = "",
  y,
  scale,
}: {
  src: StaticImageData;
  alt: string;
  className?: string;
  y?: MotionValue<string>;
  scale?: MotionValue<number>;
}) {
  return (
    <motion.div style={{ y, scale }} className={`absolute inset-0 ${className}`}>
      <Image src={src} alt={alt} fill sizes="(max-width: 768px) 90vw, 55vw" className="object-contain" />
    </motion.div>
  );
}

export default function Home() {
  const router = useRouter();
  const heroRef = useRef<HTMLElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end end"],
  });

  // GPU-friendly 2D parallax only. No WebGL / Three.js.
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.35,
  });

  const heroImageY = useTransform(smoothProgress, [0, 1], ["0%", "-26%"]);
  const heroImageScale = useTransform(smoothProgress, [0, 0.65, 1], [1, 1.08, 1.14]);
  const heroGhostLeftX = useTransform(smoothProgress, [0, 1], ["0%", "-34%"]);
  const heroGhostRightX = useTransform(smoothProgress, [0, 1], ["0%", "34%"]);
  const heroHeadlineY = useTransform(smoothProgress, [0, 0.3], ["0px", "-90px"]);
  const heroHeadlineOpacity = useTransform(smoothProgress, [0, 0.24, 0.42], [1, 1, 0]);
  const heroHudOpacity = useTransform(smoothProgress, [0, 0.12, 0.35], [1, 1, 0]);
  const heroPanelY = useTransform(smoothProgress, [0, 1], ["0%", "18%"]);

  const activeSlide = heroSlides[activeIndex];

  useEffect(() => {
    if (isPaused) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % heroSlides.length);
    }, 5200);

    return () => window.clearInterval(timer);
  }, [isPaused]);

  const previous = () => {
    setActiveIndex((current) => (current - 1 + heroSlides.length) % heroSlides.length);
  };

  const next = () => {
    setActiveIndex((current) => (current + 1) % heroSlides.length);
  };

  return (
    <main className="relative overflow-x-clip bg-[#090a0a] text-white selection:bg-white selection:text-black">
      <Header />

      {/* ================================================================
          FAST CINEMATIC HERO
          2D CSS/Framer parallax only — no Three.js/WebGL.
      ================================================================= */}
      <section ref={heroRef} onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)} className="relative h-[300vh]">
        <div className="sticky top-0 h-[calc(100svh-72px)] min-h-[650px] overflow-hidden bg-[#090a0a]">
          <div className="pointer-events-none absolute inset-0 z-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_62%_45%,rgba(255,255,255,.12),transparent_25%),radial-gradient(circle_at_50%_80%,rgba(184,161,122,.10),transparent_30%)]" />
            <div className="absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,.3)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.3)_1px,transparent_1px)] [background-size:80px_80px] opacity-[0.08]" />
          </div>

          <motion.div
            style={{ opacity: heroHudOpacity }}
            className="absolute top-7 right-5 left-5 z-30 flex items-start justify-between md:right-10 md:left-10"
          >
            <div>
              <div className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-[#b9a47b] shadow-[0_0_12px_#b9a47b]" />
                <span className="text-[8px] tracking-[0.32em] text-white/45 uppercase">MomentsEra / Spatial Studio</span>
              </div>
              <div className="mt-3 text-[8px] tracking-[0.25em] text-white/20 uppercase">Digital experiences for meaningful occasions</div>
            </div>

            <div className="text-right">
              <div className="text-[8px] tracking-[0.25em] text-white/30 uppercase">Collection</div>
              <div className="mt-1 text-xs font-semibold tracking-[0.2em]">{activeSlide.number} / 04</div>
            </div>
          </motion.div>

          {/* Main headline */}
          <motion.div
            style={{
              opacity: heroHeadlineOpacity,
              y: heroHeadlineY,
            }}
            className="absolute top-[16%] left-5 z-20 max-w-[570px] md:left-10 lg:left-[7vw]"
          >
            <motion.p initial="hidden" animate="show" variants={reveal} className="text-[9px] tracking-[0.4em] text-white/40 uppercase">
              The digital invitation studio
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 45, filter: "blur(12px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1, delay: 0.1, ease }}
              className="mt-7 text-[clamp(4.2rem,10vw,10rem)] leading-[0.72] font-black tracking-[-0.085em]"
            >
              Moments
              <br />
              <span className="[font-family:var(--font-windsong)] text-[0.7em] font-light tracking-normal text-white/65">alive.</span>
            </motion.h1>

            <p className="mt-9 max-w-[370px] text-sm leading-6 text-white/40">
              Premium digital invitations designed as interactive experiences, not static cards.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-5">
              <PortalButton dark onClick={() => router.push("/invites")}>
                Enter the collection
              </PortalButton>

              <button
                onClick={() => router.push("/invites")}
                className="group flex items-center gap-3 text-[9px] tracking-[0.22em] text-white/40 uppercase transition-colors hover:text-white"
              >
                Browse templates
                <span className="h-px w-8 bg-white/25 transition-all group-hover:w-14 group-hover:bg-white/70" />
              </button>
            </div>
          </motion.div>

          {/* Parallax composition */}
          <motion.div
            style={{
              y: heroPanelY,
              opacity: useTransform(smoothProgress, [0, 0.18, 0.55], [1, 1, 0]),
            }}
            className="absolute inset-y-[10%] right-[-10%] left-[27%] z-10 md:right-[1%] md:left-[32%] lg:left-[34%]"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                style={{
                  x: heroGhostLeftX,
                  y: useTransform(smoothProgress, [0, 1], ["0%", "-8%"]),
                }}
                className="absolute left-[5%] h-[64%] w-[25%] overflow-hidden border border-white/10 bg-white/[0.03] opacity-45 blur-[0.2px]"
              >
                <Image
                  src={heroSlides[(activeIndex - 1 + heroSlides.length) % heroSlides.length].image}
                  alt=""
                  fill
                  sizes="25vw"
                  className="object-contain"
                />
              </motion.div>

              <motion.div
                style={{
                  x: heroGhostRightX,
                  y: useTransform(smoothProgress, [0, 1], ["0%", "8%"]),
                }}
                className="absolute right-[5%] h-[60%] w-[24%] overflow-hidden border border-white/10 bg-white/[0.03] opacity-40"
              >
                <Image src={heroSlides[(activeIndex + 1) % heroSlides.length].image} alt="" fill sizes="24vw" className="object-contain" />
              </motion.div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSlide.id}
                  initial={{ opacity: 0, y: 30, scale: 0.94, rotate: 1.5 }}
                  animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, y: -20, scale: 0.97 }}
                  transition={{ duration: 0.8, ease }}
                  className="relative z-10 h-[70vh] w-[62vw] max-w-[690px] sm:w-[54vw] lg:h-[76vh] lg:w-[39vw]"
                >
                  <ParallaxImage src={activeSlide.image} alt={`${activeSlide.title} invitation`} y={heroImageY} scale={heroImageScale} />

                  <div className="pointer-events-none absolute inset-[7%] border border-white/15" />
                  <div className="pointer-events-none absolute top-[17%] -right-5 h-px w-16 bg-white/25" />
                  <div className="pointer-events-none absolute bottom-[22%] -left-5 h-px w-16 bg-white/25" />
                </motion.div>
              </AnimatePresence>

              {/* Unique floating UI tags */}
              <motion.div
                style={{
                  y: useTransform(smoothProgress, [0, 1], ["0%", "-70%"]),
                  x: useTransform(smoothProgress, [0, 1], ["0%", "20%"]),
                }}
                className="absolute top-[20%] right-[5%] z-20 hidden border border-white/15 bg-black/35 px-4 py-3 backdrop-blur-xl md:block"
              >
                <span className="block text-[7px] tracking-[0.25em] text-white/30 uppercase">Memory</span>
                <span className="mt-1 block text-[10px] text-white/75">Photo gallery</span>
              </motion.div>

              <motion.div
                style={{
                  y: useTransform(smoothProgress, [0, 1], ["0%", "60%"]),
                  x: useTransform(smoothProgress, [0, 1], ["0%", "-20%"]),
                }}
                className="rounded-lg absolute bottom-[20%] left-[4%] z-20 hidden border border-white/15 bg-black/35 px-4 py-3 backdrop-blur-xl md:block"
              >
                <span className="block text-[7px] tracking-[0.25em] text-white/30 uppercase">Experience</span>
                <span className="mt-1 block text-[10px] text-white/75">Personal soundtrack</span>
              </motion.div>

              <motion.div
                style={{
                  y: useTransform(smoothProgress, [0, 1], ["0%", "45%"]),
                  x: useTransform(smoothProgress, [0, 1], ["0%", "18%"]),
                }}
                className="absolute right-[3%] bottom-[28%] z-20 hidden border border-white/15 bg-white/90 px-4 py-3 text-black backdrop-blur-xl md:block"
              >
                <span className="block text-[7px] tracking-[0.25em] text-black/35 uppercase">Guests</span>
                <span className="mt-1 block text-[10px] font-medium">Smart RSVP</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Scene message */}
          <motion.div
            style={{ opacity: heroHudOpacity }}
            className="absolute right-5 bottom-28 z-30 hidden max-w-[210px] text-right md:right-10 lg:block"
          >
            <p className="text-[8px] tracking-[0.3em] text-white/25 uppercase">Scroll / Explore</p>
            <p className="mt-2 text-xs leading-5 text-white/45">Watch the invitation unfold as you move through the page.</p>
          </motion.div>

          {/* Left bottom interactive cue */}
          <motion.button
            style={{ opacity: heroHudOpacity }}
            onClick={() => router.push("/invites")}
            className="absolute bottom-8 left-5 z-30 flex items-center gap-3 text-left md:left-10"
          >
            <span className="rounded-full flex h-11 w-11 items-center justify-center border border-white/15 bg-white/[0.04] text-white/60 backdrop-blur-md transition-all hover:border-white/40 hover:bg-white hover:text-black">
              <MousePointer2 className="h-4 w-4" />
            </span>
            <span>
              <span className="block text-[7px] tracking-[0.25em] text-white/25 uppercase">Interactive</span>
              <span className="mt-1 block text-[9px] text-white/55">Explore invitations</span>
            </span>
          </motion.button>

          {/* Right scroll rail */}
          <motion.div
            style={{ opacity: heroHudOpacity }}
            className="absolute top-1/2 right-5 z-30 hidden -translate-y-1/2 flex-col items-center gap-4 md:flex"
          >
            <span className="text-[7px] tracking-[0.3em] text-white/25 uppercase [writing-mode:vertical-rl]">Scroll</span>
            <div className="h-24 w-px bg-white/10">
              <motion.div style={{ scaleY: smoothProgress }} className="h-full w-full origin-top bg-white/70" />
            </div>
            <span className="text-[8px] text-white/30">03</span>
          </motion.div>

          {/* Carousel controls */}
          <div className="absolute right-5 bottom-7 z-30 flex items-center gap-2 md:right-10">
            <div className="mr-3 hidden items-center gap-2 md:flex">
              {heroSlides.map((slide, index) => (
                <button
                  key={slide.id}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Show ${slide.title}`}
                  className="group flex h-7 items-center"
                >
                  <span
                    className={`h-px transition-all duration-500 ${
                      index === activeIndex ? "w-10 bg-white" : "w-4 bg-white/20 group-hover:w-7 group-hover:bg-white/50"
                    }`}
                  />
                </button>
              ))}
            </div>

            <button
              aria-label="Previous collection"
              onClick={previous}
              className="flex h-10 w-10 items-center justify-center border border-white/10 bg-white/[0.03] text-white/45 backdrop-blur-md transition-all hover:border-white/35 hover:bg-white hover:text-black"
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={1.2} />
            </button>

            <div className="px-2 text-[8px] tracking-[0.2em] text-white/35">{activeSlide.number} / 04</div>

            <button
              aria-label="Next collection"
              onClick={next}
              className="flex h-10 w-10 items-center justify-center border border-white/10 bg-white/[0.03] text-white/45 backdrop-blur-md transition-all hover:border-white/35 hover:bg-white hover:text-black"
            >
              <ChevronRight className="h-4 w-4" strokeWidth={1.2} />
            </button>
          </div>

          <motion.div
            animate={{ y: [0, 7, 0] }}
            transition={{ duration: 1.7, repeat: Infinity }}
            className="absolute bottom-8 left-1/2 z-30 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex"
          >
            <span className="text-[7px] tracking-[0.3em] text-white/25 uppercase">Continue</span>
            <ArrowDown className="h-3.5 w-3.5 text-white/35" />
          </motion.div>
        </div>
      </section>

      {/* ================================================================
          IDEA
      ================================================================= */}
      <section className="relative z-10 bg-[#f3f0e9] px-5 py-32 text-[#101110] md:px-10 md:py-44">
        <div className="mx-auto grid max-w-[1500px] gap-20 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="text-[9px] tracking-[0.35em] uppercase opacity-35">01 / The idea</p>
            <h2 className="mt-6 text-5xl leading-[0.82] font-black tracking-[-0.08em] sm:text-7xl">
              Not a card.
              <br />
              <span className="opacity-25">A world.</span>
            </h2>
          </div>

          <div>
            <p className="max-w-[720px] text-xl leading-relaxed text-black/60 md:text-3xl">
              We design digital invitations as small interactive worlds — combining typography, photography, motion and technology into
              something guests actually want to explore.
            </p>

            <div className="mt-14 flex flex-wrap gap-2">
              {["Design", "Motion", "Story", "Technology"].map((item, index) => (
                <button
                  key={item}
                  onClick={() => router.push("/invites")}
                  className="group flex items-center gap-3 border border-black/10 bg-white px-4 py-3 transition-all duration-300 hover:-translate-y-1 hover:border-black/30 hover:shadow-[0_15px_35px_rgba(0,0,0,.07)]"
                >
                  <span className="text-[7px] opacity-30">0{index + 1}</span>
                  <span className="text-[9px] tracking-[0.2em] uppercase">{item}</span>
                  <ArrowUpRight className="h-3 w-3 opacity-20 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-70" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          COLLECTIONS
      ================================================================= */}
      <section className="relative z-10 bg-[#f8f7f4] px-5 py-28 text-[#101110] md:px-10 md:py-36">
        <div className="mx-auto max-w-[1500px]">
          <div className="mb-12 flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-end">
            <div>
              <p className="text-[9px] tracking-[0.35em] uppercase opacity-35">02 / Collections</p>
              <h2 className="mt-5 text-5xl font-black tracking-[-0.075em] sm:text-7xl">
                Pick your
                <br />
                <span className="opacity-25">visual language.</span>
              </h2>
            </div>

            <PortalButton onClick={() => router.push("/invites")}>View all</PortalButton>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
            {collections.map((item, index) => (
              <motion.button
                key={item.title}
                onClick={() => router.push("/invites")}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.65, delay: index * 0.06 }}
                whileHover={{ y: -9 }}
                className="group relative aspect-[4/5] overflow-hidden bg-[#e7e2d8] text-left shadow-[0_25px_80px_rgba(0,0,0,.08)]"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-[1s] group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-75" />

                <div className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center border border-white/25 bg-black/15 text-white backdrop-blur-md transition-all group-hover:rotate-45 group-hover:bg-white group-hover:text-black">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </div>

                <div className="absolute right-5 bottom-5 left-5 text-white">
                  <p className="text-[7px] tracking-[0.3em] uppercase opacity-55">{item.category}</p>
                  <h3 className="mt-2 text-base leading-tight font-bold tracking-[-0.03em] md:text-xl">{item.title}</h3>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          EXPERIENCE SYSTEM
      ================================================================= */}
      <section className="relative z-10 overflow-hidden bg-white px-5 py-32 text-[#101110] md:px-10 md:py-40">
        <div className="mx-auto max-w-[1500px]">
          <div className="grid gap-16 lg:grid-cols-[0.72fr_1.28fr]">
            <div className="lg:sticky lg:top-24 lg:h-fit">
              <p className="text-[9px] tracking-[0.35em] uppercase opacity-35">03 / Experience system</p>

              <h2 className="mt-6 text-5xl leading-[0.82] font-black tracking-[-0.08em] sm:text-7xl">
                Every detail
                <br />
                <span className="[font-family:var(--font-windsong)] font-light tracking-normal opacity-55">has a purpose.</span>
              </h2>

              <p className="mt-8 max-w-[390px] text-sm leading-6 opacity-50">
                Build a richer guest experience with carefully designed interaction modules.
              </p>

              <div className="mt-10">
                <PortalButton onClick={() => router.push("/invites")}>Build your invite</PortalButton>
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              {experienceCards.map((item, index) => (
                <motion.div
                  key={item.code}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.55, delay: index * 0.04 }}
                  className="group relative min-h-[245px] overflow-hidden border border-black/8 bg-[#f8f8f7] p-6 transition-all duration-500 hover:-translate-y-1 hover:bg-black hover:text-white hover:shadow-[0_30px_80px_rgba(0,0,0,.13)]"
                >
                  <div className="flex items-start justify-between">
                    <span className="text-[8px] tracking-[0.25em] opacity-30">{item.code}</span>
                    <div className="flex h-11 w-11 items-center justify-center border border-black/10 bg-white transition-all group-hover:border-white/15 group-hover:bg-white/10">
                      {item.icon}
                    </div>
                  </div>

                  <div className="absolute right-6 bottom-6 left-6">
                    <h3 className="text-lg font-bold tracking-[-0.03em]">{item.title}</h3>
                    <p className="mt-2 max-w-[230px] text-xs leading-5 opacity-45 group-hover:opacity-55">{item.desc}</p>
                  </div>

                  <ArrowUpRight className="absolute right-6 bottom-6 h-4 w-4 opacity-0 transition-all duration-500 group-hover:-translate-y-1 group-hover:opacity-60" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          EDITOR
      ================================================================= */}
      <section className="relative z-10 overflow-hidden bg-[#e8e4dc] px-5 py-32 text-[#101110] md:px-10 md:py-40">
        <div className="mx-auto max-w-[1500px]">
          <div className="mb-14 max-w-[700px]">
            <p className="text-[9px] tracking-[0.35em] uppercase opacity-35">04 / Editor</p>
            <h2 className="mt-6 text-5xl leading-[0.82] font-black tracking-[-0.08em] sm:text-7xl">
              Design it
              <br />
              <span className="[font-family:var(--font-windsong)] font-light tracking-normal opacity-55">your way.</span>
            </h2>
          </div>

          <div className="relative overflow-hidden border border-black/10 bg-[#161717] p-2 shadow-[0_45px_130px_rgba(0,0,0,.18)] md:p-3">
            <div className="flex h-10 items-center justify-between border-b border-white/10 px-4 text-white/35">
              <div className="flex gap-1.5">
                <span className="h-2 w-2 rounded-full bg-white/15" />
                <span className="h-2 w-2 rounded-full bg-white/15" />
                <span className="h-2 w-2 rounded-full bg-white/15" />
              </div>
              <span className="text-[8px] tracking-[0.3em] uppercase">MomentsEra Editor</span>
              <span className="flex items-center gap-2 text-[8px]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#8eb9a6]" />
                Live
              </span>
            </div>

            <div className="grid min-h-[510px] grid-cols-[58px_1fr] md:grid-cols-[72px_1fr_260px]">
              <aside className="border-r border-white/10 py-5">
                {["⌂", "✦", "◫", "◌", "♪", "⚙"].map((item, index) => (
                  <button
                    key={item}
                    aria-label={`Editor tool ${index + 1}`}
                    className={`mx-auto mb-3 flex h-10 w-10 items-center justify-center border text-sm transition-all ${
                      index === 1
                        ? "border-white bg-white text-black"
                        : "border-transparent text-white/30 hover:border-white/10 hover:text-white"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </aside>

              <div className="relative flex items-center justify-center overflow-hidden bg-[#202121] p-7 md:p-12">
                <div className="absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.06)_1px,transparent_1px)] [background-size:32px_32px] opacity-20" />

                <motion.div
                  whileHover={{ y: -8, rotate: -1 }}
                  transition={{ type: "spring", stiffness: 180, damping: 20 }}
                  className="relative h-[390px] w-[245px] overflow-hidden border-[7px] border-[#292929] bg-white p-1 shadow-[0_40px_80px_rgba(0,0,0,.4)]"
                >
                  <div className="relative h-full w-full overflow-hidden bg-[#eee8dc]">
                    <Image src={mockup} alt="Invitation editor preview" fill sizes="245px" className="object-contain" />
                  </div>
                </motion.div>

                <div className="absolute right-5 bottom-5 hidden border border-white/10 bg-white/5 px-4 py-3 text-white backdrop-blur-md md:block">
                  <p className="text-[7px] tracking-[0.25em] text-white/30 uppercase">Preview</p>
                  <p className="mt-1 text-[9px]">Live changes enabled</p>
                </div>
              </div>

              <aside className="hidden border-l border-white/10 p-5 md:block">
                <div className="mb-5 flex items-center justify-between">
                  <p className="text-[8px] tracking-[0.25em] text-white/35 uppercase">Customize</p>
                  <span className="text-[8px] text-white/20">05</span>
                </div>

                {["Typography", "Colors", "Background", "Music", "Sections"].map((item, index) => (
                  <button
                    key={item}
                    className="mb-2 flex w-full items-center justify-between border border-white/8 bg-white/[0.03] p-3 text-left transition-all hover:bg-white/[0.08]"
                  >
                    <span className="text-[10px] text-white/65">{item}</span>
                    <span className="text-[9px] text-white/25">{index === 0 ? "Aa" : "+"}</span>
                  </button>
                ))}

                <button
                  onClick={() => router.push("/invites")}
                  className="group mt-4 flex w-full items-center justify-between border border-white/15 bg-white px-3 py-2 text-[8px] tracking-[0.2em] text-black uppercase"
                >
                  <span className="pl-2">Start designing</span>
                  <span className="flex h-8 w-8 items-center justify-center bg-black text-white transition-transform group-hover:rotate-45">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </button>
              </aside>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          RESPONSIVE
      ================================================================= */}
      <section className="relative z-10 overflow-hidden bg-white px-5 py-32 text-[#101110] md:px-10 md:py-40">
        <div className="mx-auto grid max-w-[1500px] items-center gap-16 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <p className="text-[9px] tracking-[0.35em] uppercase opacity-35">05 / Responsive</p>
            <h2 className="mt-6 text-5xl leading-[0.82] font-black tracking-[-0.08em] sm:text-7xl">
              Beautiful
              <br />
              <span className="opacity-25">everywhere.</span>
            </h2>

            <p className="mt-8 max-w-[390px] text-sm leading-6 opacity-50">
              One invitation. Every screen. Every guest gets the same considered experience.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-6">
              <PortalButton onClick={() => router.push("/invites")}>Explore invites</PortalButton>

              <span className="text-[8px] tracking-[0.25em] uppercase opacity-35">Mobile / Tablet / Desktop</span>
            </div>
          </div>

          <div className="relative min-h-[560px] overflow-hidden bg-[#ece8df]">
            <motion.div
              whileInView={{ y: [20, 0], opacity: [0, 1] }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease }}
              className="absolute top-16 left-[7%] hidden h-[330px] w-[610px] overflow-hidden border-[6px] border-[#202020] bg-[#101010] p-2 shadow-[0_35px_80px_rgba(0,0,0,.18)] sm:block"
            >
              <div className="relative h-full w-full overflow-hidden bg-white">
                <Image src={mockup2} alt="Desktop invitation" fill sizes="610px" className="object-contain" />
              </div>
            </motion.div>

            <motion.div
              whileInView={{ y: [30, 0], rotate: [3, 1.5] }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.12, ease }}
              className="absolute right-[9%] bottom-8 z-20 h-[410px] w-[205px] overflow-hidden border-[7px] border-[#202020] bg-[#101010] p-2 shadow-[0_35px_80px_rgba(0,0,0,.22)]"
            >
              <div className="absolute top-0 left-1/2 z-10 h-5 w-16 -translate-x-1/2 bg-[#202020]" />
              <div className="relative h-full w-full overflow-hidden bg-white">
                <Image src={mockup} alt="Mobile invitation" fill sizes="205px" className="object-contain" />
              </div>
            </motion.div>

            <div className="absolute top-8 right-8 border border-black/10 bg-white px-4 py-2 text-[7px] tracking-[0.22em] uppercase shadow-sm">
              Adaptive / 01
            </div>

            <div className="absolute bottom-8 left-8 hidden border-l border-black/20 pl-4 md:block">
              <p className="text-[7px] tracking-[0.25em] uppercase opacity-35">Same story</p>
              <p className="mt-1 text-xs opacity-60">Reframed for every screen.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          FINAL CTA
      ================================================================= */}
      <section className="relative z-10 overflow-hidden bg-[#090a0a] px-5 py-44 text-center text-white md:py-56">
        <div className="absolute inset-0 [background-image:radial-gradient(circle_at_center,rgba(255,255,255,.2),transparent_34%)] opacity-30" />

        <div className="relative mx-auto max-w-[1100px]">
          <p className="text-[9px] tracking-[0.4em] text-white/35 uppercase">06 / Begin</p>

          <h2 className="mt-8 text-[clamp(4rem,10vw,10rem)] leading-[0.72] font-black tracking-[-0.085em]">
            Make it
            <br />
            <span className="[font-family:var(--font-windsong)] font-light tracking-normal text-white/65">yours.</span>
          </h2>

          <p className="mx-auto mt-10 max-w-[430px] text-sm leading-6 text-white/35">
            Choose a visual language, shape the experience, and publish a digital invitation made for your moment.
          </p>

          <div className="mt-10 flex justify-center">
            <PortalButton dark onClick={() => router.push("/invites")}>
              Create your invitation
            </PortalButton>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
