"use client";

import { useForm, FormProvider } from "react-hook-form";
import {
  Eye,
  Calendar,
  MousePointerClick,
  Save,
  X,
  Globe,
  BarChart3,
  Clock,
  CalendarDays,
  ShieldCheck,
  HeartHandshake,
  Languages,
  CalendarCheck,
  Timer,
  MapPin,
} from "lucide-react";
import { usePreviewDraft } from "../PreviewDraftContext";
import { useSaveEventSection } from "../../../../hooks/useEvents";
import { Button } from "../../../../components/ui/button";
import { Switch } from "../../../../components/ui/switch";
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "../../../../components/ui/form";
import { Input } from "../../../../components/ui/input";
import { CustomDatePicker } from "../../../../components/ui/CustomDatePicker";
import { HorizontalScroll } from "../../../../components/ui/HorizontalScroll";
import { cn } from "../../../../utils/utils";
import EditorHeader from "./EditorHeader";
import { SectionHeader } from "./MusicEditor";

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

export default function SettingsEditor({ onBack, eventKey }: { onBack: () => void; eventKey: string }) {
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
      <EditorHeader title="Event Preferences" handleCancel={handleCancel} />

      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-1 flex-col justify-between space-y-6 p-5 pb-0 md:min-h-[calc(100dvh-115px)] md:rounded-none [&::-webkit-scrollbar]:h-0 [&::-webkit-scrollbar]:w-[2px] [&::-webkit-scrollbar-thumb]:rounded-[10px] [&::-webkit-scrollbar-thumb]:bg-[#c1c1c1] [&::-webkit-scrollbar-track]:rounded-[10px] [&::-webkit-scrollbar-track]:bg-[#78909C]"
        >
          <section className="space-y-6 [&>*:last-child]:mb-6">
            {/* 1. INVITATION EXPIRY PRESET CARDS */}
            <div className="space-y-2">
              <SectionHeader icon={Clock} label="Invitation Link Expiration" />
              <HorizontalScroll>
                <div className="flex gap-3 pb-2">
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
                  <FormItem className="animate-in slide-in-from-top-2 space-y-1.5 rounded-xl border border-slate-100 bg-slate-50/20 p-4 duration-200">
                    <FormLabel className="text-[11px] font-medium text-slate-700">Choose Custom Link Deactivation Date</FormLabel>
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

            {/* 2. LANGUAGE SELECTOR SCROLL CARDS */}
            <div className="space-y-2 pt-1">
              <SectionHeader icon={Languages} label="Primary Interface Language" />
              <HorizontalScroll>
                <div className="flex gap-3 pb-2">
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

            {/* 3. DATE FORMAT PRESET CARDS */}
            <div className="space-y-2 pt-1">
              <SectionHeader icon={CalendarCheck} label="Date Structure Format" />
              <HorizontalScroll>
                <div className="flex gap-3 pb-2">
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

            {/* 4. TIME FORMAT PRESET CARDS */}
            <div className="space-y-2 pt-1">
              <SectionHeader icon={Timer} label="Time Display System" />
              <HorizontalScroll>
                <div className="flex gap-3 pb-2">
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

            {/* 5. TIMEZONE SELECTOR PRESET CARDS */}
            <div className="space-y-2 pt-1">
              <SectionHeader icon={MapPin} label="Schedule Timezone Synchronization" />
              <HorizontalScroll>
                <div className="flex gap-3 pb-2">
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

            {/* TOGGLES / SWITCHES CONTAINER */}
            <div className="space-y-4 border-t border-slate-100 pt-4">
              <SectionHeader icon={ShieldCheck} label="Privacy & Telemetry Controls" />

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
                    <FormItem className="flex items-center justify-between space-x-4 border-b border-slate-50/80 pb-3 last:border-none">
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

          {/* STICKY FOOTER ACTIONS */}
          <div className="sticky bottom-0 z-[99] -m-5 flex h-[60px] items-center justify-end gap-3 border-slate-100 bg-white/90 px-5 md:border-t md:backdrop-blur-md">
            <Button
              type="button"
              variant="ghost"
              onClick={handleCancel}
              className="text-xs font-semibold text-slate-400 transition-colors hover:text-slate-900"
            >
              <X strokeWidth={1} size={14} className="mr-1" />
              <span>Discard</span>
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="flex h-8 items-center gap-1.5 rounded-md bg-slate-900 px-10 py-2 text-xs text-white shadow-md shadow-slate-100 transition-all hover:bg-slate-800 active:scale-95 disabled:opacity-50"
            >
              <Save strokeWidth={1.5} size={14} />
              {mutation.isPending ? <span className="font-medium">Updating...</span> : <span className="font-medium">Save</span>}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
