"use client";

import { useForm, FormProvider } from "react-hook-form";
import { usePreviewDraft } from "../PreviewDraftContext";
import { useSaveEventSection } from "../../../../hooks/useEvents";
import { Button } from "../../../../components/ui/button";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "../../../../components/ui/form";
import { RadioGroup, RadioGroupItem } from "../../../../components/ui/radio-group";
import { cn } from "../../../../utils/utils";
import {
  ACCENT_FONTS,
  AccentFontKey,
  TYPOGRAPHY_FONTS,
  TypographyFontKey,
} from "../../../[event_key]/invites/core/config/themeConfigs";
import { Save, X } from "lucide-react";
import { HorizontalScroll } from "../../../../components/ui/HorizontalScroll";
import { Slider } from "../../../../components/ui/Slider";
import EditorHeader from "./EditorHeader";

/* ---------------- TYPES ---------------- */

type DesignForm = {
  accent_font_size?: number;
  typography_font_size?: number;
  accent_font: AccentFontKey;
  typography_font: TypographyFontKey;
};

/* ---------------- LABEL MAP ---------------- */

const CONTROL_LABELS: Record<keyof DesignForm, string> = {
  accent_font_size: "Heading Font Size",
  typography_font_size: "Body Font Size",
  accent_font: "Heading Font",
  typography_font: "Body Font",
};


/* ---------------- COMPONENT ---------------- */

