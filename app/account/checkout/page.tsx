"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShieldCheck, Check, ArrowLeft } from "lucide-react";
import { Header } from "../../(marketing)/components/header/Header";
import { Footer } from "../../(marketing)/components/footer/Footer";
import { H2 } from "../../../components/ui/H2";
import { Para } from "../../../components/ui/Para";

/* ──────────────────────────────────────────
   TOKENS & ANIMATIONS
────────────────────────────────────────── */
const ease = [0.19, 1, 0.22, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

/* ──────────────────────────────────────────
   COMPONENT
────────────────────────────────────────── */
export default function Checkout({ invite }: any) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Fallback data if API wrapper is dynamic
  const itemPrice = invite?.price || 1699;
  const itemName = invite?.shortname || "Luna Veil";
  const itemCategory = invite?.main_category || "Wedding";

  function handlePaymentSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Stage customer flow data temporarily next to invite info
    const ongoingSession = localStorage.getItem("pending_event");
    const parsed = ongoingSession ? JSON.parse(ongoingSession) : {};

    localStorage.setItem(
      "pending_event",
      JSON.stringify({
        ...parsed,
        customer: formData,
        status: "payment_intent_created",
      }),
    );

    // Push into onboarding/studio setup ecosystem
    router.push(`/invites/${invite?.main_category || "wedding"}/${invite?.invite_key || "luna"}/onboarding`);
  }

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[var(--background)] text-[var(--text-primary)] selection:bg-[var(--accent-primary)] selection:text-white">
      <Header />

      {/* ─────────────────────────────
          ARCHITECTURE LINES
       ───────────────────────────── */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-0 right-1/4 hidden h-full w-px bg-[var(--border-color)] lg:block" />
        <div className="absolute top-0 left-1/3 hidden h-full w-px bg-[var(--border-color)] xl:block" />
      </div>

      {/* ─────────────────────────────
          CONTENT WRAPPER
       ───────────────────────────── */}
      <div className="relative z-10 mx-auto max-w-[1800px] px-6 pt-[18vh] pb-32 md:px-12 xl:px-20">
        {/* Back navigation element */}
        <button
          onClick={() => router.back()}
          className="group mb-8 flex items-center gap-2 text-[10px] font-bold tracking-[0.3em] text-[var(--text-muted)] uppercase transition-colors hover:text-[var(--text-primary)]"
        >
          <ArrowLeft size={12} className="transition-transform group-hover:-translate-x-1" />
          Back to invite details
        </button>

        <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-12">
          {/* ─────────────────────────────
              LEFT COLUMN: CHECKOUT FORM
           ───────────────────────────── */}
          <div className="lg:col-span-7 xl:col-span-8">
            <motion.div initial="hidden" animate="show" 
            // variants={fadeUp}
             className="max-w-[620px]">
              <H2 className="text-black">Checkout</H2>
              <Para>
                Provide your basic billing identity below. Your structural timeline configurations, media files, and Malayalam copy
                preferences will be provisioned directly inside your custom studio dashboard immediately following payment.
              </Para>

              <form onSubmit={handlePaymentSubmit} className="mt-12 space-y-10">
                {/* Section 01: Identity */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-[var(--border-color)] pb-3">
                    <span className="text-[10px] font-black tracking-widest text-[var(--text-muted)]">01 /</span>
                    <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase">Contact Details</h3>
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold tracking-widest text-[var(--text-muted)] uppercase">Full Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="E.g. Rahul Nair"
                        className="w-full rounded-none border border-[var(--border-color)] bg-white px-5 py-4 text-sm transition-all outline-none focus:border-[var(--text-primary)]"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold tracking-widest text-[var(--text-muted)] uppercase">Email Address</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="name@domain.com"
                        className="w-full rounded-none border border-[var(--border-color)] bg-white px-5 py-4 text-sm transition-all outline-none focus:border-[var(--text-primary)]"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold tracking-widest text-[var(--text-muted)] uppercase">
                      Phone Number (WhatsApp Updates Line)
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full rounded-none border border-[var(--border-color)] bg-white px-5 py-4 text-sm transition-all outline-none focus:border-[var(--text-primary)]"
                    />
                  </div>
                </div>

                {/* Section 02: Native Gateways */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-[var(--border-color)] pb-3">
                    <span className="text-[10px] font-black tracking-widest text-[var(--text-muted)]">02 /</span>
                    <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase">Payment Integration</h3>
                  </div>

                  <div className="flex items-center justify-between border border-[var(--text-primary)] bg-white p-5">
                    <div className="flex items-center gap-4">
                      <div className="flex h-4 w-4 items-center justify-center rounded-full border border-[var(--text-primary)]">
                        <div className="h-2 w-2 rounded-full bg-[var(--text-primary)]" />
                      </div>
                      <div>
                        <p className="text-xs font-bold tracking-wider uppercase">Instant Secure Checkout</p>
                        <p className="mt-0.5 text-[10px] text-[var(--text-muted)]">UPI, Cards, NetBanking, GooglePay</p>
                      </div>
                    </div>

                    <div className="flex gap-1.5 opacity-60">
                      <span className="border border-[var(--border-color)] px-1.5 py-0.5 text-[8px] font-black tracking-wider uppercase">
                        UPI
                      </span>
                      <span className="border border-[var(--border-color)] px-1.5 py-0.5 text-[8px] font-black tracking-wider uppercase">
                        CARD
                      </span>
                    </div>
                  </div>
                </div>

                {/* Submit Core Action */}
                <div className="pt-4">
                  <button
                    type="submit"
                    className="premium-button w-full rounded-full px-12 py-5 text-center text-xs font-black tracking-[0.2em] uppercase sm:w-auto"
                  >
                    Pay ₹{itemPrice} & Initialize Studio
                  </button>

                  <div className="mt-4 flex items-center gap-2 text-[10px] tracking-widest text-[var(--text-muted)] uppercase">
                    <ShieldCheck size={12} className="text-[var(--accent-primary)]" />
                    Secure encrypted 256-bit transactions natively parsed via Razorpay
                  </div>
                </div>
              </form>
            </motion.div>
          </div>

          {/* ─────────────────────────────
              RIGHT COLUMN: ORDER SUMMARY
           ───────────────────────────── */}
          <div className="lg:col-span-5 xl:col-span-4">
            <motion.div
              initial="hidden"
              animate="show"
              variants={staggerContainer}
              className="sticky top-[15vh] rounded-[40px] border border-[var(--border-color)] bg-white p-8 shadow-sm"
            >
              <h2 className="text-xs font-bold tracking-[0.2em] text-[var(--text-primary)] uppercase">Order Summary</h2>

              {/* Product Card Entity */}
              <div className="mt-6 flex gap-4 border-b border-[var(--border-color)] pb-6">
                <div className="relative aspect-[4/3] w-28 overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--background)]">
                  <Image src={`https://picsum.photos/seed/100/400/300`} alt={itemName} fill className="object-cover" />
                </div>
                <div className="flex flex-col justify-between py-1">
                  <div>
                    <span className="text-[9px] font-bold tracking-widest text-[var(--accent-primary)] uppercase">{itemCategory}</span>
                    <h4 className="mt-0.5 text-base font-bold tracking-tight text-[var(--text-primary)] uppercase">{itemName}</h4>
                  </div>
                  <span className="text-[10px] font-medium tracking-widest text-[var(--text-muted)] uppercase">Standard License</span>
                </div>
              </div>

              {/* Included Microfeatures checklist */}
              <div className="space-y-3 border-b border-[var(--border-color)] py-6 text-[11px] font-medium tracking-wide text-[var(--text-secondary)]">
                {[
                  "Bilingual Toggle Architecture (English / Malayalam)",
                  "Live Real-Time Countdown Experience Ticker",
                  "Integrated Google Maps One-Tap Nav Modules",
                  "Atmospheric Streamlined Background Music Support",
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[var(--accent-primary)] text-[9px] text-white">
                      <Check size={10} strokeWidth={3} />
                    </span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              {/* Precise Mathematical Math Total Calculation Lines */}
              <div className="space-y-3 pt-6">
                <div className="flex justify-between text-xs text-[var(--text-secondary)]">
                  <span className="text-[10px] tracking-widest uppercase">Subtotal</span>
                  <span className="font-bold">₹{itemPrice}.00</span>
                </div>
                <div className="flex justify-between text-xs text-[var(--text-secondary)]">
                  <span className="text-[10px] tracking-widest uppercase">Platform Setup / GST</span>
                  <span className="text-[10px] tracking-widest text-[var(--text-muted)] uppercase italic">Included</span>
                </div>

                <div className="my-2 h-px bg-[var(--border-color)]" />

                <div className="flex items-baseline justify-between pt-1">
                  <span className="text-xs font-black tracking-[0.15em] uppercase">Total Due</span>
                  <span className="text-3xl font-black tracking-tighter">₹{itemPrice}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
