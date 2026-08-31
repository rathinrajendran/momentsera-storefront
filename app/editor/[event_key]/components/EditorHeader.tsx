"use client";

import { X } from "lucide-react";

export default function EditorHeader({ handleBack, title }: { handleBack: () => void; title: string }) {
  return (
    <div className="top-0 z-[9] hidden h-[50px] min-h-[50px] items-center justify-center gap-3 border-slate-100 bg-white pl-6 pr-2.5 md:sticky md:flex md:justify-start md:border-t md:border-b">
      <div className="flex h-full items-center justify-between w-full gap-3 px-5 md:p-0">
        <h2 className="text-[0.9rem] font-medium text-slate-900">{title}</h2>
        <button onClick={handleBack} className="p-2 cursor-pointer hover:scale-115">
          <X className="h-4 w-4 text-slate-400" />
        </button>
      </div>
    </div>
  );
}
