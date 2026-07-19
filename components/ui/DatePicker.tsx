"use client";

import * as React from "react";
import { format } from "date-fns";
import { Matcher } from "react-day-picker";

import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { CustomCalendar } from "./CustomCalendar";
import { cn } from "../../utils/utils";

interface DatePickerProps {
  value?: Date;
  onChange: (date?: Date) => void;
  disabled?: boolean;
  disabledDates?: Matcher | Matcher[];
}

export function DatePicker({ value, onChange, disabled = false, disabledDates }: DatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [tempDate, setTempDate] = React.useState<Date | undefined>(value);

  const handleOpenChange = React.useCallback(
    (open: boolean) => {
      setIsOpen(open);

      if (open) {
        setTempDate(value);
      }
    },
    [value],
  );

  const handleCancel = React.useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleOk = React.useCallback(() => {
    onChange(tempDate);
    setIsOpen(false);
  }, [onChange, tempDate]);

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger>
        <div className="w-full">
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            className={cn(
              "h-[38px] w-full justify-start rounded-md border bg-[#ECEFF1] px-3 py-2 text-xs font-medium tracking-normal shadow-[inset_0_80px_0_#ffffff] transition-colors outline-none md:h-[42px]",
              "text-[#171717] placeholder:text-[#cccccc]",
              "border-slate-200",
              "focus-visible:border-slate-400 focus-visible:ring-0",
              "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
            )}
          >
            {value ? format(value, "MM/dd/yyyy") : "Select Date"}
          </Button>
        </div>
      </PopoverTrigger>

      {isOpen && <div className="fixed top-0 right-0 left-0 z-[99] h-screen w-full bg-white/90 md:top-[115px] md:left-auto md:w-[350px]" />}

      <PopoverContent className="datepicker-popover z-[100] w-auto border-0 p-0 shadow-none">
        <CustomCalendar
          mode="single"
          selected={tempDate}
          disabled={disabledDates}
          onSelect={setTempDate}
          onCancel={handleCancel}
          onOk={handleOk}
        />
      </PopoverContent>
    </Popover>
  );
}
