"use client";

import { motion } from "framer-motion";

export default function FlyingPaperPlane() {
  return (
    <motion.div
      className="absolute z-50"
      animate={{
        x: [0, 400, 800, 1200, 800, 400, 0],
        y: [300, 150, 250, 100, 250, 150, 300],
        rotate: [0, 20, -30, 15, -20, 10, 0],
      }}
      transition={{
        duration: 15,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <svg width="60" height="60" viewBox="0 0 70 55" fill="none">
        <path d="M5 5L65 22L42 35L36 50L28 32L5 5Z" stroke="#333" strokeWidth="2" />
        <path d="M5 5L42 35" stroke="#333" strokeWidth="2" />
        <path d="M5 5L36 50" stroke="#333" strokeWidth="2" />
      </svg>
    </motion.div>
  );
}
