"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Languages } from "lucide-react";
import { useEffect, useState } from "react";

const languages = ["EN", "ع", "த", "हि", "മ", "文"];

export default function AnimatedLanguageIcon() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 2) % languages.length);
    }, 2000);

    return () => clearInterval(timer);
  }, []);

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
      }}
      className="relative inline-flex items-center justify-center"
    >
      {/* Background Icon */}
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
        <Languages size={80} strokeWidth={1.75} className="text-black/20" />
      </motion.div>

      {/* Language Text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{
              opacity: 0,
              scale: 0.5,
              y: 10,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.5,
              y: -10,
            }}
            transition={{
              duration: 0.5,
            }}
            className="flex gap-2 text-lg font-semibold"
          >
            <span>{languages[index]}</span>
            <span>{languages[(index + 1) % languages.length]}</span>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
