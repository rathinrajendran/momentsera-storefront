import React, { useMemo } from "react";
import { THEME_TYPOGRAPHY } from "../../app/[event_key]/invites/core/core/themeTypography";
import { THEME_COLORS } from "../../app/[event_key]/invites/core/core/themeColors";

type WeddingCalendarProps = {
  year?: number;
  month?: number; // 0 = January, 10 = November
  selectedDate?: number;
  className?: string;
};

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

export default function WeddingCalendar({
  year = 2025,
  month = 10, // November
  selectedDate = 16,
  className = "",
}: WeddingCalendarProps) {
  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const firstWeekday = firstDay.getDay();

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPreviousMonth = new Date(year, month, 0).getDate();

    const days: {
      date: number;
      currentMonth: boolean;
      key: string;
    }[] = [];

    // Previous month's trailing days
    for (let i = firstWeekday - 1; i >= 0; i--) {
      const date = daysInPreviousMonth - i;

      days.push({
        date,
        currentMonth: false,
        key: `prev-${date}`,
      });
    }

    // Current month
    for (let date = 1; date <= daysInMonth; date++) {
      days.push({
        date,
        currentMonth: true,
        key: `current-${date}`,
      });
    }

    // Next month's leading days
    let nextDate = 1;

    while (days.length < 42) {
      days.push({
        date: nextDate,
        currentMonth: false,
        key: `next-${nextDate}`,
      });

      nextDate++;
    }

    return days;
  }, [year, month]);

  const monthName = new Intl.DateTimeFormat("en-US", {
    month: "long",
  }).format(new Date(year, month, 1));

  return (
    <section className={["relative w-full overflow-hidden", className].join(" ")}>
      {/* Very subtle paper texture */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 [background-size:5px_5px] opacity-[0.18]" />

      <div className="relative mx-auto max-w-[520px]">
        {/* Month */}
        <h2 className="mb-5 text-center uppercase" style={{ ...THEME_TYPOGRAPHY.heading, color: THEME_COLORS.text }}>
          {monthName} {year}
        </h2>

        {/* Weekday headings */}
        <div className="mb-2 grid grid-cols-7">
          {WEEKDAYS.map((day, index) => (
            <div
              key={`${day}-${index}`}
              className="flex h-9 items-center justify-center font-sans text-[14px] font-medium text-[#35322f] sm:text-[15px]"
              style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.text }}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar */}
        <div className="grid grid-cols-7">
          {calendarDays.map((day) => {
            const isSelected = day.currentMonth && day.date === selectedDate;

            return (
              <div key={day.key} className="relative flex h-[42px] items-center justify-center sm:h-[48px]">
                {isSelected ? (
                  <SelectedDate date={day.date} />
                ) : (
                  <span
                    className={[
                      "relative z-10",
                      "leading-none",
                      "tabular-nums",
                      day.currentMonth ? "text-[#292724]" : "text-[#b7b3ae]",
                    ].join(" ")}
                    style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.text }}
                  >
                    {day.date}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function SelectedDate({ date }: { date: number }) {
  return (
    <div className="relative flex h-10 w-10 items-center justify-center sm:h-11 sm:w-11">
      {/* Heart */}
      <div className="absolute top-1/2 left-1/2 h-[30px] w-[30px] -translate-x-1/2 -translate-y-[43%] rotate-[-45deg] rounded-[4px] bg-[#64151b] sm:h-[32px] sm:w-[32px]">
        <span className="absolute top-[-8px] left-0 h-[30px] w-[30px] rounded-full bg-[#64151b] sm:h-[32px] sm:w-[32px]" />

        <span className="absolute top-[-8px] left-[8px] h-[30px] w-[30px] rounded-full bg-[#64151b] sm:h-[32px] sm:w-[32px]" />
      </div>

      {/* Date */}
      <span
        className="relative z-10 -translate-y-[1px] tabular-nums"
        style={{ ...THEME_TYPOGRAPHY.body, color: THEME_COLORS.text }}
      >
        {date}
      </span>
    </div>
  );
}
