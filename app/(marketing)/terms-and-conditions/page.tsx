"use client";

import { Header } from "../components/header/Header";
import { Footer } from "../components/footer/Footer";
import { Para } from "../../../components/ui/Para";
import Heading from "../../../components/ui/Heading";
import PageLayout from "../../../components/ui/PageLayout";
import { BorderFrame } from "../../../components/ui/BorderFrame";
import Section from "../../../components/ui/Section";
import BgTypography from "../../../components/ui/BgTypography";

export default function Terms() {
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

  return (
    <PageLayout>
      <Header />
      <BorderFrame />
      <Section>
        <Heading
          label="Studio Agreement"
          title="Terms of Engagement"
          desc="These terms define the relationship between the client and The Moments Studio regarding access, customization, licensing, and
            publication workflows."
          descWidth="max-w-[700px]"
        />

        {/* TERMS GRID */}
        <div className="grid gap-8 md:grid-cols-3">
          {terms.map((term, index) => (
            <div
              key={index}
              className="group rounded-[32px] border border-[var(--border-color)] bg-white p-10 transition-all duration-500 hover:border-[var(--accent-primary)] hover:shadow-xl"
            >
              {/* Top */}
              <div className="mb-10 flex items-center gap-4">
                <span className="text-[10px] font-bold tracking-[0.4em] text-[var(--accent-primary)] uppercase">/0{index + 1}</span>
              </div>

              {/* Title */}
              <h3 className="mb-5 text-xl leading-none font-bold tracking-[-0.06em] text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent-primary)]">
                {term.title}
              </h3>

              {/* Text */}
              <Para>{term.text}</Para>
            </div>
          ))}
        </div>
      </Section>
      <BgTypography title="Terms." />
      <Footer />
    </PageLayout>
  );
}
