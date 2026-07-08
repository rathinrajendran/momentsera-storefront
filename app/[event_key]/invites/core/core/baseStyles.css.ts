import { css } from "styled-components";
import { typographyBaseTokens } from "./themeTokens";

export const baseThemeStyles = css`
  position: relative;

  background: var(--bg);
  color: var(--text);
  font-family: var(--font-body);

  /* Typography tokens */
  --h1: ${typographyBaseTokens.h1};
  --h2: ${typographyBaseTokens.h2};
  --h3: ${typographyBaseTokens.h3};
  --h4: ${typographyBaseTokens.h4};
  --h5: ${typographyBaseTokens.h5};
  --h6: ${typographyBaseTokens.h6};

  --body-lg: ${typographyBaseTokens.bodyLg};
  --body: ${typographyBaseTokens.body};
  --body-sm: ${typographyBaseTokens.bodySm};
  --caption: ${typographyBaseTokens.caption};
`;
