"use client";

import { useMemo } from "react";
import { AlertCircle, CheckCircle, ChevronLeft, Circle, Eye, LoaderCircle, Share2 } from "lucide-react";
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

  const { draft, saveStatus, issueCount } = usePreviewDraft();

  const { invite } = draft;

  const displayInviteUrl = useMemo(() => safeDecode(inviteUrl), [inviteUrl]);

  /* ---------------- PREVIEW ---------------- */

  const handlePreview = () => {
    if (!invite?.event_key) return;

    window.open(`/preview/${invite.event_key}`, "_blank", "noopener,noreferrer");
  };

  /* ---------------- SAVE STATUS ---------------- */

  const saveState = {
    saved: {
      label: "Saved",
      icon: <CheckCircle className="h-[15px] w-[15px] text-green-700" strokeWidth={0.8} />,
      className: "text-green-700",
    },

    unsaved: {
      label: "Unsaved",
      icon: <Circle className="h-[12px] w-[12px] text-slate-400" strokeWidth={1.5} fill="currentColor" />,
      className: "text-slate-500",
    },

    saving: {
      label: "Saving...",
      icon: <LoaderCircle className="h-[15px] w-[15px] animate-spin text-sky-600" strokeWidth={1} />,
      className: "text-sky-600",
    },

    validation: {
      label: issueCount === 1 ? "1 Issue" : `${issueCount} Issues`,
      icon: <AlertCircle className="h-[15px] w-[15px] text-red-500" strokeWidth={1} />,
      className: "text-red-500",
    },

    error: {
      label: "Couldn't save",
      icon: <AlertCircle className="h-[15px] w-[15px] text-red-500" strokeWidth={1} />,
      className: "text-red-500",
    },
  }[saveStatus];

  return (
    <div className={`${className} absolute top-[35px] left-1/2 z-10 flex -translate-x-1/2 items-center gap-3`}>
      {/* ======================================================
          BACK + SAVE STATUS
      ====================================================== */}

      <div className="hidden items-center rounded-md bg-white p-1 md:flex">
        {/* Back */}
        <button
          type="button"
          onClick={() => {
            if (!invite?.event_type || !invite?.invite_key) {
              return;
            }

            router.push(`/invites/${invite.event_type}/${invite.invite_key}`);
          }}
          className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md pr-3 pl-2 text-[11px] font-light text-black transition-colors hover:bg-[#eaeef2]"
        >
          <ChevronLeft className="h-[15px] w-[15px]" strokeWidth={0.8} stroke="#000000" />

          <span className="hidden lg:block">Back</span>
        </button>

        {/* Divider */}
        <div className="-mr-[1px] -ml-[1px] flex h-[15px] w-[1px] bg-[#e5e9ed]" />

        {/* Save Status */}
        <div
          className={`flex h-10 min-w-[72px] items-center justify-center gap-2 rounded-md px-3 text-[11px] font-light whitespace-nowrap ${saveState.className}`}
          aria-live="polite"
          aria-label={saveState.label}
        >
          {saveState.icon}

          <span className="hidden lg:block">{saveState.label}</span>
        </div>
      </div>

      {/* ======================================================
          DEVICE SWITCHER
      ====================================================== */}

      <DeviceSwitcher device={device} onChange={onDeviceChange} className="hidden gap-1 rounded-md bg-white p-1 md:flex" />

      {/* ======================================================
          ACTIONS
      ====================================================== */}

      <div className="flex h-full items-center gap-0 rounded-md bg-white p-1">
        {/* Share */}
        <ShareDialog
          open={shareDialogOpen}
          onOpenChange={onShareDialogOpenChange}
          url={displayInviteUrl}
          status={invite?.status}
          paymentStatus={invite?.payment_status}
          displayInviteUrl={displayInviteUrl}
        >
          <button
            type="button"
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-md transition-colors hover:bg-[#eaeef2]"
            aria-label="Share invitation"
          >
            <Share2 className="h-[15px] w-[15px]" strokeWidth={0.9} stroke="#000000" />
          </button>
        </ShareDialog>

        {/* Divider */}
        <div className="-mr-[1px] -ml-[1px] flex h-[15px] w-[1px] bg-[#e5e9ed]" />

        {/* Preview */}
        <button
          type="button"
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-md transition-colors hover:bg-[#eaeef2]"
          onClick={handlePreview}
          aria-label="Preview invitation"
        >
          <Eye className="h-[15px] w-[15px]" strokeWidth={0.9} stroke="#000000" />
        </button>

        {/* Publish */}
        <PublishButton
          className="ml-1 flex h-10 min-w-[35px] cursor-pointer items-center justify-center rounded-md bg-cyan-700 px-2 text-[11px] font-light text-white transition-colors hover:bg-cyan-900 lg:px-5"
          label
        />
      </div>
    </div>
  );
}
