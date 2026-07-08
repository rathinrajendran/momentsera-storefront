import { useMemo } from "react";
import { format } from "date-fns";
import photo from "@/assets/images/placeholder/photo.png";
import { resolveMediaUrl } from "../utils/media";

const FALLBACK_IMAGE = photo.src;

export function useInviteData(data: any) {
  return useMemo(() => {
    const { announcement, schedule, gallery, wishes } = data || {};
    const transformName = (name: string, transform?: string) => {
      if (!name) return "";

      switch (transform) {
        case "uppercase":
          return name.toUpperCase();
        case "lowercase":
          return name.toLowerCase();
        case "capitalize":
          return name
            .toLowerCase()
            .replace(/\b\w/g, (char) => char.toUpperCase());
        default:
          return name;
      }
    };

    /* Normalize functions */
    const functionItems = Array.isArray(schedule)
      ? schedule
      : schedule?.items || [];

    /* Main banner image */
    const mainMedia = announcement?.media?.main;
    const heroImageRaw =
      mainMedia && !mainMedia._deleted && mainMedia.file_url
        ? mainMedia.file_url
        : FALLBACK_IMAGE;

    /* Primary function */
    const primaryFunction =
      functionItems.find((fn: any) => fn?.isPrimary) || functionItems[0];

    /* Event date */
    const targetDate = primaryFunction?.startTime
      ? new Date(primaryFunction.startTime)
      : primaryFunction?.date
        ? new Date(primaryFunction.date)
        : null;

    /* Couple names */
    const brideName = transformName(announcement?.bride?.name ?? "Bride", announcement?.nameTransform);

    const groomName = transformName(announcement?.groom?.name ?? "Groom", announcement?.nameTransform);

    const coupleOrder = announcement?.coupleOrder ?? "bride_first";
    const firstName = coupleOrder === "groom_first" ? groomName : brideName;
    const secondName = coupleOrder === "groom_first" ? brideName : groomName;

    /* Gallery */
    const galleryUrls = (gallery?.items || [])
      .filter((img: any) => !img?._deleted)
      .map((img: any) => resolveMediaUrl(img?.file_url ?? ""))
      .filter(Boolean);

    return {
      /* Message */
      message: announcement?.message ?? "",

      /* Couple names */
      brideName,
      groomName,
      firstName,
      secondName,
      coupleOrder,
      nameTransform: announcement?.nameTransform,

      /* Hero image */
      heroImage: resolveMediaUrl(heroImageRaw),

      /* Date */
      formattedDate: targetDate
        ? `${format(targetDate, "dd")} ${format(targetDate, "MMMM").toUpperCase()} ${format(targetDate, "yyyy")}`
        : null,
      targetDate,

      /* Functions */
      primaryFunction,
      eventFunctions: functionItems,

      /* Gallery */
      galleryLayout: gallery?.layout ?? "grid",
      galleryUrls,

      /* Wishes */
      wishesEnabled: Boolean(wishes?.enabled),
      wishesTitle: wishes?.title ?? "Collected Wishes",
      wishesRaw: wishes ?? {},
    };
  }, [data]);
}
