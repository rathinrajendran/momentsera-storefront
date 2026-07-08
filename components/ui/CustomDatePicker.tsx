"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { cn } from "../../utils/utils";
import { CustomCalendar } from "./CustomCalendar";
import { Matcher } from "react-day-picker";

interface DatePickerProps {
  value?: Date;
  onChange: (date?: Date) => void;

  // Disable the entire picker
  disabled?: boolean;

  // Disable specific dates
  disabledDates?: Matcher | Matcher[];
}

export function CustomDatePicker({ value, onChange, disabled = false, disabledDates }: DatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [tempDate, setTempDate] = React.useState<Date | undefined>(value);

  React.useEffect(() => {
    setTempDate(value);
  }, [value]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "h-[38px] w-full justify-start rounded-md border bg-[#ECEFF1] px-3 py-2 text-xs font-medium tracking-normal shadow-[inset_0_80px_0_0_#ffffff] transition-colors outline-none md:h-[42px]",
            "text-[#171717] placeholder:text-[#cccccc]",
            "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
            // default border
            "border-slate-200",
            // focus
            "focus-visible:border-slate-400 focus-visible:ring-0",
          )}
          disabled={disabled}
        >
          {value ? format(value, "MM/dd/yyyy") : "Select Date"}
        </Button>
      </PopoverTrigger>
      {isOpen && (
        <div className="fixed top-0 right-0 left-0 z-[99] h-screen w-[100%] bg-white/90 md:top-[115px] md:left-auto md:w-[350px]"></div>
      )}
      <PopoverContent className="datepicker-popover z-[99] w-auto border-0 p-0 shadow-none">
        <CustomCalendar
          mode="single"
          selected={tempDate}
          disabled={disabledDates}
          onSelect={setTempDate}
          onCancel={() => {
            setTempDate(value);
            setIsOpen(false);
          }}
          onOk={() => {
            onChange(tempDate);
            setIsOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
