"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

export default function CoverflowCarousel({
  urls,
  fallback,
}: {
  urls: string[];
  fallback: string;
}) {
  const isLargeGallery = urls.length > 3;

  // 1. Initialize Embla with Autoplay plugin
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: isLargeGallery,
      align: "center",
      containScroll: false, // Allows center focus
    },
    isLargeGallery ? [Autoplay({ delay: 3000, stopOnInteraction: false })] : [],
  );

  const [selectedIndex, setSelectedIndex] = useState(0);

  // 2. Track the active slide for scaling logic
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Viewport */}
      <div className="overflow-visible py-16" ref={emblaRef}>
        {/* Container */}
        <div className="flex -ml-4 md:-ml-10">
          {urls.map((url, i) => {
            const isActive = selectedIndex === i;
            return (
              <div
                key={`${url}-${i}`}
                className="flex-[0_0_80%] md:flex-[0_0_45%] min-w-0 pl-4 md:pl-10"
              >
                <div
                  className={`
                    relative rounded-[var(--radius-theme)] overflow-hidden shadow-2xl transition-all duration-700 ease-in-out
                    ${
                      isActive
                        ? "scale-110 z-10 opacity-100"
                        : "scale-75 opacity-40 blur-[1px]"
                    }
                  `}
                >
                  <img
                    src={url || fallback}
                    alt=""
                    className="w-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center gap-2 mt-4">
        {urls.map((_, i) => (
          <button
            key={i}
            onClick={() => emblaApi?.scrollTo(i)}
            className={`
              h-2.5 transition-all duration-300 rounded-full
              ${
                selectedIndex === i
                  ? "w-6 bg-black opacity-100"
                  : "w-2.5 bg-gray-300 opacity-50"
              }
            `}
          />
        ))}
      </div>
    </div>
  );
}
