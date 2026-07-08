"use client";

import * as React from "react";
import { format } from "date-fns";
import { Clock } from "lucide-react";

import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { cn } from "../../utils/utils";

interface TimePickerProps {
  value?: Date;
  onChange: (date: Date) => void;
}

const ITEM_HEIGHT = 48;
const PADDING_ITEMS = 2;

export function TimePicker({ value, onChange }: TimePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [tempDate, setTempDate] = React.useState<Date>(value || new Date());

  React.useEffect(() => {
    setTempDate(value || new Date());
  }, [value]);

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 60 }, (_, i) => i);
  const periods = ["AM", "PM"];

  const hourRef = React.useRef<HTMLDivElement>(null);
  const minuteRef = React.useRef<HTMLDivElement>(null);
  const periodRef = React.useRef<HTMLDivElement>(null);

  const selectedHour = tempDate.getHours() % 12 || 12;
  const selectedMinute = tempDate.getMinutes();
  const selectedPeriod = tempDate.getHours() >= 12 ? "PM" : "AM";

  const updateTime = (hour?: number, minute?: number, period?: "AM" | "PM") => {
    const date = new Date(tempDate);
    let h = hour ?? (date.getHours() % 12 || 12);
    let m = minute ?? date.getMinutes();
    let p = period ?? (date.getHours() >= 12 ? "PM" : "AM");

    if (p === "PM" && h !== 12) h += 12;
    if (p === "AM" && h === 12) h = 0;

    date.setHours(h);
    date.setMinutes(m);
    setTempDate(date);
  };

  const handleWheelScroll = (e: React.UIEvent<HTMLDivElement>, values: any[], type: "hour" | "minute" | "period") => {
    const scrollTop = e.currentTarget.scrollTop;
    const index = Math.round(scrollTop / ITEM_HEIGHT);
    const selected = values[Math.max(0, Math.min(index, values.length - 1))];

    if (selected === undefined) return;

    if (type === "hour" && selected !== selectedHour) updateTime(selected);
    if (type === "minute" && selected !== selectedMinute) updateTime(undefined, selected);
    if (type === "period" && selected !== selectedPeriod) updateTime(undefined, undefined, selected);
  };

  // High-End Click Trigger Selection & Auto Scroll Positioning
  const handleItemClick = (item: any, index: number, ref: React.RefObject<HTMLDivElement>, type: "hour" | "minute" | "period") => {
    if (ref.current) {
      ref.current.scrollTo({
        top: index * ITEM_HEIGHT,
        behavior: "smooth",
      });
    }

    if (type === "hour") updateTime(item);
    if (type === "minute") updateTime(undefined, item);
    if (type === "period") updateTime(undefined, undefined, item);
  };

  // Enable desktop click-and-drag interactions
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>, ref: React.RefObject<HTMLDivElement>) => {
    const element = ref.current;
    if (!element) return;

    const startY = e.pageY;
    const startScrollTop = element.scrollTop;

    // Temporarily turn off smooth/snapping behaviors during dragging for a responsive feel
    element.style.scrollSnapType = "none";
    element.style.scrollBehavior = "auto";

    let hasDragged = false;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaY = moveEvent.pageY - startY;
      if (Math.abs(deltaY) > 5) {
        hasDragged = true;
      }
      element.scrollTop = startScrollTop - deltaY;
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);

      // Re-enable snapping behaviors once dragging finishes
      element.style.scrollSnapType = "y mandatory";
      element.style.scrollBehavior = "smooth";

      if (hasDragged) {
        const index = Math.round(element.scrollTop / ITEM_HEIGHT);
        element.scrollTo({ top: index * ITEM_HEIGHT });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  // Align positions reliably when the modal pops open
  React.useEffect(() => {
    if (!isOpen) return;

    const hourIndex = hours.indexOf(selectedHour);
    const minuteIndex = minutes.indexOf(selectedMinute);
    const periodIndex = periods.indexOf(selectedPeriod);

    requestAnimationFrame(() => {
      hourRef.current?.scrollTo({ top: hourIndex * ITEM_HEIGHT });
      minuteRef.current?.scrollTo({ top: minuteIndex * ITEM_HEIGHT });
      periodRef.current?.scrollTo({ top: periodIndex * ITEM_HEIGHT });
    });
  }, [isOpen]);

  const renderWheel = (items: any[], selected: any, ref: React.RefObject<HTMLDivElement>, type: "hour" | "minute" | "period") => (
    <div
      ref={ref}
      onScroll={(e) => handleWheelScroll(e, items, type)}
      onMouseDown={(e) => handleMouseDown(e, ref)}
      className="scrollbar-none flex-1 cursor-grab snap-y snap-mandatory overflow-y-auto scroll-smooth border-r border-slate-200 select-none last:border-r-0 active:cursor-grabbing [&::-webkit-scrollbar]:h-0 [&::-webkit-scrollbar]:w-[0px] [&::-webkit-scrollbar-thumb]:rounded-[10px] [&::-webkit-scrollbar-thumb]:bg-[#c1c1c1] [&::-webkit-scrollbar-track]:rounded-[10px] [&::-webkit-scrollbar-track]:bg-[#78909C]"
      style={{ height: `${ITEM_HEIGHT * 5}px` }}
    >
      {/* Top Padding Row Spacers */}
      {Array(PADDING_ITEMS)
        .fill(null)
        .map((_, i) => (
          <div key={`top-${i}`} className="pointer-events-none h-12" />
        ))}

      {/* Selectable Snapping Items */}
      {items.map((item, index) => (
        <div
          key={item}
          onClick={() => handleItemClick(item, index, ref, type)}
          className={cn(
            "text-md pointer-events-auto z-20 flex h-12 cursor-pointer snap-center items-center justify-center transition-all",
            selected === item ? "text-xs font-semibold text-[#000000]" : "text-xs font-semibold text-[#616161]",
          )}
        >
          {typeof item === "number" ? String(item).padStart(2, "0") : item}
        </div>
      ))}

      {/* Bottom Padding Row Spacers */}
      {Array(PADDING_ITEMS)
        .fill(null)
        .map((_, i) => (
          <div key={`bottom-${i}`} className="pointer-events-none h-12" />
        ))}
    </div>
  );

  return (
    <>
      {isOpen && (
        <div className="fixed top-0 right-0 left-0 z-[99] h-screen w-[100%] bg-white/90 md:top-[115px] md:left-auto md:w-[350px]"></div>
      )}

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "h-[38px] w-full rounded-md border bg-[#ECEFF1] px-3 py-2 text-xs font-medium tracking-normal shadow-[inset_0_80px_0_0_#ffffff] transition-colors outline-none md:h-[42px]",
              "justify-start text-[#171717] placeholder:text-[#cccccc]",
              "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
              "border-slate-200",
              "focus-visible:border-slate-400 focus-visible:ring-0",
            )}
          >
            {value ? format(value, "hh:mm aa") : "Select Time"}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="timepicker-popover z-[100] w-[300px] gap-0 overflow-hidden rounded-3xl border-0 p-0 shadow-none">
          {/* Header Preview Banner */}
          <div className="flex items-start justify-between bg-[#84a59d] px-5 py-4 text-white">
            <div>
              <p className="text-xs font-light tracking-widest uppercase opacity-80">Select Date</p>
              <h1 className="mt-3 text-2xl font-semibold tracking-wide">{format(tempDate, "hh:mm aa")}</h1>
            </div>
          </div>

          {/* Stepping Scroller Container */}
          <div className="relative flex h-[240px] overflow-hidden bg-[#f3f4f6]">
            {/* Horizontal Row Highlight Focus Bar */}
            <div className="pointer-events-none absolute top-1/2 right-4 left-4 z-10 h-12 -translate-y-1/2 rounded-full bg-[#84a59d]/20" />

            {renderWheel(hours, selectedHour, hourRef, "hour")}
            {renderWheel(minutes, selectedMinute, minuteRef, "minute")}
            {renderWheel(periods, selectedPeriod, periodRef, "period")}
          </div>

          {/* Action Triggers Footer */}
          <div className="flex justify-end gap-5 border-t border-slate-200 bg-[#f3f4f6] px-6 py-4">
            <button
              onClick={() => setIsOpen(false)}
              className="cursor-pointer rounded px-2 py-1 text-xs font-semibold text-[#84a59d] transition-colors hover:text-[#7ba2c7]"
            >
              Cancel
            </button>

            <button
              onClick={() => {
                onChange(tempDate);
                setIsOpen(false);
              }}
              className="cursor-pointer rounded px-2 py-1 text-xs font-semibold text-[#84a59d] transition-colors hover:text-[#7ba2c7]"
            >
              OK
            </button>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}
