"use client";

import { Pause, Play, Volume, VolumeX } from "lucide-react";
import type { AudioPlayerViewProps } from "./AudioPlayerTypes";
import { getShapeCardStyle, THEME_SHAPES } from "../../app/[event_key]/invites/core/core/themeShapes";
import { THEME_COLORS } from "../../app/[event_key]/invites/core/core/themeColors";

const accent = "var(--accent,#74171e)";
const primary = "var(--primary,#74171e)";
const paper = "var(--bg-secondary,#fcf8f1)";
const text = "var(--text-primary,#3f302a)";
const muted = "var(--text-secondary,#8c7b6e)";
const line = "color-mix(in srgb, var(--text-primary,#3f302a) 14%, transparent)";
const imageRadius = "var(--shape-image-radius,var(--radius-theme,10px))";

function PlayButton({ playing, onClick, small = false }: { playing: boolean; onClick: () => void; small?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex shrink-0 items-center justify-center rounded-full transition-transform active:scale-95 ${
        small ? "h-8 w-8" : "h-10 w-10"
      }`}
      style={{ background: accent, color: paper }}
      aria-label={playing ? "Pause music" : "Play music"}
    >
      {playing ? (
        <Pause size={small ? 13 : 16} fill="currentColor" strokeWidth={1.2} />
      ) : (
        <Play size={small ? 13 : 16} fill="currentColor" strokeWidth={1.2} className="ml-0.5" />
      )}
    </button>
  );
}

function MuteButton({ muted, onClick }: { muted: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="shrink-0 opacity-60 transition-opacity hover:opacity-100"
      aria-label={muted ? "Unmute music" : "Mute music"}
    >
      {muted ? <VolumeX size={14} /> : <Volume size={14} />}
    </button>
  );
}

function Waveform({
  waveform,
  playing,
  progress,
  large = false,
}: Pick<AudioPlayerViewProps, "waveform" | "playing" | "progress"> & {
  large?: boolean;
}) {
  return (
    <div className={`flex items-center overflow-hidden ${large ? "h-12 gap-[3px]" : "h-7 gap-[3px]"}`}>
      {waveform.map((height, index) => {
        const active = (index / Math.max(waveform.length - 1, 1)) * 100 <= progress;

        return (
          <span
            key={`${height}-${index}`}
            className={`shrink-0 rounded-full transition-all duration-200 ${
              large ? "w-[3px]" : "w-[2px]"
            } ${active ? "opacity-100" : "opacity-25"} ${playing ? "animate-wave" : ""}`}
            style={{
              height: `${large ? height * 2 : height}px`,
              background: accent,
              animationDelay: `${index * 45}ms`,
            }}
          />
        );
      })}
    </div>
  );
}

function Progress({
  progress,
  onSeek,
  height = "h-1",
}: Pick<AudioPlayerViewProps, "progress" | "onSeek"> & {
  height?: string;
}) {
  return (
    <div className={`relative ${height} w-full`}>
      <div className="absolute inset-0 top-1/2 -translate-y-1/2 rounded-full" style={{ background: line }} />
      <div
        className="absolute top-1/2 left-0 -translate-y-1/2 rounded-full"
        style={{
          width: `${progress}%`,
          height: "100%",
          background: accent,
        }}
      />
      <input
        type="range"
        min={0}
        max={100}
        step={0.1}
        value={progress}
        onChange={(event) => onSeek(Number(event.target.value))}
        className="absolute inset-x-0 -top-1 h-3 w-full cursor-pointer opacity-0"
        aria-label="Audio progress"
      />
    </div>
  );
}

function TimeLabels({ currentTime, duration }: Pick<AudioPlayerViewProps, "currentTime" | "duration">) {
  const format = (seconds: number) => {
    if (!Number.isFinite(seconds) || seconds < 0) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const remaining = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, "0")}:${String(remaining).padStart(2, "0")}`;
  };

  return (
    <div className="mt-1 flex justify-between text-[9px]" style={{ color: muted }}>
      <span>{format(currentTime)}</span>
      <span>{format(duration)}</span>
    </div>
  );
}

export function MinimalAudioPlayer({ playing, onTogglePlay, waveform, progress }: AudioPlayerViewProps) {
  return (
    <div
      className="flex w-fit items-center justify-center gap-2 border px-3 py-1.5"
      style={{
        ...getShapeCardStyle(),
        borderColor: THEME_COLORS.line,
        background: THEME_COLORS.paper,
      }}
    >
      <PlayButton playing={playing} onClick={onTogglePlay} small />

      <Waveform waveform={waveform} playing={playing} progress={progress} />
    </div>
  );
}

