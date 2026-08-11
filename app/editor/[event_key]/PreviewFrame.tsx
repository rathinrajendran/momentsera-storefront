"use client";

import { memo, useEffect, useRef, useState } from "react";
import { DeviceType } from "./EditorLayout";
import { usePreviewDraft } from "./PreviewDraftContext";
import { useIframeDraftSync } from "../../../hooks/useIframeDraftSync";
import { usePreviewScale } from "../../../hooks/usePreviewScale";

type Props = {
  previewUrl: string;
  device: DeviceType;
  splitScreen: boolean;
};

function PreviewFrameComponent({
  previewUrl,
  device,
  splitScreen,
}: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  const { draft } = usePreviewDraft();

  const {
    currentViewport,
    scale,
    previewSize,
  } = usePreviewScale(device, splitScreen);

  /*
   * Reset the iframe state whenever the preview URL changes.
   */
  useEffect(() => {
    setIframeLoaded(false);
  }, [previewUrl]);

  /*
   * Send the CURRENT draft as soon as the iframe has loaded.
   *
   * This is important for live editing:
   *
   * BackgroundEditor
   *      ↓
   * PreviewDraftContext
   *      ↓
   * draft changes
   *      ↓
   * useIframeDraftSync
   *      ↓
   * PreviewClient
   *      ↓
   * Catalog
   */
  useIframeDraftSync({
    iframeRef,
    enabled: iframeLoaded,
    draft,
  });

  return (
    <div className="flex h-full flex-1 items-center justify-center bg-gray-100">
      <div
        className="overflow-hidden rounded-[20px] bg-white shadow-lg"
        style={previewSize}
      >
        <iframe
          key={previewUrl}
          ref={iframeRef}
          src={previewUrl}
          loading="eager"
          allow="clipboard-write"
          onLoad={() => setIframeLoaded(true)}
          className="h-full w-full border-0"
          style={{
            width: currentViewport.width,
            height: currentViewport.height,
            transform:
              device === "mobile"
                ? `scale(${scale})`
                : undefined,
            transformOrigin: "top left",
          }}
        />
      </div>
    </div>
  );
}

export const PreviewFrame = memo(PreviewFrameComponent);