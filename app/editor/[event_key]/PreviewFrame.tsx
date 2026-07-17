"use client";

import { memo, useRef, useState } from "react";

import { DeviceType } from "./EditorLayout";
import { usePreviewDraft } from "./PreviewDraftContext";
import { useIframeDraftSync } from "../../../hooks/useIframeDraftSync";
import { usePreviewScale } from "../../../hooks/usePreviewScale";
import { PublishButton } from "./components/publish/PublishButton";

type Props = {
  previewUrl: string;
  device: DeviceType;
  splitScreen: boolean;
};

function PreviewFrameComponent({ previewUrl, device, splitScreen }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const { draft } = usePreviewDraft();  
  const { currentViewport, scale, previewSize } = usePreviewScale(device, splitScreen);
  useIframeDraftSync({
    iframeRef,
    enabled: iframeLoaded,
    draft,
  });

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 bg-gray-100 p-4">
      <div className="overflow-hidden rounded-[20px] bg-white shadow-[0_0_0_8px_#ffffff]" style={previewSize}>
        <iframe
          ref={iframeRef}
          src={previewUrl}
          loading="eager"
          allow="clipboard-write"
          onLoad={() => setIframeLoaded(true)}
          className="h-full w-full border-0"
          style={{
            width: currentViewport.width,
            height: currentViewport.height,
            transform: device === "mobile" ? `scale(${scale})` : undefined,
            transformOrigin: "top left",
          }}
        />
      </div>
      <div className="hidden justify-center md:flex">
        <PublishButton />
      </div>
    </div>
  );
}

export const PreviewFrame = memo(PreviewFrameComponent);
