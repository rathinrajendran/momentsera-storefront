"use client";

import React, { useEffect, useMemo, useState } from "react";

import {
  CheckCircle2,
  Clock,
  CreditCard,
  Eye,
  FileText,
  Filter,
  Fingerprint,
  Heart,
  Layers,
  MoreHorizontal,
  Search,
  Settings,
  ShoppingBag,
  Sparkles,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import AccountHeader from "./components/AccountHeader";
import AccountFooter from "./components/AccountFooter";
import { useMyEvents, useMyProfile, useUpdateMyProfile } from "../../hooks/useUser";
import { H6 } from "../../components/ui/H6";
import { H2 } from "../../components/ui/H2";
import { Para } from "../../components/ui/Para";
import { Header } from "../(marketing)/components/header/Header";
import { useRouter } from "next/navigation";
import Heading from "../../components/ui/Heading";
/* ──────────────────────────────────────────
   ANIMATIONS & TOKENS
────────────────────────────────────────── */
const ease = [0.19, 1, 0.22, 1];
const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

/* ──────────────────────────────────────────
   MOCK ANALYTICS DATA (STAGING ECOSYSTEM)
────────────────────────────────────────── */
const mockMetrics = [
  {
    id: "views",
    label: "Total Views",
    value: "1,420",
    trend: "+12% vs last week",
    icon: Eye,
  },
  {
    id: "wishes",
    label: "Guest Wishes",
    value: "84",
    trend: "68 approved / 16 pending",
    icon: Heart,
  },
  {
    id: "contacts",
    label: "Rsvp Contacts",
    value: "112",
    trend: "84 Attending / 28 Declined",
    icon: Users,
  },
];

const mockWishes = [
  {
    id: "w-1",
    name: "Anjali & Gautham",
    message: "Wishing you a lifetime of love and happiness! Beautiful celebration layout.",
    date: "Today, 11:30 AM",
    status: "Approved",
  },
  {
    id: "w-2",
    name: "Dr. Ramesh Nair",
    message: "ബാല്യകാല സുഹൃത്തിന് എല്ലാവിധ മംഗളങ്ങളും നേരുന്നു. ഒത്തിരി സന്തോഷം!",
    date: "Yesterday, 04:15 PM",
    status: "Pending Approval",
  },
  {
    id: "w-3",
    name: "Meera Krishnan",
    message: "So excited to join the celebration! The digital invite looks absolutely stellar.",
    date: "15 May, 09:20 AM",
    status: "Approved",
  },
];

const mockContacts = [
  {
    id: "c-1",
    name: "Rahul Verma",
    phone: "+91 98450 12345",
    email: "rahul@domain.com",
    rsvp: "Attending",
    count: "2 Guests",
  },
  {
    id: "c-2",
    name: "Suresh Kumar",
    phone: "+91 94471 98765",
    email: "suresh.k@live.in",
    rsvp: "Attending",
    count: "1 Guest",
  },
  {
    id: "c-3",
    name: "Priyan Thomas",
    phone: "+44 7700 900077",
    email: "priyan.t@outlook.com",
    rsvp: "Declined",
    count: "0",
  },
];
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
export default function Dashboard() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [activeTab, setActiveTab] = useState<"wishes" | "contacts">("wishes");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const t = localStorage.getItem("token") || "";
    setToken(t);
    if (!t) router.replace("/account/login");
  }, [router]);

   const { data: me, isLoading: meLoading } = useMyProfile();
   const { data: events, isLoading: eventsLoading } = useMyEvents();

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
        <Heading
          label="Studio Agreement"
          title="Creative Dashboard"
          desc="These terms define the relationship between the client and The Moments Studio regarding access, customization, licensing, and
            publication workflows."
        />

        <div className="space-y-10">
          {/* TERMS GRID */}

          <div className="grid gap-4 md:grid-cols-4">
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
          {/* Grid */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Chart */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Invitation Views</h3>

                <button className="text-sm text-neutral-500">Last 30 Days</button>
              </div>

              <div className="mt-6 flex h-72 items-end gap-3">
                {[35, 55, 40, 72, 62, 90, 80, 100, 85, 120].map((height, i) => (
                  <div key={i} className="flex-1 rounded-t-md bg-black/90" style={{ height: `${height}%` }} />
                ))}
              </div>
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
          </div>

          {/* DATA REGISTER INTERFACES */}
          <div className="border border-[var(--border-color)] bg-white">
            {/* INTERACTION CONTROLS BAR */}
            <div className="flex flex-col border-b border-[var(--border-color)] sm:flex-row sm:items-center sm:justify-between">
              {/* TABS ALTERNATION BUTTONS */}
              <div className="flex border-b border-[var(--border-color)] sm:border-b-0">
                <button
                  onClick={() => setActiveTab("wishes")}
                  className={`relative px-8 py-5 text-[11px] font-bold tracking-[0.2em] uppercase transition-all ${
                    activeTab === "wishes"
                      ? "font-black text-[var(--text-primary)]"
                      : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  Wishes & Messages Registry ({mockWishes.length})
                  {activeTab === "wishes" && <div className="absolute bottom-0 left-0 h-[2px] w-full bg-[var(--text-primary)]" />}
                </button>
                <button
                  onClick={() => setActiveTab("contacts")}
                  className={`relative px-8 py-5 text-[11px] font-bold tracking-[0.2em] uppercase transition-all ${
                    activeTab === "contacts"
                      ? "font-black text-[var(--text-primary)]"
                      : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  RSVP & Contacts Registry ({mockContacts.length})
                  {activeTab === "contacts" && <div className="absolute bottom-0 left-0 h-[2px] w-full bg-[var(--text-primary)]" />}
                </button>
              </div>

              {/* QUICK ACTIONS UTILITIES */}
              <div className="flex items-center gap-2 p-3 sm:p-0 sm:pr-4">
                <div className="relative flex items-center">
                  <Search size={14} className="absolute left-3 text-[var(--text-muted)]" />
                  <input
                    type="text"
                    placeholder="Filter records..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full max-w-[220px] border border-[var(--border-color)] bg-[var(--background)] py-2 pr-4 pl-9 text-xs transition-all outline-none focus:border-[var(--text-primary)]"
                  />
                </div>
                <button className="border border-[var(--border-color)] p-2 text-[var(--text-primary)] hover:bg-[var(--background)]">
                  <Filter size={14} />
                </button>
              </div>
            </div>

            {/* 2. DYNAMIC WORKSPACE TABLES */}
            <div className="overflow-x-auto">
              {activeTab === "wishes" ? (
                /* WISHES DATA SCHEMA TABLE */
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-[var(--border-color)] bg-[var(--background)] text-[9px] font-bold tracking-[0.2em] text-[var(--text-muted)] uppercase">
                      <th className="w-[200px] px-6 py-4">Guest Sender</th>
                      <th className="px-6 py-4">Message Text Content</th>
                      <th className="w-[150px] px-6 py-4">Timestamp</th>
                      <th className="w-[140px] px-6 py-4">Status</th>
                      <th className="w-[60px] px-6 py-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-color)] text-xs">
                    {mockWishes.map((wish) => (
                      <tr key={wish.id} className="transition-colors hover:bg-[var(--background)]">
                        <td className="px-6 py-4 font-bold tracking-tight text-[var(--text-primary)]">{wish.name}</td>
                        <td className="max-w-[400px] px-6 py-4 leading-relaxed font-medium text-[var(--text-secondary)]">{wish.message}</td>
                        <td className="px-6 py-4 text-[11px] tracking-wider text-[var(--text-muted)]">{wish.date}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-none border px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase ${
                              wish.status === "Approved"
                                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                : "border-amber-200 bg-amber-50 text-amber-700"
                            }`}
                          >
                            {wish.status === "Approved" ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                            {wish.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                            <MoreHorizontal size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                /* 3. CONTACTS & RSVP DATA SCHEMA TABLE */
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-[var(--border-color)] bg-[var(--background)] text-[9px] font-bold tracking-[0.2em] text-[var(--text-muted)] uppercase">
                      <th className="px-6 py-4">Contact Name</th>
                      <th className="px-6 py-4">Communications Line</th>
                      <th className="px-6 py-4">RSVP Alignment</th>
                      <th className="px-6 py-4">Party Volume</th>
                      <th className="w-[60px] px-6 py-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-color)] text-xs">
                    {mockContacts.map((contact) => (
                      <tr key={contact.id} className="transition-colors hover:bg-[var(--background)]">
                        <td className="px-6 py-4 font-bold tracking-tight text-[var(--text-primary)]">{contact.name}</td>
                        <td className="space-y-0.5 px-6 py-4 font-mono text-[var(--text-secondary)]">
                          <p>{contact.phone}</p>
                          <p className="font-sans text-[10px] text-[var(--text-muted)]">{contact.email}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-block px-2 py-0.5 text-[9px] font-black tracking-widest uppercase ${
                              contact.rsvp === "Attending"
                                ? "border border-neutral-900 bg-neutral-900 text-white"
                                : "border border-[var(--border-color)] text-[var(--text-muted)]"
                            }`}
                          >
                            {contact.rsvp}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-medium tracking-wide text-[var(--text-secondary)]">{contact.count}</td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                            <MoreHorizontal size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* PAGINATION PANEL FOOTER */}
            <div className="flex items-center justify-between border-t border-[var(--border-color)] bg-[var(--background)] px-6 py-4 text-[10px] font-bold tracking-widest text-[var(--text-muted)] uppercase">
              <span>Showing 1-3 of records</span>
              <div className="flex gap-2">
                <button disabled className="cursor-not-allowed border border-[var(--border-color)] bg-white px-3 py-1.5 opacity-40">
                  Prev
                </button>
                <button disabled className="cursor-not-allowed border border-[var(--border-color)] bg-white px-3 py-1.5 opacity-40">
                  Next
                </button>
              </div>
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
