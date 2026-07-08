"use client";

import React from "react";
import { motion } from "framer-motion";

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
    <section className="py-12 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[100px] md:auto-rows-[120px] gap-2">
        {urls.slice(0, 9).map((url, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className={`${gridSpans[i] || "col-span-1 row-span-1"} relative group overflow-hidden rounded-[var(--radius-theme)]`}
          >
            {/* Polaroid-style Frame */}
            <div className="bg-white p-2 pb-8 h-full w-full shadow-md border border-gray-100 flex flex-col">
              <div className="relative flex-grow overflow-hidden bg-gray-50">
                <img
                  src={url}
                  alt={`Layout item ${i + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Reference to the "Tape" in your first image */}
                {(i === 0 || i === 4) && (
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-12 h-5 bg-white/40 backdrop-blur-[2px] shadow-sm z-10" />
                )}
              </div>

              {/* Optional Caption area (Polaroid style) */}
              <div className="mt-4 text-[10px] text-gray-400 font-mono text-center">
                0{i + 1} / MEMORIES
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
