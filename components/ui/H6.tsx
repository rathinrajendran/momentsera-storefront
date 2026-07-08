import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/utils";

const H6Variants = cva("", {
  variants: {
    variant: {
      default: "text-[0.6em] uppercase tracking-[0.2em] sm:tracking-[0.4em]",
      muted: "text-base text-muted-foreground",
      lead: "text-lg text-muted-foreground",
      subLead: "text-[0.8rem] tracking-[0.01em] leading-6 font-light text-gray-500",
      small: "text-[0.75rem] text-muted-foreground",
      large: "text-xl font-medium",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
      justify: "text-justify",
    },
  },
  defaultVariants: {
    variant: "default",
    align: "left",
  },
});

function H6({
  className,
  variant,
  align,
  ...props
}: React.ComponentProps<"h6"> & VariantProps<typeof H6Variants>) {
  return (
    <h6
      data-slot="heading"
      className={cn(H6Variants({ variant, align, className }))}
      {...props}
    />
  );
}

export { H6, H6Variants };
