"use client";

import React, { useLayoutEffect, useRef, useCallback } from "react";
import type { ReactNode } from "react";
import Lenis from "lenis";
// import "./ScrollStack.css";

/* ------------------ ITEM ------------------ */

export const ScrollStackItem = ({
  children,
  itemClassName = "",
}: {
  children: ReactNode;
  itemClassName?: string;
}) => (
  <div className={`scroll-stack-card ${itemClassName}`}>{children}</div>
);

/* ------------------ STACK ------------------ */

interface ScrollStackProps {
  children: ReactNode;
}

const ScrollStack: React.FC<ScrollStackProps> = ({ children }) => {
  const cardsRef = useRef<HTMLElement[]>([]);
  const rafRef = useRef<number | null>(null);

  const update = useCallback(() => {
    const viewportHeight = window.innerHeight;
    const totalCards = cardsRef.current.length;

    cardsRef.current.forEach((card, i) => {
      const rect = card.getBoundingClientRect();

      const progress = Math.min(
        1,
        Math.max(0, (viewportHeight - rect.top) / viewportHeight)
      );

      const minScale = 0.8;
      const maxScale = 1;

      /* 🔒 first & last card always scale 1 */
      const scale =
        i === 0 || i === totalCards - 1
          ? 1
          : minScale + (maxScale - minScale) * progress;

      const translateY = progress * i * 40;

      card.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale})`;
    });
  }, []);

  useLayoutEffect(() => {
    cardsRef.current = Array.from(
      document.querySelectorAll(".scroll-stack-card")
    ) as HTMLElement[];

    const lenis = new Lenis({
      smoothWheel: true,
      duration: 1.1,
      lerp: 0.1,
    });

    lenis.on("scroll", update);

    const raf = (time: number) => {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    };

    rafRef.current = requestAnimationFrame(raf);

    update();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lenis.destroy();
    };
  }, [update]);

  return (
    <div className="scroll-stack">
      {children}
      <div className="scroll-stack-spacer" />
    </div>
  );
};

export default ScrollStack;
