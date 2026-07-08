import { EventFunction } from "../types/eventFunction";

export function getPrimaryEvents(functions: unknown): EventFunction[] {
  if (!Array.isArray(functions)) return [];

  // Use a map if you still want to group by unique function keys, 
  // but remove the requirement for start_datetime to exist.
  const map = new Map<string, EventFunction>();

  for (const fn of functions) {
    // ONLY skip if the function is completely empty
    if (!fn?.function_key && !fn?.start_datetime && !fn?.location) continue;

    const existing = map.get(fn.function_key);

    // If no date is set, treat it as 0 for comparison so it doesn't crash
    const newTime = fn.start_datetime ? new Date(fn.start_datetime).getTime() : 0;
    const existingTime = existing?.start_datetime ? new Date(existing.start_datetime).getTime() : Infinity;

    if (!existing || newTime < existingTime) {
      map.set(fn.function_key || `temp-${Math.random()}`, fn);
    }
  }

  return Array.from(map.values()).sort((a, b) => {
    const timeA = a.start_datetime ? new Date(a.start_datetime).getTime() : 0;
    const timeB = b.start_datetime ? new Date(b.start_datetime).getTime() : 0;
    return timeA - timeB;
  });
}