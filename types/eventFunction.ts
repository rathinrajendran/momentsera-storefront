export type EventFunction = {
  id: number;
  event_id: number;
  function_key: "wedding" | "ceremony" | "reception";
  start_datetime: string;
  end_datetime: string | null;
  location: string | null;
  location_map: string | null;
  display_order: number;
};

export type GalleryItem = {
  id: number;
  event_id: number;
  file_url: string;
  media_type: "image" | "video";
  display_order: number;
  created_at: string;
};

export type DraftGalleryItem = {
  temp_id: string;                // always present
  temp_url?: string;              // blob preview (before save)
  file_url?: string;              // server path
  media_type: "image";
  _deleted?: boolean;             // soft delete flag
};
 