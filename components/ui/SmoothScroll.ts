"use client";

import Lenis from "lenis";
import { useEffect } from "react";

export default function SmoothScroll() {
  useEffect(() => {
const lenis = new Lenis({
  duration: 3,
  smoothWheel: true,
  wheelMultiplier: 0.4,
  touchMultiplier: 0.8,
  lerp: 0.04,
});

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return null;
}
