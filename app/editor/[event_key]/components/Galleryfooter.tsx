"use client";

import { X, Save } from "lucide-react";
import { Button } from "../../../../components/ui/button";

/**
 * GalleryFooter
 *
 * Sticky save / cancel bar at the bottom of the editor.
 *
 */
type Props = {
isPending: boolean,
 onCancel: () => void,
 onSave:() => void
};
 
export default function GalleryFooter({ isPending, onCancel, onSave }: Props) {
  return (
    <div className="sticky bottom-0 z-[99] -m-5 flex h-[60px] items-center justify-end gap-3 border-slate-100 bg-white/90 px-5 md:border-t md:backdrop-blur-md">
      <Button
        type="button"
        variant="ghost"
        onClick={onCancel}
        className="text-xs font-semibold text-slate-400 transition-colors hover:text-slate-900"
      >
        <X strokeWidth={1} size={14} />
        <span>Cancel</span>
      </Button>

      <Button
        type="submit"
        onClick={onSave}
        disabled={isPending}
        className="h-8 rounded-md bg-slate-900 px-10 py-2 text-xs text-white shadow-slate-200 transition-all hover:bg-slate-800 active:scale-95 disabled:opacity-50"
      >
        <Save strokeWidth={1} />
        {isPending ? <span className="font-regular">Updating...</span> : <span className="font-regular">Save</span>}
      </Button>
    </div>
  );
}
