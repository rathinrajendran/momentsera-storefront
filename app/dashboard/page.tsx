"use client";

import React, { useEffect, useMemo, useState } from "react";

import { useRouter } from "next/navigation";
import { ArrowUpRight, CreditCard, Eye, FileText, Fingerprint, Layers, MoreHorizontal, Settings, ShoppingBag, Sparkles, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useMyEvents, useMyProfile, useUpdateMyProfile } from "../../hooks/useUser";
import { H6 } from "../../components/ui/H6";
import { H2 } from "../../components/ui/H2";
import { Para } from "../../components/ui/Para";
import AccountHeader from "../account/components/AccountHeader";
import AccountFooter from "../account/components/AccountFooter";
import { Header } from "../(marketing)/components/header/Header";

export default function Dashboard() {
  const stats = [
    {
      title: "Total Invitations",
      value: "1,248",
      change: "+12%",
      icon: FileText,
    },
    {
      title: "Orders",
      value: "324",
      change: "+8%",
      icon: ShoppingBag,
    },
    {
      title: "Customers",
      value: "892",
      change: "+18%",
      icon: Users,
    },
    {
      title: "Revenue",
      value: "₹3.8L",
      change: "+24%",
      icon: CreditCard,
    },
  ];

  const invitations = [
    {
      id: "#INV-1024",
      couple: "Rahul & Anjali",
      theme: "Luna",
      views: 432,
      status: "Published",
    },
    {
      id: "#INV-1025",
      couple: "Arjun & Meera",
      theme: "Aura",
      views: 218,
      status: "Draft",
    },
    {
      id: "#INV-1026",
      couple: "John & Maria",
      theme: "Nexa",
      views: 582,
      status: "Published",
    },
  ];

  const orders = [
    {
      id: "#ORD-2048",
      customer: "Rahul Kumar",
      plan: "Premium",
      amount: "₹1,499",
    },
    {
      id: "#ORD-2049",
      customer: "Anjali Nair",
      plan: "Gold",
      amount: "₹999",
    },
    {
      id: "#ORD-2050",
      customer: "Arjun Menon",
      plan: "Premium",
      amount: "₹1,499",
    },
  ];

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
  const router = useRouter();
  const [token, setToken] = useState("");
  const [tab, setTab] = useState<"invites" | "profile">("invites");

  useEffect(() => {
    const t = localStorage.getItem("token") || "";
    setToken(t);
    if (!t) router.replace("/account/login");
  }, [router]);

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

  if (!token || meLoading) return <div className="min-h-screen bg-[#fafafa]" />;
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
        <div>
          <H6>Studio Agreement</H6>
          <H2 className="text-lg">Welcome, Creator</H2>
          <Para className="mt-8 max-w-[540px]">
            These terms define the relationship between the client and The Moments Studio regarding access, customization, licensing, and
            publication workflows.
          </Para>
        </div>

        {/* TERMS GRID */}

        <div className="grid gap-8 py-16 md:grid-cols-4">
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
    
        {/* Activity */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6">
          <h3 className="font-semibold">Recent Activity</h3>

          <div className="mt-6 space-y-4">
            {["New order received", "Invitation published", "Theme updated", "Payment completed", "New RSVP submitted"].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <div className="mt-2 h-2 w-2 rounded-full bg-black" />
                <p className="text-sm text-neutral-600">{item}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Tables */}
            <div className="mt-8 grid gap-6 xl:grid-cols-2">
              {/* Invitations */}
              <div className="rounded-2xl border border-neutral-200 bg-white">
                <div className="flex items-center justify-between border-b p-5">
                  <h3 className="font-semibold">Recent Invitations</h3>

                  <button>
                    <ArrowUpRight size={18} />
                  </button>
                </div>

                <div>
                  {invitations.map((invite) => (
                    <div key={invite.id} className="flex items-center justify-between border-b px-5 py-4 last:border-none">
                      <div>
                        <h4 className="font-medium">{invite.couple}</h4>

                        <p className="text-sm text-neutral-500">{invite.theme}</p>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-1 text-sm text-neutral-500">
                          <Eye size={14} />
                          {invite.views}
                        </div>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            invite.status === "Published" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {invite.status}
                        </span>

                        <button>
                          <MoreHorizontal size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Orders */}
              <div className="rounded-2xl border border-neutral-200 bg-white">
                <div className="border-b p-5">
                  <h3 className="font-semibold">Recent Orders</h3>
                </div>

                <div>
                  {orders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between border-b px-5 py-4 last:border-none">
                      <div>
                        <h4 className="font-medium">{order.customer}</h4>

                        <p className="text-sm text-neutral-500">{order.plan}</p>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold">{order.amount}</p>

                        <p className="text-sm text-neutral-500">{order.id}</p>
                      </div>
                    </div>
                  ))}
                </div>
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
