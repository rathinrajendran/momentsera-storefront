import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

import { XIcon } from "lucide-react";

import { cn } from "../../utils/utils";

/* ─────────────────────────────────────────────
   ROOT
───────────────────────────────────────────── */

function Dialog({
  ...props
}: React.ComponentProps<
  typeof DialogPrimitive.Root
>) {
  return (
    <DialogPrimitive.Root
      data-slot="dialog"
      {...props}
    />
  );
}

/* ─────────────────────────────────────────────
   TRIGGER
───────────────────────────────────────────── */

function DialogTrigger({
  ...props
}: React.ComponentProps<
  typeof DialogPrimitive.Trigger
>) {
  return (
    <DialogPrimitive.Trigger
      data-slot="dialog-trigger"
      {...props}
    />
  );
}

/* ─────────────────────────────────────────────
   PORTAL
───────────────────────────────────────────── */

interface DialogPortalProps
  extends React.ComponentProps<
    typeof DialogPrimitive.Portal
  > {
  container?: HTMLElement | null;
}

function DialogPortal({
  container,
  children,
  ...props
}: DialogPortalProps) {
  return (
    <DialogPrimitive.Portal
      data-slot="dialog-portal"
      container={container}
      {...props}
    >
      <div
        className="
          fixed
          inset-0
          z-[999]
          flex
          items-center
          justify-center
          p-4
        "
      >
        {children}
      </div>
    </DialogPrimitive.Portal>
  );
}

/* ─────────────────────────────────────────────
   CLOSE
───────────────────────────────────────────── */

function DialogClose({
  ...props
}: React.ComponentProps<
  typeof DialogPrimitive.Close
>) {
  return (
    <DialogPrimitive.Close
      data-slot="dialog-close"
      {...props}
    />
  );
}

/* ─────────────────────────────────────────────
   OVERLAY
───────────────────────────────────────────── */

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<
  typeof DialogPrimitive.Overlay
>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 z-[999] bg-[#f3f4f6] backdrop-blur-sm",

        // animations
        "data-[state=open]:animate-in",
        "data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0",
        "data-[state=open]:fade-in-0",

        className,
      )}
      {...props}
    />
  );
}

/* ─────────────────────────────────────────────
   CONTENT
───────────────────────────────────────────── */

interface DialogContentProps
  extends React.ComponentProps<
    typeof DialogPrimitive.Content
  > {
  container?: HTMLElement | null;
}

function DialogContent({
  className,
  children,
  container,
  ...props
}: DialogContentProps) {
  return (
    <DialogPortal
      container={container}
    >
      <DialogOverlay />

      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          "bg-background",

          // positioning
          "relative z-[1000]",

          // sizing
          "grid w-full max-w-[520px]",

          // layout
          "gap-4 border p-6",

          // timing
          "duration-200",

          // responsive
          "sm:max-w-lg",

          // animations
          "data-[state=open]:animate-in",
          "data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0",
          "data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95",
          "data-[state=open]:zoom-in-95",

          className,
        )}
        {...props}
      >
        {children}

        <DialogPrimitive.Close
          className={cn(
            "ring-offset-background",
            "focus:ring-ring",

            // position
            "absolute top-4 right-4",

            // style
            "rounded-xs opacity-70 transition-opacity",
            "hover:opacity-100",

            // accessibility
            "focus:ring-2 focus:ring-offset-2",
            "focus:outline-hidden",

            // disabled
            "disabled:pointer-events-none",

            // icon
            "[&_svg]:pointer-events-none",
            "[&_svg]:shrink-0",
            "[&_svg:not([class*='size-'])]:size-4",
          )}
        >
          <XIcon />

          <span className="sr-only">
            Close
          </span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

/* ─────────────────────────────────────────────
   HEADER
───────────────────────────────────────────── */

function DialogHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn(
        "flex flex-col gap-2 text-center sm:text-left",
        className,
      )}
      {...props}
    />
  );
}

/* ─────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────── */

function DialogFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2",
        "sm:flex-row sm:justify-end",
        className,
      )}
      {...props}
    />
  );
}

/* ─────────────────────────────────────────────
   TITLE
───────────────────────────────────────────── */

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<
  typeof DialogPrimitive.Title
>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        "text-lg leading-none font-semibold",
        className,
      )}
      {...props}
    />
  );
}

/* ─────────────────────────────────────────────
   DESCRIPTION
───────────────────────────────────────────── */

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<
  typeof DialogPrimitive.Description
>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(
        "text-muted-foreground text-sm",
        className,
      )}
      {...props}
    />
  );
}

/* ─────────────────────────────────────────────
   EXPORTS
───────────────────────────────────────────── */

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};