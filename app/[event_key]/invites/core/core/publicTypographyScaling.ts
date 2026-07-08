import { css } from "styled-components";

export const publicTypographyScaling = css`
  /* =========================
     MOBILE (≤ 420px)
  ========================= */
  @media (max-width: 420px) {
    --h1: clamp(2.2rem, 7vw, 2.6rem);
    --h2: clamp(1.7rem, 5.5vw, 2.1rem);
    --h3: 1.4rem;
    --h4: 1.15rem;
    --h5: 1.05rem;
    --h6: 1rem;

    --body-lg: 1rem;
    --body: 0.95rem;
    --body-sm: 0.85rem;
    --caption: 0.75rem;
  }

  /* =========================
     TABLET (421px – 768px)
  ========================= */
  @media (min-width: 421px) and (max-width: 768px) {
    --h1: clamp(2.8rem, 6vw, 3.4rem);
    --h2: clamp(2.1rem, 4.5vw, 2.5rem);
    --h3: 1.7rem;
    --h4: 1.35rem;
    --h5: 1.15rem;
    --h6: 1rem;

    --body-lg: 1.05rem;
    --body: 1rem;
    --body-sm: 0.9rem;
    --caption: 0.75rem;
  }

  /* =========================
     DESKTOP (≥ 769px)
  ========================= */
  @media (min-width: 769px) {
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
  }
`;
