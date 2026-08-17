"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { useWishes } from "../../../../../hooks/useWishes";
import { THEME_COLORS } from "../../core/core/themeColors";
import { THEME_TYPOGRAPHY } from "../../core/core/themeTypography";
import { getShapeCardStyle } from "../../core/core/themeShapes";

const DEFAULT_WISH = {
  id: "default-company-wish",
  wishes_from: "Momentsera",
  wishes_type: "text",
  wishes:
    "Wishing you a lifetime filled with love, laughter, and unforgettable memories. May this beautiful celebration mark the beginning of a joyful journey together. Thank you for celebrating this special occasion with us.",
};

type Wish = {
  id: string | number;
  wishes_from: string;
  wishes_type: "text" | "audio" | "video" | string;
  wishes: string;
};

export default function WishesList({ eventKey }: { eventKey: string }) {
  const { data: wishes, isLoading } = useWishes(eventKey);

  const [index, setIndex] = useState(0);

  const displayWishes = useMemo<Wish[]>(() => {
    if (!wishes || wishes.length === 0) {
      return [DEFAULT_WISH];
    }

    return wishes.map((wish: any, i: number) => ({
      ...wish,

      id: wish.id ?? `wish-${i}`,

      wishes_from: wish.wishes_from?.trim() || DEFAULT_WISH.wishes_from,

      wishes: wish.wishes_type === "text" ? wish.wishes?.trim() || DEFAULT_WISH.wishes : wish.wishes,
    }));
  }, [wishes]);

  /*
   * Keep the index inside the current
   * wishes array without calling setState
   * inside an effect.
   */
  const safeIndex = displayWishes.length > 0 ? index % displayWishes.length : 0;

  const currentWish = displayWishes[safeIndex];

  /*
   * Auto rotate wishes.
   *
   * setIndex happens only inside the
   * interval callback, not synchronously
   * inside the effect.
   */
  useEffect(() => {
    if (displayWishes.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setIndex((prev) => {
        return (prev + 1) % displayWishes.length;
      });
    }, 5000);

    return () => {
      window.clearInterval(timer);
    };
  }, [displayWishes.length]);

  if (isLoading) {
    return null;
  }

  if (!currentWish) {
    return null;
  }

  return (
    <div className="w-full">
      {/* Wish Card */}
      <div
        className="relative flex h-auto min-h-[200px] w-full items-center justify-center px-7 py-8"
        style={{
          ...getShapeCardStyle(),
          borderColor: THEME_COLORS.line,
          background: THEME_COLORS.paper,
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentWish.id}
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -10,
            }}
            transition={{
              duration: 0.8,
              ease: "easeInOut",
            }}
            className="w-full text-center"
          >
            {/* Sender */}
            <p
              className="mb-4"
              style={{ ...THEME_TYPOGRAPHY.accent, color: THEME_COLORS.muted, fontSize: THEME_TYPOGRAPHY.heading.fontSize }}
            >
              {currentWish.wishes_from}
            </p>

            {/* Wish */}
            {currentWish.wishes_type === "text" ? (
              <p style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.muted }}>{currentWish.wishes}</p>
            ) : (
              <div className="inline-block rounded-full border border-[var(--border)] px-4 py-2">
                Sent a {currentWish.wishes_type} message
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pagination */}
      {displayWishes.length > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {displayWishes.map((wish, i) => {
            const active = i === safeIndex;

            return (
              <button
                key={wish.id}
                type="button"
                aria-label={`Show wish ${i + 1}`}
                aria-current={active ? "true" : undefined}
                onClick={() => setIndex(i)}
                className={[
                  "h-1 rounded-[var(--radius-theme)]",
                  "transition-all duration-500",
                  active ? "w-6 bg-[var(--accent)]" : "w-1 bg-[var(--border)]",
                ].join(" ")}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
