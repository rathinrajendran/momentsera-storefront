import FaceMatch from "./FaceMatch";
import { fetchEventByKey } from "../../../lib/api";
import { notFound } from "next/navigation";

type GalleryItem = {
  file_url?: string;
  media_type?: string;
};

function extractGalleryImages(data: any): string[] {
  // possible gallery sources
  const candidates = [
    data?.gallery,
    data?.gallery?.images,
    data?.gallery?.items,
    data?.gallery?.media,
    data?.event?.gallery,
    data?.event?.gallery?.images,
    data?.event?.gallery?.items,
  ];

  let galleryArray: any[] = [];

  for (const c of candidates) {
    if (Array.isArray(c)) {
      galleryArray = c;
      break;
    }
  }

  // if gallery is JSON string
  if (!galleryArray.length && typeof data?.gallery === "string") {
    try {
      const parsed = JSON.parse(data.gallery);
      if (Array.isArray(parsed)) galleryArray = parsed;
    } catch {}
  }

  // Convert to url list
  const urls = galleryArray
    .filter((g: GalleryItem) => {
      if (!g) return false;
      if (!g.file_url) return false;
      if (g.media_type && g.media_type !== "image") return false;
      return true;
    })
    .map((g: GalleryItem) => g.file_url as string);

  // Remove duplicates
  return Array.from(new Set(urls));
}

export default async function FaceMatchPage({ params }: { params: Promise<{ event_key: string }> }) {
  const { event_key } = await params;

  const data = await fetchEventByKey(event_key);
  if (!data) notFound();

  const galleryImages = extractGalleryImages(data);

  // Debug (check terminal)
  console.log("EVENT KEY:", event_key);
  console.log("GALLERY IMAGES COUNT:", galleryImages.length);
  console.log("FIRST 3:", galleryImages.slice(0, 3));

  return <FaceMatch eventKey={event_key} galleryImages={galleryImages} />;
}
