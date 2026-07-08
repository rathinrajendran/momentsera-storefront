"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const dates = ["29", "30", "31"];

export default function AnimatedCalendarIcon() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % dates.length);
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center justify-center">
      <div className="relative h-[110px] w-[90px]">
        {/* Shadow */}
        <div className="absolute inset-x-1 bottom-0 h-[96px] rounded-[20px] bg-blue-900" />

        {/* Card */}
        <div className="absolute inset-0 overflow-hidden rounded-[20px] bg-[#2563eb] shadow-xl">
          {/* Shine */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />

          {/* Divider */}
          <div className="absolute top-1/2 right-0 left-0 z-50 h-px bg-black/20" />

          <AnimatePresence mode="wait">
            <FlipNumber key={dates[index]} value={dates[index]} />
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function FlipNumber({ value }: { value: string }) {
  return (
    <>
      {/* TOP STATIC */}
      <div className="absolute top-0 left-0 h-1/2 w-full overflow-hidden bg-[#3b82f6]">
        <DigitHalf value={value} top />
      </div>

      {/* BOTTOM STATIC */}
      <div className="absolute bottom-0 left-0 h-1/2 w-full overflow-hidden bg-[#2563eb]">
        <DigitHalf value={value} />
      </div>

      {/* FLIP */}
      <motion.div
        initial={{ rotateX: -90 }}
        animate={{ rotateX: 0 }}
        exit={{ rotateX: 90 }}
        transition={{
          duration: 0.45,
          ease: [0.4, 0, 0.2, 1],
        }}
        className="absolute inset-0"
        style={{
          perspective: "1200px",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Top */}
        <div
          className="absolute top-0 left-0 h-1/2 w-full overflow-hidden bg-[#3b82f6]"
          style={{
            transformOrigin: "bottom",
          }}
        >
          <DigitHalf value={value} top />
        </div>

        {/* Bottom */}
        <div
          className="absolute bottom-0 left-0 h-1/2 w-full overflow-hidden bg-[#2563eb]"
          style={{
            transformOrigin: "top",
          }}
        >
          <DigitHalf value={value} />
        </div>
      </motion.div>
    </>
  );
}

function DigitHalf({ value, top = false }: { value: string; top?: boolean }) {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <span
        className="absolute left-1/2 font-bold text-white select-none"
        style={{
          fontSize: "72px",
          lineHeight: "72px",
          transform: "translateX(-50%)",
          top: top ? "8px" : "-28px",
        }}
      >
        {value}
      </span>
    </div>
  );
}
