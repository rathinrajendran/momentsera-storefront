"use client";

import * as React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Save, X, Eye } from "lucide-react";
import { usePreviewDraft } from "../PreviewDraftContext";
import { useSaveEventSection } from "../../../../hooks/useEvents";
import { Button } from "../../../../components/ui/button";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "../../../../components/ui/form";
import { Switch } from "../../../../components/ui/switch";
import EditorHeader from "./EditorHeader";

/* ---------------- TYPES & CONFIG ---------------- */

export interface SharingFormValues {
  shareMessage: string;
  includeEventDate: boolean;
  includeVenue: boolean;
  includeCoupleNames: boolean;
  includeEventTime: boolean;
}

interface TemplateItem {
  id: string;
  label: string;
  value: string;
}

const TEMPLATES: TemplateItem[] = [
  {
    id: "classic",
    label: "Classic",
    value: "You're warmly invited to celebrate our wedding. We would be delighted to have you join us on our special day.",
  },
  {
    id: "elegant",
    label: "Elegant",
    value:
      "Together with our families, we joyfully invite you to celebrate our wedding. Your presence will make our special day even more meaningful.",
  },
  {
    id: "warm",
    label: "Warm",
    value:
      "Our hearts are full of joy, and we'd love for you to celebrate this beautiful moment with us. Please join us on our wedding day.",
  },
  {
    id: "modern",
    label: "Modern",
    value: "We're getting married! Join us as we celebrate love, laughter, and the beginning of our new journey together.",
  },
  {
    id: "minimal",
    label: "Minimal",
    value: "You're invited to our wedding. We look forward to celebrating this unforgettable day with you.",
  },
  {
    id: "formal",
    label: "Formal",
    value:
      "It is with great pleasure that we invite you to witness and celebrate our wedding ceremony. We look forward to sharing this joyous occasion with you.",
  },
];

const DEFAULT_SHARE_MESSAGE = "You're invited! We can't wait to celebrate with you.";

/* ---------------- MAIN COMPONENT ---------------- */

interface SharingEditorProps {
  eventKey: string;
  onBack: () => void;
}

