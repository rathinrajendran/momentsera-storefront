"use client";

import { Pause, Play, Volume, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface AudioPlayerProps {
  src: string;
  autoplay?: boolean;
  allowMute?: boolean;
  isLive?: boolean;

  loop?: boolean;
  fadeIn?: boolean;
  fadeOut?: boolean;
  volume?: number;
  showPlayer?: boolean;
}

const AudioPlayer = ({
  src,
  autoplay = false,
  allowMute = true,
  isLive = false,
  loop = true,
  fadeIn = false,
  fadeOut = false,
  volume = 60,
  showPlayer = true,
}: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);

  if (!showPlayer) return null;

  /* ---------------- INIT AUDIO ---------------- */

  useEffect(() => {
    if (!audioRef.current) return;

    const audio = audioRef.current;

    audio.loop = loop;
    audio.volume = (volume || 60) / 100;
    audio.muted = muted;
  }, [loop, volume, muted]);

  /* ---------------- AUTOPLAY ---------------- */

  useEffect(() => {
    if (!audioRef.current || !autoplay) return;

    const audio = audioRef.current;

    audio
      .play()
      .then(() => {
        setPlaying(true);

        if (fadeIn) {
          audio.volume = 0;

          let v = 0;
          const target = (volume || 60) / 100;

          const interval = setInterval(() => {
            v += 0.05;

            if (v >= target) {
              audio.volume = target;
              clearInterval(interval);
            } else {
              audio.volume = v;
            }
          }, 100);
        }
      })
      .catch(() => setPlaying(false));
  }, [autoplay, src]);

  /* ---------------- PLAY / PAUSE ---------------- */

  const togglePlay = async () => {
    if (!audioRef.current) return;

    const audio = audioRef.current;

    if (audio.paused) {
      await audio.play().catch(() => {});
      setPlaying(true);
    } else {
      if (fadeOut) {
        let v = audio.volume;

        const interval = setInterval(() => {
          v -= 0.05;

          if (v <= 0) {
            audio.pause();
            clearInterval(interval);
            setPlaying(false);
          } else {
            audio.volume = v;
          }
        }, 100);
      } else {
        audio.pause();
        setPlaying(false);
      }
    }
  };

  /* ---------------- MUTE ---------------- */

  const toggleMute = () => {
    if (!allowMute) return;
    setMuted((prev) => !prev);
  };

  return (
    <div
      className={`
        z-[99999] flex items-center justify-end bottom-5 right-5 w-[75px]
        ${
          isLive
            ? "fixed"
            : "sticky -mt-[42px] ml-auto"
        }
      `}
    >
      <div
        className={`
          flex items-center justify-center overflow-hidden
           rounded-[var(--radius-theme)] border border-[var(--accent)]
          bg-[var(--surface-card)]
          px-[10px] py-1
          ${isLive ? "w-full" : "w-auto"}
        `}
      >
        <audio
          ref={audioRef}
          src={src}
          playsInline
          preload="auto"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        />

        {/* ▶ Play / Pause */}
        <button
          onClick={togglePlay}
          className="flex h-8 w-5 cursor-pointer items-center justify-center rounded-[var(--radius-theme)] bg-transparent"
        >
          {playing ? (
            <Pause strokeWidth={1} className="w-4 text-[var(--primary)]" />
          ) : (
            <Play strokeWidth={1} className="w-4 text-[var(--primary)]" />
          )}
        </button>

        {/* 🎵 Wave */}
        <div className="mx-[5px] flex h-4 items-end gap-x-[5px]">
          {[16, 10, 14, 8, 16].map((height, index) => (
            <span
              key={index}
              className={`
                block w-[1.4px] rounded bg-[var(--primary)]
                ${playing ? "animate-wave opacity-100" : "opacity-40"}
              `}
              style={{
                height: `${height}px`,
                animationDelay: `${index * 0.1}s`,
              }}
            />
          ))}
        </div>

        {/* 🔊 Mute */}
        {/* {allowMute && (
          <button
            onClick={toggleMute}
            className="flex h-8 w-5 cursor-pointer items-center justify-center rounded-full bg-transparent"
          >
            {muted ? (
              <VolumeX strokeWidth={1} className="w-4" />
            ) : (
              <Volume strokeWidth={1} className="w-4" />
            )}
          </button>
        )} */}
      </div>
    </div>
  );
};

export default AudioPlayer;