"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, CheckCircle2, Mail, MapPin, MessageSquare, Send } from "lucide-react";

import { Header } from "../components/header/Header";
import { Footer } from "../components/footer/Footer";
import { H6 } from "../../../components/ui/H6";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";

const contactItems = [
  { icon: Mail, number: "01", title: "EMAIL", value: "hello@momentsera.com", desc: "Questions, collaborations, or project inquiries." },
  { icon: MapPin, number: "02", title: "LOCATION", value: "Kerala, India", desc: "Serving celebrations and brands worldwide." },
  { icon: MessageSquare, number: "03", title: "WHATSAPP", value: "Quick Support", desc: "Fast assistance from our team." },
];

const inquiryTypes = [
  { value: "wedding", label: "Wedding invitation" },
  { value: "birthday", label: "Birthday celebration" },
  { value: "anniversary", label: "Anniversary" },
  { value: "corporate", label: "Corporate event" },
  { value: "custom", label: "Custom project" },
];

export default function ContactUs() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f6f6f3] text-[#171716]">
      <Header />

      <section className="px-4 pt-24 pb-10 sm:px-6 md:px-10 md:pt-32 lg:px-16">
        <div className="mx-auto max-w-[1450px]">
          <div className="mb-5 flex items-center justify-between border-b border-black/10 pb-4">
            <div className="flex items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-[#b39a6b]" />
              <span className="text-[8px] tracking-[.34em] text-black/45 uppercase">MomentsEra / Contact</span>
            </div>
            <span className="hidden text-[8px] tracking-[.28em] text-black/30 uppercase sm:block">Digital Invitation Studio</span>
          </div>

          <div className="overflow-hidden rounded-[34px] border border-black/[.07] bg-white shadow-[0_35px_120px_rgba(23,23,22,.08)] md:rounded-[48px]">
            <div className="grid lg:grid-cols-[.9fr_1.1fr]">
              <div className="relative overflow-hidden bg-[#efeee9] px-7 py-10 sm:px-10 md:px-14 md:py-14 lg:px-16">
                <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full border border-black/[.06]" />
                <div className="absolute top-8 right-8 h-40 w-40 rounded-full border border-black/[.05]" />

                <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                  <p className="text-[8px] tracking-[.38em] text-black/40 uppercase">Let&apos;s make something memorable</p>
                  <h1 className="mt-7 text-[clamp(3.7rem,7vw,7.5rem)] leading-[.78] font-black tracking-[-.085em]">
                    Start a
                    <br />
                    <span className="[font-family:var(--font-windsong)] font-light text-black/60">conversation.</span>
                  </h1>
                  <p className="mt-9 max-w-[510px] text-sm leading-7 text-black/55">
                    Tell us what you are celebrating, what you imagine, and what you want your guests to feel. We will turn the idea into a
                    refined digital experience.
                  </p>

                  <div className="mt-8 flex flex-wrap gap-2">
                    {["Weddings", "Birthdays", "Anniversaries", "Corporate"].map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-black/10 bg-white/65 px-4 py-2 text-[8px] tracking-[.22em] text-black/50 uppercase"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </motion.div>

                <div className="mt-14 border-t border-black/10 pt-7">
                  <p className="mb-6 text-[8px] tracking-[.34em] text-black/35 uppercase">Direct channels</p>
                  <div className="space-y-3">
                    {contactItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <div
                          key={item.number}
                          className="group flex items-center gap-4 rounded-[22px] border border-black/[.06] bg-white/65 p-4 transition hover:-translate-y-1 hover:bg-white"
                        >
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-black/10 bg-[#f4f3ef]">
                            <Icon className="h-4 w-4" strokeWidth={1.4} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-3">
                              <span className="text-[7px] text-black/25">{item.number}</span>
                              <H6 className="font-bold tracking-[.28em] text-black/45">{item.title}</H6>
                            </div>
                            <p className="mt-1 truncate text-sm font-medium">{item.value}</p>
                            <p className="mt-1 text-[10px] leading-5 text-black/40">{item.desc}</p>
                          </div>
                          <ArrowUpRight className="h-4 w-4 opacity-20 group-hover:opacity-70" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 25 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="bg-white px-7 py-10 sm:px-10 md:px-14 md:py-14 lg:px-16"
              >
                <div className="mb-10 flex items-start justify-between border-b border-black/10 pb-7">
                  <div>
                    <p className="text-[8px] tracking-[.34em] text-black/35 uppercase">Project inquiry</p>
                    <h2 className="mt-4 text-3xl font-black tracking-[-.06em] sm:text-4xl">
                      Tell us
                      <br />
                      <span className="[font-family:var(--font-windsong)] font-light text-black/55">everything.</span>
                    </h2>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-[#f6f6f3]">
                    <Send className="h-4 w-4 -rotate-12" strokeWidth={1.3} />
                  </div>
                </div>

                <form className="space-y-7">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <H6 className="font-semibold tracking-[.25em] text-black/45">FULL NAME</H6>
                      <Input
                        type="text"
                        placeholder="Your name"
                        className="min-h-[54px] rounded-2xl border-black/10 bg-[#fafaf8] px-4 text-sm shadow-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <H6 className="font-semibold tracking-[.25em] text-black/45">EMAIL</H6>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        className="min-h-[54px] rounded-2xl border-black/10 bg-[#fafaf8] px-4 text-sm shadow-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <H6 className="font-semibold tracking-[.25em] text-black/45">INQUIRY TYPE</H6>
                    <Select>
                      <SelectTrigger className="min-h-[54px] w-full rounded-2xl border-black/10 bg-[#fafaf8] px-4 text-sm shadow-none">
                        <SelectValue placeholder="What are you planning?" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-black/10 bg-white">
                        {inquiryTypes.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <H6 className="font-semibold tracking-[.25em] text-black/45">EVENT DETAILS</H6>
                    <Textarea
                      rows={6}
                      placeholder="Date, event type, preferred style, guest count, location, or anything else you already have in mind..."
                      className="resize-none rounded-2xl border-black/10 bg-[#fafaf8] px-4 py-4 text-sm leading-6 shadow-none"
                    />
                  </div>

                  <div className="rounded-2xl border border-black/[.06] bg-[#f7f6f2] p-4">
                    <div className="flex gap-3">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#8c7955]" strokeWidth={1.5} />
                      <p className="text-[10px] leading-5 text-black/45">
                        Share as much or as little as you like. We will review your idea and help shape the next step.
                      </p>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="group flex h-16 w-full items-center justify-between rounded-full bg-[#171716] px-3 pl-7 text-white transition hover:-translate-y-0.5"
                  >
                    <span className="text-[9px] tracking-[.28em] uppercase">Start my project</span>
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-black transition group-hover:rotate-45">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </button>

                  <p className="text-center text-[8px] tracking-[.2em] text-black/25 uppercase">
                    MomentsEra / Crafted for meaningful occasions
                  </p>
                </form>
              </motion.div>
            </div>
          </div>

          <div className="mt-5 flex justify-between px-2 text-[8px] tracking-[.25em] text-black/30 uppercase">
            <span>Have an idea? Let&apos;s make it tangible.</span>
            <span className="hidden sm:block">01 — Contact</span>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
