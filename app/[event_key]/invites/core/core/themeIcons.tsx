import type { ReactNode } from "react";

export type ThemeIconName =
  | "calendar"
  | "clock"
  | "venue"
  | "heart"
  | "image"
  | "music"
  | "phone"
  | "gift"
  | "shirt"
  | "map"
  | "info"
  | "chevron"
  | "menu"
  | "play"
  | "pause"
  | "check"
  | "close"
  | "car";

const ICON_PATHS: Record<ThemeIconName, ReactNode> = {
  calendar: (
    <>
      <rect x="3" y="4.5" width="18" height="16" rx="1.5" />
      <path d="M7 2.8v4M17 2.8v4M3 9h18M8 13h.01M12 13h.01M16 13h.01M8 17h.01M12 17h.01M16 17h.01" />
    </>
  ),

  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),

  venue: (
    <>
      <path d="M4 21V9l8-5 8 5v12M2.5 21h19M7 21v-7h3v7M14 21v-7h3v7M8 9h.01M12 9h.01M16 9h.01" />
    </>
  ),

  heart: <path d="M20.8 8.8c0 5.2-8.8 10-8.8 10S3.2 14 3.2 8.8A4.8 4.8 0 0 1 12 6.2a4.8 4.8 0 0 1 8.8 2.6Z" />,

  image: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="1.5" />
      <circle cx="8.5" cy="9" r="1.5" />
      <path d="m21 16-5-5-7 7-3-3-3 3" />
    </>
  ),

  music: (
    <>
      <path d="M9 18V5l10-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="16" cy="16" r="3" />
    </>
  ),

  phone: (
    <path d="M7.2 3.5 5 4.8c-.9.5-1.3 1.6-1 2.6 2 6.5 6.1 10.6 12.6 12.6 1 .3 2.1-.1 2.6-1l1.3-2.2-4.2-2.2-1.6 2c-2.5-1.1-4.4-3-5.5-5.5l2-1.6-2-4.2Z" />
  ),

  gift: (
    <>
      <rect x="3" y="10" width="18" height="11" rx="1" />
      <path d="M12 10v11M2 10h20M5 6.5c0-1.4 1.1-2.5 2.5-2.5C10 4 12 8 12 10H7.5A2.5 2.5 0 0 1 5 7.5V6.5ZM19 6.5c0-1.4-1.1-2.5-2.5-2.5C14 4 12 8 12 10h4.5A2.5 2.5 0 0 0 19 7.5V6.5Z" />
    </>
  ),

  shirt: <path d="m8 4 4 2 4-2 4 3-2 4-2-1v10H8V10l-2 1-2-4 4-3Z" />,

  map: (
    <>
      <path d="M3 6.5 8 4l8 3 5-2.5V18l-5 2.5-8-3L3 20V6.5Z" />
      <path d="M8 4v13.5M16 7v13.5" />
    </>
  ),

  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 10v6M12 7h.01" />
    </>
  ),

  chevron: <path d="m9 6 6 6-6 6" />,

  menu: (
    <>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </>
  ),

  play: <path d="m9 6 10 6-10 6V6Z" fill="currentColor" stroke="none" />,

  pause: (
    <>
      <path d="M8 6v12M16 6v12" strokeWidth="2" />
    </>
  ),

  check: <path d="m5 12 4 4L19 6" />,

  close: (
    <>
      <path d="m6 6 12 12M18 6 6 18" />
    </>
  ),

  car: (
    <>
      <path d="m5 17-1-5 2-5h12l2 5-1 5M4 12h16M7 17h.01M17 17h.01M6 7l-1 5h14l-1-5" />
    </>
  ),
};

export function ThemeIcon({ name, size = 22 }: { name: ThemeIconName; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICON_PATHS[name]}
    </svg>
  );
}
