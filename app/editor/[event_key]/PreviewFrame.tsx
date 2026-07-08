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

  console.log("draft 212121", draft);
  
  const { currentViewport, scale, previewSize } = usePreviewScale(device, splitScreen);
  useIframeDraftSync({
    iframeRef,
    enabled: iframeLoaded,
    draft,
  });

  return (
    <div className="flex flex-col gap-4 items-center justify-center bg-gray-100 p-4 h-full">
      <div className="overflow-hidden rounded-[20px] bg-white shadow-lg" style={previewSize}>
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
      <div className="flex justify-center">
      <PublishButton />
      </div>
    </div>
  );
}

export const PreviewFrame = memo(PreviewFrameComponent);
