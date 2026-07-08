// app/[event_key]/EventClient.tsx
"use client";

export default function EventClient({ data }: { data: any }) {
  return <h1>{data.event.event_key}</h1>;
}
