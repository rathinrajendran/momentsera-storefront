"use client";

import { useEffect, useRef, useState } from "react";
import { EditorSection } from "./EditorLayout";
import {
  Calendar,
  CheckCircle,
  ChevronRight,
  Clock,
  Eye,
  EyeOff,
  Heading,
  ImageIcon,
  Images,
  Lock,
  MessageSquare,
  Music,
  Palette,
  Printer,
  Settings,
  Share2,
  Shirt,
  Sparkles,
} from "lucide-react";
import { SectionVisibilityDialog, VisibilityType } from "./SectionVisibilityDialog";
import { usePreviewDraft } from "./PreviewDraftContext";
import { useSaveEventSection } from "../../../hooks/useEvents";

type SectionItem = {
  id: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  visibilityCheck: boolean;
  visibilityLabel?: "Visible" | "Hidden" | "Protected";
  visibilityIcon?: React.ReactNode;
  visibility?: "visible" | "hidden" | "protected";
};

type Props = {
  activeTab: string;
  currentSections: readonly SectionItem[];
  onSelect: (section: EditorSection) => void;
  scrollTop: number;
  onScrollChange: (value: number) => void;
  eventKey: string;
};

export default function EditorOverview({ activeTab, currentSections = [], onSelect, scrollTop, onScrollChange, eventKey }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState<EditorSection | null>(null);
  const [visibilityDialogOpen, setVisibilityDialogOpen] = useState(false);
  const { draft, refreshEvent } = usePreviewDraft();

  const settings = draft?.settings ?? {};
  const eventId = draft?.invite?.id;
  const mutation = useSaveEventSection(eventKey, eventId);

  // ⚡ OPTIMIZED INTERACTION HANDLER: Capture current position right before switching views
  const handleCardSelect = (id: EditorSection) => {
    if (scrollRef.current) {
      onScrollChange(scrollRef.current.scrollTop);
    }
    onSelect(id);
  };

  const handleVisibilityClick = (section: EditorSection) => {
    if (scrollRef.current) {
      onScrollChange(scrollRef.current.scrollTop);
    }
    setActiveSection(section);
    setVisibilityDialogOpen(true);
  };

  async function handleSaveSuccess() {
    await refreshEvent(eventKey);
  }
  const activeSectionData = currentSections.find((section) => section.id === activeSection);
  const currentVisibility = Array.isArray(settings.section_visibility) ? settings.section_visibility : [];
  const getSectionVisibility = (id: string) => currentVisibility.find((item: any) => item.id === id);

  const handleVisibilitySave = (data: { id: string; title: string; visibility: VisibilityType; password?: string; hint?: string }) => {
    const updatedVisibility = [
      ...currentVisibility.filter((item: any) => item.id !== data.id),
      {
        id: data.id,
        visibility: data.visibility,
        ...(data.visibility === "protected" ? { password: data.password ?? "", hint: data.hint ?? "" } : {}),
      },
    ];

    mutation.mutate(
      {
        path: "settings",
        stage: "settings",
        data: { section_visibility: updatedVisibility },
      },
      {
        onSuccess: async () => {
          setVisibilityDialogOpen(false);
          await handleSaveSuccess();
        },
      },
    );
  };

  useEffect(() => {
    if (scrollRef.current && scrollTop > 0) {
      scrollRef.current.scrollTop = scrollTop;
    }
  }, [scrollTop]);

  return (
    <div className="flex h-auto flex-col overflow-x-auto p-5 px-4 md:h-full md:bg-white md:px-6 [&::-webkit-scrollbar]:h-[0px] [&::-webkit-scrollbar]:w-0 [&::-webkit-scrollbar-thumb]:rounded-md [&::-webkit-scrollbar-thumb]:bg-[#c1c1c1] [&::-webkit-scrollbar-track]:rounded-md [&::-webkit-scrollbar-track]:bg-[#78909C]">
      <div className="mb-5 hidden md:block">
        <h2 className="text-lg font-bold tracking-tight text-zinc-900 capitalize">{activeTab}</h2>
        <p className="text-xs leading-relaxed tracking-wide">
          Everything you need to build, customize, and maintain a beautiful digital invitation.
        </p>
      </div>
      <div ref={scrollRef} className="h-auto space-y-1 overflow-y-auto md:space-y-1 md:pb-24">
        {activeTab === "preview" ? (
          <div className="flex h-40 flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 p-6 text-center text-sm text-zinc-400">
            <p>Opening live interactive preview overlay...</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {currentSections.map((section) => (
              <EditorCard
                key={section.id}
                title={section.title}
                desc={section.desc}
                icon={section.icon}
                iconBg={section.iconBg}
                iconColor={section.iconColor}
                visibility={section.visibility}
                visibilityLabel={section.visibilityLabel}
                visibilityIcon={section.visibilityIcon}
                visibilityCheck={section.visibilityCheck}
                onClick={() => handleCardSelect(section.id as EditorSection)}
                onVisibilityClick={() => handleVisibilityClick(section.id as EditorSection)}
              />
            ))}
          </div>
        )}
      </div>
      <SectionVisibilityDialog
        key={activeSection}
        open={visibilityDialogOpen}
        onOpenChange={setVisibilityDialogOpen}
        sectionId={activeSection ?? ""}
        sectionTitle={activeSectionData?.title ?? ""}
        value={getSectionVisibility(activeSection ?? "")?.visibility ?? "visible"}
        password={getSectionVisibility(activeSection ?? "")?.password ?? ""}
        hint={getSectionVisibility(activeSection ?? "")?.hint ?? ""}
        onSave={handleVisibilitySave}
      />
    </div>
  );
}

