"use client";

import { ReactNode } from "react";

import { H2 } from "./H2";
import { H6 } from "./H6";
import { Para } from "./Para";

interface HeadingProps {
  icon?: ReactNode;
  label?: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
  desc?: ReactNode;

  layout?: "default" | "split";
  align?: "left" | "center" | "right";
  variant?: "light" | "dark";

  descWidth?: string;

  buttonText?: string;
  buttonClass?: string;
  onClick?: () => void;

  className?: string;
  labelClassName?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  descClassName?: string;
}

const variants = {
  light: {
    label: "text-neutral-500",
    title: "text-neutral-950",
    subtitle: "text-[var(--accent-primary)]",
    desc: "text-neutral-600",
    button: "bg-neutral-950 text-white border border-neutral-950 hover:bg-neutral-800",
  },
  dark: {
    label: "text-white/70",
    title: "text-white",
    subtitle: "text-white",
    desc: "text-white/80",
    button: "bg-white text-neutral-950 border border-white hover:bg-neutral-100",
  },
} as const;

const alignment = {
  left: "items-start text-left pb-15",
  center: "items-center text-center",
  right: "items-end text-right",
} as const;

export default function Heading({
  icon,
  label,
  title,
  subtitle,
  desc,

  layout = "default",
  align = "left",
  variant = "light",

  descWidth = "max-w-2xl",

  buttonText,
  buttonClass,
  onClick,

  className,
  labelClassName,
  titleClassName,
  subtitleClassName,
  descClassName,
}: HeadingProps) {
  const v = variants[variant];

  if (layout === "split") {
    return (
      <div className={`grid pb-15 lg:grid-cols-[1fr_480px] lg:items-center lg:gap-12 ${className ?? ""}`}>
        <div>
          {icon && <div className="mb-5">{icon}</div>}

          {label && <H6 className={`${v.label} ${labelClassName ?? ""}`}>{label}</H6>}

          {title && <H2 className={`pt-2 ${v.title} ${titleClassName ?? ""}`}>{title}</H2>}

          {subtitle && (
            <div
              className={`pt-2 [font-family:var(--font-windsong)] text-4xl leading-none sm:text-5xl ${v.subtitle} ${subtitleClassName ?? ""}`}
            >
              {subtitle}
            </div>
          )}
        </div>

        <div className="text-right lg:justify-self-end">
          {desc && <Para className={`pt-1 sm:pt-2 ${descWidth} ${v.desc} ${descClassName ?? ""}`}>{desc}</Para>}

          {buttonText && (
            <button
              onClick={onClick}
              className={`mt-8 inline-flex h-12 items-center justify-center rounded-full px-8 text-end transition-all ${v.button} ${buttonClass ?? ""}`}
            >
              {buttonText}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col ${alignment[align]} ${className ?? ""}`}>
      {icon && <div className="mb-6">{icon}</div>}

      {label && <H6 className={`${v.label} ${labelClassName ?? ""}`}>{label}</H6>}

      {title && (
        <H2
          className={` ${label ? "pt-2" : ""} ${v.title} ${align === "center" ? "text-center" : ""} ${align === "right" ? "text-right" : ""} ${titleClassName ?? ""} `}
        >
          {title}
        </H2>
      )}

      {subtitle && (
        <div
          className={`pt-2 [font-family:var(--font-windsong)] text-3xl leading-10 leading-none tracking-[-0.06em] sm:text-4xl md:text-5xl ${v.subtitle} ${subtitleClassName ?? ""}`}
        >
          {subtitle}
        </div>
      )}

      {desc && (
        <Para
          className={`pt-2 sm:pt-5 ${descWidth} ${
            align === "center" ? "mx-auto text-center" : align === "right" ? "ml-auto text-right" : "mr-auto text-left"
          } ${v.desc} ${descClassName ?? ""}`}
        >
          {desc}
        </Para>
      )}

      {buttonText && (
        <button
          onClick={onClick}
          className={`mt-8 inline-flex h-12 items-center justify-center rounded-full px-8 transition-all ${v.button} ${
            align === "center" ? "mx-auto" : align === "right" ? "ml-auto" : ""
          } ${buttonClass ?? ""}`}
        >
          {buttonText}
        </button>
      )}
    </div>
  );
}
