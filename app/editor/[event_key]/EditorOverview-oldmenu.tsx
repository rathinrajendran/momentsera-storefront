"use client";

import { useEffect, useRef, useState } from "react";
import { EditorSection } from "./EditorLayout";
import {
  Heading,
  Calendar,
  Image as ImageIcon,
  Heart,
  Palette,
  Settings,
  Sparkles,
  Printer,
  Lock,
  Eye,
  EyeOff,
  Music,
  Share2,
  Clock,
  Shirt,
  MessageSquare,
  CheckCircle,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { PublishButton } from "./components/publish/PublishButton";
import { SectionVisibilityDialog } from "./SectionVisibilityDialog";
import { usePreviewDraft } from "./PreviewDraftContext";
import { useSaveEventSection } from "../../../hooks/useEvents";

type VisibilityType = "visible" | "hidden" | "protected";

type Props = {
  onSelect: (section: EditorSection) => void;
  eventKey: string;
  scrollTop: number;
  onScrollChange: (value: number) => void;
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
    id: "motion",
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

export default function EditorOverview({ onSelect, eventKey, scrollTop, onScrollChange }: Props) {
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

  // Restores the previous position perfectly once when the component mounts
  useEffect(() => {
    if (scrollRef.current && scrollTop > 0) {
      scrollRef.current.scrollTop = scrollTop;
    }
  }, [scrollTop]);

  return (
    <div className="relative flex h-full flex-col md:pt-5">
      <div className="mb-4 hidden px-4 md:block">
        <div className="mb-1 flex items-center gap-2">
          <Sparkles className="h-3 w-3 text-[#84a59d]" />
          <span className="text-[10px] font-bold tracking-[0.3em] text-black/40 uppercase">Studio Workshop</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-black">Edit Invitation</h2>
      </div>

      <div className="flex-1 overflow-hidden">
        <div
          ref={scrollRef}
          /* ⚡ REMOVED: onScroll handler removed to allow 100% native smooth browser scrolling */
          className="h-[calc(100dvh-60px)] overflow-y-auto px-4 py-3 pb-24 md:h-[calc(100dvh-150px)] md:pb-18 [&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-300"
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-1">
            {sections.map(({ id, title, desc, icon, visibilityCheck }) => (
              <EditorCard
                key={id}
                title={title}
                desc={desc}
                icon={icon}
                visibilityCheck={visibilityCheck}
                onClick={() => handleCardSelect(id as EditorSection)}
                visibility={getSectionVisibility(id)?.visibility ?? "visible"}
                onVisibilityClick={() => handleVisibilityClick(id as EditorSection)}
              />
            ))}
          </div>
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

      <div className="absolute right-0 bottom-0 left-0 hidden bg-white px-4 py-2 md:block">
        <PublishButton />
      </div>
    </div>
  );
}

// (EditorCard component remains unchanged)
function EditorCard({
  title,
  desc,
  icon,
  onClick,
  visibility,
  onVisibilityClick,
  visibilityCheck,
}: {
  title: string;
  desc: string;
  icon: React.ReactNode;
  onClick: () => void;
  visibility?: "visible" | "hidden" | "protected";
  onVisibilityClick?: () => void;
  visibilityCheck: boolean;
}) {
  const status = {
    visible: {
      icon: <Eye size={14} strokeWidth={1.8} />,
      className: "bg-emerald-50 text-emerald-600 hover:bg-emerald-100",
    },
    hidden: {
      icon: <EyeOff size={14} strokeWidth={1.8} />,
      className: "bg-rose-50 text-rose-600 hover:bg-rose-100",
    },
    protected: {
      icon: <Lock size={14} strokeWidth={1.8} />,
      className: "bg-amber-50 text-amber-600 hover:bg-amber-100",
    },
  };

  const current = status[visibility ?? "visible"];

  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group relative w-full min-w-0 min-w-40 cursor-pointer overflow-hidden rounded-xl border border-zinc-200 bg-white p-4 transition-all duration-300 hover:border-[#84a59d]/40 hover:shadow-lg"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#84a59d] via-[#b8d8d8] to-[#84a59d]" />

      <div className="relative flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#84a59d]/10 text-[#84a59d] transition-all duration-300 group-hover:scale-105">
            {icon}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="truncate text-[15px] font-semibold text-zinc-900 transition-colors group-hover:text-[#84a59d]">{title}</h3>

            <p className="mt-1 hidden truncate text-xs text-zinc-500 md:block">{desc}</p>
          </div>
        </div>

        {visibilityCheck && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onVisibilityClick?.();
            }}
            className={`hidden h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all md:flex ${current.className}`}
          >
            {current.icon}
          </button>
        )}
      </div>

      <div className="mt-4 hidden items-center justify-between border-t border-zinc-100 pt-3 md:flex">
        <span className="text-[11px] font-semibold tracking-[0.25em] text-zinc-400 uppercase">Edit Section</span>

        <div className="flex h-8 items-center justify-center rounded-md bg-zinc-100 px-3 text-xs text-zinc-500 transition-all duration-300 group-hover:bg-[#84a59d] group-hover:text-white">
          Customize
          <ChevronRight size={14} className="ml-1" />
        </div>
      </div>
    </motion.div>
  );
}
