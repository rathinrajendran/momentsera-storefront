"use client";

import { useForm, FormProvider } from "react-hook-form";
import { usePreviewDraft } from "../PreviewDraftContext";
import { useSaveEventSection } from "../../../../hooks/useEvents";
import { Button } from "../../../../components/ui/button";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "../../../../components/ui/form";
import { Slider } from "../../../../components/ui/Slider";
import { cn } from "../../../../utils/utils";
import { AUDIO_PRESETS } from "../../../../public/constants/Presets";
import { Switch } from "../../../../components/ui/switch";
import { useRef, useState } from "react";
import { RadioGroup, RadioGroupItem } from "../../../../components/ui/radio-group";
import { ChevronLeft, Music, Pause, Play, Save, X } from "lucide-react";
import { HorizontalScroll } from "../../../../components/ui/HorizontalScroll";
import {
  Sparkles,
  Minus,
  Waves,
  Clapperboard,
  ArrowUp,
  ArrowDown,
  ZoomIn,
  MoveLeft,
  MoveRight,
  FlipHorizontal,
  PlayCircle,
  MousePointerClick,
  Repeat,
  Layers3,
  Volume2,
  Zap,
} from "lucide-react";
import EditorHeader from "./EditorHeader";

/* ---------------- TYPES ---------------- */

type DesignForm = {
  animation_style: string;
  animation_entry: string;
  scroll_behavior: string;
  animation_speed: number;
  animation_duration: string;
  animation_delay: string;
  animation_loop: boolean;
};

/* ---------------- ANIMATION CONFIG ---------------- */

const ANIMATION_PRESETS = [
  {
    id: "smooth",
    name: "Smooth",
    icon: Sparkles,
    description: "Soft elegant motion",
  },
  {
    id: "minimal",
    name: "Minimal",
    icon: Minus,
    description: "Clean subtle transitions",
  },
  {
    id: "bounce",
    name: "Bounce",
    icon: Waves,
    description: "Energetic playful motion",
  },
  {
    id: "cinematic",
    name: "Cinematic",
    icon: Clapperboard,
    description: "Luxury slow animations",
  },
];

/* ---------------- SECTION HEADER ---------------- */

export function SectionHeader({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon size={14} className="text-slate-400" />
      <span className="mb-0 text-[0.7rem] font-medium tracking-wider text-slate-400 uppercase">{label}</span>
    </div>
  );
}

/* ---------------- TOGGLE ROW ---------------- */

