"use client";

import { useForm, FormProvider } from "react-hook-form";
import { usePreviewDraft } from "../PreviewDraftContext";
import { useSaveEventSection } from "../../../../hooks/useEvents";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "../../../../components/ui/form";
import { RadioGroup, RadioGroupItem } from "../../../../components/ui/radio-group";
import { Button } from "../../../../components/ui/button";
import { cn } from "../../../../utils/utils";
import { HorizontalScroll } from "../../../../components/ui/HorizontalScroll";
import EditorHeader from "./EditorHeader";
import { Save, X, Square, Circle, PanelsTopLeft, RectangleHorizontal, ChevronLeft, ChevronRight } from "lucide-react";

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

type BorderRadiusType = "sharp" | "soft" | "rounded" | "pill";
type BorderWidth = "none" | "thin" | "medium" | "thick";
type BorderStyle = "solid" | "dashed" | "dotted" | "double";
type ShadowPreset = "none" | "soft" | "medium" | "floating";
type ImageShape = "rectangle" | "rounded" | "circle" | "arch";
type DesignForm = {
  border_radius?: BorderRadiusType;
  border_width?: BorderWidth;
  border_style?: BorderStyle;
  shadow?: ShadowPreset;
  image_shape?: ImageShape;
};

/* -------------------------------------------------------------------------- */
/* COMPONENT                                                                  */
/* -------------------------------------------------------------------------- */

