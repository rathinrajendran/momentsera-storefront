"use client";

import { useForm, FormProvider, useWatch } from "react-hook-form";
import { useState } from "react";
import type { ReactNode } from "react";
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
import { Palette, Save, X, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { HorizontalScroll } from "../../../../components/ui/HorizontalScroll";
import { Slider } from "../../../../components/ui/Slider";
import EditorHeader from "./EditorHeader";
import { HexColorPicker } from "react-colorful";

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

type BackgroundType = "solid" | "image";
type BackgroundPosition = "center" | "top" | "bottom" | "left" | "right";
type BackgroundSize = "cover" | "contain" | "auto";
type BackgroundRepeat = "no-repeat" | "repeat" | "repeat-x" | "repeat-y";

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
  primary: string;
  secondary: string;
  text_primary: string;
  text_secondary: string;
  accent: string;
  background_type: BackgroundType;
  background_overlay_opacity?: number;
  background_image?: string;
  background_position?: BackgroundPosition;
  background_size?: BackgroundSize;
  background_repeat?: BackgroundRepeat;
};

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
/* REPEAT OPTIONS                                                                */
/* -------------------------------------------------------------------------- */

const BACKGROUND_REPEAT_OPTIONS: {
  label: string;
  value: BackgroundRepeat;
}[] = [
  {
    label: "No Repeat",
    value: "no-repeat",
  },
  {
    label: "Repeat",
    value: "repeat",
  },
  {
    label: "Repeat X",
    value: "repeat-x",
  },
  {
    label: "Repeat Y",
    value: "repeat-y",
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

function getThemeDescription(themeKey: ThemeKey): string {
  // Keep the description intentionally generic unless themeConfigs provides
  // theme-specific copy. The theme key remains the primary identifier.
  return themeKey === "Rose & Cream" ? "Elegant & Warm" : "Curated color palette";
}

function ThemeCard({ themeKey, active, onClick }: { themeKey: ThemeKey; active: boolean; onClick: () => void }) {
  const colors = getThemeColors(themeKey);

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "group relative w-auto shrink-0 cursor-pointer rounded-xl border bg-white p-3 text-left",
        "transition-all duration-200",
        "focus:outline-none",
        active ? "border-[#6847E8]" : "border-[#E6E7EC] hover:border-[#C9CDD6]",
      )}
    >
      {/* Palette */}
      <div className="mb-3 flex h-8 w-22 overflow-hidden rounded-sm border border-black/[0.06]">
        <span className="flex-1" style={{ backgroundColor: colors.primary }} />
        <span className="flex-1" style={{ backgroundColor: colors.secondary }} />
        <span className="flex-1" style={{ backgroundColor: colors.text_primary }} />
        <span className="flex-1" style={{ backgroundColor: colors.text_secondary }} />
        <span className="flex-1" style={{ backgroundColor: colors.accent }} />
      </div>

      {/* Name */}
      <p className={cn("truncate text-[11px] leading-4 font-semibold", active ? "text-[#171A24]" : "text-[#343A46]")}>{themeKey}</p>

      {/* Description */}
      <p className="mt-0.5 truncate text-[9px] leading-4 text-[#8B93A3]">{getThemeDescription(themeKey)}</p>
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/* COMPONENT                                                                  */
/* -------------------------------------------------------------------------- */

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
  const [open, setOpen] = useState(false);
  const safeValue = normalizeHex(value, "#000000");

  return (
    <div className="space-y-1">
      <div>
        <FormLabel className="font-medium text-slate-900">{label}</FormLabel>
        {description ? <p className="mt-1 text-[12px] leading-[1.4] text-slate-400">{description}</p> : <></>}
      </div>

      <div className="flex items-center gap-3 rounded-lg border border-[#E6E7EC] bg-white p-3 transition-colors hover:border-[#D9DDE5]">
        <button
          type="button"
          className="h-9 w-9 shrink-0 cursor-pointer rounded-md border border-[#D9DDE5] transition-transform duration-200 hover:scale-[1.03]"
          style={{ backgroundColor: safeValue }}
          onClick={() => setOpen(true)}
          title={`Choose ${label}`}
          aria-label={`Choose ${label}`}
        />

        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-medium text-slate-400">{label}</p>
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
            if (!isHex(value)) onChange(safeValue);
          }}
          className="h-9 w-[88px] rounded-md border border-slate-200 bg-slate-50 px-2.5 font-mono text-[11px] text-slate-700 transition-colors outline-none focus:border-slate-400 focus:bg-white"
          aria-label={`${label} HEX value`}
        />
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-950/20 p-4 backdrop-blur-[2px]"
          onClick={() => setOpen(false)}
        >
          <div className="w-fit rounded-2xl border border-[#E6E7EC] bg-white p-4 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="mb-3 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-900">{label}</p>
                <p className="mt-0.5 font-mono text-[10px] text-slate-400">{safeValue}</p>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-900"
                aria-label="Close color picker"
              >
                <X size={14} />
              </button>
            </div>

            <HexColorPicker color={safeValue} onChange={(color) => onChange(color.toUpperCase())} />

            <div className="mt-3 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
              <span className="h-5 w-5 rounded-full border border-black/10" style={{ backgroundColor: safeValue }} />
              <span className="font-mono text-xs font-semibold text-slate-700">{safeValue}</span>
            </div>

            <Button type="button" className="mt-4 w-full" onClick={() => setOpen(false)}>
              Select
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* SECTION HEADER                                                             */
/* -------------------------------------------------------------------------- */

