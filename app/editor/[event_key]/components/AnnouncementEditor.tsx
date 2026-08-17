"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { toast } from "sonner";
import { Trash2, X, Upload, Camera, Save, Check } from "lucide-react";
import { usePreviewDraft } from "../PreviewDraftContext";
import { useSaveEventSection } from "../../../../hooks/useEvents";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { RadioGroup, RadioGroupItem } from "../../../../components/ui/radio-group";
import { resolveMediaUrl } from "../../../../utils/media";
import { getCroppedImg } from "../../../../utils/imageUtils";
import { getThemeEditorSections, getThemeEditorMedia } from "../../../../utils/editor/editor-resolver";
import type { AnnouncementImageKey, EditorSection } from "../../../../utils/editor/editor-schema";
import { cn } from "../../../../utils/utils";
import { LabelForm } from "../../../../components/ui/LabelForm";
import EditorHeader from "./EditorHeader";
import { getAccessToken } from "../../../../lib/api/apiClient";

/* ---------------- HELPERS FOR NESTED OBJECT ACCESS ---------------- */

const getNestedValue = (obj: Record<string, any>, path: string): string => {
  const value = path.split(".").reduce<any>((acc, part) => acc?.[part], obj);

  if (value == null) return "";
  return typeof value === "string" ? value : String(value);
};

const setNestedValue = (obj: Record<string, any>, path: string, value: any): Record<string, any> => {
  const keys = path.split(".");
  const lastKey = keys.pop()!;
  const deepCopy = JSON.parse(JSON.stringify(obj || {}));

  let current = deepCopy;
  for (const key of keys) {
    if (!current[key] || typeof current[key] !== "object") {
      current[key] = {};
    }
    current = current[key];
  }
  current[lastKey] = value;
  return deepCopy;
};

/* ---------------- TYPES ---------------- */

type AnnouncementMediaItem = {
  file_url?: string;
  temp_url?: string;
  temp_id?: string;
  media_type: "image";
  description?: string;
  _deleted?: boolean;
};

type AnnouncementMedia = Partial<Record<AnnouncementImageKey, AnnouncementMediaItem>>;

type Announcement = {
  bride?: { name?: string; parents?: string };
  groom?: { name?: string; parents?: string };
  familyName?: string;
  coupleOrder?: "bride_first" | "groom_first";
  nameTransform?: "none" | "capitalize" | "uppercase";
  message?: string;
  media?: AnnouncementMedia;
  [key: string]: any;
};

