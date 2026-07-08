import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/utils";

const H5Variants = cva("", {
  variants: {
    variant: {
      default: "text-md font-semibold tracking-[-0.02em]",
      muted: "text-base text-muted-foreground",
      lead: "text-lg text-muted-foreground",
      small: "text-xs text-muted-foreground",
      large: "text-base font-medium",
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

function H5({
  className,
  variant,
  align,
  ...props
}: React.ComponentProps<"h5"> & VariantProps<typeof H5Variants>) {
  return (
    <h5
      data-slot="heading"
      className={cn(H5Variants({ variant, align, className }))}
      {...props}
    />
  );
}

export { H5, H5Variants };
