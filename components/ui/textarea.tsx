import * as React from "react";
import { cn } from "../../utils/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "min-h-16 w-full rounded-md border bg-[#ECEFF1] px-3 py-2 outline-none transition-colors shadow-[inset_0_80px_0_0_#ffffff] text-xs font-medium tracking-normal",
        "placeholder:text-[#cccccc] text-[#171717]",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        // default border
        "border-slate-200",
        // focus
        "focus-visible:border-slate-400 focus-visible:ring-0",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
