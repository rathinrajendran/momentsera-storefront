// publicLayerScaling.ts
import { css } from "styled-components";

export const publicLayerScaling = css`
  @media (max-width: 420px) {
    --layer-xs: 80px;
    --layer-sm: 120px;
    --layer-md: 180px;
    --layer-lg: 240px;
    --layer-xl: 300px;
  }

  @media (min-width: 421px) and (max-width: 768px) {
    --layer-xs: 100px;
    --layer-sm: 160px;
    --layer-md: 220px;
    --layer-lg: 300px;
    --layer-xl: 380px;
  }
`;
