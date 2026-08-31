"use client";

import { useMemo } from "react";
import { Eye, Pen, Share2 } from "lucide-react";
import { DeviceType } from "./EditorLayout";
import { DeviceSwitcher } from "./DeviceSwitcher";
import { ShareDialog } from "./components/publish/ShareDialog";
import { PublishButton } from "./components/publish/PublishButton";
import { CustomizeDialog } from "./components/publish/CustomizeDialog";
import { usePreviewDraft } from "./PreviewDraftContext";
import { Button } from "@/components/ui/button";

type Props = {
  inviteUrl: string;
  onInviteUrlChange: (value: string) => void;
  device: DeviceType;
  onDeviceChange: (device: DeviceType) => void;
  className: string;
  shareDialogOpen: boolean;
  onShareDialogOpenChange: (open: boolean) => void;

  customizeDialogOpen: boolean;
  onCustomizeDialogOpenChange: (open: boolean) => void;
};

export function safeDecode(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function PreviewToolbar({
  inviteUrl,
  onInviteUrlChange,
  device,
  onDeviceChange,
  className,
  shareDialogOpen,
  onShareDialogOpenChange,
  customizeDialogOpen,
  onCustomizeDialogOpenChange,
}: Props) {
  const { draft } = usePreviewDraft();
  const { invite, announcement, schedule } = draft;
  const displayInviteUrl = useMemo(() => safeDecode(inviteUrl), [inviteUrl]);
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
  const handlePreview = () => {
    window.open(`/preview/${invite?.event_key}`, "_blank");
  };

  return (
    <div className={`${className} absolute bottom-[20px] left-1/2 z-10 flex -translate-x-1/2 items-center gap-3`}>
      <DeviceSwitcher device={device} onChange={onDeviceChange} className="hidden gap-1 rounded-md bg-[#ffffff] p-1 md:flex" />
      <div className="flex h-full items-center gap-1 rounded-md bg-[#ffffff] p-1">
        <CustomizeDialog
          open={customizeDialogOpen}
          onOpenChange={onCustomizeDialogOpenChange}
          inviteUrl={inviteUrl}
          onInviteUrlChange={onInviteUrlChange}
          inviteData={inviteData}
        >
          <button
            type="button"
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-md hover:bg-[#eaeef2]"
            aria-label="Edit invite URL"
          >
            <Pen className="w-[15px]" strokeWidth={0.9} stroke="#000000" />
          </button>
        </CustomizeDialog>
        <ShareDialog
          open={shareDialogOpen}
          onOpenChange={onShareDialogOpenChange}
          url={displayInviteUrl}
          status={invite.status}
          paymentStatus={invite.payment_status}
          displayInviteUrl={displayInviteUrl}
        >
          <button
            type="button"
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-md hover:bg-[#eaeef2]"
            aria-label="Share invitation"
          >
            <Share2 className="w-[15px]" strokeWidth={0.9} stroke="#000000" />
          </button>
        </ShareDialog>
        <button className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-md hover:bg-[#eaeef2]" onClick={handlePreview}>
          <Eye className="w-[15px]" strokeWidth={0.9} stroke="#000000" />
        </button>
        <PublishButton
          className="flex h-10 cursor-pointer items-center justify-center rounded-md bg-cyan-700 px-5 text-[11px] font-light text-white hover:bg-cyan-900"
          label={true}
        />
      </div>
    </div>
  );
}
