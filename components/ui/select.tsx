import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { cn } from "../../utils/utils";
interface SelectValueProps extends React.ComponentProps<
  typeof SelectPrimitive.Value
> {
  title?: string;
}

function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return (
    <div className="py-1 min-w-30">
      <SelectPrimitive.Root data-slot="select" {...props} />
    </div>
  );
}

function SelectGroup({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />;
}

function SelectValue({ title, ...props }: SelectValueProps) {
  return (
    <div className="w-full">
      {title && <p className="text-gray-700 text-[0.65rem] font-light text-left mb-1">{title}</p>}
      <div className="flex justify-between w-full">
        <SelectPrimitive.Value data-slot="select-value" {...props} />
        <SelectPrimitive.Icon asChild>
          <ChevronDownIcon className="size-4 opacity-50" />
        </SelectPrimitive.Icon>
      </div>
    </div>
  );
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: "sm" | "default";
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "w-full select-trigger border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex items-center justify-between gap-2 rounded-md border text-sm whitespace-nowrap transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-14 data-[size=sm]:h-14 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 bg-[#FAFAFA] rounded-md px-4 py-3 border-0 shadow-none capitalize font-medium text-xs tracking-wide cursor-pointer h-auto",
        className,
      )}
      {...props}
    >
      {children}
    </SelectPrimitive.Trigger>
  );
}

function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={cn(
          `
    select-popover
    bg-popover
    text-popover-foreground

    relative
    z-50

    max-h-[calc(var(--radix-select-content-available-height)-50px)]
    min-w-[8rem]

    origin-top
    overflow-x-hidden
    overflow-y-auto

    rounded-xl
    border
    shadow-lg

    data-[state=open]:animate-in
    data-[state=closed]:animate-out

    data-[state=open]:fade-in-0
    data-[state=closed]:fade-out-0

    data-[state=open]:zoom-in-95
    data-[state=closed]:zoom-out-95

    data-[side=bottom]:slide-in-from-top-3
    data-[side=top]:slide-in-from-bottom-3

    duration-200
    ease-out
    `,
          position === "popper" &&
            `
      data-[side=bottom]:translate-y-1
      data-[side=top]:-translate-y-1
      data-[side=left]:-translate-x-1
      data-[side=right]:translate-x-1
      `,
          className,
        )}
        position={position}
        {...props}
      >
        {/* <SelectScrollUpButton /> */}
        <SelectPrimitive.Viewport
          className={cn(
            "p-1",
            position === "popper" &&
              "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1",
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        {/* <SelectScrollDownButton /> */}
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

// function SelectContent({
//   className,
//   children,
//   position = "popper",
//   ...props
// }: React.ComponentProps<typeof SelectPrimitive.Content>) {
//   return (
//     <SelectPrimitive.Portal>
//       <SelectPrimitive.Content
//         data-slot="select-content"
//         position={position}
//         className={cn(
//           `select-popover
//             bg-popover
//             text-popover-foreground
//             relative
//             z-50
//             overflow-hidden
//             border
//             shadow-xl

//             data-[state=open]:animate-in
//             data-[state=closed]:animate-out
//             data-[state=closed]:fade-out-0
//             data-[state=open]:fade-in-0

//             max-md:fixed
//             max-md:left-1/2
//             max-md:top-1/2
//             max-md:w-[calc(100vw-32px)]
//             max-md:max-w-md
//             max-md:-translate-x-1/2
//             max-md:-translate-y-1/2
//             max-md:rounded-3xl
//             max-md:border
//             max-md:bg-white
//             max-md:p-3
//             max-md:shadow-2xl

//             md:rounded-xl
//           `,
//           position === "popper" &&
//             `
//               data-[side=bottom]:translate-y-1
//               data-[side=top]:-translate-y-1
//               data-[side=left]:-translate-x-1
//               data-[side=right]:translate-x-1
//             `,
//           className,
//         )}
//         {...props}
//       >
//         <SelectScrollUpButton />

//         <SelectPrimitive.Viewport
//           className={cn(
//             `max-h-[200px] overflow-y-auto p-2`,
//             position === "popper" &&
//               `min-w-[var(--radix-select-trigger-width)]`,
//           )}
//         >
//           {children}
//         </SelectPrimitive.Viewport>

//         <SelectScrollDownButton />
//       </SelectPrimitive.Content>
//     </SelectPrimitive.Portal>
//   );
// }

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn("text-muted-foreground px-2 py-1.5 text-xs", className)}
      {...props}
    />
  );
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className,
      )}
      {...props}
    >
      <span className="absolute right-2 flex size-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("bg-border pointer-events-none -mx-1 my-1 h-px", className)}
      {...props}
    />
  );
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <div className="h-5">
      <SelectPrimitive.ScrollUpButton
        data-slot="select-scroll-up-button"
        className={cn(
          "flex cursor-default items-center justify-center",
          className,
        )}
        {...props}
      >
        <ChevronUpIcon className="size-4" />
      </SelectPrimitive.ScrollUpButton>
    </div>
  );
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <div className="h-5">
      <SelectPrimitive.ScrollDownButton
        data-slot="select-scroll-down-button"
        className={cn(
          "flex cursor-default items-center justify-center py-1",
          className,
        )}
        {...props}
      >
        <ChevronDownIcon className="size-4" />
      </SelectPrimitive.ScrollDownButton>
    </div>
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
