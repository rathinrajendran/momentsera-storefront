"use client";

import { useMemo } from "react";
import { Variants, Transition, Easing } from "framer-motion";

/* --- Shared Types --- */
type AnimEntry = 
  | "fade-up" 
  | "fade-down" 
  | "zoom-in" 
  | "zoom-out" 
  | "slide-left" 
  | "slide-right" 
  | "flip" 
  | "rotate-in" 
  | "blur-in";

type ScrollBehavior = "on-load" | "on-scroll" | "continuous" | "parallax";

interface AnimConfig {
  variants: Variants;
  transition: Transition;
  initial: string;
  animate?: string;
  whileInView?: string;
  viewport?: { once: boolean; amount?: number };
}

/* --- Internal Helpers --- */

/**
 * Converts the duration string to a number. Defaulting to 0.8s.
 */
const parseDuration = (raw?: string): number => {
  const n = parseFloat(raw ?? "");
  return isNaN(n) ? 0.8 : n;
};

/**
 * Converts milliseconds to seconds for Framer Motion.
 */
const parseDelay = (raw?: string): number => {
  const ms = parseFloat(raw ?? "0");
  return isNaN(ms) ? 0 : ms / 1000;
};

/**
 * Animation Presets: Defines the "feel" (Easing) of the motion[cite: 3].
 */
const easeForStyle = (style?: string): Easing => {
  switch (style) {
    case "smooth": return [0.25, 0.46, 0.45, 0.94]; // Ease Out Quad
    case "bounce": return [0.34, 1.56, 0.64, 1];    // Custom Spring-like overshoot
    case "cinematic": return [0.76, 0, 0.24, 1];   // Slow-in, Slow-out
    default: return "easeOut";
  }
};

/**
 * Entrance Effects: Defines the starting state[cite: 3].
 * intensity is derived from animation_speed to scale the distance/impact.
 */
const entryHidden = (entry: AnimEntry, intensity: number): Record<string, any> => {
  const dist = Math.round(24 * intensity);
  
  switch (entry) {
    case "fade-up": 
      return { opacity: 0, y: dist };
    case "fade-down": 
      return { opacity: 0, y: -dist };
    case "zoom-in": 
      return { opacity: 0, scale: 1 - 0.15 * intensity };
    case "zoom-out": 
      return { opacity: 0, scale: 1 + 0.15 * intensity };
    case "slide-left": 
      return { opacity: 0, x: -dist * 2 };
    case "slide-right": 
      return { opacity: 0, x: dist * 2 };
    case "flip": 
      return { opacity: 0, rotateY: 90 * intensity };
    case "rotate-in": 
      return { opacity: 0, rotate: -15 * intensity, scale: 0.9 };
    case "blur-in": 
      return { opacity: 0, filter: `blur(${10 * intensity}px)` };
    default: 
      return { opacity: 0, y: dist };
  }
};

/* --- The Hook --- */

/**
 * Custom hook to generate Framer Motion props based on theme design settings (ds).
 */
export function useThemeAnimation(ds: any) {
  // Create a unique string based on settings to force re-renders in live preview[cite: 3]
  const animKey = useMemo(() => {
    return `${ds?.animation_entry}-${ds?.animation_duration}-${ds?.animation_style}-${ds?.animation_speed}`;
  }, [ds?.animation_entry, ds?.animation_duration, ds?.animation_style, ds?.animation_speed]);

  const anim = useMemo(() => {
    const enabled = ds?.animations !== false;
    const entry: AnimEntry = ds?.animation_entry ?? "fade-up";
    const speedPct = ds?.animation_speed ?? 50;
    
    // Intensity factor (ranges roughly from 0.5 to 1.5)
    const intensity = 0.5 + speedPct / 100;

    const transition: Transition = {
      duration: enabled ? parseDuration(ds?.animation_duration) : 0,
      delay: parseDelay(ds?.animation_delay),
      ease: easeForStyle(ds?.animation_style),
      // Optional: Logic for looped animations
      ...(!!ds?.animation_loop ? { repeat: Infinity, repeatType: "reverse" } : {}),
    };

    const scroll: ScrollBehavior = ds?.scroll_behavior ?? "on-scroll";
    const onLoad = scroll === "on-load";

    return {
      variants: {
        hidden: enabled ? entryHidden(entry, intensity) : { opacity: 1 },
        visible: { 
          opacity: 1, 
          y: 0, 
          x: 0, 
          scale: 1, 
          rotateY: 0, 
          rotate: 0, 
          filter: "blur(0px)" 
        },
      },
      transition,
      initial: "hidden",
      ...(onLoad
        ? { animate: "visible" }
        : {
            whileInView: "visible",
            viewport: { once: scroll === "on-scroll", amount: 0.15 },
          }),
    } as AnimConfig;
  }, [JSON.stringify(ds)]);

  /**
   * Helper for staggering children or adding unique delays to elements.
   * key={animKey} is critical to ensure the animation resets when the user changes
   * settings in the side panel[cite: 3].
   */
  const getMotionProps = (extraDelay = 0) => ({
    key: animKey, 
    variants: anim.variants,
    initial: anim.initial,
    transition: {
      ...anim.transition,
      delay: ((anim.transition.delay as number) ?? 0) + extraDelay,
    },
    ...(anim.animate ? { animate: anim.animate } : {}),
    ...(anim.whileInView ? { whileInView: anim.whileInView } : {}),
    ...(anim.viewport ? { viewport: anim.viewport } : {}),
  });

  return { anim, getMotionProps };
}