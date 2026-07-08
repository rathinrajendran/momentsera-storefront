"use client";

import Link from "next/link";

import { Mail, MessageCircle, Phone, ArrowRight } from "lucide-react";
import { Header } from "../../(marketing)/components/header/Header";
import { Footer } from "../components/footer/Footer";
import { H6 } from "../../../components/ui/H6";
import { H2, H2Variants } from "../../../components/ui/H2";
import { Para } from "../../../components/ui/Para";
import Heading from "../../../components/ui/Heading";
import PageLayout from "../../../components/ui/PageLayout";
import { BorderFrame } from "../../../components/ui/BorderFrame";
import Section from "../../../components/ui/Section";

const supportOptions = [
  {
    title: "Email Support",
    desc: "Get help regarding invitations, RSVP, payments, or technical issues.",
    value: "support@themomentsby.com",
    icon: Mail,
  },

  {
    title: "WhatsApp Support",
    desc: "Quick assistance for invitation setup and event management.",
    value: "+971 56 695 5389",
    icon: MessageCircle,
  },

  {
    title: "Call Support",
    desc: "Speak directly with our support team for urgent requests.",
    value: "+971 56 695 5389",
    icon: Phone,
  },
];

export default function SupportPage() {
  return (
    <PageLayout>
      <Header />

      <BorderFrame />

      <Section>
        <Heading
          label="Help Center"
          title="Support Studio"
          desc="Need assistance with invitations, RSVP systems, guest uploads, payments, or event setup? Our support team is available to help
            you build a seamless digital experience."
          descWidth="max-w-[700px]"
        />

        <div className="space-y-15">
          {/* SUPPORT OPTIONS */}
          <div className="grid gap-8 md:grid-cols-3">
            {supportOptions.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={index}
                  className="group rounded-[32px] border border-[var(--border-color)] bg-white p-10 transition-all duration-500 hover:border-[var(--accent-primary)] hover:shadow-xl"
                >
                  {/* ICON */}

                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--text-primary)] text-white transition-all duration-500 group-hover:bg-[var(--accent-primary)]">
                    <Icon className="h-5 w-5" />
                  </div>

                  {/* CONTENT */}

                  <div className="mt-10">
                    <h2 className="text-xl font-bold tracking-tight transition-colors group-hover:text-[var(--accent-primary)]">
                      {item.title}
                    </h2>

                    <Para className="mt-2">{item.desc}</Para>

                    {/* VALUE */}

                    <div className="mt-8 flex items-center justify-between">
                      <div className="rounded-full border border-[var(--border-color)] bg-[var(--bg-secondary)] px-5 py-3 text-sm font-medium">
                        {item.value}
                      </div>

                      <button className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--border-color)] transition-all duration-300 hover:border-[var(--accent-primary)] hover:bg-[var(--accent-primary)] hover:text-white">
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* FAQ */}

          <div className="border-t border-[var(--border-color)] pt-20">
            <div className="flex flex-col gap-14 lg:flex-row lg:justify-between">
              {/* LEFT */}

              <div className="max-w-[400px]">
                <H6>Frequently Asked</H6>

                <H2 className="text-4xl">Common Questions</H2>
              </div>

              {/* RIGHT */}

              <div className="w-full max-w-[750px] divide-y divide-[var(--border-color)]">
                {[
                  {
                    q: "How do I create a new invitation?",

                    a: "Go to the create invitation page and choose your preferred template.",
                  },

                  {
                    q: "Can guests upload celebration photos?",

                    a: "Yes. Guest photo upload can be enabled from invitation settings.",
                  },

                  {
                    q: "How do RSVP responses work?",

                    a: "Guests can confirm attendance directly through your invitation link.",
                  },

                  {
                    q: "Can I edit invitations after publishing?",

                    a: "Yes. Invitations can be updated anytime from your dashboard.",
                  },
                ].map((item, index) => (
                  <div key={index} className="py-8">
                    <h3 className="text-lg font-semibold tracking-tight">{item.q}</h3>

                    <Para className="mt-2 max-w-[650px]">{item.a}</Para>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* FOOT NOTE */}

          <div className="border-t border-[var(--border-color)] pt-10 text-center">
            <p className="text-sm text-[var(--text-muted)]">Average response time: within 24 hours</p>

            <div className="mt-6 flex justify-center gap-4">
              <Link
                href="/privacy-policy"
                className="text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--accent-primary)]"
              >
                Privacy Policy
              </Link>

              <span className="text-[var(--text-light)]">•</span>

              <Link
                href="/terms-and-conditions"
                className="text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--accent-primary)]"
              >
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </Section>

      {/* ─────────────────────────────
         BACKGROUND TYPOGRAPHY
      ───────────────────────────── */}

      <div className="pointer-events-none fixed bottom-[-5%] left-1/2 z-0 -translate-x-1/2 opacity-[0.03] select-none">
        <h2 className="text-[24vw] font-black tracking-[-0.1em] whitespace-nowrap text-[var(--text-primary)] uppercase">Support.</h2>
      </div>
      <Footer />
    </PageLayout>
  );
}
