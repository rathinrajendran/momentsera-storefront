"use client";

import { useRouter } from "next/navigation";
import { useDrafts } from "../../../hooks/useDraft";

export default function MyInvites() {
  const router = useRouter();
  const { data: drafts = [] } = useDrafts();
  // const { data: events = [] } = useEvents();

  return (
    <div>
      <h1>My Designs</h1>

      <h2>Drafts</h2>
      {drafts.map((d: any) => (
        <div key={d.id}>
          {d.type} – {d.invite_key}
          <button
            onClick={() => {
              localStorage.setItem("active_draft_id", d.id);
              router.push(`/drafts/${d.id}/edit`);
            }}
          >
            Continue Editing
          </button>
        </div>
      ))}

      <h2>Published</h2>
      {/* {events.map((e: any) => (
        <div key={e.id}>
          {e.event_type} – {e.invite_key}
          <button onClick={() => router.push(`/invites/${e.invite_key}/${e.event_key}`)}>Edit</button>
        </div>
      ))} */}
    </div>
  );
}