export default function FontEditor({ eventKey, onBack }: { eventKey: string; onBack: () => void }) {
  /* ---------------- HOOKS ---------------- */

  const { draft, replaceSection, resetDraft, refreshEvent } = usePreviewDraft();
  const eventId = draft.invite.id;
  const mutation = useSaveEventSection(eventKey, eventId);

  /* ---------------- FORM ---------------- */

  const form = useForm<DesignForm>({
    defaultValues: {
      ...draft.theme,
      accent_font_size: draft.theme.accent_font_size ?? 32,
      typography_font_size: draft.theme.typography_font_size ?? 16,
      accent_font: draft.theme.accent_font ?? "Pinyon Script",
      typography_font: draft.theme.typography_font ?? "Pinyon Script",
    },
  });


  /* ---------------- DERIVED VALUES ---------------- */

  const ACCENT_FONT_KEYS = Object.keys(ACCENT_FONTS) as AccentFontKey[];
  const TYPOGRAPHY_FONT_KEYS = Object.keys(TYPOGRAPHY_FONTS) as TypographyFontKey[];

  /* ---------------- HANDLERS ---------------- */

  function handleLiveChange<K extends keyof DesignForm>(key: K, value: DesignForm[K]) {
    const latest = form.getValues();
    const nextSettings = {
      ...latest,
      [key]: value,
    };
    replaceSection("theme", nextSettings);
  }

  async function handleSaveSuccess() {
    await refreshEvent(eventKey);
    onBack();
  }

  function handleCancel() {
    resetDraft();
    onBack();
  }

  function onSubmit(values: DesignForm) {
    mutation.mutate(
      {
        path: "theme",
        stage: "theme",
        data: values,
      },
      {
        onSuccess: handleSaveSuccess,
      },
    );
  }

  /* ---------------- FONT SELECTOR CARD ---------------- */

  type FontSelectorCardProps = {
    id: string;
    value: string;
    active: boolean;
    previewFont: string;
    label: string;
  };

  function FontSelectorCard({ id, value, active, previewFont, label }: FontSelectorCardProps) {
    return (
      <label
        htmlFor={id}
        className={cn(
          "relative min-w-[80px] shrink-0 cursor-pointer rounded-lg border p-3 transition-all duration-300 focus-within:ring-2 focus-within:ring-slate-400 md:min-w-[110px] md:p-5",
          active
            ? "border-slate-900 bg-slate-900 text-white shadow-xl shadow-slate-200"
            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50",
        )}
      >
        <RadioGroupItem value={value} id={id} aria-label={label} className="hidden" />
        <div className="mb-2 flex items-center justify-between md:mb-6">
          <div
            className={cn("mdtext-2xl text-xl leading-none", active ? "text-white" : "text-slate-700")}
            style={{
              fontFamily: previewFont,
            }}
          >
            Ag
          </div>
        </div>
        <div>
          <p
            className={cn(
              "font-regular line-clamp-2 text-[10px] leading-tight tracking-wider break-words capitalize",
              active ? "text-white/80" : "text-slate-500",
            )}
            style={{
              fontFamily: previewFont,
            }}
          >
            {label}
          </p>
        </div>
      </label>
    );
  }
  return (
    <div className="animate-in fade-in flex h-full flex-col rounded-lg duration-500 md:rounded-none">
      <EditorHeader title="Font Settings" handleCancel={handleCancel} />

      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-1 flex-col justify-between space-y-5 p-5 pb-0 md:min-h-[calc(100dvh-115px)] md:rounded-none [&::-webkit-scrollbar]:h-0 [&::-webkit-scrollbar]:w-[2px] [&::-webkit-scrollbar-thumb]:rounded-[10px] [&::-webkit-scrollbar-thumb]:bg-[#c1c1c1] [&::-webkit-scrollbar-track]:rounded-[10px] [&::-webkit-scrollbar-track]:bg-[#78909C]"
        >
          <section className="space-y-6 [&>*:last-child]:mb-6">
            
            {/* ── TYPOGRAPHY & FONTS ── */}
            <FormField
              control={form.control}
              name="accent_font"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{CONTROL_LABELS.accent_font}</FormLabel>

                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      onValueChange={(val) => {
                        field.onChange(val);
                        handleLiveChange("accent_font", val as AccentFontKey);
                      }}
                      className="grid grid-cols-1"
                    >
                      <HorizontalScroll>
                        {ACCENT_FONT_KEYS.map((fontKey) => {
                          const font = ACCENT_FONTS[fontKey];
                          const active = field.value === fontKey;

                          return (
                            <FontSelectorCard
                              key={fontKey}
                              id={`accent-font-${fontKey}`}
                              value={fontKey}
                              active={active}
                              previewFont={font.accent}
                              label={fontKey}
                            />
                          );
                        })}
                      </HorizontalScroll>
                    </RadioGroup>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="typography_font"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{CONTROL_LABELS.typography_font}</FormLabel>

                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      onValueChange={(val) => {
                        field.onChange(val);
                        handleLiveChange("typography_font", val as TypographyFontKey);
                      }}
                      className="grid grid-cols-1"
                    >
                      <HorizontalScroll>
                        {TYPOGRAPHY_FONT_KEYS.map((fontKey) => {
                          const font = TYPOGRAPHY_FONTS[fontKey];
                          const active = field.value === fontKey;

                          return (
                            <FontSelectorCard
                              key={fontKey}
                              id={`typography-font-${fontKey}`}
                              value={fontKey}
                              active={active}
                              previewFont={font.primary}
                              label={fontKey}
                            />
                          );
                        })}
                      </HorizontalScroll>
                    </RadioGroup>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Font Sizes */}
            <FormField
              control={form.control}
              name="accent_font_size"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>{CONTROL_LABELS.accent_font_size}</FormLabel>
                    <FormLabel>{form.watch("accent_font_size") ?? 32}px</FormLabel>
                  </div>
                  <Slider
                    className="my-[3px]"
                    min={12}
                    max={100}
                    step={1}
                    value={[form.watch("accent_font_size") ?? 32]}
                    onValueChange={([val]) => {
                      form.setValue("accent_font_size", val, {
                        shouldValidate: true,
                      });
                    }}
                    onValueCommit={([val]) => {
                      handleLiveChange("accent_font_size", val);
                    }}
                  />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="typography_font_size"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>{CONTROL_LABELS.typography_font_size}</FormLabel>
                    <FormLabel>{form.watch("typography_font_size") ?? 16}px</FormLabel>
                  </div>

                  <Slider
                    className="my-[3px]"
                    min={8}
                    max={40}
                    step={1}
                    value={[form.watch("typography_font_size") ?? 16]}
                    onValueChange={([val]) => {
                      form.setValue("typography_font_size", val, {
                        shouldValidate: true,
                      });
                    }}
                    onValueCommit={([val]) => {
                      handleLiveChange("typography_font_size", val);
                    }}
                  />
                </FormItem>
              )}
            />
          </section>

          {/* Sticky Footer */}
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
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
