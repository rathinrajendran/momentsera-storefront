"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import GalleryContainer from "./GalleryContainer";
import { PasswordDialog } from "../../../../../editor/[event_key]/components/publish/PasswordDialog";

interface GallerySectionProps {
  title?: string;
  animationKey: string;
  getMotionProps: any;
  layout: string;
  urls: string[];
  fallback?: string;
  textColor?: string;
  fontSize?: string;
  fontFamily?: string;
  isProtected?: boolean;
  password?: string;
  unlockedSections: string[];
  setUnlockedSections: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function GallerySection({
  title,
  animationKey,
  getMotionProps,
  layout,
  urls,
  fallback,
  textColor,
  fontSize,
  fontFamily,
  isProtected = false,
  password = "",
  unlockedSections,
  setUnlockedSections,
}: GallerySectionProps) {
  if (!urls?.length) return null;
  const { key: _galleryKey, ...props } = getMotionProps(0);
  const sectionId = "gallery";

  const isUnlocked = unlockedSections.includes(sectionId);
  const showPassword = Boolean(isProtected && password && !isUnlocked);

  return (
    <div className="relative">
      <section className="relative px-6 py-24" style={{ background: "var(--bg-section-1)" }}>
        <motion.h2
          key={`gallery-${animationKey}`}
          {...props}
          className="mb-8 text-center"
          style={{
            color: `var(--${textColor})`,
            fontSize: `var(--font-size-${fontSize})`,
            fontFamily: `var(--font-${fontFamily})`,
          }}
        >
          {title || "A Glimpse of Our Story"}
        </motion.h2>

        <div className="mx-auto max-w-6xl">
          <GalleryContainer layout={layout} urls={urls} fallback={fallback || ""} />
        </div>
      </section>
      <PasswordDialog
        open={showPassword}
        title={title || "Gallery"}
        password={password}
        onClose={() => {}}
        onSuccess={() => {
          setUnlockedSections((prev) => (prev.includes(sectionId) ? prev : [...prev, sectionId]));
        }}
      />
    </div>
  );
}
