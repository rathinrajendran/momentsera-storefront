"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { ArrowUpRight, Layers, Sparkles } from "lucide-react";
import { Header } from "../../../(marketing)/components/header/Header";
import { resolveMediaUrl } from "../../../../utils/media";

/* ──────────────────────────────────────────
   ANIMATION TOKENS
────────────────────────────────────────── */

const containerVariants: Variants = {
  hidden: { opacity: 0 },

  show: {
    opacity: 1,

    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.98,
  },

  show: {
    opacity: 1,
    y: 0,
    scale: 1,

    transition: {
      duration: 0.8,
      ease: [0.19, 1, 0.22, 1],
    },
  },
};

/* ──────────────────────────────────────────
   COMPONENT
────────────────────────────────────────── */

export default function EventLists({ invites }: { invites: any[] }) {
  const router = useRouter();

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[var(--background)] text-[var(--text-primary)] selection:bg-[var(--accent-primary)] selection:text-white">
      <Header />

      {/* ─────────────────────────────
         ARCHITECTURAL BACKGROUND
      ───────────────────────────── */}

      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 left-1/4 h-full w-px bg-[var(--border-color)]" />

        <div className="absolute top-0 left-2/4 h-full w-px bg-[var(--border-color)]" />

        <div className="absolute top-0 left-3/4 h-full w-px bg-[var(--border-color)]" />
      </div>

      {/* ─────────────────────────────
         CONTENT
      ───────────────────────────── */}

      <section className="relative z-10 mx-auto max-w-[1800px] px-6 pt-[25vh] pb-[15vh] md:px-12 xl:px-20">
        {/* ─────────────────────────────
           HERO
        ───────────────────────────── */}

        <div className="mb-32 flex flex-col justify-between gap-12 lg:flex-row lg:items-end">
          {/* Left */}
          <motion.div
            initial={{
              opacity: 0,
              x: -20,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.8,
            }}
            className="max-w-[900px]"
          >
            <span className="text-[10px] font-bold tracking-[0.6em] text-[var(--accent-primary)] uppercase">Event Collection</span>

            <h1 className="mt-8 text-[clamp(4rem,10vw,8rem)] leading-[0.8] font-bold tracking-[-0.08em] uppercase italic">
              {invites?.[0]?.main_category || "Events"}

              <br />

              <span
                className="text-transparent"
                style={{
                  WebkitTextStroke: "1.5px rgba(23,23,23,0.25)",
                }}
              >
                Experiences.
              </span>
            </h1>
          </motion.div>

          {/* Right */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: 0.4,
            }}
            className="flex h-fit items-center gap-6 border-l border-[var(--border-color)] pl-8"
          >
            <div className="text-right">
              <p className="mb-1 text-[10px] tracking-widest text-[var(--text-muted)] uppercase">Curated Collection</p>

              <p className="text-sm font-bold tracking-tight text-[var(--text-primary)]">Premium Templates</p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--border-color)] bg-white text-[var(--accent-primary)] shadow-sm">
              <Layers size={18} />
            </div>
          </motion.div>
        </div>

        {/* ─────────────────────────────
           GRID
        ───────────────────────────── */}

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid gap-x-8 gap-y-24 md:grid-cols-2 lg:grid-cols-3"
        >
          {invites.map((invite: any) => {
            const webImg = resolveMediaUrl(invite.web_image) || "/images/default/web.png";

            const inviteUrl = `/invites/${invite.main_category}/${invite.invite_key}`;

            return (
              <motion.div key={invite.id} variants={itemVariants} className="group cursor-pointer">
                {/* CARD */}
                <div
                  className="relative aspect-[16/10] overflow-hidden rounded-[32px] border border-[var(--border-color)] bg-white shadow-sm transition-all duration-500 hover:shadow-xl"
                  onClick={() => router.push(inviteUrl)}
                >
                  {/* IMAGE */}
                  <Image
                    src={webImg}
                    alt={invite.shortname}
                    fill
                    className="object-cover opacity-90 transition-all duration-1000 group-hover:scale-110 group-hover:brightness-105"
                  />

                  {/* HOVER BUTTON */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <div className="flex h-16 w-16 scale-75 items-center justify-center rounded-full bg-white text-[var(--accent-primary)] shadow-md transition-transform duration-500 group-hover:scale-100">
                      <ArrowUpRight size={24} />
                    </div>
                  </div>

                  {/* BADGE */}
                  <div className="absolute top-6 left-6">
                    <div className="flex items-center gap-2 rounded-full border border-white/40 bg-white px-3 py-1.5">
                      <Sparkles size={10} className="text-[var(--accent-primary)]" />

                      <span className="text-[9px] font-bold tracking-[0.2em] text-[var(--text-primary)] uppercase">Premium</span>
                    </div>
                  </div>
                </div>

                {/* METADATA */}
                <div className="mt-8 flex items-start justify-between">
                  <div>
                    <h3 className="text-3xl font-bold tracking-tighter text-[var(--text-primary)] capitalize transition-colors group-hover:text-[var(--accent-primary)]">
                      {invite.shortname}
                    </h3>

                    <div className="mt-2 flex items-center gap-3">
                      <span className="text-[10px] tracking-[0.3em] text-[var(--text-muted)] uppercase">{invite.main_category}</span>

                      <div className="h-1 w-1 rounded-full bg-[var(--accent-primary)]" />

                      <span className="text-[10px] tracking-[0.1em] text-[var(--text-muted)] capitalize">2026 Edition</span>
                    </div>
                  </div>

                  {/* PRICE */}
                  <div className="text-right">
                    <p className="text-[10px] tracking-widest text-[var(--text-light)]">Access from</p>

                    <p className="mt-1 text-xl font-bold tracking-tighter text-[var(--text-primary)]">₹{invite.price}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* ─────────────────────────────
         BACKGROUND TYPOGRAPHY
      ───────────────────────────── */}

      <div className="pointer-events-none fixed bottom-[-5%] left-1/2 z-0 -translate-x-1/2 opacity-[0.03] select-none">
        <h2 className="text-[25vw] font-black tracking-[-0.1em] whitespace-nowrap text-[var(--text-primary)] uppercase">The Moments.</h2>
      </div>
    </main>
  );
}
