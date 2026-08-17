"use client";

import { useForm, FormProvider } from "react-hook-form";
import { usePreviewDraft } from "../PreviewDraftContext";
import { useSaveEventSection } from "../../../../hooks/useEvents";

import { Button } from "../../../../components/ui/button";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "../../../../components/ui/form";
import { RadioGroup, RadioGroupItem } from "../../../../components/ui/radio-group";

import { cn } from "../../../../utils/utils";
import { ACCENT_FONTS, AccentFontKey, TYPOGRAPHY_FONTS, TypographyFontKey } from "../../../[event_key]/invites/core/config/themeConfigs";

import { Save, X } from "lucide-react";
import { HorizontalScroll } from "../../../../components/ui/HorizontalScroll";
import EditorHeader from "./EditorHeader";

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

export type TypographyRole = "heading" | "accent" | "body";

type RoleFontKey = AccentFontKey | TypographyFontKey;

export type TextTransformValue = "none" | "uppercase" | "lowercase" | "capitalize";

export type FontWeightValue = "300" | "400" | "500" | "600" | "700";

export type DesignForm = {
  heading_font?: RoleFontKey;
  accent_font?: RoleFontKey;
  body_font?: RoleFontKey;

  heading_font_size?: number;
  accent_font_size?: number;
  body_font_size?: number;

  heading_font_weight?: FontWeightValue;
  accent_font_weight?: FontWeightValue;
  body_font_weight?: FontWeightValue;

  heading_letter_spacing?: string;
  accent_letter_spacing?: string;
  body_letter_spacing?: string;

  heading_line_height?: string;
  accent_line_height?: string;
  body_line_height?: string;

  heading_text_transform?: TextTransformValue;
  accent_text_transform?: TextTransformValue;
  body_text_transform?: TextTransformValue;
};

/* -------------------------------------------------------------------------- */
/* CONFIGURATIONS                                                             */
/* -------------------------------------------------------------------------- */

type RoleConfig = {
  role: TypographyRole;
  label: string;
  description: string;
  defaultSize: number;
  fontCategory: "accent" | "typography";
};

const TYPOGRAPHY_ROLE_CONFIGS: RoleConfig[] = [
  {
    role: "heading",
    label: "Heading",
    description: "Main titles and section headings",
    defaultSize: 28,
    fontCategory: "typography",
  },
  {
    role: "accent",
    label: "Accent",
    description: "Decorative and signature text",
    defaultSize: 24,
    fontCategory: "accent",
  },
  {
    role: "body",
    label: "Body",
    description: "Paragraphs and supporting text",
    defaultSize: 16,
    fontCategory: "typography",
  },
];
const LINE_HEIGHT_OPTIONS = [
  { label: "Tight", value: "1.1" },
  { label: "Compact", value: "1.25" },
  { label: "Normal", value: "1.5" },
  { label: "Relaxed", value: "1.65" },
  { label: "Loose", value: "1.8" },
  { label: "Extra Loose", value: "2" },
] as const;
const FONT_SIZE_OPTIONS = [
  { label: "XS", value: 12 },
  { label: "Small", value: 14 },
  { label: "Medium", value: 16 },
  { label: "Large", value: 18 },
  { label: "XL", value: 22 },
  { label: "2XL", value: 28 },
  { label: "3XL", value: 32 },
  { label: "Display", value: 36 },
  { label: "Large Display", value: 42 },
  { label: "Hero", value: 48 },
  { label: "Large Hero", value: 56 },
  { label: "Poster", value: 64 },
] as const;
const LETTER_SPACING_OPTIONS = [
  { label: "Tighter", value: "-0.05em" },
  { label: "Normal", value: "0em" },
  { label: "Wide", value: ".05em" },
  { label: "Wider", value: "0.1em" },
  { label: "Widest", value: "0.2em" },
] as const;

const FONT_WEIGHT_OPTIONS: {
  label: string;
  value: FontWeightValue;
}[] = [
  { label: "Light", value: "300" },
  { label: "Regular", value: "400" },
  { label: "Medium", value: "500" },
  { label: "SemiBold", value: "600" },
  { label: "Bold", value: "700" },
];

