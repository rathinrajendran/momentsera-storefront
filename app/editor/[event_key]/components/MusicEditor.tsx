"use client";

import { useForm, FormProvider } from "react-hook-form";
import { usePreviewDraft } from "../PreviewDraftContext";
import { useSaveEventSection } from "../../../../hooks/useEvents";
import { Button } from "../../../../components/ui/button";
import { FormField, FormItem, FormControl, FormMessage } from "../../../../components/ui/form";
import { Slider } from "../../../../components/ui/Slider";
import { cn } from "../../../../utils/utils";
import { AUDIO_PRESETS } from "../../../../public/constants/Presets";
import { Switch } from "../../../../components/ui/switch";
import { useRef, useState } from "react";
import { RadioGroup, RadioGroupItem } from "../../../../components/ui/radio-group";
import { ChevronLeft, Music, Pause, Play, Save, X } from "lucide-react";
import { HorizontalScroll } from "../../../../components/ui/HorizontalScroll";
import EditorHeader from "./EditorHeader";

/* ---------------- TYPES ---------------- */

type DesignForm = {
  background_audio?: string;
  music: boolean;
  allow_mute: boolean;
  loop_music: boolean;
  fade_in: boolean;
  fade_out: boolean;
  volume_level: number;
};

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
      <span className="mb-0 text-[0.7rem] font-medium tracking-normal text-[#424242] capitalize">{label}</span>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

/* ---------------- COMPONENT ---------------- */

