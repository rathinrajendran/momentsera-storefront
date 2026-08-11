import { useMemo } from "react";
import { format } from "date-fns";

import photo from "@/assets/images/placeholder/photo.png";

import { resolveMediaUrl } from "../utils/media";
import { themeAnnouncementFields, type AnnouncementField } from "../utils/themeAnnouncementFields";

const FALLBACK_IMAGE = photo.src;

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */

function getValueByPath(object: any, path: string) {
  if (!object || !path) return undefined;

  return path.split(".").reduce((current, key) => current?.[key], object);
}

function setValueByPath(object: Record<string, any>, path: string, value: any) {
  const keys = path.split(".");

  let current = object;

  keys.forEach((key, index) => {
    const isLast = index === keys.length - 1;

    if (isLast) {
      current[key] = value;
      return;
    }

    if (!current[key] || typeof current[key] !== "object") {
      current[key] = {};
    }

    current = current[key];
  });
}

function transformName(name: string, transform?: string) {
  if (!name) return "";

  switch (transform) {
    case "uppercase":
      return name.toUpperCase();

    case "lowercase":
      return name.toLowerCase();

    case "capitalize":
      return name.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());

    default:
      return name;
  }
}

/* ─────────────────────────────────────────────
   DYNAMIC ANNOUNCEMENT FIELDS
───────────────────────────────────────────── */

function resolveAnnouncementFields(announcement: any, themeKey?: string) {
  const fields: AnnouncementField[] = themeKey && themeAnnouncementFields[themeKey] ? themeAnnouncementFields[themeKey] : [];

  const result: Record<string, any> = {};

  for (const field of fields) {
    const value = getValueByPath(announcement, field.key);

    setValueByPath(result, field.key, value ?? "");
  }

  return result;
}

/* ─────────────────────────────────────────────
   MAIN HOOK
───────────────────────────────────────────── */

