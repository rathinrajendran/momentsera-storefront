"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "../../utils/utils";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { ScrollArea, ScrollBar } from "./scroll-area";

export function DateTimePicker() {
  const [date, setDate] = React.useState<Date>();
  const [isOpen, setIsOpen] = React.useState(false);

  const hours = React.useMemo(() => Array.from({ length: 12 }, (_, i) => 12 - i), []);

  const handleDateSelect = React.useCallback(
    (selectedDate: Date | undefined) => {
      if (!selectedDate) return;

      if (date) {
        selectedDate.setHours(date.getHours(), date.getMinutes());
      }

      setDate(selectedDate);
    },
    [date],
  );

  const handleTimeChange = React.useCallback(
    (type: "hour" | "minute" | "ampm", value: string) => {
      if (!date) return;

      const newDate = new Date(date);

      switch (type) {
        case "hour": {
          const hour = parseInt(value, 10);
          const isPM = newDate.getHours() >= 12;
          newDate.setHours((hour % 12) + (isPM ? 12 : 0));
          break;
        }

        case "minute":
          newDate.setMinutes(parseInt(value, 10));
          break;

        case "ampm": {
          const currentHour = newDate.getHours();

          if (value === "PM" && currentHour < 12) {
            newDate.setHours(currentHour + 12);
          }

          if (value === "AM" && currentHour >= 12) {
            newDate.setHours(currentHour - 12);
          }

          break;
        }
      }

      setDate(newDate);
    },
    [date],
  );

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger>
        <div className="w-full">
          <Button
            type="button"
            variant="outline"
            className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />

            {date ? format(date, "MM/dd/yyyy hh:mm aa") : <span>MM/DD/YYYY hh:mm aa</span>}
          </Button>
        </div>
      </PopoverTrigger>

      <PopoverContent className="z-[99] w-auto bg-[#e8e8e8] p-0">
        <div className="sm:flex">
          <Calendar mode="single" selected={date} onSelect={handleDateSelect} initialFocus />

          <div className="flex flex-col divide-y sm:h-[300px] sm:flex-row sm:divide-x sm:divide-y-0">
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex p-2 sm:flex-col">
                {hours.map((hour) => (
                  <Button
                    key={hour}
                    type="button"
                    size="icon"
                    variant={date && date.getHours() % 12 === hour % 12 ? "default" : "ghost"}
                    className="aspect-square shrink-0 sm:w-full"
                    onClick={() => handleTimeChange("hour", hour.toString())}
                  >
                    {hour}
                  </Button>
                ))}
              </div>

              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>

            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex p-2 sm:flex-col">
                {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
                  <Button
                    key={minute}
                    type="button"
                    size="icon"
                    variant={date && date.getMinutes() === minute ? "default" : "ghost"}
                    className="aspect-square shrink-0 sm:w-full"
                    onClick={() => handleTimeChange("minute", minute.toString())}
                  >
                    {minute.toString().padStart(2, "0")}
                  </Button>
                ))}
              </div>

              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>

            <ScrollArea>
              <div className="flex p-2 sm:flex-col">
                {["AM", "PM"].map((ampm) => (
                  <Button
                    key={ampm}
                    type="button"
                    size="icon"
                    variant={
                      date && ((ampm === "AM" && date.getHours() < 12) || (ampm === "PM" && date.getHours() >= 12)) ? "default" : "ghost"
                    }
                    className="aspect-square shrink-0 sm:w-full"
                    onClick={() => handleTimeChange("ampm", ampm)}
                  >
                    {ampm}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
