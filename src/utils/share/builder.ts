import { SharePreviewType, type ShareData } from "./types";

export function buildShare(data: any): ShareData {
  const sharing = data?.sharing ?? {};
  const announcement = data?.announcement ?? {};
  const invite = data?.invite ?? {};

  const bride = announcement?.bride?.name?.trim() ?? invite?.firstName?.trim() ?? "";

  const groom = announcement?.groom?.name?.trim() ?? invite?.secondName?.trim() ?? "";

  const couple = [bride, groom].filter(Boolean).join(" & ") || invite?.title || "Wedding Invitation";

  const schedule = Array.isArray(data?.schedule) ? data.schedule : Object.values(data?.schedule ?? {});

  const primaryFunction = schedule.find((item: any) => item?.isPrimary) ?? schedule[0];
  const eventType = invite?.eventType?.trim() || "Wedding";

  const eventTitle = `${eventType} Invitation`;

  const title = couple ? `${couple} | ${eventTitle}` : eventTitle;
  let eventDate = "";
  let eventTime = "";
  let venue = "";

  if (primaryFunction) {
    if (sharing.includeEventDate ?? true) {
      const rawDate = primaryFunction.date ?? primaryFunction.eventDate;

      if (rawDate) {
        const parsed = new Date(rawDate);

        eventDate = !isNaN(parsed.getTime())
          ? parsed.toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })
          : String(rawDate);
      }
    }

    if (sharing.includeEventTime ?? true) {
      const rawTime = primaryFunction.startTime ?? primaryFunction.time;

      if (rawTime) {
        if (typeof rawTime === "string" && (rawTime.includes("T") || !isNaN(Date.parse(rawTime)))) {
          eventTime = new Intl.DateTimeFormat("en-IN", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          }).format(new Date(rawTime));
        } else {
          eventTime = String(rawTime);
        }
      }
    }

    if (sharing.includeVenue ?? true) {
      venue = primaryFunction.locationName ?? primaryFunction.venue ?? "";
    }
  }

  return {
    bride,
    groom,
    couple,

    eventType,
    eventTitle,
    title,

    shareMessage: sharing.shareMessage ?? "You're invited! We can't wait to celebrate with you.",

    eventDate,
    eventTime,
    venue,

    // coverImage: data?.gallery?.coverImage ?? data?.gallery?.cover ?? "",
    // coverImage: data?.gallery?.coverImage ?? data?.gallery?.cover ?? "/images/demo-cover.jpg",
    coverImage: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&q=80",
    // previewType: sharing.previewType ?? SharePreviewType.BASIC,
    previewType: SharePreviewType.LARGE,
  };
}
