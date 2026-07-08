"use client";

import * as React from "react";
import { Field, FieldLabel } from "./field";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { Calendar } from "./calendar";

type DatePickerProps = {
  label?: string;
  value?: Date;
  onChange?: (date?: Date) => void;
  className?: string;
};

export function DatePicker({ label, value, onChange, className }: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Field className="w-full">
      {label && <FieldLabel>{label}</FieldLabel>}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild className="w-[50px]">
          <Button
            variant="outline"
            className="h-[42px] w-full rounded-md border border-red bg-white px-3 text-left text-sm hover:bg-gray-50"
            onClick={() => setOpen(true)}
          >
            {value ? value.toLocaleDateString() : "Select date"}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="rounded-lg bg-white" align="start">
          <Calendar
            mode="single"
            selected={value}
            defaultMonth={value}
            captionLayout="dropdown"
            onSelect={(date) => {
              onChange?.(date);
              setOpen(false); // ✅ close on click
            }}
            className={className}
          />
        </PopoverContent>
      </Popover>
    </Field>
  );
}
