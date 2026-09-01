"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Image, { type StaticImageData } from "next/image";
import { AnimatePresence, motion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import {
  ArrowDown,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Heart,
  LockKeyhole,
  Music2,
  Send,
  Sparkles,
} from "lucide-react";

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

const features: {
  number: string;
  label: string;
  title: string;
  description: string;
  icon: ReactNode;
}[] = [
  {
    number: "01",
    label: "Atmosphere",
    title: "Welcome Music",
    description: "Set the mood from the moment your guests open the invitation.",
    icon: <Music2 className="h-5 w-5" strokeWidth={1.2} />,
  },
  {
    number: "02",
    label: "Memories",
    title: "Memory Gallery",
    description: "Bring portraits, family memories and celebration moments together.",
    icon: <Heart className="h-5 w-5" strokeWidth={1.2} />,
  },
  {
    number: "03",
    label: "Anticipation",
    title: "Event Countdown",
    description: "Build excitement with a live countdown to the main occasion.",
    icon: <Clock3 className="h-5 w-5" strokeWidth={1.2} />,
  },
  {
    number: "04",
    label: "Details",
    title: "Event Schedule",
    description: "Present ceremonies, venues and timings in one clear flow.",
    icon: <Sparkles className="h-5 w-5" strokeWidth={1.2} />,
  },
  {
    number: "05",
    label: "Connection",
    title: "Guest Wishes",
    description: "Give guests a beautiful place to leave personal messages.",
    icon: <HeartBeat />,
  },
  {
    number: "06",
    label: "Privacy",
    title: "Private Details",
    description: "Protect selected venue, schedule or guest information when needed.",
    icon: <LockKeyhole className="h-5 w-5" strokeWidth={1.2} />,
  },
];

function PortalButton({ children, onClick, light = false }: { children: ReactNode; onClick?: () => void; light?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group inline-flex h-12 items-center gap-4 rounded-full px-5 text-[9px] font-medium tracking-[0.22em] uppercase transition-all duration-500 hover:-translate-y-0.5 ${
        light ? "bg-white text-[#061c19] hover:bg-[#f1f3ed]" : "bg-[#061c19] text-white hover:bg-black"
      }`}
    >
      <span>{children}</span>
      <span
        className={`flex h-8 w-8 items-center justify-center rounded-full transition-transform duration-500 group-hover:rotate-45 ${
          light ? "bg-[#061c19] text-white" : "bg-white text-[#061c19]"
        }`}
      >
        <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />
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

export default function Home() {
  const router = useRouter();
  const heroRef = useRef<HTMLElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const activeSlide = heroSlides[activeIndex];

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.35,
  });

  const imageY = useTransform(smoothProgress, [0, 1], ["0%", "-24%"]);
  const imageScale = useTransform(smoothProgress, [0, 0.6, 1], [1, 1.05, 1.1]);
  const headlineY = useTransform(smoothProgress, [0, 0.3], ["0px", "-75px"]);
  const headlineOpacity = useTransform(smoothProgress, [0, 0.2, 0.42], [1, 1, 0]);
  const heroPanelY = useTransform(smoothProgress, [0, 1], ["0%", "12%"]);
  const ghostLeftX = useTransform(smoothProgress, [0, 1], ["0%", "-24%"]);
  const ghostRightX = useTransform(smoothProgress, [0, 1], ["0%", "24%"]);

  const previous = () => setActiveIndex((current) => (current - 1 + heroSlides.length) % heroSlides.length);

  const next = () => setActiveIndex((current) => (current + 1) % heroSlides.length);

  useEffect(() => {
    const timer = window.setInterval(next, 5200);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <main className="overflow-x-clip bg-[#f7f6f1] text-[#061c19]">
      <Header />

      {/* =========================================================
          HERO — editorial light typography + dark luxury product stage
         ========================================================= */}
      <section ref={heroRef} className="relative h-[150vh] sm:h-[155vh] md:h-[165vh]">
        <div className="sticky top-0 mx-2 h-[calc(100svh-64px)] min-h-[570px] overflow-hidden rounded-[30px] bg-[#061c19] text-white shadow-[0_30px_100px_rgba(0,0,0,.12)] sm:mx-3 sm:rounded-[40px] md:mx-4 md:h-[calc(100svh-72px)] md:rounded-[56px]">
          {/* atmospheric layers */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_28%,rgba(180,211,195,.28),transparent_26%),radial-gradient(circle_at_15%_75%,rgba(93,132,115,.22),transparent_32%)]" />
            <div className="absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.7)_1px,transparent_1px)] [background-size:80px_80px] opacity-[0.035]" />
            <div className="absolute -bottom-[30%] left-[35%] h-[60%] w-[30%] rounded-full bg-[#b9d0c4]/10 blur-[100px]" />
          </div>

          {/* header HUD */}
          <motion.div
            style={{ opacity: headlineOpacity }}
            className="absolute top-5 right-5 left-5 z-30 flex justify-between sm:top-7 md:right-10 md:left-10"
          >
            <div>
              <div className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-[#9dc6b4]" />
                <span className="text-[7px] tracking-[0.3em] text-white/55 uppercase sm:text-[8px]">MomentsEra</span>
              </div>
              <p className="mt-3 text-[7px] tracking-[0.23em] text-white/25 uppercase">Digital invitations for meaningful occasions</p>
            </div>

            <div className="hidden text-right sm:block">
              <p className="text-[7px] tracking-[0.25em] text-white/30 uppercase">Collection</p>
              <p className="mt-1 text-xs font-semibold tracking-[0.2em]">{activeSlide.number} / 04</p>
            </div>
          </motion.div>

          {/* editorial headline */}
          <motion.div
            style={{ opacity: headlineOpacity, y: headlineY }}
            className="absolute top-[10%] right-5 left-5 z-20 sm:top-[12%] md:top-[15%] md:left-10 lg:left-[6.5vw]"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide.id}
                initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -18, filter: "blur(8px)" }}
                transition={{ duration: 0.7, ease }}
              >
                <p className="text-[8px] tracking-[0.36em] text-white/45 uppercase">{activeSlide.category}</p>

                <p className="mt-5 text-[7px] tracking-[0.28em] text-white/25 uppercase">Collection / {activeSlide.number}</p>

                <h1 className="mt-3 text-[clamp(3.5rem,11vw,8.8rem)] leading-[0.73] font-black tracking-[-0.09em]">
                  <span className="block">{activeSlide.title}</span>
                  <span className="mt-2 block [font-family:var(--font-windsong)] text-[0.62em] font-light tracking-[-0.02em] text-white/45">
                    {activeSlide.accent}
                  </span>
                </h1>

                <p className="mt-6 max-w-[370px] text-[12px] leading-5 text-white/45 sm:text-sm sm:leading-6">{activeSlide.description}</p>

                <div className="mt-7">
                  <PortalButton light onClick={() => router.push("/invites")}>
                    Explore invitations
                  </PortalButton>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* floating invitation stage */}
          <motion.div
            style={{ y: heroPanelY }}
            className="absolute inset-y-[38%] right-[-5%] left-[2%] z-10 sm:inset-y-[34%] sm:left-[12%] md:inset-y-[8%] md:right-[1%] md:left-[31%] lg:left-[34%]"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                style={{ x: ghostLeftX }}
                className="absolute left-[4%] hidden h-[60%] w-[25%] overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.05] opacity-45 backdrop-blur-sm md:block"
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
                style={{ x: ghostRightX }}
                className="absolute right-[4%] hidden h-[57%] w-[24%] overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.05] opacity-40 backdrop-blur-sm md:block"
              >
                <Image src={heroSlides[(activeIndex + 1) % heroSlides.length].image} alt="" fill sizes="24vw" className="object-contain" />
              </motion.div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSlide.id}
                  initial={{
                    opacity: 0,
                    y: 28,
                    scale: 0.94,
                    rotate: 1.5,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    rotate: 0,
                  }}
                  exit={{ opacity: 0, y: -18, scale: 0.98 }}
                  transition={{ duration: 0.8, ease }}
                  className="relative z-10 h-[43svh] w-[72vw] max-w-[420px] overflow-hidden rounded-[28px] border border-white/15 bg-[#eee8dc] shadow-[0_45px_120px_rgba(0,0,0,.4)] sm:h-[51svh] sm:w-[58vw] md:h-[70vh] md:w-[53vw] md:max-w-[680px] lg:h-[75vh] lg:w-[39vw]"
                >
                  <ParallaxImage src={activeSlide.image} alt={`${activeSlide.title} invitation`} y={imageY} scale={imageScale} />
                  <div className="pointer-events-none absolute inset-[6%] rounded-[25px] border border-black/10" />
                </motion.div>
              </AnimatePresence>

              <div className="absolute top-[18%] right-[5%] z-20 hidden rounded-[20px] border border-white/10 bg-white/10 px-4 py-3 shadow-[0_15px_40px_rgba(0,0,0,.12)] backdrop-blur-xl md:block">
                <span className="block text-[7px] tracking-[0.25em] text-white/35 uppercase">Guest experience</span>
                <span className="mt-1 block text-[10px] text-white/75">RSVP · Wishes · Details</span>
              </div>
            </div>
          </motion.div>

          {/* controls */}
          <div className="absolute right-4 bottom-5 z-30 flex items-center gap-2 sm:right-6 md:right-10 md:bottom-8">
            <button
              type="button"
              onClick={previous}
              aria-label="Previous collection"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-white/65 backdrop-blur-md transition hover:bg-white hover:text-[#061c19]"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-3 px-1">
              <div className="h-px w-12 bg-white/15 sm:w-16">
                <motion.div
                  key={activeSlide.id}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 5.2, ease: "linear" }}
                  className="h-full w-full origin-left bg-white/70"
                />
              </div>
              <span className="text-[8px] tracking-[0.2em] text-white/35">{activeSlide.number} / 04</span>
            </div>

            <button
              type="button"
              onClick={next}
              aria-label="Next collection"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-white/65 backdrop-blur-md transition hover:bg-white hover:text-[#061c19]"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <motion.div style={{ opacity: headlineOpacity }} className="absolute bottom-7 left-7 z-30 hidden items-center gap-3 md:flex">
            <span className="text-[7px] tracking-[0.28em] text-white/25 uppercase">Scroll to explore</span>
            <ArrowDown className="h-3.5 w-3.5 text-white/35" />
          </motion.div>
        </div>
      </section>

      {/* =========================================================
          BRAND STATEMENT — short transition instead of a large logo strip
         ========================================================= */}
      <section className="relative z-10 mx-2 -mt-4 overflow-hidden rounded-[36px] border border-black/[0.05] bg-white sm:mx-3 sm:rounded-[44px] md:mx-4 md:rounded-[54px]">
        <div className="mx-auto max-w-[1350px] px-6 py-20 sm:px-10 md:py-28">
          <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
            <div>
              <p className="text-[8px] tracking-[0.35em] text-black/30 uppercase">01 / The idea</p>
              <h2 className="mt-6 text-[clamp(3.2rem,7vw,7rem)] leading-[0.77] font-black tracking-[-0.085em]">
                Made for
                <br />
                <span className="[font-family:var(--font-windsong)] font-light tracking-normal text-black/35">your celebration.</span>
              </h2>
            </div>

            <div>
              <p className="max-w-[730px] text-lg leading-8 text-black/50 sm:text-xl md:text-2xl md:leading-9">
                Your invitation should feel like the first chapter of the celebration — not another generic event link. MomentsEra brings
                story, design and useful guest details into one beautifully composed experience.
              </p>

              <div className="mt-7">
                <PortalButton onClick={() => router.push("/about-us")}>Discover MomentsEra</PortalButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          COLLECTION — product-card language from page-02
         ========================================================= */}
      <section className="bg-[#f7f6f1] px-5 py-20 sm:px-8 md:py-28">
        <div className="mx-auto max-w-[1280px]">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-[8px] tracking-[0.35em] text-black/30 uppercase">02 / The collection</p>
              <h2 className="mt-5 text-[clamp(3rem,6vw,6rem)] leading-[0.78] font-black tracking-[-0.085em]">
                Elevate your day
                <br />
                <span className="[font-family:var(--font-windsong)] font-light text-black/35">in every detail.</span>
              </h2>
            </div>

            <PortalButton onClick={() => router.push("/invites")}>View all invitations</PortalButton>
          </div>

          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {heroSlides.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => router.push("/invites")}
                className="group overflow-hidden rounded-[24px] border border-black/[0.07] bg-[#efede6] text-left transition duration-500 hover:-translate-y-2 hover:shadow-[0_25px_70px_rgba(0,0,0,.10)]"
              >
                <div className="relative aspect-[0.88] overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 90vw, 25vw"
                    className="object-contain p-4 transition duration-700 group-hover:scale-[1.04]"
                  />
                  <span className="absolute top-4 left-4 rounded-full bg-white/85 px-3 py-2 text-[7px] tracking-[0.2em] text-black/45 uppercase backdrop-blur">
                    {item.number}
                  </span>
                </div>

                <div className="border-t border-black/[0.06] bg-white p-5">
                  <div className="flex justify-between">
                    <span className="text-[7px] tracking-[0.25em] text-black/35 uppercase">{item.category}</span>
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-25 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                  </div>
                  <h3 className="mt-3 text-xl font-black tracking-[-0.05em]">{item.title}</h3>
                  <p className="mt-2 text-[10px] leading-4 text-black/45">{item.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          CREATIVE STORY — editorial image + personalization
         ========================================================= */}
      <section className="bg-white px-5 py-20 sm:px-8 md:py-28">
        <div className="mx-auto grid max-w-[1180px] items-center gap-12 md:grid-cols-2 md:gap-20">
          <div className="relative mx-auto aspect-square w-full max-w-[520px] overflow-hidden rounded-[32px] bg-[#eee9de]">
            <Image
              src={celeb1}
              alt="MomentsEra celebration"
              fill
              sizes="520px"
              className="object-cover transition duration-1000 hover:scale-105"
            />
            <div className="absolute inset-5 rounded-[25px] border border-white/50" />

            <div className="absolute right-5 bottom-5 rounded-[18px] bg-white/90 px-4 py-3 backdrop-blur-md">
              <p className="text-[7px] tracking-[0.25em] text-black/30 uppercase">Your story</p>
              <p className="mt-1 text-xs font-semibold">Carefully composed.</p>
            </div>
          </div>

          <div>
            <p className="text-[8px] tracking-[0.32em] text-black/30 uppercase">03 / Personal by design</p>
            <h2 className="mt-5 text-[clamp(3rem,5vw,5.6rem)] leading-[0.8] font-black tracking-[-0.08em]">
              Your story,
              <br />
              <span className="[font-family:var(--font-windsong)] font-light text-black/35">beautifully told.</span>
            </h2>

            <p className="mt-7 max-w-[500px] text-sm leading-7 text-black/45">
              Start with a collection and shape the experience around your people, photographs, traditions, timings and the feeling you want
              your guests to remember.
            </p>

            <div className="mt-7 flex flex-wrap gap-2">
              {["Typography", "Colors", "Music", "Gallery", "RSVP"].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-black/10 px-4 py-2 text-[8px] tracking-[0.16em] text-black/50 uppercase"
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-8">
              <PortalButton onClick={() => router.push("/invites")}>Explore the editor</PortalButton>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          DARK EXPERIENCE — page-02 features + page-01 interaction style
         ========================================================= */}
      <section className="relative overflow-hidden rounded-t-[44px] bg-[#061c19] px-5 py-24 text-white sm:px-8 md:rounded-t-[60px] md:py-32">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-[12%] left-[10%] h-[360px] w-[360px] rounded-full bg-[#9fc5b4]/10 blur-[100px]" />
          <div className="absolute right-[4%] bottom-[8%] h-[420px] w-[420px] rounded-full bg-white/[0.04] blur-[110px]" />
          <div className="absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.6)_1px,transparent_1px)] [background-size:90px_90px] opacity-[0.025]" />
        </div>

        <div className="relative mx-auto max-w-[1280px]">
          <div className="grid items-start gap-14 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="lg:sticky lg:top-24">
              <p className="text-[8px] tracking-[0.35em] text-white/30 uppercase">04 / Guest experience</p>
              <h2 className="mt-6 text-[clamp(3.2rem,7vw,6.8rem)] leading-[0.77] font-black tracking-[-0.085em]">
                Everything
                <br />
                <span className="[font-family:var(--font-windsong)] font-light text-white/40">in one place.</span>
              </h2>
              <p className="mt-7 max-w-[460px] text-sm leading-6 text-white/45">
                From the first welcome to the final wish, guests can discover exactly what they need without losing the emotion of the
                occasion.
              </p>

              <div className="mt-8">
                <PortalButton light onClick={() => router.push("/invites")}>
                  Build the experience
                </PortalButton>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {features.map((item, index) => (
                <motion.article
                  key={item.number}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.6, delay: index * 0.05, ease }}
                  className="group flex min-h-[205px] flex-col justify-between rounded-[24px] border border-white/10 bg-white/[0.045] p-5 backdrop-blur-sm transition duration-500 hover:-translate-y-2 hover:bg-white hover:text-[#061c19]"
                >
                  <div className="flex items-start justify-between">
                    <span className="text-[8px] tracking-[0.25em] text-white/25 group-hover:text-black/25">{item.number}</span>
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/65 group-hover:border-black/10 group-hover:bg-black/[0.03] group-hover:text-black/60">
                      {item.icon}
                    </span>
                  </div>

                  <div>
                    <p className="text-[7px] tracking-[0.24em] text-white/25 uppercase group-hover:text-black/25">{item.label}</p>
                    <h3 className="mt-2 text-lg font-bold tracking-[-0.04em]">{item.title}</h3>
                    <p className="mt-2 text-[9px] leading-4 text-white/40 group-hover:text-black/45">{item.description}</p>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </div>

        <div className="pointer-events-none relative mx-[-2%] mt-20 h-8 bg-[#f7f6f1] [clip-path:polygon(0_50%,14%_20%,28%_62%,43%_32%,58%_65%,72%_25%,87%_60%,100%_30%,100%_100%,0_100%)]" />
      </section>

      {/* =========================================================
          MINI COLLECTION / MEMORY GRID — keeps the page visual
         ========================================================= */}
      <section className="bg-[#f7f6f1] px-5 py-20 sm:px-8 md:py-28">
        <div className="mx-auto max-w-[1280px]">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-[8px] tracking-[0.32em] text-black/30 uppercase">05 / The feeling</p>
              <h2 className="mt-5 text-[clamp(3rem,6vw,5.8rem)] leading-[0.78] font-black tracking-[-0.08em]">
                Keep the
                <br />
                <span className="[font-family:var(--font-windsong)] font-light text-black/35">memory close.</span>
              </h2>
            </div>

            <button
              type="button"
              onClick={() => router.push("/invites")}
              className="hidden items-center gap-2 border-b border-black/20 pb-2 text-[8px] tracking-[0.2em] uppercase sm:flex"
            >
              Explore invitations
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-12 grid auto-rows-[75px] grid-cols-12 gap-2 sm:auto-rows-[105px]">
            {[celeb1, celeb2, mockup2, celeb3, grid, celeb4].map((image, index) => (
              <div
                key={index}
                className={`relative overflow-hidden ${
                  index === 0
                    ? "col-span-5 row-span-4"
                    : index === 1
                      ? "col-span-3 row-span-3"
                      : index === 2
                        ? "col-span-4 row-span-4"
                        : index === 3
                          ? "col-span-3 row-span-3"
                          : index === 4
                            ? "col-span-4 row-span-3"
                            : "col-span-5 row-span-3"
                }`}
              >
                <Image
                  src={image}
                  alt=""
                  fill
                  sizes="40vw"
                  className="object-cover grayscale transition duration-700 hover:scale-105 hover:grayscale-0"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          FINAL CTA — short, strong, routes to contact
         ========================================================= */}
      <section className="bg-white px-6 py-24 text-center sm:px-10 md:py-32">
        <p className="text-[8px] tracking-[0.35em] text-black/30 uppercase">06 / Begin</p>

        <h2 className="mx-auto mt-6 max-w-[950px] text-[clamp(3.5rem,8vw,8rem)] leading-[0.75] font-black tracking-[-0.09em]">
          Make the first
          <br />
          <span className="[font-family:var(--font-windsong)] font-light text-black/35">impression unforgettable.</span>
        </h2>

        <p className="mx-auto mt-7 max-w-[500px] text-sm leading-6 text-black/45">
          Choose a design, make it yours, and give your guests one beautiful place to experience the celebration.
        </p>

        <div className="mt-8 flex justify-center gap-3">
          <PortalButton onClick={() => router.push("/invites")}>Explore invitations</PortalButton>
          <button
            type="button"
            onClick={() => router.push("/contact-us")}
            className="hidden h-12 items-center gap-2 rounded-full border border-black/10 px-5 text-[9px] tracking-[0.2em] uppercase transition hover:bg-black hover:text-white sm:inline-flex"
          >
            Talk to us
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </section>

      <Footer />
    </main>
  );
}
