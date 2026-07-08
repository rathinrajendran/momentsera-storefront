"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AnimatePresence, motion, useScroll, useTransform, type Variants } from "framer-motion";
import { Check, Sparkles, ArrowUpRight, Heart } from "lucide-react";
import { Header } from "../components/header/Header";
import { Footer } from "../components/footer/Footer";
import { Carousel, CarouselContent, CarouselItem } from "../../../components/ui/carousel";
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
import AnimatedCalendarIcon from "../../[event_key]/invites/catalog/components/icons/AnimatedCalendarIcon";
import LanguageIcon from "../../[event_key]/invites/catalog/components/icons/LanguageIcon";
import AnimatedLanguageIcon from "../../[event_key]/invites/catalog/components/icons/AnimatedLanguageIcon";
import AnimatedLockIcon from "../../[event_key]/invites/catalog/components/icons/AnimatedLockIcon";
import FlipClock from "../../[event_key]/invites/catalog/components/icons/FlipClock";
import AnimatedFlipClock from "../../[event_key]/invites/catalog/components/icons/AnimatedFlipClock";
import { Para } from "../../../components/ui/Para";
import DarkVeil from "../../../components/bits/DarkVeil";
import { H2 } from "../../../components/ui/H2";
import { H6 } from "../../../components/ui/H6";
import Heading from "../../../components/ui/Heading";
// import { AnimatedFlipClock } from "../../[event_key]/invites/catalog/components/icons/AnimatedFlipClock";
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
  const [activeIndex, setActiveIndex] = useState(3);
  const [isHovered, setIsHovered] = useState(false);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const items = [
    {
      icon: <AudioPlayerWave />,
      title: "Music",
      desc: "Personalized Soundtrack",
    },
    {
      icon: <AnimatedGalleryIcon />,
      title: "Gallery",
      desc: "Visual Memories",
    },
    {
      icon: <AnimatedFlipClock />,
      title: "Countdown",
      desc: "Celebration Countdown",
    },
    {
      icon: <AnimatedLockIcon />,
      title: "Privacy",
      desc: "Protected Access",
    },
    {
      icon: <HeartBeat />,
      title: "Wishes",
      desc: "Messages from Guests",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, 2500);

    return () => clearInterval(timer);
  }, []);
  return (
    <main
      ref={containerRef}
      className="bg-background text-primary relative min-h-screen overflow-hidden selection:bg-black selection:text-white"
    >
      <Header />
      {/* HERO */}
      <section className="min-h-[100dvh] border-b border-slate-50 bg-white px-6 pt-20 pb-20 md:px-20">
        {/* <DarkVeil noiseIntensity={0} warpAmount={0.25} speed={1.5} /> */}
        <div className="mx-auto max-w-[1440px]">
          <motion.div style={{ scale: heroScale, opacity: heroOpacity }} className="relative z-10 w-full max-w-[1600px]">
            <div className="grid gap-5 lg:grid-cols-[1fr_50%]">
              <div className="flex items-center justify-center lg:pr-10 xl:pr-0">
                {/* HERO */}
                <div className="relative text-center">
                  <motion.h1 className="relative z-10 text-5xl leading-[1.2] font-black tracking-[0rem] sm:text-6xl xl:text-7xl 2xl:text-7xl">
                    {/* LINE 1 */}
                    <div className="overflow-hidden">
                      <motion.span
                        initial={{ y: 220, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{
                          duration: 1,
                          ease: [0.19, 1, 0.22, 1],
                        }}
                        className="block tracking-[-0.07em]"
                      >
                        Artistry
                      </motion.span>
                    </div>

                    {/* LINE 2 */}
                    <div className="overflow-hidden">
                      <motion.span
                        initial={{ y: 220, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{
                          delay: 0.3,
                          duration: 1,
                          ease: [0.19, 1, 0.22, 1],
                        }}
                        className="block tracking-[-0.07em]"
                      >
                        in every
                      </motion.span>
                    </div>

                    {/* LINE 3 */}
                    <div className="overflow-hidden">
                      <motion.span
                        initial={{ y: 220, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{
                          delay: 0.6,
                          duration: 1,
                          ease: [0.19, 1, 0.22, 1],
                        }}
                        className="block [font-family:var(--font-windsong)] font-light text-[var(--accent-primary)]"
                      >
                        Moment.
                      </motion.span>
                    </div>
                  </motion.h1>
                  <div className="mt-3 flex justify-center overflow-hidden">
                    <motion.button
                      initial={{ y: 220, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{
                        delay: 0.65,
                        duration: 1,
                        ease: [0.19, 1, 0.22, 1],
                      }}
                      onClick={() => router.push("/invites")}
                      className="group relative flex cursor-pointer items-center gap-2 overflow-hidden rounded-full border border-black/10 px-6 py-3 transition-all duration-500 hover:border-black"
                    >
                      <div className="absolute inset-0 origin-center scale-0 rounded-full bg-black transition-transform duration-500 ease-out group-hover:scale-100" />

                      <span className="relative z-10 text-xs font-bold tracking-[0.2em] uppercase transition-colors duration-500 group-hover:text-white">
                        Create now
                      </span>

                      <ArrowUpRight
                        strokeWidth={1}
                        className="relative z-10 h-5 w-5 transition-colors duration-500 group-hover:text-white"
                      />
                    </motion.button>
                  </div>
                </div>
              </div>
              {/* RIGHT */}
              <div className="relative mt-20 flex items-center justify-center md:mt-0">
                {/* main mockup */}
                <div className="relative z-20">
                  <motion.div
                    onHoverStart={() => setIsHovered(true)}
                    onHoverEnd={() => setIsHovered(false)}
                    initial={{ y: 220, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      delay: 0.1,
                      duration: 1,
                      ease: [0.19, 1, 0.22, 1],
                    }}
                    className="flex h-[280px] w-[280px] items-center justify-center rounded-full p-8 sm:h-[450px] sm:w-[450px] md:h-[500px] md:w-[500px] lg:h-[calc(100dvh-160px)] lg:w-[calc(100dvh-160px)]"
                  >
                    {/* floating card */}
                    <motion.div
                      initial={{
                        opacity: 0,
                        x: -80,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                        rotateY: isHovered ? -46 : 0,
                        rotateZ: isHovered ? -14 : 0,
                        skewX: isHovered ? -27 : 0,
                        scale: isHovered ? 0.7 : 1,
                      }}
                      transition={{
                        duration: 0.05,
                        ease: [0.19, 1, 0.22, 1],
                      }}
                      style={{
                        transformPerspective: 2500,
                      }}
                      className="absolute top-60 left-8 z-30 hidden w-[180px] -translate-y-1/2 rounded-3xl border border-[#F5F5F5] bg-white p-3 shadow-[-20px_-20px_60px_rgba(0,0,0,0.08)] sm:block md:w-[240px] md:rounded-3xl md:p-5"
                    >
                      <div className="relative h-[100px] overflow-hidden rounded-2xl md:h-[140px] md:rounded-xl">
                        <motion.div
                          animate={{
                            scale: [1.1, 1],
                          }}
                          transition={{
                            duration: 2,
                            ease: "easeInOut",
                          }}
                          className="overflow-hidden rounded-lg"
                        >
                          <Image
                            src={grid}
                            alt="Gallery"
                            className="h-[200px] w-[200px] w-full object-cover md:w-[500px] lg:h-[160px] xl:h-[200px] 2xl:h-[200px]"
                          />
                        </motion.div>
                      </div>

                      <h3 className="text-md py-2 leading-tight font-bold">Premium Invitation Designs</h3>

                      <p className="text-xs leading-5 text-[#6f665f]">Elegant designs for life's most memorable moments.</p>
                    </motion.div>
                    <div className="relative h-full w-auto">
                      <Image
                        src={mockup}
                        alt="Invitation Preview"
                        className="absolute inset-0 h-full w-auto transition-opacity duration-500"
                        style={{ opacity: isHovered ? 0 : 1 }}
                      />

                      <Image
                        src={mockup2}
                        alt="Invitation Preview"
                        className="h-full w-auto transition-opacity duration-500"
                        style={{ opacity: isHovered ? 1 : 0 }}
                      />
                    </div>
                    {/* floating stat */}
                    <motion.div
                      initial={{
                        opacity: 0,
                        y: 80,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        rotateY: isHovered ? -46 : 0,
                        rotateZ: isHovered ? -10 : 0,
                        skewX: isHovered ? -23 : 0,
                        scale: isHovered ? 0.8 : 1,
                      }}
                      transition={{
                        duration: 0.05,
                        ease: [0.19, 1, 0.22, 1],
                      }}
                      style={{
                        transformPerspective: 2500,
                      }}
                      className={`absolute -bottom-5 bottom-5 z-30 flex h-22 w-62 overflow-hidden rounded-2xl border border-[#F5F5F5] bg-white px-4 py-3 shadow-[0_30px_80px_rgba(0,0,0,0.08)] sm:right-20`}
                    >
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={activeIndex}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center"
                        >
                          <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                            transition={{ duration: 0.5 }}
                          >
                            {items[activeIndex].icon}
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                            transition={{ duration: 0.8 }}
                            className="pl-2"
                          >
                            <h4 className="text-md font-bold">{items[activeIndex].title}</h4>
                            <Para className="text-[#6f665f]" variant="verySmall">
                              {items[activeIndex].desc}
                            </Para>
                          </motion.div>
                        </motion.div>
                      </AnimatePresence>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SHOWCASE */}
      <section className="bg-secondary text-primary shadow-premium relative z-20 border-y border-slate-100 px-6 py-40 md:px-20">
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
