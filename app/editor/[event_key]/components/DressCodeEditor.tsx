"use client";

import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2, X, Plus, Save, Palette } from "lucide-react";
import { usePreviewDraft } from "../PreviewDraftContext";
import { useSaveEventSection } from "../../../../hooks/useEvents";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "../../../../components/ui/form";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { Textarea } from "../../../../components/ui/textarea";
import EditorHeader from "./EditorHeader";

/* ---------------- SCHEMA ---------------- */
const dressCodeItemSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(1, "Dress code title is required"),
  description: z.string().trim().min(1, "Description or guidelines are required"),
  hexColors: z.array(z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color (#FFFFFF)")).max(5, "Maximum 5 colors allowed"),
});

const schema = z.object({
  dressCode: z.array(dressCodeItemSchema).min(1, "At least one dress code option is required"),
});

type FormValues = z.infer<typeof schema>;
type DressCodeItem = FormValues["dressCode"][number];

/* ---------------- COMPONENT ---------------- */
export default function DressCodeEditor({ onBack, eventKey }: { onBack: () => void; eventKey: string }) {
  // Hooks
  const { draft, updateSection, resetDraft, refreshEvent } = usePreviewDraft();
  const eventId = draft.invite.id;
  const mutation = useSaveEventSection(eventKey, eventId);

  // Derived initial data structure with fallback mapping[cite: 2]
  const rawDressCode = Array.isArray(draft?.dressCode) ? draft.dressCode : Object.values(draft?.dressCode || {});
  const dressCodeData: DressCodeItem[] =
    rawDressCode.length > 0
      ? rawDressCode.map((item) => ({
          title: item.title ?? "",
          description: item.description ?? "",
          hexColors: Array.isArray(item.hexColors) ? item.hexColors : ["#FFFFFF"],
        }))
      : [
          {
            title: "",
            description: "",
            hexColors: ["#FFFFFF"],
          },
        ];

  // Form initialization[cite: 2]
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      dressCode: dressCodeData as FormValues["dressCode"],
    },
  });

  const { formState } = form;

  // Field Arrays for Dress Code Options[cite: 2]
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "dressCode",
  });

  // Watch fields safely to handle dynamic interaction states[cite: 2]
  const watchedDressCode = useWatch({
    control: form.control,
    name: "dressCode",
  });

  const hasIncompleteDressCode = watchedDressCode?.some(
    (item) => !item?.title?.trim() || !item?.description?.trim() || item?.hexColors?.some((c) => !c),
  );

  // Live state syncing wrapper[cite: 2]
  function handleLiveChange() {
    const currentValues = form.getValues();
    updateSection("dressCode", currentValues.dressCode);
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
        path: "dressCode",
        stage: "dressCode",
        data: values.dressCode,
      },
      { onSuccess: handleSaveSuccess },
    );
  }

  return (
    <div className="animate-in fade-in flex h-full flex-col rounded-xl duration-500 md:rounded-none">
      <EditorHeader title="Dress Code Guidelines" handleCancel={handleCancel} />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-1 flex-col justify-between space-y-6 p-5 pb-0 md:min-h-[calc(100dvh-115px)] md:rounded-none [&::-webkit-scrollbar]:h-0 [&::-webkit-scrollbar]:w-[2px] [&::-webkit-scrollbar-thumb]:rounded-[10px] [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-track]:rounded-[10px] [&::-webkit-scrollbar-track]:bg-slate-100"
        >
          {/* Section 1: Dress Code Options */}
          <section className="space-y-5 [&>*:last-child]:mb-6">
            {fields.map((field, index) => {
              const colors = watchedDressCode?.[index]?.hexColors || [];

              return (
                <div
                  key={field.id}
                  className="group relative rounded-xl border border-slate-100 bg-slate-50/40 p-5 transition-all duration-300 hover:border-slate-200/80 hover:bg-white hover:shadow-xl hover:shadow-slate-100/50"
                >
                  {/* Delete Button */}
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        remove(index);
                        requestAnimationFrame(() => {
                          handleLiveChange();
                        });
                      }}
                      className="absolute top-4 right-4 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-slate-300 opacity-0 transition-all group-hover:opacity-100 hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}

                  <div className="space-y-4">
                    {/* Theme Title */}
                    <FormField
                      control={form.control}
                      name={`dressCode.${index}.title`}
                      render={({ field: titleField }) => (
                        <FormItem className="space-y-1.5">
                          <FormLabel className="text-xs font-semibold text-slate-700">Dress Code Theme Title</FormLabel>
                          <FormControl>
                            <Input
                              {...titleField}
                              placeholder="e.g. Traditional Elegance, Semi-Formal Smart Casual"
                              className="h-9 border-slate-200 bg-white text-sm focus-visible:ring-1 focus-visible:ring-slate-400"
                              onChange={(e) => {
                                titleField.onChange(e);
                                handleLiveChange();
                              }}
                            />
                          </FormControl>
                          <FormMessage className="text-destructive text-[10px] font-medium" />
                        </FormItem>
                      )}
                    />

                    {/* Dress Code Description Textarea */}
                    <FormField
                      control={form.control}
                      name={`dressCode.${index}.description`}
                      render={({ field: descField }) => (
                        <FormItem className="space-y-1.5">
                          <FormLabel className="text-xs font-semibold text-slate-700">Attire Instructions</FormLabel>
                          <FormControl>
                            <Textarea
                              {...descField}
                              placeholder="e.g. Pastel shades are highly encouraged. Please avoid solid black or bright neon variants..."
                              className="min-h-[80px] border-slate-200 bg-white text-sm focus-visible:ring-1 focus-visible:ring-slate-400"
                              onChange={(e) => {
                                descField.onChange(e);
                                handleLiveChange();
                              }}
                            />
                          </FormControl>
                          <FormMessage className="text-destructive text-[10px] font-medium" />
                        </FormItem>
                      )}
                    />

                    {/* Color Palette Picker */}
                    <div className="space-y-2.5">
                      <div>
                        <FormLabel className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                          <span>Color Theme Moodboard</span>
                        </FormLabel>
                        <FormDescription className="mt-0.5 text-[10px] text-slate-400">
                          Select up to 5 palette suggestions for guests to reference.
                        </FormDescription>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 pt-0.5">
                        {colors.map((color, colorIdx) => (
                          <FormField
                            key={colorIdx}
                            control={form.control}
                            name={`dressCode.${index}.hexColors.${colorIdx}`}
                            render={({ field: colorField }) => (
                              <FormItem className="space-y-0">
                                <FormControl>
                                  <div className="relative flex h-8 items-center gap-2 rounded-full border border-slate-200 bg-white pr-2.5 pl-1.5 shadow-sm transition-all hover:border-slate-300">
                                    {/* Visual Swatch Wrapper */}
                                    <div
                                      className="relative h-5 w-5 shrink-0 cursor-pointer rounded-full border border-black/5 shadow-inner"
                                      style={{ backgroundColor: colorField.value || "#FFFFFF" }}
                                    >
                                      <input
                                        type="color"
                                        value={colorField.value || "#FFFFFF"}
                                        onChange={(e) => {
                                          colorField.onChange(e.target.value.toUpperCase());
                                          handleLiveChange();
                                        }}
                                        className="absolute inset-0 h-full w-full scale-150 cursor-pointer opacity-0"
                                      />
                                    </div>

                                    {/* Text Display of Hex */}
                                    <span className="font-mono text-[10px] font-bold tracking-wider text-slate-600">
                                      {colorField.value || "#FFFFFF"}
                                    </span>

                                    {/* Remove Color Button */}
                                    {colors.length > 1 && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const updatedColors = [...colors];
                                          updatedColors.splice(colorIdx, 1);
                                          form.setValue(`dressCode.${index}.hexColors`, updatedColors, { shouldValidate: true });
                                          handleLiveChange();
                                        }}
                                        className="ml-0.5 rounded-full p-0.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-red-500"
                                      >
                                        <X size={11} strokeWidth={2.5} />
                                      </button>
                                    )}
                                  </div>
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        ))}

                        {colors.length < 5 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              form.setValue(`dressCode.${index}.hexColors`, [...colors, "#FFFFFF"], { shouldValidate: true });
                              handleLiveChange();
                            }}
                            className="h-8 rounded-full border-dashed border-slate-200 bg-white px-3 text-xs font-medium text-slate-500 shadow-sm hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                          >
                            <Plus size={12} className="mr-1" strokeWidth={2.5} /> Add Color
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </section>

          {/* Sticky Actions Footer */}
          <div className="sticky bottom-0 z-[99] -mx-5 flex h-16 flex-col justify-center border-t border-slate-100 bg-white/90 px-5 backdrop-blur-md">
            <div className="flex w-full items-center justify-between">
              <Button
                type="button"
                variant="ghost"
                onClick={handleCancel}
                className="h-9 text-xs font-semibold text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-900"
              >
                <X strokeWidth={1.5} size={14} />
                <span>Discard</span>
              </Button>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={hasIncompleteDressCode}
                  onClick={() =>
                    append({
                      title: "",
                      description: "",
                      hexColors: ["#FFFFFF"],
                    })
                  }
                  className="h-9 rounded-lg border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-600 transition-all hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Plus className="mr-1 h-3 w-3" strokeWidth={2.5} /> Add Variant
                </Button>
                <Button
                  type="submit"
                  disabled={!formState.isValid || mutation.isPending}
                  className="h-9 rounded-lg bg-slate-900 px-8 text-xs font-semibold text-white shadow-md shadow-slate-100 transition-all hover:bg-slate-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Save strokeWidth={1.5} size={14} className="mr-1" />
                  {mutation.isPending ? "Updating..." : "Save"}
                </Button>
              </div>
            </div>

            {form.formState.errors.dressCode?.message && (
              <p className="text-destructive animate-in fade-in slide-in-from-bottom-1 absolute -top-6 left-5 rounded-md border border-red-100 bg-white/80 px-2 py-0.5 text-[10px] font-medium shadow-sm">
                {form.formState.errors.dressCode.message}
              </p>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
