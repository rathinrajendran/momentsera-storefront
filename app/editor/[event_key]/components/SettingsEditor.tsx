"use client";

import { useForm, FormProvider } from "react-hook-form";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { usePreviewDraft } from "../PreviewDraftContext";
import { useSaveEventSection } from "../../../../hooks/useEvents";
import { Switch } from "../../../../components/ui/switch";
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "../../../../components/ui/form";
import { CustomDatePicker } from "../../../../components/ui/CustomDatePicker";
import { HorizontalScroll } from "../../../../components/ui/HorizontalScroll";
import { cn } from "../../../../utils/utils";
import EditorHeader from "./EditorHeader";
import { LabelForm } from "../../../../components/ui/LabelForm";

/* ---------------- CONSTANTS / CARDS DATA ---------------- */

const EXPIRY_OPTIONS = [
  { id: "default", title: "Default Expiry", description: "Expires based on platform standard timeline" },
  { id: "1_day", title: "24 Hours", description: "Expires 1 day post-event" },
  { id: "7_days", title: "1 Week", description: "Expires 7 days post-event" },
  { id: "30_days", title: "1 Month", description: "Expires 30 days post-event" },
  { id: "custom", title: "Custom Date", description: "Pick your own expiry date" },
];

const LANGUAGE_OPTIONS = [
  { id: "en", title: "English", description: "Default Platform Variant" },
  { id: "es", title: "Español", description: "Spanish Translation" },
  { id: "fr", title: "Français", description: "French Translation" },
  { id: "de", title: "Deutsch", description: "German Translation" },
];

const DATE_FORMATS = [
  { id: "MM/DD/YYYY", title: "MM/DD/YYYY", description: "e.g. 12/25/2026" },
  { id: "DD/MM/YYYY", title: "DD/MM/YYYY", description: "e.g. 25/12/2026" },
  { id: "YYYY-MM-DD", title: "YYYY-MM-DD", description: "e.g. 2026-12-25" },
  { id: "MMM DD, YYYY", title: "Month DD, YYYY", description: "e.g. Dec 25, 2026" },
];

const TIME_FORMATS = [
  { id: "12h", title: "12-Hour Clock", description: "e.g. 08:30 PM" },
  { id: "24h", title: "24-Hour Clock", description: "e.g. 20:30" },
];

const TIMEZONES = [
  { id: "UTC", title: "Universal (UTC)", description: "Coordinated Universal Time" },
  { id: "EST", title: "Eastern (EST)", description: "New York, Toronto (GMT-5)" },
  { id: "PST", title: "Pacific (PST)", description: "Los Angeles, Vancouver (GMT-8)" },
  { id: "GMT", title: "Western Europe (GMT)", description: "London, Dublin (GMT+0)" },
  { id: "IST", title: "India Standard (IST)", description: "Mumbai, New Delhi (GMT+5:30)" },
];

/* ---------------- TYPES ---------------- */

type ExpiryOption = "never" | "1_day" | "7_days" | "30_days" | "custom";

type SettingsForm = {
  expiry_type: ExpiryOption;
  custom_expiry_date?: string;
  language: string;
  date_format: string;
  time_format: string;
  timezone: string;
  track_visitor_analytics: boolean;
  track_button_analytics: boolean;
  show_calendar: boolean;
  track_views: boolean;
  site_designed_by: boolean;
};

/* ---------------- COMPONENT ---------------- */