export default function AnnouncementEditor({ onBack, eventKey }: { onBack: () => void; eventKey: string }) {
  // Hooks
  const { draft, updateSection, resetDraft, refreshEvent } = usePreviewDraft();
  const eventId = draft?.invite?.id;

  // React hooks must be called unconditionally. Use 0 as a safe placeholder
  // until the event is loaded; handleSubmit prevents any real save with 0.
  const mutation = useSaveEventSection(eventKey, eventId ?? 0);

  // Derived Values
  const themeKey = draft?.invite?.invite_key ?? "aura";
  const announcement: Announcement = draft?.announcement ?? {};
  const announcementMedia: AnnouncementMedia = announcement?.media ?? {};

  // Dynamic Rule Resolution
  const mediaRules = useMemo(() => getThemeEditorMedia(themeKey, "announcement"), [themeKey]);

  // Only resolve fields belonging to this editor page.
  // For example, Nuvo/Announcement returns Couple + Hero only.
  const fieldRules = useMemo<EditorSection[]>(() => getThemeEditorSections(themeKey, "announcement"), [themeKey]);

  // Image Cropping States
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

  const activeRule = useMemo(() => {
    if (!activeKey) return null;
    return mediaRules.find((r) => r.key === activeKey) ?? null;
  }, [activeKey, mediaRules]);

  // Handlers
  function handleDynamicFieldChange(keyPath: string, value: string) {
    const updatedAnnouncement = setNestedValue(announcement, keyPath, value);
    updateSection("announcement", updatedAnnouncement);
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

    try {
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
        let message = "Upload failed";
        try {
          const body = await res.json();
          message = body?.message || body?.error || message;
        } catch {
          // Keep the default message when the API does not return JSON.
        }

        URL.revokeObjectURL(tempUrl);
        toast.error(message);
        return;
      }

      const body = (await res.json()) as { filename?: string };

      if (!body.filename) {
        URL.revokeObjectURL(tempUrl);
        toast.error("Upload failed: server did not return a filename");
        return;
      }

      updateSection("announcement", {
        ...announcement,
        media: {
          ...announcementMedia,
          [activeKey]: {
            ...(announcementMedia[activeKey] ?? {}),
            temp_id: tempId,
            temp_url: tempUrl,
            file_url: body.filename,
            media_type: "image",
            description: announcementMedia[activeKey]?.description ?? "",
            _deleted: false,
          },
        },
      });

      toast.success(`${activeRule.label} updated`);
      setActiveKey(null);
      setActiveImage(null);
      setCompletedCrop(null);
    } catch (error) {
      console.error("Announcement image upload failed:", error);
      toast.error(error instanceof Error ? error.message : "Failed to upload image. Please try again.");
    }
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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (mutation.isPending) return;

    if (!eventId) {
      toast.error("Event ID is missing. Please reload the invitation.");
      return;
    }
    // Validate only required fields from the current editor page.
    // fieldRules contains sections, so validation must walk section.fields.
    for (const section of fieldRules) {
      for (const field of section.fields) {
        // Announcement currently uses flat fields. Groups/repeaters belong to
        // their own page-specific renderers and are intentionally skipped here.
        if (field.type === "group" || field.type === "repeater") continue;

        if (field.required) {
          const val = getNestedValue(announcement, field.key);
          if (!val || !val.trim()) {
            toast.error(`${field.label} is required`);
            return;
          }
        }
      }
    }

    for (const rule of mediaRules) {
      const item = announcementMedia?.[rule.key];

      if (rule.required && (!item?.file_url || item?._deleted)) {
        toast.error(`${rule.label} is required`);
        return;
      }

      if (rule.descriptionRequired && !item?.description?.trim()) {
        toast.error(`${rule.descriptionLabel ?? "Image Description"} is required`);
        return;
      }
    }

    const finalMedia: Record<string, any> = {};

    for (const rule of mediaRules) {
      const item = announcementMedia?.[rule.key];

      if (item?._deleted) {
        finalMedia[rule.key] = null;
        continue;
      }

      if (item?.file_url) {
        finalMedia[rule.key] = {
          file_url: item.file_url,
          media_type: "image",
          ...(item.description?.trim() ? { description: item.description.trim() } : {}),
        };
      }
    }

    mutation.mutate(
      {
        path: "announcement",
        stage: "announcement",
        data: {
          ...announcement,
          media: finalMedia,
        },
      },
      {
        onSuccess: async () => {
          toast.success("Announcement saved successfully");
          await handleSaveSuccess();
        },

        onError: (error: any) => {
          console.error("Announcement save failed:", error);

          const message =
            error?.message ||
            error?.error ||
            error?.response?.data?.message ||
            error?.response?.data?.error ||
            "Failed to save announcement. Please try again.";

          toast.error(message);
        },
      },
    );
  }
  console.log("mutation.isPending", mutation.isPending);

  return (
    <div className="animate-in fade-in flex h-full flex-col rounded-xl duration-500 md:rounded-none">
      <EditorHeader title="Announcement" handleCancel={handleCancel} />
      <form
        onSubmit={handleSubmit}
        className="flex flex-1 flex-col justify-between space-y-6 p-5 pb-0 md:min-h-[calc(100dvh-115px)] md:rounded-none [&::-webkit-scrollbar]:h-0 [&::-webkit-scrollbar]:w-[2px] [&::-webkit-scrollbar-thumb]:rounded-[10px] [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-track]:rounded-[10px] [&::-webkit-scrollbar-track]:bg-slate-100"
      >
        <section className="space-y-5 [&>*:last-child]:mb-6">
          {/* Dynamic Input Fields */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-1">
            {fieldRules.map((section) => {
              return (
                <div key={section.key} className="space-y-4 rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                  {/* Section Header */}
                  <div className="border-b border-slate-200 pb-3">
                    <h3 className="text-[11px] font-bold tracking-[0.16em] text-slate-900 uppercase">{section.label}</h3>
                  </div>

                  {/* Section Fields */}
                  <div className="space-y-4">
                    {section.fields.map((field) => {
                      if (field.type === "group" || field.type === "repeater") {
                        return null;
                      }

                      const val = getNestedValue(announcement, field.key);

                      return (
                        <div key={field.key} className="flex flex-col gap-1.5">
                          <label className="text-xs font-semibold text-slate-700">
                            {field.label}

                            {field.required && <span className="ml-0.5 text-red-500">*</span>}
                          </label>

                          {field.type === "textarea" ? (
                            <textarea
                              value={val}
                              placeholder={field.placeholder ?? `Enter ${field.label.toLowerCase()}`}
                              rows={3}
                              className="w-full rounded-md border border-slate-200 bg-white p-2 text-sm focus-visible:ring-1 focus-visible:ring-slate-400 focus-visible:outline-none"
                              onChange={(e) => handleDynamicFieldChange(field.key, e.target.value)}
                            />
                          ) : field.type === "radio" && field.options ? (
                            <RadioGroup
                              value={val}
                              onValueChange={(value) => handleDynamicFieldChange(field.key, value)}
                              className="flex gap-4"
                            >
                              {field.options.map((option) => (
                                <div key={option.value} className="flex items-center gap-2">
                                  <RadioGroupItem value={option.value} id={`${section.key}-${field.key}-${option.value}`} />

                                  <label htmlFor={`${section.key}-${field.key}-${option.value}`} className="text-xs font-medium">
                                    {option.label}
                                  </label>
                                </div>
                              ))}
                            </RadioGroup>
                          ) : (
                            <Input
                              value={val}
                              placeholder={field.placeholder ?? `e.g. ${field.label}`}
                              className="h-9 border-slate-200 bg-white text-sm focus-visible:ring-1 focus-visible:ring-slate-400"
                              onChange={(e) => handleDynamicFieldChange(field.key, e.target.value)}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Typography Transform Options */}
          {/* <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700">Typography Case</label>
            <RadioGroup
              value={announcement.nameTransform ?? "none"}
              onValueChange={(v) =>
                updateSection("announcement", {
                  ...announcement,
                  nameTransform: v,
                })
              }
              className="grid grid-cols-3 gap-2.5"
            >
              {(["none", "capitalize", "uppercase"] as const).map((t) => {
                const isActive = (announcement.nameTransform ?? "none") === t;
                return (
                  <div key={t}>
                    <label
                      className={cn(
                        "flex h-14 shrink-0 cursor-pointer flex-col justify-center rounded-lg border px-3 transition-all duration-200 active:scale-98",
                        isActive
                          ? "border-slate-900 bg-slate-900 text-white shadow-md shadow-slate-100"
                          : "border-slate-200 bg-white hover:bg-slate-50",
                      )}
                    >
                      <RadioGroupItem value={t} className="hidden" />
                      <div className="flex h-full flex-col items-start justify-center gap-0.5">
                        <div className="text-xs font-bold tracking-tight">{t === "none" ? "Aa" : t === "capitalize" ? "Ab" : "AA"}</div>
                        <div className={cn("text-[10px] font-medium capitalize", isActive ? "text-slate-300" : "text-slate-400")}>
                          {t === "none" ? "Normal" : t}
                        </div>
                      </div>
                    </label>
                  </div>
                );
              })}
            </RadioGroup>
          </div> */}

          {/* Dynamic Image Upload Rules */}
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
                  <div className="flex max-h-[calc(100vh-220px)] w-full justify-center overflow-hidden rounded-lg bg-slate-50 p-1">
                    <ReactCrop
                      crop={crop}
                      onChange={(c) => setCrop(c)}
                      onComplete={(c) => setCompletedCrop(c as PixelCrop)}
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
                      setCrop({ unit: "%", x: 0, y: 0, width: 100, height: 100 });
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
                  <div key={rule.key} className="group relative grid gap-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <LabelForm className="text-xs font-semibold text-slate-700">{rule.label}</LabelForm>
                        {rule.description && <p className="mt-0.5 text-[10px] leading-4 text-slate-400">{rule.description}</p>}
                      </div>
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
                          className="w-full object-cover transition-transform duration-700 group-hover:scale-[1.01]"
                          style={{ aspectRatio: rule.aspectRatio }}
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
                          "flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/30 transition-all duration-200",
                          "hover:border-slate-400 hover:bg-slate-50/80",
                        )}
                        style={{ aspectRatio: rule.aspectRatio }}
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

                    {rule.descriptionKey && (
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-slate-700">
                          {rule.descriptionLabel ?? "Image Description"}
                          {rule.descriptionRequired && <span className="ml-0.5 text-red-500">*</span>}
                        </label>
                        <textarea
                          value={item?.description ?? ""}
                          placeholder={rule.descriptionPlaceholder ?? "Describe this photograph..."}
                          rows={3}
                          className="w-full resize-none rounded-md border border-slate-200 bg-white p-2 text-sm focus-visible:ring-1 focus-visible:ring-slate-400 focus-visible:outline-none"
                          onChange={(e) => {
                            const value = e.target.value;
                            updateSection("announcement", {
                              ...announcement,
                              media: {
                                ...announcementMedia,
                                [rule.key]: {
                                  ...(announcementMedia[rule.key] ?? { media_type: "image" }),
                                  description: value,
                                },
                              },
                            });
                          }}
                        />
                      </div>
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
    </div>
  );
}
