"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Mail, MapPin, MessageSquare, Send, CheckCircle2 } from "lucide-react";

import { Header } from "../components/header/Header";
import { Footer } from "../components/footer/Footer";
import { H6 } from "../../../components/ui/H6";
import { Para } from "../../../components/ui/Para";
import { H5 } from "../../../components/ui/H5";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import Heading from "../../../components/ui/Heading";

const ease = [0.19, 1, 0.22, 1] as const;

const reveal = {
  hidden: { opacity: 0, y: 28, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease },
  },
};

const contactItems = [
  {
    icon: Mail,
    number: "01",
    title: "EMAIL",
    value: "hello@momentsera.com",
    desc: "Questions, collaborations, or project inquiries.",
  },
  {
    icon: MapPin,
    number: "02",
    title: "LOCATION",
    value: "Kerala, India",
    desc: "Serving celebrations and brands worldwide.",
  },
  {
    icon: MessageSquare,
    number: "03",
    title: "WHATSAPP",
    value: "Quick Support",
    desc: "Fast assistance from our team.",
  },
];

const inquiryTypes = [
  { value: "wedding", label: "Wedding invitation" },
  { value: "birthday", label: "Birthday celebration" },
  { value: "anniversary", label: "Anniversary" },
  { value: "corporate", label: "Corporate event" },
  { value: "custom", label: "Custom project" },
];

