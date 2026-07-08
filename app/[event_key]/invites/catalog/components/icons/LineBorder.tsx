import { FrameProps } from "./Floral";

export function LineBorder({
  width = "100%",
  height,
  fill = "currentColor",
  color = "#755939",
  position = "relative",
  top,
  right,
  bottom,
  left,
  rotation = "0",
  className = "",
  zIndex = 99,
}: FrameProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={width}
      {...(height && height !== "auto" ? { height } : {})}
      preserveAspectRatio="xMidYMid meet"
      fill={fill}
      className={className}
      style={{
        position,
        top,
        right,
        bottom,
        left,
        color,
        zIndex,
        transform: `rotate(${rotation}deg)`,
        height: height === "auto" ? "auto" : undefined,
      }}
    >
      <path d="M0,0h1.5v32.95c.43.22,1.08.17,1.61.26.47.08.94.2,1.38.35V0h1.5v34.12c3.18,1.26,5.84,3.93,7.11,7.12h34.06v1.5H13.66c.29.91.45,1.88.48,2.84l.13.16h32.89v1.5H12.73c.09-1.53-.13-3.04-.56-4.5h-7.67v-7.69c-1.45-.45-2.97-.64-4.49-.56V0ZM11.51,41.25c-1.13-2.4-3.13-4.41-5.52-5.53v5.53h5.52Z" />
    </svg>
  );
}
