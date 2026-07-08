// hooks/useAuraData.ts
import { useMemo } from "react";
import { format } from "date-fns";
import photo from "@/assets/images/placeholder/photo.png";
import { getEventDate } from "../utils/getEventDate";
import { resolveMediaUrl } from "../utils/media";

const FALLBACK_IMAGE = photo.src;

export function useData(data: any) {
  return useMemo(() => {
    const { announcement, schedule, gallery, wishes } = data || {};

    // Banner & Hero Data
    const mainMedia = announcement?.media?.main;
    const heroImageRaw = mainMedia && !mainMedia._deleted && mainMedia.file_url 
      ? mainMedia.file_url 
      : FALLBACK_IMAGE;

    // Date Logic
    const { targetDate } = getEventDate(schedule);

    return {
      // Banner props
      message: announcement?.message,
      brideName: announcement?.bride?.name ?? "Bride",
      groomName: announcement?.groom?.name ?? "Groom",
      nameTransform: announcement?.nameTransform,
      coupleOrder: announcement?.coupleOrder,
      heroImage: resolveMediaUrl(heroImageRaw),
      formattedDate: targetDate ? format(targetDate, "MM.dd.yyyy") : null,

      // Gallery props
      galleryLayout: gallery?.layout || "grid",
      galleryUrls: (gallery?.items ?? []).map((img: any) => resolveMediaUrl(img?.file_url ?? "")).filter(Boolean),

      // Wishes & Functions
      wishesEnabled: Boolean(wishes?.enabled),
      wishesTitle: wishes?.title,
      eventFunctions: schedule ?? [],

      // Raw references if needed
      wishesRaw: wishes,
    };
  }, [data]);
}