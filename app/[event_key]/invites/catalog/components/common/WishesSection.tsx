"use client";

import { motion } from "framer-motion";
import { Heart, Send } from "lucide-react";
import WishesList from "../WishesList";
import Wishes from "../Wishes";
import { useState } from "react";
import { PasswordDialog } from "../../../../../editor/[event_key]/components/publish/PasswordDialog";

interface WishesSectionProps {
  title?: string;
  animationKey: string;
  getMotionProps: any;
  eventKey: string;
  wishesRaw: any;
  wishesEnabled: boolean;
  wishesContainerRef: any;
  wishRefreshKey: number;
  setWishRefreshKey: React.Dispatch<React.SetStateAction<number>>;
  textColor?: string;
  fontSize?: string;
  fontFamily?: string;
  isIcon?: boolean;
  isProtected?: boolean;
  password?: string;
  unlockedSections: string[];
  setUnlockedSections: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function WishesSection({
  title = "Collected Wishes",
  animationKey,
  getMotionProps,
  eventKey,
  wishesRaw,
  wishesEnabled,
  wishesContainerRef,
  wishRefreshKey,
  setWishRefreshKey,
  textColor,
  fontSize,
  fontFamily,
  isIcon,
  isProtected = false,
  password = "",
  unlockedSections,
  setUnlockedSections,
}: WishesSectionProps) {
  if (!wishesEnabled) return null;
  const { key: _wishKey, ...props } = getMotionProps(0);
  const sectionId = "wishes";

  const isUnlocked = unlockedSections.includes(sectionId);
  const showPassword = Boolean(isProtected && password && !isUnlocked);

  3;
  return (
    <div className="relative">
      <section
        ref={wishesContainerRef}
        className="relative isolate overflow-visible px-6 py-24 text-center"
        style={{ background: "var(--bg-section-3)" }}
      >
        {isIcon ? <Heart className="mx-auto mb-6 opacity-40" size={40} style={{ color: "var(--accent)" }} strokeWidth={1} /> : <></>}

        <motion.h2
          key={`wishes-${animationKey}`}
          {...props}
          className="mb-12"
          style={{
            color: `var(--${textColor})`,
            fontSize: `var(--font-size-${fontSize})`,
            fontFamily: `var(--font-${fontFamily})`,
          }}
        >
          {title}
        </motion.h2>
        <WishesList key={wishRefreshKey} eventKey={eventKey} />
        <div className="mt-12">
          <Wishes
            rounded="0"
            container={wishesContainerRef.current}
            wishes={wishesRaw}
            eventKey={eventKey}
            onSuccess={() => setWishRefreshKey((prev) => prev + 1)}
            trigger={
              <button
                className="mx-auto flex cursor-pointer items-center gap-3 px-7 py-4 font-light transition-all duration-300 hover:scale-105"
                style={{
                  background: "var(--surface-overlay)",
                  color: "var(--primary)",
                  fontFamily: "var(--font-secondary)",
                  fontSize: "calc(var(--font-size-secondary) * 0.70)",
                  borderRadius: "var(--radius-theme)",
                }}
              >
                <Send size={15} strokeWidth={1} />
                Send Wishes
              </button>
            }
          />
        </div>
      </section>
      <PasswordDialog
        open={showPassword}
        title={title || "Wishes"}
        password={password}
        onClose={() => {}}
        onSuccess={() => {
          setUnlockedSections((prev) => (prev.includes(sectionId) ? prev : [...prev, sectionId]));
        }}
      />
    </div>
  );
}
