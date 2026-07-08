import {
  differenceInCalendarDays,
  isSameDay,
  parseISO,
} from "date-fns";

export type EventFunction = {
  function_key: string;
  start_datetime: string | null;
};

export type EventDateResult = {
  targetDate: Date | null;
  isoDate: string | null;
  daysDiff: number | null;
  message: string | null;
};

export function getEventDate(
  functions?: EventFunction[],
  now: Date = new Date()
): EventDateResult {
  if (!Array.isArray(functions) || functions.length === 0) {
    return {
      targetDate: null,
      isoDate: null,
      daysDiff: null,
      message: null,
    };
  }

  const datedEvents = functions
    .filter(
      (f): f is EventFunction & { start_datetime: string } =>
        !!f.start_datetime
    )
    .sort(
      (a, b) =>
        new Date(a.start_datetime).getTime() -
        new Date(b.start_datetime).getTime()
    );

  if (!datedEvents.length) {
    return {
      targetDate: null,
      isoDate: null,
      daysDiff: null,
      message: null,
    };
  }

  const isoDate = datedEvents[0].start_datetime;
  const targetDate = parseISO(isoDate);
  const diff = differenceInCalendarDays(targetDate, now);

  let message: string;
  if (diff > 0) {
    message = `${diff} day${diff !== 1 ? "s" : ""} to go`;
  } else if (isSameDay(targetDate, now)) {
    message = "Today";
  } else {
    message = `${Math.abs(diff)} day${diff !== 1 ? "s" : ""} ago`;
  }

  return {
    targetDate,
    isoDate,
    daysDiff: diff,
    message,
  };
}


export function toDatetimeLocal(value?: string | null) {
  if (!value) return "";
  const d = new Date(value);
  return d.toISOString().slice(0, 16); // yyyy-MM-ddTHH:mm
}

export function fromDatetimeLocal(value: string) {
  if (!value) return null;
  return new Date(value).toISOString();
}