function SectionHeader({ icon, title, description }: { icon: ReactNode; title: string; description: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F0EBFF] text-[#6847E8]">{icon}</div>

      <div className="min-w-0">
        <h3 className="font-semibold text-[#171A24]">{title}</h3>
        <p className="mt-0.5 text-[11px] leading-[1.4] text-[#98A1B2]">{description}</p>
      </div>
    </div>
  );
}

function LabelPrimary({ icon, title, description }: { icon?: ReactNode; title: string; description?: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-[#6847E8]">{icon}</div>
      <div className="min-w-0">
        <h3 className="text-[12px] font-semibold text-[#171A24]">{title}</h3>
        {description ? <p className="mt-0.5 text-[11px] leading-[1.4] text-[#98A1B2]">{description}</p> : <></>}
      </div>
    </div>
  );
}

function LabelSecondary({ icon, title, description }: { icon?: ReactNode; title: string; description?: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-[#6847E8]">{icon}</div>
      <div className="min-w-0">
        <h3 className="text-[12px] font-semibold text-[#171A24]">{title}</h3>
        {description ? <p className="mt-0.5 text-[11px] leading-[1.4] text-[#98A1B2]">{description}</p> : <></>}
      </div>
    </div>
  );
}

export default function ColorEditor({ onBack, handleBack, eventKey }: { onBack: () => void; handleBack: () => void; eventKey: string }) {
  /* ---------------- HOOKS ---------------- */

  const { draft, replaceSection, resetDraft, refreshEvent } = usePreviewDraft();
  const eventId = draft.invite.id;
  const mutation = useSaveEventSection(eventKey, eventId);
  /* ---------------- FORM ---------------- */
  const initialThemeKey = (draft.color.theme_mode ?? "Rose & Cream") as ThemeKey;
  const initialThemeColors = getThemeColors(initialThemeKey);

  const form = useForm<DesignForm>({
    defaultValues: {
      ...draft.color,
      theme_mode: initialThemeKey,
      primary: draft.color.primary ?? initialThemeColors.primary,
      secondary: draft.color.secondary ?? initialThemeColors.secondary,
      text_primary: draft.color.text_primary ?? initialThemeColors.text_primary,
      text_secondary: draft.color.text_secondary ?? initialThemeColors.text_secondary,
      accent: draft.color.accent ?? initialThemeColors.accent,
      background_type: draft.color.background_type ?? "solid",
      background_image: draft.color.background_image ?? "",
      background_overlay_opacity:
        typeof draft.color.background_overlay_opacity === "number" && draft.color.background_overlay_opacity >= 0
          ? Math.min(100, draft.color.background_overlay_opacity)
          : 45,
      background_position: draft.color.background_position ?? "center",
      background_size: draft.color.background_size ?? "cover",
    },
  });

  /* ---------------- WATCHERS ---------------- */

  /*
   * Use useWatch() instead of form.watch() for reactive field values.
   * React Hook Form's watch() API is flagged by the React Compiler
   * as an incompatible library API.
   */
  const backgroundType = useWatch({
    control: form.control,
    name: "background_type",
  });

  const selectedTheme = useWatch({
    control: form.control,
    name: "theme_mode",
  });

  const themeKeys = Object.keys(THEMES) as ThemeKey[];

  /* ------------------------------------------------------------------------ */
  /* HANDLERS                                                                 */
  /* ------------------------------------------------------------------------ */

  function handleLiveChange(key: keyof DesignForm, value: DesignForm[keyof DesignForm]) {
    const latest = form.getValues();

    replaceSection("color", {
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

    replaceSection("color", {
      ...draft.color,
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
        path: "color",
        stage: "color",
        data: values,
      },
      {
        onSuccess: handleSaveSuccess,
      },
    );
  }

  return (
    <div className="animate-in fade-in flex h-full flex-col rounded-lg duration-500 md:rounded-none">
      {/* ------------------------------------------------------------------ */}
      {/* HEADER                                                             */}
      {/* ------------------------------------------------------------------ */}

      <EditorHeader title="Colors" handleBack={handleBack} />

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="overflow-auto p-5 md:h-[calc(100dvh-125px)] md:min-h-[calc(100dvh-125px)] md:rounded-none [&::-webkit-scrollbar]:h-0 [&::-webkit-scrollbar]:w-[2px] [&::-webkit-scrollbar-thumb]:rounded-[10px] [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-track]:rounded-[10px] [&::-webkit-scrollbar-track]:bg-slate-100">
            <section>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-1">
                <FormField
                  control={form.control}
                  name="background_type"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-1">
                      <LabelPrimary icon={<Sparkles className="h-4 w-4 text-slate-500" strokeWidth={1} />} title="Background Style" />
                      {/* <div>
                    <p className="mt-0.5 text-xs text-slate-400">Choose how the invitation background is displayed.</p>
                  </div> */}
                      <div className="rounded-lg bg-[#F7F7FA] p-1">
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

                              if (!first) return;

                              form.setValue("background_image", first.url);
                              handleLiveChange("background_image", first.url);
                            }
                          }}
                          className="grid grid-cols-2 gap-1"
                        >
                          {(["solid", "image"] as const).map((type) => {
                            const active = field.value === type;

                            return (
                              <label
                                key={type}
                                htmlFor={`bg-type-${type}`}
                                className={cn(
                                  "flex h-9 cursor-pointer items-center justify-center",
                                  "rounded-md border-0 text-[11px] font-medium",
                                  "transition-all duration-200",
                                  active
                                    ? "border-0 bg-[#F0EBFF] text-[#6847E8]"
                                    : "text-[#7B8494]hover:text-[#343A46] border-0 bg-transparent",
                                )}
                              >
                                <RadioGroupItem value={type} id={`bg-type-${type}`} className="sr-only" />

                                {type === "solid" ? "Color" : "Image"}
                              </label>
                            );
                          })}
                        </RadioGroup>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {backgroundType === "solid" && (
                  <>
                    {/* THEME PRESETS */}
                    <section className="space-y-2">
                      <LabelPrimary icon={<Sparkles className="h-4 w-4 text-slate-500" strokeWidth={1} />} title="Theme" />
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
                    <section className="space-y-5 border-t border-slate-200">
                      <SectionHeader
                        icon={<Palette className="h-4 w-4" />}
                        title="Background"
                        description="Two background colors create the main and supporting surfaces of the invitation."
                      />

                      <FormField
                        control={form.control}
                        name="primary"
                        render={({ field }) => (
                          <FormItem className="flex flex-col gap-1">
                            <FormControl>
                              <ColorControl
                                label="Primary"
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
                          <FormItem className="flex flex-col gap-1">
                            <FormControl>
                              <ColorControl
                                label="Secondary"
                                description=""
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
                    <section className="space-y-5 border-t border-slate-200">
                      <SectionHeader
                        icon={<span className="font-serif text-sm font-semibold">Aa</span>}
                        title="Text"
                        description="Two text colors provide readable hierarchy without unnecessary complexity."
                      />

                      <FormField
                        control={form.control}
                        name="text_primary"
                        render={({ field }) => (
                          <FormItem className="flex flex-col gap-1">
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
                          <FormItem className="flex flex-col gap-1">
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
                    <section className="space-y-5 border-t border-slate-200">
                      <SectionHeader
                        icon={<Sparkles className="h-4 w-4" />}
                        title="Accent"
                        description="One shared accent color keeps buttons, icons, links and decoration visually consistent."
                      />

                      <FormField
                        control={form.control}
                        name="accent"
                        render={({ field }) => (
                          <FormItem className="flex flex-col gap-1">
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
                {backgroundType === "image" && (
                  <>
                    <FormField
                      control={form.control}
                      name="background_image"
                      render={({ field }) => (
                        <FormItem className="flex flex-col gap-1">
                          <LabelPrimary icon={<Sparkles className="h-4 w-4 text-slate-500" strokeWidth={1} />} title="Background Image" />
                          <FormControl>
                            <RadioGroup
                              value={field.value ?? ""}
                              onValueChange={(value) => {
                                field.onChange(value);
                                handleLiveChange("background_image", value);
                              }}
                              className="grid grid-cols-1"
                            >
                              <HorizontalScroll>
                                {BACKGROUND_PRESETS.map((bg) => {
                                  const active = field.value === bg.url;

                                  return (
                                    <label
                                      key={bg.id}
                                      htmlFor={`background-${bg.id}`}
                                      className={cn(
                                        "group relative min-w-25 shrink-0 cursor-pointer rounded-xl border px-2.5 py-2.5",
                                        "bg-white transition-all duration-200",
                                        active ? "border-[#6847E8] bg-white" : "border-[#E6E7EC] hover:border-[#C9CDD6]",
                                      )}
                                    >
                                      <RadioGroupItem id={`background-${bg.id}`} value={bg.url} className="sr-only" />

                                      {/* Image Preview */}
                                      <div
                                        className={cn(
                                          "relative mb-2 h-17 w-20 overflow-hidden rounded-lg border transition-all duration-200",
                                          active ? "border-[#D8CCFF]" : "border-slate-100",
                                        )}
                                      >
                                        <img
                                          src={bg.url}
                                          alt={bg.label ?? "Background"}
                                          className="h-full w-full object-cover transition-transform duration-300"
                                        />

                                        {active && <div className="absolute inset-0 bg-[#6847E8]/5" />}
                                      </div>

                                      {/* Label */}
                                      <p
                                        className={cn(
                                          "truncate text-[10px] font-medium md:text-[11px]",
                                          active ? "text-[#6847E8]" : "text-[#697386]",
                                        )}
                                      >
                                        {"Background"}
                                      </p>
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
                    {/* TEXT */}
                    <section className="space-y-5 border-t border-slate-200">
                      <LabelPrimary icon={<Sparkles className="h-4 w-4 text-slate-500" strokeWidth={1} />} title="Text" />
                      <FormField
                        control={form.control}
                        name="text_primary"
                        render={({ field }) => (
                          <FormItem className="flex flex-col gap-1">
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
                          <FormItem className="flex flex-col gap-1">
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
                    <section className="space-y-5 border-t border-slate-200">
                      <LabelPrimary icon={<Sparkles className="h-4 w-4 text-slate-500" strokeWidth={1} />} title="Accent" />
                      <FormField
                        control={form.control}
                        name="accent"
                        render={({ field }) => (
                          <FormItem className="flex flex-col gap-1">
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
                {backgroundType === "image" && (
                  <FormField
                    control={form.control}
                    name="background_overlay_opacity"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <FormLabel>Background Opacity</FormLabel>

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
                {backgroundType === "image" && (
                  <div className="space-y-5">
                    {/* -------------------------------------------------------- */}
                    {/* POSITION                                                 */}
                    {/* -------------------------------------------------------- */}

                    <FormField
                      control={form.control}
                      name="background_position"
                      render={({ field }) => (
                        <FormItem className="flex flex-col gap-1">
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
                                      "min-w-[72px] shrink-0 cursor-pointer rounded-lg border px-2.5 py-2 text-center text-xs font-medium transition-all duration-200",

                                      field.value === option.value
                                        ? "border-[#D8CCFF] bg-[#F0EBFF] text-[#6847E8] shadow-sm"
                                        : "border-[#E6E7EC] bg-white text-[#697386] hover:border-[#C9CDD6] hover:bg-[#F7F7FA]",
                                    )}
                                  >
                                    <RadioGroupItem id={`position-${option.value}`} value={option.value} className="sr-only" />

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
                        <FormItem className="flex flex-col gap-1">
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
                                      "min-w-[82px] shrink-0 cursor-pointer rounded-lg border px-3 py-2 text-center text-xs font-medium transition-all duration-200",

                                      field.value === option.value
                                        ? "border-[#D8CCFF] bg-[#F0EBFF] text-[#6847E8] shadow-sm"
                                        : "border-[#E6E7EC] bg-white text-[#697386] hover:border-[#C9CDD6] hover:bg-[#F7F7FA]",
                                    )}
                                  >
                                    <RadioGroupItem id={`size-${option.value}`} value={option.value} className="sr-only" />

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
                    {/* REPEAT                                                     */}
                    {/* -------------------------------------------------------- */}

                    <FormField
                      control={form.control}
                      name="background_repeat"
                      render={({ field }) => (
                        <FormItem className="flex flex-col gap-1">
                          <FormLabel>Repeat</FormLabel>

                          <FormControl>
                            <RadioGroup
                              value={field.value ?? "no-repeat"}
                              onValueChange={(value) => {
                                const repeat = value as BackgroundRepeat;

                                field.onChange(repeat);
                                handleLiveChange("background_repeat", repeat);
                              }}
                            >
                              <HorizontalScroll>
                                {BACKGROUND_REPEAT_OPTIONS.map((option) => (
                                  <label
                                    key={option.value}
                                    htmlFor={`repeat-${option.value}`}
                                    className={cn(
                                      "min-w-[82px] shrink-0 cursor-pointer rounded-lg border px-3 py-2 text-center text-xs font-medium transition-all duration-200",
                                      field.value === option.value
                                        ? "border-[#D8CCFF] bg-[#F0EBFF] text-[#6847E8] shadow-sm"
                                        : "border-[#E6E7EC] bg-white text-[#697386] hover:border-[#C9CDD6] hover:bg-[#F7F7FA]",
                                    )}
                                  >
                                    <RadioGroupItem id={`repeat-${option.value}`} value={option.value} className="sr-only" />

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
