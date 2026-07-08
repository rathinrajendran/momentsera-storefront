"use client";

import React from "react";
import { useHorizontalScroll } from "../../utils/useHorizontalScroll";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../utils/utils";

export function HorizontalScroll({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const { ref, scrollLeft, scrollRight, canScrollLeft, canScrollRight } =
    useHorizontalScroll();

  return (
    <div className={`relative group w-full ${className}`}>
      {/* LEFT ARROW */}
      {canScrollLeft && (
        <button
          type="button"
          onClick={scrollLeft}
          className="cursor-pointer absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-8 text-slate-500 flex items-center justify-center transition"
        >
          <ChevronLeft strokeWidth={1.5} size={18} />
        </button>
      )}

      {/* RIGHT ARROW */}
      {canScrollRight && (
        <button
          type="button"
          onClick={scrollRight}
          className="cursor-pointer absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-8 text-slate-500 flex items-center justify-center transition"
        >
          <ChevronRight strokeWidth={1.5} size={18} />
        </button>
      )}

      {/* SCROLL CONTAINER */}
      <div
        ref={ref}
        className="flex flex-row flex-nowrap items-stretch overflow-x-auto scroll-smooth snap-x no-scrollbar w-full gap-2"
        style={{
          msOverflowStyle: "none" /* IE and Edge */,
          scrollbarWidth: "none" /* Firefox */,
        }}
      >
        {/* Force every immediate child to not shrink */}
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              // @ts-ignore
              className: cn(child.props.className, "shrink-0 snap-start"),
            });
          }
          return child;
        })}
      </div>

      {/* FADE GRADIENTS */}
      {canScrollLeft && (
        <div className="pointer-events-none absolute left-0 top-0 h-full w-8 bg-gradient-to-r from-white to-transparent z-10" />
      )}
      {canScrollRight && (
        <div className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-white to-transparent z-10" />
      )}
    </div>
  );
}
