"use client";

import { motion } from "framer-motion";
import GalleryContainer from "./GalleryContainer";
import { PasswordDialog } from "../../../../../editor/[event_key]/components/publish/PasswordDialog";
import { THEME_COLORS } from "../../../core/core/themeColors";
import { THEME_TYPOGRAPHY } from "../../../core/core/themeTypography";
import { ThemeSectionTitle } from "../../../core/core/ThemeSectionTitle";

interface GallerySectionProps {
  title?: string;
  animationKey: string;
  getMotionProps: (index: number) => {
    key?: string;
    [key: string]: any;
  };
  layout: string;
  urls: string[];
  fallback?: string;
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
  isProtected = false,
  password = "",
  unlockedSections,
  setUnlockedSections,
}: GallerySectionProps) {
  if (!urls?.length) return null;

  const { key: _galleryKey, ...motionProps } = getMotionProps(0);
  const sectionId = "gallery";
  const isUnlocked = unlockedSections.includes(sectionId);
  const showPassword = Boolean(isProtected && password && !isUnlocked);
  const galleryTitle = title || "A Glimpse of Our Story";

  return (
    <section className="relative px-6 py-24">
      {/* Gallery Title */}
      <ThemeSectionTitle decoration="floral">{galleryTitle}</ThemeSectionTitle>
      {/* Gallery */}
      <GalleryContainer layout={layout} urls={urls} fallback={fallback || ""} />

      {/* Password Protection */}
      <PasswordDialog
        open={showPassword}
        title={galleryTitle}
        password={password}
        onClose={() => {}}
        onSuccess={() => {
          setUnlockedSections((prev) => (prev.includes(sectionId) ? prev : [...prev, sectionId]));
        }}
      />
    </section>
  );
}
