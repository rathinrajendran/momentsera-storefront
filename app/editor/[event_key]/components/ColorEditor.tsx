"use client";

import { useForm, FormProvider } from "react-hook-form";
import { usePreviewDraft } from "../PreviewDraftContext";
import { useSaveEventSection } from "../../../../hooks/useEvents";
import { Button } from "../../../../components/ui/button";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "../../../../components/ui/form";
import { RadioGroup, RadioGroupItem } from "../../../../components/ui/radio-group";
import { cn } from "../../../../utils/utils";
import {
  ACCENT_COLORS,
  TYPOGRAPHY_COLORS,
  TypographyColorKey,
  THEME_ACCENT_RULES,
  ThemeKey,
} from "../../../[event_key]/invites/core/config/themeConfigs";
import { Save, X } from "lucide-react";
import { HorizontalScroll } from "../../../../components/ui/HorizontalScroll";
import EditorHeader from "./EditorHeader";

/* ---------------- TYPES ---------------- */

type DesignForm = {
  theme_mode: ThemeKey; // Included theme_mode to support watch configuration safely
  accent_color: keyof typeof ACCENT_COLORS;
  typography_color: TypographyColorKey;
};

/* ---------------- COMPONENT ---------------- */

export default function ColorEditor({ eventKey, onBack }: { eventKey: string; onBack: () => void }) {
  /* ---------------- HOOKS ---------------- */

  const { draft, replaceSection, resetDraft, refreshEvent } = usePreviewDraft();
  const eventId = draft.invite.id;
  const mutation = useSaveEventSection(eventKey, eventId);

  /* ---------------- FORM ---------------- */

  const form = useForm<DesignForm>({
    defaultValues: {
      ...draft.theme,
      theme_mode: draft.theme.theme_mode ?? "Rose & Cream",
      accent_color: draft.theme.accent_color ?? "sage",
      typography_color: draft.theme.typography_color ?? "Rose & Cream",
    },
  });

  /* ---------------- WATCHERS ---------------- */

  const currentTheme = form.watch("theme_mode");

  /* ---------------- HANDLERS ---------------- */

  function handleLiveChange<K extends keyof DesignForm>(key: K, value: DesignForm[K]) {
    const latest = form.getValues();
    const nextSettings = {
      ...latest,
      [key]: value,
    };
    if (key === "theme_mode" && value === "Navy & Gold") {
      if (latest.accent_color === "charcoal") {
        nextSettings.accent_color = "sage";
        form.setValue("accent_color", "sage");
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
            {/* ── ACCENT COLOR ── */}
            <FormField
              control={form.control}
              name="accent_color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Accent Color</FormLabel>
                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      onValueChange={(val) => {
                        field.onChange(val);
                        handleLiveChange("accent_color", val as keyof typeof ACCENT_COLORS);
                      }}
                      className="grid grid-cols-1"
                    >
                      <HorizontalScroll>
                        {(THEME_ACCENT_RULES[currentTheme as ThemeKey] ?? [])
                          .filter((accentKey) => !(currentTheme === "Navy & Gold" && accentKey === "charcoal"))
                          .map((accentKey) => {
                            const accent = ACCENT_COLORS[accentKey];
                            const active = field.value === accentKey;

                            return (
                              <label
                                key={accentKey}
                                htmlFor={`accent-${accentKey}`}
                                className={cn(
                                  "shrink-0 cursor-pointer rounded-md border px-3 py-3 capitalize transition-all duration-300",
                                  active
                                    ? "border-slate-900 bg-slate-900 text-white shadow-lg shadow-slate-200"
                                    : "border-slate-200 bg-white",
                                )}
                              >
                                <RadioGroupItem value={accentKey} id={`accent-${accentKey}`} className="hidden" />

                                <div className="mb-4 flex items-center justify-center">
                                  <div className="flex items-center gap-2 rounded-full border border-white/20">
                                    <div
                                      className={cn(
                                        "h-9 w-9 rounded-full border-2 transition-all",
                                        active ? "scale-105 border-white shadow-sm" : "border-transparent",
                                      )}
                                      style={{
                                        backgroundColor: accent,
                                      }}
                                    />
                                  </div>
                                </div>

                                <div>
                                  <p
                                    className={cn(
                                      "truncate text-center text-[11px] font-bold tracking-wide uppercase",
                                      active ? "text-white/90" : "text-slate-500",
                                    )}
                                  >
                                    {accentKey.replace(/_/g, " ")}
                                  </p>
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

            {/* ── TYPOGRAPHY COLOR ── */}
            <FormField
              control={form.control}
              name="typography_color"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FormLabel>Typography Color</FormLabel>
                  </div>

                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      onValueChange={(val) => {
                        field.onChange(val);
                        handleLiveChange("typography_color", val as TypographyColorKey);
                      }}
                      className="grid grid-cols-1"
                    >
                      <HorizontalScroll>
                        {(Object.keys(TYPOGRAPHY_COLORS) as TypographyColorKey[]).map((paletteKey) => {
                          const colors = TYPOGRAPHY_COLORS[paletteKey];
                          const active = field.value === paletteKey;

                          return (
                            <label
                              key={paletteKey}
                              htmlFor={`palette-${paletteKey}`}
                              className={cn(
                                "shrink-0 cursor-pointer rounded-md border px-3 py-3 capitalize transition-all duration-300",
                                active
                                  ? "border-slate-900 bg-slate-900 text-white shadow-lg shadow-slate-200"
                                  : "border-slate-200 bg-white",
                              )}
                            >
                              <RadioGroupItem value={paletteKey} id={`palette-${paletteKey}`} className="hidden" />

                              <div className="mb-2 flex items-center justify-between md:mb-6">
                                <div className="flex items-center gap-1.5">
                                  <div
                                    className="h-3 w-3 rounded-full border border-white/20 md:h-4 md:w-4"
                                    style={{
                                      backgroundColor: colors.heading,
                                    }}
                                  />

                                  <div
                                    className="h-3 w-3 rounded-full border border-white/20 md:h-4 md:w-4"
                                    style={{
                                      backgroundColor: colors.primary,
                                    }}
                                  />

                                  <div
                                    className="h-3 w-3 rounded-full border border-white/20 md:h-4 md:w-4"
                                    style={{
                                      backgroundColor: colors.secondary,
                                    }}
                                  />
                                </div>
                              </div>

                              <div>
                                <p
                                  className={cn(
                                    "truncate text-[0.6rem] tracking-wide capitalize md:text-[0.7rem]",
                                    active ? "text-white/90" : "text-slate-500",
                                  )}
                                >
                                  {paletteKey}
                                </p>
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
