"use client";

import { useMemo } from "react";
import { Pen, Share2 } from "lucide-react";

import { DeviceType } from "./EditorLayout";
import { DeviceSwitcher } from "./DeviceSwitcher";
import { ShareDialog } from "./components/publish/ShareDialog";
import { PublishButton } from "./components/publish/PublishButton";
import { CustomizeDialog } from "./components/publish/CustomizeDialog";
import { usePreviewDraft } from "./PreviewDraftContext";

type Props = {
  inviteUrl: string;
  onInviteUrlChange: (value: string) => void;
  device: DeviceType;
  onDeviceChange: (device: DeviceType) => void;
};

export function safeDecode(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function PreviewToolbar({ inviteUrl, onInviteUrlChange, device, onDeviceChange }: Props) {
  const { draft } = usePreviewDraft();

console.log("draft 111", draft);


  const { invite, announcement, schedule } = draft;
  const displayInviteUrl = useMemo(() => safeDecode(inviteUrl), [inviteUrl]);
  const getLiveUrl = () => `${window.location.origin}/${inviteUrl}`;
  const primaryFunction = useMemo(() => schedule?.find((item: any) => item.isPrimary), [schedule]);
  const coupleOrder = announcement?.coupleOrder ?? "bride_first";
  const firstName = coupleOrder === "groom_first" ? announcement?.groom?.name : announcement?.bride?.name;
  const secondName = coupleOrder === "groom_first" ? announcement?.bride?.name : announcement?.groom?.name;
  const inviteData = useMemo(
    () => ({
      id: invite?.id,
      eventKey: invite?.event_key,
      eventType: invite?.event_type,
      year: primaryFunction?.date ? new Date(primaryFunction.date).getFullYear() : undefined,
      firstName,
      secondName,
    }),
    [invite, firstName, secondName, primaryFunction],
  );

  return (
    <div className="sticky top-0 z-10 flex h-[50px] items-center justify-between gap-3 border-b bg-white px-4">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <div className="flex min-w-0 items-center text-xs">
          <span className="truncate font-medium" title={displayInviteUrl}>
            localhost:3000/{displayInviteUrl}
          </span>
        </div>
        <CustomizeDialog inviteUrl={inviteUrl} onInviteUrlChange={onInviteUrlChange} inviteData={inviteData}>
          <button
            type="button"
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md transition hover:bg-slate-100"
            aria-label="Edit invite URL"
          >
            <Pen size={15} strokeWidth={1.75} />
          </button>
        </CustomizeDialog>
        <ShareDialog
          url={displayInviteUrl}
          status={invite.status}
          paymentStatus={invite.payment_status}
          displayInviteUrl={displayInviteUrl}
        >
          <button
            type="button"
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md transition hover:bg-slate-100"
            aria-label="Share invitation"
          >
            <Share2 size={15} strokeWidth={1.75} />
          </button>
        </ShareDialog>
      </div>
      <PublishButton className="block md:hidden" />
      <DeviceSwitcher device={device} onChange={onDeviceChange} className="hidden md:flex" />
    </div>
  );
}