export default function MusicEditor({ eventKey, onBack }: { eventKey: string; onBack: () => void }) {
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
      ...draft.music,
      music: draft.music.music ?? true,
      background_audio: draft.music.background_audio ?? AUDIO_PRESETS[0]?.url,
      loop_music: draft.music.loop_music ?? true,
      fade_in: draft.music.fade_in ?? true,
      fade_out: draft.music.fade_out ?? true,
      volume_level: draft.music.volume_level ?? 60,
    },
  });

  /* ---------------- LIVE CHANGE ---------------- */

  function handleLiveChange<K extends keyof DesignForm>(key: K, value: DesignForm[K]) {
    const latest = form.getValues();

    replaceSection("music", {
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
        path: "music",
        stage: "music",
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

  /* ---------------- AUDIO PREVIEW ---------------- */

  const playPreview = (url?: string, id?: string) => {
    if (!url) return;
    const { loop_music, volume_level, fade_in } = form.getValues();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    const audio = new Audio(url);
    audio.volume = (volume_level || 60) / 100;
    audio.loop = !!loop_music;
    audio.play().then(() => {
      audioRef.current = audio;
      setPreviewing(id ?? null);
      if (fade_in) {
        audio.volume = 0;
        let v = 0;
        const target = (volume_level || 60) / 100;
        const interval = setInterval(() => {
          v += 0.05;
          if (v >= target) {
            audio.volume = target;
            clearInterval(interval);
          } else {
            audio.volume = v;
          }
        }, 100);
      }
    });
  };

  const stopPreview = () => {
    if (!audioRef.current) return;
    const { fade_out } = form.getValues();
    const audio = audioRef.current;
    if (fade_out) {
      let v = audio.volume;
      const interval = setInterval(() => {
        v -= 0.05;
        if (v <= 0) {
          audio.pause();
          audio.currentTime = 0;
          clearInterval(interval);
          audioRef.current = null;
        } else {
          audio.volume = v;
        }
      }, 100);
    } else {
      audio.pause();
      audio.currentTime = 0;
      audioRef.current = null;
    }
    setPreviewing(null);
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="animate-in fade-in flex h-full flex-col rounded-xl duration-500 md:rounded-none">
      <EditorHeader title="Music" handleCancel={handleCancel} />

      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-1 flex-col justify-between space-y-6 p-5 pb-0 md:min-h-[calc(100dvh-115px)] md:rounded-none [&::-webkit-scrollbar]:h-0 [&::-webkit-scrollbar]:w-[2px] [&::-webkit-scrollbar-thumb]:rounded-[10px] [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-track]:rounded-[10px] [&::-webkit-scrollbar-track]:bg-slate-100"
        >
          <section className="space-y-6 [&>*:last-child]:mb-6">
            {/* Audio Track Selector Option */}
            <FormField
              control={form.control}
              name="background_audio"
              render={({ field }) => (
                <FormItem className="space-y-2 transition-all duration-300">
                  <span className="text-xs font-semibold text-slate-700">Audio Tracks</span>
                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      onValueChange={(url) => {
                        field.onChange(url);
                        handleLiveChange("background_audio", url);
                      }}
                      className="grid grid-cols-1"
                    >
                      <HorizontalScroll className="pb-1">
                        {AUDIO_PRESETS.map((audio) => {
                          const isPlaying = previewing === audio.id;
                          const isSelected = field.value === audio.url;

                          return (
                            <label
                              key={audio.id}
                              htmlFor={`audio-${audio.id}`}
                              className={cn(
                                "relative flex max-w-[160px] min-w-[120px] shrink-0 cursor-pointer flex-col justify-between rounded-xl border p-4 transition-all duration-300 md:min-w-[140px]",
                                isSelected
                                  ? "border-slate-900 bg-slate-900 text-white shadow-md shadow-slate-900/10"
                                  : "border-slate-200 bg-slate-50/40 text-slate-700 hover:border-slate-300 hover:bg-white",
                              )}
                            >
                              <RadioGroupItem value={audio.url} id={`audio-${audio.id}`} className="hidden" />

                              {/* Card Action Header */}
                              <div className="mb-4 flex items-center justify-between">
                                <div className={cn("flex items-center justify-center", isSelected ? "text-white" : "text-slate-400")}>
                                  {isPlaying ? (
                                    <div className="flex h-4 items-end gap-[2px] pt-1">
                                      <span className="h-2 w-[3px] animate-pulse rounded-full bg-current" />
                                      <span className="h-4 w-[3px] animate-pulse rounded-full bg-current" />
                                      <span className="h-1.5 w-[3px] animate-pulse rounded-full bg-current" />
                                      <span className="h-3 w-[3px] animate-pulse rounded-full bg-current" />
                                    </div>
                                  ) : (
                                    <Music className="h-4 w-4" strokeWidth={1.5} />
                                  )}
                                </div>

                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    isPlaying ? stopPreview() : playPreview(audio.url, audio.id);
                                  }}
                                  className={cn(
                                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full shadow-sm transition-colors",
                                    isSelected
                                      ? "bg-white/15 text-white hover:bg-white/25"
                                      : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-950",
                                  )}
                                >
                                  {isPlaying ? (
                                    <Pause size={12} fill="currentColor" />
                                  ) : (
                                    <Play size={12} className="ml-[1px]" fill="currentColor" />
                                  )}
                                </button>
                              </div>

                              {/* Label Track Metadata */}
                              <div className="min-w-0">
                                <p className="truncate text-[11px] font-semibold tracking-wide capitalize">{audio.name}</p>
                              </div>
                            </label>
                          );
                        })}
                      </HorizontalScroll>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage className="text-destructive text-[10px] font-medium" />
                </FormItem>
              )}
            />

            {/* Toggle Configuration Cards */}
            <div className="space-y-3 rounded-xl border border-slate-100 bg-slate-50/30 p-1.5">
              <FormField
                control={form.control}
                name="loop_music"
                render={({ field }) => (
                  <FormItem className="space-y-0 transition-all duration-300">
                    <FormControl>
                      <ToggleRow
                        label="Loop Music"
                        checked={!!field.value}
                        onCheckedChange={(val) => {
                          field.onChange(val);
                          handleLiveChange("loop_music", val);
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fade_in"
                render={({ field }) => (
                  <FormItem className="space-y-0 transition-all duration-300">
                    <FormControl>
                      <ToggleRow
                        label="Fade In Effect"
                        checked={!!field.value}
                        onCheckedChange={(val) => {
                          field.onChange(val);
                          handleLiveChange("fade_in", val);
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fade_out"
                render={({ field }) => (
                  <FormItem className="space-y-0 transition-all duration-300">
                    <FormControl>
                      <ToggleRow
                        label="Fade Out Effect"
                        checked={!!field.value}
                        onCheckedChange={(val) => {
                          field.onChange(val);
                          handleLiveChange("fade_out", val);
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Volume Workspace Controls */}
            <FormField
              control={form.control}
              name="volume_level"
              render={({ field }) => (
                <FormItem className="space-y-2.5 rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700">Output Volume</span>
                    <span className="font-mono text-xs font-bold text-slate-500">{field.value || 60}%</span>
                  </div>
                  <FormControl>
                    <div className="py-1">
                      <Slider
                        value={[field.value || 60]}
                        max={100}
                        step={5}
                        onValueChange={(val) => {
                          field.onChange(val[0]);
                          handleLiveChange("volume_level", val[0]);
                        }}
                      />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          </section>

          {/* Sticky Actions Footer Drawer Panel */}
          <div className="sticky bottom-0 z-[99] -mx-5 flex h-16 items-center justify-end gap-3 border-t border-slate-100 bg-white/90 px-5 backdrop-blur-md">
            <Button
              type="button"
              variant="ghost"
              onClick={handleCancel}
              className="h-9 text-xs font-semibold text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-900"
            >
              <X strokeWidth={1.5} size={14} />
              <span>Discard</span>
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="h-9 rounded-lg bg-slate-900 px-10 text-xs font-semibold text-white shadow-md shadow-slate-100 transition-all hover:bg-slate-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Save strokeWidth={1.5} size={14} className="mr-1" />
              {mutation.isPending ? "Updating..." : "Save Config"}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
