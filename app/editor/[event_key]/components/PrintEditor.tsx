"use client";

import { useRef, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";

import { cn } from "../../../../utils/utils";

import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Slider } from "../../../../components/ui/Slider";
import { Switch } from "../../../../components/ui/switch";

import { usePreviewDraft } from "../PreviewDraftContext";
import { useSaveEventSection } from "../../../../hooks/useEvents";

import {
  ChevronLeft,
  FileImage,
  FileText,
  Smartphone,
  Square,
  RectangleHorizontal,
  ScanLine,
  X,
  Icon,
  PictureInPicture,
  PhoneOutgoing,
  Save,
} from "lucide-react";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../../../components/ui/accordion";

import { HorizontalScroll } from "../../../../components/ui/HorizontalScroll";

import Catalog from "../../../[event_key]/invites/catalog/page";
import { FormControl, FormField, FormItem, FormLabel } from "../../../../components/ui/form";

import EditorHeader from "./EditorHeader";
import { SectionHeader } from "./MusicEditor";

type PrintForm = {
  enable: boolean;
  cardSize: string;
  exportType: string;
  quality: string;
  includes: string[];
  customTitle: string;
  padding: number;
};

const CARD_SIZES = [
  {
    id: "portrait",
    label: "Portrait",
    icon: Smartphone,
    className: "aspect-[9/16]",
  },
  {
    id: "square",
    label: "Square",
    icon: Square,
    className: "aspect-square",
  },
  {
    id: "landscape",
    label: "Landscape",
    icon: RectangleHorizontal,
    className: "aspect-[16/9]",
  },
  {
    id: "story",
    label: "Story",
    icon: ScanLine,
    className: "aspect-[9/16]",
  },
];

const EXPORT_FORMATS = [
  {
    id: "jpg",
    label: "JPG",
    icon: FileImage,
  },
  {
    id: "pdf",
    label: "PDF",
    icon: FileText,
  },
];

const QUALITY_OPTIONS = ["Standard", "HD", "Print", "4K"];

const INCLUDE_OPTIONS = ["Banner", "Events", "Gallery", "Venue", "Couple Names", "Message"];

