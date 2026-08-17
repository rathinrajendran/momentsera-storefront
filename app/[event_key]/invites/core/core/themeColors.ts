export const THEME_COLORS = {
  page: "var(--bg-primary, #f8f3eb)",
  paper: "var(--bg-secondary, #fcf8f1)",
  burgundy: "var(--accent, var(--text-primary, #5b1117))",
  burgundy2: "var(--color-accent, #74171e)",
  gold: "var(--accent, #a17b50)",
  text: "var(--text-primary, #3f302a)",
  muted: "var(--text-secondary, #8c7b6e)",
  line: "color-mix(in srgb, var(--text-primary, #3f302a) 14%, transparent)",
  dark: "color-mix(in srgb, var(--color-accent, #5b1117) 92%, #000 8%)",
} as const;
