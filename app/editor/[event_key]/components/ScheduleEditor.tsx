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
import { TimePicker } from "../../../../components/ui/TimePicker";
import { CustomDatePicker } from "../../../../components/ui/CustomDatePicker";
import EditorHeader from "./EditorHeader";

/* ---------------- SCHEMA ---------------- */
const scheduleItemSchema = z
  .object({
    id: z.string().optional(),
    title: z.string().trim().min(1, "Function title is required"),
    date: z
      .string({ message: "Date is required" })
      .min(1, "Date is required")
      .refine(
        (value) => {
          const selected = new Date(value);
          selected.setHours(0, 0, 0, 0);

          const today = new Date();
          today.setHours(0, 0, 0, 0);

          return selected >= today;
        },
        {
          message: "Past dates are not allowed.",
        },
      ),
    startTime: z.string().optional(),
    endTime: z.string().or(z.literal("")).optional(),
    locationName: z.string().optional(),
    locationUrl: z.string().url().or(z.literal("")).optional(),
    note: z.string().optional(),
    isPrimary: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (!data.startTime || !data.endTime) return;
    const start = new Date(data.startTime);
    const end = new Date(data.endTime);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return;
    if (end <= start) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endTime"],
        message: "End time must be after start time.",
      });
    }
  });

const schema = z
  .object({
    schedule: z.array(scheduleItemSchema).min(1, "At least one function is required"),
  })
  .superRefine((data, ctx) => {
    const primaryCount = data.schedule.filter((item) => item.isPrimary).length;

    if (primaryCount === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["schedule"],
        message: "Please select a primary function.",
      });
    }

    if (primaryCount > 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["schedule"],
        message: "Only one primary function is allowed.",
      });
    }
  });

type FormValues = z.infer<typeof schema>;
type ScheduleItem = FormValues["schedule"][number];

/* ---------------- COMPONENT ---------------- */

