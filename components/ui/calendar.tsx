import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "../../utils/utils";
import { buttonVariants } from "./button";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-0", className)}
      classNames={{
        months: "flex justify-center",
        month: "space-y-4",
        caption:
          "relative flex items-center justify-center pt-1",
        caption_label:
          "text-sm font-medium",
        nav:
          "absolute inset-y-0 flex w-full items-center justify-between px-1",
        nav_button: cn(
          buttonVariants({ variant: "ghost" }),
          "size-7 p-0 opacity-60 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",

        table: "border-collapse",
        head_row: "flex",
        head_cell:
          "w-10 text-center text-[0.7rem] tracking-widest font-light text-[#90A4AE] uppercase text-muted-foreground",

        row: "flex mt-2",
        cell:
          "relative w-10 h-10 text-center text-sm p-0 focus-within:z-20 font-weight-[800] text-[0.8rem]",

        day: cn(
          buttonVariants({ variant: "ghost" }),
          "w-8 h-8 p-0 "
        ),

        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary",
        day_today:
          "bg-accent text-accent-foreground",
        day_outside:
          "text-muted-foreground opacity-50",
        day_disabled:
          "text-muted-foreground opacity-50",
        day_hidden: "invisible",

        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn("h-4 w-4", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn("h-4 w-4", className)} {...props} />
        ),
      }}
      {...props}
    />
  );
}

export { Calendar };
