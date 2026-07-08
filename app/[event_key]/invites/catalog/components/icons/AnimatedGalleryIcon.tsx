"use client";

import { motion } from "framer-motion";
import { ImageIcon } from "lucide-react";
import Image from "next/image";

export default function AnimatedGalleryIcon() {
  const cards = [
    { rotate: -12, x: -20, delay: 0 },
    { rotate: 0, x: 0, delay: 0.15 },
    { rotate: 12, x: 20, delay: 0.3 },
  ];

  return (
    <div className="relative flex h-15 w-24 items-center justify-center">
      {cards.map((card, index) => (
        <motion.div
          key={index}
          className="absolute flex h-15 w-15 items-center justify-center overflow-hidden rounded-xl bg-white shadow-md"
          initial={{
            opacity: 0,
            y: 40,
            scale: 0.8,
          }}
          animate={{
            opacity: 1,
            y: 0,
            x: card.x,
            rotate: card.rotate,
          }}
          transition={{
            delay: card.delay,
            duration: 0.6,
            scale: {
              duration: 2,
              repeat: Infinity,
              delay: index * 0.2,
            },
          }}
        >
          <Image
            src={`https://picsum.photos/seed/${index + 100}/1600/1000`}
            alt="Gallery"
            fill
            className="object-cover transition-transform duration-700 hover:scale-[1.02]"
          />
          <ImageIcon size={28} strokeWidth={1.5} />
        </motion.div>
      ))}
    </div>
  );
}
