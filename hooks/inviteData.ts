// hooks/useAuraData.ts
import { useMemo } from "react";
import { format } from "date-fns";
import photo from "@/assets/images/placeholder/photo.png";
import { getEventDate } from "../utils/getEventDate";
import { resolveMediaUrl } from "../utils/media";

const FALLBACK_IMAGE = photo.src;

export function useInviteData(data: any) {
  return useMemo(() => {
    const { announcement, schedule, gallery, wishes } = data || {};

    // 1. Process Hero Media
    const mainMedia = announcement?.media?.main;
    const heroImageRaw = mainMedia && !mainMedia._deleted && mainMedia.file_url 
      ? mainMedia.file_url 
      : FALLBACK_IMAGE;

    // 2. Process Dates
    const { targetDate } = getEventDate(schedule);

    // 3. Process Gallery (with filtration for performance)
    const galleryUrls = (gallery?.items ?? [])
      .map((img: any) => resolveMediaUrl(img?.file_url ?? ""))
      .filter(Boolean);

    return {
      // Banner & Hero
      message: announcement?.message,
      brideName: announcement?.bride?.name ?? "Bride",
      groomName: announcement?.groom?.name ?? "Groom",
      nameTransform: announcement?.nameTransform,
      coupleOrder: announcement?.coupleOrder,
      heroImage: resolveMediaUrl(heroImageRaw),
      formattedDate: targetDate ? format(targetDate, "MM.dd.yyyy") : null,

      // Gallery Logic
      galleryLayout: gallery?.layout || "grid",
      galleryUrls,

      // Events & Functions
      eventFunctions: schedule ?? [],

      // Wishes Configuration
      wishesEnabled: Boolean(wishes?.enabled),
      wishesTitle: wishes?.title ?? "Collected Wishes",
      wishesRaw: wishes,
    };
  }, [data]); // Only re-calculates if data object reference changes[cite: 1]
}