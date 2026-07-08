"use client";

import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2, X, Plus, Save } from "lucide-react";
import { usePreviewDraft } from "../PreviewDraftContext";
import { useSaveEventSection } from "../../../../hooks/useEvents";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "../../../../components/ui/form";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { Textarea } from "../../../../components/ui/textarea";
import { CustomDatePicker } from "../../../../components/ui/CustomDatePicker";
import EditorHeader from "./EditorHeader";

/* ---------------- SCHEMA ---------------- */
const timelineItemSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(1, "Milestone title is required"),
  date: z.string({ message: "Date is required" }).min(1, "Date is required"),
  description: z.string().trim().min(1, "Description is required"),
  imageUrl: z.string().optional(),
});

const schema = z.object({
  timeline: z.array(timelineItemSchema).min(1, "At least one milestone is required"),
});

type FormValues = z.infer<typeof schema>;
type TimelineItem = FormValues["timeline"][number];

/* ---------------- COMPONENT ---------------- */
export default function TimelineEditor({ onBack, eventKey }: { onBack: () => void; eventKey: string }) {
  // Hooks
  const { draft, updateSection, resetDraft, refreshEvent } = usePreviewDraft();
  const eventId = draft.invite.id;
  const mutation = useSaveEventSection(eventKey, eventId);

  // Derived initial data structure with fallback mapping[cite: 2]
  const rawTimeline = Array.isArray(draft?.timeline) ? draft.timeline : Object.values(draft?.timeline || {});
  const timelineData: TimelineItem[] =
    rawTimeline.length > 0
      ? rawTimeline.map((item) => ({
          ...item,
        }))
      : [
          {
            title: "",
            date: "",
            description: "",
            imageUrl: "",
          },
        ];

  // Form initialization[cite: 2]
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      timeline: timelineData as FormValues["timeline"],
    },
  });

  const { formState } = form;

  // Field Arrays[cite: 2]
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "timeline",
  });

  // Watch fields safely to handle dynamic interaction states[cite: 2]
  const watchedTimeline = useWatch({
    control: form.control,
    name: "timeline",
  });

  const hasIncompleteMilestone = watchedTimeline?.some((item) => !item?.title?.trim() || !item?.date?.trim() || !item?.description?.trim());

  // Live state syncing wrapper[cite: 2]
  function handleLiveChange() {
    const currentValues = form.getValues();
    updateSection("timeline", currentValues.timeline);
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
        path: "timeline",
        stage: "timeline",
        data: values.timeline,
      },
      { onSuccess: handleSaveSuccess },
    );
  }

  return (
    <div className="animate-in fade-in flex h-full flex-col rounded-lg duration-500 md:rounded-none">
      <EditorHeader title="Our Story Timeline" handleCancel={handleCancel} />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-1 flex-col justify-between space-y-5 p-5 pb-0 md:min-h-[calc(100dvh-115px)] md:rounded-none [&::-webkit-scrollbar]:h-0 [&::-webkit-scrollbar]:w-[2px] [&::-webkit-scrollbar-thumb]:rounded-[10px] [&::-webkit-scrollbar-thumb]:bg-[#c1c1c1] [&::-webkit-scrollbar-track]:rounded-[10px] [&::-webkit-scrollbar-track]:bg-[#78909C]"
        >
          {/* Section 1: Story Timeline Items */}
          <section className="space-y-6 [&>*:last-child]:mb-6">
            {fields.map((field, index) => {
              return (
                <div
                  key={field.id}
                  className="group relative rounded-2xl border border-slate-100 p-5 transition-all duration-500 hover:border-slate-200 hover:bg-white hover:shadow-xl hover:shadow-slate-100"
                >
                  {/* Delete Button[cite: 2] */}
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        remove(index);
                        requestAnimationFrame(() => {
                          handleLiveChange();
                        });
                      }}
                      className="absolute top-4 right-4 rounded-full p-1.5 text-slate-300 opacity-0 transition-all group-hover:opacity-100 hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}

                  <div className="space-y-4">
                    {/* Milestone Title */}
                    <FormField
                      control={form.control}
                      name={`timeline.${index}.title`}
                      render={({ field: titleField }) => (
                        <FormItem>
                          <FormLabel>Milestone Title</FormLabel>
                          <FormControl>
                            <Input
                              {...titleField}
                              placeholder="e.g. First Meeting, First Date"
                              onChange={(e) => {
                                titleField.onChange(e);
                                handleLiveChange();
                              }}
                            />
                          </FormControl>
                          <FormMessage className="text-[10px]" />
                        </FormItem>
                      )}
                    />

                    {/* Date Picker */}
                    <FormField
                      control={form.control}
                      name={`timeline.${index}.date`}
                      render={({ field: dateField }) => (
                        <FormItem>
                          <FormLabel>Date</FormLabel>
                          <CustomDatePicker
                            value={dateField.value ? new Date(dateField.value) : undefined}
                            onChange={(selectedDate) => {
                              if (!selectedDate) {
                                dateField.onChange("");
                                handleLiveChange();
                                return;
                              }
                              const isoString = selectedDate.toISOString();
                              dateField.onChange(isoString);
                              handleLiveChange();
                            }}
                          />
                          <FormMessage className="text-[10px]" />
                        </FormItem>
                      )}
                    />

                    {/* Story Description Textarea */}
                    <FormField
                      control={form.control}
                      name={`timeline.${index}.description`}
                      render={({ field: descField }) => (
                        <FormItem>
                          <FormLabel>Story Details</FormLabel>
                          <FormControl>
                            <Textarea
                              {...descField}
                              placeholder="Describe this memorable moment..."
                              onChange={(e) => {
                                descField.onChange(e);
                                handleLiveChange();
                              }}
                            />
                          </FormControl>
                          <FormMessage className="text-[10px]" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              );
            })}
          </section>

          {/* Sticky Actions Footer[cite: 2] */}
          <div className="sticky bottom-0 z-[99] -m-5 flex h-16 items-center justify-end gap-3 border-slate-100 bg-white/90 px-5 md:border-t md:backdrop-blur-md">
            <Button
              type="button"
              variant="ghost"
              onClick={handleCancel}
              className="text-xs font-semibold text-slate-400 transition-colors hover:text-slate-900"
            >
              <X strokeWidth={1} size={14} />
              <span>Discard</span>
            </Button>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={hasIncompleteMilestone}
                onClick={() =>
                  append({
                    title: "",
                    date: "",
                    description: "",
                    imageUrl: "",
                  })
                }
                className="rounded-md border border-slate-200 bg-white p-2 text-xs font-light text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-900 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Plus className="mr-1 h-3 w-3" strokeWidth={1} /> Add Milestone
              </Button>
              <Button
                type="submit"
                disabled={!formState.isValid || mutation.isPending}
                className="h-8 rounded-md bg-slate-900 px-10 py-2 text-xs text-white shadow-slate-200 transition-all hover:bg-slate-800 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Save strokeWidth={1} className="mr-1 h-3 w-3" />
                {mutation.isPending ? <span className="font-normal">Updating...</span> : <span className="font-normal">Save</span>}
              </Button>
            </div>
            {form.formState.errors.timeline?.message && (
              <p className="px-5 text-xs text-red-500">{form.formState.errors.timeline.message}</p>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
