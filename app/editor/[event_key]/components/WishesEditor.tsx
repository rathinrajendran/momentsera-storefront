"use client";

import { useForm } from "react-hook-form";
import { Type, Mic, Video, X, ChevronLeft, Save } from "lucide-react";
import { usePreviewDraft } from "../PreviewDraftContext";
import { useSaveEventSection } from "../../../../hooks/useEvents";
import { cn } from "../../../../utils/utils";
import { Checkbox } from "../../../../components/ui/checkbox";
import { Input } from "../../../../components/ui/input";
import { Slider } from "../../../../components/ui/Slider";
import { Button } from "../../../../components/ui/button";
import { Switch } from "../../../../components/ui/switch";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../../../../components/ui/form";
import { HorizontalScroll } from "../../../../components/ui/HorizontalScroll";
import { LabelForm, SubLabelForm } from "../../../../components/ui/LabelForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import EditorHeader from "./EditorHeader";

/* ---------------- TYPES ---------------- */
const wishTypes = ["text", "audio", "video"] as const;

export type WishesType = (typeof wishTypes)[number];

export const schema = z.object({
  enabled: z.boolean(),

  title: z.string().trim().min(1, "Title is required").max(100, "Title cannot exceed 100 characters"),

  types: z.array(z.enum(["text", "audio", "video"])).min(1, "Select at least one type"),

  // limit: z.number().min(1, "Minimum 1 wish required").max(100, "Maximum 100 wishes allowed"),
  limits: z.object({
    text: z.number().min(1).max(100),
    audio: z.number().min(1).max(100),
    video: z.number().min(1).max(100),
  }),
});

export type FormValues = z.infer<typeof schema>;

/* ---------------- OPTIONS ---------------- */

const WISH_OPTIONS = [
  {
    id: "text",
    label: "Text Wishes",
    icon: Type,
    description: "Traditional written messages",
  },
  {
    id: "audio",
    label: "Audio Wishes",
    icon: Mic,
    description: "Voice-recorded notes",
  },
  {
    id: "video",
    label: "Video Wishes",
    icon: Video,
    description: "Heartfelt video uploads",
  },
] as const;

/* ---------------- COMPONENT ---------------- */

export default function WishesEditor({ onBack, eventKey }: { onBack: () => void; eventKey: string }) {
  /* ---------------- HOOKS ---------------- */

  const { draft, updateSection, resetDraft, refreshEvent } = usePreviewDraft();

  const wishes = draft.wishes ?? {};
  const eventId = draft.invite.id;

  const mutation = useSaveEventSection(eventKey, eventId);

  /* ---------------- FORM ---------------- */

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      enabled: wishes.enabled ?? false,
      title: wishes.title ?? "Send Your Wishes",
      types: wishes.types ?? ["text"],

      limits: wishes.limits ?? {
        text: 20,
        audio: 10,
        video: 5,
      },
    },
  });

  /* ---------------- WATCHERS ---------------- */
  // const wishesEnabled = form.watch("enabled");
  const selectedTypes = form.watch("types");
