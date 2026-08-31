"use client";

import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2, X, Plus, Save, ChevronLeft, ChevronRight } from "lucide-react";
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
export default function TimelineEditor({ onBack, handleBack, eventKey }: { onBack: () => void; handleBack: () => void; eventKey: string }) {
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
      <EditorHeader title="Timeline" handleBack={handleBack} />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="overflow-auto p-5 md:h-[calc(100dvh-125px)] md:min-h-[calc(100dvh-125px)] md:rounded-none [&::-webkit-scrollbar]:h-0 [&::-webkit-scrollbar]:w-[2px] [&::-webkit-scrollbar-thumb]:rounded-[10px] [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-track]:rounded-[10px] [&::-webkit-scrollbar-track]:bg-slate-100">
            {" "}
            {/* Section 1: Story Timeline Items */}
            <section>
              {fields.map((field, index) => {
                return (
                  <div key={field.id} className="grid grid-cols-1 gap-4 sm:grid-cols-1">
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
                    <hr className="mt-[20px] mr-[-20px] mb-[0] ml-[-20px] [&>*:last-child]:bg-white" />
                  </div>
                );
              })}
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
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={hasIncompleteMilestone}
                onClick={() =>
                  append({
                    title: "",
                    date: "",
                    description: "",
                    imageUrl: "",
                  })
                }
                className="font-regular inline-flex h-full min-h-[34px] w-auto cursor-pointer items-center justify-between gap-3 rounded-md border border-gray-200 bg-white pr-3 pl-3 text-xs text-black/70 transition-all hover:bg-gray-200"
              >
                <Plus strokeWidth={1.5} size={14} />
              </button>
              <button
                type="submit"
                disabled={!formState.isValid || mutation.isPending}
                className="font-regular inline-flex h-full min-h-[34px] w-auto cursor-pointer items-center justify-between gap-3 rounded-md bg-slate-800 pr-3 pl-4 text-xs text-white/90 transition-all hover:bg-slate-900"
              >
                {mutation.isPending ? "Updating..." : "Next"}
                <ChevronRight strokeWidth={1.5} size={14} />
              </button>
            </div>
          </div>
          {form.formState.errors.timeline?.message && <p className="px-5 text-xs text-red-500">{form.formState.errors.timeline.message}</p>}
        </form>
      </Form>
    </div>
  );
}
