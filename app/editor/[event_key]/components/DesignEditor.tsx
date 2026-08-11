"use client";

import { useForm, FormProvider } from "react-hook-form";
import { usePreviewDraft } from "../PreviewDraftContext";
import { useSaveEventSection } from "../../../../hooks/useEvents";

import { RadioGroup, RadioGroupItem } from "../../../../components/ui/radio-group";
import { BACKGROUND_PRESETS } from "../../../../public/constants/Presets";

import { HorizontalScroll } from "../../../../components/ui/HorizontalScroll";
import { Slider } from "../../../../components/ui/Slider";

/**
 * Single Design editor
 *
 * One file owns both:
 *   - Colors
 *   - Background
 *
 * Use `section="colors"` for the Colors screen and
 * `section="background"` for the Background screen.
 */
export type DesignEditorSection = "background" | "colors";

export type DesignEditorProps = {
  eventKey: string;
  onBack: () => void;
  section?: DesignEditorSection;
};

import {
  ThemeKey,
  THEMES,
  THEME_ACCENT_RULES,
  ACCENT_COLORS,
  TYPOGRAPHY_COLORS,
} from "../../../[event_key]/invites/core/config/themeConfigs";
import { Button } from "../../../../components/ui/button";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "../../../../components/ui/form";
import { cn } from "../../../../utils/utils";
import { Check, Palette, Save, Sparkles } from "lucide-react";
import EditorHeader from "./EditorHeader";

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

type ColorsForm = {
  theme_mode: ThemeKey;

  // Background
  primary?: string;
  secondary?: string;
  accent?: string;

  // Text
  text_primary: string;
  text_secondary: string;
  text_accent: string;
};

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

function isHex(value: unknown): value is string {
  return typeof value === "string" && /^#[0-9A-Fa-f]{6}$/.test(value);
}

function normalizeHex(value: unknown, fallback: string): string {
  return isHex(value) ? value.toUpperCase() : fallback;
}

function getDefaultBackgroundColors(themeKey: ThemeKey) {
  const theme = THEMES[themeKey];

  return {
    primary: normalizeHex(theme?.bg?.page, "#FFFDF9"),
    secondary: normalizeHex(theme?.bg?.section1 ?? theme?.bg?.section2, "#F8E8EC"),
    accent: getDefaultAccentColor(themeKey),
  };
}

function getDefaultAccentColor(themeKey: ThemeKey): string {
  const allowedAccents = THEME_ACCENT_RULES[themeKey] ?? [];
  const accentKey = allowedAccents[0];

  return accentKey ? normalizeHex(ACCENT_COLORS[accentKey], "#B4975A") : "#B4975A";
}

function getDefaultTextColors(themeKey: ThemeKey) {
  const colors = TYPOGRAPHY_COLORS[themeKey];

  return {
    primary: normalizeHex(colors?.primary, "#33302C"),
    secondary: normalizeHex(colors?.secondary, "#7C776E"),
    accent: normalizeHex(colors?.link, "#8A6F3C"),
  };
}

/* -------------------------------------------------------------------------- */
/* THEME CARD                                                                 */
/* -------------------------------------------------------------------------- */

