"use client";

import React, { useEffect, useMemo, useState } from "react";

import { motion } from "framer-motion";

import { ArrowLeft, Camera, Mail, Phone, ShieldCheck } from "lucide-react";

import { useRouter } from "next/navigation";

import { useMyProfile, useUpdateMyProfile } from "../../../hooks/useUser";

import { Header } from "../../(marketing)/components/header/Header";
import { Footer } from "../../(marketing)/components/footer/Footer";
import { useToken } from "../../../hooks/useToken";

export default function ProfilePage() {

const router = useRouter();

const token = useToken();

const [fullName, setFullName] = useState("");
const [phone, setPhone] = useState("");

const { data: me } = useMyProfile(token);
const updateMutation = useUpdateMyProfile(token);

useEffect(() => {
  if (!me) return;

  setFullName(me.full_name ?? "");
  setPhone(me.phone ?? "");
}, [me]);

const initials = useMemo(() => {
  return (
    fullName
      .trim()
      .split(/\s+/)
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "RR"
  );
}, [fullName]);
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7f5f2] text-[var(--text-primary)]">
      <Header />

      {/* ─────────────────────────────
         BACKGROUND LINES
      ───────────────────────────── */}

      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 left-1/4 h-full w-px bg-black/[0.04]" />

        <div className="absolute top-0 left-2/4 h-full w-px bg-black/[0.04]" />

        <div className="absolute top-0 left-3/4 h-full w-px bg-black/[0.04]" />
      </div>

      {/* ─────────────────────────────
         CONTENT
      ───────────────────────────── */}

      <section className="relative z-10 mx-auto max-w-[1700px] px-6 pt-[16vh] pb-24 md:px-10">
        {/* TOP */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="mb-14 flex items-center justify-between"
        >
          <div>
            <span className="text-[10px] font-bold tracking-[0.5em] text-[var(--accent-primary)] uppercase">Studio Settings</span>

            <h1 className="mt-5 text-[clamp(3rem,6vw,5rem)] font-bold tracking-[-0.08em]">Update Profile</h1>
          </div>

          <button
            onClick={() => router.back()}
            className="hidden items-center gap-3 rounded-full border border-black/10 bg-white px-6 py-3 text-sm font-medium transition-all hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] md:flex"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        </motion.div>

        {/* GRID */}

        <div className="grid gap-8 xl:grid-cols-[480px_1fr]">
          {/* ─────────────────────
             LEFT PANEL
          ───────────────────── */}

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
              delay: 0.1,
            }}
            className="rounded-[42px] border border-black/[0.06] bg-white p-10 shadow-[0_10px_40px_rgba(0,0,0,0.03)]"
          >
            {/* Avatar */}

            <div className="relative w-fit">
              <div className="flex h-[150px] w-[150px] items-center justify-center rounded-[42px] bg-black text-5xl font-bold text-white">
                {initials}
              </div>

              <button className="absolute right-0 bottom-0 flex h-12 w-12 items-center justify-center rounded-full border-4 border-white bg-[var(--accent-primary)] text-white">
                <Camera className="h-4 w-4" />
              </button>
            </div>

            {/* Info */}

            <div className="mt-10">
              <h2 className="text-5xl font-bold tracking-[-0.06em]">{fullName || "Profile"}</h2>

              <p className="mt-5 max-w-[340px] text-xl leading-relaxed text-[var(--text-secondary)]">
                Manage your profile information and personalize your invitation experience.
              </p>
            </div>

            {/* Cards */}

            <div className="mt-14 space-y-5">
              {/* Email */}

              <div className="rounded-[28px] bg-[#f7f5f2] p-7">
                <div className="mb-5 flex items-center gap-3">
                  <Mail className="h-4 w-4 text-[var(--accent-primary)]" />

                  <span className="text-sm font-medium text-[var(--text-secondary)]">Email Address</span>
                </div>

                <p className="text-2xl font-semibold tracking-tight break-all">{me?.email || "example@email.com"}</p>
              </div>

              {/* Role */}

              <div className="rounded-[28px] bg-[#f7f5f2] p-7">
                <div className="mb-5 flex items-center gap-3">
                  <ShieldCheck className="h-4 w-4 text-[var(--accent-primary)]" />

                  <span className="text-sm font-medium text-[var(--text-secondary)]">Account Role</span>
                </div>

                <p className="text-2xl font-semibold tracking-tight uppercase">{me?.role || "Guest"}</p>
              </div>
            </div>
          </motion.div>

          {/* ─────────────────────
             RIGHT PANEL
          ───────────────────── */}

          <motion.div
            initial={{
              opacity: 0,
              x: 20,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              delay: 0.2,
            }}
            className="rounded-[42px] border border-black/[0.06] bg-white p-10 shadow-[0_10px_40px_rgba(0,0,0,0.03)]"
          >
            <div>
              <span className="text-[10px] font-bold tracking-[0.5em] text-[var(--text-muted)] uppercase">Profile Settings</span>

              <h2 className="mt-6 text-6xl font-bold tracking-[-0.08em]">Update Profile</h2>
            </div>

            {/* FORM */}

            <div className="mt-16 space-y-10">
              {/* Name */}

              <div>
                <label className="mb-5 block text-lg font-medium text-[var(--text-secondary)]">Full Name</label>

                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="h-[84px] w-full rounded-[32px] border border-black/[0.06] bg-[#f7f5f2] px-8 text-2xl transition-all outline-none focus:border-[var(--accent-primary)] focus:bg-white"
                />
              </div>

              {/* Phone */}

              <div>
                <label className="mb-5 block text-lg font-medium text-[var(--text-secondary)]">Phone Number</label>

                <div className="relative">
                  <Phone className="absolute top-1/2 left-8 h-5 w-5 -translate-y-1/2 text-[var(--text-muted)]" />

                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-[84px] w-full rounded-[32px] border border-black/[0.06] bg-[#f7f5f2] pr-8 pl-16 text-2xl transition-all outline-none focus:border-[var(--accent-primary)] focus:bg-white"
                  />
                </div>
              </div>

              {/* Email */}

              <div>
                <label className="mb-5 block text-lg font-medium text-[var(--text-secondary)]">Email Address</label>

                <input
                  disabled
                  value={me?.email || ""}
                  className="h-[84px] w-full rounded-[32px] border border-black/[0.06] bg-[#f1efeb] px-8 text-2xl text-[var(--text-secondary)] outline-none"
                />
              </div>

              {/* BUTTONS */}

              <div className="flex flex-wrap gap-5 pt-6">
                <button
                  onClick={() =>
                    updateMutation.mutate({
                      full_name: fullName,

                      phone,
                    })
                  }
                  className="flex h-[70px] min-w-[220px] items-center justify-center rounded-full bg-black px-10 text-lg font-semibold text-white transition-all hover:scale-[1.02]"
                >
                  {updateMutation.isPending ? "Saving..." : "Save Changes"}
                </button>

                <button
                  onClick={() => router.back()}
                  className="flex h-[70px] min-w-[160px] items-center justify-center rounded-full border border-black/[0.08] bg-white px-10 text-lg font-medium transition-all hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)]"
                >
                  Back
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
