import { css } from "styled-components";

export const previewTypographyScaling = css`
  &.preview {
    container-type: inline-size;
  }

  /* Mobile */
  @container (max-width: 420px) {
    &.preview {
      --h1: clamp(2rem, 6cqw, 2.4rem);
      --h2: clamp(1.6rem, 5cqw, 2rem);
      --h3: 1.25rem;
      --body: 0.9rem;
      .ab-layer {
        width: 100px;
      }
    }
  }

  /* Tablet */
  @container (min-width: 421px) and (max-width: 768px) {
    &.preview {
      --h1: clamp(2.6rem, 5cqw, 3.2rem);
      --h2: 2rem;
      --body: 0.95rem;
    }
  }

  /* Desktop */
  @container (min-width: 769px) {
    &.preview {
      --h1: clamp(3rem, 4cqw, 4.5rem);
    }
  }
`;
