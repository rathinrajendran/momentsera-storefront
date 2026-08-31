"use client";

import { useForm, FormProvider } from "react-hook-form";
import { usePreviewDraft } from "../PreviewDraftContext";
import { useSaveEventSection } from "../../../../hooks/useEvents";
import {
  ThemeKey,
  THEMES,
  THEME_ACCENT_RULES,
  ACCENT_COLORS,
  TYPOGRAPHY_COLORS,
} from "../../../[event_key]/invites/core/config/themeConfigs";
import { Button } from "../../../../components/ui/button";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "../../../../components/ui/form";
import { RadioGroup, RadioGroupItem } from "../../../../components/ui/radio-group";
import { cn } from "../../../../utils/utils";
import { BACKGROUND_PRESETS } from "../../../../public/constants/Presets";
import { Image, Palette, Save, X, Sparkles } from "lucide-react";
import { HorizontalScroll } from "../../../../components/ui/HorizontalScroll";
import { Slider } from "../../../../components/ui/Slider";
import EditorHeader from "./EditorHeader";

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
  theme_mode: ThemeKey;

  // 2 background colors + 2 text colors + 1 shared accent
  primary: string;
  secondary: string;
  text_primary: string;
  text_secondary: string;
  accent: string;

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
/* THEME HELPERS                                                              */
/* -------------------------------------------------------------------------- */

function isHex(value: unknown): value is string {
  return typeof value === "string" && /^#[0-9A-Fa-f]{6}$/.test(value);
}

function normalizeHex(value: unknown, fallback: string): string {
  return isHex(value) ? value.toUpperCase() : fallback;
}

function getDefaultAccentColor(themeKey: ThemeKey): string {
  const allowedAccents = THEME_ACCENT_RULES[themeKey] ?? [];
  const accentKey = allowedAccents[0];

  return accentKey ? normalizeHex(ACCENT_COLORS[accentKey], "#B4975A") : "#B4975A";
}

function getThemeColors(themeKey: ThemeKey) {
  const theme = THEMES[themeKey];
  const typography = TYPOGRAPHY_COLORS[themeKey];

  return {
    primary: normalizeHex(theme?.bg?.page, "#FFFDF9"),
    secondary: normalizeHex(theme?.bg?.section1 ?? theme?.bg?.section2, "#F8E8EC"),
    text_primary: normalizeHex(typography?.primary, "#33302C"),
    text_secondary: normalizeHex(typography?.secondary, "#7C776E"),
    accent: getDefaultAccentColor(themeKey),
  };
}

function ThemeCard({ themeKey, active, onClick }: { themeKey: ThemeKey; active: boolean; onClick: () => void }) {
  const colors = getThemeColors(themeKey);

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "relative w-[210px] shrink-0 rounded-2xl border p-4 text-left transition-all duration-200",
        active
          ? "border-slate-900 bg-slate-900 text-white shadow-md"
          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50",
      )}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className={cn("truncate text-[11px] font-semibold", active ? "text-white" : "text-slate-800")}>{themeKey}</p>

        <span
          className={cn(
            "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border",
            active ? "border-white bg-white text-slate-900" : "border-slate-200 bg-white text-transparent",
          )}
        >
          <span className="text-[11px] font-bold">✓</span>
        </span>
      </div>

      <div className="space-y-3">
        <div>
          <p className={cn("mb-1.5 text-[8px] font-semibold tracking-wider uppercase", active ? "text-white/50" : "text-slate-400")}>
            Background
          </p>

          <div className="grid grid-cols-2 gap-1.5">
            <span className="h-8 rounded-lg border border-black/10" style={{ backgroundColor: colors.primary }} />
            <span className="h-8 rounded-lg border border-black/10" style={{ backgroundColor: colors.secondary }} />
          </div>
        </div>

        <div>
          <p className={cn("mb-1.5 text-[8px] font-semibold tracking-wider uppercase", active ? "text-white/50" : "text-slate-400")}>
            Text
          </p>

          <div className="grid grid-cols-2 gap-1.5">
            <span className="h-6 rounded-lg border border-black/10" style={{ backgroundColor: colors.text_primary }} />
            <span className="h-6 rounded-lg border border-black/10" style={{ backgroundColor: colors.text_secondary }} />
          </div>
        </div>

        <div>
          <p className={cn("mb-1.5 text-[8px] font-semibold tracking-wider uppercase", active ? "text-white/50" : "text-slate-400")}>
            Accent
          </p>

          <span className="block h-6 rounded-lg border border-black/10" style={{ backgroundColor: colors.accent }} />
        </div>
      </div>
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/* COMPONENT                                                                  */
/* -------------------------------------------------------------------------- */