const TEXT_TRANSFORM_OPTIONS: {
  label: string;
  value: TextTransformValue;
}[] = [
  { label: "None", value: "none" },
  { label: "AA", value: "uppercase" },
  { label: "aa", value: "lowercase" },
  { label: "Aa", value: "capitalize" },
];

const ACCENT_FONT_KEYS = Object.keys(ACCENT_FONTS) as AccentFontKey[];
const TYPOGRAPHY_FONT_KEYS = Object.keys(TYPOGRAPHY_FONTS) as TypographyFontKey[];

/* -------------------------------------------------------------------------- */
/* FONT SELECTOR CARD                                                         */
/* -------------------------------------------------------------------------- */

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
        "relative min-w-[90px] shrink-0 cursor-pointer rounded-lg border px-3 py-3 transition-all duration-300 focus-within:ring-2 focus-within:ring-slate-400 md:min-w-[110px]",
        active
          ? "border-slate-900 bg-slate-900 text-white shadow-xl shadow-slate-200"
          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50",
      )}
    >
      <RadioGroupItem value={value} id={id} aria-label={label} className="hidden" />

      <div className={cn("mb-2 text-xl leading-none", active ? "text-white" : "text-slate-700")} style={{ fontFamily: previewFont }}>
        Ag
      </div>

      <p
        className={cn(
          "line-clamp-2 text-xs leading-tight font-normal tracking-wide break-words",
          active ? "text-white/80" : "text-slate-500",
        )}
        style={{ fontFamily: previewFont }}
      >
        {label}
      </p>
    </label>
  );
}

/* -------------------------------------------------------------------------- */
/* GENERIC OPTION SELECTOR                                                    */
/* -------------------------------------------------------------------------- */

type TypographyOption = {
  label: string;
  value: string;
  description?: string;
};

type TypographyOptionSelectorProps = {
  namePrefix: string;
  value: string;
  options: readonly TypographyOption[];
  onChange: (value: string) => void;
  ariaLabel: string;
};

function TypographyOptionSelector({ namePrefix, value, options, onChange, ariaLabel }: TypographyOptionSelectorProps) {
  return (
    <RadioGroup value={value} onValueChange={onChange} aria-label={ariaLabel} className="grid grid-cols-1">
      <HorizontalScroll>
        {options.map((option) => {
          const active = value === option.value;

          // Values can be strings, numbers, or other scalar values.
          // String() prevents runtime errors such as option.value.replace is not a function.
          const elementId = `${namePrefix}-${String(option.value)
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "")}`;

          return (
            <label
              key={String(option.value)}
              htmlFor={elementId}
              className={cn(
                "relative min-w-[78px] shrink-0 cursor-pointer rounded-lg border px-2.5 py-2.5 text-center transition-all duration-300 md:min-w-[90px]",
                active
                  ? "border-slate-900 bg-slate-900 text-white shadow-lg shadow-slate-200"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50",
              )}
            >
              <RadioGroupItem value={option.value} id={elementId} className="hidden" />

              <div className={cn("text-xs font-medium", active ? "text-white" : "text-slate-700")}>{option.label}</div>

              {option.description && (
                <div className={cn("mt-0.5 text-[10px]", active ? "text-white/70" : "text-slate-400")}>{option.description}</div>
              )}
            </label>
          );
        })}
      </HorizontalScroll>
    </RadioGroup>
  );
}

/* -------------------------------------------------------------------------- */
/* FONT SIZE SELECTOR                                                         */
/* -------------------------------------------------------------------------- */

type FontSizeSelectorProps = {
  namePrefix: string;
  value: number;
  onChange: (value: number) => void;
};

