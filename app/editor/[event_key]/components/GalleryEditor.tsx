"use client";

import { useState } from "react";
import { toast } from "sonner";
import { LayoutGrid, LayoutPanelLeft, GalleryHorizontal, Tally2, ChevronLeft, ChevronRight } from "lucide-react";
import { usePreviewDraft } from "../PreviewDraftContext";
import { useSaveEventSection } from "../../../../hooks/useEvents";
import { cn } from "../../../../utils/utils";
import { RadioGroup, RadioGroupItem } from "../../../../components/ui/radio-group";
import { HorizontalScroll } from "../../../../components/ui/HorizontalScroll";
import { LabelForm } from "../../../../components/ui/LabelForm";
import GalleryUploader from "./Galleryuploader";
import GalleryCropper from "./Gallerycropper";
import GalleryPreview from "./Gallerypreview";
import GalleryFooter from "./Galleryfooter";
import EditorHeader from "./EditorHeader";
import { GalleryItem } from "../../../../types/eventFunction";
import { getAccessToken } from "../../../../lib/api/apiClient";

export type LocalGalleryItem = GalleryItem & {
  _deleted?: boolean;
  temp_id?: string;
  temp_url?: string;
};

type GalleryLayout = "grid" | "masonry" | "carousel" | "thumbnail";

