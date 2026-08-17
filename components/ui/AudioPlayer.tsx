"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { AudioPlayerProps, AudioPlayerVariant, AudioPlayerViewProps } from "./AudioPlayerTypes";

import {
  CardAudioPlayer,
  CompactAudioPlayer,
  ElegantAudioPlayer,
  FloatingAudioPlayer,
  MinimalAudioPlayer,
  PillAudioPlayer,
  VinylAudioPlayer,
  WaveAudioPlayer,
} from "./AudioPlayerVariants";

const WAVEFORM = [
  8, 13, 18, 11, 15, 7, 20, 12, 17, 9, 15, 21, 10, 17, 7, 14, 19, 11, 16, 9, 18, 13, 21, 8, 15, 11, 19, 10, 16, 7, 14, 20, 12, 17, 9, 15,
  19, 11, 16, 8,
];

const VARIANTS: Record<AudioPlayerVariant, React.ComponentType<AudioPlayerViewProps>> = {
  minimal: MinimalAudioPlayer,
  card: CardAudioPlayer,
  pill: PillAudioPlayer,
  elegant: ElegantAudioPlayer,
  wave: WaveAudioPlayer,
  compact: CompactAudioPlayer,
  floating: FloatingAudioPlayer,
  vinyl: VinylAudioPlayer,
};

export default function AudioPlayer({
  src,
  name = "Background Music",
  cover,
  variant = "minimal",

  autoplay = false,
  allowMute = true,
  isLive = false,

  loop = true,
  fadeIn = false,
  fadeOut = false,
  volume = 60,

  showPlayer = true,
  className,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const targetVolume = useMemo(() => Math.max(0, Math.min(100, volume)) / 100, [volume]);

  const clearFade = () => {
    if (fadeTimerRef.current) {
      clearInterval(fadeTimerRef.current);
      fadeTimerRef.current = null;
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.loop = loop;
    audio.muted = muted;

    if (!fadeIn || !playing) {
      audio.volume = targetVolume;
    }
  }, [loop, muted, fadeIn, playing, targetVolume]);

  useEffect(() => {
    if (!src || !autoplay) return;

    const audio = audioRef.current;
    if (!audio) return;

    let cancelled = false;

    const start = async () => {
      try {
        if (fadeIn) {
          audio.volume = 0;
        } else {
          audio.volume = targetVolume;
        }

        await audio.play();

        if (cancelled) return;

        setPlaying(true);

        if (fadeIn) {
          clearFade();

          let current = 0;

          fadeTimerRef.current = setInterval(() => {
            current += 0.05;

            if (current >= targetVolume) {
              audio.volume = targetVolume;
              clearFade();
            } else {
              audio.volume = current;
            }
          }, 100);
        }
      } catch {
        setPlaying(false);
      }
    };

    void start();

    return () => {
      cancelled = true;
      clearFade();
    };
  }, [autoplay, src]);

  useEffect(() => {
    return () => {
      clearFade();
      audioRef.current?.pause();
    };
  }, []);

  const play = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    clearFade();

    audio.volume = fadeIn ? 0 : targetVolume;

    try {
      await audio.play();
      setPlaying(true);
    } catch {
      setPlaying(false);
      return;
    }

    if (!fadeIn) return;

    let current = 0;

    fadeTimerRef.current = setInterval(() => {
      current += 0.05;

      if (current >= targetVolume) {
        audio.volume = targetVolume;
        clearFade();
      } else {
        audio.volume = current;
      }
    }, 100);
  };

  const pause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    clearFade();

    if (!fadeOut) {
      audio.pause();
      setPlaying(false);
      return;
    }

    let current = audio.volume;

    fadeTimerRef.current = setInterval(() => {
      current -= 0.05;

      if (current <= 0) {
        audio.volume = 0;
        audio.pause();
        audio.volume = targetVolume;
        clearFade();
        setPlaying(false);
      } else {
        audio.volume = current;
      }
    }, 100);
  };

  const togglePlay = () => {
    if (audioRef.current?.paused) {
      void play();
    } else {
      pause();
    }
  };

  const toggleMute = () => {
    if (!allowMute || !audioRef.current) return;

    const next = !muted;

    audioRef.current.muted = next;
    setMuted(next);
  };

  const seek = (percentage: number) => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(audio.duration)) return;

    const nextTime = (percentage / 100) * audio.duration;

    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  if (!showPlayer || !src) return null;

  const progress = duration > 0 ? Math.min(100, Math.max(0, (currentTime / duration) * 100)) : 0;

  const Variant = VARIANTS[variant] ?? VARIANTS.minimal;

  const viewProps: AudioPlayerViewProps = {
    name,
    cover,
    playing,
    muted,
    currentTime,
    duration,
    progress,

    onTogglePlay: togglePlay,
    onToggleMute: toggleMute,
    onSeek: seek,

    allowMute,
    waveform: WAVEFORM,
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={src}
        playsInline
        preload="metadata"
        onLoadedMetadata={(event) => {
          setDuration(event.currentTarget.duration || 0);
          event.currentTarget.loop = loop;
          event.currentTarget.volume = targetVolume;
          event.currentTarget.muted = muted;
        }}
        onTimeUpdate={(event) => {
          setCurrentTime(event.currentTarget.currentTime);
        }}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          if (!loop) {
            setPlaying(false);
            setCurrentTime(0);
          }
        }}
      />

      <div className={`w-full ${isLive ? "fixed right-4 bottom-4 z-[99999] w-[min(420px,calc(100vw-2rem))]" : ""} ${className ?? ""}`}>
        <Variant {...viewProps} />
      </div>
    </>
  );
}
