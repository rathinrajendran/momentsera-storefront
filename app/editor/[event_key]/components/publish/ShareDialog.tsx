"use client";

import { useMemo, useState } from "react";
import { Check, Copy, MessageCircle, Send, MessagesSquare, Share2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../../../../components/ui/dialog";
import { H3 } from "../../../../../components/ui/H3";
import { Button } from "../../../../../components/ui/button";
import { safeDecode } from "../../PreviewToolbar";
import { usePreviewDraft } from "../../PreviewDraftContext";
import { cn } from "../../../../../utils/utils";

type Props = {
  children: React.ReactNode;
  url: string;
  className?: string;
  status: string;
  paymentStatus: string;
  displayInviteUrl: string;
};

const DEFAULT_SHARE_MESSAGE = "You're invited! We can't wait to celebrate with you.";

export function ShareDialog({ children, url, status, paymentStatus, displayInviteUrl }: Props) {
  const { draft } = usePreviewDraft();
  const [copied, setCopied] = useState(false);
  const [copiedPreview, setCopiedPreview] = useState(false);

  const decodedInviteUrl = useMemo(() => safeDecode(url), [url]);
  const decodedPreviewUrl = useMemo(() => safeDecode(displayInviteUrl), [displayInviteUrl]);
  const canShare = typeof navigator !== "undefined" && "share" in navigator;
  const canShareInvite = paymentStatus === "paid" && status === "published";

  // Use the active distribution URL context link target
  const activeTargetUrl = canShareInvite ? decodedInviteUrl : decodedPreviewUrl;

  const frontendUrl =
    draft?.frontendUrl ?? process.env.NEXT_PUBLIC_FRONTEND_URL ?? (typeof window !== "undefined" ? window.location.origin : "");

  const fullInviteUrl = `${frontendUrl}${activeTargetUrl}`;

  // 1. Extract configurations securely from backing schema
  const sharing = draft?.sharing ?? {};
  const announcement = draft?.announcement ?? {};
  const brideName = announcement.bride?.name?.trim() ?? "";
  const groomName = announcement.groom?.name?.trim() ?? "";

  const schedule = Array.isArray(draft?.schedule) ? draft.schedule : Object.values(draft?.schedule ?? {});
  const primaryFunction = schedule.find((item: any) => item.isPrimary) ?? schedule[0];

  // 2. Compute live text dynamically corresponding to toggle selections
  const generatedShareText = useMemo(() => {
    const lines: string[] = [];

    const shareMessage = sharing.shareMessage ?? DEFAULT_SHARE_MESSAGE;
    if (shareMessage.trim()) {
      lines.push(shareMessage.trim());
    }

    const includeCoupleNames = sharing.includeCoupleNames ?? true;
    if (includeCoupleNames && (brideName || groomName)) {
      lines.push([brideName, groomName].filter(Boolean).join(" & "));
    }

    if (primaryFunction) {
      const includeEventDate = sharing.includeEventDate ?? true;
      if (includeEventDate) {
        const rawDate = primaryFunction.date || primaryFunction.eventDate;
        if (rawDate) {
          const parsedDate = new Date(rawDate);
          if (!isNaN(parsedDate.getTime())) {
            lines.push(
              parsedDate.toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              }),
            );
          } else {
            lines.push(String(rawDate));
          }
        }
      }

      const includeEventTime = sharing.includeEventTime ?? true;
      if (includeEventTime) {
        const rawTime = primaryFunction.startTime || primaryFunction.time;
        if (rawTime) {
          if (typeof rawTime === "string" && (rawTime.includes("T") || !isNaN(Date.parse(rawTime)))) {
            try {
              lines.push(
                new Intl.DateTimeFormat("en-IN", {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                }).format(new Date(rawTime)),
              );
            } catch {
              lines.push(String(rawTime));
            }
          } else {
            lines.push(String(rawTime));
          }
        }
      }

      const includeVenue = sharing.includeVenue ?? true;
      if (includeVenue) {
        const venue = primaryFunction.locationName || primaryFunction.venue;
        if (venue?.trim()) {
          lines.push(venue.trim());
        }
      }
    }

    if (fullInviteUrl) {
      lines.push(fullInviteUrl);
    }

    return lines.join("\n");
  }, [sharing, announcement, primaryFunction, brideName, groomName, fullInviteUrl]);

  // 3. Dynamic Array Layout mapping matching your structured channels
  const shareItems = useMemo(() => {
    const encodedFullText = encodeURIComponent(generatedShareText);
    const encodedUrlOnly = encodeURIComponent(fullInviteUrl);
    const whatsappText = encodeURIComponent(`${sharing.shareMessage ?? DEFAULT_SHARE_MESSAGE}\n\n${fullInviteUrl}`);
    return [
      {
        label: "WhatsApp",
        icon: MessageCircle,
        href: `https://api.whatsapp.com/send?text=${whatsappText}`,
        isExternal: true,
      },
      {
        label: "Facebook",
        icon: Share2,
        href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrlOnly}`,
        isExternal: true,
      },
      {
        label: "Telegram",
        icon: Send,
        href: `https://t.me/share/url?url=${encodedUrlOnly}&text=${encodedFullText}`,
        isExternal: true,
      },
      {
        label: "Messages",
        icon: MessagesSquare,
        href: `sms:?body=${encodedFullText}`,
        isExternal: false,
      },
    ];
  }, [generatedShareText, fullInviteUrl, sharing.shareMessage]);

  const handleCopy = () => {
    navigator.clipboard.writeText(fullInviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyPreviewText = () => {
    navigator.clipboard.writeText(generatedShareText);
    setCopiedPreview(true);
    setTimeout(() => setCopiedPreview(false), 2000);
  };

  const handleNativeShare = async () => {
    if (!canShare) return;
    try {
      await navigator.share({
        title: "Wedding Invitation",
        text: generatedShareText,
        url: fullInviteUrl,
      });
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className={cn(
          "animate-in fade-in zoom-in-95 border border-slate-100 bg-white p-5 shadow-xl duration-200 outline-none",
          "mx-auto w-[calc(100%-2rem)] max-w-[420px] rounded-2xl md:w-full",
        )}
      >
        {/* Header Section */}
        <DialogHeader className="flex flex-row items-center justify-between border-b border-slate-50 pb-2">
          <div className="max-w-[90%] space-y-0.5">
            <DialogTitle className="truncate text-sm font-bold text-slate-900">Share Invitation</DialogTitle>
            <p className="line-clamp-1 text-[10px] font-medium text-slate-400">
              Send out your personalized invitation text message via digital delivery options.
            </p>
          </div>
        </DialogHeader>

        {/* Content Body */}
        <div className="mt-4 space-y-5">
          {/* Live Message Preview Bubble */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Compiled Text Message</span>
              <button
                type="button"
                onClick={handleCopyPreviewText}
                className="flex items-center gap-1 text-[10px] font-bold text-slate-500 transition-colors hover:text-slate-900 focus-visible:outline-none"
              >
                {copiedPreview ? "Copied!" : "Copy Full Message"}
              </button>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5">
              <div className="max-h-28 scrollbar-none overflow-y-auto text-[11px] leading-relaxed font-medium whitespace-pre-wrap text-slate-600 select-all">
                {generatedShareText}
              </div>
            </div>
          </div>

          {/* Share Channels Matrix */}
          <div className="space-y-2 rounded-xl border border-slate-100 bg-slate-50/30 p-4 duration-200">
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">Share via channels</span>
            <div className="grid grid-cols-4 gap-3 pt-1">
              {shareItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.isExternal ? "_blank" : undefined}
                    rel={item.isExternal ? "noopener noreferrer" : undefined}
                    className="group flex touch-manipulation flex-col items-center gap-1.5 transition-transform outline-none active:scale-98"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-100 bg-white shadow-sm transition-all group-hover:border-slate-200 group-hover:bg-slate-50 group-focus:border-slate-200">
                      <IconComponent size={16} strokeWidth={2} className="text-slate-700" />
                    </div>
                    <H3 className="text-center text-[10px] font-semibold text-slate-500 transition-colors group-hover:text-slate-900">
                      {item.label}
                    </H3>
                  </a>
                );
              })}

              {/* Native Mobile Share Button */}
              {canShare && (
                <button
                  type="button"
                  onClick={handleNativeShare}
                  className="group flex touch-manipulation flex-col items-center gap-1.5 transition-transform outline-none active:scale-98"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-100 bg-white shadow-sm transition-all group-hover:border-slate-200 group-hover:bg-slate-50">
                    <Share2 size={16} strokeWidth={2} className="text-slate-700" />
                  </div>
                  <H3 className="text-center text-[10px] font-semibold text-slate-500 group-hover:text-slate-900">More</H3>
                </button>
              )}
            </div>
          </div>

          {/* Core Direct link container section */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Direct Invitation Link</span>
            <div className="grid grid-cols-[1fr_auto] items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 shadow-sm">
              <span className="min-w-0 truncate font-mono text-[11px] text-slate-500 select-all">{fullInviteUrl}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleCopy}
                className="h-7 w-7 rounded-md border border-transparent text-slate-400 transition-all hover:border-slate-100 hover:bg-slate-50 hover:text-slate-700"
              >
                {copied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
              </Button>
            </div>

            {!canShareInvite && (
              <p className="rounded-lg border border-amber-100/70 bg-amber-50/40 p-2.5 text-[10px] leading-normal font-medium text-amber-600/90">
                ⚠️ Showing draft link layout. Publish invitation and settle outstanding values to activate absolute root distribution
                routes.
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
