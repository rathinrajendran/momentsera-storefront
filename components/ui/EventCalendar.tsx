"use client";

import { CalendarDays } from "lucide-react";

interface CalendarButtonProps {
  title: string;
  startDate?: string;
  endDate?: string;
  details?: string;
  location?: string;
  isLive?: boolean;
  audio?: boolean;
}

const EventCalendar = ({
  title,
  startDate,
  endDate,
  details = "",
  location = "",
  isLive = false,
  audio,
}: CalendarButtonProps) => {
  /* ---------------- FORMAT DATE ---------------- */

const formatGoogleDate = (date?: string) => {
  if (!date) return "";

  const parsed = new Date(date);

  return Number.isNaN(parsed.getTime())
    ? ""
    : parsed.toISOString().replace(/[-:]|\.\d{3}/g, "");
};

  /* ---------------- DATES ---------------- */

  const start = formatGoogleDate(startDate);

  // fallback → +2 hours if endDate missing
  const fallbackEndDate = (() => {
    if (endDate) return endDate;

    if (!startDate) return "";

    const d = new Date(startDate);
    d.setHours(d.getHours() + 2);

    return d.toISOString();
  })();

  const end = formatGoogleDate(fallbackEndDate);

  /* ---------------- URL ---------------- */

  const calendarUrl = `
    https://calendar.google.com/calendar/render?action=TEMPLATE
    &text=${encodeURIComponent(title || "Event")}
    &dates=${start}/${end}
    &details=${encodeURIComponent(details)}
    &location=${encodeURIComponent(location)}
  `.replace(/\s+/g, "");

  /* ---------------- HIDE ---------------- */

if (!start) {
  console.log("Calendar hidden");
  return null;
}

  return (
    <div
      className={`
        z-[99999] flex items-center justify-end ${audio ? "right-26" : "right-5"}
        ${
          isLive
            ? "fixed bottom-5 w-[50px]"
            : "sticky bottom-5 -mt-[42px] ml-auto w-[50px]"
        }
      `}
    >
      <a
        href={calendarUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Add to Google Calendar"
        className="
          flex h-[42px] w-[42px]
          items-center justify-center
          rounded-[var(--radius-theme)] border border-[var(--accent)]
          bg-[var(--surface-card)]
          text-[var(--primary)]
          backdrop-blur-md
          transition-all duration-300
          hover:scale-105
        "
      >
        <CalendarDays className="w-4" strokeWidth={1} />
      </a>
    </div>
  );
};

export default EventCalendar;