export default function GalleryEditor({ onBack, handleBack, eventKey }: { onBack: () => void; handleBack: () => void; eventKey: string }) {
  const { draft, replaceSection, resetDraft, refreshEvent } = usePreviewDraft();
  const eventId = draft.invite.id;
  const saveMutation = useSaveEventSection(eventKey, eventId);

  const MAX_IMAGES = draft.invite?.status === "draft" ? 3 : 10;

  // Queue of object-URLs waiting to be cropped
  const [queue, setQueue] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  // Derived values typed as LocalGalleryItem[]
  const galleryItems: LocalGalleryItem[] = draft.gallery?.items ?? [];
  const currentLayout: GalleryLayout = draft.gallery?.layout ?? "grid";

  // ── Uploader ────────────────────────────────────────────────────────────────

  function handleFilesAdded(objectUrls: string[]) {
    setQueue((q) => [...q, ...objectUrls]);
  }

  // ── Cropper ─────────────────────────────────────────────────────────────────

  async function handleCropConfirm(croppedFile: File) {
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

    const { filename } = await res.json();

    replaceSection("gallery", {
      ...draft.gallery,
      pending: true,
      items: [...galleryItems, { temp_id: tempId, temp_url: tempUrl, file_url: filename, media_type: "image" }],
    });

    setQueue((q) => q.filter((_, i) => i !== activeIndex));
    setActiveIndex(0);
    toast.success("Image added");
  }

  function handleCropCancel() {
    setQueue([]);
  }

  // ── Preview ──────────────────────────────────────────────────────────────────

  function removeImage(id: string) {
    replaceSection("gallery", {
      ...draft.gallery,
      pending: true,
      items: galleryItems.map((i) => (i.temp_id === id || i.file_url === id ? { ...i, _deleted: true } : i)),
    });
  }

  // ── Layout ───────────────────────────────────────────────────────────────────

  function handleLayoutChange(layout: GalleryLayout) {
    replaceSection("gallery", { ...draft.gallery, layout });
  }

  // ── Save / Cancel ────────────────────────────────────────────────────────────

  async function handleSaveSuccess() {
    await refreshEvent(eventKey);
    onBack();
  }

  function handleSaveAll() {
    const cleaned = galleryItems.filter((i) => !i._deleted && i.file_url).map((i) => ({ file_url: i.file_url, media_type: i.media_type }));

    saveMutation.mutate(
      { path: "gallery", stage: "gallery", data: { pending: false, layout: currentLayout, items: cleaned } },
      { onSuccess: handleSaveSuccess },
    );

    toast.success("Gallery updated");
  }

  function handleCancel() {
    resetDraft();
    onBack();
  }

  return (
    <div className="animate-in fade-in flex h-full flex-col rounded-xl duration-500 md:rounded-none">
      <EditorHeader title="Gallery" handleBack={handleBack} />

      <div className="overflow-auto p-5 md:h-[calc(100dvh-125px)] md:min-h-[calc(100dvh-125px)] md:rounded-none [&::-webkit-scrollbar]:h-0 [&::-webkit-scrollbar]:w-[2px] [&::-webkit-scrollbar-thumb]:rounded-[10px] [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-track]:rounded-[10px] [&::-webkit-scrollbar-track]:bg-slate-100">
        <section>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-1">
            <div className="flex flex-col gap-1">
              <LabelForm className="text-xs font-semibold text-slate-700">Gallery Layout</LabelForm>
              <RadioGroup
                value={currentLayout}
                onValueChange={(value) => handleLayoutChange(value as GalleryLayout)}
                className="grid grid-cols-1"
              >
                <HorizontalScroll className="w-full min-w-0">
                  {[
                    {
                      id: "grid",
                      label: "Grid",
                      icon: LayoutGrid,
                    },
                    {
                      id: "masonry",
                      label: "Masonry",
                      icon: LayoutPanelLeft,
                    },
                    {
                      id: "carousel",
                      label: "Carousel",
                      icon: GalleryHorizontal,
                    },
                    {
                      id: "thumbnail",
                      label: "Thumbnail",
                      icon: Tally2,
                    },
                  ].map((item) => {
                    const active = currentLayout === item.id;
                    const Icon = item.icon;

                    return (
                      <LabelForm
                        key={item.id}
                        // htmlFor={`gallery-layout-${item.id}`}
                        className={cn(
                          "group flex h-[68px] min-w-[100px] shrink-0 cursor-pointer flex-col justify-between rounded-xl border p-3 transition-all duration-300 md:h-[76px] md:min-w-[104px]",
                          active
                            ? "border-slate-900 bg-slate-900 text-white shadow-md shadow-slate-900/10"
                            : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50/50 hover:text-slate-900",
                        )}
                      >
                        <RadioGroupItem id={`gallery-layout-${item.id}`} value={item.id} className="hidden" />

                        <div className="flex items-center">
                          <Icon
                            className={cn(
                              "h-4 w-4",
                              item.id === "thumbnail" && "rotate-90",
                              active ? "text-white" : "text-slate-400 group-hover:text-slate-600",
                            )}
                            strokeWidth={1.5}
                          />
                        </div>

                        <p className={cn("truncate text-[11px] font-semibold tracking-wide", active ? "text-white/90" : "text-slate-500")}>
                          {item.label}
                        </p>
                      </LabelForm>
                    );
                  })}
                </HorizontalScroll>
              </RadioGroup>
            </div>
            <div className="flex flex-col gap-1">
              <LabelForm className="text-xs font-semibold text-slate-700">Upload Images</LabelForm>

              {!queue[activeIndex] && (
                <GalleryUploader galleryItems={galleryItems} maxImages={MAX_IMAGES} onFilesAdded={handleFilesAdded} />
              )}

              {queue[activeIndex] && (
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-1.5 shadow-inner">
                  <GalleryCropper imageSrc={queue[activeIndex]} onConfirm={handleCropConfirm} onCancel={handleCropCancel} />
                </div>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <GalleryPreview items={galleryItems} maxImages={MAX_IMAGES} onRemove={removeImage} />
            </div>
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
          onClick={handleSaveAll}
          disabled={saveMutation.isPending}
          className="font-regular inline-flex h-full min-h-[34px] w-auto cursor-pointer items-center justify-between gap-3 rounded-md bg-slate-800 pr-3 pl-4 text-xs text-white/90 transition-all hover:bg-slate-900"
        >
          {saveMutation.isPending ? "Updating..." : "Next"}
          <ChevronRight strokeWidth={1.5} size={14} />
        </button>
      </div>
    </div>
  );
}
