"use client";

import React from "react";
import { motion } from "framer-motion";
import { Heart, Info, ArrowLeft, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Header } from "../../(marketing)/components/header/Header";
import { Footer } from "../../(marketing)/components/footer/Footer";

const notifications = [
  {
    id: 1,
    type: "rsvp",
    title: "New RSVP Received",
    message: "Sarah & Mark confirmed for the Aura Invite.",
    time: "2m ago",
  },

  {
    id: 2,
    type: "system",
    title: "Invite Published",
    message: "Your Golden Sands project is now live.",
    time: "1h ago",
  },

  {
    id: 3,
    type: "alert",
    title: "Storage Limit",
    message: "Staging environment is 80% full.",
    time: "4h ago",
  },
];

export default function NotificationsPage() {
  const router = useRouter();

  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--background)] text-[var(--text-primary)]">
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

      <section className="relative z-10 mx-auto max-w-[1800px] px-[5vw] py-30">
        {/* HEADER */}

        <div className="mb-20 flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            {/* Back */}

            <button
              onClick={() => router.back()}
              className="group mb-6 flex items-center gap-3 text-[10px] font-bold tracking-[0.3em] text-[var(--text-muted)] uppercase transition-colors hover:text-[var(--accent-primary)]"
            >
              <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-1" />
              Back to Studio
            </button>

            {/* Hero */}

            <span className="text-[10px] font-bold tracking-[0.6em] text-[var(--accent-primary)] uppercase">Notification Center</span>

            <h1 className="mt-8 text-[clamp(4rem,5vw,4rem)] leading-[0.85] font-bold tracking-[-0.08em] uppercase italic">
              Inbox
              <span
                className="text-transparent"
                style={{
                  WebkitTextStroke: "1.5px rgba(23,23,23,0.25)",
                }}
              >
                Central.
              </span>
            </h1>
          </div>

          {/* Clear */}

          <button className="w-fit rounded-full border border-[var(--border-color)] bg-white px-6 py-3 text-[10px] font-bold tracking-[0.3em] text-[var(--text-secondary)] uppercase transition-all hover:border-red-200 hover:text-red-500">
            Clear All
          </button>
        </div>

        {/* NOTIFICATIONS */}

        <div className="space-y-5">
          {notifications.map((n, i) => (
            <motion.div
              key={n.id}
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: i * 0.1,
              }}
              className="group rounded-[32px] border border-[var(--border-color)] bg-white p-8 shadow-sm transition-all duration-500 hover:border-[var(--accent-primary)] hover:shadow-xl"
            >
              <div className="flex flex-col gap-6 md:flex-row md:items-start">
                {/* ICON */}

                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-500 ${
                    n.type === "rsvp"
                      ? "bg-[rgba(132,165,157,0.12)] text-[var(--accent-primary)]"
                      : "bg-[var(--bg-secondary)] text-[var(--text-muted)]"
                  } `}
                >
                  {n.type === "rsvp" ? <Heart className="h-5 w-5" /> : <Info className="h-5 w-5" />}
                </div>

                {/* CONTENT */}

                <div className="flex-1">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h3 className="text-2xl font-bold tracking-tight transition-colors group-hover:text-[var(--accent-primary)]">
                        {n.title}
                      </h3>

                      <p className="mt-3 max-w-[600px] text-sm leading-8 text-[var(--text-secondary)]">{n.message}</p>
                    </div>

                    {/* TIME */}

                    <span className="text-[10px] font-bold tracking-[0.3em] whitespace-nowrap text-[var(--text-muted)] uppercase">
                      {n.time}
                    </span>
                  </div>
                </div>

                {/* DELETE */}

                <button className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--border-color)] text-[var(--text-muted)] opacity-0 transition-all duration-300 group-hover:opacity-100 hover:border-red-200 hover:text-red-500">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────
         BACKGROUND TYPOGRAPHY
      ───────────────────────────── */}

      <div className="pointer-events-none fixed bottom-[-5%] left-1/2 z-0 -translate-x-1/2 opacity-[0.03] select-none">
        <h2 className="text-[24vw] font-black tracking-[-0.1em] whitespace-nowrap text-[var(--text-primary)] uppercase">Inbox.</h2>
      </div>
      <Footer />
    </main>
  );
}
