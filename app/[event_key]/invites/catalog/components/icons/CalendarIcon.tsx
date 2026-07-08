"use client";

import { motion } from "framer-motion";
import { Languages } from "lucide-react";

export default function LanguageIcon() {
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.3,
        rotate: -30,
      }}
      whileInView={{
        opacity: 1,
        scale: 1,
        rotate: 0,
      }}
      viewport={{ once: true }}
      transition={{
        duration: 0.8,
        ease: "easeOut",
      }}
      className="inline-flex"
    >
      <motion.div
        animate={{
          y: [0, -8, 0],
          rotate: [0, -3, 3, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Languages size={80} strokeWidth={1.75} className="text-black" />
      </motion.div>
    </motion.div>
  );
}
