"use client";

import styled from "styled-components";
import { baseThemeStyles } from "../core/baseStyles.css";
import { typographyStyles } from "../core/typography.css";
import { previewTypographyScaling } from "../core/previewTokens.css";
import { publicTypographyScaling } from "../core/publicTypographyScaling";
import { previewLayerScaling } from "../core/previewLayerScaling";
import { publicLayerScaling } from "../core/publicLayerScaling";

export const ThemeWrapper = styled.main`
  position: relative;
  ${baseThemeStyles}
  ${typographyStyles}
  ${publicTypographyScaling}
  ${previewTypographyScaling}
  ${publicLayerScaling}
  ${previewLayerScaling}
`;
