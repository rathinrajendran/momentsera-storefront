import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/utils";

const H3Variants = cva("", {
  variants: {
    variant: {
      default: "text-lg font-bold tracking-[-0.06em] leading-none",
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

function H3({
  className,
  variant,
  align,
  ...props
}: React.ComponentProps<"h3"> & VariantProps<typeof H3Variants>) {
  return (
    <h3
      data-slot="heading"
      className={cn(H3Variants({ variant, align, className }))}
      {...props}
    />
  );
}

export { H3, H3Variants };
