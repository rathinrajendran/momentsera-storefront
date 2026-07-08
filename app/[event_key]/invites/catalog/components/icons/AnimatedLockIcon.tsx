"use client";

import { motion } from "framer-motion";

export default function AnimatedLockIcon() {
  return (
    <div className="relative flex h-14 w-16 justify-center">
      {/* Shackle */}
      <motion.div
        animate={{
          y: [-5, 2, -5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-0 left-[32px] z-0 -translate-x-1/2"
      >
        <div className="h-4 w-[26px] rounded-t-full border-[7px] border-b-0 border-[#566f83] bg-transparent">
          <div className="absolute top-[12px] left-0 h-[10px] w-7 border-l-[7px] border-l-[#566f83]" />
        </div>
      </motion.div>

      {/* Lock Body */}
      <div className="relative z-10 mt-4 h-10 w-[40px] overflow-hidden rounded-[10px] border-0 bg-[#d2d6d9]">
        <div className="absolute top-0 left-0 h-full w-1/2 bg-[#bec5c9]" />

        <div className="absolute top-1/2 left-1/2 h-5 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#56565c]" />
      </div>
    </div>
  );
}
