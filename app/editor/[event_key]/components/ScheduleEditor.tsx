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

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function startOfDay(date: Date) {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

/* -------------------------------------------------------------------------- */
/* Schema                                                                     */
/* -------------------------------------------------------------------------- */

const scheduleItemSchema = z
  .object({
    id: z.string().optional(),

    title: z.string().trim().min(1, "Function title is required"),

    /*
     * Start date
     */
    date: z
      .string({ message: "Date is required" })
      .min(1, "Date is required")
      .refine(
        (value) => {
          const selected = new Date(value);

          if (Number.isNaN(selected.getTime())) {
            return false;
          }

          const selectedDay = startOfDay(selected);
          const today = startOfDay(new Date());

          return selectedDay >= today;
        },
        {
          message: "Past dates are not allowed.",
        },
      ),

    /*
     * Start datetime
     */
    startTime: z.string().optional(),

    /*
     * End date
     */
    endDate: z.string().optional(),

    /*
     * End datetime
     */
    endTime: z.string().or(z.literal("")).optional(),

    locationName: z.string().optional(),
    locationAddress: z.string().optional(),

    locationUrl: z.string().url("Invalid URL format").or(z.literal("")).optional(),

    note: z.string().optional(),

    isPrimary: z.boolean(),
  })
  .superRefine((data, ctx) => {
    /*
     * End time is optional.
     * If it doesn't exist, there is nothing
     * to validate for the end date/time.
     */
    if (!data.endTime) {
      return;
    }

    /*
     * End time exists, so end date must exist.
     */
    if (!data.endDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endDate"],
        message: "End date is required.",
      });

      return;
    }

    /*
     * Validate start datetime.
     */
    const start = new Date(data.startTime || data.date);

    /*
     * Validate end datetime.
     */
    const end = new Date(data.endTime);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return;
    }

    /*
     * End datetime must be after start datetime.
     *
     * Example:
     *
     * Aug 10 11:00 PM
     * Aug 11 01:00 AM
     *
     * is valid.
     */
    if (end <= start) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endTime"],
        message: "End date and time must be after start date and time.",
      });
    }
  });

/* -------------------------------------------------------------------------- */
/* Main Schema                                                                */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