export default function SettingsEditor({ onBack, handleBack, eventKey }: { onBack: () => void; handleBack: () => void; eventKey: string }) {
  const { draft, updateSection, resetDraft, refreshEvent } = usePreviewDraft();
  const eventId = draft.invite.id;
  const mutation = useSaveEventSection(eventKey, eventId);

  const initialSettings = draft?.settings ?? {};

  const methods = useForm<SettingsForm>({
    mode: "onChange",
    defaultValues: {
      expiry_type: initialSettings.expiry_type ?? "never",
      custom_expiry_date: initialSettings.custom_expiry_date ?? "",
      language: initialSettings.language ?? "en",
      date_format: initialSettings.date_format ?? "MM/DD/YYYY",
      time_format: initialSettings.time_format ?? "12h",
      timezone: initialSettings.timezone ?? "UTC",
      track_visitor_analytics: initialSettings.track_visitor_analytics ?? false,
      track_button_analytics: initialSettings.track_button_analytics ?? false,
      show_calendar: initialSettings.show_calendar ?? true,
      track_views: initialSettings.track_views ?? true,
      site_designed_by: initialSettings.site_designed_by ?? true,
    },
  });

  const { watch, handleSubmit } = methods;
  const currentExpiryType = watch("expiry_type");

  function handleLiveChange(field: keyof SettingsForm, value: any) {
    const currentValues = methods.getValues();
    updateSection("settings", {
      ...currentValues,
      [field]: value,
    });
  }

  async function handleSaveSuccess() {
    await refreshEvent(eventKey);
    onBack();
  }

  function handleCancel() {
    resetDraft();
    onBack();
  }

  function onSubmit(values: SettingsForm) {
    mutation.mutate(
      {
        path: "settings",
        stage: "settings",
        data: values,
      },
      { onSuccess: handleSaveSuccess },
    );
  }

  return (
    <div className="animate-in fade-in flex h-full flex-col rounded-lg duration-500 md:rounded-none">
      <EditorHeader title="Event Preferences" handleBack={handleBack} />
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="overflow-auto p-5 md:h-[calc(100dvh-125px)] md:min-h-[calc(100dvh-125px)] md:rounded-none [&::-webkit-scrollbar]:h-0 [&::-webkit-scrollbar]:w-[2px] [&::-webkit-scrollbar-thumb]:rounded-[10px] [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-track]:rounded-[10px] [&::-webkit-scrollbar-track]:bg-slate-100">
            <section>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-1">
                <div className="flex flex-col gap-1">
                  {/* <SectionHeader icon={Clock} label="Invitation Link Expiration" /> */}
                  <LabelForm>Expiration Period</LabelForm>
                  <HorizontalScroll>
                    <div className="flex gap-3">
                      {EXPIRY_OPTIONS.map((opt) => {
                        const isSelected = currentExpiryType === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => {
                              methods.setValue("expiry_type", opt.id as ExpiryOption);
                              handleLiveChange("expiry_type", opt.id);
                            }}
                            className={cn(
                              "flex h-24 w-40 shrink-0 flex-col justify-between rounded-xl border p-3 text-left transition-all active:scale-98",
                              isSelected
                                ? "border-slate-900 bg-slate-900 text-white shadow-md shadow-slate-200"
                                : "border-slate-100 bg-slate-50/50 text-slate-700 hover:border-slate-200 hover:bg-white",
                            )}
                          >
                            <span className="text-xs font-semibold">{opt.title}</span>
                            <span className={cn("text-[10px] leading-normal", isSelected ? "text-slate-300" : "text-slate-400")}>
                              {opt.description}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </HorizontalScroll>
                </div>

                {/* Custom Expiry Date Conditional Picker */}
                {currentExpiryType === "custom" && (
                  <FormField
                    control={methods.control}
                    name="custom_expiry_date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-1">
                        <FormLabel>Custom Expiration Date</FormLabel>
                        <CustomDatePicker
                          value={field.value ? new Date(field.value) : undefined}
                          onChange={(date) => {
                            const isoStr = date ? date.toISOString() : "";
                            field.onChange(isoStr);
                            handleLiveChange("custom_expiry_date", isoStr);
                          }}
                        />
                      </FormItem>
                    )}
                  />
                )}

                <div className="flex flex-col gap-1">
                  {/* <SectionHeader icon={Languages} label="Primary Interface Language" /> */}
                  <LabelForm>Primary Interface Language</LabelForm>
                  <HorizontalScroll>
                    <div className="flex gap-3">
                      {LANGUAGE_OPTIONS.map((opt) => {
                        const isSelected = watch("language") === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => {
                              methods.setValue("language", opt.id);
                              handleLiveChange("language", opt.id);
                            }}
                            className={cn(
                              "flex h-20 w-36 shrink-0 flex-col justify-between rounded-xl border p-3 text-left transition-all active:scale-98",
                              isSelected
                                ? "border-slate-900 bg-slate-900 text-white shadow-md shadow-slate-200"
                                : "border-slate-100 bg-slate-50/50 text-slate-700 hover:border-slate-200 hover:bg-white",
                            )}
                          >
                            <span className="text-xs font-semibold">{opt.title}</span>
                            <span className={cn("text-[10px]", isSelected ? "text-slate-300" : "text-slate-400")}>{opt.description}</span>
                          </button>
                        );
                      })}
                    </div>
                  </HorizontalScroll>
                </div>
                <div className="flex flex-col gap-1">
                  {/* <SectionHeader icon={CalendarCheck} label="Date Structure Format" /> */}
                  <LabelForm>Date Structure Format</LabelForm>
                  <HorizontalScroll>
                    <div className="flex gap-3">
                      {DATE_FORMATS.map((opt) => {
                        const isSelected = watch("date_format") === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => {
                              methods.setValue("date_format", opt.id);
                              handleLiveChange("date_format", opt.id);
                            }}
                            className={cn(
                              "flex h-20 w-40 shrink-0 flex-col justify-between rounded-xl border p-3 text-left transition-all active:scale-98",
                              isSelected
                                ? "border-slate-900 bg-slate-900 text-white shadow-md shadow-slate-200"
                                : "border-slate-100 bg-slate-50/50 text-slate-700 hover:border-slate-200 hover:bg-white",
                            )}
                          >
                            <span className="font-mono text-xs font-bold tracking-tight">{opt.title}</span>
                            <span className={cn("text-[10px]", isSelected ? "text-slate-300" : "text-slate-400")}>{opt.description}</span>
                          </button>
                        );
                      })}
                    </div>
                  </HorizontalScroll>
                </div>
                <div className="flex flex-col gap-1">
                  {/* <SectionHeader icon={Timer} label="Time Display System" /> */}
                  <LabelForm>Time Display System</LabelForm>
                  <HorizontalScroll>
                    <div className="flex gap-3">
                      {TIME_FORMATS.map((opt) => {
                        const isSelected = watch("time_format") === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => {
                              methods.setValue("time_format", opt.id);
                              handleLiveChange("time_format", opt.id);
                            }}
                            className={cn(
                              "flex h-20 w-36 shrink-0 flex-col justify-between rounded-xl border p-3 text-left transition-all active:scale-98",
                              isSelected
                                ? "border-slate-900 bg-slate-900 text-white shadow-md shadow-slate-200"
                                : "border-slate-100 bg-slate-50/50 text-slate-700 hover:border-slate-200 hover:bg-white",
                            )}
                          >
                            <span className="text-xs font-semibold">{opt.title}</span>
                            <span className={cn("text-[10px]", isSelected ? "text-slate-300" : "text-slate-400")}>{opt.description}</span>
                          </button>
                        );
                      })}
                    </div>
                  </HorizontalScroll>
                </div>
                <div className="flex flex-col gap-1">
                  {/* <SectionHeader icon={MapPin} label="Schedule Timezone Synchronization" /> */}
                  <LabelForm>Schedule Timezone Synchronization</LabelForm>
                  <HorizontalScroll>
                    <div className="flex gap-3">
                      {TIMEZONES.map((opt) => {
                        const isSelected = watch("timezone") === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => {
                              methods.setValue("timezone", opt.id);
                              handleLiveChange("timezone", opt.id);
                            }}
                            className={cn(
                              "flex h-20 w-44 shrink-0 flex-col justify-between rounded-xl border p-3 text-left transition-all active:scale-98",
                              isSelected
                                ? "border-slate-900 bg-slate-900 text-white shadow-md shadow-slate-200"
                                : "border-slate-100 bg-slate-50/50 text-slate-700 hover:border-slate-200 hover:bg-white",
                            )}
                          >
                            <span className="w-full truncate text-xs font-semibold">{opt.title}</span>
                            <span className={cn("w-full truncate text-[10px]", isSelected ? "text-slate-300" : "text-slate-400")}>
                              {opt.description}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </HorizontalScroll>
                </div>
                {[
                  {
                    key: "show_calendar",
                    label: "Show 'Add to Calendar' Triggers",
                    desc: "Allows guests to download .ics dynamic shortcuts directly.",
                  },
                  {
                    key: "track_views",
                    label: "Monitor Visitor Invitation Traffic",
                    desc: "Aggregates unique impressions safely into host analytics dashboards.",
                  },
                  {
                    key: "track_visitor_analytics",
                    label: "Log Unique Browser Profiles",
                    desc: "Identifies precise device layouts for layout troubleshooting.",
                  },
                  {
                    key: "track_button_analytics",
                    label: "Register CTA Element Taps",
                    desc: "Tracks map location directions click-through distributions.",
                  },
                  {
                    key: "site_designed_by",
                    label: "Display Designer Infrastructure Tag",
                    desc: "Attributes the software studio engine in the layout signature.",
                  },
                ].map((item) => (
                  <FormField
                    key={item.key}
                    control={methods.control}
                    name={item.key as keyof SettingsForm}
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-1">
                        <div className="space-y-0.5">
                          <FormLabel className="text-[12px] font-medium text-slate-800">{item.label}</FormLabel>
                          <FormDescription className="max-w-[260px] text-[11px] leading-normal text-slate-400 md:max-w-md">
                            {item.desc}
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            className="origin-right scale-75"
                            checked={!!field.value}
                            onCheckedChange={(checked) => {
                              field.onChange(checked);
                              handleLiveChange(item.key as keyof SettingsForm, checked);
                            }}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                ))}
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
