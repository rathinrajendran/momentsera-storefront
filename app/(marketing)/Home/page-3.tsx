"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AnimatePresence, motion, useScroll, useTransform, type Variants } from "framer-motion";
import { Check, Sparkles, ArrowUpRight, ArrowLeft, ArrowRight } from "lucide-react";
import { Header } from "../components/header/Header";
import { Footer } from "../components/footer/Footer";
import celeb1 from "../../../public/images/celebrations/1.webp";
import celeb2 from "../../../public/images/celebrations/2.webp";
import celeb3 from "../../../public/images/celebrations/3.webp";
import celeb4 from "../../../public/images/celebrations/4.webp";
import { Para } from "../../../components/ui/Para";
import Heading from "../../../components/ui/Heading";
const ease = [0.19, 1, 0.22, 1] as const;

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1.2, ease },
  },
};

const cards = [
  {
    title: "Luxury Wedding Invites",
    category: "Wedding",
    image: celeb1,
  },
  {
    title: "Birthday Experiences",
    category: "Birthday",
    image: celeb2,
  },
  {
    title: "Elegant Anniversary Stories",
    category: "Anniversary",
    image: celeb3,
  },
  {
    title: "Corporate Event Invitations",
    category: "Corporate",
    image: celeb4,
  },
];

type HeroTheme = {
  bg: string;
  ink: string;
  accentSoft: string;
  eyebrow: string;
  tagline: string;
  cta: string;
};

const heroThemes: Record<string, HeroTheme> = {
  Wedding: {
    bg: "#FBEFEF",
    ink: "#3D1E22",
    accentSoft: "#E7C9CC",
    eyebrow: "Invitation Studio — Wedding",
    tagline: "Where forever begins with a single beautiful invite.",
    cta: "Create Wedding Invite",
  },
  Birthday: {
    bg: "#FDF1E2",
    ink: "#4A2F0E",
    accentSoft: "#F0D6A6",
    eyebrow: "Invitation Studio — Birthday",
    tagline: "Every year deserves an entrance worth remembering.",
    cta: "Create Birthday Invite",
  },
  Anniversary: {
    bg: "#F3EBF3",
    ink: "#3A1E3B",
    accentSoft: "#D9C0DA",
    eyebrow: "Invitation Studio — Anniversary",
    tagline: "Celebrate the years with the same elegance as day one.",
    cta: "Create Anniversary Invite",
  },
  Corporate: {
    bg: "#ECEEF2",
    ink: "#1C232E",
    accentSoft: "#C7CEDA",
    eyebrow: "Invitation Studio — Corporate",
    tagline: "First impressions, engineered for the boardroom.",
    cta: "Create Corporate Invite",
  },
};

const heroSlides = cards.map((card) => ({
  ...card,
  ...heroThemes[card.category],
}));

const services = [
  {
    num: "01",
    title: "Premium Invitation Design",
    desc: "Elegant custom invitations crafted exclusively for your celebration style.",
  },
  {
    num: "02",
    title: "Smart RSVP Management",
    desc: "Real-time guest confirmations, attendance tracking, and personalized RSVP flows.",
  },
  {
    num: "03",
    title: "Animated Invitations",
    desc: "Cinematic motion graphics and smooth interactive storytelling experiences.",
  },
  {
    num: "04",
    title: "Photo & Video Galleries",
    desc: "Beautifully curated memories with immersive galleries and premium layouts.",
  },
  {
    num: "05",
    title: "Instant Sharing",
    desc: "Optimized sharing for WhatsApp, Instagram, email, and mobile devices.",
  },
  {
    num: "06",
    title: "Corporate Event Solutions",
    desc: "Professional invitation systems for launches, conferences, and premium business events.",
  },
];

const features = ["Interactive RSVP Systems", "Premium Photo Galleries", "Music & Motion Effects", "Google Maps & Live Locations"];

