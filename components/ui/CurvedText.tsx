import { useId } from "react";
import { cn } from "@/lib/utils";

type CurvedTextProps = {
  text: string;
  className?: string;
  color?: string;
  fontFamily?: string;
  letterSpacing?: string;

  // Desktop configuration
  radius?: number;
  fontSize?: number;

  // Mobile configuration
  mobileRadius?: number;
  mobileFontSize?: number;
};

export default function CurvedText({
  text,
  className,
  color = "#C9A54E",
  fontFamily = "Cormorant Garamond",
  letterSpacing = "2",
  radius = 240, // Desktop curve radius
  fontSize = 36, // Desktop font size
  mobileRadius = 160, // Mobile curve radius
  mobileFontSize = 22, // Mobile font size
}: CurvedTextProps) {
  const id = useId();

  // 1. Desktop Calculations (True SVG Arc Path)
  const desktopWidth = radius * 2;
  const desktopHeight = radius + fontSize;
  const desktopPath = `M ${fontSize} ${radius} A ${radius - fontSize} ${radius - fontSize} 0 0 1 ${desktopWidth - fontSize} ${radius}`;

  // 2. Mobile Calculations
  const mobileWidth = mobileRadius * 2;
  const mobileHeight = mobileRadius + mobileFontSize;
  const mobilePath = `M ${mobileFontSize} ${mobileRadius} A ${mobileRadius - mobileFontSize} ${mobileRadius - mobileFontSize} 0 0 1 ${mobileWidth - mobileFontSize} ${mobileRadius}`;

  return (
    <div className={cn("pointer-events-none select-none", className)}>
      {/* Desktop Version (Visible from 'md' breakpoint up) */}
      <svg
        viewBox={`0 0 ${desktopWidth} ${desktopHeight}`}
        className="hidden w-full overflow-visible md:block"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <path id={`${id}-desktop`} d={desktopPath} fill="transparent" />
        </defs>
        <text fill={color} fontSize={fontSize} fontFamily={fontFamily} letterSpacing={letterSpacing}>
          <textPath href={`#${id}-desktop`} startOffset="50%" textAnchor="middle">
            {text}
          </textPath>
        </text>
      </svg>

      {/* Mobile Version (Hidden on 'md' breakpoint up) */}
      <svg
        viewBox={`0 0 ${mobileWidth} ${mobileHeight}`}
        className="block w-full overflow-visible md:hidden"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <path id={`${id}-mobile`} d={mobilePath} fill="transparent" />
        </defs>
        <text fill={color} fontSize={mobileFontSize} fontFamily={fontFamily} letterSpacing={letterSpacing}>
          <textPath href={`#${id}-mobile`} startOffset="50%" textAnchor="middle">
            {text}
          </textPath>
        </text>
      </svg>
    </div>
  );
}
