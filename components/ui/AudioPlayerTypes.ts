import type { ReactNode } from "react";

export type AudioPlayerVariant = "minimal" | "card" | "pill" | "elegant" | "wave" | "compact" | "floating" | "vinyl";

export interface AudioPlayerProps {
  src: string;
  name?: string;
  cover?: string;

  variant?: AudioPlayerVariant;

  autoplay?: boolean;
  allowMute?: boolean;
  isLive?: boolean;

  loop?: boolean;
  fadeIn?: boolean;
  fadeOut?: boolean;
  volume?: number;

  showPlayer?: boolean;
  className?: string;
}

export interface AudioPlayerViewProps {
  name: string;
  cover?: string;

  playing: boolean;
  muted: boolean;

  currentTime: number;
  duration: number;
  progress: number;

  onTogglePlay: () => void;
  onToggleMute: () => void;
  onSeek: (value: number) => void;

  allowMute: boolean;
  waveform: number[];

  children?: ReactNode;
}