export function CardAudioPlayer({
  name,
  cover,
  playing,
  muted,
  currentTime,
  duration,
  progress,
  onTogglePlay,
  onToggleMute,
  onSeek,
  allowMute,
  waveform,
}: AudioPlayerViewProps) {
  return (
    <div
      className="w-full overflow-hidden border p-3"
      style={{
        ...getShapeCardStyle(),
        borderColor: THEME_COLORS.line,
        background: THEME_COLORS.paper,
      }}
    >
      <div className="flex items-center gap-3">
        {cover ? (
          <img src={cover} alt="" className="h-14 w-14 shrink-0 object-cover" style={{ borderRadius: imageRadius }} />
        ) : (
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center"
            style={{
              borderRadius: imageRadius,
              background: `color-mix(in srgb, ${accent} 12%, transparent)`,
              color: accent,
            }}
          >
            <Volume size={19} strokeWidth={1.4} />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-xs font-medium" style={{ color: text }} title={name}>
              {name}
            </p>

            {allowMute && <MuteButton muted={muted} onClick={onToggleMute} />}
          </div>

          <div className="mt-2">
            <Waveform waveform={waveform} playing={playing} progress={progress} />
          </div>

          <Progress progress={progress} onSeek={onSeek} />

          <TimeLabels currentTime={currentTime} duration={duration} />
        </div>

        <PlayButton playing={playing} onClick={onTogglePlay} />
      </div>
    </div>
  );
}

export function PillAudioPlayer({ name, playing, progress, onTogglePlay, waveform }: AudioPlayerViewProps) {
  return (
    <div
      className="flex w-full items-center gap-3 border px-3 py-2"
      style={{
        ...getShapeCardStyle(),
        borderColor: THEME_COLORS.line,
        background: THEME_COLORS.paper,
      }}
    >
      <PlayButton playing={playing} onClick={onTogglePlay} small />

      <p className="max-w-[120px] min-w-0 truncate text-[11px] font-medium" style={{ color: text }}>
        {name}
      </p>

      <div className="min-w-0 flex-1">
        <Waveform waveform={waveform} playing={playing} progress={progress} />
      </div>
    </div>
  );
}

export function ElegantAudioPlayer({ name, playing, progress, onTogglePlay, onSeek }: AudioPlayerViewProps) {
  return (
    <div className="mx-auto w-full max-w-[340px] text-center">
      <p className="text-[11px] tracking-[0.22em] uppercase" style={{ color: muted }}>
        Music
      </p>

      <p
        className="mt-2 text-sm"
        style={{
          color: text,
          fontFamily: "var(--font-heading-family,var(--font-heading,serif))",
        }}
      >
        {name}
      </p>

      <div className="mt-3">
        <Progress progress={progress} onSeek={onSeek} />
      </div>

      <div className="mt-4 flex items-center justify-center">
        <PlayButton playing={playing} onClick={onTogglePlay} />
      </div>
    </div>
  );
}

export function WaveAudioPlayer({ name, playing, progress, onTogglePlay, onSeek, waveform }: AudioPlayerViewProps) {
  return (
    <div
      className="w-full overflow-hidden p-4"
      style={{
        ...getShapeCardStyle(),
        borderColor: THEME_COLORS.line,
        background: THEME_COLORS.paper,
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold" style={{ color: text }}>
            {name}
          </p>
          <p className="mt-0.5 text-[9px]" style={{ color: muted }}>
            Now playing
          </p>
        </div>

        <PlayButton playing={playing} onClick={onTogglePlay} small />
      </div>

      <div className="mt-3">
        <Waveform waveform={waveform} playing={playing} progress={progress} large />
      </div>

      <Progress progress={progress} onSeek={onSeek} />
    </div>
  );
}

export function CompactAudioPlayer({ name, playing, progress, onTogglePlay, waveform }: AudioPlayerViewProps) {
  return (
    <div className="flex items-center gap-2">
      <PlayButton playing={playing} onClick={onTogglePlay} small />

      <p className="max-w-[120px] truncate text-[10px]" style={{ color: text }}>
        {name}
      </p>

      <Waveform waveform={waveform.slice(0, 12)} playing={playing} progress={progress} />
    </div>
  );
}

export function FloatingAudioPlayer({ playing, onTogglePlay }: AudioPlayerViewProps) {
  return (
    <div
      className="flex h-12 w-12 items-center justify-center rounded-full border shadow-lg"
      style={{
        background: THEME_COLORS.paper,
      }}
    >
      <PlayButton playing={playing} onClick={onTogglePlay} small />
    </div>
  );
}

export function VinylAudioPlayer({ name, playing, onTogglePlay, progress, onSeek }: AudioPlayerViewProps) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={onTogglePlay}
        className={`relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 transition-transform ${
          playing ? "animate-[spin_5s_linear_infinite]" : ""
        }`}
        style={{
          borderColor: primary,
          background: `radial-gradient(
        circle,
        ${paper} 0 12%,
        ${accent} 13% 68%,
        ${accent} 69% 100%
      )`,
        }}
        aria-label={playing ? "Pause music" : "Play music"}
      >
        <span className="h-3 w-3 rounded-full" style={{ background: paper }} />
      </button>

      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-medium" style={{ color: text }}>
          {name}
        </p>

        <div className="mt-2">
          <Progress progress={progress} onSeek={onSeek} />
        </div>
      </div>
    </div>
  );
}
