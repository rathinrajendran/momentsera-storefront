"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";

export default function HeartBeat() {
  return (
    <div className="flex h-15 w-15 items-center justify-center rounded-full bg-white">
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="inline-flex"
      >
        <Heart className="fill-red-500 text-red-500" size={35} />
      </motion.div>
    </div>
  );
}
