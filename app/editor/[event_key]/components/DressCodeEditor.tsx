"use client";

import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2, X, Plus, Save, ChevronLeft, ChevronRight } from "lucide-react";
import { usePreviewDraft } from "../PreviewDraftContext";
import { useSaveEventSection } from "../../../../hooks/useEvents";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "../../../../components/ui/form";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { Textarea } from "../../../../components/ui/textarea";
import EditorHeader from "./EditorHeader";
import { useState } from "react";
import { HexColorPicker } from "react-colorful";
/* ---------------- SCHEMA ---------------- */
const dressCodeItemSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().optional(),
  description: z.string().trim().optional(),
  hexColors: z.array(z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color (#FFFFFF)")).max(5, "Maximum 5 colors allowed"),
});

const schema = z.object({
  dressCode: z.array(dressCodeItemSchema).min(1, "At least one dress code option is required"),
});

type FormValues = z.infer<typeof schema>;
type DressCodeItem = FormValues["dressCode"][number];

/* ---------------- COMPONENT ---------------- */
export default function DressCodeEditor({
  onBack,
  handleBack,
  eventKey,
}: {
  onBack: () => void;
  handleBack: () => void;
  eventKey: string;
}) {
  // Hooks
  const { draft, updateSection, resetDraft, refreshEvent } = usePreviewDraft();
  const eventId = draft.invite.id;
  const mutation = useSaveEventSection(eventKey, eventId);
  const [activePicker, setActivePicker] = useState<{
    dressCodeIndex: number;
    colorIndex: number;
  } | null>(null);
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

  const hasIncompleteDressCode = watchedDressCode?.some((item) => item?.hexColors?.some((c) => !c));

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
      <EditorHeader title="Dress Code" handleBack={handleBack} />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="overflow-auto p-5 md:h-[calc(100dvh-125px)] md:min-h-[calc(100dvh-125px)] md:rounded-none [&::-webkit-scrollbar]:h-0 [&::-webkit-scrollbar]:w-[2px] [&::-webkit-scrollbar-thumb]:rounded-[10px] [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-track]:rounded-[10px] [&::-webkit-scrollbar-track]:bg-slate-100">
            <section>
              {fields.map((field, index) => {
                const colors = watchedDressCode?.[index]?.hexColors || [];

                return (
                  <div key={field.id} className="grid grid-cols-1 gap-4 sm:grid-cols-1">
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
                    <FormField
                      control={form.control}
                      name={`dressCode.${index}.title`}
                      render={({ field: titleField }) => (
                        <FormItem className="flex flex-col gap-1">
                          <FormLabel>Dress Code Theme Title</FormLabel>
                          <FormControl>
                            <Input
                              {...titleField}
                              placeholder="e.g. Traditional Elegance, Semi-Formal Smart Casual"
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
                    <FormField
                      control={form.control}
                      name={`dressCode.${index}.description`}
                      render={({ field: descField }) => (
                        <FormItem className="flex flex-col gap-1">
                          <FormLabel >Attire Instructions</FormLabel>
                          <FormControl>
                            <Textarea
                              {...descField}
                              placeholder="e.g. Pastel shades are highly encouraged. Please avoid solid black or bright neon variants..."
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
                    <div className="flex flex-col gap-1">
                      <div>
                        <FormLabel>
                          <span>Color Theme Moodboard</span>
                        </FormLabel>
                        <FormDescription className="mt-0.5 text-[10px] text-slate-400">
                          Select up to 5 palette suggestions for guests to reference.
                        </FormDescription>
                      </div>
                      <div className="flex gap-1 h-[40px] items-end">
                        {colors.map((color, colorIdx) => (
                          <FormField
                            key={colorIdx}
                            control={form.control}
                            name={`dressCode.${index}.hexColors.${colorIdx}`}
                            render={({ field: colorField }) => (
                              <FormItem className="space-y-0">
                                <FormControl>
                                  <div
                                    className="flex h-8 cursor-pointer items-center gap-2 rounded-full border border-slate-200 bg-white pr-2.5 pl-1.5 shadow-sm transition-all hover:border-slate-300"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setActivePicker({
                                        dressCodeIndex: index,
                                        colorIndex: colorIdx,
                                      });
                                    }}
                                  >
                                    {/* Color Swatch */}
                                    <button
                                      type="button"

                                      className="h-5 w-5 shrink-0 rounded-full border border-black/10 shadow-inner"
                                      style={{
                                        backgroundColor: colorField.value || "#FFFFFF",
                                      }}
                                    />

                                    <span className="font-mono text-[10px] font-bold tracking-wider text-slate-600">
                                      {colorField.value || "#FFFFFF"}
                                    </span>

                                    {colors.length > 1 && (
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();

                                          const updatedColors = [...colors];
                                          updatedColors.splice(colorIdx, 1);

                                          form.setValue(`dressCode.${index}.hexColors`, updatedColors, {
                                            shouldValidate: true,
                                            shouldDirty: true,
                                          });

                                          handleLiveChange();
                                        }}
                                        className="ml-0.5 rounded-full p-0.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-red-500"
                                      >
                                        <X size={11} strokeWidth={2.5} />
                                      </button>
                                    )}
                                  </div>
                                </FormControl>

                                {/* Color Picker Modal */}
                                {activePicker?.dressCodeIndex === index && activePicker?.colorIndex === colorIdx && (
                                  <>
                                    <div
                                      className="absolute inset-0 z-[99] bg-black/20 backdrop-blur-[1px]"
                                      onClick={() => setActivePicker(null)}
                                    />

                                    <div className="absolute top-1/2 left-1/2 z-[100] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl">
                                      <HexColorPicker
                                        color={colorField.value || "#FFFFFF"}
                                        onChange={(color) => {
                                          colorField.onChange(color.toUpperCase());
                                          handleLiveChange();
                                        }}
                                      />

                                      <Button type="button" className="mt-4 w-full" onClick={() => setActivePicker(null)}>
                                        Select
                                      </Button>
                                    </div>
                                  </>
                                )}

                                <FormMessage />
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
                              form.setValue(`dressCode.${index}.hexColors`, [...colors, "#FFFFFF"], {
                                shouldValidate: true,
                                shouldDirty: true,
                              });

                              handleLiveChange();
                            }}
                            className="h-8 rounded-full border-dashed border-slate-200 bg-white px-3 text-xs font-medium text-slate-500 shadow-sm hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                          >
                            <Plus size={12} className="mr-1" strokeWidth={2.5} />
                            Add Color
                          </Button>
                        )}
                      </div>
                    </div>
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
                disabled={hasIncompleteDressCode}
                onClick={() =>
                  append({
                    title: "",
                    description: "",
                    hexColors: ["#FFFFFF"],
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
        </form>
      </Form>
    </div>
  );
}
