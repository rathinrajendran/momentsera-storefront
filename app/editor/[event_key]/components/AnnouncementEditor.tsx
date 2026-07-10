"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Trash2, X, Upload, Camera, Save, Check } from "lucide-react";
import { usePreviewDraft } from "../PreviewDraftContext";
import { useSaveEventSection } from "../../../../hooks/useEvents";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "../../../../components/ui/form";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { RadioGroup, RadioGroupItem } from "../../../../components/ui/radio-group";
import { resolveMediaUrl } from "../../../../utils/media";
import { getCroppedImg } from "../../../../utils/imageUtils";
import { themeAnnouncementMedia, AnnouncementImageKey } from "../../../../utils/themeAnnouncementMedia";
import { cn } from "../../../../utils/utils";
import { LabelForm } from "../../../../components/ui/LabelForm";
import EditorHeader from "./EditorHeader";
import { getAccessToken } from "../../../../lib/api/apiClient";

/* ---------------- SCHEMA ---------------- */

const schema = z.object({
  bride: z.string().min(1, "Bride name is required"),
  groom: z.string().min(1, "Groom name is required"),
  coupleOrder: z.enum(["bride_first", "groom_first"]),
  nameTransform: z.enum(["none", "capitalize", "uppercase"]),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;
type AnnouncementMediaItem = {
  file_url?: string;
  temp_url?: string;
  temp_id?: string;
  media_type: "image";
  _deleted?: boolean;
};
type AnnouncementMedia = Partial<Record<AnnouncementImageKey, AnnouncementMediaItem>>;
type Announcement = {
  bride?: { name?: string };
  groom?: { name?: string };
  coupleOrder?: "bride_first" | "groom_first";
  nameTransform?: "none" | "capitalize" | "uppercase";
  message?: string;
  media?: AnnouncementMedia;
};

export default function AnnouncementEditor({ onBack, eventKey }: { onBack: () => void; eventKey: string }) {
  // Hooks
  const { draft, updateSection, resetDraft, refreshEvent } = usePreviewDraft();
  const eventId = draft.invite.id;
  const mutation = useSaveEventSection(eventKey, eventId);

  console.log("draft data", draft);

  // Derived values
  const themeKey = draft?.invite?.invite_key ?? "aura";
  const announcement: Announcement = draft.announcement ?? {};
  const announcementMedia: AnnouncementMedia = announcement.media ?? {};
  const mediaRules = useMemo(() => {
    return themeAnnouncementMedia[themeKey] ?? themeAnnouncementMedia["aura"];
  }, [themeKey]);

  // Form
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      bride: announcement?.bride?.name ?? "",
      groom: announcement?.groom?.name ?? "",
      coupleOrder: announcement?.coupleOrder ?? "bride_first",
      nameTransform: announcement.nameTransform ?? "none",
      message: announcement?.message ?? "",
    },
  });

  // State
  const [activeKey, setActiveKey] = useState<AnnouncementImageKey | null>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    x: 15,
    y: 15,
    width: 70,
    height: 70,
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);

  const imgRef = useRef<HTMLImageElement | null>(null);

  // Memoized values
  const activeRule = useMemo(() => {
    if (!activeKey) return null;
    return mediaRules.find((r) => r.key === activeKey) ?? null;
  }, [activeKey, mediaRules]);

  // Handlers
  function handleLiveChange<K extends keyof FormValues>(field: K, value: FormValues[K]) {
    updateSection("announcement", {
      ...announcement,
      [field]: field === "message" || field === "nameTransform" ? value : { name: value as string },
    });
  }

  const handleSaveSuccess = async () => {
    await refreshEvent(eventKey);
    onBack();
  };

  function handleCancel() {
    resetDraft();
    onBack();
  }

  const onPickFile = useCallback((key: AnnouncementImageKey, file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files allowed");
      return;
    }

    const url = URL.createObjectURL(file);
    setActiveKey(key);
    setActiveImage(url);
  }, []);

  async function handleUploadCropped() {
    if (!activeKey || !activeImage || !activeRule || !imgRef.current) {
      toast.error("Please select an image first");
      return;
    }

    const cropToUse: PixelCrop =
      completedCrop ??
      (() => {
        const img = imgRef.current!;
        return {
          unit: "px",
          x: (crop.x / 100) * img.width,
          y: (crop.y / 100) * img.height,
          width: (crop.width / 100) * img.width,
          height: (crop.height / 100) * img.height,
        } as PixelCrop;
      })();

    const croppedFile = await getCroppedImg(imgRef.current, cropToUse, {
      format: "image/webp",
      quality: 0.85,
      maxWidth: activeRule.width,
    });

    const tempUrl = URL.createObjectURL(croppedFile);
    const tempId = crypto.randomUUID();

    const formData = new FormData();
    formData.append("image", croppedFile);

    const token = getAccessToken();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/gallery/upload`, {
      method: "POST",
      credentials: "include",
      headers: {
        ...(token && {
          Authorization: `Bearer ${token}`,
        }),
      },
      body: formData,
    });

    if (!res.ok) {
      toast.error("Upload failed");
      return;
    }

    const { filename } = (await res.json()) as { filename: string };

    updateSection("announcement", {
      ...announcement,
      media: {
        ...announcementMedia,
        [activeKey]: {
          temp_id: tempId,
          temp_url: tempUrl,
          file_url: filename,
          media_type: "image",
        },
      },
    });

    toast.success(`${activeRule.label} updated`);
    setActiveKey(null);
    setActiveImage(null);
    setCompletedCrop(null);
  }
  function removeAnnouncementImage(key: AnnouncementImageKey) {
    const nextMedia = { ...announcementMedia };
    if (!nextMedia[key]) return;

    nextMedia[key] = {
      ...nextMedia[key],
      _deleted: true,
      file_url: undefined,
      temp_url: undefined,
    };

    updateSection("announcement", {
      ...announcement,
      media: nextMedia,
    });
  }

  function onSubmit(values: FormValues) {
    const finalMedia: Record<string, any> = {};

    for (const rule of mediaRules) {
      const item = announcementMedia?.[rule.key];

      // If marked as deleted, explicitly pass null to patch/overwrite database record
      if (item?._deleted) {
        finalMedia[rule.key] = null;
        continue;
      }

      if (item?.file_url) {
        finalMedia[rule.key] = {
          file_url: item.file_url,
          media_type: "image",
        };
      }
    }

    mutation.mutate(
      {
        path: "announcement",
        stage: "announcement",
        data: {
          bride: { name: values.bride },
          groom: { name: values.groom },
          coupleOrder: values.coupleOrder,
          nameTransform: values.nameTransform,
          message: values.message,
          media: finalMedia,
        },
      },
      {
        onSuccess: async () => {
          await handleSaveSuccess();
        },
      },
    );
  }

  return (
    <div className="animate-in fade-in flex h-full flex-col rounded-xl duration-500 md:rounded-none">
      <EditorHeader title="Announcement" handleCancel={handleCancel} />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-1 flex-col justify-between space-y-6 p-5 pb-0 md:min-h-[calc(100dvh-115px)] md:rounded-none [&::-webkit-scrollbar]:h-0 [&::-webkit-scrollbar]:w-[2px] [&::-webkit-scrollbar-thumb]:rounded-[10px] [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-track]:rounded-[10px] [&::-webkit-scrollbar-track]:bg-slate-100"
        >
          {/* Section 1: Couple Details */}
          <section className="space-y-5 [&>*:last-child]:mb-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="groom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-slate-700">Groom's Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g. Michael"
                        className="h-9 border-slate-200 bg-white text-sm focus-visible:ring-1 focus-visible:ring-slate-400"
                        onChange={(e) => {
                          field.onChange(e);
                          handleLiveChange("groom", e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage className="text-destructive text-[10px] font-medium" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bride"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-slate-700">Bride's Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g. Sarah"
                        className="h-9 border-slate-200 bg-white text-sm focus-visible:ring-1 focus-visible:ring-slate-400"
                        onChange={(e) => {
                          field.onChange(e);
                          handleLiveChange("bride", e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage className="text-destructive text-[10px] font-medium" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="coupleOrder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-slate-700">Display Order</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          field.onChange("bride_first");
                          updateSection("announcement", {
                            ...announcement,
                            coupleOrder: "bride_first",
                          });
                        }}
                        className={cn(
                          "h-[42px] cursor-pointer rounded-md border py-2 text-xs font-medium transition-all duration-150 active:scale-98",
                          field.value === "bride_first"
                            ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                        )}
                      >
                        Bride & Groom
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          field.onChange("groom_first");
                          updateSection("announcement", {
                            ...announcement,
                            coupleOrder: "groom_first",
                          });
                        }}
                        className={cn(
                          "h-[42px] cursor-pointer rounded-md border py-2 text-xs font-medium transition-all duration-150 active:scale-98",
                          field.value === "groom_first"
                            ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                        )}
                      >
                        Groom & Bride
                      </button>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nameTransform"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-slate-700">Typography Case</FormLabel>
                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      onValueChange={(v) => {
                        const value = v as FormValues["nameTransform"];
                        field.onChange(value);
                        handleLiveChange("nameTransform", value);
                      }}
                      className="grid grid-cols-3 gap-2.5"
                    >
                      {(["none", "capitalize", "uppercase"] as const).map((t) => {
                        const isActive = field.value === t;
                        return (
                          <FormItem key={t}>
                            <FormLabel
                              className={cn(
                                "flex h-14 shrink-0 cursor-pointer flex-col justify-center rounded-lg border px-3 transition-all duration-200 active:scale-98",
                                isActive
                                  ? "border-slate-900 bg-slate-900 text-white shadow-md shadow-slate-100"
                                  : "border-slate-200 bg-white hover:bg-slate-50",
                              )}
                            >
                              <FormControl>
                                <RadioGroupItem value={t} className="hidden" />
                              </FormControl>
                              <div className="flex h-full flex-col items-start justify-center gap-0.5">
                                <div className="text-xs font-bold tracking-tight">
                                  {t === "none" ? "Aa" : t === "capitalize" ? "Ab" : "AA"}
                                </div>
                                <div className={cn("text-[10px] font-medium capitalize", isActive ? "text-slate-300" : "text-slate-400")}>
                                  {t === "none" ? "Normal" : t}
                                </div>
                              </div>
                            </FormLabel>
                          </FormItem>
                        );
                      })}
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-slate-700">Introductory Message</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g. Together with our families..."
                      className="h-9 border-slate-200 bg-white text-sm focus-visible:ring-1 focus-visible:ring-slate-400"
                      onChange={(e) => {
                        field.onChange(e);
                        handleLiveChange("message", e.target.value);
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {activeImage && activeRule ? (
              <div
                className="animate-in fade-in fixed top-0 right-0 bottom-0 z-[999] flex w-[350px] overflow-hidden rounded-l-2xl border-l border-slate-100 bg-white shadow-2xl md:top-[115px]"
                style={{ marginBottom: "0" }}
              >
                <div className="flex w-full flex-col justify-between">
                  <div className="flex items-center justify-between border-b border-slate-50 bg-slate-50/50 px-4 py-3">
                    <span className="text-[10px] font-bold tracking-wider text-slate-900 uppercase">Crop {activeRule.label}</span>
                    <span className="font-mono text-[10px] font-semibold text-slate-400">
                      {activeRule.width} × {activeRule.height}
                    </span>
                  </div>

                  <div className="relative flex flex-1 items-center justify-center bg-slate-50 px-2 py-4">
                    <div className="flex max-h-[calc(100vh-220px)] w-full justify-center overflow-auto rounded-lg bg-slate-50 p-1">
                      <ReactCrop
                        crop={crop}
                        onChange={(crop) => setCrop(crop)}
                        onComplete={(crop) => setCompletedCrop(crop as PixelCrop)}
                        aspect={activeRule.aspectRatio}
                        keepSelection
                      >
                        <img
                          ref={imgRef}
                          src={activeImage}
                          alt="Crop Target"
                          className="rounded-md"
                          style={{
                            width: "auto",
                            height: "auto",
                            maxHeight: "calc(100dvh - 260px)",
                            display: "block",
                          }}
                          onLoad={(e) => {
                            const { width, height } = e.currentTarget;
                            const initialCrop = centerCrop(
                              makeAspectCrop({ unit: "%", width: 100 }, activeRule.aspectRatio, width, height),
                              width,
                              height,
                            );
                            setCrop(initialCrop);
                            const px: PixelCrop = {
                              unit: "px",
                              x: (initialCrop.x / 100) * width,
                              y: (initialCrop.y / 100) * height,
                              width: (initialCrop.width / 100) * width,
                              height: (initialCrop.height / 100) * height,
                            };
                            setCompletedCrop(px);
                          }}
                        />
                      </ReactCrop>
                    </div>
                  </div>

                  <div className="flex h-14 items-center justify-end gap-2 border-t border-slate-50 bg-white px-4">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 rounded-md text-xs font-semibold text-slate-400 hover:bg-slate-50 hover:text-slate-900"
                      onClick={() => {
                        setActiveKey(null);
                        setActiveImage(null);
                        setCrop({
                          unit: "%",
                          x: 0,
                          y: 0,
                          width: 100,
                          height: 100,
                        });
                        setCompletedCrop(null);
                      }}
                    >
                      <X size={14} className="opacity-70" />
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      className="h-8 rounded-md bg-slate-900 px-5 text-xs font-semibold text-white hover:bg-slate-800"
                      onClick={handleUploadCropped}
                    >
                      <Check size={14} />
                      Apply Crop
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {mediaRules.map((rule) => {
                  const item = announcementMedia?.[rule.key];
                  const previewUrl = item?._deleted ? null : item?.temp_url || (item?.file_url ? resolveMediaUrl(item.file_url) : null);

                  return (
                    <div key={rule.key} className="group relative grid gap-1">
                      <div className="flex items-center justify-between">
                        <LabelForm className="text-xs font-semibold text-slate-700">{rule.label}</LabelForm>
                        {previewUrl && (
                          <button
                            type="button"
                            onClick={() => removeAnnouncementImage(rule.key)}
                            className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-red-500 opacity-0 transition-all group-hover:opacity-100 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>

                      {previewUrl ? (
                        <div className="relative overflow-hidden rounded-xl border border-slate-100 shadow-sm transition-all">
                          <img
                            src={previewUrl}
                            alt=""
                            className="aspect-[16/9] w-full object-cover transition-transform duration-700 group-hover:scale-[1.01]"
                          />
                          <label className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center bg-black/40 opacity-0 backdrop-blur-[2px] transition-opacity group-hover:opacity-100">
                            <Upload className="mb-1.5 h-4 w-4 text-white" />
                            <span className="text-[10px] font-semibold tracking-wide text-white uppercase">Replace Image</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (f) onPickFile(rule.key, f);
                                e.currentTarget.value = "";
                              }}
                            />
                          </label>
                        </div>
                      ) : (
                        <label
                          className={cn(
                            "flex aspect-[16/9] w-full cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/30 transition-all duration-200",
                            "hover:border-slate-400 hover:bg-slate-50/80",
                          )}
                        >
                          <div className="mb-2.5 flex h-10 w-10 items-center justify-center rounded-full border border-slate-100 bg-white text-slate-400 shadow-sm transition-colors group-hover:text-slate-600">
                            <Camera size={18} strokeWidth={1.5} />
                          </div>
                          <span className="text-[11px] font-bold tracking-wider text-slate-600 uppercase">Upload {rule.label}</span>
                          <span className="mt-0.5 font-mono text-[9px] font-medium text-slate-400 italic">
                            Ideal: {rule.width} × {rule.height}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) onPickFile(rule.key, f);
                              e.currentTarget.value = "";
                            }}
                          />
                        </label>
                      )}
                    </div>
                  );
                })}
              </>
            )}
          </section>

          {/* Sticky Actions Footer */}
          <div className="sticky bottom-0 z-[99] -mx-5 flex h-14 items-center justify-end gap-3 border-t border-slate-100 bg-white/90 px-5 backdrop-blur-md">
            <Button
              type="button"
              variant="ghost"
              onClick={handleCancel}
              className="h-9 text-xs font-semibold text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-900"
            >
              <X strokeWidth={1.5} size={14} />
              <span>Discard</span>
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="h-9 rounded-lg bg-slate-900 px-8 text-xs font-semibold text-white shadow-md shadow-slate-100 transition-all hover:bg-slate-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Save strokeWidth={1.5} size={14} />
              {mutation.isPending ? "Updating..." : "Save Configuration"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
