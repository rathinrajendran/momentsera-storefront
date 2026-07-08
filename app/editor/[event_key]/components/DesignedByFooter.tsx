"use client";

import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePreviewDraft } from "../PreviewDraftContext";

export default function DesignedByFooter({
  settings,
}: {
  settings: {
    site_designed_by?: boolean;
  };
}) {
  const router = useRouter();

  if (!settings.site_designed_by) {
    return null;
  }

  const handleRemoveClick = () => {
    window.parent.postMessage(
      {
        type: "OPEN_REMOVE_FOOTER_DIALOG",
      },
      "*",
    );
  };

  return (
    <div className="footer-copyright relative">
      <button onClick={handleRemoveClick} className="absolute top-2 right-2 cursor-pointer rounded-full p-1 hover:bg-slate-100">
        <X strokeWidth={1} size={18} />
      </button>

      <div className="designed-by flex items-center justify-center px-5 pt-10 pb-20 text-center text-xs tracking-widest text-[var(--accent)] uppercase">
        Love from
        <span className="ml-1 cursor-pointer text-[var(--primary)]" onClick={() => router.push("/")}>
          Evllyne
        </span>
      </div>
    </div>
  );
}
