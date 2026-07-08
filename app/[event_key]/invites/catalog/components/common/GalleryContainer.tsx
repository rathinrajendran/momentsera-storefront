"use client";

import CollageMasonry from "../../../../../../components/ui/CollageMasonry";
import CoverflowCarousel from "../../../../../../components/ui/CoverflowCarousel";
import GridGallery from "../../../../../../components/ui/GridGallery";
import EmblaThumbGallery from "../../../../../../components/ui/ThumbGallery";

interface GalleryContainerProps {
  layout: string;
  urls: string[];
  fallback: string;
}

export default function GalleryContainer({ layout, urls, fallback }: GalleryContainerProps) {
  switch (layout) {
    case "grid":
      return <GridGallery urls={urls} fallback={fallback} />;

    case "masonry":
      return <CollageMasonry urls={urls.map((u) => u || fallback)} />;

    case "carousel":
      return <CoverflowCarousel urls={urls} fallback={fallback} />;

    case "thumbs":
    case "thumbnail":
      return <EmblaThumbGallery urls={urls} fallback={fallback} />;

    default:
      return <GridGallery urls={urls} fallback={fallback} />;
  }
}
