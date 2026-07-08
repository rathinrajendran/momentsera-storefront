"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles, Fingerprint, Zap } from "lucide-react";

import { Header } from "../components/header/Header";
import { Footer } from "../components/footer/Footer";

import { H2 } from "../../../components/ui/H2";
import { H5 } from "../../../components/ui/H5";
import { H6 } from "../../../components/ui/H6";
import { Para } from "../../../components/ui/Para";
import Heading from "../../../components/ui/Heading";

// ─────────────────────────────────────────────────────────────────────────────
// Animation Variants
// ─────────────────────────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
      ease: [0.19, 1, 0.22, 1],
    },
  },
};

export default function AboutUs() {
  return (
    <main className="bg-[#08090a] text-[#e2e2e2] selection:bg-[#84a59d] selection:text-[#08090a]">
      <Header />

      {/* ══════════════════════════════ HERO ══════════════════════════════ */}
      <section className="relative mt-15 bg-white px-6 py-20 md:px-20">
        <Heading
          label="Our Philosophy"
          title="Engineering Emotion."
          desc=" We are a digital design and development studio based in Kerala and the UAE, crafting premium invitation experiences, modern
                websites, and memorable digital products. By combining thoughtful design, cutting-edge technology, and storytelling, we
                transform meaningful moments into lasting digital experiences."
        />

        <div className="mx-auto w-full max-w-[1440px] pb-15">
          <div className="grid items-end gap-20 lg:grid-cols-[1fr_400px]">
            <motion.div
              initial="hidden"
              animate="show"
              // variants={fadeUp}
              transition={{ delay: 0.2 }}
              className="max-w-[800px] text-xl leading-tight text-[#6b7280] md:text-3xl"
            >
              <Para variant={"small"}>
                We are a digital design and development studio based in Kerala and the UAE, crafting premium invitation experiences, modern
                websites, and memorable digital products. By combining thoughtful design, cutting-edge technology, and storytelling, we
                transform meaningful moments into lasting digital experiences.
              </Para>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="show"
              // variants={fadeUp}
              transition={{ delay: 0.3 }}
              className="flex flex-col gap-4 border-l border-black/10 pl-8 text-black"
            >
              <div className="flex justify-between">
                <span className="opacity-40">Founded</span>
                <Para>2026</Para>
              </div>

              <div className="flex justify-between">
                <span className="opacity-40">Location</span>
                <Para>Kerala, India · UAE</Para>
              </div>

              <div className="flex justify-between">
                <span className="opacity-40">Expertise</span>
                <Para>Digital Invitations · Web Experiences</Para>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ THE STORY ═══════════════════════════ */}
      <section className="relative z-10 bg-[#f7f8f7] px-6 py-40 text-[#08090a] md:px-20">
        <div className="mx-auto grid max-w-[1440px] gap-5 lg:grid-cols-[200px_1fr]">
          <div className="mb-5 h-fit lg:sticky lg:top-40 lg:mb-0">
            <H2>
              The <br />
              Genesis.
            </H2>
          </div>

          <div className="flex justify-end">
            <div className="w-full space-y-8 text-lg leading-relaxed text-black/80 lg:max-w-[550px]">
              <Para>
                Built on a foundation of modern engineering and thoughtful design, the studio creates digital experiences that balance
                technical excellence with meaningful human connection. Every project is crafted with precision, simplicity, and attention to
                detail, resulting in experiences that are both refined and memorable.
              </Para>

              <Para>
                We set out to redefine how people experience life's most meaningful occasions by combining elegant design, modern
                technology, and purposeful storytelling into every digital interaction.
              </Para>

              <div className="grid gap-8 pt-10 sm:grid-cols-2">
                <div className="space-y-4 rounded-3xl bg-white p-8">
                  <Fingerprint className="h-8 w-8 text-[#84a59d]" />

                  <H5 className="font-bold">Meaningful Design</H5>

                  <Para>Every detail is crafted with intention, balancing elegance, usability, and emotional connection.</Para>
                </div>

                <div className="space-y-4 rounded-3xl bg-white p-8">
                  <Zap className="h-8 w-8 text-[#84a59d]" />

                  <H5 className="font-bold">Modern Technology</H5>

                  <Para>
                    Built using modern technologies and best practices to ensure speed, reliability, and exceptional user experiences.
                  </Para>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ MISSION ═══════════════════════════ */}
      <section className="bg-[#f7f8f7] px-6 pb-40 md:px-20">
        <div className="mx-auto max-w-[1440px] border-t border-black/10 pt-20">
          <div className="grid gap-20 lg:grid-cols-3">
            {[
              {
                title: "Meaningful Design",
                desc: "We create elegant digital experiences that blend aesthetics, usability, and emotional connection.",
                icon: <Sparkles className="h-6 w-6" strokeWidth={1} />,
              },
              {
                title: "Modern Technology",
                desc: "Built with modern web technologies to deliver fast, reliable, and beautifully crafted products.",
                icon: <ArrowUpRight className="h-6 w-6" strokeWidth={1} />,
              },
              {
                title: "Global Perspective",
                desc: "Operating between Kerala and the UAE, we bring local cultural understanding together with international design standards.",
                icon: <Fingerprint className="h-6 w-6" strokeWidth={1} />,
              },
            ].map((item) => (
              <div key={item.title} className="space-y-6">
                <div className="text-[#84a59d]">{item.icon}</div>
                <h2 className="text-lg font-black text-black">{item.title}</h2>
                <Para>{item.desc}</Para>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════════════════════════ CTA ═════════════════════════════ */}
      <section className="overflow-hidden bg-[var(--accent-primary)] px-6 py-40 text-center">
        <motion.div whileInView={{ scale: [0.9, 1], opacity: [0, 1] }} transition={{ duration: 1 }} className="relative inline-block">
          <H2 className="m-0 text-[clamp(40px,12vw,200px)] text-white">Create with us.</H2>

          <button className="group mx-auto mt-12 flex items-center gap-4 rounded-full border border-white/20 px-10 py-5 transition-all duration-500 hover:bg-[#84a59d] hover:text-[#08090a]">
            <span className="text-sm font-bold tracking-widest uppercase">Start a Project</span>

            <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </button>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
