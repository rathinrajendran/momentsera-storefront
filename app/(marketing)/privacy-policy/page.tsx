"use client";

import React from "react";

import { Header } from "../components/header/Header";
import { Footer } from "../components/footer/Footer";
import { Para } from "../../../components/ui/Para";
import { H6 } from "../../../components/ui/H6";
import { H2 } from "../../../components/ui/H2";
import Heading from "../../../components/ui/Heading";
import PageLayout from "../../../components/ui/PageLayout";
import { BorderFrame } from "../../../components/ui/BorderFrame";
import Section from "../../../components/ui/Section";
import BgTypography from "../../../components/ui/BgTypography";

export default function PrivacyPolicy() {
  const sections = [
    {
      title: "01. Data Collection",

      content:
        "We collect media assets (photos/videos) and guest list data specifically for the generation of digital invites. All assets are processed through our secure staging environment.",
    },

    {
      title: "02. Regional Compliance",

      content:
        "As a studio operating within Qatar and the UAE, we adhere to regional data protection regulations, ensuring your personal information and event details are stored with enterprise-grade encryption.",
    },

    {
      title: "03. Media Rights",

      content:
        "Clients retain full ownership of uploaded media. Our studio uses these assets solely for the functional rendering of your digital experience.",
    },
  ];

  return (
    <PageLayout>
      <Header />
      <BorderFrame />

      <Section>
        <Heading
          label="Legal Framework"
          title="Privacy Protocol"
          desc="Your digital invitation experience is built with a strong commitment to privacy, security, and responsible data handling."
          descWidth="max-w-[700px]"
        />
        {/* SECTIONS */}
        <div className="space-y-15">
          {sections.map((section, index) => (
            <div key={index} className="border-t border-[var(--border-color)] pt-10">
              <div className="mb-6 flex items-center gap-4">
                <h2 className="text-[10px] font-bold tracking-[0.4em] text-[var(--accent-primary)] uppercase">/{section.title}</h2>
              </div>

              <Para>{section.content}</Para>
            </div>
          ))}
        </div>
      </Section>
      <BgTypography title="Privacy." />
      <Footer />
    </PageLayout>
  );
}
