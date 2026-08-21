"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Image, { type StaticImageData } from "next/image";
import { AnimatePresence, motion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { ArrowDown, ArrowUpRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

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
    description: "An invitation experience designed around the beginning of forever.",
    image: mockup,
  },
  {
    id: "afterglow",
    number: "02",
    category: "BIRTHDAY",
    title: "Afterglow",
    accent: "Stories",
    description: "A warm celebration experience built around the people and memories that matter.",
    image: mockup1,
  },
  {
    id: "heirloom",
    number: "03",
    category: "ANNIVERSARY",
    title: "Heirloom",
    accent: "Elegance",
    description: "Refined details and timeless typography for a celebration worth remembering.",
    image: mockup2,
  },
  {
    id: "gallery",
    number: "04",
    category: "GATHERING",
    title: "Gallery",
    accent: "Edition",
    description: "A contemporary invitation where photographs, details and moments become the story.",
    image: grid,
  },
];

const collections = [
  { title: "The Wedding Edit", category: "Wedding", image: celeb1 },
  { title: "The Birthday Edit", category: "Birthday", image: celeb2 },
  { title: "The Anniversary Edit", category: "Anniversary", image: celeb3 },
  { title: "The Gathering Edit", category: "Corporate", image: celeb4 },
];

const experienceCards: {
  code: string;
  title: string;
  desc: string;
  event: string;
  icon: ReactNode;
}[] = [
  {
    code: "01",
    title: "Welcome Music",
    event: "Wedding · Birthday",
    desc: "Set the atmosphere from the moment guests open the invitation.",
    icon: <AudioPlayerWave />,
  },
  {
    code: "02",
    title: "Memory Gallery",
    event: "Wedding · Anniversary",
    desc: "Bring portraits, family memories and celebration moments together.",
    icon: <AnimatedGalleryIcon />,
  },
  {
    code: "03",
    title: "Event Countdown",
    event: "All celebrations",
    desc: "Build anticipation with a live countdown to the main occasion.",
    icon: <AnimatedFlipClock />,
  },
  {
    code: "04",
    title: "Event Schedule",
    event: "Wedding · Corporate",
    desc: "Present ceremonies, sessions, venues and timings in one clear flow.",
    icon: <Sparkles className="h-7 w-7" strokeWidth={1} />,
  },
  {
    code: "05",
    title: "Guest Wishes",
    event: "Wedding · Birthday",
    desc: "Give guests a beautiful place to leave personal messages and wishes.",
    icon: <HeartBeat />,
  },
  {
    code: "06",
    title: "Private Details",
    event: "Wedding · Corporate",
    desc: "Protect selected venue, schedule or guest information when needed.",
    icon: <AnimatedLockIcon />,
  },
];

function PortalButton({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group inline-flex h-14 items-center gap-5 overflow-hidden rounded-full border border-black/[0.09] bg-white pr-2 pl-6 text-[9px] tracking-[0.24em] text-[#171716] uppercase shadow-[0_10px_30px_rgba(23,23,22,.05)] transition-all duration-500 hover:-translate-y-0.5 hover:border-black/20 hover:shadow-[0_18px_42px_rgba(23,23,22,.09)]"
    >
      <span className="whitespace-nowrap">{children}</span>

      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#171716] text-white transition-transform duration-500 group-hover:rotate-45">
        <ArrowUpRight className="h-4 w-4" strokeWidth={1.4} />
      </span>
    </button>
  );
}

function ParallaxImage({
  src,
  alt,
  y,
  scale,
}: {
  src: StaticImageData;
  alt: string;
  y?: MotionValue<string>;
  scale?: MotionValue<number>;
}) {
  return (
    <motion.div style={{ y, scale }} className="absolute inset-0">
      <Image src={src} alt={alt} fill sizes="(max-width: 768px) 90vw, 55vw" className="object-contain" />
    </motion.div>
  );
}

function ParallaxExperienceCard({ item, index }: { item: (typeof experienceCards)[number]; index: number }) {
  const cardRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 0.5, 1], index % 2 === 0 ? ["22px", "0px", "-22px"] : ["-18px", "0px", "18px"]);

  const rotate = useTransform(scrollYProgress, [0, 0.5, 1], index % 2 === 0 ? [-1, 0, 1] : [1, 0, -1]);

  return (
    <motion.div
      ref={cardRef}
      style={{ y, rotate }}
      className="group relative h-full min-h-0 overflow-hidden rounded-[24px] border border-black/[0.07] bg-[#fafaf8] p-5 text-[#171716] transition-all duration-500 hover:-translate-y-1 hover:bg-[#171716] hover:text-white hover:shadow-[0_25px_70px_rgba(0,0,0,.10)] sm:rounded-[30px] sm:p-6"
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[8px] tracking-[0.25em] opacity-30">{item.code}</span>

          <p className="mt-2 text-[7px] tracking-[0.18em] uppercase opacity-25">{item.event}</p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-black/[0.07] bg-white text-[#171716]/60 transition-all group-hover:border-white/15 group-hover:bg-white/10 group-hover:text-white sm:h-12 sm:w-12 sm:rounded-2xl">
          {item.icon}
        </div>
      </div>

      <div className="absolute right-6 bottom-6 left-6">
        <h3 className="text-base font-bold tracking-[-0.04em] sm:text-xl">{item.title}</h3>

        <p className="mt-2 max-w-[250px] text-[10px] leading-4 opacity-45 transition-opacity group-hover:opacity-60 sm:text-xs sm:leading-5">
          {item.desc}
        </p>
      </div>

      <ArrowUpRight className="absolute right-6 bottom-6 h-4 w-4 opacity-0 transition-all duration-500 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:opacity-70" />
    </motion.div>
  );
}

