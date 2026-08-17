"use client";

import React from "react";
import { motion } from "framer-motion";
import { THEME_COLORS } from "../../app/[event_key]/invites/core/core/themeColors";
import { THEME_TYPOGRAPHY } from "../../app/[event_key]/invites/core/core/themeTypography";

export default function CollageMasonry({ urls }: { urls: string[] }) {
  // Mapping each index to the specific spans in your grid diagram
const gridSpans = [
  "row-span-2 md:row-span-3",
  "row-span-2 md:row-span-2",
  "row-span-2 md:row-span-3",
  "row-span-2 md:row-span-4",
  "row-span-2 md:row-span-4",
  "row-span-2 md:row-span-3",
  "row-span-2 md:row-span-2",
  "row-span-2 md:row-span-3",
  "row-span-2 md:row-span-3",
];

  return (
    <section>
      <div className="mx-auto grid max-w-7xl auto-rows-[100px] grid-cols-2 gap-2 md:auto-rows-[120px] md:grid-cols-3 lg:grid-cols-4">
        {urls.slice(0, 9).map((url, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className={`${gridSpans[i] || "col-span-1 row-span-1"} group relative overflow-hidden rounded-[var(--radius-theme)]`}
          >
            {/* Polaroid-style Frame */}
            <div className="flex h-full w-full flex-col border border-gray-100 bg-white p-2 pb-8 shadow-md">
              <div className="relative flex-grow overflow-hidden bg-gray-50">
                <img
                  src={url}
                  alt={`Layout item ${i + 1}`}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Reference to the "Tape" in your first image */}
                {(i === 0 || i === 4) && (
                  <div className="absolute -top-1 left-1/2 z-10 h-5 w-12 -translate-x-1/2 bg-white/40 shadow-sm backdrop-blur-[2px]" />
                )}
              </div>

              {/* Optional Caption area (Polaroid style) */}
              <div className="mt-4 text-center" style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.muted }}>
                0{i + 1} / MEMORIES
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
