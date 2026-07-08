"use client";

import React, { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";

export default function EmblaThumbGallery({
  urls,
  fallback,
}: {
  urls: string[];
  fallback: string;
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // 1. Main Carousel Hook
  const [mainRef, mainApi] = useEmblaCarousel({ loop: true });

  // 2. Thumbnails Carousel Hook
  const [thumbRef, thumbApi] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
  });

  // 3. Logic to sync Main -> Thumb
  const onSelect = useCallback(() => {
    if (!mainApi || !thumbApi) return;
    setSelectedIndex(mainApi.selectedScrollSnap());
    thumbApi.scrollTo(mainApi.selectedScrollSnap());
  }, [mainApi, thumbApi]);

  // 4. Logic to sync Thumb -> Main
  const onThumbClick = useCallback(
    (index: number) => {
      if (!mainApi || !thumbApi) return;
      mainApi.scrollTo(index);
    },
    [mainApi, thumbApi],
  );

  useEffect(() => {
    if (!mainApi) return;
    onSelect();
    mainApi.on("select", onSelect);
    mainApi.on("reInit", onSelect);
  }, [mainApi, onSelect]);

  return (
    <div className="max-w-[400px] mx-auto">
      {/* Main Viewport */}
      <div className="overflow-hidden rounded-[var(--radius-theme)]" ref={mainRef}>
        <div className="flex">
          {urls.map((url, i) => (
            <div key={`main-${i}`} className="flex-[0_0_100%] min-w-0">
              <img
                src={url || fallback}
                className="w-full object-cover"
                alt=""
              />
            </div>
          ))}
        </div>
      </div>

      {/* Thumbs Viewport */}
      <div className="mt-3 overflow-hidden" ref={thumbRef}>
        <div className="flex -ml-2 justify-center">
          {urls.map((url, i) => (
            <div
              key={`thumb-${i}`}
              className="flex-[0_0_20%] md:flex-[0_0_15%] min-w-0 pl-2"
              onClick={() => onThumbClick(i)}
            >
              <div
                className={`transition-opacity duration-200 cursor-pointer rounded-[var(--radius-theme)] overflow-hidden border-2 c
                  selectedIndex === i
                    ? "border-black opacity-100"
                    : "border-transparent opacity-50"
                }`}
              >
                <img
                  src={url || fallback}
                  className="h-10 w-full object-cover"
                  alt=""
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