export default function Contact() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f6f6f3] text-[#171716] selection:bg-[#171716] selection:text-white">
      <Header />

      {/* Soft editorial background */}
      <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-[620px] w-[620px] rounded-full bg-white blur-[120px]" />
        <div className="absolute top-[35%] right-[-20%] h-[520px] w-[520px] rounded-full bg-[#ebe7df] blur-[130px]" />
        <div className="absolute bottom-[-20%] left-[25%] h-[500px] w-[500px] rounded-full bg-white/80 blur-[120px]" />
      </div>

      <section className="relative z-10 px-4 pt-28 pb-10 sm:px-6 md:px-10 md:pt-36 lg:px-16">
        <div className="mx-auto max-w-[1500px]">
          {/* Top editorial bar */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            className="mb-5 flex items-center justify-between border-b border-black/10 pb-4"
          >
            <div className="flex items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-[#b39a6b]" />
              <span className="text-[8px] font-medium tracking-[0.34em] text-black/45 uppercase">MomentsEra / Contact</span>
            </div>
            <span className="hidden text-[8px] tracking-[0.28em] text-black/30 uppercase sm:block">Digital Invitation Studio</span>
          </motion.div>

          {/* Main curved contact panel */}
          <div className="overflow-hidden rounded-[34px] border border-black/[0.07] bg-white/75 shadow-[0_35px_120px_rgba(23,23,22,0.08)] backdrop-blur-xl md:rounded-[48px]">
            <div className="grid lg:grid-cols-[0.92fr_1.08fr]">
              {/* LEFT */}
              <div className="relative overflow-hidden bg-[#efeee9] px-7 py-10 sm:px-10 md:px-14 md:py-14 lg:px-16 lg:py-16">
                <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full border border-black/[0.06]" />
                <div className="pointer-events-none absolute top-8 right-8 h-40 w-40 rounded-full border border-black/[0.05]" />

                <div className="relative">
                  <motion.div initial="hidden" animate="show" variants={reveal}>
                    <p className="text-[8px] font-medium tracking-[0.38em] text-black/40 uppercase">Let's make something memorable</p>

                    <h1 className="mt-7 max-w-[680px] text-[clamp(3.6rem,7vw,7.5rem)] leading-[0.78] font-black tracking-[-0.085em]">
                      Start a
                      <br />
                      <span className="[font-family:var(--font-windsong)] text-[0.7em] font-light tracking-[-0.02em] text-black/60">
                        conversation.
                      </span>
                    </h1>

                    <p className="mt-9 max-w-[510px] text-sm leading-7 text-black/55 md:text-base">
                      Tell us what you are celebrating, what you imagine, and what you want your guests to feel. We will turn the idea into
                      a refined digital experience.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-3">
                      {["Weddings", "Birthdays", "Anniversaries", "Corporate"].map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-black/10 bg-white/65 px-4 py-2 text-[8px] tracking-[0.22em] text-black/50 uppercase"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </motion.div>

                  {/* Contact information */}
                  <motion.div
                    initial="hidden"
                    animate="show"
                    variants={reveal}
                    transition={{ delay: 0.18 }}
                    className="mt-16 border-t border-black/10 pt-7"
                  >
                    <p className="mb-7 text-[8px] tracking-[0.34em] text-black/35 uppercase">Direct channels</p>

                    <div className="space-y-3">
                      {contactItems.map((item) => {
                        const Icon = item.icon;

                        return (
                          <div
                            key={item.number}
                            className="group flex items-center gap-4 rounded-[22px] border border-black/[0.06] bg-white/65 p-4 transition-all duration-500 hover:-translate-y-1 hover:bg-white hover:shadow-[0_18px_45px_rgba(23,23,22,0.07)]"
                          >
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-black/10 bg-[#f4f3ef] transition-transform duration-500 group-hover:rotate-3">
                              <Icon className="h-4 w-4" strokeWidth={1.4} />
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-3">
                                <span className="text-[7px] tracking-[0.25em] text-black/25">{item.number}</span>
                                <H6 className="font-bold tracking-[0.28em] text-black/45">{item.title}</H6>
                              </div>
                              <H5 className="mt-1 truncate font-medium">{item.value}</H5>
                              <p className="mt-1 text-[10px] leading-5 text-black/40">{item.desc}</p>
                            </div>

                            <ArrowUpRight className="h-4 w-4 shrink-0 opacity-20 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:opacity-70" />
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* RIGHT FORM */}
              <motion.div
                initial={{ opacity: 0, x: 25 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.9, delay: 0.15, ease }}
                className="relative bg-white px-7 py-10 sm:px-10 md:px-14 md:py-14 lg:px-16 lg:py-16"
              >
                <div className="mb-10 flex items-start justify-between gap-5 border-b border-black/10 pb-7">
                  <div>
                    <p className="text-[8px] font-medium tracking-[0.34em] text-black/35 uppercase">Project inquiry</p>
                    <h2 className="mt-4 text-3xl leading-[0.9] font-black tracking-[-0.06em] sm:text-4xl">
                      Tell us
                      <br />
                      <span className="[font-family:var(--font-windsong)] font-light text-black/55">everything.</span>
                    </h2>
                  </div>

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-black/10 bg-[#f6f6f3]">
                    <Send className="h-4 w-4 -rotate-12" strokeWidth={1.3} />
                  </div>
                </div>

                <form className="space-y-7">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <H6 className="font-semibold tracking-[0.25em] text-black/45">FULL NAME</H6>
                      <Input
                        type="text"
                        placeholder="Your name"
                        className="min-h-[54px] rounded-2xl border-black/10 bg-[#fafaf8] px-4 text-sm text-[#171716] shadow-none outline-none placeholder:text-black/25 focus:border-black/30 focus:bg-white focus:ring-0"
                      />
                    </div>

                    <div className="space-y-2">
                      <H6 className="font-semibold tracking-[0.25em] text-black/45">EMAIL</H6>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        className="min-h-[54px] rounded-2xl border-black/10 bg-[#fafaf8] px-4 text-sm text-[#171716] shadow-none outline-none placeholder:text-black/25 focus:border-black/30 focus:bg-white focus:ring-0"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <H6 className="font-semibold tracking-[0.25em] text-black/45">INQUIRY TYPE</H6>
                    <Select>
                      <SelectTrigger className="min-h-[54px] w-full rounded-2xl border border-black/10 bg-[#fafaf8] px-4 text-sm shadow-none focus:ring-0">
                        <SelectValue placeholder="What are you planning?" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-black/10 bg-white p-2 shadow-[0_20px_60px_rgba(0,0,0,.08)]">
                        {inquiryTypes.map((item) => (
                          <SelectItem key={item.value} value={item.value} className="rounded-xl py-3 text-sm">
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <H6 className="font-semibold tracking-[0.25em] text-black/45">EVENT DETAILS</H6>
                    <Textarea
                      rows={6}
                      name="tell"
                      placeholder="Date, event type, preferred style, guest count, location, or anything else you already have in mind..."
                      className="resize-none rounded-2xl border-black/10 bg-[#fafaf8] px-4 py-4 text-sm leading-6 text-[#171716] shadow-none outline-none placeholder:text-black/25 focus:border-black/30 focus:bg-white focus:ring-0"
                    />
                  </div>

                  <div className="rounded-2xl border border-black/[0.06] bg-[#f7f6f2] p-4">
                    <div className="flex gap-3">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#8c7955]" strokeWidth={1.5} />
                      <p className="text-[10px] leading-5 text-black/45">
                        Share as much or as little as you like. We will review your idea and help shape the next step.
                      </p>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="group relative flex h-16 w-full items-center justify-between overflow-hidden rounded-full bg-[#171716] px-3 pl-7 text-white transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_20px_45px_rgba(23,23,22,.18)]"
                  >
                    <span className="relative z-10 text-[9px] font-medium tracking-[0.28em] uppercase">Start my project</span>

                    <span className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white text-black transition-transform duration-500 group-hover:rotate-45">
                      <ArrowUpRight className="h-4 w-4" strokeWidth={1.4} />
                    </span>
                  </button>

                  <p className="text-center text-[8px] tracking-[0.2em] text-black/25 uppercase">
                    MomentsEra / Crafted for meaningful occasions
                  </p>
                </form>
              </motion.div>
            </div>
          </div>

          {/* Bottom note */}
          <div className="mt-5 flex items-center justify-between px-2 text-[8px] tracking-[0.25em] text-black/30 uppercase">
            <span>Have an idea? Let's make it tangible.</span>
            <span className="hidden sm:block">01 — Contact</span>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
