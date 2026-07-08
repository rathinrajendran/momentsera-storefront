"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import WeddingForm from "./_forms/WeddingForm";
import BirthdayForm from "./_forms/BirthdayForm";
import GridMotion from "../../../../../../components/ui/GridMotion";
import { Header } from "../../../../../(marketing)/components/header/Header";
import { Para } from "../../../../../../components/ui/Para";

/* ---------------- GRID DATA ---------------- */

const dummyImages: string[] = Array.from({ length: 12 }, (_, i) => `https://picsum.photos/seed/${i + 40}/800/800`);
const items: (string | ReactNode)[] = [
  "Planning",
  <div key="jsx-1" className="font-bold tracking-tighter text-[var(--accent-primary)] uppercase italic">
    Event Setup
  </div>,
  dummyImages[0],
  "Guests",
  <div key="jsx-2" className="font-bold tracking-tighter uppercase italic">
    Invitations
  </div>,
  dummyImages[1],
  "Schedule",
  <div key="jsx-3" className="font-bold tracking-tighter uppercase italic">
    Timeline
  </div>,
  dummyImages[2],
  "Design",
  <div key="jsx-4" className="font-bold tracking-tighter text-[var(--accent-primary)] uppercase italic">
    Theme
  </div>,
  dummyImages[3],
];

/* ---------------- FORM MAP ---------------- */

const FORM_MAP: Record<string, React.ComponentType<any>> = {
  wedding: WeddingForm,
  birthday: BirthdayForm,
};

/* ---------------- COMPONENT ---------------- */

export default function OnboardingClient({ eventType, inviteKey }: { eventType: string; inviteKey: string }) {
  const router = useRouter();
  const SelectedForm = FORM_MAP[eventType];
  if (!SelectedForm) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)] text-red-500">
        Error: Category "{eventType}" not supported.
      </div>
    );
  }
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[var(--background)] text-[var(--text-primary)]">
      <Header />
      {/* Background Glow */}
      <div
        className="pointer-events-none absolute top-[-10%] left-[-10%] h-[600px] w-[600px] rounded-full blur-[140px]"
        style={{
          background: "rgba(132,165,157,0.12)",
        }}
      />
      <div className="relative z-10 grid h-screen w-full grid-cols-1 pt-[64px] md:grid-cols-12">
        {/* LEFT SIDE */}
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
            duration: 1.2,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="relative hidden h-full md:col-span-7 md:block lg:col-span-8"
        >
          {/* Overlay */}
          {/* <div
            className="
              absolute
              inset-0
              z-20
              pointer-events-none
              bg-gradient-to-r
              from-transparent
              via-transparent
              to-[var(--background)]
            "
          /> */}
          <GridMotion items={items} gradientColor="var(--background)" />
          <div className="absolute bottom-12 left-12 z-30 flex items-center gap-4">
            <div className="h-px w-12 bg-[var(--accent-primary)]" />
            <span className="text-[10px] font-bold tracking-[0.4em] text-[var(--text-muted)] uppercase">Curating Your Moment</span>
          </div>
        </motion.div>
        {/* RIGHT SIDE */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.8,
            delay: 0.2,
          }}
          className="glass-card col-span-12 flex h-full flex-col justify-between p-10 pt-5 backdrop-blur-2xl md:col-span-5 lg:col-span-4"
        >
          <div className="space-y-12">
            {/* Back Navigation */}
            <button
              onClick={() => router.push("/invites")}
              className="group flex items-center gap-3 text-[10px] font-bold tracking-widest text-[var(--text-muted)] uppercase transition-colors hover:text-[var(--accent-primary)]"
            >
              <ChevronLeft size={16} className="transition-transform group-hover:-translate-x-1" />
              Return to Studio
            </button>
            {/* Header */}
            <div>
              <div className="mb-4 flex hidden items-center gap-2">
                <Sparkles size={14} className="text-[var(--accent-primary)]" />
                <span className="text-[10px] font-bold tracking-[0.2em] text-[var(--text-muted)] uppercase">Onboarding Phase 01</span>
              </div>
              <h1 className="mb-3 text-3xl font-bold tracking-tight text-[var(--text-primary)]">Event Details</h1>
              <Para className="max-w-[300px] text-sm leading-relaxed text-[var(--text-secondary)]">
                Provide the essential details to tailor your digital invitation experience.
              </Para>
            </div>
            {/* FORM */}
            <div className="onboarding-form-container">
              <SelectedForm eventType={eventType} inviteKey={inviteKey} />
            </div>
            {/* Footer */}
            <div className="border-t border-[var(--border-color)] pt-8">
              <p className="text-[9px] tracking-widest text-[var(--text-muted)] uppercase">© 2026 themomentsby. Studio Selection.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}