"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Heart, Send } from "lucide-react";

import WishesList from "../WishesList";
import Wishes from "../Wishes";

import { PasswordDialog } from "../../../../../editor/[event_key]/components/publish/PasswordDialog";

interface WishesSectionProps {
  title?: string;
  animationKey: string;
  getMotionProps: any;
  eventKey: string;
  wishesRaw: any;

  wishesContainerRef: React.RefObject<HTMLElement | null>;

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
  const [showForm, setShowForm] = useState(false);

  const { key: _wishKey, ...motionProps } = getMotionProps(0);

  const sectionId = "wishes";

  const isUnlocked = unlockedSections.includes(sectionId);

  const showPassword = Boolean(isProtected && password && !isUnlocked);

  /*
   * Open wishes form
   */
  const handleAddWish = () => {
    setShowForm(true);
  };

  /*
   * Return to wishes list
   */
  const handleBackToWishes = () => {
    setShowForm(false);
  };

  /*
   * Called after wish is successfully submitted.
   *
   * Refresh the list first, then return
   * to the wishes list view.
   */
  const handleWishSuccess = () => {
    setWishRefreshKey((prev) => prev + 1);

    setShowForm(false);
  };



  console.log("wishesRaw", wishesRaw);
  

  return (
    <div className="gallery-block relative">
      <section
        ref={wishesContainerRef}
        className="relative isolate overflow-visible px-6 py-24 text-center"
        style={{
          background: "var(--bg-section-3)",
        }}
      >
        {/* Optional Icon */}
        {isIcon ? (
          <Heart
            className="mx-auto mb-6 opacity-40"
            size={40}
            style={{
              color: "var(--accent)",
            }}
            strokeWidth={1}
          />
        ) : null}

        {/* Title */}
        <motion.h2
          key={`wishes-${animationKey}`}
          {...motionProps}
          className="mb-12"
          style={{
            color: `var(--${textColor})`,
            fontSize: `var(--font-size-${fontSize})`,
            fontFamily: `var(--font-${fontFamily})`,
          }}
        >
          {showForm ? "Send Your Wishes" : title}
        </motion.h2>

        {/* ─────────────────────────────
            WISHES LIST
        ───────────────────────────── */}

        {!showForm && (
          <>
            <WishesList key={wishRefreshKey} eventKey={eventKey} />

            {/* Add Your Wish */}
            <button
              type="button"
              onClick={handleAddWish}
              className="mx-auto mt-10 flex cursor-pointer items-center gap-3 px-7 py-4 font-light transition-all duration-300 hover:scale-105"
              style={{
                background: "var(--surface-overlay)",
                color: "var(--primary)",
                fontFamily: "var(--font-secondary)",
                fontSize: "calc(var(--font-size-secondary) * 0.70)",
                borderRadius: "var(--radius-theme)",
              }}
            >
              <Send size={15} strokeWidth={1} />
              Add your wish
            </button>
          </>
        )}

        {/* ─────────────────────────────
            WISH FORM
        ───────────────────────────── */}

        {showForm && (
          <div className="relative">
            {/* Back Button */}

            <button
              type="button"
              onClick={handleBackToWishes}
              className="mx-auto mb-8 flex items-center gap-2 text-xs font-light transition-opacity hover:opacity-60"
              style={{
                color: "var(--secondary)",
                fontFamily: "var(--font-secondary)",
              }}
            >
              <ArrowLeft size={14} strokeWidth={1.5} />
              View wishes
            </button>

            <Wishes rounded="0" wishes={wishesRaw} eventKey={eventKey} onSuccess={handleWishSuccess} />
          </div>
        )}
      </section>

      {/* ─────────────────────────────
          PASSWORD PROTECTION
      ───────────────────────────── */}

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