export function useInviteData(data: any) {
  return useMemo(() => {
    if (!data) {
      return {
        raw: {},
        announcement: {},
        announcementFields: {},

        message: "",

        brideName: "",
        groomName: "",
        firstName: "",
        secondName: "",

        coupleOrder: "bride_first",
        nameTransform: undefined,

        heroImage: FALLBACK_IMAGE,

        formattedDate: null,
        targetDate: null,

        primaryFunction: null,
        eventFunctions: [],

        galleryLayout: "grid",
        galleryUrls: [],

        wishesEnabled: false,
        wishesTitle: "Collected Wishes",
        wishesRaw: {},
      };
    }

    /* ─────────────────────────────────────────
       RAW DATA
    ───────────────────────────────────────── */

    const announcement = data.announcement ?? {};

    const schedule = data.schedule ?? {};

    const gallery = data.gallery ?? {};

    const wishes = data.wishes ?? {};

    /* ─────────────────────────────────────────
       THEME KEY
       
       Supports different possible structures.
    ───────────────────────────────────────── */

    const themeKey =
      data.theme?.key ??
      data.theme?.slug ??
      data.theme?.theme_key ??
      data.template?.key ??
      data.template?.slug ??
      data.template?.theme_key ??
      data.themeKey ??
      data.templateKey;

    /* ─────────────────────────────────────────
       DYNAMIC ANNOUNCEMENT FIELDS
    ───────────────────────────────────────── */

    const announcementFields = resolveAnnouncementFields(announcement, themeKey);

    /* ─────────────────────────────────────────
       FUNCTIONS
    ───────────────────────────────────────── */

    const functionItems = Array.isArray(schedule) ? schedule : Array.isArray(schedule?.items) ? schedule.items : [];

    /* ─────────────────────────────────────────
       HERO IMAGE
    ───────────────────────────────────────── */

    const mainMedia = announcement?.media?.main;

    const heroImageRaw = mainMedia && !mainMedia._deleted && mainMedia.file_url ? mainMedia.file_url : FALLBACK_IMAGE;

    /* ─────────────────────────────────────────
       PRIMARY FUNCTION
    ───────────────────────────────────────── */

    const primaryFunction = functionItems.find((fn: any) => fn?.isPrimary) ?? functionItems[0] ?? null;

    /* ─────────────────────────────────────────
       EVENT DATE
    ───────────────────────────────────────── */

    const targetDate = primaryFunction?.startTime
      ? new Date(primaryFunction.startTime)
      : primaryFunction?.date
        ? new Date(primaryFunction.date)
        : null;

    /* ─────────────────────────────────────────
       COUPLE NAMES
       
       These remain convenience values.
       They don't restrict the dynamic data.
    ───────────────────────────────────────── */

    const nameTransform = announcement?.nameTransform;

    const brideName = transformName(announcement?.bride?.name ?? "", nameTransform);

    const groomName = transformName(announcement?.groom?.name ?? "", nameTransform);

    const coupleOrder = announcement?.coupleOrder ?? "bride_first";

    const firstName = coupleOrder === "groom_first" ? groomName : brideName;

    const secondName = coupleOrder === "groom_first" ? brideName : groomName;

    /* ─────────────────────────────────────────
       GALLERY
    ───────────────────────────────────────── */

    const galleryUrls = Array.isArray(gallery?.items)
      ? gallery.items
          .filter((img: any) => !img?._deleted)
          .map((img: any) => resolveMediaUrl(img?.file_url ?? ""))
          .filter(Boolean)
      : [];

    /* ─────────────────────────────────────────
       RETURN
       
       IMPORTANT:
       `raw` preserves EVERYTHING from API.
       Nothing gets lost just because a theme
       has additional fields.
    ───────────────────────────────────────── */

    return {
      /* ─────────────────────────────────────
         COMPLETE RAW DATA
      ───────────────────────────────────── */

      raw: data,

      /* ─────────────────────────────────────
         COMPLETE ANNOUNCEMENT
      ───────────────────────────────────── */

      announcement,

      /*
       * Only fields defined by the current
       * theme configuration.
       *
       * Example Luna:
       *
       * announcementFields.couple.monogram
       * announcementFields.couple.familyLabel
       * announcementFields.announcement.title
       * announcementFields.bride.name
       * announcementFields.groom.name
       * announcementFields.announcement.message
       */
      announcementFields,

      /* Current theme */
      themeKey,

      /* ─────────────────────────────────────
         MESSAGE
         
         Supports both:
         announcement.message
         announcement.announcement.message
      ───────────────────────────────────── */

      message: announcement?.message ?? announcement?.announcement?.message ?? "",

      /* ─────────────────────────────────────
         COMMON COUPLE VALUES
      ───────────────────────────────────── */

      brideName,

      groomName,

      firstName,

      secondName,

      coupleOrder,

      nameTransform,

      /* ─────────────────────────────────────
         HERO
      ───────────────────────────────────── */

      heroImage: resolveMediaUrl(heroImageRaw),

      /* ─────────────────────────────────────
         DATE
      ───────────────────────────────────── */

      formattedDate: targetDate
        ? `${format(targetDate, "dd")} ${format(targetDate, "MMMM").toUpperCase()} ${format(targetDate, "yyyy")}`
        : null,

      targetDate,

      /* ─────────────────────────────────────
         FUNCTIONS
      ───────────────────────────────────── */

      primaryFunction,

      eventFunctions: functionItems,

      /* ─────────────────────────────────────
         GALLERY
      ───────────────────────────────────── */

      galleryLayout: gallery?.layout ?? "grid",

      galleryUrls,

      gallery,

      /* ─────────────────────────────────────
         WISHES
      ───────────────────────────────────── */

      wishesEnabled: Boolean(wishes?.enabled),

      wishesTitle: wishes?.title ?? "Collected Wishes",

      wishesRaw: wishes,

      /* ─────────────────────────────────────
         COMPLETE SECTIONS
         
         Useful when themes have additional
         sections later.
      ───────────────────────────────────── */

      schedule,

      wishes,

      /* ─────────────────────────────────────
         EVERYTHING ELSE
         
         Keeps future dynamic sections/data
         accessible without changing this hook.
      ───────────────────────────────────── */

      ...data,
    };
  }, [data]);
}
