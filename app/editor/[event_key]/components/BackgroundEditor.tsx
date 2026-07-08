"use client";

import { useForm, FormProvider } from "react-hook-form";
import { usePreviewDraft } from "../PreviewDraftContext";
import { useSaveEventSection } from "../../../../hooks/useEvents";
import { Button } from "../../../../components/ui/button";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "../../../../components/ui/form";
import { RadioGroup, RadioGroupItem } from "../../../../components/ui/radio-group";
import { cn } from "../../../../utils/utils";
import { ThemeKey, THEMES } from "../../../[event_key]/invites/core/config/themeConfigs";
import { BACKGROUND_PRESETS } from "../../../../public/constants/Presets";
import { Image, Save, X } from "lucide-react";
import { HorizontalScroll } from "../../../../components/ui/HorizontalScroll";
import { Slider } from "../../../../components/ui/Slider";
import EditorHeader from "./EditorHeader";

/* ---------------- TYPES ---------------- */

type BackgroundType = "solid" | "image";
type DesignForm = {
  background_type: BackgroundType;
  background_overlay_opacity?: number;
  theme_mode: ThemeKey;
  background_image?: string;
};

/* ---------------- LABEL MAP ---------------- */

const CONTROL_LABELS: Record<keyof DesignForm, string> = {
  background_type: "Background Style",
  background_image: "Background Image",
  background_overlay_opacity: "Overlay Transparency",
  theme_mode: "Background Color",
};

const THEME_TITLES: Record<ThemeKey, string> = {
  "Rose & Cream": "Rose & Cream",
  "Navy & Gold": "Navy & Gold",
  "Sky Blue": "Sky Blue",
  "Blush Pink": "Blush Pink",
  "Mint Green": "Mint Green",
  "Warm Ivory": "Warm Ivory",
};

/* ---------------- COMPONENT ---------------- */