export default function SharingEditor({ eventKey, onBack }: SharingEditorProps) {
  const { draft, updateSection, resetDraft, refreshEvent } = usePreviewDraft();

  const eventId = draft.invite.id;
  const sharing = draft.sharing ?? {};
  const announcement = draft.announcement ?? {};
  const brideName = announcement.bride?.name?.trim() ?? "";
  const groomName = announcement.groom?.name?.trim() ?? "";

  const schedule = Array.isArray(draft.schedule) ? draft.schedule : Object.values(draft.schedule ?? {});
  const primaryFunction = schedule.find((item: any) => item.isPrimary) ?? schedule[0];
  const inviteUrl = typeof window !== "undefined" ? `${window.location.origin}/${draft.invite.event_key}` : "";

  const mutation = useSaveEventSection(eventKey, eventId);

  const methods = useForm<SharingFormValues>({
    defaultValues: {
      shareMessage: sharing.shareMessage ?? DEFAULT_SHARE_MESSAGE,
      includeCoupleNames: sharing.includeCoupleNames ?? true,
      includeEventDate: sharing.includeEventDate ?? true,
      includeEventTime: sharing.includeEventTime ?? true,
      includeVenue: sharing.includeVenue ?? true,
    },
  });

  const { control, handleSubmit, watch, setValue, reset } = methods;

  // Reactively track changes for live generation pipeline
  const watchedMessage = watch("shareMessage");
  const watchedIncludeCoupleNames = watch("includeCoupleNames");
  const watchedIncludeEventDate = watch("includeEventDate");
  const watchedIncludeEventTime = watch("includeEventTime");
  const watchedIncludeVenue = watch("includeVenue");

  const handleLiveChange = React.useCallback(
    (values: Partial<SharingFormValues>) => {
      updateSection("sharing", {
        ...sharing,
        ...values,
      });
    },
    [sharing, updateSection],
  );

  const updateField = React.useCallback(
    <K extends keyof SharingFormValues>(key: K, value: SharingFormValues[K]) => {
      setValue(key as any, value, { shouldDirty: true, shouldValidate: true });
      handleLiveChange({ [key]: value });
    },
    [setValue, handleLiveChange],
  );

  // Premium computed dynamic share view array logic
  const previewLines = React.useMemo(() => {
    const lines: string[] = [];

    if (watchedMessage?.trim()) {
      lines.push(watchedMessage.trim());
    }

    if (watchedIncludeCoupleNames && (brideName || groomName)) {
      lines.push([brideName, groomName].filter(Boolean).join(" & "));
    }

    if (primaryFunction) {
      // 1. Safe Date Extractor & Format Validation
      if (watchedIncludeEventDate) {
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

      // 2. Safe Time Extractor
      if (watchedIncludeEventTime) {
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

      // 3. Venue
      if (watchedIncludeVenue) {
        const venue = primaryFunction.locationName || primaryFunction.venue;
        if (venue?.trim()) {
          lines.push(venue.trim());
        }
      }
    }

    if (inviteUrl) {
      lines.push(inviteUrl);
    }

    return lines;
  }, [
    watchedMessage,
    watchedIncludeCoupleNames,
    watchedIncludeEventDate,
    watchedIncludeEventTime,
    watchedIncludeVenue,
    brideName,
    groomName,
    primaryFunction,
    inviteUrl,
  ]);

  const onSubmit = (values: SharingFormValues) => {
    mutation.mutate(
      {
        path: "sharing",
        stage: "sharing",
        data: values,
      },
      {
        onSuccess: async () => {
          await refreshEvent(eventKey);
          onBack();
        },
      },
    );
  };

  const handleCancel = () => {
    resetDraft();
    onBack();
  };

  const handleReset = () => {
    const fallbackDefaults = {
      shareMessage: DEFAULT_SHARE_MESSAGE,
      includeCoupleNames: true,
      includeEventDate: true,
      includeEventTime: true,
      includeVenue: true,
    };
    reset(fallbackDefaults);
    handleLiveChange(fallbackDefaults);
  };

  const isPublished = draft.invite.status === "published";

  return (
    <div className="animate-in fade-in flex h-full flex-col rounded-lg duration-300 md:rounded-none">
      <EditorHeader title="Sharing" handleCancel={handleCancel} />

      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-1 flex-col justify-between space-y-5 p-5 pb-0 md:min-h-[calc(100dvh-115px)] md:rounded-none [&::-webkit-scrollbar]:h-0 [&::-webkit-scrollbar]:w-[2px] [&::-webkit-scrollbar-thumb]:rounded-[10px] [&::-webkit-scrollbar-thumb]:bg-[#c1c1c1] [&::-webkit-scrollbar-track]:rounded-[10px] [&::-webkit-scrollbar-track]:bg-[#78909C]"
        >
          <section className="space-y-6 [&>*:last-child]:mb-6">
            {/* Share Message Input */}
            <FormField
              control={control}
              name="shareMessage"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-xs font-semibold text-slate-700">Share Message</FormLabel>
                  <FormControl>
                    <textarea
                      {...field}
                      rows={4}
                      maxLength={500}
                      className="w-full resize-none rounded-lg border border-slate-200 bg-white p-3 text-xs transition-colors focus:border-slate-400 focus:ring-0 focus:outline-none"
                      onChange={(e) => {
                        field.onChange(e);
                        handleLiveChange({ shareMessage: e.target.value });
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                  <div className="flex justify-end text-[10px] font-medium text-slate-400">{(field.value || "").length}/500</div>
                  <p className="text-[0.7rem] leading-relaxed text-slate-400">
                    This text acts as the standard structural note when sent across digital communication platforms.
                  </p>
                </FormItem>
              )}
            />

            {/* Quick Templates */}
            <div className="space-y-3">
              <p className="text-[0.7rem] font-bold tracking-wider text-slate-400 uppercase">Message Templates</p>
              <div className="flex flex-wrap gap-2">
                {TEMPLATES.map((item) => (
                  <Button
                    key={item.id}
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 rounded-md border-slate-200 bg-white px-3 text-[11px] text-slate-600 hover:bg-slate-50"
                    onClick={() => updateField("shareMessage", item.value)}
                  >
                    {item.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Premium Share Card Live Preview Bubble */}
            <div className="space-y-3">
              <div className="flex items-center gap-1.5">
                <Eye size={12} className="text-slate-400" />
                <p className="text-[0.7rem] font-bold tracking-wider text-slate-400 uppercase">Live Message Preview {inviteUrl}</p>
              </div>
              <div className="flex flex-col items-start">
                <div className="w-full max-w-[100%] rounded-2xl rounded-tl-sm border border-slate-100 bg-slate-100 p-3.5">
                  <div className="space-y-1 text-xs leading-relaxed break-words whitespace-pre-wrap text-slate-800">
                    {previewLines.map((line, index) => {
                      const isUrl = line === inviteUrl;
                      return (
                        <p key={index} className={isUrl ? "pt-1 font-medium break-all text-blue-600 underline" : ""}>
                          {line}
                        </p>
                      );
                    })}
                  </div>
                </div>
                <span className="mt-1 ml-1 text-[9px] font-medium text-slate-400">Message preview context</span>
              </div>
            </div>

            {/* Dynamic Options Toggle Section */}
            <div className="space-y-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4">
              <p className="mb-2 text-[0.7rem] font-bold tracking-wider text-slate-400 uppercase">Sharing Details</p>

              {/* Couple names can always be toggled */}
              <FormField
                control={control}
                name="includeCoupleNames"
                render={({ field }) => (
                  <div className="flex items-center justify-between py-1">
                    <span className="text-[0.7rem] font-medium text-slate-700">Include couple names</span>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(v) => {
                        field.onChange(v);
                        handleLiveChange({ includeCoupleNames: v });
                      }}
                    />
                  </div>
                )}
              />

              {/* Conditionally reveal Date, Time, and Venue switches if primaryFunction is defined */}
              {primaryFunction && (
                <>
                  <FormField
                    control={control}
                    name="includeEventDate"
                    render={({ field }) => (
                      <div className="animate-in fade-in slide-in-from-top-1 flex items-center justify-between py-1 duration-200">
                        <span className="text-[0.7rem] font-medium text-slate-700">Include event date</span>
                        <Switch
                          checked={field.value}
                          onCheckedChange={(v) => {
                            field.onChange(v);
                            handleLiveChange({ includeEventDate: v });
                          }}
                        />
                      </div>
                    )}
                  />

                  <FormField
                    control={control}
                    name="includeEventTime"
                    render={({ field }) => (
                      <div className="animate-in fade-in slide-in-from-top-1 flex items-center justify-between py-1 duration-200">
                        <span className="text-[0.7rem] font-medium text-slate-700">Include event time</span>
                        <Switch
                          checked={field.value}
                          onCheckedChange={(v) => {
                            field.onChange(v);
                            handleLiveChange({ includeEventTime: v });
                          }}
                        />
                      </div>
                    )}
                  />

                  <FormField
                    control={control}
                    name="includeVenue"
                    render={({ field }) => (
                      <div className="animate-in fade-in slide-in-from-top-1 flex items-center justify-between py-1 duration-200">
                        <span className="text-[0.7rem] font-medium text-slate-700">Include venue</span>
                        <Switch
                          checked={field.value}
                          onCheckedChange={(v) => {
                            field.onChange(v);
                            handleLiveChange({ includeVenue: v });
                          }}
                        />
                      </div>
                    )}
                  />
                </>
              )}
            </div>

            {/* Metadata Links & Meta Informational Blocks */}
            <div className="grid grid-cols-1 gap-4">
              <div className="rounded-xl border border-slate-100 bg-white p-4">
                <p className="text-[0.7rem] font-bold tracking-wider text-slate-400 uppercase">Invitation Link</p>
                <div className="mt-2 truncate rounded-md border border-slate-100 bg-slate-50 px-3 py-2 font-mono text-[11px] text-slate-600">
                  {inviteUrl || `https://domain.com/${draft.invite.event_key}`}
                </div>
                <p className="mt-2 text-[10px] text-slate-400">Modify this link path from your preview settings.</p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-white p-4">
                <p className="text-[0.7rem] font-bold tracking-wider text-slate-400 uppercase">Staging Status</p>
                <div className="mt-2 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-800">{isPublished ? "Live & Ready" : "Draft Mode"}</p>
                    <p className="text-[10px] text-slate-400">
                      {isPublished ? "Changes reflect live instantly." : "Publish to activate custom share links."}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium tracking-wide uppercase ${
                      isPublished ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {draft.invite.status}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Luxury Sticky Actions Panel */}
          <div className="sticky bottom-0 z-[99] -m-5 flex h-16 h-[60px] items-center justify-end gap-3 border-slate-100 bg-white/90 px-5 md:border-t md:backdrop-blur-md">
            <Button
              type="button"
              variant="ghost"
              onClick={handleCancel}
              className="text-xs font-semibold text-slate-400 transition-colors hover:bg-transparent hover:text-slate-900"
            >
              <X size={14} className="mr-1" />
              Discard
            </Button>

            <Button
              variant="outline"
              type="button"
              className="h-9 border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50"
              onClick={handleReset}
            >
              Reset
            </Button>

            <Button
              type="submit"
              disabled={mutation.isPending}
              className="flex h-9 items-center gap-1.5 rounded-md bg-slate-900 px-8 text-xs font-medium text-white shadow-sm transition-all hover:bg-slate-800 active:scale-[0.98] disabled:opacity-50"
            >
              <Save size={14} />
              {mutation.isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
