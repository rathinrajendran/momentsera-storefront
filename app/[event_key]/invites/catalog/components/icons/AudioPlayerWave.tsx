"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";

const bars = [16, 11, 22, 26, 14];

export default function AudioPlayerWave() {
  return (
    <div className="flex w-fit items-center gap-2 rounded-lg bg-[var(--accent-primary)] px-3 py-2">
      {/* Play Button */}
      <button className="flex hidden h-8 w-8 items-center justify-center rounded-full bg-white text-white">
        <Play size={10} fill="#84a59d" />
      </button>

      {/* Wave */}
      <div className="mb-1 flex h-10 items-end gap-1">
        {bars.map((height, index) => (
          <motion.div
            key={index}
            className="w-1 rounded-md bg-white"
            animate={{
              height: [height * 0.4, height, height * 0.6, height],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: index * 0.08,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
}