export default function ShapeEditor({ onBack, handleBack, eventKey }: { onBack: () => void; handleBack: () => void; eventKey: string }) {
  /* ------------------------------------------------------------------------ */
  /* HOOKS                                                                    */
  /* ------------------------------------------------------------------------ */

  const { draft, replaceSection, resetDraft, refreshEvent } = usePreviewDraft();

  const eventId = draft.invite.id;

  const mutation = useSaveEventSection(eventKey, eventId);

  /* ------------------------------------------------------------------------ */
  /* FORM                                                                     */
  /* ------------------------------------------------------------------------ */

  const form = useForm<DesignForm>({
    defaultValues: {
      ...draft.shape,
      border_radius: draft.shape.border_radius ?? "rounded",
      border_width: draft.shape.border_width ?? "none",
      border_style: draft.shape.border_style ?? "solid",
      shadow: draft.shape.shadow ?? "none",
      image_shape: draft.shape.image_shape ?? "rounded",
    },
  });

  /* ------------------------------------------------------------------------ */
  /* LIVE CHANGE                                                              */
  /* ------------------------------------------------------------------------ */

  function handleLiveChange<K extends keyof DesignForm>(key: K, value: DesignForm[K]) {
    const latest = form.getValues();

    const nextSettings = {
      ...latest,
      [key]: value,
    };

    replaceSection("shape", nextSettings);
  }

  /* ------------------------------------------------------------------------ */
  /* SAVE                                                                     */
  /* ------------------------------------------------------------------------ */

  async function handleSaveSuccess() {
    await refreshEvent(eventKey);
    onBack();
  }

  /* ------------------------------------------------------------------------ */
  /* CANCEL                                                                   */
  /* ------------------------------------------------------------------------ */

  function handleCancel() {
    resetDraft();
    onBack();
  }

  /* ------------------------------------------------------------------------ */
  /* SUBMIT                                                                   */
  /* ------------------------------------------------------------------------ */

  function onSubmit(values: DesignForm) {
    mutation.mutate(
      {
        path: "shape",
        stage: "shape",
        data: values,
      },
      {
        onSuccess: handleSaveSuccess,
      },
    );
  }

  /* ------------------------------------------------------------------------ */
  /* RENDER                                                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <div className="animate-in fade-in flex h-full flex-col rounded-lg duration-500 md:rounded-none">
      <EditorHeader title="Shape Settings" handleBack={handleBack} />

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="overflow-auto p-5 md:h-[calc(100dvh-125px)] md:min-h-[calc(100dvh-125px)] md:rounded-none [&::-webkit-scrollbar]:h-0 [&::-webkit-scrollbar]:w-[2px] [&::-webkit-scrollbar-thumb]:rounded-[10px] [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-track]:rounded-[10px] [&::-webkit-scrollbar-track]:bg-slate-100">
            <section>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-1">
                <FormField
                  control={form.control}
                  name="border_radius"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-1">
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
                                        "h-5 w-5 border transition-all",
                                        item.className,
                                        active ? "border-white/50 bg-white/10" : "border-slate-300 bg-slate-100",
                                      )}
                                    />
                                  </div>

                                  <p
                                    className={cn(
                                      "truncate text-[0.6rem] tracking-wide md:text-[0.7rem]",
                                      active ? "text-white/90" : "text-slate-500",
                                    )}
                                  >
                                    {item.label}
                                  </p>
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
                <FormField
                  control={form.control}
                  name="border_width"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-1">
                      <FormLabel>Border</FormLabel>

                      <FormControl>
                        <RadioGroup
                          value={field.value}
                          onValueChange={(val) => {
                            field.onChange(val);

                            handleLiveChange("border_width", val as BorderWidth);
                          }}
                          className="grid grid-cols-1"
                        >
                          <HorizontalScroll>
                            {[
                              {
                                id: "none",
                                label: "None",
                                width: "border-0",
                              },
                              {
                                id: "thin",
                                label: "Thin",
                                width: "border",
                              },
                              {
                                id: "medium",
                                label: "Medium",
                                width: "border-2",
                              },
                              {
                                id: "thick",
                                label: "Thick",
                                width: "border-4",
                              },
                            ].map((item) => {
                              const active = field.value === item.id;

                              return (
                                <label
                                  key={item.id}
                                  htmlFor={`border-width-${item.id}`}
                                  className={cn(
                                    "min-w-25 shrink-0 cursor-pointer rounded-md border px-3 py-3 transition-all duration-300",
                                    active
                                      ? "border-slate-900 bg-slate-900 text-white shadow-lg shadow-slate-200"
                                      : "border-slate-200 bg-white",
                                  )}
                                >
                                  <RadioGroupItem value={item.id} id={`border-width-${item.id}`} className="hidden" />

                                  <div className="mb-2 flex h-5 items-center md:mb-6">
                                    <div
                                      className={cn(
                                        "h-4 w-12 rounded-sm border-slate-400",
                                        item.width,
                                        item.id === "none" && "border-slate-300",
                                        active && "border-white/70",
                                      )}
                                    />
                                  </div>

                                  <p
                                    className={cn(
                                      "text-[0.6rem] tracking-wide md:text-[0.7rem]",
                                      active ? "text-white/90" : "text-slate-500",
                                    )}
                                  >
                                    {item.label}
                                  </p>
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
                <FormField
                  control={form.control}
                  name="border_style"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-1">
                      <FormLabel>Border Style</FormLabel>

                      <FormControl>
                        <RadioGroup
                          value={field.value}
                          onValueChange={(val) => {
                            field.onChange(val);

                            handleLiveChange("border_style", val as BorderStyle);
                          }}
                          className="grid grid-cols-1"
                        >
                          <HorizontalScroll>
                            {[
                              {
                                id: "solid",
                                label: "Solid",
                                className: "border-t-2 border-solid",
                              },
                              {
                                id: "dashed",
                                label: "Dashed",
                                className: "border-t-2 border-dashed",
                              },
                              {
                                id: "dotted",
                                label: "Dotted",
                                className: "border-t-2 border-dotted",
                              },
                              {
                                id: "double",
                                label: "Double",
                                className: "border-t-4 border-double",
                              },
                            ].map((item) => {
                              const active = field.value === item.id;

                              return (
                                <label
                                  key={item.id}
                                  htmlFor={`border-style-${item.id}`}
                                  className={cn(
                                    "min-w-25 shrink-0 cursor-pointer rounded-md border px-3 py-3 transition-all duration-300",
                                    active
                                      ? "border-slate-900 bg-slate-900 text-white shadow-lg shadow-slate-200"
                                      : "border-slate-200 bg-white",
                                  )}
                                >
                                  <RadioGroupItem value={item.id} id={`border-style-${item.id}`} className="hidden" />

                                  <div className="mb-2 flex h-5 items-center md:mb-6">
                                    <div className={cn("w-12 border-slate-400", item.className, active && "border-white/80")} />
                                  </div>

                                  <p
                                    className={cn(
                                      "text-[0.6rem] tracking-wide md:text-[0.7rem]",
                                      active ? "text-white/90" : "text-slate-500",
                                    )}
                                  >
                                    {item.label}
                                  </p>
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
                <FormField
                  control={form.control}
                  name="shadow"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-1">
                      <FormLabel>Shadow</FormLabel>

                      <FormControl>
                        <RadioGroup
                          value={field.value}
                          onValueChange={(val) => {
                            field.onChange(val);

                            handleLiveChange("shadow", val as ShadowPreset);
                          }}
                          className="grid grid-cols-1"
                        >
                          <HorizontalScroll>
                            {[
                              {
                                id: "none",
                                label: "None",
                                icon: Square,
                                shadow: "",
                              },
                              {
                                id: "soft",
                                label: "Soft",
                                icon: Square,
                                shadow: "shadow-sm",
                              },
                              {
                                id: "medium",
                                label: "Medium",
                                icon: Square,
                                shadow: "shadow-md",
                              },
                              {
                                id: "floating",
                                label: "Floating",
                                icon: Square,
                                shadow: "shadow-xl",
                              },
                            ].map((item) => {
                              const active = field.value === item.id;

                              const Icon = item.icon;

                              return (
                                <label
                                  key={item.id}
                                  htmlFor={`shadow-${item.id}`}
                                  className={cn(
                                    "min-w-25 shrink-0 cursor-pointer rounded-md border px-3 py-3 transition-all duration-300",
                                    active
                                      ? "border-slate-900 bg-slate-900 text-white shadow-lg shadow-slate-200"
                                      : "border-slate-200 bg-white",
                                  )}
                                >
                                  <RadioGroupItem value={item.id} id={`shadow-${item.id}`} className="hidden" />

                                  <div className="mb-2 flex h-5 items-center md:mb-6">
                                    <Icon
                                      className={cn("h-5 w-5 rounded-sm border border-slate-300", item.shadow, active && "border-white/50")}
                                      strokeWidth={1.2}
                                    />
                                  </div>

                                  <p
                                    className={cn(
                                      "text-[0.6rem] tracking-wide md:text-[0.7rem]",
                                      active ? "text-white/90" : "text-slate-500",
                                    )}
                                  >
                                    {item.label}
                                  </p>
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
                <FormField
                  control={form.control}
                  name="image_shape"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-1">
                      <FormLabel>Image Shape</FormLabel>

                      <FormControl>
                        <RadioGroup
                          value={field.value}
                          onValueChange={(val) => {
                            field.onChange(val);

                            handleLiveChange("image_shape", val as ImageShape);
                          }}
                          className="grid grid-cols-1"
                        >
                          <HorizontalScroll>
                            {[
                              {
                                id: "rectangle",
                                label: "Rectangle",
                                className: "rounded-none",
                                icon: RectangleHorizontal,
                              },
                              {
                                id: "rounded",
                                label: "Rounded",
                                className: "rounded-lg",
                                icon: RectangleHorizontal,
                              },
                              {
                                id: "circle",
                                label: "Circle",
                                className: "rounded-full",
                                icon: Circle,
                              },
                              {
                                id: "arch",
                                label: "Arch",
                                className: "rounded-t-full",
                                icon: PanelsTopLeft,
                              },
                            ].map((item) => {
                              const active = field.value === item.id;

                              const Icon = item.icon;

                              return (
                                <label
                                  key={item.id}
                                  htmlFor={`image-shape-${item.id}`}
                                  className={cn(
                                    "min-w-25 shrink-0 cursor-pointer rounded-md border px-3 py-3 transition-all duration-300",
                                    active
                                      ? "border-slate-900 bg-slate-900 text-white shadow-lg shadow-slate-200"
                                      : "border-slate-200 bg-white",
                                  )}
                                >
                                  <RadioGroupItem value={item.id} id={`image-shape-${item.id}`} className="hidden" />

                                  <div className="mb-2 flex h-5 items-center md:mb-6">
                                    <div
                                      className={cn(
                                        "flex h-5 w-7 items-center justify-center overflow-hidden border border-slate-300 bg-slate-100",
                                        item.className,
                                        active && "border-white/50 bg-white/10",
                                      )}
                                    >
                                      <Icon className={cn("h-3.5 w-3.5", active ? "text-white/80" : "text-slate-400")} strokeWidth={1.2} />
                                    </div>
                                  </div>

                                  <p
                                    className={cn(
                                      "truncate text-[0.6rem] tracking-wide md:text-[0.7rem]",
                                      active ? "text-white/90" : "text-slate-500",
                                    )}
                                  >
                                    {item.label}
                                  </p>
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
      </FormProvider>
    </div>
  );
}