export default function BackgroundEditor({ onBack, handleBack, eventKey }: { onBack: () => void; handleBack: () => void; eventKey: string }) {
  /* ---------------- HOOKS ---------------- */

  const { draft, replaceSection, resetDraft, refreshEvent } = usePreviewDraft();

  const eventId = draft.invite.id;

  const mutation = useSaveEventSection(eventKey, eventId);
  /* ---------------- FORM ---------------- */

  const initialThemeKey = (draft.theme.theme_mode ?? "Rose & Cream") as ThemeKey;
  const initialThemeColors = getThemeColors(initialThemeKey);

  const form = useForm<DesignForm>({
    defaultValues: {
      ...draft.theme,

      theme_mode: initialThemeKey,

      // Keep saved custom colors; use the selected theme only as the fallback.
      primary: draft.theme.primary ?? initialThemeColors.primary,
      secondary: draft.theme.secondary ?? initialThemeColors.secondary,
      text_primary: draft.theme.text_primary ?? initialThemeColors.text_primary,
      text_secondary: draft.theme.text_secondary ?? initialThemeColors.text_secondary,
      accent: draft.theme.accent ?? initialThemeColors.accent,

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
  const selectedTheme = form.watch("theme_mode");
  const themeKeys = Object.keys(THEMES) as ThemeKey[];

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

  function updateColor(key: "primary" | "secondary" | "text_primary" | "text_secondary" | "accent", value: string) {
    form.setValue(key, value, {
      shouldDirty: true,
      shouldTouch: true,
    });

    handleLiveChange(key, value);
  }

  function handleThemeChange(themeKey: ThemeKey) {
    const colors = getThemeColors(themeKey);
    const latest = form.getValues();

    const nextTheme = {
      ...latest,
      theme_mode: themeKey,
      primary: colors.primary,
      secondary: colors.secondary,
      text_primary: colors.text_primary,
      text_secondary: colors.text_secondary,
      accent: colors.accent,
    };

    form.reset(nextTheme);

    replaceSection("theme", {
      ...draft.theme,
      ...nextTheme,
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

  return (
    <div className="animate-in fade-in flex h-full flex-col rounded-lg duration-500 md:rounded-none">
      {/* ------------------------------------------------------------------ */}
      {/* HEADER                                                             */}
      {/* ------------------------------------------------------------------ */}

      <EditorHeader title="Background" handleBack={handleBack} />

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

            {/* ============================================================ */}
            {/* THEME                                                         */}
            {/* ============================================================ */}

            {backgroundType === "solid" && (
              <>
                {/* THEME PRESETS */}
                <section className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-slate-500" strokeWidth={1.5} />
                      <h3 className="text-[14px] font-semibold text-slate-900">Theme</h3>
                    </div>

                    <p className="mt-1 text-[11px] leading-[1.4] text-slate-400">
                      Choose a ready-made color system. Selecting a theme resets the five color roles.
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
                    description="Two background colors create the main and supporting surfaces of the invitation."
                  />

                  <FormField
                    control={form.control}
                    name="primary"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <ColorControl
                            label="Primary Background"
                            description="Main page background and the largest invitation surfaces."
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
                            label="Secondary Background"
                            description="Supporting sections, cards and alternate content surfaces."
                            value={field.value}
                            onChange={(value) => updateColor("secondary", value)}
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
                    description="Two text colors provide readable hierarchy without unnecessary complexity."
                  />

                  <FormField
                    control={form.control}
                    name="text_primary"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <ColorControl
                            label="Primary Text"
                            description="Main headings, names and important readable content."
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
                            label="Secondary Text"
                            description="Supporting labels, descriptions, metadata and muted content."
                            value={field.value}
                            onChange={(value) => updateColor("text_secondary", value)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </section>

                {/* ACCENT */}
                <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-4">
                  <SectionHeader
                    icon={<Sparkles className="h-4 w-4" />}
                    title="Accent"
                    description="One shared accent color keeps buttons, icons, links and decoration visually consistent."
                  />

                  <FormField
                    control={form.control}
                    name="accent"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <ColorControl
                            label="Accent"
                            description="Shared highlight color for buttons, icons, lines, links and decorative elements."
                            value={field.value}
                            onChange={(value) => updateColor("accent", value)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </section>
              </>
            )}

            {/* ============================================================ */}
            {/* 3. BACKGROUND IMAGE                                         */}
            {/* ============================================================ */}

            {backgroundType === "image" && (
              <>
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
                {/* TEXT */}
                <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-4">
                  <SectionHeader
                    icon={<span className="font-serif text-sm font-semibold">Aa</span>}
                    title="Text"
                    description="Two text colors provide readable hierarchy without unnecessary complexity."
                  />

                  <FormField
                    control={form.control}
                    name="text_primary"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <ColorControl
                            label="Primary Text"
                            description="Main headings, names and important readable content."
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
                            label="Secondary Text"
                            description="Supporting labels, descriptions, metadata and muted content."
                            value={field.value}
                            onChange={(value) => updateColor("text_secondary", value)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </section>

                {/* ACCENT */}
                <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-4">
                  <SectionHeader
                    icon={<Sparkles className="h-4 w-4" />}
                    title="Accent"
                    description="One shared accent color keeps buttons, icons, links and decoration visually consistent."
                  />

                  <FormField
                    control={form.control}
                    name="accent"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <ColorControl
                            label="Accent"
                            description="Shared highlight color for buttons, icons, lines, links and decorative elements."
                            value={field.value}
                            onChange={(value) => updateColor("accent", value)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </section>
              </>
            )}

            {/* ============================================================ */}
            {/* 4. OVERLAY OPACITY                                          */}
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
            {/* 6. POSITION / SIZE                                           */}
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
