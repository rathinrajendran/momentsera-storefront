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

export async function getCroppedImg(image: HTMLImageElement, crop: PixelCrop, options?: CropOptions): Promise<File> {
  const { format = "image/webp", quality = 0.85, maxWidth } = options ?? {};

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  const cropWidth = crop.width * scaleX;
  const cropHeight = crop.height * scaleY;

  let outputWidth = cropWidth;
  let outputHeight = cropHeight;

  // Resize if maxWidth is provided
  if (maxWidth && cropWidth > maxWidth) {
    const ratio = maxWidth / cropWidth;
    outputWidth = maxWidth;
    outputHeight = cropHeight * ratio;
  }

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(outputWidth);
  canvas.height = Math.round(outputHeight);

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Unable to create canvas context.");
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  ctx.drawImage(image, crop.x * scaleX, crop.y * scaleY, cropWidth, cropHeight, 0, 0, outputWidth, outputHeight);

  return new Promise<File>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Failed to create image."));
          return;
        }

        const extension = format === "image/webp" ? "webp" : format === "image/png" ? "png" : "jpg";

        resolve(
          new File([blob], `cropped.${extension}`, {
            type: format,
          }),
        );
      },
      format,
      quality,
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
