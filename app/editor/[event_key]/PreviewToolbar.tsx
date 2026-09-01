"use client";

import { useMemo } from "react";
import { CheckCircle, ChevronLeft, Eye, Save, Share2 } from "lucide-react";
import { DeviceType } from "./EditorLayout";
import { DeviceSwitcher } from "./DeviceSwitcher";
import { ShareDialog } from "./components/publish/ShareDialog";
import { PublishButton } from "./components/publish/PublishButton";
import { usePreviewDraft } from "./PreviewDraftContext";
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
};

export function safeDecode(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function PreviewToolbar({ inviteUrl, device, onDeviceChange, className, shareDialogOpen, onShareDialogOpenChange }: Props) {
  const router = useRouter();
  const { draft } = usePreviewDraft();
  const { invite } = draft;
  const displayInviteUrl = useMemo(() => safeDecode(inviteUrl), [inviteUrl]);
  const handlePreview = () => {
    window.open(`/preview/${invite?.event_key}`, "_blank");
  };

  console.log("invite data", invite.event_type);

  return (
    <div className={`${className} absolute top-[35px] left-1/2 z-10 flex -translate-x-1/2 items-center gap-3`}>
      <div className="hidden items-center rounded-md bg-[#ffffff] p-1 md:flex">
        <button
          type="button"
          onClick={() => router.push(`/invites/${invite.event_type}/${invite.invite_key}`)}
          className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md pr-3 pl-2 text-[11px] font-light text-black hover:bg-[#eaeef2]"
        >
          <ChevronLeft className="w-[15px]" strokeWidth={0.8} stroke="#000000" /> <span className="hidden lg:block">Back</span>
        </button>
        <div className="-mr-[1px] -ml-[1px] flex h-[15px] w-[1px] bg-[#e5e9ed]"></div>
        <button
          type="button"
          className="font-lightrounded-md flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md pr-3 pl-3 text-[11px] font-light whitespace-nowrap text-black"
        >
          <CheckCircle className="w-[15px]" strokeWidth={0.7} stroke="#000000" /> <span className="hidden lg:block text-green-700">Saved</span>
        </button>
      </div>
      <DeviceSwitcher device={device} onChange={onDeviceChange} className="hidden gap-1 rounded-md bg-[#ffffff] p-1 md:flex" />
      <div className="flex h-full items-center gap-0 rounded-md bg-[#ffffff] p-1">
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
        <div className="-mr-[1px] -ml-[1px] flex h-[15px] w-[1px] bg-[#e5e9ed]"></div>
        <button className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-md hover:bg-[#eaeef2]" onClick={handlePreview}>
          <Eye className="w-[15px]" strokeWidth={0.9} stroke="#000000" />
        </button>
        <PublishButton
          className="ml-1 flex h-10 min-w-[35px] cursor-pointer items-center justify-center rounded-md bg-cyan-700 px-2 text-[11px] font-light text-white hover:bg-cyan-900 lg:px-5"
          label={true}
        />
      </div>
    </div>
  );
}
