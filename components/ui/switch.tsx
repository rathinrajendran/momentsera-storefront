"use client"

import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"
import { cn } from "../../utils/utils"


function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <div className="flex justify-end">
      <SwitchPrimitive.Root
        data-slot="switch"
        className={cn(
          "peer border-w-[0.5px] inline-flex h-[1.05rem] w-10 shrink-0 cursor-pointer items-center rounded-full border border-slate-400 transition-all outline-none",
          "data-[state=unchecked]:bg-white",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      >
        <SwitchPrimitive.Thumb
          data-slot="switch-thumb"
          className={cn(
            "pointer-events-none block h-[0.85rem] w-6 rounded-full ring-0 transition-transform",
            "data-[state=checked]:bg-[#84a59d]",
            "data-[state=checked]:translate-x-[calc(100%-(10.5px))]",
            "data-[state=unchecked]:translate-x-[1px]",
            "data-[state=unchecked]:bg-slate-300",
          )}
        />
      </SwitchPrimitive.Root>
    </div>
  );
}

export { Switch }