export default function Home() {
  const router = useRouter();

  const heroRef = useRef<HTMLElement | null>(null);
  const collectionsRef = useRef<HTMLElement | null>(null);
  const experienceRef = useRef<HTMLElement | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end end"],
  });

  const smoothHeroProgress = useSpring(heroProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.35,
  });

  const heroImageY = useTransform(smoothHeroProgress, [0, 1], ["0%", "-24%"]);

  const heroImageScale = useTransform(smoothHeroProgress, [0, 0.65, 1], [1, 1.06, 1.1]);

  const heroHeadlineY = useTransform(smoothHeroProgress, [0, 0.3], ["0px", "-80px"]);

  const heroHeadlineOpacity = useTransform(smoothHeroProgress, [0, 0.22, 0.42], [1, 1, 0]);

  const heroHudOpacity = useTransform(smoothHeroProgress, [0, 0.12, 0.35], [1, 1, 0]);

  const heroPanelY = useTransform(smoothHeroProgress, [0, 1], ["0%", "14%"]);

  const heroGhostLeftX = useTransform(smoothHeroProgress, [0, 1], ["0%", "-28%"]);

  const heroGhostRightX = useTransform(smoothHeroProgress, [0, 1], ["0%", "28%"]);

  const activeSlide = heroSlides[activeIndex];

  const { scrollYProgress: collectionsProgress } = useScroll({
    target: collectionsRef,
    offset: ["start start", "end end"],
  });

  const smoothCollectionsProgress = useSpring(collectionsProgress, {
    stiffness: 80,
    damping: 25,
    mass: 0.35,
  });

  const collectionsX = useTransform(smoothCollectionsProgress, [0, 1], ["0%", isMobile ? "-73%" : "-56%"]);

  const collectionsTitleY = useTransform(smoothCollectionsProgress, [0, 1], ["0px", "-70px"]);

  const collectionsTitleOpacity = useTransform(smoothCollectionsProgress, [0, 0.35, 0.8, 1], [1, 1, 0.7, 0.35]);

  const { scrollYProgress: experienceProgress } = useScroll({
    target: experienceRef,
    offset: ["start start", "end end"],
  });

  const experienceIntroY = useTransform(experienceProgress, [0, 1], ["0px", "-70px"]);

  useEffect(() => {
    const updateViewport = () => {
      setIsMobile(window.innerWidth < 768);
    };

    updateViewport();

    window.addEventListener("resize", updateViewport, {
      passive: true,
    });

    return () => {
      window.removeEventListener("resize", updateViewport);
    };
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % heroSlides.length);
    }, 5200);

    return () => window.clearInterval(timer);
  }, []);

  const previous = () => {
    setActiveIndex((current) => (current - 1 + heroSlides.length) % heroSlides.length);
  };

  const next = () => {
    setActiveIndex((current) => (current + 1) % heroSlides.length);
  };

  return (
    <main className="relative overflow-x-clip bg-[#f7f7f5] text-[#171716] selection:bg-[#171716] selection:text-white">
      <Header />

      {/* HERO */}
      <section ref={heroRef} className="relative h-[155vh] px-0 sm:h-[160vh] md:h-[170vh]">
        <div className="sticky top-0 mx-2 h-[calc(100svh-64px)] min-h-[560px] overflow-hidden rounded-[30px] border border-black/[0.06] bg-white shadow-[0_25px_90px_rgba(0,0,0,.05)] sm:mx-3 sm:rounded-[40px] md:mx-4 md:h-[calc(100svh-72px)] md:min-h-[650px] md:rounded-[56px]">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_42%,rgba(255,255,255,.98),transparent_30%),radial-gradient(circle_at_48%_85%,rgba(215,226,220,.30),transparent_34%)]" />
            <div className="absolute inset-0 [background-image:linear-gradient(rgba(0,0,0,.7)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,.7)_1px,transparent_1px)] [background-size:80px_80px] opacity-[0.035]" />
          </div>

          {/* Hero meta */}
          <motion.div
            style={{ opacity: heroHudOpacity }}
            className="absolute top-5 right-5 left-5 z-30 flex items-start justify-between sm:top-6 md:top-8 md:right-10 md:left-10"
          >
            <div>
              <div className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-[#8eb9a6]" />
                <span className="text-[7px] tracking-[0.28em] text-black/40 uppercase sm:text-[8px] sm:tracking-[0.32em]">MomentsEra</span>
              </div>

              <p className="mt-3 text-[7px] tracking-[0.24em] text-black/20 uppercase">Digital invitations for meaningful occasions</p>
            </div>

            <div className="hidden text-right sm:block">
              <p className="text-[8px] tracking-[0.25em] text-black/25 uppercase">Collection</p>
              <p className="mt-1 text-xs font-semibold tracking-[0.2em]">{activeSlide.number} / 04</p>
            </div>
          </motion.div>

          {/* Editorial hero copy */}
          <motion.div
            style={{
              opacity: heroHeadlineOpacity,
              y: heroHeadlineY,
            }}
            className="absolute top-[9%] right-5 left-5 z-20 sm:top-[10%] md:top-[14%] md:right-auto md:left-10 md:max-w-[600px] lg:left-[6.5vw]"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide.id}
                initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
                transition={{ duration: 0.7, ease }}
              >
                <p className="text-[9px] tracking-[0.36em] text-black/40 uppercase">{activeSlide.category}</p>

                <p className="mt-5 text-[8px] tracking-[0.28em] text-black/25 uppercase">Collection / {activeSlide.number}</p>

                <h1 className="mt-3 text-[clamp(3.25rem,15vw,5.8rem)] leading-[0.76] font-black tracking-[-0.085em] sm:text-[clamp(4rem,10vw,7rem)] md:text-[clamp(4rem,9vw,9rem)]">
                  <span className="block">{activeSlide.title}</span>
                  <span className="mt-1 block [font-family:var(--font-windsong)] text-[0.66em] font-light tracking-[-0.025em] text-black/60">
                    {activeSlide.accent}
                  </span>
                </h1>

                <p className="mt-5 max-w-[350px] text-[13px] leading-5 text-black/45 sm:mt-7 sm:text-sm sm:leading-6">
                  {activeSlide.description}
                </p>

                <div className="mt-7">
                  <PortalButton onClick={() => router.push("/invites")}>Explore invitations</PortalButton>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Main invitation composition */}
          <motion.div
            style={{
              y: heroPanelY,
              opacity: useTransform(smoothHeroProgress, [0, 0.18, 0.55], [1, 1, 0]),
            }}
            className="absolute inset-y-[36%] right-[-4%] left-[2%] z-10 sm:inset-y-[32%] sm:right-[-2%] sm:left-[14%] md:inset-y-[9%] md:right-[1%] md:left-[32%] lg:left-[34%]"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Previous / next ghost panels */}
              <motion.div
                style={{ x: heroGhostLeftX }}
                className="absolute left-[5%] hidden h-[62%] w-[25%] overflow-hidden rounded-[28px] border border-black/[0.08] bg-white/75 opacity-45 md:block"
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
                style={{ x: heroGhostRightX }}
                className="absolute right-[5%] hidden h-[58%] w-[24%] overflow-hidden rounded-[28px] border border-black/[0.08] bg-white/75 opacity-40 md:block"
              >
                <Image src={heroSlides[(activeIndex + 1) % heroSlides.length].image} alt="" fill sizes="24vw" className="object-contain" />
              </motion.div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSlide.id}
                  initial={{
                    opacity: 0,
                    y: 24,
                    scale: 0.95,
                    rotate: 1.2,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    rotate: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: -18,
                    scale: 0.98,
                  }}
                  transition={{ duration: 0.8, ease }}
                  className="relative z-10 h-[42svh] w-[72vw] max-w-[430px] overflow-hidden rounded-[26px] sm:h-[50svh] sm:w-[58vw] sm:rounded-[32px] md:h-[70vh] md:w-[54vw] md:max-w-[690px] md:rounded-[36px] lg:h-[76vh] lg:w-[39vw]"
                >
                  <ParallaxImage src={activeSlide.image} alt={`${activeSlide.title} invitation`} y={heroImageY} scale={heroImageScale} />

                  <div className="pointer-events-none absolute inset-[7%] rounded-[30px] border border-black/[0.08]" />
                </motion.div>
              </AnimatePresence>

              {/* Minimal feature markers */}
              <motion.div
                style={{
                  y: useTransform(smoothHeroProgress, [0, 1], ["0%", "-45%"]),
                }}
                className="absolute top-[20%] right-[5%] z-20 hidden rounded-[20px] border border-black/[0.08] bg-white/90 px-4 py-3 shadow-[0_15px_40px_rgba(23,23,22,.05)] backdrop-blur-xl md:block"
              >
                <span className="block text-[7px] tracking-[0.25em] text-black/30 uppercase">Guest experience</span>
                <span className="mt-1 block text-[10px] text-black/70">RSVP · Wishes · Details</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Scroll cue */}
          <motion.div
            style={{ opacity: heroHudOpacity }}
            className="absolute right-5 bottom-6 z-30 hidden items-center gap-3 md:right-10 md:bottom-8 md:flex"
          >
            <span className="text-[7px] tracking-[0.28em] text-black/25 uppercase">Scroll to explore</span>
            <ArrowDown className="h-3.5 w-3.5 text-black/35" />
          </motion.div>

          {/* Carousel controls */}
          <div className="absolute right-4 bottom-5 z-30 flex items-center gap-1.5 sm:right-5 sm:bottom-6 md:right-10 md:bottom-7 md:gap-2">
            <button
              type="button"
              aria-label="Previous collection"
              onClick={previous}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-black/[0.09] bg-white/85 text-black/45 shadow-sm backdrop-blur-md transition-all hover:border-black/20 hover:text-black"
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={1.2} />
            </button>

            <div className="flex items-center gap-3 px-2">
              <div className="h-px w-12 overflow-hidden bg-black/10 sm:w-16">
                <motion.div
                  key={activeSlide.id}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 5.2, ease: "linear" }}
                  className="h-full w-full origin-left bg-black/55"
                />
              </div>

              <span className="text-[8px] tracking-[0.2em] text-black/35">{activeSlide.number} / 04</span>
            </div>

            <button
              type="button"
              aria-label="Next collection"
              onClick={next}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-black/[0.09] bg-white/85 text-black/45 shadow-sm backdrop-blur-md transition-all hover:border-black/20 hover:text-black"
            >
              <ChevronRight className="h-4 w-4" strokeWidth={1.2} />
            </button>
          </div>
        </div>
      </section>

      {/* VALUE / TRUST */}
      <section className="relative z-10 mx-2 overflow-hidden rounded-[40px] border border-black/[0.05] bg-white text-[#171716] shadow-[0_24px_90px_rgba(0,0,0,.04)] sm:mx-3 sm:rounded-[48px] md:mx-4 md:rounded-[60px]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 right-[-8%] h-[420px] w-[420px] rounded-full bg-[#edf4f0] blur-[110px]" />
          <div className="absolute bottom-[-180px] left-[-8%] h-[420px] w-[420px] rounded-full bg-[#f4eee5] blur-[110px]" />
        </div>

        <div className="relative mx-auto max-w-[1500px] px-5 py-24 sm:px-7 md:px-10 md:py-32">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="text-[8px] font-medium tracking-[0.35em] text-black/30 uppercase">01 / Why MomentsEra</p>

              <h2 className="mt-7 max-w-[620px] text-[clamp(3.4rem,7vw,7rem)] leading-[0.78] font-black tracking-[-0.085em]">
                Made for
                <br />
                <span className="[font-family:var(--font-windsong)] font-light tracking-normal text-black/35">your celebration.</span>
              </h2>
            </div>

            <p className="max-w-[720px] text-lg leading-8 text-black/50 sm:text-xl md:text-2xl md:leading-9">
              Every invitation is shaped around your event — the people, places, timings, memories and moments your guests should
              experience.
            </p>
          </div>

          <div className="mt-16 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                number: "01",
                title: "Private",
                label: "Controlled access",
                description: "Keep selected event information protected when your celebration needs privacy.",
                icon: "lock",
              },
              {
                number: "02",
                title: "Responsive",
                label: "Every screen",
                description: "A carefully composed experience that adapts across phones, tablets and desktops.",
                icon: "screen",
              },
              {
                number: "03",
                title: "Personal",
                label: "Built around you",
                description: "Shape imagery, typography, music, schedules and sections around your event.",
                icon: "spark",
              },
              {
                number: "04",
                title: "Seamless",
                label: "Easy for guests",
                description: "One elegant place for guests to discover details, RSVP and share their wishes.",
                icon: "arrow",
              },
            ].map((item, index) => (
              <motion.button
                key={item.number}
                type="button"
                onClick={() => router.push("/invites")}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.06,
                  ease,
                }}
                whileHover={{ y: -5 }}
                className="group relative min-h-[270px] overflow-hidden rounded-[28px] border border-black/[0.07] bg-[#fafaf8] p-6 text-left transition-all duration-500 hover:bg-[#171716] hover:text-white hover:shadow-[0_25px_65px_rgba(0,0,0,.10)] md:min-h-[290px] md:p-7"
              >
                <div className="flex items-start justify-between">
                  <span className="text-[8px] tracking-[0.3em] text-black/25 uppercase group-hover:text-white/35">{item.number}</span>

                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-black/[0.07] bg-white text-black/50 transition-all group-hover:border-white/15 group-hover:bg-white/10 group-hover:text-white">
                    {item.icon === "lock" && (
                      <span className="relative h-3.5 w-3.5 rounded-[4px] border border-current">
                        <span className="absolute -top-2 left-1/2 h-2 w-2 -translate-x-1/2 rounded-t-full border border-b-0 border-current" />
                      </span>
                    )}

                    {item.icon === "screen" && (
                      <span className="flex h-3.5 w-5 items-center justify-center rounded-[3px] border border-current">
                        <span className="h-px w-2 bg-current" />
                      </span>
                    )}

                    {item.icon === "spark" && <Sparkles className="h-4 w-4" strokeWidth={1.2} />}

                    {item.icon === "arrow" && <ArrowUpRight className="h-4 w-4" strokeWidth={1.3} />}
                  </span>
                </div>

                <div className="absolute right-6 bottom-6 left-6 md:right-7 md:bottom-7 md:left-7">
                  <p className="mb-3 text-[7px] font-medium tracking-[0.3em] text-black/25 uppercase group-hover:text-white/35">
                    {item.label}
                  </p>

                  <h3 className="text-2xl font-black tracking-[-0.055em] sm:text-3xl">{item.title}</h3>

                  <p className="mt-3 max-w-[260px] text-xs leading-5 text-black/45 group-hover:text-white/55">{item.description}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* HORIZONTAL COLLECTIONS */}
      <section
        ref={collectionsRef}
        className="relative z-10 h-[250vh] rounded-[48px] bg-[#f9f9f7] text-[#171716] shadow-[0_-20px_80px_rgba(0,0,0,.035)] md:rounded-[60px]"
      >
        <div className="sticky top-0 flex h-[calc(100svh-64px)] min-h-[560px] items-center overflow-hidden md:h-screen md:min-h-[680px]">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute top-[13%] left-[8%] h-px w-[84%] bg-black/[0.07]" />
            <div className="absolute bottom-[13%] left-[8%] h-px w-[84%] bg-black/[0.07]" />
            <div className="absolute top-0 left-[8%] h-full w-px bg-black/[0.035]" />
          </div>

          <motion.div
            style={{
              y: collectionsTitleY,
              opacity: collectionsTitleOpacity,
            }}
            className="absolute top-[12%] left-5 z-20 md:left-10 lg:left-[6vw]"
          >
            <p className="text-[8px] tracking-[0.35em] text-black/30 uppercase">02 / Collections</p>

            <h2 className="mt-5 max-w-[650px] text-[clamp(3.3rem,7vw,7rem)] leading-[0.78] font-black tracking-[-0.08em]">
              Find the
              <br />
              <span className="[font-family:var(--font-windsong)] font-light tracking-normal text-black/40">right expression.</span>
            </h2>
          </motion.div>

          <motion.div
            style={{ x: collectionsX }}
            className="relative mt-[17vh] flex w-max items-center gap-3 pr-[8vw] pl-[8vw] sm:gap-5 md:mt-[15vh] md:gap-8"
          >
            {collections.map((item, index) => (
              <motion.button
                key={item.title}
                type="button"
                onClick={() => router.push("/invites")}
                whileHover={{ y: -8 }}
                transition={{
                  type: "spring",
                  stiffness: 220,
                  damping: 22,
                }}
                className="group relative h-[58vh] min-h-[360px] w-[78vw] max-w-[560px] overflow-hidden rounded-[30px] bg-[#eeece6] text-left shadow-[0_25px_70px_rgba(0,0,0,.09)] sm:h-[62vh] sm:min-h-[430px] sm:w-[68vw] sm:rounded-[36px] md:h-[62vh] md:w-[52vw] md:max-w-[720px] md:rounded-[42px] lg:w-[44vw]"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 78vw, 44vw"
                  className="object-cover transition-transform duration-[1.2s] group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-transparent" />

                <div className="absolute top-5 left-5 flex items-center gap-3">
                  <span className="rounded-full border border-white/15 bg-black/10 px-3 py-2 text-[7px] tracking-[0.25em] text-white/80 uppercase backdrop-blur-md">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="text-[7px] tracking-[0.3em] text-white/60 uppercase">{item.category}</span>
                </div>

                <div className="absolute right-5 bottom-5 left-5 flex items-end justify-between gap-5 text-white md:right-8 md:bottom-8 md:left-8">
                  <div>
                    <p className="text-[7px] tracking-[0.3em] uppercase opacity-55">{item.category}</p>

                    <h3 className="mt-3 max-w-[430px] text-3xl leading-[0.9] font-black tracking-[-0.06em] md:text-5xl">{item.title}</h3>
                  </div>

                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-black transition-transform duration-500 group-hover:rotate-45">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </motion.button>
            ))}

            <div className="flex h-[58vh] min-h-[360px] w-[78vw] max-w-[560px] items-center justify-center rounded-[30px] border border-black/[0.08] bg-white px-6 sm:h-[62vh] sm:min-h-[430px] sm:w-[68vw] sm:rounded-[36px] sm:px-10 md:h-[62vh] md:w-[42vw] md:rounded-[42px]">
              <div className="max-w-[360px]">
                <p className="text-[8px] tracking-[0.3em] text-black/30 uppercase">Complete the experience</p>

                <h3 className="mt-5 text-5xl leading-[0.8] font-black tracking-[-0.08em]">
                  Your event.
                  <br />
                  <span className="[font-family:var(--font-windsong)] font-light text-black/40">Your language.</span>
                </h3>

                <div className="mt-8">
                  <PortalButton onClick={() => router.push("/invites")}>Explore all invites</PortalButton>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="absolute right-4 bottom-5 left-4 z-20 flex items-center justify-between sm:right-5 sm:bottom-6 md:right-10 md:bottom-8 md:left-10">
            <span className="hidden text-[8px] tracking-[0.28em] text-black/30 uppercase sm:block">Move through the collection</span>

            <div className="h-px w-[24vw] max-w-[420px] overflow-hidden bg-black/10 sm:w-[30vw] md:w-[35vw]">
              <motion.div style={{ scaleX: collectionsProgress }} className="h-full w-full origin-left bg-black/50" />
            </div>

            <span className="text-[8px] tracking-[0.2em] text-black/30">04 / 04</span>
          </div>
        </div>
      </section>

      {/* EVENT EXPERIENCE */}
      <section
        ref={experienceRef}
        className="relative z-10 mx-2 h-[150vh] overflow-hidden rounded-[36px] bg-white text-[#171716] shadow-[0_20px_80px_rgba(0,0,0,.035)] sm:mx-3 sm:rounded-[44px] md:mx-4 md:h-[170vh] md:rounded-[60px]"
      >
        <div className="sticky top-0 h-[calc(100svh-64px)] min-h-[560px] overflow-hidden rounded-[36px] sm:rounded-[44px] md:h-[calc(100svh-72px)] md:min-h-[650px] md:rounded-[60px]">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute top-[17%] right-[7%] h-px w-[54%] bg-black/[0.05]" />
            <div className="absolute bottom-[17%] left-[7%] h-px w-[58%] bg-black/[0.05]" />
            <div className="absolute top-0 left-[7%] h-full w-px bg-black/[0.03]" />
            <div className="absolute top-0 right-[7%] h-full w-px bg-black/[0.03]" />
          </div>

          <motion.div
            style={{ y: experienceIntroY }}
            className="absolute top-[7%] right-5 left-5 z-20 max-w-[500px] sm:top-[8%] md:top-[10%] md:right-auto md:left-10 lg:left-[7vw]"
          >
            <p className="text-[8px] tracking-[0.35em] text-black/30 uppercase">03 / Event experience</p>

            <h2 className="mt-5 text-[clamp(3rem,14vw,5rem)] leading-[0.8] font-black tracking-[-0.08em] sm:text-[clamp(3.5rem,9vw,6rem)] md:text-[clamp(3.35rem,6.2vw,6.6rem)]">
              Built around
              <br />
              <span className="[font-family:var(--font-windsong)] font-light tracking-normal text-black/40">the occasion.</span>
            </h2>

            <p className="mt-5 max-w-[390px] text-[13px] leading-5 text-black/45 sm:text-sm sm:leading-6 md:mt-7">
              Choose only the details your celebration needs — from music and memories to schedules, countdowns, wishes and private
              information.
            </p>
          </motion.div>

          <div className="absolute top-[31%] right-4 bottom-[16%] left-4 z-10 sm:top-[30%] md:right-10 md:bottom-[15%] md:left-[40%] lg:left-[43%]">
            <div className="grid h-full grid-cols-2 grid-rows-3 gap-2 sm:gap-3 lg:grid-cols-3 lg:grid-rows-2">
              {experienceCards.map((item, index) => (
                <ParallaxExperienceCard key={item.code} item={item} index={index} />
              ))}
            </div>
          </div>

          <div className="absolute right-4 bottom-4 left-4 z-30 flex items-center justify-between sm:right-5 sm:bottom-6 md:right-10 md:bottom-7 md:left-10">
            <PortalButton onClick={() => router.push("/invites")}>Build your invite</PortalButton>

            <div className="hidden items-center gap-3 md:flex">
              <span className="text-[8px] tracking-[0.25em] text-black/25 uppercase">Scroll depth</span>

              <div className="h-px w-32 overflow-hidden rounded-full bg-black/10">
                <motion.div style={{ scaleX: experienceProgress }} className="h-full w-full origin-left bg-black/50" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EDITOR */}
      <section className="relative z-10 mx-2 overflow-hidden rounded-[36px] border border-black/[0.05] bg-[#f3f2ee] px-4 py-24 text-[#171716] shadow-[0_20px_80px_rgba(0,0,0,.035)] sm:mx-3 sm:rounded-[44px] sm:px-6 sm:py-28 md:mx-4 md:rounded-[60px] md:px-10 md:py-36">
        <div className="mx-auto max-w-[1500px]">
          <div className="mb-12 max-w-[700px]">
            <p className="text-[8px] tracking-[0.35em] text-black/30 uppercase">04 / Create</p>

            <h2 className="mt-6 text-[clamp(3.5rem,7vw,7rem)] leading-[0.78] font-black tracking-[-0.08em]">
              Shape every
              <br />
              <span className="[font-family:var(--font-windsong)] font-light text-black/45">detail.</span>
            </h2>

            <p className="mt-7 max-w-[560px] text-sm leading-6 text-black/45 md:text-base">
              Start with a collection, personalise the content, arrange the experience and preview the invitation before sharing it with
              your guests.
            </p>
          </div>

          <div className="relative overflow-hidden rounded-[30px] border border-black/[0.08] bg-white p-2 shadow-[0_40px_110px_rgba(0,0,0,.10)] md:p-3">
            <div className="flex h-10 items-center justify-between border-b border-black/[0.07] px-4 text-black/30">
              <div className="flex gap-1.5">
                <span className="h-2 w-2 rounded-full border border-black/10" />
                <span className="h-2 w-2 rounded-full border border-black/10" />
                <span className="h-2 w-2 rounded-full border border-black/10" />
              </div>

              <span className="text-[8px] tracking-[0.3em] uppercase">MomentsEra Editor</span>

              <span className="flex items-center gap-2 text-[8px]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#8eb9a6]" />
                Live preview
              </span>
            </div>

            <div className="grid min-h-[420px] grid-cols-[52px_1fr] sm:min-h-[500px] sm:grid-cols-[58px_1fr] md:grid-cols-[72px_1fr_260px]">
              <aside className="border-r border-black/[0.07] py-5">
                {["⌂", "✦", "◫", "◌", "♪", "⚙"].map((item, index) => (
                  <button
                    key={item}
                    type="button"
                    aria-label={`Editor tool ${index + 1}`}
                    className={`mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-2xl border text-sm transition-all ${
                      index === 1
                        ? "border-black/[0.08] bg-[#171716] text-white"
                        : "border-transparent text-black/30 hover:border-black/10 hover:text-black"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </aside>

              <div className="relative flex items-center justify-center overflow-hidden bg-[#eeece7] p-7 md:p-12">
                <div className="absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,.25)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.25)_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.18]" />

                <motion.div
                  whileHover={{ y: -7, rotate: -1 }}
                  transition={{
                    type: "spring",
                    stiffness: 180,
                    damping: 20,
                  }}
                  className="relative h-[390px] w-[245px] overflow-hidden rounded-[34px] border-[7px] border-black/10 bg-white p-1 shadow-[0_40px_80px_rgba(0,0,0,.20)]"
                >
                  <div className="relative h-full w-full overflow-hidden rounded-[27px] bg-[#eee8dc]">
                    <Image src={mockup} alt="Invitation editor preview" fill sizes="245px" className="object-contain" />
                  </div>
                </motion.div>
              </div>

              <aside className="hidden border-l border-black/[0.07] p-5 md:block">
                <div className="mb-5 flex items-center justify-between">
                  <p className="text-[8px] tracking-[0.25em] text-black/35 uppercase">Customize</p>
                  <span className="text-[8px] text-black/20">05</span>
                </div>

                {["Typography", "Colors", "Background", "Music", "Sections"].map((item, index) => (
                  <button
                    key={item}
                    type="button"
                    className="mb-2 flex w-full items-center justify-between rounded-2xl border border-black/[0.07] bg-[#fafaf9] p-3 text-left transition-all hover:bg-white"
                  >
                    <span className="text-[10px] text-black/60">{item}</span>
                    <span className="text-[9px] text-black/25">{index === 0 ? "Aa" : "+"}</span>
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => router.push("/invites")}
                  className="group mt-4 flex w-full items-center justify-between rounded-full border border-black/[0.08] bg-[#171716] px-3 py-2 text-[8px] tracking-[0.2em] text-white uppercase"
                >
                  <span className="pl-2">Start designing</span>

                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black transition-transform group-hover:rotate-45">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </button>
              </aside>
            </div>
          </div>
        </div>
      </section>
      {/* ================================================================
          RESPONSIVE / LAYERED PARALLAX
      ================================================================= */}
      <section className="relative z-10 mx-2 overflow-hidden rounded-[36px] bg-white px-4 py-24 text-[#171716] shadow-[0_20px_80px_rgba(0,0,0,.04)] sm:mx-3 sm:rounded-[44px] sm:px-6 sm:py-28 md:mx-4 md:rounded-[60px] md:px-10 md:py-40">
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

          <div className="relative min-h-[560px] overflow-hidden rounded-[38px] bg-[#f2f0ea]">
            <motion.div
              whileInView={{ y: [20, 0], opacity: [0, 1] }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease }}
              className="absolute top-16 left-[7%] hidden h-[330px] w-[610px] overflow-hidden rounded-[32px] border-[6px] border-black/10 bg-white p-2 shadow-[0_35px_80px_rgba(0,0,0,.18)] sm:block"
            >
              <div className="relative h-full w-full overflow-hidden bg-white">
                <Image src={mockup2} alt="Desktop invitation" fill sizes="610px" className="object-contain" />
              </div>
            </motion.div>

            <motion.div
              whileInView={{ y: [30, 0], rotate: [3, 1.5] }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.12, ease }}
              className="absolute right-[9%] bottom-8 z-20 h-[410px] w-[205px] overflow-hidden rounded-[34px] border-[7px] border-black/10 bg-white p-2 shadow-[0_35px_80px_rgba(0,0,0,.22)]"
            >
              <div className="absolute top-0 left-1/2 z-10 h-5 w-16 -translate-x-1/2 rounded-b-full bg-[#202020]" />
              <div className="relative h-full w-full overflow-hidden bg-white">
                <Image src={mockup} alt="Mobile invitation" fill sizes="205px" className="object-contain" />
              </div>
            </motion.div>

            <div className="absolute top-8 right-8 rounded-full border border-black/10 bg-white px-4 py-2 text-[7px] tracking-[0.22em] uppercase shadow-sm">
              Adaptive / 01
            </div>

            <div className="absolute bottom-8 left-8 hidden rounded-r-2xl border-l border-black/20 bg-white/50 py-2 pr-4 pl-4 md:block">
              <p className="text-[7px] tracking-[0.25em] uppercase opacity-35">Same story</p>
              <p className="mt-1 text-xs opacity-60">Reframed for every screen.</p>
            </div>
          </div>
        </div>
      </section>
      {/* FINAL CTA */}
      <section className="relative z-10 mx-2 overflow-hidden rounded-[40px] border border-black/[0.05] bg-white px-4 py-28 text-center text-[#171716] shadow-[0_20px_80px_rgba(0,0,0,.035)] sm:mx-3 sm:rounded-[48px] sm:px-6 sm:py-32 md:mx-4 md:rounded-[60px] md:px-10 md:py-44">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(181,204,194,.25),transparent_36%)]" />

        <div className="relative mx-auto max-w-[1000px]">
          <p className="text-[8px] tracking-[0.4em] text-black/30 uppercase">05 / Begin</p>

          <h2 className="mt-8 text-[clamp(4rem,10vw,10rem)] leading-[0.72] font-black tracking-[-0.085em]">
            Make it
            <br />
            <span className="[font-family:var(--font-windsong)] font-light text-black/55">yours.</span>
          </h2>

          <p className="mx-auto mt-9 max-w-[460px] text-sm leading-6 text-black/40">
            Choose an invitation, make it personal, and create an experience your guests will remember.
          </p>

          <div className="mt-9 flex justify-center">
            <PortalButton onClick={() => router.push("/invites")}>Create your invitation</PortalButton>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
