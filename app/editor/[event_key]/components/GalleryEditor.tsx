"use client";

import { useState } from "react";
import { toast } from "sonner";
import { LayoutGrid, LayoutPanelLeft, GalleryHorizontal, Tally2 } from "lucide-react";

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

export type LocalGalleryItem = GalleryItem & {
  _deleted?: boolean;
  temp_id?: string;
  temp_url?: string;
};

type GalleryLayout = "grid" | "masonry" | "carousel" | "thumbnail";

export default function GalleryEditor({ onBack, eventKey }: { onBack: () => void; eventKey: string }) {
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

    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/gallery/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
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
      <EditorHeader title="Gallery" handleCancel={handleCancel} />

      <div className="flex flex-1 flex-col justify-between space-y-6 p-5 pb-0 md:min-h-[calc(100dvh-115px)] md:rounded-none [&::-webkit-scrollbar]:h-0 [&::-webkit-scrollbar]:w-[2px] [&::-webkit-scrollbar-thumb]:rounded-[10px] [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-track]:rounded-[10px] [&::-webkit-scrollbar-track]:bg-slate-100">
        <section className="space-y-6 [&>*:last-child]:mb-6">
          {/* Layout Picker Container */}
          <div className="space-y-2">
            <LabelForm className="text-xs font-semibold text-slate-700">Gallery Layout</LabelForm>
            <RadioGroup value={currentLayout} onValueChange={(value) => handleLayoutChange(value as GalleryLayout)}>
              <HorizontalScroll className="pb-1">
                {(["grid", "masonry", "carousel", "thumbnail"] as GalleryLayout[]).map((layout) => {
                  const active = currentLayout === layout;
                  return (
                    <LabelForm
                      key={layout}
                      className={cn(
                        "group flex h-[68px] min-w-[96px] shrink-0 cursor-pointer flex-col justify-between rounded-xl border p-3 capitalize transition-all duration-300 md:h-[76px] md:min-w-[104px]",
                        active
                          ? "border-slate-900 bg-slate-900 text-white shadow-md shadow-slate-900/10"
                          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50/50 hover:text-slate-900",
                      )}
                    >
                      <RadioGroupItem value={layout} id={layout} className="hidden" />

                      <div className="flex items-center text-sm">
                        {layout === "grid" && (
                          <LayoutGrid
                            className={cn("h-4 w-4", active ? "text-white" : "text-slate-400 group-hover:text-slate-600")}
                            strokeWidth={1.5}
                          />
                        )}
                        {layout === "masonry" && (
                          <LayoutPanelLeft
                            className={cn("h-4 w-4", active ? "text-white" : "text-slate-400 group-hover:text-slate-600")}
                            strokeWidth={1.5}
                          />
                        )}
                        {layout === "carousel" && (
                          <GalleryHorizontal
                            className={cn("h-4 w-4", active ? "text-white" : "text-slate-400 group-hover:text-slate-600")}
                            strokeWidth={1.5}
                          />
                        )}
                        {layout === "thumbnail" && (
                          <div className="flex h-4 w-4 items-center justify-center">
                            <Tally2
                              className={cn("h-4 w-4 rotate-90", active ? "text-white" : "text-slate-400 group-hover:text-slate-600")}
                              strokeWidth={1.5}
                            />
                          </div>
                        )}
                      </div>

                      <p className="text-[11px] font-semibold tracking-wide">{layout}</p>
                    </LabelForm>
                  );
                })}
              </HorizontalScroll>
            </RadioGroup>
          </div>

          {/* Upload + Cropper Section Workspace */}
          <div className="space-y-2">
            <LabelForm className="text-xs font-semibold text-slate-700">Upload Images</LabelForm>

            {!queue[activeIndex] && <GalleryUploader galleryItems={galleryItems} maxImages={MAX_IMAGES} onFilesAdded={handleFilesAdded} />}

            {queue[activeIndex] && (
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-1.5 shadow-inner">
                <GalleryCropper imageSrc={queue[activeIndex]} onConfirm={handleCropConfirm} onCancel={handleCropCancel} />
              </div>
            )}
          </div>

          {/* Active Assets Preview Grid */}
          <div className="pt-1">
            <GalleryPreview items={galleryItems} maxImages={MAX_IMAGES} onRemove={removeImage} />
          </div>
        </section>

        <GalleryFooter isPending={saveMutation.isPending} onCancel={handleCancel} onSave={handleSaveAll} />
      </div>
    </div>
  );
}
