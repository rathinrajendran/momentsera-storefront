// utils/canvasImage.ts

export type CanvasDrawOptions = {
  objectFit?: "cover" | "contain";
  quality?: number; // for future (export), not needed now
};

export async function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();

    // Important: allows loading images from another domain
    // (only works if server sends correct CORS headers)
    img.crossOrigin = "anonymous";

    img.onload = () => resolve(img);
    img.onerror = reject;

    img.src = src;
  });
}

export function drawImageToCanvas(
  canvas: HTMLCanvasElement,
  img: HTMLImageElement,
  opts: CanvasDrawOptions = {}
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const objectFit = opts.objectFit ?? "cover";

  const cw = canvas.width;
  const ch = canvas.height;

  ctx.clearRect(0, 0, cw, ch);

  const iw = img.naturalWidth;
  const ih = img.naturalHeight;

  if (!iw || !ih) return;

  // contain/cover calculations
  const canvasRatio = cw / ch;
  const imgRatio = iw / ih;

  let sx = 0;
  let sy = 0;
  let sw = iw;
  let sh = ih;

  if (objectFit === "cover") {
    if (imgRatio > canvasRatio) {
      // image too wide
      sh = ih;
      sw = ih * canvasRatio;
      sx = (iw - sw) / 2;
    } else {
      // image too tall
      sw = iw;
      sh = iw / canvasRatio;
      sy = (ih - sh) / 2;
    }
  } else {
    // contain: draw with empty space
    ctx.fillStyle = "transparent";
    ctx.clearRect(0, 0, cw, ch);

    const scale = Math.min(cw / iw, ch / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    const dx = (cw - dw) / 2;
    const dy = (ch - dh) / 2;

    ctx.drawImage(img, 0, 0, iw, ih, dx, dy, dw, dh);
    return;
  }

  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch);
}