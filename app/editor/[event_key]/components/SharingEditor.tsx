"use client";

import * as React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePreviewDraft } from "../PreviewDraftContext";
import { useSaveEventSection } from "../../../../hooks/useEvents";
import { Button } from "../../../../components/ui/button";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "../../../../components/ui/form";
import { Switch } from "../../../../components/ui/switch";
import EditorHeader from "./EditorHeader";
import { buildShareMessage } from "../../../../utils/shareMessage";
import { LabelForm, SubLabelForm } from "../../../../components/ui/LabelForm";

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

const DEFAULT_SHARING_VALUES: SharingFormValues = {
  shareMessage: DEFAULT_SHARE_MESSAGE,
  includeCoupleNames: true,
  includeEventDate: true,
  includeEventTime: true,
  includeVenue: true,
};

/* ---------------- MAIN COMPONENT ---------------- */

export default function SharingEditor({ onBack, handleBack, eventKey }: { onBack: () => void; handleBack: () => void; eventKey: string }) {
  const { draft, updateSection, resetDraft, refreshEvent } = usePreviewDraft();

  const eventId = draft.invite.id;
  const sharing = draft.sharing ?? {};
  const schedule = Array.isArray(draft.schedule) ? draft.schedule : Object.values(draft.schedule ?? {});
  const hasSchedule = schedule.length > 0;
  const eventKeyPath = draft.invite.event_key?.trim() ?? "";
  const inviteUrl = typeof window !== "undefined" && eventKeyPath ? `${window.location.origin}/${eventKeyPath}` : "";

  const mutation = useSaveEventSection(eventKey, eventId);

  const methods = useForm<SharingFormValues>({
    defaultValues: {
      ...DEFAULT_SHARING_VALUES,
      ...sharing,
    },
  });

  const { control, handleSubmit, setValue } = methods;

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
  const previewLines = React.useMemo(
    () =>
      buildShareMessage(draft, {
        includeUrl: true,
        inviteUrl,
      }).split("\n"),
    [draft, inviteUrl],
  );

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

  const isPublished = draft.invite.status === "published";

  return (
    <div className="animate-in fade-in flex h-full flex-col rounded-lg duration-300 md:rounded-none">
      <EditorHeader title="Sharing" handleBack={handleBack} />

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="overflow-auto p-5 md:h-[calc(100dvh-125px)] md:min-h-[calc(100dvh-125px)] md:rounded-none [&::-webkit-scrollbar]:h-0 [&::-webkit-scrollbar]:w-[2px] [&::-webkit-scrollbar-thumb]:rounded-[10px] [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-track]:rounded-[10px] [&::-webkit-scrollbar-track]:bg-slate-100">
            <section>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-1">
                <FormField
                  control={control}
                  name="shareMessage"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-1">
                      <FormLabel>Share Message</FormLabel>
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
                        This message is used when your invitation is shared through digital platforms.
                      </p>
                    </FormItem>
                  )}
                />
                <div className="flex flex-col gap-1">
                  <LabelForm>Message Templates</LabelForm>
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
                <div className="flex flex-col gap-1">
                  <LabelForm>Message Preview</LabelForm>
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
                    <span className="mt-1 ml-1 text-[9px] font-medium text-slate-400">Preview of the shared invitation</span>
                  </div>
                </div>
                <FormField
                  control={control}
                  name="includeCoupleNames"
                  render={({ field }) => (
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <LabelForm>Include Couple Names</LabelForm>
                        <Switch
                          checked={field.value}
                          onCheckedChange={(v) => {
                            field.onChange(v);
                            handleLiveChange({ includeCoupleNames: v });
                          }}
                        />
                      </div>
                    </div>
                  )}
                />
                {hasSchedule && (
                  <>
                    <FormField
                      control={control}
                      name="includeEventDate"
                      render={({ field }) => (
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-between">
                            <LabelForm>Include Event Date</LabelForm>
                            <Switch
                              checked={field.value}
                              onCheckedChange={(v) => {
                                field.onChange(v);
                                handleLiveChange({ includeEventDate: v });
                              }}
                            />
                          </div>
                        </div>
                      )}
                    />

                    <FormField
                      control={control}
                      name="includeEventTime"
                      render={({ field }) => (
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-between">
                            <LabelForm>Include Event Time</LabelForm>
                            <Switch
                              checked={field.value}
                              onCheckedChange={(v) => {
                                field.onChange(v);
                                handleLiveChange({ includeEventTime: v });
                              }}
                            />
                          </div>
                        </div>
                      )}
                    />

                    <FormField
                      control={control}
                      name="includeVenue"
                      render={({ field }) => (
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-between">
                            <LabelForm>Include Venue</LabelForm>
                            <Switch
                              checked={field.value}
                              onCheckedChange={(v) => {
                                field.onChange(v);
                                handleLiveChange({ includeVenue: v });
                              }}
                            />
                          </div>
                        </div>
                      )}
                    />
                  </>
                )}
                <div className="flex flex-col gap-1">
                  <div className="flex flex-col gap-1">
                    <LabelForm>Invitation Link</LabelForm>
                    <SubLabelForm>This is the link guests will use to view your invitation.</SubLabelForm>
                  </div>
                  <LabelForm>
                    {inviteUrl || (eventKeyPath ? `https://domain.com/${eventKeyPath}` : "Invitation link unavailable")}
                  </LabelForm>

                  <div className="rounded-xl border border-slate-100 bg-white p-4">
                    <p className="text-[0.7rem] font-bold tracking-wider text-slate-400 uppercase">Link Status</p>
                    <div className="mt-2 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold text-slate-800">{isPublished ? "Published" : "Draft"}</p>
                        <p className="text-[10px] text-slate-400">
                          {isPublished
                            ? "Your invitation link is active and available to guests."
                            : "Publish your invitation to activate the link for guests."}
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
              </div>
            </section>
          </div>
          <div className="relative flex h-[50px] items-center justify-between gap-3 border-t border-slate-100 bg-white px-5 py-2">
            <button
              type="button"
              onClick={handleCancel}
              className="font-regular inline-flex h-full min-h-[34px] w-auto cursor-pointer items-center justify-between gap-3 rounded-md bg-gray-100 pr-4 pl-3 text-xs text-black/70 transition-all hover:bg-gray-200"
            >
              <ChevronLeft strokeWidth={1.5} size={14} />
              <span>Previous</span>
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="font-regular inline-flex h-full min-h-[34px] w-auto cursor-pointer items-center justify-between gap-3 rounded-md bg-slate-800 pr-3 pl-4 text-xs text-white/90 transition-all hover:bg-slate-900"
            >
              {mutation.isPending ? "Updating..." : "Next"}
              <ChevronRight strokeWidth={1.5} size={14} />
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
