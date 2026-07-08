"use client"

import * as React from "react"
import { Slider as SliderPrimitive } from "radix-ui"
import { cn } from "../../utils/utils"

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  step = 1,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
        ? defaultValue
        : [min],
    [value, defaultValue, min]
  )

  return (
    <SliderPrimitive.Root
      value={value}
      defaultValue={defaultValue}
      min={min}
      max={max}
      step={step}
      className={cn("relative flex w-full touch-none items-center select-none", className)}
      {...props}
    >
      {/* Track */}
      <SliderPrimitive.Track className="relative h-[12px] w-full rounded-full border border-gray-200">
        {/* Active range */}
        <SliderPrimitive.Range className="absolute h-full rounded-full bg-black" />
      </SliderPrimitive.Track>

      {/* Thumbs */}
      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          key={index}
          className={cn("block h-5 w-5 rounded-[30px] bg-black shadow-sm", "cursor-pointer", "transition")}
        />
      ))}
    </SliderPrimitive.Root>
  );
}

export { Slider }