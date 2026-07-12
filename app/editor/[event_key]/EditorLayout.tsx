"use client";

import { useEffect, useState } from "react";
import { Header } from "../../(marketing)/components/header/Header";
import PreviewPanel from "./PreviewPanel";
import EditorPanel from "./EditorPanel";
import { HomeWrapper } from "../../(marketing)/Home/HomeStyles";
import bg from "@/assets/images/placeholder/bg.png";
import {
  Megaphone,
  Calendar,
  Compass,
  Settings,
  PlayCircle,
  BookOpen,
  Image as ImageIcon,
  MessageSquare,
  Clock,
  Shirt,
  Palette,
  Sparkles,
  Music,
  CheckCircle,
  Share2,
  Lock,
  Printer,
  Heading,
} from "lucide-react";

export type EditorSection =
  | "overview"
  | "announcement"
  | "schedule"
  | "timeline"
  | "gallery"
  | "dressCode"
  | "wishes"
  | "rsvp"
  | "music"
  | "privacy"
  | "shape"
  | "color"
  | "font"
  | "background"
  | "sharing"
  | "motion"
  | "print"
  | "settings";

export type DeviceType = "desktop" | "mobile";

export type EditorLayoutProps = {
  eventKey: string;
  eventId: number;
};

export const sectionTabMapping = {
  content: [
    {
      id: "announcement",
      title: "Announcement",
      desc: "Names & greeting",
      icon: <Heading className="h-4 w-4" strokeWidth={1.5} />,
      visibilityCheck: false,
    },
    {
      id: "gallery",
      title: "Gallery",
      desc: "Photos & videos",
      icon: <ImageIcon className="h-4 w-4" strokeWidth={1.5} />,
      visibilityCheck: true,
    },
    {
      id: "wishes",
      title: "Wishes",
      desc: "Guest messages & congratulations",
      icon: <MessageSquare className="h-4 w-4" strokeWidth={1.5} />,
      visibilityCheck: true,
    },
    {
      id: "music",
      title: "Music",
      desc: "Background audio track",
      icon: <Music className="h-4 w-4" strokeWidth={1.5} />,
      visibilityCheck: true,
    },
  ],
  event: [
    {
      id: "schedule",
      title: "Schedule",
      desc: "Events, venues & timings",
      icon: <Calendar className="h-4 w-4" strokeWidth={1.5} />,
      visibilityCheck: false,
    },
    {
      id: "timeline",
      title: "Timeline",
      desc: "Sequential itinerary breakdown",
      icon: <Clock className="h-4 w-4" strokeWidth={1.5} />,
      visibilityCheck: false,
    },
    {
      id: "dressCode",
      title: "Dress Code",
      desc: "Attire rules & color palette",
      icon: <Shirt className="h-4 w-4" strokeWidth={1.5} />,
      visibilityCheck: false,
    },
    {
      id: "rsvp",
      title: "RSVP",
      desc: "Attendance tracking",
      icon: <CheckCircle className="h-4 w-4" strokeWidth={1.5} />,
      visibilityCheck: true,
    },
  ],
  design: [
    {
      id: "background",
      title: "Background",
      desc: "Colors, fonts & styling",
      icon: <Palette className="h-4 w-4" strokeWidth={1.5} />,
      visibilityCheck: false,
    },
    {
      id: "color",
      title: "Color",
      desc: "Colors, fonts & styling",
      icon: <Palette className="h-4 w-4" strokeWidth={1.5} />,
      visibilityCheck: false,
    },
    {
      id: "font",
      title: "Font",
      desc: "Colors, fonts & styling",
      icon: <Palette className="h-4 w-4" strokeWidth={1.5} />,
      visibilityCheck: false,
    },
    {
      id: "shape",
      title: "Shape",
      desc: "Colors, fonts & styling",
      icon: <Palette className="h-4 w-4" strokeWidth={1.5} />,
      visibilityCheck: false,
    },
    {
      id: "motion",
      title: "Motion",
      desc: "Animations & transitions",
      icon: <Sparkles className="h-4 w-4" strokeWidth={1.5} />,
      visibilityCheck: false,
    },
  ],
  settings: [
    {
      id: "sharing",
      title: "Sharing",
      desc: "Invite link & QR code",
      icon: <Share2 className="h-4 w-4" strokeWidth={1.5} />,
      visibilityCheck: false,
    },
    {
      id: "privacy",
      title: "Privacy",
      desc: "Password & visibility controls",
      icon: <Lock className="h-4 w-4" strokeWidth={1.5} />,
      visibilityCheck: false,
    },
    {
      id: "print",
      title: "Print",
      desc: "Printable invitation layout",
      icon: <Printer className="h-4 w-4" strokeWidth={1.5} />,
      visibilityCheck: false,
    },
    {
      id: "settings",
      title: "Settings",
      desc: "Preferences, locale & analytics",
      icon: <Settings className="h-4 w-4" strokeWidth={1.5} />,
      visibilityCheck: false,
    },
  ],
} as const;

