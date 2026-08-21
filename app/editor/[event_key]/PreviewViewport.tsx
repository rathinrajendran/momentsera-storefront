"use client";

import Catalog from "../../[event_key]/invites/catalog/page";
import { DeviceType } from "./EditorLayout";
import { usePreviewDraft } from "./PreviewDraftContext";

const DEVICE_CONFIG = {
  desktop: { width: 1280, scale: 1 },
  mobile: { width: 375, scale: 1 },
};

export default function PreviewViewport({ device, splitScreen }: { device: DeviceType; splitScreen: boolean }) {
  const { width, scale } = DEVICE_CONFIG[device];
  const { draft } = usePreviewDraft();
  if (!draft) return null;


  return (
    <div className="flex justify-center px-4">
      <div className="flex hidden justify-center overflow-hidden rounded-xl">
        <div
          style={{
            width: splitScreen ? "auto" : width,
            transform: `scale(${scale})`,
            transformOrigin: "top center",
          }}
          className={`${splitScreen ? "mt-[18px] aspect-[11/16] h-[60dvh] scale-90" : "h-[calc(100dvh-180px)] md:h-[calc(100vh-125px)]"} overflow-auto rounded-xl border border-[#cfd8dc] shadow-lg [&::-webkit-scrollbar]:h-0 [&::-webkit-scrollbar]:w-[0px] [&::-webkit-scrollbar-thumb]:rounded-[10px] [&::-webkit-scrollbar-thumb]:bg-[#c1c1c1] [&::-webkit-scrollbar-track]:rounded-[10px] [&::-webkit-scrollbar-track]:bg-[#78909C]`}
        >
          <Catalog
            data={{
              invite: draft.invite,
              template: draft.template,
              announcement: draft.announcement,
              schedule: draft.schedule,
              ourStory: draft.ourStory,
              timeline: draft.timeline,
              gallery: draft.gallery,
              dressCode: draft.dressCode,
              wishes: draft.wishes,
              rsvp: draft.rsvp,
              music: draft.music,
            }}
            design={{
              color: draft.color,
              font: draft.font,
              shape: draft.shape,
              motion: draft.motion,
            }}
            settings={{
              privacy: draft.privacy,
              sharing: draft.sharing,
              print: draft.print,
              settings: draft.settings,
            }}
            eventKey={draft.invite.event_key}
          />
        </div>
      </div>
    </div>
  );
}