const limits = form.watch("limits");
  /* ---------------- HANDLERS ---------------- */

  function handleLiveChange(patch: Partial<FormValues>) {
    updateSection("wishes", {
      ...wishes,
      ...patch,
    });
  }

  function toggleType(type: WishesType) {
    const current = form.getValues("types");

    const next = current.includes(type) ? current.filter((t) => t !== type) : [...current, type];

    form.setValue("types", next, {
      shouldValidate: true,
      shouldDirty: true,
    });

    handleLiveChange({
      types: next,
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

  function onSubmit(values: FormValues) {
    mutation.mutate(
      {
        path: "wishes",
        stage: "wishes",
        data: values,
      },
      {
        onSuccess: handleSaveSuccess,
      },
    );
  }
  /* ---------------- RENDER ---------------- */
  return (
    <div className="animate-in fade-in flex h-full flex-col rounded-lg duration-500 md:rounded-none">
      <EditorHeader title="Wishes" handleCancel={handleCancel} />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-1 flex-col justify-between space-y-5 p-5 pb-0 md:min-h-[calc(100dvh-115px)] md:rounded-none [&::-webkit-scrollbar]:h-0 [&::-webkit-scrollbar]:w-[2px] [&::-webkit-scrollbar-thumb]:rounded-[10px] [&::-webkit-scrollbar-thumb]:bg-[#c1c1c1] [&::-webkit-scrollbar-track]:rounded-[10px] [&::-webkit-scrollbar-track]:bg-[#78909C]"
        >
          {/* Toggle Section */}
          <section className="space-y-6 [&>*:last-child]:mb-6">
            {/* <FormField
              control={form.control}
              name="enabled"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-1">
                      <FormLabel>Activate Wishes</FormLabel>
                      <SubLabelForm>Let guests leave digital memories on your invite.</SubLabelForm>
                    </div>
                    <FormControl>
                      <Switch
                        checked={!!field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          handleLiveChange({ enabled: checked });
                        }}
                      />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            /> */}
            {/* Heading Input */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className={cn("transition-all duration-300")}>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Send Your Wishes"
                      onChange={(e) => {
                        field.onChange(e);
                        handleLiveChange({ title: e.target.value });
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            {/* Type Selection Grid */}
            <FormItem className={cn("transition-all duration-300")}>
              <FormLabel>Wishes Types</FormLabel>
              <HorizontalScroll>
                {WISH_OPTIONS.map((option) => {
                  const isChecked = selectedTypes.includes(option.id);
                  const Icon = option.icon;
                  return (
                    <FormLabel
                      key={option.id}
                      className={cn(
                        "relative shrink-0 cursor-pointer rounded-md border px-3 py-3 capitalize transition-all duration-300 md:h-24",
                        isChecked ? "border-slate-900 bg-slate-900 text-white shadow-lg shadow-slate-200" : "border-slate-200 bg-white",
                      )}
                    >
                      <div className="flex h-full flex-col justify-between">
                        <div>
                          <Icon className="h-5 md:h-5" strokeWidth={1} />
                          <Checkbox checked={isChecked} onCheckedChange={() => toggleType(option.id)} className={cn("hidden")} />
                        </div>
                        <div className="flex flex-col space-y-1">
                          <LabelForm className={cn("text-sm font-medium", isChecked ? "text-white" : "")}>{option.label}</LabelForm>
                          <SubLabelForm>{option.description}</SubLabelForm>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          toggleType(option.id);
                        }}
                        className="absolute inset-0 cursor-pointer"
                      />
                    </FormLabel>
                  );
                })}
              </HorizontalScroll>
            </FormItem>

            {/* Limit Slider */}
            {/* <div className={cn("grid gap-1 transition-all duration-300")}>
              <div className="flex items-center justify-between">
                <LabelForm>Display Limit</LabelForm>
                <LabelForm>{limit} Wishes</LabelForm>
              </div>
              <Slider
                className="my-[3px]"
                min={0}
                max={100}
                step={10}
                value={[limit ?? 10]}
                onValueChange={([val]) => {
                  form.setValue("limit", val, { shouldValidate: true });
                  handleLiveChange({ limit: val });
                }}
              />
            </div> */}
            {selectedTypes.map((type) => (
              <div key={type} className="grid gap-2 rounded-md border border-slate-200 p-4">
                <div className="flex items-center justify-between">
                  <LabelForm className="capitalize">{type} Wishes Limit</LabelForm>

                  <LabelForm>{limits[type]}</LabelForm>
                </div>

                <Slider
                  min={1}
                  max={100}
                  step={1}
                  value={[limits[type]]}
                  onValueChange={([value]) => {
                    const next = {
                      ...limits,
                      [type]: value,
                    };

                    form.setValue("limits", next, {
                      shouldDirty: true,
                      shouldValidate: true,
                    });

                    handleLiveChange({
                      limits: next,
                    });
                  }}
                />
              </div>
            ))}
          </section>

          {/* Sticky Actions Footer */}
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
      </Form>
    </div>
  );
}
