"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Fingerprint, Heart, Layers3, WandSparkles, Zap } from "lucide-react";

import { Header } from "../components/header/Header";
import { Footer } from "../components/footer/Footer";

const capabilities = [
  "Digital Invitation Design",
  "Interactive RSVP Experiences",
  "Motion & Micro Interactions",
  "Photo & Video Galleries",
  "Custom Event Websites",
  "Premium Guest Experiences",
];

const principles = [
  {
    number: "01",
    title: "Meaningful Design",
    description: "Every screen, section, animation and interaction is designed with intention.",
    icon: <Fingerprint className="h-6 w-6" strokeWidth={1.2} />,
  },
  {
    number: "02",
    title: "Modern Technology",
    description: "Fast, responsive digital experiences built with modern web technology.",
    icon: <Zap className="h-6 w-6" strokeWidth={1.2} />,
  },
  {
    number: "03",
    title: "Emotional Storytelling",
    description: "We turn important moments into experiences people want to explore.",
    icon: <Heart className="h-6 w-6" strokeWidth={1.2} />,
  },
];

export default function AboutUs() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#08090a] text-[#e2e2e2]">
      <Header />

      <section className="bg-[#f4f2ed] px-5 py-20 text-black md:px-10 md:py-28">
        <div className="mx-auto max-w-[1400px]">
          <div className="flex items-center justify-between border-b border-black/10 pb-4 text-[8px] tracking-[.3em] uppercase">
            <span>About MomentsEra</span>
            <span className="hidden opacity-40 md:block">Design · Technology · Experience</span>
            <span>2026 — Present</span>
          </div>

          <div className="grid items-center gap-14 py-16 lg:grid-cols-[1fr_.85fr]">
            <div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[8px] tracking-[.35em] uppercase opacity-40"
              >
                Our philosophy
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="mt-7 text-[clamp(4rem,9vw,9rem)] leading-[.76] font-black tracking-[-.08em]"
              >
                Engineering
                <br />
                <span className="[font-family:var(--font-windsong)] font-light opacity-60">Emotion.</span>
              </motion.h1>

              <p className="mt-9 max-w-[520px] text-sm leading-7 text-black/50">
                We are a digital design and development studio based in Kerala, creating premium invitation experiences, modern websites and
                memorable digital products.
              </p>

              <button
                type="button"
                className="group mt-8 flex items-center gap-4 border-b border-black pb-2 text-[8px] tracking-[.25em] uppercase"
              >
                Built around people and moments
                <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-1 group-hover:-translate-y-1" />
              </button>
            </div>

            <div className="rounded-[34px] bg-[#111] p-2 shadow-[0_40px_120px_rgba(0,0,0,.16)]">
              <div className="flex h-10 items-center justify-between border-b border-white/10 px-4 text-white/35">
                <div className="flex gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-white/20" />
                  <span className="h-2 w-2 rounded-full bg-white/20" />
                  <span className="h-2 w-2 rounded-full bg-white/20" />
                </div>
                <span className="text-[8px] tracking-[.25em] uppercase">MomentsEra / Studio</span>
                <span className="text-[8px]">01</span>
              </div>

              <div className="relative min-h-[430px] overflow-hidden rounded-b-[27px] bg-[#ece7dc] p-7">
                <div className="absolute inset-0 [background-image:linear-gradient(rgba(0,0,0,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,.06)_1px,transparent_1px)] [background-size:34px_34px] opacity-30" />
                <div className="relative flex min-h-[375px] flex-col justify-between">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-[8px] tracking-[.3em] uppercase opacity-40">Digital experiences</p>
                      <p className="mt-2 text-xl font-bold">Made to matter.</p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white/60">
                      <WandSparkles className="h-4 w-4" />
                    </div>
                  </div>

                  <div className="mx-auto w-full max-w-[300px] rounded-[24px] bg-white p-5 shadow-[0_25px_60px_rgba(0,0,0,.1)]">
                    <div className="rounded-[18px] bg-[#dce5df] p-4">
                      <div className="flex aspect-[4/3] flex-col justify-between rounded-[13px] border border-black/5 bg-[#f7f4ed] p-4">
                        <span className="text-[7px] tracking-[.25em] uppercase opacity-35">A celebration</span>
                        <div>
                          <p className="text-3xl font-black tracking-[-.07em]">Evin</p>
                          <p className="[font-family:var(--font-windsong)] text-2xl opacity-60">&amp;</p>
                          <p className="text-3xl font-black tracking-[-.07em]">Aparna</p>
                        </div>
                        <span className="text-[7px] tracking-[.2em] uppercase opacity-35">Wedding invitation</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[8px] tracking-[.25em] uppercase opacity-35">
                    <span>Design / Motion / Technology</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#08090a] px-5 py-16 md:px-10">
        <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-8 md:grid-cols-4">
          {[
            ["01", "Founded", "2026"],
            ["02", "Location", "Kerala, India"],
            ["03", "Focus", "Digital Experiences"],
            ["04", "Approach", "Design + Technology"],
          ].map(([number, label, value]) => (
            <div key={number} className="border-l border-white/10 pl-5">
              <p className="text-[8px] text-white/25">{number}</p>
              <p className="mt-5 text-[8px] tracking-[.25em] text-white/35 uppercase">{label}</p>
              <p className="mt-2 text-sm text-white/80">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#f7f8f7] px-5 py-20 text-black md:px-10 md:py-28">
        <div className="mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-[.7fr_1.3fr]">
          <div>
            <p className="text-[8px] tracking-[.35em] uppercase opacity-40">The genesis</p>
            <h2 className="mt-5 text-5xl leading-[.85] font-black tracking-[-.07em] sm:text-7xl">
              From idea
              <br />
              <span className="opacity-30">to experience.</span>
            </h2>
          </div>

          <div>
            <p className="max-w-[760px] text-xl leading-relaxed text-black/65 md:text-3xl">
              Built on a foundation of modern engineering and thoughtful design, the studio creates digital experiences that balance
              technical excellence with meaningful human connection.
            </p>

            <div className="mt-12 grid gap-4 sm:grid-cols-2">
              {principles.slice(0, 2).map((item, index) => (
                <div
                  key={item.number}
                  className={`${index === 1 ? "bg-[#111] text-white" : "bg-white"} rounded-[28px] p-8 shadow-[0_20px_70px_rgba(0,0,0,.04)]`}
                >
                  <span className={index === 1 ? "text-[#84a59d]" : "text-[#84a59d]"}>{item.icon}</span>
                  <h3 className="mt-10 font-bold">{item.title}</h3>
                  <p className={`mt-4 text-sm leading-6 ${index === 1 ? "text-white/50" : "text-black/45"}`}>{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#eeeae3] px-5 py-20 md:px-10 md:py-28">
        <div className="mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-[.65fr_1.35fr]">
          <div>
            <p className="text-[8px] tracking-[.35em] uppercase opacity-40">What we build</p>
            <h2 className="mt-5 text-5xl leading-[.85] font-black tracking-[-.075em] sm:text-7xl">
              Digital
              <br />
              <span className="[font-family:var(--font-windsong)] font-light opacity-60">craft.</span>
            </h2>
          </div>

          <div className="border-t border-black/10">
            {capabilities.map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.04 }}
                className="group flex items-center justify-between border-b border-black/10 py-6"
              >
                <div className="flex items-center gap-5">
                  <span className="text-[8px] opacity-30">{String(index + 1).padStart(2, "0")}</span>
                  <span className="text-base font-medium">{item}</span>
                </div>
                <ArrowUpRight className="h-4 w-4 opacity-20 transition group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:opacity-100" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-20 text-black md:px-10 md:py-28">
        <div className="mx-auto max-w-[1100px] text-center">
          <p className="text-[8px] tracking-[.35em] uppercase opacity-40">Our principles</p>
          <h2 className="mt-5 text-5xl leading-[.85] font-black tracking-[-.075em] sm:text-7xl">
            Simple ideas.
            <br />
            <span className="font-light opacity-35">Meaningful results.</span>
          </h2>

          <div className="mt-12 grid gap-3 md:grid-cols-3">
            {principles.map((item) => (
              <div key={item.number} className="border border-black/10 p-7 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-[8px] opacity-30">{item.number}</span>
                  <span className="text-black/50">{item.icon}</span>
                </div>
                <h3 className="mt-12 text-lg font-bold">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-black/45">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-black px-6 py-24 text-center text-white md:py-32">
        <Layers3 className="mx-auto h-7 w-7 text-[#84a59d]" strokeWidth={1} />
        <h2 className="mt-6 text-4xl font-light tracking-[-.07em] sm:text-6xl">
          Let&apos;s create something
          <br />
          <span className="font-black">worth remembering.</span>
        </h2>
        <a
          href="/contact-us"
          className="mt-8 inline-flex items-center gap-3 border-b border-white/30 pb-2 text-[8px] tracking-[.25em] uppercase"
        >
          Start a conversation <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      </section>

      <Footer />
    </main>
  );
}
