"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { drawImageToCanvas, loadImage } from "../../../../../utils/canvasImage";

type CanvasImageProps = {
  src: string;
  className?: string;
  objectFit?: "cover" | "contain";
  disableRightClick?: boolean;
};

export function CanvasImage({ src, className, objectFit = "cover", disableRightClick = true }: CanvasImageProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [error, setError] = useState(false);

  const safeSrc = useMemo(() => src?.trim() ?? "", [src]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        setError(false);

        if (!wrapRef.current || !canvasRef.current || !safeSrc) return;

        const wrapper = wrapRef.current;
        const canvas = canvasRef.current;

        // get wrapper size
        const rect = wrapper.getBoundingClientRect();
        const w = Math.max(1, Math.round(rect.width));
        const h = Math.max(1, Math.round(rect.height));

        // set canvas size (real pixels)
        const dpr = window.devicePixelRatio || 1;
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);

        // set display size
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // scale for DPR
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const img = await loadImage(safeSrc);
        if (cancelled) return;

        // IMPORTANT:
        // our draw function expects canvas.width/height in px,
        // but we scaled transform, so we pass a fake canvas size.
        // easiest: create a temp canvas reference:
        const temp = document.createElement("canvas");
        temp.width = w;
        temp.height = h;

        // draw into a temp canvas (w,h)
        const tempCtx = temp.getContext("2d");
        if (!tempCtx) return;

        // use existing logic
        drawImageToCanvas(temp, img, { objectFit });

        // then draw temp onto real canvas
        ctx.clearRect(0, 0, w, h);
        ctx.drawImage(temp, 0, 0, w, h);
      } catch (e) {
        if (!cancelled) setError(true);
      }
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [safeSrc, objectFit]);

  // resize redraw
  useEffect(() => {
    if (!wrapRef.current) return;

    const ro = new ResizeObserver(() => {
      // trigger redraw by changing state (simple way)
      // but no need, because src is same.
      // So we just dispatch a small re-render:
      setError((x) => x);
    });

    ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={wrapRef}
      className={className}
      style={{ position: "relative", overflow: "hidden" }}
      onContextMenu={disableRightClick ? (e) => e.preventDefault() : undefined}
    >
      <canvas ref={canvasRef} className="block h-full w-full" style={{ display: "block" }} />

      {error && <div className="absolute inset-0 grid place-items-center text-xs opacity-70">Image failed</div>}
    </div>
  );
}