export default function Home() {
  const router = useRouter();
  const containerRef = useRef(null);
  const [heroIndex, setHeroIndex] = useState(0);
  const [heroPaused, setHeroPaused] = useState(false);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const slide = heroSlides[heroIndex];

  const goToHero = (next: number) => {
    setHeroIndex((next + heroSlides.length) % heroSlides.length);
  };

  useEffect(() => {
    if (heroPaused) return;
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [heroPaused]);

  return (
    <main
      ref={containerRef}
      className="bg-background text-primary relative min-h-screen overflow-hidden selection:bg-black selection:text-white"
    >
      <Header />
      {/* HERO */}
      <section
        className="relative min-h-[100dvh] overflow-hidden border-b border-slate-50 px-6 pt-20 pb-20 transition-colors duration-700 md:px-20"
        style={{ backgroundColor: slide.bg }}
        onMouseEnter={() => setHeroPaused(true)}
        onMouseLeave={() => setHeroPaused(false)}
      >
        <div className="mx-auto max-w-[1440px]">
          <motion.div style={{ scale: heroScale, opacity: heroOpacity }} className="relative z-10 w-full">
            <div className="grid items-center gap-16 lg:grid-cols-2">
              {/* TEXT */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={slide.category}
                  initial="hidden"
                  animate="show"
                  exit={{ opacity: 0, y: -30, filter: "blur(10px)" }}
                  variants={fadeInUp}
                  className="order-2 lg:order-1"
                  style={{ color: slide.ink }}
                >
                  <p className="text-[10px] font-light tracking-[0.35em] uppercase opacity-60">{slide.eyebrow}</p>

                  <h1 className="mt-5 text-5xl leading-[1.02] font-black tracking-[-0.04em] sm:text-6xl xl:text-7xl">{slide.category}</h1>

                  <p className="mt-6 max-w-md [font-family:var(--font-windsong)] text-lg leading-relaxed font-light italic">
                    {slide.tagline}
                  </p>

                  <Para className="mt-4 max-w-sm opacity-70" variant="small">
                    {slide.title}
                  </Para>

                  <div className="mt-9 flex items-center gap-4">
                    <button
                      onClick={() => router.push("/invites")}
                      className="group relative flex cursor-pointer items-center rounded-full bg-[var(--primary)] py-2 pr-2 pl-6 text-[10px] font-light tracking-[0.25em] text-white uppercase"
                    >
                      <span className="relative z-10 text-xs font-light tracking-[0.2em] uppercase">{slide.cta}</span>
                      <div className="ml-2 rounded-full bg-[var(--accent-primary)] p-2">
                        <ArrowUpRight strokeWidth={1} className="relative z-10 h-5 w-5 text-white" />
                      </div>
                    </button>

                    <span className="text-xs tracking-[0.2em] opacity-50">
                      {String(heroIndex + 1).padStart(2, "0")} / {String(heroSlides.length).padStart(2, "0")}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* VISUAL */}
              <div className="relative order-1 flex items-center justify-center lg:order-2">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={slide.category + "-img"}
                    initial={{ opacity: 0, scale: 0.94, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.94, y: -20 }}
                    transition={{ duration: 0.9, ease }}
                    className="shadow-premium relative aspect-[4/5] w-full max-w-[420px] overflow-hidden rounded-[190px_190px_40px_40px] border"
                    style={{ borderColor: slide.accentSoft }}
                  >
                    <Image src={slide.image} alt={slide.title} fill className="object-cover" priority={heroIndex === 0} />
                    <div
                      className="absolute inset-0"
                      style={{ background: `linear-gradient(180deg, transparent 55%, ${slide.bg}66 100%)` }}
                    />
                  </motion.div>
                </AnimatePresence>

                {/* dot navigation */}
                <div className="absolute -bottom-2 left-1/2 flex -translate-x-1/2 gap-2">
                  {heroSlides.map((s, i) => (
                    <button
                      key={s.category}
                      onClick={() => goToHero(i)}
                      aria-label={`Go to ${s.category} slide`}
                      aria-current={i === heroIndex}
                      className="h-1.5 rounded-full transition-all duration-500"
                      style={{
                        width: i === heroIndex ? 26 : 8,
                        backgroundColor: slide.ink,
                        opacity: i === heroIndex ? 1 : 0.25,
                      }}
                    />
                  ))}
                </div>

                {/* prev / next */}
                <div className="absolute top-2 right-2 flex gap-2" style={{ color: slide.ink }}>
                  <button
                    onClick={() => goToHero(heroIndex - 1)}
                    aria-label="Previous slide"
                    className="flex h-9 w-9 items-center justify-center rounded-full border bg-white/70 backdrop-blur transition-colors hover:bg-white"
                    style={{ borderColor: slide.accentSoft }}
                  >
                    <ArrowLeft strokeWidth={1.5} className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => goToHero(heroIndex + 1)}
                    aria-label="Next slide"
                    className="flex h-9 w-9 items-center justify-center rounded-full text-white transition-transform hover:scale-105"
                    style={{ backgroundColor: slide.ink }}
                  >
                    <ArrowRight strokeWidth={1.5} className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SHOWCASE */}
      <section className="bg-secondary text-primary shadow-premium relative z-20 border-y border-slate-100 px-[20px] py-40 md:px-[40px]">
        <Heading
          layout="split"
          variant="light"
          label="Premium Experiences"
          title="Designed for modern"
          subtitle="Celebrations."
          desc="Luxury invitation experiences crafted with cinematic visuals, elegant typography, smooth interactions, and personalized
                storytelling."
        />

        <div className="mx-auto max-w-[1440px]">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -15 }}
                className="group relative h-[350px] overflow-hidden rounded-[32px] border border-slate-100 bg-white"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

                <div className="absolute right-10 bottom-12 left-10 translate-y-12 text-white transition-all duration-700 group-hover:translate-y-0">
                  <p className="mb-3 text-[10px] font-light tracking-[0.4em] uppercase opacity-60">{item.category}</p>

                  <h3 className="text-[28px] leading-none font-black tracking-[-0.06em]">{item.title}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* BRAND PHILOSOPHY */}
      <section className="overflow-hidden bg-[var(--accent-primary)] px-6 py-60 text-white">
        <Heading
          variant="dark"
          label="Our Vision"
          title={
            <>
              Every celebration
              <br />
              deserves a beautiful
            </>
          }
          subtitle="Beginning."
          desc="We create refined digital invitations that combine design, motion, storytelling, and technology to leave a lasting first
                impression for your guests."
          align="center"
        />
      </section>

      {/* SERVICES */}
      <section className="bg-background border-b border-slate-50 px-6 pt-40 pb-10 md:px-20">
        <div className="mx-auto max-w-[1440px]">
          <Heading
            layout="split"
            variant="light"
            label="What We Create"
            title="Premium invitation"
            subtitle="Experiences."
            desc="Crafted by our creative team in Trivandrum, Kerala. Delivering elegant digital invitations for modern celebrations."
          />
          <div className="grid grid-cols-1 gap-x-12 gap-y-24 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => (
              <div key={i} className="group flex flex-col space-y-6">
                <span className="text-[10px] font-bold tracking-[0.4em] text-black opacity-40 transition-opacity group-hover:opacity-100">
                  / {service.num}
                </span>

                <h3 className="text-md leading-none font-bold tracking-[-0.06em] sm:text-lg">{service.title}</h3>

                <Para variant="small">{service.desc}</Para>

                <div className="h-[1px] w-full origin-left scale-x-100 bg-slate-100 transition-colors group-hover:bg-black" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section className="relative overflow-hidden bg-white px-6 py-40 md:px-20">
        <div className="mx-auto grid max-w-[1440px] items-center gap-32 lg:grid-cols-2">
          <div className="shadow-premium relative aspect-[4/5] overflow-hidden rounded-[60px] border border-slate-100">
            <Image src="https://picsum.photos/1000/1250?random=30" alt="Experience" fill className="object-cover grayscale" />

            <div className="absolute inset-0 bg-black/5 mix-blend-multiply" />
          </div>

          <div className="">
            <Heading
              icon={<Sparkles className="m-0 h-10 w-10 text-black" strokeWidth={0.5} color="black" />}
              title="Memorable by"
              subtitle="Design."
              desc="From intimate weddings to premium corporate events, every invitation is carefully crafted to reflect elegance, emotion, and
                celebration."
            />
            <div className="space-y-5">
              {features.map((feature, i) => (
                <div
                  key={i}
                  className="group flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-8 transition-all hover:border-black"
                >
                  <span className="text-sm leading-7 font-light tracking-normal group-hover:text-black">{feature}</span>

                  <Check className="h-4 w-4 text-black opacity-20 group-hover:opacity-100" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* DEVICE PREVIEW */}
      <section className="bg-secondary relative border-t border-slate-100 px-6 py-40 md:px-20">
        <div className="mx-auto grid max-w-[1440px] items-center gap-20 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <Heading
              title="Perfect on every"
              subtitle="Device."
              desc="Optimized for mobile, tablet, and desktop experiences with smooth performance and premium visual quality."
              buttonText="View Demo Invite"
            />
          </div>

          <div className="relative order-1 flex justify-start lg:order-2">
            <div className="relative h-[580px] w-[280px] overflow-hidden rounded-[3rem] border-[8px] border-[#222] bg-[#111] p-3 shadow-2xl">
              <div className="absolute top-0 left-1/2 z-20 h-6 w-20 -translate-x-1/2 rounded-b-2xl bg-[#222]" />

              <div className="relative h-full w-full overflow-hidden rounded-[2rem] bg-white grayscale transition-all duration-700 hover:grayscale-0">
                <Image src="https://picsum.photos/600/1200?random=44" fill className="object-cover" alt="Mobile Preview" />
              </div>
            </div>

            <div className="shadow-premium absolute -bottom-10 left-50 z-30 hidden h-[400px] w-[300px] overflow-hidden rounded-3xl border border-slate-200 md:block">
              <Image src="https://picsum.photos/600/800?random=45" fill className="object-cover grayscale" alt="" />
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative overflow-hidden bg-black px-6 py-40 text-white">
        <Heading
          variant="dark"
          label="Premium Invitation Studio"
          title="Celebrations designed"
          subtitle="Beautifully."
          desc="Weddings, birthdays, anniversaries, house warming ceremonies, and corporate events. Crafted with elegance by our creative team
            in Kerala."
          buttonText="Start Now"
          onClick={() => router.push("/invites")}
          align="center"
        />
      </section>
      <Footer />
    </main>
  );
}
