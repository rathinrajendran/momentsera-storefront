import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/utils";

const paragraphVariants = cva("", {
  variants: {
    variant: {
      default: "text-xs sm:text-[0.9rem] font-regular leading-6 sm:leading-7 tracking-wide",
      muted: "text-base text-muted-foreground",
      lead: "text-[0.9rem] leading-[2] font-light tracking-[0.03rem] text-muted-foreground",
      small: "text-[0.7rem] sm:text-[0.8rem] leading-[2] font-light tracking-[0rem] text-muted-foreground",
      verySmall: "text-[0.6rem] sm:text-[0.7rem] leading-[2] font-light tracking-[0.01rem] text-muted-foreground",
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

function Para({
  className,
  variant,
  align,
  ...props
}: React.ComponentProps<"p"> & VariantProps<typeof paragraphVariants>) {
  return (
    <p
      data-slot="paragraph"
      className={cn(paragraphVariants({ variant, align, className }))}
      {...props}
    />
  );
}

export { Para, paragraphVariants };
