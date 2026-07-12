export interface ShareMessageOptions {
  includeUrl?: boolean;
  inviteUrl?: string;
}

export function buildShareMessage(data: any, options: ShareMessageOptions = {}): string {
  const { includeUrl = true, inviteUrl = "" } = options;

  const sharing = data?.sharing ?? {};
  const announcement = data?.announcement ?? {};
  const invite = data?.invite ?? {};

  const brideName = announcement?.bride?.name?.trim() ?? invite?.firstName?.trim() ?? "";

  const groomName = announcement?.groom?.name?.trim() ?? invite?.secondName?.trim() ?? "";

  const schedule = Array.isArray(data?.schedule) ? data.schedule : Object.values(data?.schedule ?? {});

  const primaryFunction = schedule.find((item: any) => item?.isPrimary) ?? schedule[0];

  const lines: string[] = [];

  const shareMessage = sharing.shareMessage?.trim() ?? "You're invited! We can't wait to celebrate with you.";

  if (shareMessage) {
    lines.push(shareMessage);
  }

  if ((sharing.includeCoupleNames ?? true) && (brideName || groomName)) {
    lines.push([brideName, groomName].filter(Boolean).join(" & "));
  }

  if (primaryFunction) {
    if (sharing.includeEventDate ?? true) {
      const rawDate = primaryFunction.date ?? primaryFunction.eventDate;

      if (rawDate) {
        const parsed = new Date(rawDate);

        lines.push(
          !isNaN(parsed.getTime())
            ? parsed.toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : String(rawDate),
        );
      }
    }

    if (sharing.includeEventTime ?? true) {
      const rawTime = primaryFunction.startTime ?? primaryFunction.time;

      if (rawTime) {
        if (typeof rawTime === "string" && (rawTime.includes("T") || !isNaN(Date.parse(rawTime)))) {
          lines.push(
            new Intl.DateTimeFormat("en-IN", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            }).format(new Date(rawTime)),
          );
        } else {
          lines.push(String(rawTime));
        }
      }
    }

    if (sharing.includeVenue ?? true) {
      const venue = primaryFunction.locationName ?? primaryFunction.venue;

      if (venue?.trim()) {
        lines.push(venue.trim());
      }
    }
  }

  if (includeUrl && inviteUrl) {
    lines.push(inviteUrl);
  }

  return lines.join("\n");
}
