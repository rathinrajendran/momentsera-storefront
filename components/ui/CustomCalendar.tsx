import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, DayPickerSingleProps } from "react-day-picker";
import { format } from "date-fns";

import { cn } from "../../utils/utils";
import { buttonVariants } from "./button";

interface CustomCalendarProps extends DayPickerSingleProps {
  onCancel?: () => void;
  onOk?: () => void;
}

function CustomCalendar({
  className,
  classNames,
  showOutsideDays = false,
  selected,
  onCancel,
  onOk,
  ...props
}: CustomCalendarProps) {
  const displayDate = selected instanceof Date ? selected : new Date();

  return (
    <div className="w-[320px] rounded-3xl overflow-hidden bg-[#f3f4f6] border-0 flex flex-col font-sans">
      {/* Header */}
      <div className="bg-[#84a59d] py-4 px-5 text-white flex justify-between items-start">
        <div>
          <p className="text-xs font-light tracking-widest uppercase opacity-80">
            Select Date
          </p>
          <h1 className="text-2xl mt-3 font-semibold tracking-wide">
            {format(displayDate, "EEE, MMM d")}
          </h1>
        </div>
      </div>
      <div className="px-1 p-0">
        <DayPicker
          selected={selected}
          showOutsideDays={showOutsideDays}
          className={cn("m-0", className)}
          formatters={{
            formatWeekdayName: (date) => format(date, "EEEEE"),
          }}
          classNames={{
            months: "w-full",
            month: "space-y-4",
            caption: "flex justify-between items-center mb-3",
            caption_label: "font-semibold text-sm",
            nav: "flex gap-2",
            nav_button:
              "h-8 w-8 p-0 rounded-full flex items-center justify-center text-[#1C2D42] hover:bg-gray-200/50 transition-colors",
            table: "w-full",
            head_row: "flex justify-between w-full mb-2",
            head_cell: "w-9 text-center text-xs text-[#90A4AE] font-semibold",
            row: "flex justify-between w-full mt-1.5",
            cell: "w-9 h-8 flex items-center justify-center p-0 relative focus-within:relative focus-within:z-20 text-xs text-[#616161] font-semibold",

            day: cn(
              buttonVariants({ variant: "ghost" }),
              "w-9 h-8 p-0 font-normal text-[2px] text-[#1C2D42] rounded-full hover:bg-gray-200/60 transition-colors",
            ),
            day_selected:
              "border border-[#98B4CE] bg-transparent text-[#1C2D42] rounded-full hover:bg-[#000000]/10 font-medium",
            day_today: "font-bold text-blue-100",
            day_disabled: "opacity-30",
            day_hidden: "invisible",

            ...classNames,
          }}
          components={{
            IconLeft: () => <ChevronLeft className="h-5 w-5" />,
            IconRight: () => <ChevronRight className="h-5 w-5" />,
          }}
          {...props}
        />
      </div>

      <div className="flex justify-end gap-5 px-6 pb-4">
        <button
          onClick={onCancel}
          className="cursor-pointer text-xs font-semibold text-[#84a59d] hover:text-[#7ba2c7] transition-colors px-2 py-1 rounded"
        >
          Cancel
        </button>

        <button
          onClick={onOk}
          className="cursor-pointer text-xs font-semibold text-[#84a59d] hover:text-[#7ba2c7] transition-colors px-2 py-1 rounded"
        >
          OK
        </button>
      </div>
    </div>
  );
}

export { CustomCalendar };