export default function ScheduleEditor({ onBack, eventKey }: { onBack: () => void; eventKey: string }) {
  // Hooks
  const { draft, updateSection, resetDraft, refreshEvent } = usePreviewDraft();
  const eventId = draft.invite.id;
  const mutation = useSaveEventSection(eventKey, eventId);

  // Derived initial data structure with default value mapping fallback
  const rawSchedule = Array.isArray(draft?.schedule) ? draft.schedule : Object.values(draft?.schedule || {});
  const scheduleData: ScheduleItem[] =
    rawSchedule.length > 0
      ? rawSchedule.map((fn) => ({
          ...fn,
          isPrimary: !!fn.isPrimary,
        }))
      : [
          {
            title: "",
            date: "",
            startTime: "",
            endTime: "",
            locationName: "",
            locationUrl: "",
            note: "",
            isPrimary: true,
          },
        ];

  // Form initialization
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      schedule: scheduleData as FormValues["schedule"],
    },
  });

  const { formState } = form;

  // Field Arrays
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "schedule",
  });

  // Watch entire array values safely to manage UI layout shifts reactively
  const watchedFunctions = useWatch({
    control: form.control,
    name: "schedule",
  });

  // Check if any function in the array is missing a title or date
  const hasIncompleteFunction = watchedFunctions?.some((fn) => !fn?.title?.trim() || !fn?.date?.trim());

  // Live state syncing wrapper
  function handleLiveChange() {
    const currentValues = form.getValues();
    updateSection("schedule", currentValues.schedule);
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
        path: "schedule",
        stage: "schedule",
        data: values.schedule,
      },
      { onSuccess: handleSaveSuccess },
    );
  }
 
  return (
    <div className="animate-in fade-in flex h-full flex-col rounded-lg duration-500 md:rounded-none">
      <EditorHeader title="Functions" handleCancel={handleCancel} />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-1 flex-col justify-between space-y-5 p-5 pb-0 md:min-h-[calc(100dvh-115px)] md:rounded-none [&::-webkit-scrollbar]:h-0 [&::-webkit-scrollbar]:w-[2px] [&::-webkit-scrollbar-thumb]:rounded-[10px] [&::-webkit-scrollbar-thumb]:bg-[#c1c1c1] [&::-webkit-scrollbar-track]:rounded-[10px] [&::-webkit-scrollbar-track]:bg-[#78909C]"
        >
          {/* Section 1: Event Schedule */}
          <section className="space-y-6 [&>*:last-child]:mb-6">
            {fields.map((field, index) => {
              const currentHasEndTime = !!watchedFunctions?.[index]?.endTime;

              return (
                <div
                  key={field.id}
                  className="group relative rounded-2xl border border-slate-100 p-5 transition-all duration-500 hover:border-slate-200 hover:bg-white hover:shadow-xl hover:shadow-slate-100"
                >
                  {/* Delete Button */}
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const current = form.getValues("schedule");
                        const deletingPrimary = current[index]?.isPrimary;

                        remove(index);

                        requestAnimationFrame(() => {
                          const updated = form.getValues("schedule");

                          if (deletingPrimary && updated.length && !updated.some((item) => item.isPrimary)) {
                            updated[0].isPrimary = true;

                            form.setValue("schedule", updated, {
                              shouldDirty: true,
                              shouldValidate: true,
                            });
                          }

                          handleLiveChange();
                        });
                      }}
                      className="absolute top-4 right-4 rounded-full p-1.5 text-slate-300 opacity-0 transition-all group-hover:opacity-100 hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}

                  <div className="space-y-4">
                    {fields.length > 1 && (
                      <FormField
                        control={form.control}
                        name={`schedule.${index}.isPrimary`}
                        render={({ field: radioField }) => (
                          <FormItem>
                            <label className="flex cursor-pointer items-center gap-2">
                              <input
                                type="radio"
                                checked={!!radioField.value}
                                onChange={() => {
                                  const currentSchedule = form.getValues("schedule");
                                  const updatedSchedule = currentSchedule.map((fn, i) => ({
                                    ...fn,
                                    isPrimary: i === index,
                                  }));

                                  form.setValue("schedule", updatedSchedule, {
                                    shouldDirty: true,
                                    shouldValidate: true,
                                  });
                                  handleLiveChange();
                                }}
                              />
                              <span className="text-xs font-medium text-slate-600">Set as Primary Function</span>
                            </label>
                          </FormItem>
                        )}
                      />
                    )}

                    {/* Function Title */}
                    <FormField
                      control={form.control}
                      name={`schedule.${index}.title`}
                      render={({ field: titleField }) => (
                        <FormItem>
                          <FormLabel>Function Title</FormLabel>
                          <FormControl>
                            <Input
                              {...titleField}
                              placeholder="e.g. Wedding Ceremony"
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
                      name={`schedule.${index}.date`}
                      render={({ field: dateField }) => (
                        <FormItem>
                          <FormLabel>Date</FormLabel>
                          <CustomDatePicker
                            disabledDates={(date) => {
                              const today = new Date();
                              today.setHours(0, 0, 0, 0);

                              return date < today;
                            }}
                            value={dateField.value ? new Date(dateField.value) : undefined}
                            onChange={(selectedDate) => {
                              if (!selectedDate) {
                                dateField.onChange("");
                                handleLiveChange();
                                return;
                              }

                              const currentStartTime = form.getValues(`schedule.${index}.startTime`);
                              const updatedDate = new Date(selectedDate);

                              if (currentStartTime) {
                                const existingTime = new Date(currentStartTime);
                                updatedDate.setHours(existingTime.getHours());
                                updatedDate.setMinutes(existingTime.getMinutes());
                                updatedDate.setSeconds(0);
                                updatedDate.setMilliseconds(0);
                              }

                              const isoString = updatedDate.toISOString();
                              dateField.onChange(isoString);
                              form.setValue(`schedule.${index}.startTime`, isoString, { shouldValidate: true });

                              handleLiveChange();
                            }}
                          />
                          <FormMessage className="text-[10px]" />
                        </FormItem>
                      )}
                    />

                    {/* Time Fields Container Grid */}
                    {/* Start Time / Time Picker */}
                    <FormField
                      control={form.control}
                      name={`schedule.${index}.startTime`}
                      render={({ field: startField }) => (
                        <FormItem className={currentHasEndTime ? "" : "col-span-2"}>
                          <FormLabel>{currentHasEndTime ? "Start Time" : "Time"}</FormLabel>
                          <TimePicker
                            value={startField.value ? new Date(startField.value) : undefined}
                            onChange={(selectedTime) => {
                              const currentDate = form.getValues(`schedule.${index}.date`);
                              if (!selectedTime || !currentDate) return;

                              const mergedDate = new Date(currentDate);
                              mergedDate.setHours(selectedTime.getHours());
                              mergedDate.setMinutes(selectedTime.getMinutes());
                              mergedDate.setSeconds(0);

                              startField.onChange(mergedDate.toISOString());
                              handleLiveChange();
                            }}
                          />
                        </FormItem>
                      )}
                    />

                    {/* Conditional Add / Render End Time */}
                    {!currentHasEndTime ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="bg-accent rounded-md px-0 text-xs"
                        onClick={() => {
                          const start = form.getValues(`schedule.${index}.startTime`);
                          const chosenDate = form.getValues(`schedule.${index}.date`);

                          let baseDate: Date;

                          if (start) {
                            baseDate = new Date(start);
                          } else if (chosenDate) {
                            baseDate = new Date(chosenDate);
                          } else {
                            baseDate = new Date();
                          }

                          baseDate.setMinutes(baseDate.getMinutes() + 1);

                          form.setValue(`schedule.${index}.endTime`, baseDate.toISOString(), {
                            shouldValidate: true,
                            shouldDirty: true,
                          });

                          handleLiveChange();
                        }}
                      >
                        <Plus className="mr-1 h-2 w-2" />
                        Add End Time
                      </Button>
                    ) : (
                      <FormField
                        control={form.control}
                        name={`schedule.${index}.endTime`}
                        render={({ field: endField }) => (
                          <FormItem>
                            <div className="flex items-center justify-between">
                              <FormLabel>End Time</FormLabel>
                              <button
                                type="button"
                                onClick={() => {
                                  form.setValue(`schedule.${index}.endTime`, "", { shouldValidate: true });
                                  handleLiveChange();
                                }}
                                className="cursor-pointer text-[0.7rem] text-slate-400 transition hover:text-red-500"
                              >
                                Remove
                              </button>
                            </div>
                            <TimePicker
                              value={endField.value ? new Date(endField.value) : undefined}
                              onChange={(selectedTime) => {
                                const currentDate = form.getValues(`schedule.${index}.date`);
                                if (!selectedTime || !currentDate) return;

                                const mergedDate = new Date(currentDate);
                                mergedDate.setHours(selectedTime.getHours());
                                mergedDate.setMinutes(selectedTime.getMinutes());
                                mergedDate.setSeconds(0);

                                endField.onChange(mergedDate.toISOString());
                                handleLiveChange();
                              }}
                            />
                            <FormMessage className="text-[10px]" />
                          </FormItem>
                        )}
                      />
                    )}

                    {/* Venue Location Textarea */}
                    <FormField
                      control={form.control}
                      name={`schedule.${index}.locationName`}
                      render={({ field: locNameField }) => (
                        <FormItem>
                          <FormLabel>Location Address</FormLabel>
                          <FormControl>
                            <Textarea
                              {...locNameField}
                              placeholder="e.g. The Grand Ballroom"
                              onChange={(e) => {
                                locNameField.onChange(e);
                                handleLiveChange();
                              }}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {/* Map Url Input Field */}
                    <FormField
                      control={form.control}
                      name={`schedule.${index}.locationUrl`}
                      render={({ field: locUrlField }) => (
                        <FormItem>
                          <FormLabel>Map URL</FormLabel>
                          <FormControl>
                            <Input
                              {...locUrlField}
                              placeholder="http://maps.google.com/..."
                              onChange={(e) => {
                                locUrlField.onChange(e);
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

          {/* Sticky Actions Footer */}
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
                disabled={hasIncompleteFunction}
                onClick={() =>
                  append({
                    title: "",
                    date: "",
                    startTime: "",
                    endTime: "",
                    locationName: "",
                    locationUrl: "",
                    note: "",
                    isPrimary: fields.length === 0,
                  })
                }
                className="rounded-md border border-slate-200 bg-white p-2 text-xs font-light text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-900 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Plus className="mr-1 h-3 w-3" strokeWidth={1} /> Add
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
            {form.formState.errors.schedule?.message && (
              <p className="px-5 text-xs text-red-500">{form.formState.errors.schedule.message}</p>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
