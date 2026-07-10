"use client";

import Image from "next/image";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { addDays, differenceInSeconds } from "date-fns";
import { motion, type Variants } from "framer-motion";
import { Sparkles, Languages, Clock, MapPin } from "lucide-react";
import { Header } from "../../../../(marketing)/components/header/Header";
import { Carousel, CarouselContent, CarouselItem } from "../../../../../components/ui/carousel";
import AudioPlayer from "../../../../../components/ui/AudioPlayer";
import { Footer } from "../../../../(marketing)/components/footer/Footer";
import { Button } from "../../../../../components/ui/button";
import { H2 } from "../../../../../components/ui/H2";
import { H6 } from "../../../../../components/ui/H6";
import { Para } from "../../../../../components/ui/Para";
import { useAuth } from "../../../../../hooks/useAuth";
import { apiClient } from "../../../../../lib/api/apiClient";

/* ──────────────────────────────────────────
   TOKENS
────────────────────────────────────────── */

const ease = [0.19, 1, 0.22, 1];

const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },

  show: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.8,
      // ease,
    },
  },
};

/* ──────────────────────────────────────────
   COMPONENT
────────────────────────────────────────── */

export default function InviteInner({ invite }: any) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const targetDate = useMemo(() => addDays(new Date(), 5), []);
  const { user, loading } = useAuth();
  useEffect(() => {
    setMounted(true);
    const initialDiff = differenceInSeconds(targetDate, new Date());
    setSecondsLeft(initialDiff > 0 ? initialDiff : 0);
    const timer = setInterval(() => {
      const currentDiff = differenceInSeconds(targetDate, new Date());
      setSecondsLeft(currentDiff > 0 ? currentDiff : 0);
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const timeLeft = useMemo(
    () => ({
      days: Math.floor(secondsLeft / (3600 * 24)),
      hours: Math.floor((secondsLeft % (3600 * 24)) / 3600),
      minutes: Math.floor((secondsLeft % 3600) / 60),
      seconds: secondsLeft % 60,
    }),
    [secondsLeft],
  );

  if (!mounted) return null;

  const handleBuy = async () => {
    sessionStorage.setItem(
      "pending_event",
      JSON.stringify({
        invite_key: invite.invite_key,
        event_type: invite.main_category,
        created_at: Date.now(),
      }),
    );

    try {
      await apiClient("/auth/me");

      router.push(`/invites/${invite.main_category}/${invite.invite_key}/onboarding`);
    } catch {
      router.push("/account/login");
    }
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[var(--background)] text-[var(--text-primary)] selection:bg-[var(--accent-primary)] selection:text-white">
      <Header />

      {/* ─────────────────────────────
         ARCHITECTURE LINES
      ───────────────────────────── */}

      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 right-1/4 h-full w-px bg-[var(--border-color)]" />
      </div>

      {/* ─────────────────────────────
         CONTENT
      ───────────────────────────── */}

      <div className="relative z-10 mx-auto max-w-[1800px] px-6 pt-[20vh] pb-32 md:px-12 xl:px-20">
        {/* ─────────────────────────────
           HERO SECTION
        ───────────────────────────── */}

        <div className="grid grid-cols-1 items-start gap-16 md:grid-cols-12">
          {/* LEFT */}
          <div className="md:col-span-5 lg:col-span-5">
            <motion.div initial="hidden" animate="show" variants={fadeUp}>
              <H6>
                {invite?.main_category}
                {" • "}
                {invite?.style_category}
              </H6>
              <H2 className="capitalize">{invite.shortname}</H2>
              <Para className="mt-8 max-w-[500px] text-[var(--text-secondary)]">{invite?.description}</Para>

              {/* Pricing */}
              <div className="mt-12 flex flex-col gap-6">
                <div className="flex items-baseline gap-3">
                  <span className="text-[10px] font-medium tracking-widest text-[var(--text-muted)] uppercase">Standard License</span>

                  <span className="text-3xl leading-[0.92] font-black tracking-[-0.06em]">₹{invite?.price}</span>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-4">
                  <Button
                    onClick={handleBuy}
                    className="premium-button rounded-full px-6 py-5 text-xs font-black tracking-[0.2em] uppercase"
                  >
                    Customize
                  </Button>

                  <Button
                    className="rounded-full border border-[var(--border-color)] bg-white px-6 py-5 text-xs font-black tracking-[0.2em] uppercase transition-all hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)]"
                    onClick={() => router.push("/account/checkout")}
                  >
                    Buy Now
                  </Button>
                </div>
              </div>

              {/* Audio */}
              <div className="group mt-16 flex cursor-pointer items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[var(--border-color)] bg-white transition-all group-hover:border-[var(--accent-primary)]">
                  <AudioPlayer src="/audio/calm.mp3" allowMute={false} />
                </div>

                <div>
                  <p className="text-[10px] font-bold tracking-widest uppercase">Atmospheric Audio</p>

                  <p className="mt-1 text-[10px] tracking-widest text-[var(--text-muted)] uppercase">Included in Theme</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* RIGHT */}
          <div className="md:col-span-7 lg:col-span-7">
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.95,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                duration: 1,
                // ease,
              }}
              className="relative aspect-[16/10] overflow-hidden rounded-[40px] border border-[var(--border-color)] bg-white shadow-sm"
            >
              {/* Carousel */}
              <Carousel className="h-full w-full">
                <CarouselContent>
                  {Array.from({
                    length: 4,
                  }).map((_, i) => (
                    <CarouselItem key={i}>
                      <div className="relative h-[600px] w-full">
                        <Image
                          src={`https://picsum.photos/seed/${i + 100}/1600/1000`}
                          alt="Gallery"
                          fill
                          className="object-cover transition-transform duration-700 hover:scale-[1.02]"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>

              {/* Badge */}
              <div className="absolute right-8 bottom-8 flex items-center gap-3 rounded-full border border-[var(--border-color)] bg-white px-6 py-3 shadow-sm">
                <Sparkles size={14} className="text-[var(--accent-primary)]" />

                <span className="text-[10px] font-bold tracking-[0.2em] uppercase">2026 Studio Build</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ─────────────────────────────
           COUNTDOWN
        ───────────────────────────── */}

        <div className="mt-40 border-t border-[var(--border-color)] pt-20">
          <div className="flex flex-col items-center justify-between gap-12 md:flex-row">
            {/* Left */}
            <div className="md:w-1/3">
              <h2 className="text-4xl leading-[0.9] font-bold tracking-tighter uppercase">
                The Countdown <br />
                <span className="text-[var(--accent-primary)]">Experience.</span>
              </h2>

              <p className="mt-4 max-w-[300px] text-sm leading-relaxed text-[var(--text-secondary)]">
                A real-time ticker designed to build anticipation for your digital event launch.
              </p>
            </div>

            {/* Right */}
            <div className="flex w-full max-w-2xl flex-1 justify-between">
              {Object.entries(timeLeft).map(([label, value]) => (
                <div key={label} className="text-center">
                  <span className="block text-[clamp(3rem,8vw,6rem)] leading-none font-black tracking-[-0.08em]">
                    {String(value).padStart(2, "0")}
                  </span>

                  <span className="mt-4 block text-[10px] font-bold tracking-[0.3em] text-[var(--text-muted)] uppercase">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─────────────────────────────
           FEATURE GRID
        ───────────────────────────── */}

        <div className="mt-40 grid grid-cols-1 gap-4 md:grid-cols-4">
          {/* Feature 1 */}
          <div className="rounded-[40px] border border-[var(--border-color)] bg-white p-10 transition-all hover:border-[var(--accent-primary)] md:col-span-2">
            <div className="flex h-full flex-col justify-between">
              <Languages size={32} className="text-[var(--accent-primary)]" />

              <div className="mt-20">
                <h3 className="text-2xl font-bold tracking-tight">Bilingual Logic</h3>

                <p className="mt-2 text-sm text-[var(--text-secondary)]">
                  Seamlessly switch between English and Malayalam with a single tap.
                </p>
              </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="rounded-[40px] border border-[var(--border-color)] bg-white p-10">
            <div className="flex h-full flex-col justify-between">
              <Clock size={32} className="text-[var(--text-muted)]" />

              <h3 className="mt-20 text-xl font-bold tracking-tight">Live Timeline</h3>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="rounded-[40px] border border-[var(--border-color)] bg-white p-10">
            <div className="flex h-full flex-col justify-between">
              <MapPin size={32} className="text-[var(--text-muted)]" />

              <h3 className="mt-20 text-xl font-bold tracking-tight">One-Tap Nav</h3>
            </div>
          </div>

          {/* Divider */}
          <div className="my-8 h-px bg-[var(--border-color)] md:col-span-4" />
        </div>
      </div>
      <Footer />
    </main>
  );
}
