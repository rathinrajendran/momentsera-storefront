"use client";

import React, { useRef, useState } from "react";
import ReactCrop, { centerCrop, makeAspectCrop, type Crop, type PixelCrop } from "react-image-crop";
import { toast } from "sonner";
import { X, Check } from "lucide-react";

import "react-image-crop/dist/ReactCrop.css";
import { getCroppedImg } from "../../../../utils/imageUtils";
import { Button } from "../../../../components/ui/button";

const ASPECT_RATIO = 4 / 3;

interface GalleryCropperProps {
  imageSrc: string;
  onConfirm: (file: File) => void;
  onCancel: () => void;
}

export default function GalleryCropper({ imageSrc, onConfirm, onCancel }: GalleryCropperProps) {
  const imgRef = useRef<HTMLImageElement | null>(null);

  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    x: 15,
    y: 15,
    width: 70,
    height: 70,
  });

  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);

  async function handleConfirm() {
    if (!imgRef.current || !completedCrop) {
      toast.error("Please crop image");
      return;
    }

    const croppedFile = await getCroppedImg(imgRef.current, completedCrop);
    if (croppedFile) {
      onConfirm(croppedFile);
    }
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 fixed top-0 right-24 bottom-0 left-0 z-9 flex items-center justify-center overflow-hidden rounded-md bg-white/90 shadow-sm md:absolute">
      <div className="w-[100%] max-w-[300px] p-5">
        <div className="overflow-hidden rounded-3xl border border-slate-200 shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-5 py-4">
            <div>
              <p className="text-[11px] font-bold tracking-[0.15em] text-slate-900 uppercase">Crop Image</p>
              <p className="mt-1 text-[11px] text-slate-400">Optimize your gallery preview</p>
            </div>
            <span className="text-[10px] font-bold tracking-wide text-slate-400 uppercase">4:3 Ratio</span>
          </div>

          {/* Crop area */}
          <div className="relative h-[300px] bg-slate-100">
            <ReactCrop crop={crop} onChange={(c) => setCrop(c)} onComplete={(c) => setCompletedCrop(c)} aspect={ASPECT_RATIO} keepSelection>
              <img
                ref={imgRef}
                src={imageSrc}
                alt="Crop"
                style={{ width: "100%", height: "auto", display: "block" }}
                onLoad={(e: React.SyntheticEvent<HTMLImageElement>) => {
                  const { width, height } = e.currentTarget;
                  const initial = centerCrop(makeAspectCrop({ unit: "%", width: 100 }, ASPECT_RATIO, width, height), width, height);
                  setCrop(initial);
                  setCompletedCrop({
                    unit: "px",
                    x: (initial.x / 100) * width,
                    y: (initial.y / 100) * height,
                    width: (initial.width / 100) * width,
                    height: (initial.height / 100) * height,
                  });
                }}
              />
            </ReactCrop>
          </div>

          {/* Actions */}
          <div className="space-y-5 bg-white p-5">
            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" className="text-xs font-medium text-slate-500" onClick={onCancel}>
                <X />
              </Button>

              <Button type="button" onClick={handleConfirm} className="rounded-md bg-slate-900 px-6 text-xs text-white hover:bg-slate-800">
                <Check strokeWidth={1} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
