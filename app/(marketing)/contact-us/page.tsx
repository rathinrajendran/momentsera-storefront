"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Mail, MapPin, MessageSquare, Send } from "lucide-react";

import { Header } from "../components/header/Header";
import { Footer } from "../components/footer/Footer";
import { H6 } from "../../../components/ui/H6";
import { H2 } from "../../../components/ui/H2";
import { Para } from "../../../components/ui/Para";
import { H3 } from "../../../components/ui/H3";
import { H5 } from "../../../components/ui/H5";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import Heading from "../../../components/ui/Heading";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.19, 1, 0.22, 1],
    },
  },
};

export default function Contact() {
  return (
    <main className="bg-[#ffffff] text-[#0f172a] selection:bg-black selection:text-white">
      <Header />

      {/* Background Glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-[#f1f5f9] blur-[120px]" />
        <div className="absolute right-[-10%] bottom-[-20%] h-[500px] w-[500px] rounded-full bg-[#f8fafc] blur-[140px]" />
      </div>

      <section className="relative min-h-screen px-6 pt-40 pb-24 md:px-20">
        <div className="mx-auto grid max-w-[1440px] gap-16 lg:grid-cols-[1fr_1fr]">
          {/* WRAPPER FOR 1 AND 2 (Stays on the left on web, stacks sequentially on mobile) */}
          <div className="">
            {/* 1. HEADING */}
            <Heading
              label="Contact Momentsera"
              title="Your Perfect Invitation Starts Here."
              desc="Premium digital invitations designed to make every celebration unforgettable. Tell us about your event, and we'll help bring your vision to life."
              descWidth="max-w-[580px]"
              titleClassName="max-w-[550px]"
            />

            {/* 2. LEFT CONTENT (Contact Items) */}
            <motion.div
              initial="hidden"
              animate="show"
              // variants={fadeUp}
              className="space-y-16"
            >
              {/* Contact Items */}
              <div className="space-y-10">
                {[
                  {
                    icon: Mail,
                    title: "EMAIL",
                    value: "hello@momentsera.com",
                    desc: "Questions, collaborations, or project inquiries.",
                  },
                  {
                    icon: MapPin,
                    title: "LOCATION",
                    value: "Kerala, India",
                    desc: "Serving clients across the globe.",
                  },
                  {
                    icon: MessageSquare,
                    title: "WHATSAPP",
                    value: "Quick Support",
                    desc: "Fast assistance from our team.",
                  },
                ].map((item, i) => (
                  <div key={i} className="group flex items-center gap-6">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-black/[0.06] bg-[#f8fafc] shadow-[0_4px_20px_rgba(15,23,42,0.03)] transition-all duration-300 group-hover:scale-105">
                      <item.icon className="h-5 w-5 text-[#0f172a]" strokeWidth={2} />
                    </div>

                    <div>
                      <H6 className="font-bold tracking-[0.3em]">{item.title}</H6>
                      <H5 className="mt-2 font-medium">{item.value}</H5>
                      <p className="mt-2 text-[0.8rem] font-light tracking-wide text-gray-800">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* 3. RIGHT FORM */}
          <motion.div
            initial="hidden"
            animate="show"
            // variants={fadeUp}
            transition={{ delay: 0.2 }}
          >
            <form className="space-y-8 rounded-3xl border border-black/[0.06] bg-white/80 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur-xl md:p-10">
              <H5 className="w-[200px] text-3xl leading-8 font-black">Start Your Project</H5>
              {/* Row */}
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1">
                  <H6 className="font-semibold tracking-[0.3em]">FULL NAME</H6>
                  <Input
                    type="text"
                    placeholder="Enter your full name"
                    className="min-h-[50px] rounded-lg text-[#0f172a] transition-all outline-none placeholder:text-[#94a3b8] focus:border-black focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <H6 className="font-semibold tracking-[0.3em]">EMAIL ADDRESS</H6>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    className="min-h-[50px] rounded-lg text-[#0f172a] transition-all outline-none placeholder:text-[#94a3b8] focus:border-black focus:bg-white"
                  />
                </div>
              </div>

              {/* Select */}
              <div className="space-y-1">
                <H6 className="font-semibold tracking-[0.3em]">INQUIRY TYPE</H6>
                <Select>
                  <SelectTrigger className="m-0 min-h-[50px] w-full cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-none">
                    <SelectValue placeholder="Select an inquiry" />
                  </SelectTrigger>
                  <SelectContent className="mt-1 block rounded-xl border-[var(--border-color)] bg-white p-2 text-xs shadow-none">
                    <SelectItem value="latest" className="cursor-pointer text-xs capitalize">
                      Latest
                    </SelectItem>
                    <SelectItem value="popular" className="cursor-pointer text-xs capitalize">
                      Most Popular
                    </SelectItem>
                    <SelectItem value="low-high" className="cursor-pointer text-xs capitalize">
                      Price Low → High
                    </SelectItem>
                    <SelectItem value="high-low" className="cursor-pointer text-xs capitalize">
                      Price High → Low
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Textarea */}
              <div className="space-y-1">
                <H6 className="font-semibold tracking-[0.3em]">EVENT DETAILS</H6>
                <Textarea
                  rows={5}
                  name="tell"
                  placeholder="Tell us about your event, preferred style, date, and any special requirements."
                  className="rounded-lg bg-white text-[#0f172a] transition-all outline-none placeholder:text-[#94a3b8] focus:border-black focus:bg-white"
                />
              </div>

              {/* CTA */}
              <button className="group flex h-14 w-full cursor-pointer items-center justify-between rounded-lg bg-[#0f172a] px-6 text-white transition-all duration-500 hover:scale-[1.01] hover:bg-black">
                <span className="text-xs font-medium tracking-[0.3em] uppercase">Start My Project</span>
                <Send className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.5} />
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
