"use client";

import { useForm } from "react-hook-form";
import { Type, Mic, Video, ChevronLeft, ChevronRight } from "lucide-react";
import { usePreviewDraft } from "../PreviewDraftContext";
import { useSaveEventSection } from "../../../../hooks/useEvents";
import { cn } from "../../../../utils/utils";
import { Checkbox } from "../../../../components/ui/checkbox";
import { Input } from "../../../../components/ui/input";
import { Slider } from "../../../../components/ui/Slider";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../../../../components/ui/form";
import { HorizontalScroll } from "../../../../components/ui/HorizontalScroll";
import { LabelForm, SubLabelForm } from "../../../../components/ui/LabelForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import EditorHeader from "./EditorHeader";

/* ---------------- TYPES & SCHEMA ---------------- */

const wishTypes = ["text", "audio", "video"] as const;
export type WishesType = (typeof wishTypes)[number];

export const schema = z.object({
  title: z.string().trim().min(1, "Title is required").max(100, "Title cannot exceed 100 characters"),
  types: z.array(z.enum(["text", "audio", "video"])).min(1, "Select at least one type"),
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

export default function WishesEditor({ onBack, handleBack, eventKey }: { onBack: () => void; handleBack: () => void; eventKey: string }) {
  // Hooks
  const { draft, updateSection, resetDraft, refreshEvent } = usePreviewDraft();
  const wishes = draft.wishes ?? {};
  const eventId = draft.invite.id;
  const mutation = useSaveEventSection(eventKey, eventId);

  // Form Setup
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      title: wishes.title ?? "Send Your Wishes",
      types: wishes.types ?? ["text"],
      limits: wishes.limits ?? {
        text: 20,
        audio: 10,
        video: 5,
      },
    },
  });

  // Watchers
  const selectedTypes = form.watch("types");
  const limits = form.watch("limits");

  // Handlers
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

  return (
    <div className="animate-in fade-in flex h-full flex-col rounded-lg duration-500 md:rounded-none">
      <EditorHeader title="Wishes" handleBack={handleBack} />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="overflow-auto p-5 md:h-[calc(100dvh-125px)] md:min-h-[calc(100dvh-125px)] md:rounded-none [&::-webkit-scrollbar]:h-0 [&::-webkit-scrollbar]:w-[2px] [&::-webkit-scrollbar-thumb]:rounded-[10px] [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-track]:rounded-[10px] [&::-webkit-scrollbar-track]:bg-slate-100">
            <section>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-1">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-1">
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
                <FormItem className="flex flex-col gap-1">
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
                              <Checkbox checked={isChecked} onCheckedChange={() => toggleType(option.id)} className="hidden" />
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
                {selectedTypes.map((type) => (
                  <div key={type} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <LabelForm className="capitalize">{type} Wishes Limit</LabelForm>
                      <LabelForm>{limits[type]}</LabelForm>
                    </div>

                    <div className="h-[40px] flex items-center">
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
                  </div>
                ))}
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
      </Form>
    </div>
  );
}
