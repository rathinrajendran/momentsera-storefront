import * as React from "react";
import { cn } from "../../utils/utils";

function Input({
  className,
  type,
  value,
  onChange,
  ...props
}: React.ComponentProps<"input">) {
  const hasValue = value && value.toString().length > 0;

  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      data-slot="input"
      className={cn(
        "h-[38px] md:h-[42px] w-full rounded-md border bg-white px-3 py-2 outline-none transition-colors shadow-[inset_0_80px_0_0_#ffffff] text-xs font-medium tracking-normal",
        "placeholder:text-[#cccccc] text-[#171717]",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",

        // default border
        "border-slate-200",

        // ✅ when has value
        // hasValue && "border-slate-400",

        // focus
        "focus-visible:border-slate-400 focus-visible:ring-0",

        className,
      )}
      {...props}
    />
  );
}

export { Input };
