const MEDIA_BASE = (process.env.NEXT_PUBLIC_MEDIA ?? "").replace(/\/$/, "");

export function resolveMediaUrl(url?: string) {
  if (!url || typeof url !== "string") return "";

  const clean = url.trim();
  if (!clean) return "";

  // 1) already full url
  if (clean.startsWith("http://") || clean.startsWith("https://")) return clean;

  // 2) next static
  if (clean.startsWith("/_next")) return clean;

  // 3) backend uploads
  // case: "/uploads/gallery/..."
  if (clean.startsWith("/uploads")) {
    return MEDIA_BASE ? `${MEDIA_BASE}${clean}` : clean;
  }

  // case: "uploads/gallery/..."
  if (clean.startsWith("uploads")) {
    return MEDIA_BASE ? `${MEDIA_BASE}/${clean}` : `/${clean}`;
  }

  // 4) other relative paths
  // case: "/something"
  if (clean.startsWith("/")) return clean;

  // case: "something"
  return clean;
}