function ThemeCard({ themeKey, active, onClick }: { themeKey: ThemeKey; active: boolean; onClick: () => void }) {
  const background = getDefaultBackgroundColors(themeKey);
  const text = getDefaultTextColors(themeKey);

  const backgroundSwatches = [background.primary, background.secondary, background.accent];

  const textSwatches = [text.primary, text.secondary, text.accent];

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative w-[168px] shrink-0 rounded-2xl border p-3 text-left transition-all duration-200",
        active
          ? "border-slate-900 bg-slate-900 text-white shadow-md"
          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50",
      )}
      aria-pressed={active}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className={cn("truncate text-[11px] font-semibold", active ? "text-white" : "text-slate-800")}>{themeKey}</p>

        <span
          className={cn(
            "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
            active ? "border-white bg-white text-slate-900" : "border-slate-200 bg-white text-transparent",
          )}
        >
          <Check className="h-3 w-3" strokeWidth={2.5} />
        </span>
      </div>

      <div className="space-y-2">
        <div>
          <p className={cn("mb-1 text-[8px] font-semibold tracking-wider uppercase", active ? "text-white/50" : "text-slate-400")}>
            Background
          </p>

          <div className="grid grid-cols-3 gap-1">
            {backgroundSwatches.map((color, index) => (
              <span
                key={`bg-${index}`}
                className="h-7 rounded-md border border-black/10"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>

        <div>
          <p className={cn("mb-1 text-[8px] font-semibold tracking-wider uppercase", active ? "text-white/50" : "text-slate-400")}>Text</p>

          <div className="grid grid-cols-3 gap-1">
            {textSwatches.map((color, index) => (
              <span
                key={`text-${index}`}
                className="h-5 rounded-md border border-black/10"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>
      </div>
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/* COLOR CONTROL                                                              */
/* -------------------------------------------------------------------------- */

function ColorControl({
  label,
  description,
  value,
  onChange,
}: {
  label: string;
  description: string;
  value?: string;
  onChange: (value: string) => void;
}) {
  const safeValue = normalizeHex(value, "#000000");

  return (
    <div className="space-y-3">
      <div>
        <FormLabel className="text-[14px] font-medium text-slate-900">{label}</FormLabel>

        <p className="mt-1 text-[12px] leading-[1.4] text-slate-400">{description}</p>
      </div>

      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3">
        <label
          className="relative h-11 w-11 shrink-0 cursor-pointer overflow-hidden rounded-xl border border-slate-200 shadow-sm"
          style={{ backgroundColor: safeValue }}
          title={`Choose ${label}`}
        >
          <input
            type="color"
            value={safeValue}
            onChange={(event) => onChange(event.target.value.toUpperCase())}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            aria-label={`Choose ${label}`}
          />
        </label>

        <div className="min-w-0 flex-1">
          <p className="text-[9px] font-semibold tracking-[0.12em] text-slate-400 uppercase">{label}</p>

          <p className="mt-1 font-mono text-[12px] font-medium text-slate-700">{safeValue}</p>
        </div>

        <input
          type="text"
          value={value ?? ""}
          maxLength={7}
          placeholder="#000000"
          onChange={(event) => {
            const next = event.target.value.toUpperCase();

            if (next === "" || /^#[0-9A-F]{0,6}$/.test(next)) {
              onChange(next);
            }
          }}
          onBlur={() => {
            if (!isHex(value)) {
              onChange(safeValue);
            }
          }}
          className="h-9 w-[88px] rounded-lg border border-slate-200 bg-slate-50 px-2.5 font-mono text-[11px] text-slate-700 transition-colors outline-none focus:border-slate-400 focus:bg-white"
          aria-label={`${label} HEX value`}
        />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* SECTION HEADER                                                             */
/* -------------------------------------------------------------------------- */

function SectionHeader({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">{icon}</div>

      <div>
        <h3 className="text-[14px] font-semibold text-slate-900">{title}</h3>
        <p className="mt-0.5 text-[11px] leading-[1.4] text-slate-400">{description}</p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* COMPONENT                                                                  */
/* -------------------------------------------------------------------------- */

function ColorsEditorPanel({ eventKey, onBack }: { eventKey: string; onBack: () => void }) {
  const { draft, replaceSection, resetDraft, refreshEvent } = usePreviewDraft();

  const eventId = draft.invite.id;
  const mutation = useSaveEventSection(eventKey, eventId);

  const currentTheme = (draft.theme.theme_mode ?? "Rose & Cream") as ThemeKey;

  const defaultBackground = getDefaultBackgroundColors(currentTheme);
  const defaultText = getDefaultTextColors(currentTheme);

  const form = useForm<ColorsForm>({
    defaultValues: {
      theme_mode: currentTheme,

      primary: normalizeHex(draft.theme.primary, defaultBackground.primary),
      secondary: normalizeHex(draft.theme.secondary, defaultBackground.secondary),
      accent: normalizeHex(draft.theme.accent, defaultBackground.accent),

      text_primary: normalizeHex(draft.theme.text_primary, defaultText.primary),
      text_secondary: normalizeHex(draft.theme.text_secondary, defaultText.secondary),
      text_accent: normalizeHex(draft.theme.text_accent, defaultText.accent),
    },
  });

  const selectedTheme = form.watch("theme_mode");

  function updateColor(key: keyof ColorsForm, value: string) {
    form.setValue(key, value, {
      shouldDirty: true,
      shouldTouch: true,
    });

    replaceSection("theme", {
      ...draft.theme,
      ...form.getValues(),
      [key]: value,
    });
  }

  function handleThemeChange(themeKey: ThemeKey) {
    const background = getDefaultBackgroundColors(themeKey);
    const text = getDefaultTextColors(themeKey);

    const nextValues: ColorsForm = {
      ...form.getValues(),
      theme_mode: themeKey,

      primary: background.primary,
      secondary: background.secondary,
      accent: background.accent,

      text_primary: text.primary,
      text_secondary: text.secondary,
      text_accent: text.accent,
    };

    form.reset(nextValues);

    replaceSection("theme", {
      ...draft.theme,
      ...nextValues,
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

  function onSubmit(values: ColorsForm) {
    mutation.mutate(
      {
        path: "theme",
        stage: "theme",
        data: {
          ...draft.theme,
          ...values,
        },
      },
      {
        onSuccess: handleSaveSuccess,
      },
    );
  }

  const themeKeys = Object.keys(THEMES) as ThemeKey[];

  return (
    <div className="animate-in fade-in flex h-full flex-col rounded-lg duration-500 md:rounded-none">
      <EditorHeader title="Colors" handleCancel={handleCancel} />

      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-1 flex-col justify-between overflow-auto p-5 pb-0 md:min-h-[calc(100dvh-115px)] [&::-webkit-scrollbar]:w-[2px] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300"
        >
          <section className="space-y-7 pb-7">
            {/* THEME PRESETS */}
            <section className="space-y-4">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-slate-500" />
                  <h3 className="text-[14px] font-semibold text-slate-900">Theme</h3>
                </div>

                <p className="mt-1 text-[11px] leading-[1.4] text-slate-400">
                  Choose a ready-made color system. Selecting a theme resets all six color roles.
                </p>
              </div>

              <div className="flex [scrollbar-width:none] gap-3 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
                {themeKeys.map((themeKey) => (
                  <ThemeCard
                    key={themeKey}
                    themeKey={themeKey}
                    active={selectedTheme === themeKey}
                    onClick={() => handleThemeChange(themeKey)}
                  />
                ))}
              </div>
            </section>

            {/* BACKGROUND */}
            <section className="space-y-5 rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
              <SectionHeader
                icon={<Palette className="h-4 w-4" />}
                title="Background"
                description="Background, text and accent colors used throughout the invitation."
              />

              <FormField
                control={form.control}
                name="primary"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ColorControl
                        label="Primary"
                        description="Main page background and large invitation surfaces."
                        value={field.value}
                        onChange={(value) => updateColor("primary", value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="secondary"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ColorControl
                        label="Secondary"
                        description="Cards, supporting sections and content surfaces."
                        value={field.value}
                        onChange={(value) => updateColor("secondary", value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="accent"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ColorControl
                        label="Accent"
                        description="Decorative areas, strong visual emphasis and highlighted surfaces."
                        value={field.value}
                        onChange={(value) => updateColor("accent", value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </section>

            {/* TEXT */}
            <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-4">
              <SectionHeader
                icon={<span className="font-serif text-sm font-semibold">Aa</span>}
                title="Text"
                description="Independent text colors for readable content and emphasis."
              />

              <FormField
                control={form.control}
                name="text_primary"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ColorControl
                        label="Primary"
                        description="Main readable text, headings and important content."
                        value={field.value}
                        onChange={(value) => updateColor("text_primary", value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="text_secondary"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ColorControl
                        label="Secondary"
                        description="Muted labels, descriptions, metadata and supporting information."
                        value={field.value}
                        onChange={(value) => updateColor("text_secondary", value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="text_accent"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ColorControl
                        label="Accent"
                        description="Highlighted text, links, labels and visual emphasis."
                        value={field.value}
                        onChange={(value) => updateColor("text_accent", value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </section>
          </section>

          <div className="sticky bottom-0 z-[99] -mx-5 flex h-[60px] items-center justify-end gap-3 border-t border-slate-100 bg-white/90 px-5 backdrop-blur-md">
            <Button
              type="button"
              variant="ghost"
              onClick={handleCancel}
              className="text-xs font-semibold text-slate-400 hover:text-slate-700"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={mutation.isPending}
              className="h-9 rounded-xl bg-slate-900 px-4 text-xs font-semibold text-white hover:bg-slate-800"
            >
              {mutation.isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}


/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

type BackgroundType = "solid" | "image";

type TextureType = "none" | "paper" | "grain" | "fabric" | "pattern";

type BackgroundPosition = "center" | "top" | "bottom" | "left" | "right";

type BackgroundSize = "cover" | "contain" | "auto";

type BackgroundEffect = "none" | "soft" | "blur" | "vignette";

/**
 * Persisted color mapping:
 *
 * primary   → Primary
 * secondary   → Secondary
 * accent → Accent
 *
 * Keep these field names for compatibility with existing invitations.
 */

type DesignForm = {
  background_type: BackgroundType;

  background_overlay_opacity?: number;


  background_image?: string;

  texture?: TextureType;

  background_position?: BackgroundPosition;

  background_size?: BackgroundSize;

  background_effect?: BackgroundEffect;

  background_blur?: number;

  background_brightness?: number;

  background_contrast?: number;
};

/* -------------------------------------------------------------------------- */
/* TEXTURE OPTIONS                                                             */
/* -------------------------------------------------------------------------- */

const TEXTURE_OPTIONS: {
  label: string;
  value: TextureType;
}[] = [
  {
    label: "None",
    value: "none",
  },
  {
    label: "Paper",
    value: "paper",
  },
  {
    label: "Grain",
    value: "grain",
  },
  {
    label: "Fabric",
    value: "fabric",
  },
  {
    label: "Pattern",
    value: "pattern",
  },
];

/* -------------------------------------------------------------------------- */
/* POSITION OPTIONS                                                            */
/* -------------------------------------------------------------------------- */

const POSITION_OPTIONS: {
  label: string;
  value: BackgroundPosition;
}[] = [
  {
    label: "Center",
    value: "center",
  },
  {
    label: "Top",
    value: "top",
  },
  {
    label: "Bottom",
    value: "bottom",
  },
  {
    label: "Left",
    value: "left",
  },
  {
    label: "Right",
    value: "right",
  },
];

/* -------------------------------------------------------------------------- */
/* SIZE OPTIONS                                                                */
/* -------------------------------------------------------------------------- */

const SIZE_OPTIONS: {
  label: string;
  value: BackgroundSize;
}[] = [
  {
    label: "Cover",
    value: "cover",
  },
  {
    label: "Contain",
    value: "contain",
  },
  {
    label: "Original",
    value: "auto",
  },
];

/* -------------------------------------------------------------------------- */
/* EFFECT OPTIONS                                                              */
/* -------------------------------------------------------------------------- */

const EFFECT_OPTIONS: {
  label: string;
  value: BackgroundEffect;
}[] = [
  {
    label: "None",
    value: "none",
  },
  {
    label: "Soft",
    value: "soft",
  },
  {
    label: "Blur",
    value: "blur",
  },
  {
    label: "Vignette",
    value: "vignette",
  },
];

/* -------------------------------------------------------------------------- */
/* COMPONENT                                                                  */
/* -------------------------------------------------------------------------- */

function BackgroundEditorPanel({ eventKey, onBack }: { eventKey: string; onBack: () => void }) {
  /* ---------------- HOOKS ---------------- */

  const { draft, replaceSection, resetDraft, refreshEvent } = usePreviewDraft();

  const eventId = draft.invite.id;

  const mutation = useSaveEventSection(eventKey, eventId);
  /* ---------------- FORM ---------------- */

  const form = useForm<DesignForm>({
    defaultValues: {
      ...draft.theme,

      background_type: draft.theme.background_type ?? "solid",

      background_overlay_opacity: draft.theme.background_overlay_opacity ?? 45,

      texture: draft.theme.texture ?? "none",

      background_position: draft.theme.background_position ?? "center",

      background_size: draft.theme.background_size ?? "cover",

      background_effect: draft.theme.background_effect ?? "none",

      background_blur: draft.theme.background_blur ?? 0,

      background_brightness: draft.theme.background_brightness ?? 100,

      background_contrast: draft.theme.background_contrast ?? 100,
    },
  });

  /* ---------------- WATCHERS ---------------- */

  const backgroundType = form.watch("background_type");

  /* ------------------------------------------------------------------------ */
  /* HANDLERS                                                                 */
  /* ------------------------------------------------------------------------ */

  function handleLiveChange(key: keyof DesignForm, value: DesignForm[keyof DesignForm]) {
    const latest = form.getValues();

    replaceSection("theme", {
      ...latest,
      [key]: value,
    } as DesignForm);
  }

  /* ------------------------------------------------------------------------ */
  /* SAVE                                                                      */
  /* ------------------------------------------------------------------------ */

  async function handleSaveSuccess() {
    await refreshEvent(eventKey);

    onBack();
  }

  /* ------------------------------------------------------------------------ */
  /* CANCEL                                                                    */
  /* ------------------------------------------------------------------------ */

  function handleCancel() {
    resetDraft();

    onBack();
  }

  /* ------------------------------------------------------------------------ */
  /* SUBMIT                                                                    */
  /* ------------------------------------------------------------------------ */

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

  /* ------------------------------------------------------------------------ */
  /* RENDER                                                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <div className="animate-in fade-in flex h-full flex-col rounded-lg duration-500 md:rounded-none">
      {/* ------------------------------------------------------------------ */}
      {/* HEADER                                                             */}
      {/* ------------------------------------------------------------------ */}

      <EditorHeader title="Background" handleCancel={handleCancel} />

      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-1 flex-col justify-between space-y-5 overflow-auto p-5 pb-0 md:min-h-[calc(100dvh-115px)] md:rounded-none [&::-webkit-scrollbar]:h-0 [&::-webkit-scrollbar]:w-[2px] [&::-webkit-scrollbar-thumb]:rounded-[10px] [&::-webkit-scrollbar-thumb]:bg-[#c1c1c1] [&::-webkit-scrollbar-track]:rounded-[10px] [&::-webkit-scrollbar-track]:bg-[#78909C]"
        >
          <section className="space-y-6 [&>*:last-child]:mb-6">
            {/* ============================================================ */}
            {/* 1. BACKGROUND STYLE                                         */}
            {/* ============================================================ */}

            <FormField
              control={form.control}
              name="background_type"
              render={({ field }) => (
                <FormItem>
                  <div>
                    <FormLabel>Background Style</FormLabel>

                    <p className="mt-0.5 text-xs text-slate-400">Choose how the invitation background is displayed.</p>
                  </div>

                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      onValueChange={(type: "solid" | "image") => {
                        field.onChange(type);

                        handleLiveChange("background_type", type);

                        /* ------------------------------------------------ */
                        /* SOLID                                             */
                        /* ------------------------------------------------ */

                        if (type === "solid") {
                          form.setValue("background_image", undefined);

                          handleLiveChange("background_image", undefined);
                        }

                        /* ------------------------------------------------ */
                        /* IMAGE                                             */
                        /* ------------------------------------------------ */

                        if (type === "image") {
                          const first = BACKGROUND_PRESETS[0];

                          if (!first) {
                            return;
                          }

                          form.setValue("background_image", first.url);

                          handleLiveChange("background_image", first.url);
                        }
                      }}
                      className="grid grid-cols-2 gap-3"
                    >
                      {(["solid", "image"] as const).map((type) => (
                        <div key={type}>
                          <label
                            htmlFor={`bg-type-${type}`}
                            className={cn(
                              "flex h-10 cursor-pointer items-center justify-between rounded-lg border px-4 transition-all",

                              field.value === type
                                ? "border-slate-900 bg-slate-900 text-white shadow-lg"
                                : "border-slate-100 bg-white text-slate-500 hover:border-slate-200",
                            )}
                          >
                            <div className="mr-2 flex w-5 items-center justify-between">
                              <div>
                                {type === "solid" ? (
                                  <div className={cn("h-5 w-5 rounded-md", field.value === type ? "bg-white/30" : "bg-slate-300")} />
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

                  <FormMessage />
                </FormItem>
              )}
            />

            {backgroundType === "solid" && (
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-slate-500 shadow-sm">
                    <Sparkles className="h-4 w-4" strokeWidth={1.5} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-slate-800">Solid background color</p>
                    <p className="mt-1 text-[11px] leading-[1.5] text-slate-400">
                      The solid background color is managed from <span className="font-medium text-slate-600">Colors</span>.
                      Background controls here are for the image, texture and visual effects.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* 2. BACKGROUND IMAGE                                         */}
            {/* ============================================================ */}

            {backgroundType === "image" && (
              <FormField
                control={form.control}
                name="background_image"
                render={({ field }) => (
                  <FormItem>
                    <div>
                      <FormLabel>Background Image</FormLabel>

                      <p className="mt-0.5 text-xs text-slate-400">Select a photo or texture that matches your invitation style.</p>
                    </div>

                    <FormControl>
                      <HorizontalScroll>
                        {BACKGROUND_PRESETS.map((bg) => {
                          const active = field.value === bg.url;

                          return (
                            <label
                              key={bg.id}
                              htmlFor={bg.id}
                              className={cn(
                                "shrink-0 cursor-pointer rounded-lg border px-3 py-3 capitalize transition-all duration-300",

                                active
                                  ? "border-slate-900 bg-slate-900 text-white shadow-lg shadow-slate-200"
                                  : "border-slate-200 bg-white hover:border-slate-300",
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

            {/* ============================================================ */}
            {/* 3. OVERLAY OPACITY                                          */}
            {/* ============================================================ */}

            {backgroundType === "image" && (
              <FormField
                control={form.control}
                name="background_overlay_opacity"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <div>
                        <FormLabel>Overlay Opacity</FormLabel>

                        <p className="mt-0.5 text-xs text-slate-400">Adjust how softly the photo blends with the theme.</p>
                      </div>

                      <FormLabel>{field.value ?? 45}%</FormLabel>
                    </div>

                    <Slider
                      value={[field.value ?? 45]}
                      max={100}
                      step={5}
                      onValueChange={(value) => {
                        const opacity = value[0];

                        field.onChange(opacity);

                        handleLiveChange("background_overlay_opacity", opacity);
                      }}
                    />
                  </FormItem>
                )}
              />
            )}

            {/* ============================================================ */}
            {/* 4. TEXTURE                                                   */}
            {/* ============================================================ */}

            <FormField
              control={form.control}
              name="texture"
              render={({ field }) => (
                <FormItem>
                  <div>
                    <FormLabel>Texture</FormLabel>

                    <p className="mt-0.5 text-xs text-slate-400">Add a subtle surface finish without overpowering the design.</p>
                  </div>

                  <FormControl>
                    <RadioGroup
                      value={field.value ?? "none"}
                      onValueChange={(value) => {
                        const texture = value as TextureType;

                        field.onChange(texture);

                        handleLiveChange("texture", texture);
                      }}
                    >
                      <HorizontalScroll>
                        {TEXTURE_OPTIONS.map((option) => {
                          const active = field.value === option.value;

                          return (
                            <label
                              key={option.value}
                              htmlFor={`texture-${option.value}`}
                              className={cn(
                                "min-w-[82px] shrink-0 cursor-pointer rounded-lg border px-3 py-3 text-center transition-all",

                                active
                                  ? "border-slate-900 bg-slate-900 text-white shadow-md"
                                  : "border-slate-200 bg-white text-slate-500 hover:border-slate-300",
                              )}
                            >
                              <RadioGroupItem id={`texture-${option.value}`} value={option.value} className="hidden" />

                              <span className="text-[10px] font-semibold tracking-wider uppercase">{option.label}</span>
                            </label>
                          );
                        })}
                      </HorizontalScroll>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            {/* ============================================================ */}
            {/* 5. POSITION / SIZE                                           */}
            {/* ============================================================ */}

            {backgroundType === "image" && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-sm font-semibold text-slate-800">Position & Size</h3>

                  <p className="mt-0.5 text-xs text-slate-400">Control how the background image sits inside the invitation.</p>
                </div>

                {/* -------------------------------------------------------- */}
                {/* POSITION                                                 */}
                {/* -------------------------------------------------------- */}

                <FormField
                  control={form.control}
                  name="background_position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Position</FormLabel>

                      <FormControl>
                        <RadioGroup
                          value={field.value ?? "center"}
                          onValueChange={(value) => {
                            const position = value as BackgroundPosition;

                            field.onChange(position);

                            handleLiveChange("background_position", position);
                          }}
                        >
                          <HorizontalScroll>
                            {POSITION_OPTIONS.map((option) => (
                              <label
                                key={option.value}
                                htmlFor={`position-${option.value}`}
                                className={cn(
                                  "min-w-[72px] shrink-0 cursor-pointer rounded-lg border px-2.5 py-2 text-center text-xs transition-all",

                                  field.value === option.value
                                    ? "border-slate-900 bg-slate-900 text-white"
                                    : "border-slate-200 bg-white text-slate-500 hover:border-slate-300",
                                )}
                              >
                                <RadioGroupItem id={`position-${option.value}`} value={option.value} className="hidden" />

                                {option.label}
                              </label>
                            ))}
                          </HorizontalScroll>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* -------------------------------------------------------- */}
                {/* SIZE                                                     */}
                {/* -------------------------------------------------------- */}

                <FormField
                  control={form.control}
                  name="background_size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Size</FormLabel>

                      <FormControl>
                        <RadioGroup
                          value={field.value ?? "cover"}
                          onValueChange={(value) => {
                            const size = value as BackgroundSize;

                            field.onChange(size);

                            handleLiveChange("background_size", size);
                          }}
                        >
                          <HorizontalScroll>
                            {SIZE_OPTIONS.map((option) => (
                              <label
                                key={option.value}
                                htmlFor={`size-${option.value}`}
                                className={cn(
                                  "min-w-[82px] shrink-0 cursor-pointer rounded-lg border px-3 py-2 text-center text-xs transition-all",

                                  field.value === option.value
                                    ? "border-slate-900 bg-slate-900 text-white"
                                    : "border-slate-200 bg-white text-slate-500 hover:border-slate-300",
                                )}
                              >
                                <RadioGroupItem id={`size-${option.value}`} value={option.value} className="hidden" />

                                {option.label}
                              </label>
                            ))}
                          </HorizontalScroll>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* ============================================================ */}
            {/* 6. BACKGROUND EFFECTS                                        */}
            {/* ============================================================ */}

            <FormField
              control={form.control}
              name="background_effect"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-start gap-2">
                    <Sparkles className="mt-0.5 h-4 w-4 text-slate-400" strokeWidth={1.5} />

                    <div>
                      <FormLabel>Background Effects</FormLabel>

                      <p className="mt-0.5 text-xs text-slate-400">
                        Add a subtle finish to make the background feel softer and more polished.
                      </p>
                    </div>
                  </div>

                  <FormControl>
                    <RadioGroup
                      value={field.value ?? "none"}
                      onValueChange={(value) => {
                        const effect = value as BackgroundEffect;

                        field.onChange(effect);

                        handleLiveChange("background_effect", effect);
                      }}
                    >
                      <HorizontalScroll>
                        {EFFECT_OPTIONS.map((option) => (
                          <label
                            key={option.value}
                            htmlFor={`effect-${option.value}`}
                            className={cn(
                              "min-w-[78px] shrink-0 cursor-pointer rounded-lg border px-3 py-3 text-center text-[10px] font-semibold tracking-wider uppercase transition-all",

                              field.value === option.value
                                ? "border-slate-900 bg-slate-900 text-white shadow-md"
                                : "border-slate-200 bg-white text-slate-500 hover:border-slate-300",
                            )}
                          >
                            <RadioGroupItem id={`effect-${option.value}`} value={option.value} className="hidden" />

                            {option.label}
                          </label>
                        ))}
                      </HorizontalScroll>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />
          </section>

          {/* ============================================================ */}
          {/* STICKY FOOTER                                                  */}
          {/* ============================================================ */}

          <div className="sticky bottom-0 z-[99] -m-5 flex h-[60px] items-center justify-end gap-3 border-t border-slate-100 bg-white/90 px-5 backdrop-blur-md">
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
              className="h-8 rounded-md bg-slate-900 px-10 py-2 text-xs text-white shadow-slate-200 transition-all hover:bg-slate-800 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save strokeWidth={1} />

              {mutation.isPending ? <span className="font-normal">Updating...</span> : <span className="font-normal">Save</span>}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* DESIGN EDITOR                                                              */
/* -------------------------------------------------------------------------- */

export default function DesignEditor({
  eventKey,
  onBack,
  section = "background",
}: DesignEditorProps) {
  if (section === "colors") {
    return <ColorsEditorPanel eventKey={eventKey} onBack={onBack} />;
  }

  return <BackgroundEditorPanel eventKey={eventKey} onBack={onBack} />;
}

/**
 * Optional compatibility exports.
 *
 * Existing code can temporarily import these from this same file:
 *   import DesignEditor, { ColorsEditor, BackgroundEditor } from "./DesignEditor";
 *
 * New code should prefer the default DesignEditor + `section` prop.
 */
export function ColorsEditor(props: Omit<DesignEditorProps, "section">) {
  return <ColorsEditorPanel {...props} />;
}

export function BackgroundEditor(props: Omit<DesignEditorProps, "section">) {
  return <BackgroundEditorPanel {...props} />;
}