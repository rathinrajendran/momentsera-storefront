"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles, Fingerprint, Zap, Heart, Layers3, WandSparkles } from "lucide-react";

import { Header } from "../components/header/Header";
import { Footer } from "../components/footer/Footer";
import { H2 } from "../../../components/ui/H2";
import { H5 } from "../../../components/ui/H5";
import { Para } from "../../../components/ui/Para";
import Heading from "../../../components/ui/Heading";

const features = [
  {
    number: "01",
    title: "Meaningful Design",
    description: "Every screen, section, animation, and interaction is designed with intention.",
    icon: <Fingerprint className="h-5 w-5" strokeWidth={1.2} />,
  },
  {
    number: "02",
    title: "Modern Technology",
    description: "Fast, responsive digital experiences built with modern web technology.",
    icon: <Zap className="h-5 w-5" strokeWidth={1.2} />,
  },
  {
    number: "03",
    title: "Emotional Storytelling",
    description: "We turn important moments into experiences people want to explore.",
    icon: <Heart className="h-5 w-5" strokeWidth={1.2} />,
  },
];

const capabilities = [
  "Digital Invitation Design",
  "Interactive RSVP Experiences",
  "Motion & Micro Interactions",
  "Photo & Video Galleries",
  "Custom Event Websites",
  "Premium Guest Experiences",
];