export default function BackgroundEditor({ eventKey, onBack }: { eventKey: string; onBack: () => void }) {
  /* ---------------- HOOKS ---------------- */

  const { draft, replaceSection, resetDraft, refreshEvent } = usePreviewDraft();
  const eventId = draft.invite.id;
  const mutation = useSaveEventSection(eventKey, eventId);

  /* ---------------- FORM ---------------- */

  const form = useForm<DesignForm>({
    defaultValues: {
      ...draft.theme,
      theme_mode: draft.theme.theme_mode ?? "Rose & Cream",
      background_type: draft.theme.background_type ?? "solid",
      background_overlay_opacity: draft.theme.background_overlay_opacity ?? 45,
    },
  });

  /* ---------------- WATCHERS ---------------- */

  const backgroundType = form.watch("background_type");

  /* ---------------- HANDLERS ---------------- */

  function handleLiveChange<K extends keyof DesignForm>(key: K, value: DesignForm[K]) {
    const latest = form.getValues();
    const nextSettings: any = {
      ...latest,
      [key]: value,
    };

    // Read from the shared draft context instead of the local form object
    if (key === "theme_mode" && value === "Navy & Gold") {
      if (draft.theme?.accent_color === "charcoal") {
        nextSettings.accent_color = "sage";
        // No need to run form.setValue("accent_color") here because
        // accent_color isn't controlled by this specific form component.
      }
    }
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

  return (
    <div className="animate-in fade-in flex h-full flex-col rounded-lg duration-500 md:rounded-none">
      <EditorHeader title="Theme Settings" handleCancel={handleCancel} />

      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-1 flex-col justify-between space-y-5 p-5 pb-0 md:min-h-[calc(100dvh-115px)] md:rounded-none [&::-webkit-scrollbar]:h-0 [&::-webkit-scrollbar]:w-[2px] [&::-webkit-scrollbar-thumb]:rounded-[10px] [&::-webkit-scrollbar-thumb]:bg-[#c1c1c1] [&::-webkit-scrollbar-track]:rounded-[10px] [&::-webkit-scrollbar-track]:bg-[#78909C]"
        >
          <section className="space-y-6 [&>*:last-child]:mb-6">
            {/* ── 1. BACKGROUND STYLE ── */}
            <FormField
              control={form.control}
              name="background_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Background</FormLabel>
                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      onValueChange={(type: "solid" | "image") => {
                        field.onChange(type);
                        handleLiveChange("background_type", type);

                        if (type === "solid") {
                          form.setValue("background_image", undefined);
                          handleLiveChange("background_image", undefined);
                        }

                        if (type === "image") {
                          const first = BACKGROUND_PRESETS[0];
                          form.setValue("background_image", first.url);
                          handleLiveChange("background_image", first.url);
                          if (first.themeMode) {
                            form.setValue("theme_mode", first.themeMode);
                            handleLiveChange("theme_mode", first.themeMode);
                          }
                        }
                      }}
                      className="grid grid-cols-2 gap-3"
                    >
                      {(["solid", "image"] as const).map((type) => (
                        <div key={type}>
                          <label
                            htmlFor={`bg-type-${type}`}
                            className={cn(
                              "flex h-28 cursor-pointer flex-col justify-between rounded-lg border p-4 transition-all",
                              field.value === type
                                ? "border-slate-900 bg-slate-900 text-white shadow-lg"
                                : "border-slate-100 bg-white text-slate-500 hover:border-slate-200",
                            )}
                          >
                            <div className="flex w-full items-center justify-between">
                              <div>
                                {type === "solid" ? (
                                  <div className={cn("h-5 w-5 rounded-sm", field.value === type ? "bg-white/30" : "bg-slate-300")} />
                                ) : (
                                  <Image
                                    className={cn("h-5 w-5", field.value === type ? "text-white/70" : "text-slate-400")}
                                    strokeWidth={1.5}
                                  />
                                )}
                              </div>
                              <RadioGroupItem value={type} id={`bg-type-${type}`} className="hidden" />
                            </div>
                            <span
                              className={cn(
                                "text-[11px] font-bold tracking-widest uppercase",
                                field.value === type ? "text-white" : "text-slate-400",
                              )}
                            >
                              {type === "solid" ? "Solid Color" : "Photo"}
                            </span>
                          </label>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />
            {/* ── BACKGROUND IMAGE ── */}
            {backgroundType === "image" && (
              <FormField
                control={form.control}
                name="background_image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Background Image</FormLabel>

                    <FormControl>
                      <HorizontalScroll>
                        {BACKGROUND_PRESETS.map((bg) => {
                          const active = field.value === bg.url;

                          return (
                            <label
                              key={bg.id}
                              htmlFor={bg.id}
                              className={cn(
                                "shrink-0 cursor-pointer rounded-md border px-3 py-3 capitalize transition-all duration-300",
                                active
                                  ? "border-slate-900 bg-slate-900 text-white shadow-lg shadow-slate-200"
                                  : "border-slate-200 bg-white",
                              )}
                            >
                              <input
                                id={bg.id}
                                type="radio"
                                value={bg.url}
                                checked={active}
                                onChange={() => {
                                  field.onChange(bg.url);
                                  handleLiveChange("background_image", bg.url);

                                  if (bg.themeMode) {
                                    form.setValue("theme_mode", bg.themeMode);

                                    handleLiveChange("theme_mode", bg.themeMode);
                                  }
                                }}
                                className="hidden"
                              />

                              <div className="relative h-[8rem] w-[6rem] overflow-hidden rounded-[14px]">
                                <img
                                  src={bg.url}
                                  alt=""
                                  className={cn(
                                    "h-full w-full object-cover transition-all duration-300",
                                    active ? "scale-[1.02]" : "hover:scale-[1.03]",
                                  )}
                                />

                                {active && <div className="absolute inset-0 bg-black/10" />}
                              </div>
                            </label>
                          );
                        })}
                      </HorizontalScroll>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {/* ── COLOR THEME ── */}
            <FormField
              control={form.control}
              name="theme_mode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{backgroundType === "image" ? "Overlay Color" : "Background Color"}</FormLabel>
                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      onValueChange={(val) => {
                        field.onChange(val);
                        handleLiveChange("theme_mode", val as ThemeKey);
                      }}
                      className="grid grid-cols-1"
                    >
                      <HorizontalScroll>
                        {(Object.keys(THEMES) as ThemeKey[]).map((themeKey) => {
                          const theme = THEMES[themeKey];
                          const active = field.value === themeKey;

                          return (
                            <label
                              key={themeKey}
                              htmlFor={`theme-${themeKey}`}
                              className={cn(
                                "shrink-0 cursor-pointer rounded-md border px-3 py-3 capitalize transition-all duration-300",
                                active
                                  ? "border-slate-900 bg-slate-900 text-white shadow-lg shadow-slate-200"
                                  : "border-slate-200 bg-white",
                              )}
                            >
                              <RadioGroupItem value={themeKey} id={`theme-${themeKey}`} className="hidden" />

                              <div className="mb-2 flex items-center justify-between md:mb-6">
                                <div className="flex items-center gap-1">
                                  <div
                                    className="h-3 w-3 rounded-full border border-white/20 md:h-4 md:w-4"
                                    style={{
                                      backgroundColor: theme.bg.page,
                                    }}
                                  />

                                  <div
                                    className="h-3 w-3 rounded-full border border-white/20 md:h-4 md:w-4"
                                    style={{
                                      backgroundColor: theme.surfaceTokens.card,
                                    }}
                                  />

                                  <div
                                    className="h-3 w-3 rounded-full border border-white/20 md:h-4 md:w-4"
                                    style={{
                                      backgroundColor: theme.surfaceTokens.overlay,
                                    }}
                                  />
                                </div>
                              </div>

                              <div>
                                <p className="truncate text-[0.6rem] tracking-wide capitalize md:text-[0.7rem]">{THEME_TITLES[themeKey]}</p>
                              </div>
                            </label>
                          );
                        })}
                      </HorizontalScroll>
                    </RadioGroup>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            {/* ── OVERLAY OPACITY ── */}
            {backgroundType === "image" && (
              <FormField
                control={form.control}
                name="background_overlay_opacity"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>{CONTROL_LABELS.background_overlay_opacity}</FormLabel>
                      <FormLabel>{field.value ?? 45}%</FormLabel>
                    </div>
                    <Slider
                      value={[field.value ?? 45]}
                      max={100}
                      step={5}
                      onValueChange={(val) => {
                        field.onChange(val[0]);
                        handleLiveChange("background_overlay_opacity", val[0]);
                      }}
                    />
                  </FormItem>
                )}
              />
            )}
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
              className="h-8 rounded-md bg-slate-900 px-10 py-2 text-xs text-white shadow-slate-200 transition-all hover:bg-slate-800 active:scale-95 disabled:opacity-50"
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