function FontSizeSelector({ namePrefix, value, onChange }: FontSizeSelectorProps) {
  return (
    <RadioGroup value={String(value)} onValueChange={(val) => onChange(Number(val))} className="grid grid-cols-1">
      <HorizontalScroll>
        {FONT_SIZE_OPTIONS.map((option) => {
          const active = value === option.value;
          const elementId = `${namePrefix}-font-size-${option.value}`;

          return (
            <label
              key={option.value}
              htmlFor={elementId}
              className={cn(
                "relative min-w-[70px] shrink-0 cursor-pointer rounded-lg border p-2.5 text-center transition-all duration-300 md:min-w-[85px] md:p-3",
                active
                  ? "border-slate-900 bg-slate-900 text-white shadow-lg shadow-slate-200"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50",
              )}
            >
              <RadioGroupItem value={String(option.value)} id={elementId} className="hidden" />

              <div className={cn("text-xs font-medium", active ? "text-white" : "text-slate-700")}>{option.label}</div>

              <div className={cn("mt-0.5 text-[10px]", active ? "text-white/70" : "text-slate-400")}>{option.value}px</div>
            </label>
          );
        })}
      </HorizontalScroll>
    </RadioGroup>
  );
}

/* -------------------------------------------------------------------------- */
/* MAIN COMPONENT                                                             */
/* -------------------------------------------------------------------------- */