const sideMenuItems = [
  { id: "content", label: "Content", icon: <Megaphone className="h-5 w-5" /> },
  { id: "event", label: "Event", icon: <Calendar className="h-5 w-5" /> },
  { id: "design", label: "Design", icon: <Compass className="h-5 w-5" /> },
  { id: "settings", label: "Settings", icon: <Settings className="h-5 w-5" /> },
  { id: "preview", label: "Preview", icon: <PlayCircle className="h-5 w-5" /> },
];

export default function EditorLayout({ eventKey, eventId }: EditorLayoutProps) {
  const [activeSection, setActiveSection] = useState<EditorSection>("overview");
  const [activeTab, setActiveTab] = useState<keyof typeof sectionTabMapping | "preview">("content");
  const [overviewScrollTop, setOverviewScrollTop] = useState(0);
  const [device, setDevice] = useState<DeviceType>("mobile");
  const [isMobile, setIsMobile] = useState(false);
  const FALLBACK_IMAGE = bg.src;

  useEffect(() => {
    const update = () => {
      setIsMobile(window.innerWidth < 768);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const splitScreen = activeSection !== "overview" && isMobile;
  const currentSections = activeTab !== "preview" ? sectionTabMapping[activeTab] : [];

  return (
    <HomeWrapper
      className="relative overflow-hidden"
      style={{
        backgroundImage: `url(${FALLBACK_IMAGE})`,
        backgroundPosition: "bottom center",
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
      }}
    >
      <Header className={`${splitScreen ? "hidden" : ""}`} />
      <div className="max-w-8xl mx-auto bg-[#f3f4f6]">
        <div
          className={`${splitScreen ? "mt-[0px] h-[100dvh]" : "mt-[45px] h-[calc(100dvh-45px)] md:mt-[64px] md:h-[calc(100dvh-65px)]"} block overflow-hidden md:flex`}
        >
          {/* LEFT – LIVE VIEW PREVIEW */}
          <div
            className={`${splitScreen ? "h-[60dvh]" : "h-[calc(100dvh-115px)] md:h-[calc(100dvh-65px)]"} overflow-hidden md:w-[calc(100%-400px)]`}
          >
            <PreviewPanel device={device} onDeviceChange={setDevice} splitScreen={splitScreen} eventKey={eventKey} eventId={eventId} />
          </div>

          {/* RIGHT Persistent Workspace Panel Wrapper Container */}
          <div
            className={`${splitScreen ? "h-[40dvh]" : "h-[160px]"} flex-column fixed right-0 bottom-0 left-0 z-[99] flex flex-col overflow-hidden border-t border-zinc-200 bg-white md:relative md:w-[400px] md:flex-row md:border-t-0 md:border-l`}
          >
            {/* Config Form Action Switcher Layer */}
            <div className="h-auto w-full overflow-y-auto bg-white md:h-[calc(100%-64px)] md:flex-1">
              <EditorPanel
                activeSection={activeSection}
                onSectionChange={setActiveSection}
                eventKey={eventKey}
                overviewScrollTop={overviewScrollTop}
                onOverviewScrollChange={setOverviewScrollTop}
                activeTab={activeTab}
                currentSections={currentSections}
              />
            </div>
            {/* Global Fixed Side Nav Menu Layer */}
            <div
              className={`${splitScreen ? "hidden" : "flex"} z-10 h-16 w-full shrink-0 flex-row items-center justify-around border-t border-zinc-100 bg-[#fafafa] px-2 py-1 text-zinc-400 md:h-full md:w-[85px] md:flex-col md:justify-start md:border-t-0 md:border-r md:py-6`}
            >
              <nav className="flex w-full flex-row items-center justify-around gap-1 md:flex-col md:gap-4">
                {sideMenuItems.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id as any);
                        setActiveSection("overview");
                      }}
                      className={`flex w-12 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg py-1.5 text-[10px] font-medium uppercase transition-all md:w-full md:text-[10px] ${
                        isActive ? "bg-[var(--accent-primary)] text-white shadow-inner" : "text-zinc-400"
                      }`}
                    >
                      {item.icon}
                      <span className="max-w-full truncate">{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </HomeWrapper>
  );
}
