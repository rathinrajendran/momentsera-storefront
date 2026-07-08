"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { ImagePlus } from "lucide-react";
import { cn } from "../../../../utils/utils";
import type { LocalGalleryItem } from "./GalleryEditor";

type Props = {
  galleryItems: LocalGalleryItem[];
  maxImages: number;
  onFilesAdded: (objectUrls: string[]) => void;
};

export default function GalleryUploader({ galleryItems, maxImages, onFilesAdded }: Props) {
  const onDrop = useCallback(
    (files: File[]) => {
      const images = files.filter((f) => f.type.startsWith("image/"));
      const activeCount = galleryItems.filter((i) => !i._deleted).length;

      if (activeCount + images.length > maxImages) {
        toast.error(`Maximum ${maxImages} images allowed`);
        return;
      }

      onFilesAdded(images.map((f) => URL.createObjectURL(f)));
    },
    [galleryItems, maxImages, onFilesAdded],
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "rounded-md border-1 border-dashed border-slate-200",
        "bg-slate-50/30 transition-all hover:bg-slate-50",
        "cursor-pointer p-5 text-center",
      )}
    >
      <input {...getInputProps()} />

      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm">
        <ImagePlus className="h-5 w-5 text-slate-400" strokeWidth={1} />
      </div>

      <p className="mx-auto max-w-md text-xs leading-relaxed text-slate-500">
        Drag & drop your wedding memories here or click to browse and upload premium images.
      </p>

      <div className="mt-5 text-[11px] text-slate-400">Maximum {maxImages} images allowed</div>
    </div>
  );
}