function EditorCard({
  title,
  desc,
  icon,
  onClick,
  iconBg,
  iconColor,
  visibility,
  visibilityLabel,
  visibilityIcon,
  visibilityCheck,
  onVisibilityClick,
}: {
  title: string;
  desc: string;
  icon: React.ReactNode;
  onClick: () => void;
  iconBg: string;
  iconColor: string;
  visibility?: "visible" | "hidden" | "protected";
  visibilityLabel?: "Visible" | "Hidden" | "Protected";
  visibilityIcon?: React.ReactNode;
  visibilityCheck: boolean;
  onVisibilityClick?: () => void;
}) {
    const showVisibility = visibilityCheck;

    const fallbackVisibilityIcon =
      visibility === "hidden" ? (
        <EyeOff size={14} strokeWidth={1.8} />
      ) : visibility === "protected" ? (
        <Lock size={14} strokeWidth={1.8} />
      ) : (
        <Eye size={14} strokeWidth={1.8} />
      );

    const visibilityButtonClass =
      visibility === "hidden"
        ? "bg-slate-100 text-slate-500 hover:bg-slate-200"
        : visibility === "protected"
          ? "bg-amber-50 text-amber-600 hover:bg-amber-100"
          : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100";
  return (
    <div
      onClick={onClick}
      className="cursor-pointer items-center justify-between rounded-lg border border-gray-100 bg-white p-2 transition-all duration-200 hover:border-[#84a59d]/40 md:rounded-xl md:p-3"
    >
      <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-4">
        <div
          className={`${iconBg} ${iconColor} flex h-7 w-7 shrink-0 items-center justify-center rounded-sm border border-zinc-100/50 text-zinc-500 sm:h-10 sm:w-10 sm:rounded-lg`}
        >
          {icon}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[0.8rem] font-semibold text-zinc-800 sm:text-[0.9rem]">{title}</h3>
          <p className="truncate text-[0.7rem] text-zinc-400">{desc}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {showVisibility && (
          <button
            type="button"
            title={visibilityLabel ? `Visibility: ${visibilityLabel}` : "Visibility"}
            aria-label={visibilityLabel ? `Visibility: ${visibilityLabel}` : "Visibility"}
            onClick={(e) => {
              e.stopPropagation();
              onVisibilityClick?.();
            }}
            className={`hidden h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full transition sm:flex ${visibilityButtonClass}`}
          >
            {visibilityIcon ?? fallbackVisibilityIcon}
          </button>
        )}
        <ChevronRight size={16} className="shrink-0 text-zinc-300" />
      </div>
    </div>
  );
}
