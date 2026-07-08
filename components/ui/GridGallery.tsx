"use client";

import React from "react";
import { motion } from "framer-motion";

export default function GridGallery({
  urls,
  fallback,
}: {
  urls: string[];
  fallback: string;
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
      {urls.map((url, i) => (
        <motion.div
          key={`${url}-${i}`}
          whileHover={{ scale: 1.02 }}
          className="overflow-hidden rounded-[var(--radius-theme)]"
          style={{
            background: "var(--surface-card)",
            border: "1px solid var(--border)",
          }}
        >
          <img
            src={url || fallback}
            className="w-full object-cover"
            alt=""
            loading="lazy"
          />
        </motion.div>
      ))}
    </div>
  );
}
