// previewLayerScaling.ts
import { css } from "styled-components";

export const previewLayerScaling = css`
  &.preview {
    container-type: inline-size;
  }

  @container (max-width: 420px) {
    &.preview {
      --layer-xs: clamp(70px, 18cqw, 100px);
      --layer-sm: clamp(110px, 22cqw, 150px);
      --layer-md: clamp(150px, 26cqw, 200px);
      --layer-lg: clamp(190px, 30cqw, 260px);
      --layer-xl: clamp(230px, 34cqw, 320px);
    }
  }

  @container (min-width: 421px) and (max-width: 768px) {
    &.preview {
      --layer-xs: clamp(90px, 16cqw, 120px);
      --layer-sm: clamp(140px, 20cqw, 180px);
      --layer-md: clamp(200px, 24cqw, 260px);
      --layer-lg: clamp(260px, 28cqw, 340px);
      --layer-xl: clamp(320px, 32cqw, 420px);
    }
  }
`;
