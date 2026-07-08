"use client";

import React, { useLayoutEffect, useRef, useCallback } from "react";
import type { ReactNode } from "react";
import Lenis from "lenis";
// import "./ScrollStack.css";

export const ScrollStackItem = ({
  children,
  itemClassName = "",
}: {
  children: ReactNode;
  itemClassName?: string;
}) => {
  return <div className={`scroll-stack-card ${itemClassName}`}>{children}</div>;
};

interface ScrollStackProps {
  children: ReactNode;
  useWindowScroll?: boolean;
}

const ScrollStack: React.FC<ScrollStackProps> = ({
  children,
  useWindowScroll = true,
}) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLElement[]>([]);
  const lenisRef = useRef<Lenis | null>(null);
  const rafRef = useRef<number | null>(null);

  const update = useCallback(() => {
    const scrollTop = window.scrollY;
    const viewport = window.innerHeight;

    cardsRef.current.forEach((card, i) => {
      const rect = card.getBoundingClientRect();
      const progress = Math.min(
        1,
        Math.max(0, (viewport - rect.top) / viewport)
      );

      const scale = 1 - progress * 0.1;
      const translateY = progress * i * 40;

      card.style.transform = `translateY(${translateY}px) scale(${scale})`;
    });
  }, []);

  useLayoutEffect(() => {
    cardsRef.current = Array.from(
      document.querySelectorAll(".scroll-stack-card")
    ) as HTMLElement[];

    const lenis = new Lenis({
      smoothWheel: true,
      duration: 1.1,
    });

    lenis.on("scroll", update);

    const raf = (time: number) => {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    };

    rafRef.current = requestAnimationFrame(raf);
    lenisRef.current = lenis;

    update();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lenis.destroy();
    };
  }, [update]);

  return (
    <div ref={scrollerRef} className="scroll-stack">
      {children}
      <div style={{ height: "150vh" }} />
    </div>
  );
};

export default ScrollStack;
