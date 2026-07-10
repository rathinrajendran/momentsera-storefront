"use client";

import React, { useEffect, useMemo, useState } from "react";

import { Para } from "../../../components/ui/Para";
import { H2 } from "../../../components/ui/H2";
import { H6 } from "../../../components/ui/H6";
import { Header } from "../../(marketing)/components/header/Header";
import AccountFooter from "../components/AccountFooter";
import { useRouter } from "next/navigation";
import { useMyEvents, useMyProfile, useUpdateMyProfile } from "../../../hooks/useUser";
import { Fingerprint, Layers, Settings, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import AccountHeader from "../components/AccountHeader";
import Heading from "../../../components/ui/Heading";
import { useRequireAuth } from "../../../hooks/useRequireAuth";

export default function MyInvitesPage() {
  const terms = [
    {
      title: "Service Definition",

      text: "The Studio provides Invites, formerly referred to as themes. An Invite is a digital-first interactive experience hosted on our proprietary infrastructure.",
    },

    {
      title: "The Staging Pattern",

      text: "Content exists in two states: Draft (Staging) and Live (Published). The Studio is not responsible for errors in published content once the client has approved the transition from the staging environment.",
    },

    {
      title: "Usage Licenses",

      text: "Purchase of an Invite grants a single-event license. Commercial redistribution or reverse-engineering of the UI/UX architecture is strictly prohibited.",
    },
  ];
  const [tab, setTab] = useState<"invites" | "profile">("invites");
  const { loading } = useRequireAuth();

  const { data: me, isLoading: meLoading } = useMyProfile();
  const { data: events, isLoading: eventsLoading } = useMyEvents();
  const updateMutation = useUpdateMyProfile();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (me) {
      setFullName(me.full_name || "");
      setPhone(me.phone || "");
    }
  }, [me]);

  const myInvites = useMemo(() => events ?? [], [events]);
  const publishedCount = myInvites.filter((e: any) => e.status?.toLowerCase() === "published").length;

  if (loading || meLoading || eventsLoading) return <div className="min-h-screen bg-[#fafafa]" />;
  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--background)] text-[var(--text-primary)]">
      <Header />

      {/* ARCHITECTURAL BACKGROUND */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 left-1/4 h-full w-px bg-[var(--border-color)]" />
        <div className="absolute top-0 left-2/4 h-full w-px bg-[var(--border-color)]" />
        <div className="absolute top-0 left-3/4 h-full w-px bg-[var(--border-color)]" />
      </div>

      {/* CONTENT */}
      <section className="relative z-10 mx-auto max-w-[1800px] px-[5vw] py-30">
        {/* HERO */}
        <Heading
          label="Studio Agreement"
          title="My Invites"
          desc="These terms define the relationship between the client and The Moments Studio regarding access, customization, licensing, and
            publication workflows."
        />
        {/* TERMS GRID */}

        <div className="space-y-10">
          <div className="grid gap-5 md:grid-cols-4">
            {[
              {
                label: "Total Invites",
                val: myInvites.length,
                icon: <Layers className="h-4 w-4" />,
              },
              {
                label: "Live Experiences",
                val: publishedCount,
                icon: <Sparkles className="h-4 w-4" />,
              },
              {
                label: "Drafts (Staging)",
                val: myInvites.length - publishedCount,
                icon: <Fingerprint className="h-4 w-4" />,
              },
              {
                label: "System Status",
                val: "Active",
                icon: <div className="h-2 w-2 animate-pulse rounded-full bg-[#84a59d]" />,
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="group rounded-3xl border border-[var(--border-color)] bg-white p-8 transition-all duration-500 hover:border-[var(--accent-primary)] hover:shadow-xl"
              >
                <div className="mb-4 flex items-center justify-between text-[#84a59d]">
                  {stat.icon}
                  <span className="text-[10px] tracking-widest uppercase opacity-40">Stat {i + 1}</span>
                </div>
                <p className="text-3xl font-bold tracking-tighter">{stat.val}</p>
                <p className="mt-1 text-[10px] tracking-widest uppercase opacity-40">{stat.label}</p>
              </div>
              // <div
              //   key={index}
              //   className="group rounded-[32px] border border-[var(--border-color)] bg-white p-10 transition-all duration-500 hover:border-[var(--accent-primary)] hover:shadow-xl"
              // >
              //   {/* Top */}
              //   <div className="mb-10 flex items-center gap-4">
              //     <span className="text-[10px] font-bold tracking-[0.4em] text-[var(--accent-primary)] uppercase">/0{index + 1}</span>
              //   </div>

              //   {/* Title */}
              //   <h3 className="mb-5 text-xl leading-none font-bold tracking-[-0.06em] text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent-primary)]">
              //     {term.title}
              //   </h3>

              //   {/* Text */}
              //   <Para>{term.text}</Para>
              // </div>
            ))}
          </div>
          {/* Navigation Tabs */}
          <div>
            <div className="mb-5 flex gap-8 border-b border-white/5">
              {["invites", "profile"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t as any)}
                  className={`pb-4 text-[10px] font-bold tracking-[0.3em] uppercase transition-all ${
                    tab === t ? "border-b border-[#84a59d] text-[#84a59d]" : "border-transparent text-white/40 hover:text-white"
                  }`}
                >
                  {t === "invites" ? "Collection" : "Studio Settings"}
                </button>
              ))}
            </div>
            <AnimatePresence mode="wait">
              {tab === "invites" ? (
                <motion.div
                  key="invites"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
                >
                  {myInvites.map((event: any) => (
                    <InviteCard key={event.id} event={event} />
                  ))}
                </motion.div>
              ) : (
                <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-2xl">
                  <div className="space-y-12 rounded-3xl border border-white/10 bg-white/5 p-10">
                    <div className="grid gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] tracking-widest uppercase opacity-40">Full Name</label>
                        <input
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full border-b border-white/10 bg-transparent py-4 text-xl outline-none focus:border-[#84a59d]"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] tracking-widest uppercase opacity-40">Phone</label>
                        <input
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full border-b border-white/10 bg-transparent py-4 text-xl outline-none focus:border-[#84a59d]"
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => updateMutation.mutate({ name: fullName, phone })}
                      className="w-full rounded-2xl bg-[#84a59d] py-5 text-xs font-bold tracking-widest text-[#08090a] uppercase transition-colors hover:bg-white"
                    >
                      {updateMutation.isPending ? "Syncing..." : "Update Studio Profile"}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────
         BACKGROUND TYPOGRAPHY
      ───────────────────────────── */}

      <div className="pointer-events-none fixed bottom-[-5%] left-1/2 z-0 -translate-x-1/2 opacity-[0.03] select-none">
        <h2 className="text-[24vw] font-black tracking-[-0.1em] whitespace-nowrap text-[var(--text-primary)] uppercase">Invites.</h2>
      </div>
      <AccountHeader />
      <AccountFooter />
    </main>
  );
}

