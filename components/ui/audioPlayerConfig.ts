import type { AudioPlayerVariant } from "./AudioPlayerTypes";

export const AUDIO_PLAYER_PRESETS: {
  value: AudioPlayerVariant;
  label: string;
  description: string;
}[] = [
  {
    value: "minimal",
    label: "Minimal",
    description: "Compact waveform control",
  },
  {
    value: "card",
    label: "Card",
    description: "Cover, title and progress",
  },
  {
    value: "pill",
    label: "Pill",
    description: "Small modern player",
  },
  {
    value: "elegant",
    label: "Elegant",
    description: "Refined invitation style",
  },
  {
    value: "wave",
    label: "Wave",
    description: "Large animated waveform",
  },
  {
    value: "compact",
    label: "Compact",
    description: "Inline music control",
  },
  {
    value: "floating",
    label: "Floating",
    description: "Floating player control",
  },
  {
    value: "vinyl",
    label: "Vinyl",
    description: "Decorative record player",
  },
];
