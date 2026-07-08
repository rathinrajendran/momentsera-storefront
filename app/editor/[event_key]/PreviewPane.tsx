"use client";

import { useParams } from "next/navigation";

export default function PreviewPane() {
  const { invite_key, event_key } = useParams();

  return <iframe src={`/${event_key}?preview=true`} className="h-full w-full border-0" />;
}