export default function FontEditor({ eventKey, onBack }: { eventKey: string; onBack: () => void }) {
  const { draft, replaceSection, resetDraft, refreshEvent } = usePreviewDraft();

  const eventId = draft.invite.id;
  const mutation = useSaveEventSection(eventKey, eventId);

  /* ------------------------------------------------------------------------ */
  /* DEFAULT VALUES                                                           */
  /* ------------------------------------------------------------------------ */

  const defaultValues: DesignForm = {
    ...draft.theme,
  };

  const defaults: Record<
    TypographyRole,
    {
      font: RoleFontKey;
      size: number;
      weight: FontWeightValue;
      spacing: string;
      lineHeight: string;
      transform: TextTransformValue;
    }
  > = {
    heading: {
      font: "Bodoni Moda" as RoleFontKey,
      size: 28,
      weight: "400",
      spacing: "0em",
      lineHeight: "1.2",
      transform: "none",
    },
    accent: {
      font: "Pinyon Script" as RoleFontKey,
      size: 24,
      weight: "400",
      spacing: "0em",
      lineHeight: "1.2",
      transform: "none",
    },
    body: {
      font: "DM Sans" as RoleFontKey,
      size: 16,
      weight: "400",
      spacing: "0em",
      lineHeight: "1.5",
      transform: "none",
    },
  };

  /*
   * The keys below are generated dynamically from `cfg.role`.
   *
   * `DesignForm` is a heterogeneous object: each key has a different
   * value type (font, number, weight, spacing, transform). TypeScript
   * therefore cannot safely correlate a dynamic `keyof DesignForm` with
   * the corresponding fallback value and treats the indexed assignment
   * as `undefined`.
   *
   * Keep the strongly typed `DesignForm`, but use a small write-only
   * record for these dynamic default assignments.
   */
  const defaultValuesRecord = defaultValues as unknown as Record<string, unknown>;

  TYPOGRAPHY_ROLE_CONFIGS.forEach((cfg) => {
    const fontKey = `${cfg.role}_font`;
    const sizeKey = `${cfg.role}_font_size`;
    const weightKey = `${cfg.role}_font_weight`;
    const spacingKey = `${cfg.role}_letter_spacing`;
    const lineHeightKey = `${cfg.role}_line_height`;
    const transformKey = `${cfg.role}_text_transform`;

    const fallback = defaults[cfg.role];

    if (!defaultValuesRecord[fontKey]) {
      defaultValuesRecord[fontKey] = fallback.font;
    }

    if (!defaultValuesRecord[sizeKey]) {
      defaultValuesRecord[sizeKey] = fallback.size;
    }

    if (!defaultValuesRecord[weightKey]) {
      defaultValuesRecord[weightKey] = fallback.weight;
    }

    if (!defaultValuesRecord[spacingKey]) {
      defaultValuesRecord[spacingKey] = fallback.spacing;
    }

    if (!defaultValuesRecord[lineHeightKey]) {
      defaultValuesRecord[lineHeightKey] = fallback.lineHeight;
    }

    if (!defaultValuesRecord[transformKey]) {
      defaultValuesRecord[transformKey] = fallback.transform;
    }
  });

  const form = useForm<DesignForm>({
    defaultValues,
  });

  /* ------------------------------------------------------------------------ */
  /* LIVE PREVIEW                                                             */
  /* ------------------------------------------------------------------------ */

  function handleLiveChange<K extends keyof DesignForm>(key: K, value: DesignForm[K]) {
    const latest = form.getValues();

    replaceSection("theme", {
      ...latest,
      [key]: value,
    });
  }

  /* ------------------------------------------------------------------------ */
  /* SAVE / CANCEL                                                            */
  /* ------------------------------------------------------------------------ */

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

  /* ------------------------------------------------------------------------ */
  /* RENDER                                                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <div className="animate-in fade-in flex h-full flex-col rounded-lg duration-500 md:rounded-none">
      <EditorHeader title="Typography" handleCancel={handleCancel} />

      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-1 flex-col justify-between space-y-5 overflow-auto p-5 pb-0 md:min-h-[calc(100dvh-115px)] md:rounded-none [&::-webkit-scrollbar]:h-0 [&::-webkit-scrollbar]:w-[2px] [&::-webkit-scrollbar-thumb]:rounded-[10px] [&::-webkit-scrollbar-thumb]:bg-[#c1c1c1] [&::-webkit-scrollbar-track]:rounded-[10px] [&::-webkit-scrollbar-track]:bg-[#78909C]"
        >
          <section className="space-y-6 [&>*:last-child]:mb-6">
            {TYPOGRAPHY_ROLE_CONFIGS.map((cfg) => {
              const fontFieldName = `${cfg.role}_font` as keyof DesignForm;
              const sizeFieldName = `${cfg.role}_font_size` as keyof DesignForm;
              const spacingFieldName = `${cfg.role}_letter_spacing` as keyof DesignForm;
              const weightFieldName = `${cfg.role}_font_weight` as keyof DesignForm;
              const lineHeightFieldName = `${cfg.role}_line_height` as keyof DesignForm;
              const transformFieldName = `${cfg.role}_text_transform` as keyof DesignForm;
              const isAccent = cfg.fontCategory === "accent";
              const fontKeys = isAccent ? ACCENT_FONT_KEYS : TYPOGRAPHY_FONT_KEYS;

              return (
                <div key={cfg.role} className="space-y-5 rounded-xl border border-slate-100 bg-slate-50/50 p-4 shadow-sm">
                  <div className="border-b border-slate-200/60 pb-3">
                    <h3 className="text-base font-semibold text-slate-900">{cfg.label}</h3>

                    <p className="mt-0.5 text-xs text-slate-400">{cfg.description}</p>
                  </div>

                  {/* FONT FAMILY */}
                  <FormField
                    control={form.control}
                    name={fontFieldName as any}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium tracking-wider text-slate-500 uppercase">Font</FormLabel>

                        <FormControl>
                          <RadioGroup
                            value={(field.value as string) ?? ""}
                            onValueChange={(val) => {
                              field.onChange(val);
                              handleLiveChange(fontFieldName, val);
                            }}
                            className="grid grid-cols-1"
                          >
                            <HorizontalScroll>
                              {fontKeys.map((fontKey) => {
                                const fontObj = isAccent
                                  ? ACCENT_FONTS[fontKey as AccentFontKey]
                                  : TYPOGRAPHY_FONTS[fontKey as TypographyFontKey];

                                const previewFont = isAccent
                                  ? (fontObj as (typeof ACCENT_FONTS)[AccentFontKey]).accent
                                  : (fontObj as (typeof TYPOGRAPHY_FONTS)[TypographyFontKey]).primary;

                                return (
                                  <FontSelectorCard
                                    key={fontKey}
                                    id={`${cfg.role}-font-${fontKey}`}
                                    value={fontKey}
                                    active={field.value === fontKey}
                                    previewFont={previewFont}
                                    label={fontKey}
                                  />
                                );
                              })}
                            </HorizontalScroll>
                          </RadioGroup>
                        </FormControl>

                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  {/* FONT SIZE */}
                  <FormField
                    control={form.control}
                    name={sizeFieldName as any}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium tracking-wider text-slate-500 uppercase">Font Size</FormLabel>

                        <FormControl>
                          <FontSizeSelector
                            namePrefix={cfg.role}
                            value={(field.value as number) ?? cfg.defaultSize}
                            onChange={(size) => {
                              field.onChange(size);
                              handleLiveChange(sizeFieldName, size);
                            }}
                          />
                        </FormControl>

                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  {/* FONT WEIGHT */}
                  <FormField
                    control={form.control}
                    name={weightFieldName as any}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium tracking-wider text-slate-500 uppercase">Font Weight</FormLabel>

                        <FormControl>
                          <TypographyOptionSelector
                            namePrefix={`${cfg.role}-font-weight`}
                            value={(field.value as string) ?? "400"}
                            options={FONT_WEIGHT_OPTIONS.map((option) => ({
                              label: option.label,
                              value: option.value,
                              description: option.value,
                            }))}
                            ariaLabel={`${cfg.label} font weight`}
                            onChange={(value) => {
                              field.onChange(value);
                              handleLiveChange(weightFieldName, value);
                            }}
                          />
                        </FormControl>

                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  {/* LETTER SPACING */}
                  <FormField
                    control={form.control}
                    name={spacingFieldName as any}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium tracking-wider text-slate-500 uppercase">Letter Spacing</FormLabel>

                        <FormControl>
                          <TypographyOptionSelector
                            namePrefix={`${cfg.role}-letter-spacing`}
                            value={(field.value as string) ?? "0em"}
                            options={LETTER_SPACING_OPTIONS.map((option) => ({
                              label: option.label,
                              value: option.value,
                              description: option.value,
                            }))}
                            ariaLabel={`${cfg.label} letter spacing`}
                            onChange={(value) => {
                              field.onChange(value);
                              handleLiveChange(spacingFieldName, value);
                            }}
                          />
                        </FormControl>

                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  {/* LINE HEIGHT */}
                  <FormField
                    control={form.control}
                    name={lineHeightFieldName as any}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium tracking-wider text-slate-500 uppercase">Line Height</FormLabel>

                        <FormControl>
                          <TypographyOptionSelector
                            namePrefix={`${cfg.role}-line-height`}
                            value={(field.value as string) ?? "1.5"}
                            options={LINE_HEIGHT_OPTIONS.map((option) => ({
                              label: option.label,
                              value: option.value,
                              description: option.value,
                            }))}
                            ariaLabel={`${cfg.label} line height`}
                            onChange={(value) => {
                              field.onChange(value);
                              handleLiveChange(lineHeightFieldName, value);
                            }}
                          />
                        </FormControl>

                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  {/* TEXT TRANSFORM */}
                  <FormField
                    control={form.control}
                    name={transformFieldName as any}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium tracking-wider text-slate-500 uppercase">Text Transform</FormLabel>

                        <FormControl>
                          <TypographyOptionSelector
                            namePrefix={`${cfg.role}-text-transform`}
                            value={(field.value as TextTransformValue) ?? "none"}
                            options={TEXT_TRANSFORM_OPTIONS.map((option) => ({
                              label: option.label,
                              value: option.value,
                            }))}
                            ariaLabel={`${cfg.label} text transform`}
                            onChange={(value) => {
                              const transform = value as TextTransformValue;

                              field.onChange(transform);
                              handleLiveChange(transformFieldName, transform);
                            }}
                          />
                        </FormControl>

                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>
              );
            })}
          </section>

          {/* STICKY FOOTER */}
          <div className="sticky bottom-0 z-[99] -m-5 flex h-[60px] items-center justify-end gap-3 border-slate-100 bg-white/90 px-5 md:border-t md:backdrop-blur-md">
            <Button
              type="button"
              variant="ghost"
              onClick={handleCancel}
              className="text-sm font-medium text-slate-400 transition-colors hover:text-slate-900"
            >
              <X strokeWidth={1.5} size={16} />
              <span>Discard</span>
            </Button>

            <Button
              type="submit"
              disabled={mutation.isPending}
              className="h-9 rounded-md bg-slate-900 px-8 text-sm font-medium text-white shadow-slate-200 transition-all hover:bg-slate-800 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save strokeWidth={1.5} className="mr-1.5 h-4 w-4" />
              {mutation.isPending ? "Updating..." : "Save"}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