export default function AboutUs() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#08090a] text-[#e2e2e2] selection:bg-[#84a59d] selection:text-[#08090a]">
      <Header />

      {/* ══════════════════════════════ HERO ══════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#f4f2ed] px-5 pt-20 pb-8 text-[#08090a] md:px-10 lg:pt-24">
        <div className="mx-auto max-w-[1500px]">
          {/* Top information bar */}
          <div className="flex items-center justify-between border-b border-black/10 pb-4 text-[9px] tracking-[0.3em] uppercase">
            <span>About the studio</span>

            <div className="hidden items-center gap-8 opacity-45 md:flex">
              <span>Design</span>
              <span>Technology</span>
              <span>Experience</span>
            </div>

            <span>2026 — Present</span>
          </div>

          <div className="grid min-h-[calc(100svh-145px)] items-center gap-14 py-16 lg:grid-cols-[1fr_.9fr] lg:py-10">
            <div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-7 text-[9px] font-medium tracking-[0.35em] uppercase opacity-45"
              >
                Our Philosophy
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 55, filter: "blur(12px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
                className="max-w-[850px] text-[clamp(4rem,9vw,9rem)] leading-[.78] font-black tracking-[-0.08em]"
              >
                Engineering
                <br />
                <span className="[font-family:var(--font-windsong)] font-light tracking-normal opacity-65">Emotion.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.8 }}
                className="mt-10 max-w-[470px] text-sm leading-6 text-black/55"
              >
                We are a digital design and development studio based in Kerala, creating premium invitation experiences, modern websites,
                and memorable digital products.
              </motion.p>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="group mt-8 flex items-center gap-4 border-b border-black pb-2 text-[9px] font-medium tracking-[0.25em] uppercase"
              >
                Discover our approach
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </motion.button>
            </div>

            {/* Studio UI card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 1, ease: [0.19, 1, 0.22, 1] }}
              className="relative mx-auto w-full max-w-[570px]"
            >
              <div className="rounded-[34px] border border-black/10 bg-[#111] p-2 shadow-[0_40px_120px_rgba(0,0,0,.16)]">
                <div className="flex h-10 items-center justify-between border-b border-white/10 px-4 text-white/40">
                  <div className="flex gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-white/20" />
                    <span className="h-2 w-2 rounded-full bg-white/20" />
                    <span className="h-2 w-2 rounded-full bg-white/20" />
                  </div>
                  <span className="text-[8px] tracking-[0.25em] uppercase">MomentsEra / Studio</span>
                  <span className="text-[8px]">01</span>
                </div>

                <div className="relative min-h-[430px] overflow-hidden rounded-b-[27px] bg-[#ece7dc] p-7">
                  <div className="absolute inset-0 [background-image:linear-gradient(rgba(0,0,0,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,.06)_1px,transparent_1px)] [background-size:34px_34px] opacity-30" />

                  <div className="relative flex h-full min-h-[375px] flex-col justify-between">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-[8px] tracking-[0.3em] uppercase opacity-40">Digital experiences</p>
                        <p className="mt-2 text-xl font-bold tracking-[-0.05em]">Made to matter.</p>
                      </div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white/60">
                        <WandSparkles className="h-4 w-4" strokeWidth={1} />
                      </div>
                    </div>

                    <div className="mx-auto w-full max-w-[300px] rounded-[24px] bg-white p-5 shadow-[0_25px_60px_rgba(0,0,0,.1)]">
                      <div className="aspect-[4/3] rounded-[18px] bg-[#dce5df] p-4">
                        <div className="flex h-full flex-col justify-between rounded-[13px] border border-black/5 bg-[#f7f4ed] p-4">
                          <span className="text-[7px] tracking-[0.25em] uppercase opacity-35">A celebration</span>
                          <div>
                            <p className="text-3xl leading-none font-black tracking-[-0.07em]">Evin</p>
                            <p className="mt-1 [font-family:var(--font-windsong)] text-2xl opacity-60">&</p>
                            <p className="text-3xl leading-none font-black tracking-[-0.07em]">Aparna</p>
                          </div>
                          <span className="text-[7px] tracking-[0.2em] uppercase opacity-35">Wedding invitation</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[8px] tracking-[0.25em] uppercase opacity-35">Design / Motion / Technology</span>
                      <ArrowUpRight className="h-4 w-4 opacity-40" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-5 -left-5 hidden rounded-2xl border border-black/10 bg-white p-4 shadow-xl sm:block">
                <p className="text-[8px] tracking-[0.2em] uppercase opacity-35">Studio</p>
                <p className="mt-1 text-sm font-bold">Kerala, India</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ STUDIO DATA ═══════════════════════════ */}
      <section className="border-b border-white/10 bg-[#08090a] px-5 py-16 md:px-10">
        <div className="mx-auto grid max-w-[1500px] grid-cols-2 gap-8 md:grid-cols-4">
          {[
            ["01", "Founded", "2026"],
            ["02", "Location", "Kerala, India"],
            ["03", "Focus", "Digital Experiences"],
            ["04", "Approach", "Design + Technology"],
          ].map(([number, label, value]) => (
            <div key={number} className="border-l border-white/10 pl-5">
              <p className="text-[8px] tracking-[0.3em] text-white/25">{number}</p>
              <p className="mt-5 text-[9px] tracking-[0.25em] text-white/35 uppercase">{label}</p>
              <p className="mt-2 text-sm text-white/80">{value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════ GENESIS ═══════════════════════════ */}
      <section className="relative bg-[#f7f8f7] px-5 py-32 text-[#08090a] md:px-10 md:py-40">
        <div className="mx-auto max-w-[1500px]">
          <div className="grid gap-16 lg:grid-cols-[.6fr_1.4fr]">
            <div className="lg:sticky lg:top-32 lg:h-fit">
              <p className="mb-5 text-[9px] tracking-[0.35em] uppercase opacity-40">The Genesis</p>
              <H2 className="text-5xl leading-[.9] font-black tracking-[-0.07em] sm:text-7xl">
                From idea
                <br />
                <span className="opacity-30">to experience.</span>
              </H2>
            </div>

            <div className="max-w-[760px]">
              <Para className="text-xl leading-relaxed text-black/75 md:text-3xl">
                Built on a foundation of modern engineering and thoughtful design, the studio creates digital experiences that balance
                technical excellence with meaningful human connection.
              </Para>

              <div className="mt-16 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[28px] bg-white p-8 shadow-[0_20px_70px_rgba(0,0,0,.04)]">
                  <Fingerprint className="h-7 w-7 text-[#84a59d]" strokeWidth={1} />
                  <H5 className="mt-10 font-bold">Meaningful Design</H5>
                  <Para className="mt-4">
                    Every detail is crafted with intention, balancing elegance, usability, and emotional connection.
                  </Para>
                </div>

                <div className="rounded-[28px] bg-[#111] p-8 text-white">
                  <Zap className="h-7 w-7 text-[#84a59d]" strokeWidth={1} />
                  <H5 className="mt-10 font-bold text-white">Modern Technology</H5>
                  <Para className="mt-4 text-white/50">
                    Built with modern technologies and best practices to ensure speed, reliability, and exceptional experiences.
                  </Para>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ CAPABILITIES ═══════════════════════════ */}
      <section className="bg-[#eeeae3] px-5 py-32 md:px-10 md:py-40">
        <div className="mx-auto max-w-[1500px]">
          <div className="grid gap-14 lg:grid-cols-[.65fr_1.35fr]">
            <div>
              <p className="mb-5 text-[9px] tracking-[0.35em] uppercase opacity-40">What we build</p>
              <h2 className="text-5xl leading-[.88] font-black tracking-[-0.075em] sm:text-7xl">
                Digital
                <br />
                <span className="[font-family:var(--font-windsong)] font-light tracking-normal opacity-60">craft.</span>
              </h2>
            </div>

            <div className="grid border-t border-black/10">
              {capabilities.map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.04 }}
                  className="group flex items-center justify-between border-b border-black/10 py-6"
                >
                  <div className="flex items-center gap-5">
                    <span className="text-[8px] opacity-30">{String(index + 1).padStart(2, "0")}</span>
                    <span className="text-base font-medium tracking-[-0.02em]">{item}</span>
                  </div>

                  <ArrowUpRight className="h-4 w-4 opacity-20 transition-all group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:opacity-100" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ PRINCIPLES ═══════════════════════════ */}
      <section className="bg-white px-5 py-32 text-[#08090a] md:px-10 md:py-40">
        <div className="mx-auto max-w-[1500px]">
          <div className="mb-16 max-w-[650px]">
            <p className="mb-5 text-[9px] tracking-[0.35em] uppercase opacity-40">Our principles</p>
            <h2 className="text-5xl leading-[.9] font-black tracking-[-0.075em] sm:text-7xl">
              Simple ideas.
              <br />
              <span className="opacity-25">Strong experiences.</span>
            </h2>
          </div>

          <div className="grid gap-px overflow-hidden rounded-[32px] border border-black/10 bg-black/10 md:grid-cols-3">
            {features.map((item) => (
              <div key={item.number} className="bg-white p-8 md:p-10">
                <div className="flex items-center justify-between">
                  <span className="text-[8px] tracking-[0.3em] opacity-30">/ {item.number}</span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10">{item.icon}</span>
                </div>

                <h3 className="mt-16 text-xl font-black tracking-[-0.04em]">{item.title}</h3>
                <p className="mt-4 text-sm leading-6 text-black/45">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ CTA ═══════════════════════════ */}
      <section className="relative overflow-hidden bg-[var(--accent-primary)] px-5 py-40 text-center md:py-52">
        <div className="absolute inset-0 [background-image:radial-gradient(circle_at_center,white_0,transparent_42%)] opacity-20" />

        <motion.div
          whileInView={{ scale: [0.92, 1], opacity: [0, 1] }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative mx-auto max-w-[1200px]"
        >
          <p className="text-[9px] tracking-[0.4em] text-white/45 uppercase">Build something meaningful</p>

          <H2 className="mt-8 text-[clamp(4rem,12vw,11rem)] leading-[.75] font-black tracking-[-0.08em] text-white">
            Create with
            <br />
            <span className="[font-family:var(--font-windsong)] font-light tracking-normal text-white/70">us.</span>
          </H2>

          <button className="group mx-auto mt-12 flex items-center gap-5 rounded-full border border-white/20 bg-white/5 py-2 pr-2 pl-7 text-white backdrop-blur-md transition-all duration-500 hover:bg-white hover:text-[#08090a]">
            <span className="text-[9px] font-bold tracking-[0.25em] uppercase">Start a Project</span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black transition-transform duration-300 group-hover:rotate-45">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </button>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
