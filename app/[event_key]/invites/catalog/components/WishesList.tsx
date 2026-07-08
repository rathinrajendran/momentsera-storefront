"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { useWishes } from "../../../../../hooks/useWishes";

const DEFAULT_WISH = {
  id: "default-company-wish",
  wishes_from: "Momentsera Invitations",
  wishes_type: "text",
  wishes:
    "Wishing you a lifetime filled with love, laughter, and unforgettable memories. May this beautiful celebration mark the beginning of a joyful journey together. Thank you for celebrating this special occasion with us.",
};

export default function WishesList({ eventKey }: { eventKey: string }) {
  const { data: wishes, isLoading } = useWishes(eventKey);

  const [index, setIndex] = useState(0);

  const displayWishes = useMemo(() => {
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

  useEffect(() => {
    if (displayWishes.length <= 1) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % displayWishes.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [displayWishes]);

  useEffect(() => {
    if (index >= displayWishes.length) {
      setIndex(0);
    }
  }, [displayWishes.length, index]);

  if (isLoading) return null;

  const currentWish = displayWishes[index];

  return (
    <section className="flex w-full flex-col items-center overflow-hidden py-2">
      <div className="w-full max-w-[500px]">
        <div
          className="relative flex h-[200px] w-full items-center justify-center px-6"
          style={{
            background: "var(--surface-overlay)",
            borderRadius: "var(--radius-theme)",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentWish.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{
                duration: 0.8,
                ease: "easeInOut",
              }}
              className="absolute w-full px-10 text-center"
            >
              <p
                className="mb-4 text-sm font-light tracking-widest capitalize"
                style={{
                  color: "var(--accent)",
                  fontFamily: "var(--font-accent)",
                  fontSize: "calc(var(--font-size-accent) * 0.40)",
                }}
              >
                {currentWish.wishes_from}
              </p>

              {currentWish.wishes_type === "text" ? (
                <p
                  className="text-xl leading-relaxed font-light md:text-2xl"
                  style={{
                    color: "var(--primary)",
                    fontFamily: "var(--font-primary)",
                    fontSize: "calc(var(--font-size-primary) * 0.80)",
                  }}
                >
                  {currentWish.wishes}
                </p>
              ) : (
                <div className="inline-block rounded-full border border-[var(--border)] px-4 py-2 text-[10px] tracking-widest uppercase">
                  Sent a {currentWish.wishes_type} message
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Pagination */}
      {displayWishes.length > 1 && (
        <div className="mt-4 flex gap-2">
          {displayWishes.map((_: any, i: number) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              className={`h-1 rounded-[var(--radius-theme)] transition-all duration-500 ${
                i === index ? "w-6 bg-[var(--accent)]" : "w-1 bg-[var(--border)]"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
