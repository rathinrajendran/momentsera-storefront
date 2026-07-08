"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import WaveSurfer from "wavesurfer.js";
import { WaveButton, Waveform, WaveWrapper } from "./WaveformPlayerStyles";

interface WaveformPlayerProps {
  src: string;
  autoplay?: boolean;
  canAutoplay?: boolean;
  allowMute?: boolean;
}

const WaveformPlayer = ({
  src,
  autoplay = false,
  canAutoplay = false,
  allowMute = true,
}: WaveformPlayerProps) => {
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);

  const [playing, setPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    if (!waveformRef.current || !src) return;

    const ws = WaveSurfer.create({
      container: waveformRef.current,
      backend: "MediaElement",
      waveColor: "#ffffff",
      progressColor: "#DCEDC8",
      cursorColor: "transparent",
      barWidth: 1.5,
      barRadius: 3,
      height: 25,
      normalize: true,
    });

    wavesurferRef.current = ws;
    ws.load(src);

    const onReady = () => {
      setIsReady(true);

      // ✅ SAFE autoplay (only after user interaction)
      if (autoplay && canAutoplay) {
        ws.play().catch(() => {});
      }
    };

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);

    ws.on("ready", onReady);
    ws.on("play", onPlay);
    ws.on("pause", onPause);
    ws.on("finish", onPause);

    return () => {
      ws.un("ready", onReady);
      ws.un("play", onPlay);
      ws.un("pause", onPause);
      ws.un("finish", onPause);

      ws.destroy();
      wavesurferRef.current = null;
      setIsReady(false);
      setPlaying(false);
    };
  }, [src, autoplay, canAutoplay]);

  const togglePlay = useCallback(() => {
    if (!isReady || !wavesurferRef.current) return;
    wavesurferRef.current.playPause();
  }, [isReady]);

  const toggleMute = useCallback(() => {
    if (!allowMute || !wavesurferRef.current) return;

    const next = !muted;
    wavesurferRef.current.setVolume(next ? 0 : 1);
    setMuted(next);
  }, [muted, allowMute]);

  return (
    <WaveWrapper>
      <Waveform ref={waveformRef} />

      <div className="flex items-center gap-2">
        <WaveButton
          onClick={togglePlay}
          disabled={!isReady}
          style={{ opacity: isReady ? 1 : 0.5 }}
        >
          {playing ? "❚❚" : "▶"}
        </WaveButton>

        {allowMute && (
          <WaveButton
            onClick={toggleMute}
            disabled={!isReady}
            style={{ opacity: isReady ? 1 : 0.5 }}
          >
            {muted ? "🔇" : "🔊"}
          </WaveButton>
        )}
      </div>
    </WaveWrapper>
  );
};

export default WaveformPlayer;
