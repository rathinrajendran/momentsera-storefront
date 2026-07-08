"use client";

import { useState, useEffect } from "react";
import { Eye, Heart, Users, Search, Download, ArrowUpRight, Filter, MoreHorizontal, CheckCircle2, Clock } from "lucide-react";
import { Header } from "../../(marketing)/components/header/Header";
import { Footer } from "../../(marketing)/components/footer/Footer";
import { motion } from "framer-motion";
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

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"wishes" | "contacts">("wishes");
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[var(--background)] text-[var(--text-primary)] selection:bg-[var(--accent-primary)] selection:text-white">
      <Header />

      {/* BACKGROUND ARCHITECTURE LINES */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-0 left-1/4 hidden h-full w-px bg-[var(--border-color)] lg:block" />
        <div className="absolute top-0 right-1/3 hidden h-full w-px bg-[var(--border-color)] xl:block" />
      </div>

      {/* MAIN CONTAINER */}
      <div className="relative z-10 mx-auto max-w-[1800px] px-6 pt-[18vh] pb-32 md:px-12 xl:px-20">
        {/* DASHBOARD HEADER */}
        <div className="flex flex-col justify-between gap-6 border-b border-[var(--border-color)] pb-8 md:flex-row md:items-end">
          <div>
            <span className="text-[10px] font-bold tracking-[0.3em] text-[var(--accent-primary)] uppercase">Studio Workspace</span>
            <h1 className="mt-1 text-[clamp(1.75rem,3.5vw,2.5rem)] leading-none font-bold tracking-[-0.04em] uppercase italic">
              Invite Live Control
            </h1>
            <p className="mt-2 text-xs tracking-wide text-[var(--text-muted)]">
              Metrics monitor and administrative registry for
              <span className="font-bold text-[var(--text-primary)]">Luna Veil Layout (ID: #LV-2026)</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 rounded-full border border-[var(--border-color)] bg-white px-5 py-3 text-[10px] font-bold tracking-widest text-[var(--text-primary)] uppercase transition-all hover:bg-[var(--text-primary)] hover:text-white">
              <Download size={12} />
              Export Master Ledger
            </button>
          </div>
        </div>

        {/* 1. VIEW COUNTS & TOP-LEVEL METRICS */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={staggerContainer}
          className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {mockMetrics.map((metric) => {
            const IconComponent = metric.icon;
            return (
              <motion.div
                key={metric.id}
                // variants={fadeUp}
                className="group relative border border-[var(--border-color)] bg-white p-8 transition-all hover:border-[var(--text-primary)]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold tracking-[0.2em] text-[var(--text-muted)] uppercase">{metric.label}</span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--background)] text-[var(--text-primary)] transition-colors group-hover:bg-[var(--accent-primary)] group-hover:text-white">
                    <IconComponent size={14} />
                  </div>
                </div>
                <div className="mt-4 flex items-baseline gap-3">
                  <span className="text-4xl font-black tracking-tight">{metric.value}</span>
                  <span className="text-[10px] font-medium tracking-wide text-[var(--text-muted)] italic">{metric.trend}</span>
                </div>
                <div className="absolute right-4 bottom-3 opacity-0 transition-opacity group-hover:opacity-100">
                  <ArrowUpRight size={12} className="text-[var(--text-muted)]" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* DATA REGISTER INTERFACES */}
        <div className="mt-16 border border-[var(--border-color)] bg-white">
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
      <Footer />
    </main>
  );
}
