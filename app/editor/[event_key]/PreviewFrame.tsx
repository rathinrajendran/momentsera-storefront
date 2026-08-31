"use client";

import { memo, useRef, useState } from "react";
import { DeviceType } from "./EditorLayout";
import { usePreviewDraft } from "./PreviewDraftContext";
import { useIframeDraftSync } from "../../../hooks/useIframeDraftSync";
import { usePreviewScale } from "../../../hooks/usePreviewScale";

type Props = {
  previewUrl: string;
  device: DeviceType;
  splitScreen: boolean;
};

function PreviewFrameComponent({ previewUrl, device, splitScreen }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loadedPreviewUrl, setLoadedPreviewUrl] = useState<string | null>(null);

  const { draft } = usePreviewDraft();

  const { currentViewport, scale, previewSize } = usePreviewScale(device, splitScreen);

  const iframeLoaded = loadedPreviewUrl === previewUrl;

  useIframeDraftSync({
    iframeRef,
    enabled: iframeLoaded,
    draft,
  });

  return (
    <div className="flex h-full flex-1 items-center justify-center">
      <div className="relative overflow-hidden rounded-[20px] bg-white shadow-[0_0_0_9px_#ffffff]" style={previewSize}>
        {/* Loader */}
        {!iframeLoaded && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-neutral-200 border-t-neutral-800" />

              <span className="text-xs font-medium tracking-wide text-neutral-500">Loading invite…</span>
            </div>
          </div>
        )}

        <iframe
          key={previewUrl}
          ref={iframeRef}
          src={previewUrl}
          loading="eager"
          allow="clipboard-write"
          onLoad={() => setLoadedPreviewUrl(previewUrl)}
          className="h-full w-full border-0"
          style={{
            width: currentViewport.width,
            height: currentViewport.height,
            transform: device === "mobile" ? `scale(${scale})` : undefined,
            transformOrigin: "top left",
          }}
        />
      </div>
    </div>
  );
}

export const PreviewFrame = memo(PreviewFrameComponent);