function ToggleRow({ label, checked, onCheckedChange }: { label: string; checked: boolean; onCheckedChange: (val: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="capitalize mb-0 text-[0.7rem] font-medium tracking-normal text-[#424242]">{label}</span>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

/* ---------------- COMPONENT ---------------- */

export default function MotionEditor({ eventKey, onBack }: { eventKey: string; onBack: () => void }) {
  /* ---------------- HOOKS ---------------- */

  const { draft, replaceSection, resetDraft, refreshEvent } = usePreviewDraft();

  const eventId = draft.invite.id;

  const mutation = useSaveEventSection(eventKey, eventId);

  /* ---------------- STATE ---------------- */

  const [previewing, setPreviewing] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  /* ---------------- FORM ---------------- */

  const form = useForm<DesignForm>({
    defaultValues: {
      ...draft.motion,
      animation_style: draft.motion.animation_style ?? "smooth",
      animation_entry: draft.motion.animation_entry ?? "fade-up",
      scroll_behavior: draft.motion.scroll_behavior ?? "on-scroll",
      animation_duration: draft.motion.animation_duration ?? "1s",
      animation_delay: draft.motion.animation_delay ?? "100ms",
      animation_speed: draft.motion.animation_speed ?? 50,
    },
  });

  /* ---------------- LIVE CHANGE ---------------- */

  function handleLiveChange<K extends keyof DesignForm>(key: K, value: DesignForm[K]) {
    const latest = form.getValues();

    replaceSection("motion", {
      ...latest,
      [key]: value,
    });
  }

  /* ---------------- SAVE / CANCEL ---------------- */

  async function handleSaveSuccess() {
    await refreshEvent(eventKey);

    onBack();
  }

  function onSubmit(values: DesignForm) {
    mutation.mutate(
      {
        path: "motion",
        stage: "motion",
        data: values,
      },
      {
        onSuccess: handleSaveSuccess,
      },
    );
  }

  function handleCancel() {
    resetDraft();
    onBack();
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="animate-in fade-in flex h-full flex-col rounded-lg duration-500 md:rounded-none">
      <EditorHeader title="Animations" handleCancel={handleCancel} />

      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-1 flex-col justify-between space-y-5 p-5 pb-0 md:min-h-[calc(100dvh-115px)] md:rounded-none [&::-webkit-scrollbar]:h-0 [&::-webkit-scrollbar]:w-[2px] [&::-webkit-scrollbar-thumb]:rounded-[10px] [&::-webkit-scrollbar-thumb]:bg-[#c1c1c1] [&::-webkit-scrollbar-track]:rounded-[10px] [&::-webkit-scrollbar-track]:bg-[#78909C]"
        >
          <section className="space-y-6 [&>*:last-child]:mb-6">
            {/* Animation Preset */}
            <FormField
              control={form.control}
              name="animation_style"
              render={({ field }) => (
                <FormItem className={cn("transition-all duration-300")}>
                  <span className="capitalize mb-0 text-[0.7rem] font-medium tracking-normal text-[#424242]">Animation Preset</span>
                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        handleLiveChange("animation_style", value);
                      }}
                      className="grid grid-cols-1"
                    >
                      <HorizontalScroll>
                        {ANIMATION_PRESETS.map((preset) => {
                          const Icon = preset.icon;
                          const isSelected = field.value === preset.id;

                          return (
                            <label
                              key={preset.id}
                              htmlFor={`preset-${preset.id}`}
                              className={cn(
                                "relative min-w-28 rounded-2xl border p-5 transition-all duration-300",
                                isSelected
                                  ? "border-slate-900 bg-slate-900 text-white shadow-xl shadow-slate-200"
                                  : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50",
                              )}
                            >
                              <RadioGroupItem value={preset.id} id={`preset-${preset.id}`} className="hidden" />

                              <div className="mb-6 flex items-center justify-between">
                                <div className={cn("flex items-center justify-center", isSelected ? "text-white" : "text-slate-600")}>
                                  <Icon className="w-5" strokeWidth={1} />
                                </div>
                              </div>

                              <div>
                                <p
                                  className={cn("truncate text-[11px] font-bold capitalize", isSelected ? "text-white" : "text-slate-700")}
                                >
                                  {preset.name}
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
            {/* Entrance Effect */}
            <FormField
              control={form.control}
              name="animation_entry"
              render={({ field }) => (
                <FormItem className={cn("transition-all duration-300")}>
                  <span className="capitalize mb-0 text-[0.7rem] font-medium tracking-normal text-[#424242]">Entrance Effect</span>
                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        handleLiveChange("animation_entry", value);
                      }}
                      className="grid grid-cols-1"
                    >
                      <HorizontalScroll>
                        {[
                          {
                            id: "fade-up",
                            title: "Fade Up",
                            label: "upward",
                            icon: ArrowUp,
                          },
                          {
                            id: "fade-down",
                            title: "Fade Down",
                            label: "downward",
                            icon: ArrowDown,
                          },
                          {
                            id: "zoom-in",
                            title: "Zoom In",
                            label: "scale entrance",
                            icon: ZoomIn,
                          },
                          {
                            id: "slide-left",
                            title: "Slide Left",
                            label: "from left",
                            icon: MoveLeft,
                          },
                          {
                            id: "slide-right",
                            title: "Slide Right",
                            label: "from right",
                            icon: MoveRight,
                          },
                          {
                            id: "flip",
                            title: "Flip",
                            label: "3D flip",
                            icon: FlipHorizontal,
                          },
                        ].map((effect) => {
                          const Icon = effect.icon;
                          const isSelected = field.value === effect.id;

                          return (
                            <label
                              key={effect.id}
                              htmlFor={`entry-${effect.id}`}
                              className={cn(
                                "relative min-w-28 rounded-2xl border p-5 transition-all duration-300",
                                isSelected
                                  ? "border-slate-900 bg-slate-900 text-white shadow-xl shadow-slate-200"
                                  : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50",
                              )}
                            >
                              <RadioGroupItem value={effect.id} id={`entry-${effect.id}`} className="hidden" />

                              <div className="mb-6 flex items-center justify-between">
                                <div className={cn("flex items-center justify-center", isSelected ? "text-white" : "text-slate-600")}>
                                  <Icon size={18} strokeWidth={1.5} />
                                </div>
                              </div>

                              <div className="space-y-1">
                                <p
                                  className={cn(
                                    "text-[11px] leading-none font-bold capitalize",
                                    isSelected ? "text-white" : "text-slate-700",
                                  )}
                                >
                                  {effect.title}
                                </p>

                                <p className={cn("text-[9px] leading-tight", isSelected ? "text-white/60" : "text-slate-400")}>
                                  {effect.label}
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
            {/* Scroll Behavior */}
            <FormField
              control={form.control}
              name="scroll_behavior"
              render={({ field }) => (
                <FormItem className={cn("transition-all duration-300")}>
                  <span className="capitalize mb-0 text-[0.7rem] font-medium tracking-normal text-[#424242]">Scroll Behavior</span>
                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        handleLiveChange("scroll_behavior", value);
                      }}
                      className="grid grid-cols-1"
                    >
                      <HorizontalScroll>
                        {[
                          {
                            id: "on-load",
                            title: "On Load",
                            label: "immediately",
                            icon: PlayCircle,
                          },
                          {
                            id: "on-scroll",
                            title: "On Scroll",
                            label: "during scroll",
                            icon: MousePointerClick,
                          },
                          {
                            id: "continuous",
                            title: "Continuous",
                            label: "always moving",
                            icon: Repeat,
                          },
                          {
                            id: "parallax",
                            title: "Parallax",
                            label: "depth scroll",
                            icon: Layers3,
                          },
                        ].map((behavior) => {
                          const Icon = behavior.icon;
                          const isSelected = field.value === behavior.id;

                          return (
                            <label
                              key={behavior.id}
                              htmlFor={`scroll-${behavior.id}`}
                              className={cn(
                                "relative min-w-28 rounded-2xl border p-5 transition-all duration-300",
                                isSelected
                                  ? "border-slate-900 bg-slate-900 text-white shadow-xl shadow-slate-200"
                                  : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50",
                              )}
                            >
                              <RadioGroupItem value={behavior.id} id={`scroll-${behavior.id}`} className="hidden" />

                              <div className="mb-6 flex items-center justify-between">
                                <div className={cn("flex items-center justify-center", isSelected ? "text-white" : "text-slate-600")}>
                                  <Icon size={18} strokeWidth={1.5} />
                                </div>
                              </div>

                              <div className="space-y-1">
                                <p
                                  className={cn(
                                    "text-[11px] leading-none font-bold capitalize",
                                    isSelected ? "text-white" : "text-slate-700",
                                  )}
                                >
                                  {behavior.title}
                                </p>

                                <p className={cn("text-[9px] leading-tight", isSelected ? "text-white/60" : "text-slate-400")}>
                                  {behavior.label}
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
            {/* Duration */}
            <FormField
              control={form.control}
              name="animation_duration"
              render={({ field }) => (
                <FormItem className={cn("transition-all duration-300")}>
                  <span className="capitalize mb-0 text-[0.7rem] font-medium tracking-normal text-[#424242]">Duration</span>
                  <div className="flex gap-1 rounded-xl border border-slate-100 bg-slate-50 p-1">
                    {["0.5s", "1s", "1.5s", "2s"].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => {
                          field.onChange(t);
                          handleLiveChange("animation_duration", t);
                        }}
                        className={cn(
                          "flex-1 rounded-lg py-2 text-[10px] font-bold transition-all",
                          field.value === t ? "bg-slate-900 text-white shadow-sm" : "text-slate-500 hover:text-slate-900",
                        )}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </FormItem>
              )}
            />
            {/* Delay */}
            <FormField
              control={form.control}
              name="animation_delay"
              render={({ field }) => (
                <FormItem className={cn("transition-all duration-300")}>
                  <span className="capitalize mb-0 text-[0.7rem] font-medium tracking-normal text-[#424242]">Delay</span>
                  <div className="flex gap-1 rounded-xl border border-slate-100 bg-slate-50 p-1">
                    {["0ms", "100ms", "300ms", "500ms"].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => {
                          field.onChange(d);
                          handleLiveChange("animation_delay", d);
                        }}
                        className={cn(
                          "flex-1 rounded-lg py-2 text-[10px] font-bold transition-all",
                          field.value === d ? "bg-slate-900 text-white shadow-sm" : "text-slate-500 hover:text-slate-900",
                        )}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </FormItem>
              )}
            />
            {/* Speed */}
            <FormField
              control={form.control}
              name="animation_speed"
              render={({ field }) => (
                <FormItem className={cn("transition-all duration-300")}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="capitalize mb-0 text-[0.7rem] font-medium tracking-normal text-[#424242]">Speed</span>
                    <span className="capitalize mb-0 text-[0.7rem] font-medium tracking-normal text-[#424242]">{field.value ?? 50}%</span>
                  </div>
                  <FormControl>
                    <Slider
                      value={[field.value ?? 50]}
                      max={100}
                      step={5}
                      onValueChange={(val) => {
                        field.onChange(val[0]);
                        handleLiveChange("animation_speed", val[0]);
                      }}
                    />
                  </FormControl>
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
              className="hadow-slate-200 h-8 rounded-md bg-slate-900 px-10 py-2 text-xs text-white transition-all hover:bg-slate-800 active:scale-95 disabled:opacity-600"
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