export default function ScheduleEditor({ onBack, eventKey }: { onBack: () => void; eventKey: string }) {
  /* ------------------------------------------------------------------------ */
  /* Hooks                                                                    */
  /* ------------------------------------------------------------------------ */

  const { draft, updateSection, resetDraft, refreshEvent } = usePreviewDraft();

  const eventId = draft.invite.id;

  const mutation = useSaveEventSection(eventKey, eventId);

  /* ------------------------------------------------------------------------ */
  /* Initial Schedule Data                                                    */
  /* ------------------------------------------------------------------------ */

  const rawSchedule = Array.isArray(draft?.schedule) ? draft.schedule : Object.values(draft?.schedule || {});

  const scheduleData: ScheduleItem[] =
    rawSchedule.length > 0
      ? rawSchedule.map((fn: any) => ({
          ...fn,
          isPrimary: !!fn.isPrimary,

          /*
           * Backward compatibility.
           *
           * Existing records may not have endDate.
           */
          endDate: fn.endDate || "",
          endTime: fn.endTime || "",
        }))
      : [
          {
            title: "",
            date: "",
            startTime: "",
            endDate: "",
            endTime: "",
            locationName: "",
            locationAddress: "",
            locationUrl: "",
            note: "",
            isPrimary: true,
          },
        ];

  /* ------------------------------------------------------------------------ */
  /* Form                                                                     */
  /* ------------------------------------------------------------------------ */

const form = useForm<FormValues>({
  resolver: zodResolver(schema),
  mode: "onChange",
  reValidateMode: "onChange",
  defaultValues: {
    schedule: scheduleData,
  },
});

  const { formState, control, handleSubmit } = form;

  /* ------------------------------------------------------------------------ */
  /* Field Array                                                              */
  /* ------------------------------------------------------------------------ */

  const { fields, append, remove } = useFieldArray({
    control,
    name: "schedule",
  });

  /* ------------------------------------------------------------------------ */
  /* Watch                                                                    */
  /* ------------------------------------------------------------------------ */

  const watchedFunctions = useWatch({
    control,
    name: "schedule",
  });

  /* ------------------------------------------------------------------------ */
  /* Derived State                                                            */
  /* ------------------------------------------------------------------------ */

  const hasIncompleteFunction = watchedFunctions?.some((fn) => !fn?.title?.trim() || !fn?.date?.trim());

  /* ------------------------------------------------------------------------ */
  /* Live Preview                                                             */
  /* ------------------------------------------------------------------------ */

  function handleLiveChange() {
    updateSection("schedule", form.getValues().schedule);
  }

  /* ------------------------------------------------------------------------ */
  /* Delete                                                                   */
  /* ------------------------------------------------------------------------ */

  function handleDelete(index: number) {
    const current = form.getValues("schedule");

    const deletingPrimary = current[index]?.isPrimary;

    remove(index);

    setTimeout(() => {
      const updated = form.getValues("schedule");

      /*
       * Always keep one primary function.
       */
      if (deletingPrimary && updated.length && !updated.some((item) => item.isPrimary)) {
        form.setValue("schedule.0.isPrimary", true, {
          shouldDirty: true,
          shouldValidate: true,
        });
      }

      handleLiveChange();
    }, 0);
  }

  /* ------------------------------------------------------------------------ */
  /* Submit                                                                   */
  /* ------------------------------------------------------------------------ */

  function onSubmit(values: FormValues) {
    mutation.mutate(
      {
        path: "schedule",
        stage: "schedule",
        data: values.schedule,
      },
      {
        onSuccess: async () => {
          await refreshEvent(eventKey);
          onBack();
        },
      },
    );
  }

  /* ------------------------------------------------------------------------ */
  /* Render                                                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <div className="animate-in fade-in flex h-full flex-col rounded-lg duration-500 md:rounded-none">
      {/* -------------------------------------------------------------------- */}
      {/* Header                                                               */}
      {/* -------------------------------------------------------------------- */}

      <EditorHeader
        title="Functions"
        handleCancel={() => {
          resetDraft();
          onBack();
        }}
      />

      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-1 flex-col justify-between space-y-5 overflow-auto p-5 pb-0 md:min-h-[calc(100dvh-115px)] [&::-webkit-scrollbar]:h-0 [&::-webkit-scrollbar]:w-[2px] [&::-webkit-scrollbar-thumb]:rounded-[10px] [&::-webkit-scrollbar-thumb]:bg-[#c1c1c1] [&::-webkit-scrollbar-track]:rounded-[10px] [&::-webkit-scrollbar-track]:bg-[#78909C]"
        >
          {/* ---------------------------------------------------------------- */}
          {/* Functions                                                        */}
          {/* ---------------------------------------------------------------- */}

          <section className="space-y-6">
            {fields.map((field, index) => {
              const currentHasEndTime = !!watchedFunctions?.[index]?.endTime;

              const currentStartDate = watchedFunctions?.[index]?.date;

              return (
                <div
                  key={field.id}
                  className="group relative rounded-2xl border border-slate-100 p-5 transition-all duration-300 hover:shadow-xl"
                >
                  {/* -------------------------------------------------------- */}
                  {/* Delete                                                     */}
                  {/* -------------------------------------------------------- */}

                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleDelete(index)}
                      className="absolute top-4 right-4 rounded-full p-1.5 text-slate-300 opacity-0 transition-all group-hover:opacity-100 hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}

                  <div className="space-y-4">
                    {/* ------------------------------------------------------ */}
                    {/* Primary Function                                       */}
                    {/* ------------------------------------------------------ */}

                    {fields.length > 1 && (
                      <FormField
                        control={control}
                        name={`schedule.${index}.isPrimary`}
                        render={({ field: radioField }) => (
                          <FormItem>
                            <label className="flex cursor-pointer items-center gap-2">
                              <input
                                type="radio"
                                checked={!!radioField.value}
                                onChange={() => {
                                  const updated = form.getValues("schedule").map((fn, i) => ({
                                    ...fn,
                                    isPrimary: i === index,
                                  }));

                                  form.setValue("schedule", updated, {
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

                    {/* ------------------------------------------------------ */}
                    {/* Function Title                                         */}
                    {/* ------------------------------------------------------ */}

                    <FormField
                      control={control}
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

                    {/* ------------------------------------------------------ */}
                    {/* Start Date                                               */}
                    {/* ------------------------------------------------------ */}

                    <FormField
                      control={control}
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

                              /*
                               * Preserve existing
                               * start time.
                               */
                              const existingStartTime = form.getValues(`schedule.${index}.startTime`);

                              const updatedDate = new Date(selectedDate);

                              if (existingStartTime) {
                                const existingTime = new Date(existingStartTime);

                                updatedDate.setHours(existingTime.getHours());

                                updatedDate.setMinutes(existingTime.getMinutes());

                                updatedDate.setSeconds(0);

                                updatedDate.setMilliseconds(0);
                              }

                              const isoString = updatedDate.toISOString();

                              dateField.onChange(isoString);

                              /*
                               * Keep startTime
                               * synchronized.
                               */
                              if (existingStartTime) {
                                form.setValue(`schedule.${index}.startTime`, isoString, {
                                  shouldValidate: true,
                                  shouldDirty: true,
                                });
                              }

                              /*
                               * If end time exists,
                               * preserve its time and
                               * move end date if the
                               * old end date was the
                               * same day as the old
                               * start date.
                               */
                              const existingEndDate = form.getValues(`schedule.${index}.endDate`);

                              const existingEndTime = form.getValues(`schedule.${index}.endTime`);

                              if (existingEndDate && existingEndTime && dateField.value) {
                                const oldStart = new Date(dateField.value);

                                const oldEnd = new Date(existingEndDate);

                                const wasSameDay = startOfDay(oldStart).getTime() === startOfDay(oldEnd).getTime();

                                if (wasSameDay) {
                                  const updatedEnd = new Date(selectedDate);

                                  const endTime = new Date(existingEndTime);

                                  updatedEnd.setHours(endTime.getHours());

                                  updatedEnd.setMinutes(endTime.getMinutes());

                                  updatedEnd.setSeconds(0);

                                  updatedEnd.setMilliseconds(0);

                                  const endIso = updatedEnd.toISOString();

                                  form.setValue(`schedule.${index}.endDate`, endIso, {
                                    shouldValidate: true,
                                    shouldDirty: true,
                                  });

                                  form.setValue(`schedule.${index}.endTime`, endIso, {
                                    shouldValidate: true,
                                    shouldDirty: true,
                                  });
                                }
                              }

                              handleLiveChange();
                            }}
                          />

                          <FormMessage className="text-[10px]" />
                        </FormItem>
                      )}
                    />

                    {/* ------------------------------------------------------ */}
                    {/* Start Time / End Time                                   */}
                    {/* ------------------------------------------------------ */}

                    <div className="grid grid-cols-2 items-end gap-4">
                      {/* ---------------------------------------------------- */}
                      {/* Start Time                                             */}
                      {/* ---------------------------------------------------- */}

                      <FormField
                        control={control}
                        name={`schedule.${index}.startTime`}
                        render={({ field: startField }) => (
                          <FormItem className={currentHasEndTime ? "" : "col-span-2"}>
                            <FormLabel>{currentHasEndTime ? "Start Time" : "Time"}</FormLabel>

                            <TimePicker
                              value={startField.value ? new Date(startField.value) : undefined}
                              onChange={(selectedTime) => {
                                if (!selectedTime) {
                                  return;
                                }

                                const currentDate = form.getValues(`schedule.${index}.date`);

                                if (!currentDate) {
                                  return;
                                }

                                const mergedDate = new Date(currentDate);

                                mergedDate.setHours(selectedTime.getHours());

                                mergedDate.setMinutes(selectedTime.getMinutes());

                                mergedDate.setSeconds(0);

                                mergedDate.setMilliseconds(0);

                                const isoString = mergedDate.toISOString();

                                startField.onChange(isoString);

                                /*
                                 * If an end time
                                 * already exists, make
                                 * sure the end datetime
                                 * remains valid.
                                 */
                                const endTime = form.getValues(`schedule.${index}.endTime`);

                                const endDate = form.getValues(`schedule.${index}.endDate`);

                                if (endTime && endDate) {
                                  const currentEnd = new Date(endTime);

                                  /*
                                   * If changing the
                                   * start time causes
                                   * end <= start,
                                   * move end to
                                   * +30 minutes.
                                   */
                                  if (currentEnd <= mergedDate) {
                                    const newEnd = new Date(mergedDate);

                                    newEnd.setMinutes(newEnd.getMinutes() + 30);

                                    const newEndIso = newEnd.toISOString();

                                    form.setValue(`schedule.${index}.endDate`, newEndIso, {
                                      shouldValidate: true,
                                      shouldDirty: true,
                                    });

                                    form.setValue(`schedule.${index}.endTime`, newEndIso, {
                                      shouldValidate: true,
                                      shouldDirty: true,
                                    });
                                  }
                                }

                                handleLiveChange();
                              }}
                            />

                            <FormMessage className="text-[10px]" />
                          </FormItem>
                        )}
                      />

                      {/* ---------------------------------------------------- */}
                      {/* Add End Time                                           */}
                      {/* ---------------------------------------------------- */}

                      {!currentHasEndTime ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-xs text-slate-500"
                          onClick={() => {
                            const startDate = form.getValues(`schedule.${index}.date`);

                            const startTime = form.getValues(`schedule.${index}.startTime`);

                            /*
                             * Event date is
                             * required.
                             */
                            if (!startDate) {
                              return;
                            }

                            /*
                             * Use actual start
                             * datetime when
                             * available.
                             */
                            const baseDate = startTime ? new Date(startTime) : new Date(startDate);

                            /*
                             * Default end:
                             * 30 minutes later.
                             */
                            baseDate.setMinutes(baseDate.getMinutes() + 30);

                            baseDate.setSeconds(0);
                            baseDate.setMilliseconds(0);

                            const endIso = baseDate.toISOString();

                            /*
                             * Store both.
                             */
                            form.setValue(`schedule.${index}.endDate`, endIso, {
                              shouldValidate: true,
                              shouldDirty: true,
                            });

                            form.setValue(`schedule.${index}.endTime`, endIso, {
                              shouldValidate: true,
                              shouldDirty: true,
                            });

                            handleLiveChange();
                          }}
                        >
                          <Plus className="mr-1 h-3 w-3" />
                          Add End Time
                        </Button>
                      ) : (
                        /* -------------------------------------------------- */
                        /* End Time                                             */
                        /* -------------------------------------------------- */

                        <FormField
                          control={control}
                          name={`schedule.${index}.endTime`}
                          render={({ field: endField }) => (
                            <FormItem>
                              <div className="flex items-center justify-between">
                                <FormLabel>End Time</FormLabel>

                                <button
                                  type="button"
                                  onClick={() => {
                                    /*
                                     * Clear both.
                                     */
                                    form.setValue(`schedule.${index}.endTime`, "", {
                                      shouldValidate: true,
                                      shouldDirty: true,
                                    });

                                    form.setValue(`schedule.${index}.endDate`, "", {
                                      shouldValidate: true,
                                      shouldDirty: true,
                                    });

                                    handleLiveChange();
                                  }}
                                  className="text-[0.7rem] text-slate-400 transition hover:text-red-500"
                                >
                                  Remove
                                </button>
                              </div>

                              <TimePicker
                                value={endField.value ? new Date(endField.value) : undefined}
                                onChange={(selectedTime) => {
                                  if (!selectedTime) {
                                    return;
                                  }

                                  const currentEndDate = form.getValues(`schedule.${index}.endDate`);

                                  if (!currentEndDate) {
                                    return;
                                  }

                                  const mergedDate = new Date(currentEndDate);

                                  mergedDate.setHours(selectedTime.getHours());

                                  mergedDate.setMinutes(selectedTime.getMinutes());

                                  mergedDate.setSeconds(0);

                                  mergedDate.setMilliseconds(0);

                                  const isoString = mergedDate.toISOString();

                                  endField.onChange(isoString);

                                  handleLiveChange();
                                }}
                              />

                              <FormMessage className="text-[10px]" />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>

                    {/* ------------------------------------------------------ */}
                    {/* End Date                                                 */}
                    {/* ------------------------------------------------------ */}

                    {currentHasEndTime && (
                      <FormField
                        control={control}
                        name={`schedule.${index}.endDate`}
                        render={({ field: endDateField }) => (
                          <FormItem>
                            <FormLabel>End Date</FormLabel>

                            <CustomDatePicker
                              disabledDates={(date) => {
                                if (!currentStartDate) {
                                  return false;
                                }

                                const start = new Date(currentStartDate);

                                start.setHours(0, 0, 0, 0);

                                return date < start;
                              }}
                              value={endDateField.value ? new Date(endDateField.value) : undefined}
                              onChange={(selectedDate) => {
                                if (!selectedDate) {
                                  endDateField.onChange("");

                                  form.setValue(`schedule.${index}.endTime`, "", {
                                    shouldValidate: true,
                                    shouldDirty: true,
                                  });

                                  handleLiveChange();

                                  return;
                                }

                                const currentEndTime = form.getValues(`schedule.${index}.endTime`);

                                const updatedDate = new Date(selectedDate);

                                /*
                                 * Preserve
                                 * selected end
                                 * time.
                                 */
                                if (currentEndTime) {
                                  const existingTime = new Date(currentEndTime);

                                  updatedDate.setHours(existingTime.getHours());

                                  updatedDate.setMinutes(existingTime.getMinutes());
                                }

                                updatedDate.setSeconds(0);

                                updatedDate.setMilliseconds(0);

                                const isoString = updatedDate.toISOString();

                                endDateField.onChange(isoString);

                                /*
                                 * Synchronize
                                 * endTime.
                                 */
                                form.setValue(`schedule.${index}.endTime`, isoString, {
                                  shouldValidate: true,
                                  shouldDirty: true,
                                });

                                handleLiveChange();
                              }}
                            />

                            <FormMessage className="text-[10px]" />
                          </FormItem>
                        )}
                      />
                    )}

                    {/* ------------------------------------------------------ */}
                    {/* Venue                                                    */}
                    {/* ------------------------------------------------------ */}

                    <FormField
                      control={control}
                      name={`schedule.${index}.locationName`}
                      render={({ field: locNameField }) => (
                        <FormItem>
                          <FormLabel>Venue</FormLabel>

                          <FormControl>
                            <Input
                              {...locNameField}
                              placeholder="https://maps.google.com/..."
                              onChange={(e) => {
                                locNameField.onChange(e);

                                handleLiveChange();
                              }}
                            />
                          </FormControl>

                          <FormMessage className="text-[10px]" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name={`schedule.${index}.locationAddress`}
                      render={({ field: locNameField }) => (
                        <FormItem>
                          <FormLabel>Venue Address</FormLabel>

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

                          <FormMessage className="text-[10px]" />
                        </FormItem>
                      )}
                    />

                    {/* ------------------------------------------------------ */}
                    {/* Map URL                                                  */}
                    {/* ------------------------------------------------------ */}

                    <FormField
                      control={control}
                      name={`schedule.${index}.locationUrl`}
                      render={({ field: locUrlField }) => (
                        <FormItem>
                          <FormLabel>Venue Map URL</FormLabel>

                          <FormControl>
                            <Input
                              {...locUrlField}
                              placeholder="https://maps.google.com/..."
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

                    {/* ------------------------------------------------------ */}
                    {/* Note                                                     */}
                    {/* ------------------------------------------------------ */}

                    <FormField
                      control={control}
                      name={`schedule.${index}.note`}
                      render={({ field: noteField }) => (
                        <FormItem>
                          <FormLabel>Note</FormLabel>

                          <FormControl>
                            <Textarea
                              {...noteField}
                              placeholder="Optional information for guests..."
                              onChange={(e) => {
                                noteField.onChange(e);

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

          {/* ---------------------------------------------------------------- */}
          {/* Footer                                                           */}
          {/* ---------------------------------------------------------------- */}

          <div className="sticky bottom-0 z-[99] flex min-h-16 items-center justify-end gap-3 border-t bg-white px-5 py-3">
            {/* -------------------------------------------------------------- */}
            {/* Discard                                                         */}
            {/* -------------------------------------------------------------- */}

            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                resetDraft();
                onBack();
              }}
            >
              <X size={14} className="mr-1" />
              Discard
            </Button>

            {/* -------------------------------------------------------------- */}
            {/* Add Function                                                    */}
            {/* -------------------------------------------------------------- */}

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
                  endDate: "",
                  endTime: "",
                  locationName: "",
                  locationUrl: "",
                  note: "",
                  isPrimary: fields.length === 0,
                })
              }
            >
              <Plus className="mr-1 h-3 w-3" />
              Add
            </Button>

            {/* -------------------------------------------------------------- */}
            {/* Save                                                             */}
            {/* -------------------------------------------------------------- */}

            <Button type="submit" disabled={!formState.isValid || mutation.isPending}>
              <Save className="mr-1 h-3 w-3" />

              {mutation.isPending ? "Updating..." : "Save"}
            </Button>

            {/* -------------------------------------------------------------- */}
            {/* Schedule Error                                                  */}
            {/* -------------------------------------------------------------- */}

            {form.formState.errors.schedule?.message && (
              <p className="px-5 text-xs text-red-500">{form.formState.errors.schedule.message}</p>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
