"use client";

import { useMemo } from "react";
import { ChevronLeftIcon, Eye, Pen, Share2 } from "lucide-react";
import { DeviceType } from "./EditorLayout";
import { DeviceSwitcher } from "./DeviceSwitcher";
import { ShareDialog } from "./components/publish/ShareDialog";
import { PublishButton } from "./components/publish/PublishButton";
import { CustomizeDialog } from "./components/publish/CustomizeDialog";
import { usePreviewDraft } from "./PreviewDraftContext";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

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
  KeyInvite: string;
  typeEvent: string;
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
  KeyInvite,
  typeEvent,
}: Props) {
  const { draft } = usePreviewDraft();
    const router = useRouter();
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
    <div className={`${className} relative z-10 flex h-[50px] items-center justify-between gap-3 border-b bg-white px-4`}>
      <button
        type="button"
        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border"
        onClick={() => router.push(`/invites/${typeEvent}/${KeyInvite}`)}
      >
        <ChevronLeftIcon strokeWidth={1} className="h-5 w-5" />
      </button>
      <div className="flex md:w-[225px] md:max-w-[280px] md:min-w-[120px] lg:max-w-[330px] lg:min-w-[330px]">
        <div className="flex h-full items-center truncate font-medium" title={displayInviteUrl}>
          <span className="hidden lg:block">{draft?.frontendUrl}/</span>
          <span className="inline items-center truncate">{displayInviteUrl}</span>
        </div>
        <CustomizeDialog
          open={customizeDialogOpen}
          onOpenChange={onCustomizeDialogOpenChange}
          inviteUrl={inviteUrl}
          onInviteUrlChange={onInviteUrlChange}
          inviteData={inviteData}
        >
          <button
            type="button"
            className="flex h-7 w-7 min-w-7 cursor-pointer items-center justify-center rounded-md transition hover:bg-slate-100"
            aria-label="Edit invite URL"
          >
            <Pen size={15} strokeWidth={1.75} />
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
            className="flex h-7 w-7 min-w-7 cursor-pointer items-center justify-center rounded-md transition hover:bg-slate-100"
            aria-label="Share invitation"
          >
            <Share2 size={15} strokeWidth={1.75} />
          </button>
        </ShareDialog>

        <DeviceSwitcher device={device} onChange={onDeviceChange} className="hidden w-[170px] md:flex" />
        <Button
          className="flex h-auto w-auto cursor-pointer items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-[0.6rem] font-bold tracking-widest text-black uppercase transition-all hover:bg-gray-200 md:h-9 md:w-auto"
          onClick={handlePreview}
        >
          <Eye />
          Preview
        </Button>
        <PublishButton className="block" />
      </div>
    </div>
  );
}