function InviteCard({ event }: { event: any }) {
  const isPublished = event.status?.toLowerCase() === "published";
  return (
    <div className="group relative aspect-[4/5] overflow-hidden rounded-3xl border border-white/10 bg-white/5">
      <Image
        src={`https://picsum.photos/800/1000?random=${event.id}`}
        fill
        alt=""
        className="object-cover opacity-50 transition-all duration-1000 group-hover:scale-110 group-hover:opacity-100"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#08090a] via-[#08090a]/20 to-transparent" />

      <div className="absolute top-6 left-6">
        <span
          className={`rounded-full border px-3 py-1 text-[9px] tracking-[0.3em] uppercase ${isPublished ? "border-[#84a59d] text-[#84a59d]" : "border-white/20 text-white/40"}`}
        >
          {event.status}
        </span>
      </div>

      <div className="absolute right-8 bottom-8 left-8">
        <p className="mb-2 text-[10px] tracking-[0.2em] text-[#84a59d] uppercase">{event.event_type}</p>
        <h3 className="mb-6 text-2xl font-bold tracking-tighter">{event.invite_key}</h3>
        <div className="flex gap-2">
          <Link
            href={`/${event.event_key}`}
            className="flex h-12 flex-1 items-center justify-center rounded-xl bg-white text-xs font-bold tracking-widest text-[#08090a] uppercase"
          >
            View
          </Link>
          <Link
            href={`/editor/${event.event_key}`}
            className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/20 transition-colors hover:bg-white hover:text-[#08090a]"
          >
            <Settings className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
