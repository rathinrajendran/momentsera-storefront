// utils/imageUtils.ts

import { Area } from "react-easy-crop";
import { PixelCrop } from "react-image-crop";

/* ---------------- TYPES ---------------- */

export type CropOptions = {
  format?: "image/webp" | "image/jpeg" | "image/png";
  quality?: number;          // 0–1
  maxWidth?: number;         // px
};

/* ---------------- MAIN UTILITY ---------------- */

export async function getCroppedImg(
  image: HTMLImageElement, // ✅ already rendered, has real .width/.height
  crop: PixelCrop,
): Promise<File> {
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  canvas.width = Math.round(crop.width * scaleX);
  canvas.height = Math.round(crop.height * scaleY);

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    canvas.width,
    canvas.height,
  );

  return new Promise<File>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) return reject(new Error("Failed to create blob"));
        resolve(new File([blob], "cropped.jpg", { type: "image/jpeg" }));
      },
      "image/jpeg",
      0.95,
    );
  });
}
/* ---------------- HELPERS ---------------- */

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => resolve(img);
    img.onerror = reject;

    img.src = src;
  });
}
