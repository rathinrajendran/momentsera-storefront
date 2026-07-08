"use client";

import { Trash2 } from "lucide-react";
import { resolveMediaUrl } from "../../../../utils/media";
import { LabelForm } from "../../../../components/ui/LabelForm";
import type { LocalGalleryItem } from "./GalleryEditor";

type Props = {
  items: LocalGalleryItem[];
  maxImages: number;
  onRemove: (id: string) => void;
};

export default function GalleryPreview({ items, maxImages, onRemove }: Props) {
  const visible = items.filter((i) => !i._deleted);

  return (
    <div className="grid gap-1">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <LabelForm>Gallery Preview</LabelForm>
        <LabelForm>
          {visible.length} / {maxImages}
        </LabelForm>
      </div>

      {/* Empty state */}
      {visible.length === 0 && (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50/30 p-10 text-center">
          <p className="text-sm text-slate-500">No gallery images uploaded yet.</p>
        </div>
      )}

      {/* Thumbnail grid */}
      <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
        {visible.map((item, index) => (
          <div key={item.temp_id ?? item.file_url ?? index} className="group relative aspect-[4/3] overflow-hidden rounded-md bg-slate-100">
            <img
              src={item.temp_url ? item.temp_url : resolveMediaUrl(item.file_url)}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              alt=""
            />

            <div className="absolute inset-0 bg-black/30 opacity-0 transition-opacity group-hover:opacity-100" />

            <button
              type="button"
              onClick={() => onRemove(item.temp_id ?? item.file_url ?? "")}
              className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-red-500 opacity-0 backdrop-blur-sm transition-all group-hover:opacity-100 hover:bg-white"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