export default function PrintEditor({ eventKey, onBack }: { eventKey: string; onBack: () => void }) {
  const { draft, replaceSection, resetDraft } = usePreviewDraft();

  const exportRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(false);

  const eventId = draft.invite.id;

  const mutation = useSaveEventSection(eventKey, eventId);

  const form = useForm<PrintForm>({
    defaultValues: {
      ...draft.print,

      enable: draft.print?.enable ?? false,

      cardSize: draft.print?.cardSize ?? "portrait",

      exportType: draft.print?.exportType ?? "jpg",

      quality: draft.print?.quality ?? "HD",

      includes: draft.print?.includes ?? INCLUDE_OPTIONS,

      customTitle: draft.print?.customTitle ?? "Wedding Invitation",

      padding: draft.print?.padding ?? 24,
    },
  });

  const enable = form.watch("enable");

  const cardSize = form.watch("cardSize");

  const exportType = form.watch("exportType");

  const quality = form.watch("quality");

  const includes = form.watch("includes");

  const customTitle = form.watch("customTitle");

  const padding = form.watch("padding");

  const activeSize = CARD_SIZES.find((s) => s.id === cardSize);

  /* ---------------- LIVE PREVIEW ---------------- */

  function handleLiveChange<K extends keyof PrintForm>(key: K, value: PrintForm[K]) {
    const latest = form.getValues();

    replaceSection("print", {
      ...latest,
      [key]: value,
    });
  }

  /* ---------------- TOGGLE INCLUDE ---------------- */

  function toggleInclude(value: string) {
    const next = includes.includes(value) ? includes.filter((i) => i !== value) : [...includes, value];

    form.setValue("includes", next);

    handleLiveChange("includes", next);
  }

  /* ---------------- SAVE ---------------- */

  function onSubmit(values: PrintForm) {
    mutation.mutate(
      {
        path: "print",
        stage: "print",
        data: values,
      },
      {
        onSuccess: () => onBack(),
      },
    );
  }

  /* ---------------- CANCEL ---------------- */

  function handleCancel() {
    resetDraft();
    onBack();
  }

  /* ---------------- DOWNLOAD ---------------- */

  async function handleDownload() {
    if (!exportRef.current) return;

    try {
      setLoading(true);

      // html2canvas + jsPDF export logic
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="animate-in fade-in flex h-full flex-col rounded-lg duration-500 md:rounded-none">
      <EditorHeader title="Print" handleCancel={handleCancel} />

      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-1 flex-col justify-between space-y-5 p-5 pb-0 md:min-h-[calc(100dvh-115px)] md:rounded-none [&::-webkit-scrollbar]:h-0 [&::-webkit-scrollbar]:w-[2px] [&::-webkit-scrollbar-thumb]:rounded-[10px] [&::-webkit-scrollbar-thumb]:bg-[#c1c1c1] [&::-webkit-scrollbar-track]:rounded-[10px] [&::-webkit-scrollbar-track]:bg-[#78909C]"
        >
          <section className="space-y-6 [&>*:last-child]:mb-6">
            {/* LIVE PREVIEW */}
            {/* <FormField
              control={form.control}
              name="enabled"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="capitalize mb-0 text-[0.7rem] font-medium tracking-normal text-[#424242]">Print</span>
                      <p className="capitalize mb-0 text-[0.6rem] font-light tracking-wide text-slate-500">
                        {enable ? "Invitation card" : "Web invitation"}
                      </p>
                    </div>
                    <FormControl>
                      <Switch
                        checked={enable}
                        onCheckedChange={(checked) => {
                          form.setValue("enable", checked);

                          handleLiveChange("enable", checked);
                        }}
                      />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            /> */}
            <SectionHeader icon={PictureInPicture} label="Invitation card" />
            <div className="grid gap-1">
              <FormLabel className="capitalize font-regular mb-0 text-[0.7rem] tracking-normal text-[#424242]">Invitation Title</FormLabel>
              <Input
                value={customTitle}
                onChange={(e) => {
                  form.setValue("customTitle", e.target.value);

                  handleLiveChange("customTitle", e.target.value);
                }}
                placeholder="Wedding Invitation"
              />
            </div>
            <div className="grid gap-1">
              <FormLabel className="capitalize font-regular mb-0 text-[0.7rem] tracking-normal text-[#424242]">Export Format</FormLabel>

              <HorizontalScroll>
                {EXPORT_FORMATS.map((item) => {
                  const Icon = item.icon;

                  const active = exportType === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        form.setValue("exportType", item.id);

                        handleLiveChange("exportType", item.id);
                      }}
                      className={cn(
                        "relative flex min-h-[8rem] min-w-[6rem] cursor-pointer flex-col justify-between rounded-md border p-3 transition-all hover:bg-gray-50",
                        active ? "border-slate-600 bg-white" : "border-slate-300 bg-white",
                      )}
                    >
                      <div className="flex w-full items-center justify-between">
                        <Icon className="h-5 w-5 text-gray-600" />

                        <div className={cn("h-4 w-4 rounded-full border", active ? "border-black bg-black" : "border-slate-300")} />
                      </div>

                      <div className="space-y-1 text-left">
                        <span className="block text-xs font-semibold text-slate-900">{item.label}</span>

                        <span className="block text-[10px] text-slate-500">
                          Download as
                          {item.label}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </HorizontalScroll>
            </div>
            {/* CARD LAYOUT */}
            <div className="grid gap-1">
              <span className="capitalize font-regular mb-0 text-[0.7rem] tracking-normal text-[#424242]">Card Layout</span>

              <HorizontalScroll>
                {CARD_SIZES.map((item) => {
                  const Icon = item.icon;

                  const active = cardSize === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        form.setValue("cardSize", item.id);

                        handleLiveChange("cardSize", item.id);
                      }}
                      className={cn(
                        "relative min-w-28 cursor-pointer rounded-2xl border p-5 text-left transition-all duration-300",
                        active
                          ? "border-slate-900 bg-slate-900 text-white shadow-xl shadow-slate-200"
                          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50",
                      )}
                    >
                      <div className="mb-6 flex items-center justify-between">
                        <div className={cn("flex items-center justify-center", active ? "text-white" : "text-slate-600")}>
                          <Icon size={18} strokeWidth={1.5} />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <p className={cn("text-[11px] leading-none font-bold capitalize", active ? "text-white" : "text-slate-700")}>
                          {item.label}
                        </p>

                        <p className={cn("text-[9px] leading-tight", active ? "text-white/60" : "text-slate-400")}>Printable layout</p>
                      </div>
                    </button>
                  );
                })}
              </HorizontalScroll>
            </div>
            {/* QUALITY */}
            <div className="grid gap-1">
              <label className="capitalize font-regular mb-0 text-[0.7rem] tracking-normal text-[#424242]">Export Quality</label>

              <div className="flex gap-1 rounded-md border border-slate-200 p-1">
                {QUALITY_OPTIONS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => {
                      form.setValue("quality", q);

                      handleLiveChange("quality", q);
                    }}
                    className={cn(
                      "flex-1 cursor-pointer rounded-md p-3 text-[0.7rem] transition-all",
                      quality === q ? "bg-black font-bold text-white" : "text-black",
                    )}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid gap-1">
              <label className="capitalize font-regular mb-0 text-[0.7rem] tracking-normal text-[#424242]">Include Sections</label>

              <div className="space-y-3">
                {INCLUDE_OPTIONS.map((item) => {
                  const active = includes.includes(item);

                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleInclude(item)}
                      className={cn(
                        "flex h-[52px] w-full items-center justify-between rounded-md border px-4 transition-all",
                        active ? "border-black bg-black text-white" : "border-slate-300 bg-white text-black",
                      )}
                    >
                      <span className="text-xs font-semibold">{item}</span>

                      <div className={cn("h-4 w-4 rounded-full border", active ? "border-white bg-white" : "border-slate-300")} />
                    </button>
                  );
                })}
              </div>
            </div>
            {/* PADDING */}
            <div className="grid gap-1">
              <div className="flex items-center justify-between">
                <span className="capitalize mb-0 text-[0.7rem] font-medium tracking-normal text-[#424242]">Card Spacing</span>
                <span className="capitalize mb-0 text-[0.7rem] font-medium tracking-normal text-[#424242]">{padding}px</span>
              </div>
              <Slider
                value={[padding]}
                max={60}
                step={2}
                onValueChange={(v) => {
                  form.setValue("padding", v[0]);
                  handleLiveChange("padding", v[0]);
                }}
              />
            </div>
            <SectionHeader icon={PhoneOutgoing} label="Share your photo" />
            {/* ENABLE */}
            <div className="flex items-center justify-between rounded-xl border border-slate-200 p-4">
              <div>
                <h3 className="text-sm font-semibold">Enable Photo Upload</h3>

                <p className="mt-1 text-xs text-slate-500">Allow guests to upload wedding memories</p>
              </div>

              <Switch
                checked={draft?.settings?.photo_upload_enable ?? false}
                onCheckedChange={(checked) => {
                  replaceSection("settings", {
                    ...draft?.settings,
                    photo_upload_enable: checked,
                  });
                }}
              />
            </div>

            {/* QR PREVIEW */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="border-b border-slate-100 p-5">
                <h3 className="text-sm font-bold uppercase">QR Preview</h3>

                <p className="mt-1 text-xs text-slate-500">Guests scan this QR to upload memories</p>
              </div>

              <div className="flex flex-col items-center justify-center p-6">
                <div className="grid h-[140px] w-[140px] grid-cols-6 gap-[3px] rounded-xl border border-slate-300 bg-white p-3">
                  {Array.from({
                    length: 36,
                  }).map((_, i) => (
                    <div key={i} className={Math.random() > 0.5 ? "rounded-[1px] bg-black" : "bg-white"} />
                  ))}
                </div>

                <h4 className="mt-5 text-center text-sm font-semibold">Upload Wedding Photos</h4>

                <p className="mt-2 max-w-[240px] text-center text-xs leading-5 text-slate-500">
                  Guests can scan this QR code during the event and upload photos instantly.
                </p>
              </div>
            </div>

            {/* TITLE */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-500 uppercase">Upload Section Title</label>

              <Input
                value={draft?.settings?.photo_upload_title ?? "Share Your Photos"}
                onChange={(e) => {
                  replaceSection("settings", {
                    ...draft?.settings,
                    photo_upload_title: e.target.value,
                  });
                }}
                placeholder="Share Your Photos"
              />
            </div>

            {/* DESCRIPTION */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-500 uppercase">Description</label>

              <Input
                value={draft?.settings?.photo_upload_description ?? "Upload your wedding memories"}
                onChange={(e) => {
                  replaceSection("settings", {
                    ...draft?.settings,
                    photo_upload_description: e.target.value,
                  });
                }}
                placeholder="Upload your wedding memories"
              />
            </div>
          </section>
          {/* ACTIONS */}
          <div className="sticky bottom-0 z-[99] -m-5 flex h-16 h-[60px] items-center justify-end gap-3 border-slate-100 bg-white/90 px-5 md:border-t md:backdrop-blur-md">
            <Button
              type="button"
              variant="ghost"
              onClick={handleCancel}
              className="text-xs font-semibold text-slate-400 transition-colors hover:text-slate-900"
            >
              <X strokeWidth={1} size={14} />
              <span>Discard</span>
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="hadow-slate-200 h-8 rounded-md bg-slate-900 px-10 py-2 text-xs text-white transition-all hover:bg-slate-800 active:scale-95 disabled:opacity-50"
            >
              <Save strokeWidth={1} />
              {mutation.isPending ? <span className="font-regular">Updating...</span> : <span className="font-regular">Save</span>}
            </Button>
            <Button
              type="submit"
              onClick={handleDownload}
              disabled={loading}
              className="hadow-slate-200 h-8 rounded-md bg-slate-900 px-10 py-2 text-xs text-white transition-all hover:bg-slate-800 active:scale-95 disabled:opacity-50"
            >
              <Save strokeWidth={1} />
              {loading ? (
                <span className="font-regular">Generating...</span>
              ) : (
                <span className="font-regular">{`Download ${exportType.toUpperCase()}`}</span>
              )}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
