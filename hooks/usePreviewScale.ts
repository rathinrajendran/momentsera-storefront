import { useMemo } from "react";

const VIEWPORTS = {
  mobile: {
    width: 320,
    height: 560,
  },
};

export function usePreviewScale(device: "mobile" | "desktop", splitScreen: boolean) {
  const scale = useMemo(() => {
    if (device === "desktop") return 1;
    return splitScreen ? 0.65 : 0.9;
  }, [device, splitScreen]);

  const currentViewport = useMemo(() => {
    if (device === "desktop") {
      return {
        width: "100%",
        height: "100%",
      };
    }

    return VIEWPORTS.mobile;
  }, [device]);

  const previewSize = useMemo(() => {
    if (device === "desktop") {
      return {
        width: "100%",
        maxWidth: splitScreen ? "1100px" : "1024px",
        maxHeight: splitScreen ? "1100px" : "calc(100dvh - 225px)",
        aspectRatio: "16 / 9",
      };
    }

    return {
      width: VIEWPORTS.mobile.width * scale,
      height: VIEWPORTS.mobile.height * scale,
    };
  }, [device, splitScreen, scale]);

  return {
    currentViewport,
    scale,
    previewSize,
  };
}
