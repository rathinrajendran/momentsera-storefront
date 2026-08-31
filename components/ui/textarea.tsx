import * as React from "react";
import { cn } from "../../utils/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "w-full rounded-md border min-h-[80px] bg-[#ECEFF1] px-3 py-2 text-[12px] font-medium tracking-normal shadow-[inset_0_80px_0_0_#ffffff] transition-colors outline-none",
        "text-[#171717] placeholder:text-[#cccccc]",
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
