// typography.css
import { css } from "styled-components";

export const typographyStyles = css`
  /* ===== Base tokens ===== */
  --h1: 3rem;
  --h2: 2.25rem;
  --h3: 1.75rem;
  --h4: 1.375rem;
  --h5: 1.125rem;
  --h6: 1rem;

  --body-lg: 1.125rem;
  --body: 1rem;
  --body-sm: 0.875rem;
  --caption: 0.75rem;

  /* ===== Tag mapping ===== */
  h1 {
    font-size: var(--h1);
    font-family: var(--font-heading);
  }
  h2 {
    font-size: var(--h2);
    font-family: var(--font-heading);
  }
  h3 {
    font-size: var(--h3);
    font-family: var(--font-heading);
  }
  h4 {
    font-size: var(--h4);
    font-family: var(--font-heading);
  }
  h5 {
    font-size: var(--h5);
    font-family: var(--font-heading);
  }
  h6 {
    font-size: var(--h6);
    font-family: var(--font-heading);
  }

  p:not(data-slot="form-message") {
    font-size: var(--body);
    color: var(--muted);
    font-family: var(--font-heading);
  }
  span {
    font-size: inherit;
    font-family: var(--font-heading);
  }

  .text-lg {
    font-size: var(--body-lg);
  }
  .text-sm {
    font-size: var(--body-sm);
  }
  .caption {
    font-size: var(--caption);
  }
  /* core/typography.css */
`;
