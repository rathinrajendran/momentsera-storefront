"use client";

import { useEffect, useRef, useState } from "react";
import { EditorSection } from "./EditorLayout";
import { Calendar, CheckCircle, ChevronRight, Clock, Eye, Heading, ImageIcon, Lock, MessageSquare, Music, Palette, Printer, Settings, Share2, Shirt, Sparkles } from "lucide-react";
import { SectionVisibilityDialog, VisibilityType } from "./SectionVisibilityDialog";
import { usePreviewDraft } from "./PreviewDraftContext";
import { useSaveEventSection } from "../../../hooks/useEvents";

type SectionItem = {
  id: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
  visibilityCheck: boolean;
};

type Props = {
  activeTab: string;
  currentSections: readonly SectionItem[];
  onSelect: (section: EditorSection) => void;
  scrollTop: number;
  onScrollChange: (value: number) => void;
  eventKey: string;
};
const sections = [
  {
    id: "announcement",
    title: "Announcement",
    desc: "Names & greeting",
    icon: <Heading className="h-4 w-4" strokeWidth={1} />,
    visibilityCheck: false,
  },
  {
    id: "schedule",
    title: "Schedule",
    desc: "Events, venues & timings",
    icon: <Calendar className="h-4 w-4" strokeWidth={1} />,
    visibilityCheck: false,
  },
  {
    id: "timeline",
    title: "Timeline",
    desc: "Sequential itinerary breakdown",
    icon: <Clock className="h-4 w-4" strokeWidth={1} />,
    visibilityCheck: false,
  },
  {
    id: "dressCode",
    title: "Dress Code",
    desc: "Attire rules & color palette",
    icon: <Shirt className="h-4 w-4" strokeWidth={1} />,
    visibilityCheck: false,
  },
  {
    id: "gallery",
    title: "Gallery",
    desc: "Photos & videos",
    icon: <ImageIcon className="h-4 w-4" strokeWidth={1} />,
    visibilityCheck: true,
  },
  {
    id: "music",
    title: "Music",
    desc: "Background audio track",
    icon: <Music className="h-4 w-4" strokeWidth={1} />,
    visibilityCheck: true,
  },
  {
    id: "wishes",
    title: "Wishes",
    desc: "Guest messages & congratulations",
    icon: <MessageSquare className="h-4 w-4" strokeWidth={1} />,
    visibilityCheck: true,
  },
  {
    id: "rsvp",
    title: "RSVP",
    desc: "Attendance tracking",
    icon: <CheckCircle className="h-4 w-4" strokeWidth={1} />,
    visibilityCheck: true,
  },
  {
    id: "theme",
    title: "Theme",
    desc: "Colors, fonts & styling",
    icon: <Palette className="h-4 w-4" strokeWidth={1} />,
    visibilityCheck: false,
  },
  {
    id: "motionSection",
    title: "Motion",
    desc: "Animations & transitions",
    icon: <Sparkles className="h-4 w-4" strokeWidth={1} />,
    visibilityCheck: false,
  },
  {
    id: "sharing",
    title: "Sharing",
    desc: "Invite link & QR code",
    icon: <Share2 className="h-4 w-4" strokeWidth={1} />,
    visibilityCheck: false,
  },
  {
    id: "privacy",
    title: "Privacy",
    desc: "Password & visibility controls",
    icon: <Lock className="h-4 w-4" strokeWidth={1} />,
    visibilityCheck: false,
  },
  {
    id: "print",
    title: "Print",
    desc: "Printable invitation layout",
    icon: <Printer className="h-4 w-4" strokeWidth={1} />,
    visibilityCheck: false,
  },
  {
    id: "settings",
    title: "Settings",
    desc: "Preferences, locale & analytics",
    icon: <Settings className="h-4 w-4" strokeWidth={1} />,
    visibilityCheck: false,
  },
] as const;


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

  const activeSectionData = sections.find((section) => section.id === activeSection);
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
    <div className="flex h-auto flex-col overflow-hidden px-4 md:h-full md:bg-white md:px-6 md:pt-5">
      <div className="mb-5 hidden md:block">
        <h2 className="text-lg font-bold tracking-tight text-zinc-900 capitalize">{activeTab}</h2>
        <p className="text-xs tracking-wide">Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione, voluptas iure!</p>
      </div>
      <div className="flex-1 overflow-hidden">
        <div ref={scrollRef} className="h-auto space-y-1 overflow-y-auto md:space-y-1 md:pb-24">
          {activeTab === "preview" ? (
            <div className="flex h-40 flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 p-6 text-center text-sm text-zinc-400">
              <p>Opening live interactive preview overlay...</p>
            </div>
          ) : (
            <div className="flex gap-2 flex-col">
              {currentSections.map(({ id, title, desc, icon, visibilityCheck }) => (
                <EditorCard
                  key={id}
                  title={title}
                  desc={desc}
                  icon={icon}
                  visibilityCheck={visibilityCheck}
                  onClick={() => handleCardSelect(id as EditorSection)}
                  onVisibilityClick={() => handleVisibilityClick(id as EditorSection)}
                />
              ))}
            </div>
          )}
        </div>
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
      ;
    </div>
  );
}

function EditorCard({
  title,
  desc,
  icon,
  onClick,
  visibilityCheck,
  onVisibilityClick,
}: {
  title: string;
  desc: string;
  icon: React.ReactNode;
  onClick: () => void;
  visibilityCheck: boolean;
  onVisibilityClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-[#84a59d]/40 hover:shadow-sm md:rounded-xl md:p-3"
    >
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-zinc-100/50 bg-zinc-50 text-zinc-500">
          {icon}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[0.9rem] font-semibold text-zinc-800">{title}</h3>

          <p className="truncate text-[0.7rem] text-zinc-400">{desc}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {visibilityCheck && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onVisibilityClick?.();
            }}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 transition hover:bg-emerald-100"
          >
            <Eye size={14} strokeWidth={1.8} />
          </button>
        )}

        <ChevronRight size={16} className="shrink-0 text-zinc-300" />
      </div>
    </div>
  );
}
