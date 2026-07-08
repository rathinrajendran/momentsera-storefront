import { ThemeKey } from "../../app/[event_key]/invites/core/config/themeConfigs";
import { Images } from "../Presets";

export type Preset = {
  id: string;
  url: string;
  name: string;       
  themeMode?: ThemeKey;
};

export const BACKGROUND_PRESETS: Preset[] = [
  {
    id: "bg1",
    name: "Sky Blue",
    url: Images.bg1.src,
    themeMode: "Sky Blue",
  },
  {
    id: "bg2",
    name: "Rose & Cream",
    url: Images.bg2.src,
    themeMode: "Rose & Cream",
  },
  {
    id: "bg3",
    name: "Warm Ivory",
    url: Images.bg3.src,
    themeMode: "Warm Ivory",
  },
  {
    id: "bg4",
    name: "Blush Pink",
    url: Images.bg4.src,
    themeMode: "Blush Pink",
  },
  {
    id: "bg5",
    name: "Mint Green",
    url: Images.bg5.src,
    themeMode: "Mint Green",
  },
  {
    id: "bg6",
    name: "Rose & Cream",
    url: Images.bg6.src,
    themeMode: "Rose & Cream",
  },
];

export const AUDIO_PRESETS = [
  { id: "audio1", name: "Soft Piano", url: "/audio/1.mp3" },
  { id: "audio2", name: "Romantic Strings", url: "/audio/2.mp3" },
  { id: "audio3", name: "Calm Ambient", url: "/audio/3.mp3" },
  { id: "audio4", name: "Traditional Vibes", url: "/audio/4.mp3" },
  { id: "audio5", name: "Wedding Bells", url: "/audio/5.mp3" },
  { id: "audio6", name: "Celebration Beat", url: "/audio/6.mp3" },
];