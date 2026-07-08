import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/utils";

const H2Variants = cva("", {
  variants: {
    variant: {
      default: "text-3xl sm:text-4xl md:text-5xl font-black leading-10 tracking-[-0.06em]",
      muted: "text-base text-muted-foreground",
      lead: "text-lg text-muted-foreground",
      small: "text-xs text-muted-foreground",
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

function H2({
  className,
  variant,
  align,
  ...props
}: React.ComponentProps<"h2"> & VariantProps<typeof H2Variants>) {
  return (
    <h2
      data-slot="h2"
      className={cn(H2Variants({ variant, align, className }))}
      {...props}
    />
  );
}

export { H2, H2Variants };
