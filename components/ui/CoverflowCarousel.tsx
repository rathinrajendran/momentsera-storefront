"use client";

import React, { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

interface CoverflowCarouselProps {
  urls: string[];
  fallback: string;
}

export default function CoverflowCarousel({ urls, fallback }: CoverflowCarouselProps) {
  const isLargeGallery = urls.length > 3;

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: isLargeGallery,
      align: "center",
      containScroll: false,
    },
    isLargeGallery ? [Autoplay({ delay: 3000, stopOnInteraction: false })] : [],
  );

  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;

    const handleSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on("select", handleSelect);
    emblaApi.on("reInit", handleSelect);

    return () => {
      emblaApi.off("select", handleSelect);
      emblaApi.off("reInit", handleSelect);
    };
  }, [emblaApi]);

  return (
    <div className="mx-auto max-w-7xl px-4">
      {/* Viewport */}
      <div ref={emblaRef} className="overflow-visible">
        {/* Container */}
        <div className="-ml-4 flex md:-ml-10">
          {urls.map((url, i) => {
            const isActive = selectedIndex === i;

            return (
              <div key={`${url}-${i}`} className="min-w-0 flex-[0_0_80%] pl-4 md:flex-[0_0_45%] md:pl-10">
                <div
                  className={`relative overflow-hidden rounded-[var(--radius-theme)] shadow-2xl transition-all duration-700 ease-in-out ${
                    isActive ? "z-10 scale-110 opacity-100" : "scale-75 opacity-40 blur-[1px]"
                  } `}
                >
                  <img src={url || fallback} alt="" className="w-full object-cover" loading="lazy" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-center gap-2">
        {urls.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => emblaApi?.scrollTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={selectedIndex === i}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              selectedIndex === i ? "w-6 bg-black opacity-100" : "w-2.5 bg-gray-300 opacity-50"
            } `}
          />
        ))}
      </div>
    </div>
  );
}
