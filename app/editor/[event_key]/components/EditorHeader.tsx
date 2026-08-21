"use client";

import { ChevronLeft, X } from "lucide-react";

export default function EditorHeader({ handleCancel, title }: { handleCancel: () => void; title: string }) {

  return (
    <div className="top-0 z-[9] flex h-[60px] min-h-[50px] items-center justify-center gap-3 border-slate-100 md:sticky md:block md:justify-start md:border-t md:border-b bg-amber-300">
      <div className="flex items-center gap-3 px-5 md:p-0">
        <button onClick={handleCancel} className="hidden cursor-pointer rounded-full p-2 transition-colors hover:bg-slate-50 md:block">
          <ChevronLeft className="h-5 w-5 text-slate-600" />
        </button>
        <h2 className="text-lg font-bold text-slate-900 md:tracking-[-0.06em]">{title}</h2>
      </div>
      <button onClick={handleCancel} className="hidden p-2">
        <X className="h-4 w-4 text-slate-400" />
      </button>
    </div>
  );
}
