"use client";

import { useForm, FormProvider } from "react-hook-form";
import { usePreviewDraft } from "../PreviewDraftContext";
import { useSaveEventSection } from "../../../../hooks/useEvents";
import { Button } from "../../../../components/ui/button";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "../../../../components/ui/form";
import { RadioGroup, RadioGroupItem } from "../../../../components/ui/radio-group";
import { cn } from "../../../../utils/utils";
import { Save, X } from "lucide-react";
import { HorizontalScroll } from "../../../../components/ui/HorizontalScroll";
import EditorHeader from "./EditorHeader";

/* ---------------- TYPES ---------------- */

type BorderRadiusType = "sharp" | "soft" | "rounded" | "pill";
type DesignForm = {
  border_radius?: BorderRadiusType;
};

/* ---------------- COMPONENT ---------------- */

export default function ShapeEditor({ eventKey, onBack }: { eventKey: string; onBack: () => void }) {
  /* ---------------- HOOKS ---------------- */

  const { draft, replaceSection, resetDraft, refreshEvent } = usePreviewDraft();
  const eventId = draft.invite.id;
  const mutation = useSaveEventSection(eventKey, eventId);

  /* ---------------- FORM ---------------- */

  const form = useForm<DesignForm>({
    defaultValues: {
      ...draft.theme,
      border_radius: draft.theme.border_radius ?? "rounded",
    },
  });


  /* ---------------- HANDLERS ---------------- */

  function handleLiveChange<K extends keyof DesignForm>(key: K, value: DesignForm[K]) {
    const latest = form.getValues();
    const nextSettings = {
      ...latest,
      [key]: value,
    };
    replaceSection("theme", nextSettings);
  }

  async function handleSaveSuccess() {
    await refreshEvent(eventKey);
    onBack();
  }

  function handleCancel() {
    resetDraft();
    onBack();
  }

  function onSubmit(values: DesignForm) {
    mutation.mutate(
      {
        path: "theme",
        stage: "theme",
        data: values,
      },
      {
        onSuccess: handleSaveSuccess,
      },
    );
  }

  return (
    <div className="animate-in fade-in flex h-full flex-col rounded-lg duration-500 md:rounded-none">
      <EditorHeader title="Shape Settings" handleCancel={handleCancel} />

      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-1 flex-col justify-between space-y-5 p-5 pb-0 md:min-h-[calc(100dvh-115px)] md:rounded-none [&::-webkit-scrollbar]:h-0 [&::-webkit-scrollbar]:w-[2px] [&::-webkit-scrollbar-thumb]:rounded-[10px] [&::-webkit-scrollbar-thumb]:bg-[#c1c1c1] [&::-webkit-scrollbar-track]:rounded-[10px] [&::-webkit-scrollbar-track]:bg-[#78909C]"
        >
          <section className="space-y-6 [&>*:last-child]:mb-6">

            {/* ── CORNER STYLE ── */}
            <FormField
              control={form.control}
              name="border_radius"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Border Radius</FormLabel>
                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      onValueChange={(val) => {
                        field.onChange(val);
                        handleLiveChange("border_radius", val as BorderRadiusType);
                      }}
                      className="grid grid-cols-1"
                    >
                      <HorizontalScroll>
                        {[
                          {
                            id: "sharp",
                            label: "Sharp",
                            className: "rounded-none",
                          },
                          {
                            id: "soft",
                            label: "Soft",
                            className: "rounded-[4px]",
                          },
                          {
                            id: "rounded",
                            label: "Rounded",
                            className: "rounded-2xl",
                          },
                          {
                            id: "pill",
                            label: "Pill",
                            className: "rounded-full",
                          },
                        ].map((item) => {
                          const active = field.value === item.id;

                          return (
                            <label
                              key={item.id}
                              htmlFor={`radius-${item.id}`}
                              className={cn(
                                "min-w-25 shrink-0 cursor-pointer rounded-md border px-3 py-3 capitalize transition-all duration-300",
                                active
                                  ? "border-slate-900 bg-slate-900 text-white shadow-lg shadow-slate-200"
                                  : "border-slate-200 bg-white",
                              )}
                            >
                              <RadioGroupItem value={item.id} id={`radius-${item.id}`} className="hidden" />

                              <div className="mb-2 flex items-center justify-between md:mb-6">
                                <div
                                  className={cn(
                                    "h-4 w-4 border-1 transition-all md:h-4 md:w-4",
                                    item.className,
                                    active ? "border-white/50 bg-white/10" : "border-slate-300 bg-slate-100",
                                  )}
                                />
                              </div>

                              <div>
                                <p
                                  className={cn(
                                    "truncate text-[0.6rem] tracking-wide capitalize md:text-[0.7rem]",
                                    active ? "text-white/90" : "text-slate-500",
                                  )}
                                >
                                  {item.label}
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
              className="hadow-slate-200 h-8 rounded-md bg-slate-900 px-10 py-2 text-xs text-white transition-all hover:bg-slate-800 active:scale-95 disabled:opacity-50"
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
