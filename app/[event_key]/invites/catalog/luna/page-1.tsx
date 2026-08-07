"use client";

import { useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, isValid } from "date-fns";
import { useThemeAnimation } from "../../../../../hooks/useThemeAnimations";
import { useInviteData } from "../../../../../hooks/useInviteData";
import { getAnimationKey } from "../../../../../utils/animation";
import GallerySection from "../components/common/GallerySection";
import WishesSection from "../components/common/WishesSection";

interface LunaProps {
  data: any;
  eventKey: string;
  motionData: any;
  settings: any;
}

export default function Luna({ data, eventKey, motionData, settings }: LunaProps) {
  const [wishRefreshKey, setWishRefreshKey] = useState(0);
  const wishesContainerRef = useRef<HTMLElement | null>(null);
  const Luna = useInviteData(data);
  const { getMotionProps } = useThemeAnimation(motionData);
  const animationKey = useMemo(() => getAnimationKey(motionData), [motionData]);
  const { key: _scheduleKey, ...scheduleProps } = getMotionProps(0);

  const mainTitle = useMemo(() => {
    if (Luna.firstName && Luna.secondName) {
      return `${Luna.firstName} & ${Luna.secondName}`;
    }
    return data?.announcement?.eventTitle || 
    // Luna.title ||
     "Special Event";
  }, [Luna, data]);

  const organization = data?.announcement?.organization;
  const speakerInfo = data?.announcement?.speaker;
  const heroImage = Luna.heroImage || data?.theme?.background_image;

  return (
    <div
      className="relative min-h-screen w-full overflow-x-hidden selection:bg-black/10"
      style={{
        background: "var(--bg-page)",
        color: "var(--primary)",
        fontFamily: "var(--font-secondary)",
        fontSize: "var(--font-size-primary)",
      }}
    >
      {/* HERO SECTION */}
      <section className="relative px-4 pt-12 pb-16 text-center sm:px-6 sm:pt-20 sm:pb-24">
        <AnimatePresence mode="wait">
          <motion.div key={`hero-${animationKey}`} className="mx-auto max-w-4xl">
            <HeroContent
              message={data?.announcement?.message || Luna.message}
              mainTitle={mainTitle}
              organization={organization}
              speakerInfo={speakerInfo}
              heroImage={heroImage}
              formattedDate={Luna.formattedDate}
              getMotionProps={getMotionProps}
            />
          </motion.div>
        </AnimatePresence>
      </section>

      {/* SCHEDULE / EVENTS */}
      <section className="px-4 py-16 sm:px-6 sm:py-24" style={{ background: "var(--bg-section-1, transparent)" }}>
        <motion.h2
          {...scheduleProps}
          className="mb-10 text-center text-3xl font-bold tracking-wider uppercase sm:mb-16 sm:text-5xl"
          style={{
            color: "var(--accent)",
            fontFamily: "var(--font-accent)",
          }}
        >
          Schedule
        </motion.h2>

        <div className="mx-auto flex max-w-3xl flex-col items-center space-y-6">
          {(data?.schedule || Luna.eventFunctions)?.map?.((fn: any, i: number) => {
            const { key: _key, ...motionProps } = getMotionProps(i * 0.2);

            // Handle date formatting safely for single dates vs date ranges
            let displayDate = "Date TBD";
            if (fn.startDate && fn.endDate) {
              const start = new Date(fn.startDate);
              const end = new Date(fn.endDate);
              if (isValid(start) && isValid(end)) {
                displayDate = `${format(start, "MMM dd")} - ${format(end, "dd, yyyy")}`.toUpperCase();
              }
            } else if (fn.startDate || fn.date) {
              const parsed = new Date(fn.startDate || fn.date);
              if (isValid(parsed)) {
                displayDate = format(parsed, "dd MMMM yyyy").toUpperCase();
              }
            }

            return (
              <motion.div
                key={fn.function_key ?? fn.title ?? i}
                {...motionProps}
                className="flex w-full flex-col items-center justify-between gap-4 rounded-lg border border-[var(--accent)]/20 p-6 text-center sm:flex-row sm:text-left"
              >
                <div>
                  <h3 className="text-xl font-bold uppercase sm:text-2xl" style={{ color: "var(--accent)" }}>
                    {fn.title}
                  </h3>
                  <p className="mt-1 text-sm opacity-80">
                    {fn.venue || fn.locationName} {fn.location ? `— ${fn.location}` : ""}
                  </p>
                </div>

                <div className="text-center sm:text-right">
                  <p className="text-base font-semibold tracking-wide">{displayDate}</p>
                  {fn.time && <p className="text-sm opacity-75">{fn.time}</p>}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

  

      {/* CONTACT INFORMATION */}
      {data?.contactInfo && data.contactInfo.length > 0 && (
        <section className="px-4 py-12 text-center">
          <h3 className="mb-6 text-lg font-semibold tracking-widest uppercase" style={{ color: "var(--accent)" }}>
            For More Information
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
            {data.contactInfo.map((contact: any, index: number) => (
              <p key={index} className="text-sm font-medium">
                <span className="font-semibold">{contact.name}:</span> <span className="opacity-80">{contact.phone}</span>
              </p>
            ))}
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer className="px-4 py-12 text-center" style={{ background: "var(--bg-section-1)", color: "var(--primary)" }}>
        <h2
          className="text-xl font-bold tracking-wider uppercase sm:text-2xl"
          style={{ color: "var(--accent)", fontFamily: "var(--font-accent)" }}
        >
          {organization || mainTitle}
        </h2>
        <p className="mt-2 text-xs tracking-[0.25rem] opacity-75 sm:text-sm">{Luna.formattedDate?.toUpperCase()}</p>
      </footer>
    </div>
  );
}

/* REFACTORED HERO CONTENT */
function HeroContent({ message, mainTitle, organization, speakerInfo, getMotionProps, heroImage, formattedDate }: any) {
  const { key: _mKey, ...mProps } = getMotionProps(0.1);
  const { key: _hKey, ...hProps } = getMotionProps(0.2);
  const { key: _sKey, ...sProps } = getMotionProps(0.3);

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      {/* Organization Header */}
      {organization && (
        <motion.p
          {...mProps}
          className="text-xs font-semibold tracking-[0.2em] uppercase sm:text-sm md:text-base"
          style={{ color: "var(--accent)" }}
        >
          {organization}
        </motion.p>
      )}

      {/* Message Subheading */}
      {message && message !== organization && <p className="text-xs font-medium tracking-wide opacity-80 sm:text-sm">{message}</p>}

      {/* Main Title Banner */}
      <motion.h1
        {...hProps}
        className="w-full text-4xl leading-none font-extrabold tracking-tight uppercase sm:text-6xl md:text-8xl"
        style={{
          color: "var(--accent)",
          fontFamily: "var(--font-accent)",
        }}
      >
        {mainTitle}
      </motion.h1>

      {/* Date & Location Pill */}
      {formattedDate && (
        <p className="inline-block rounded-full border border-[var(--accent)] px-4 py-1 text-xs font-semibold tracking-widest uppercase sm:text-sm">
          {formattedDate}
        </p>
      )}

      {/* Speaker Section */}
      {speakerInfo && (
        <motion.div {...sProps} className="mt-4 max-w-lg rounded-lg border border-[var(--accent)]/10 bg-[var(--accent)]/5 p-4 text-center">
          <p className="text-xs font-semibold tracking-wider uppercase opacity-75">Guest Speaker</p>
          <p className="mt-1 text-base font-bold sm:text-xl" style={{ color: "var(--accent)" }}>
            {speakerInfo}
          </p>
        </motion.div>
      )}

      {/* Poster Image (Optional Display) */}
      {heroImage && (
        <div className="mt-6 w-full max-w-md overflow-hidden rounded-lg border border-[var(--accent)]/20 shadow-lg">
          <img src={heroImage} alt="Event Poster" className="h-auto w-full object-cover" />
        </div>
      )}
    </div>
  );
}
