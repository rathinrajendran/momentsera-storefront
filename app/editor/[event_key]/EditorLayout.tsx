"use client";

import { useCallback, useEffect, useState } from "react";
import { Header } from "../../(marketing)/components/header/Header";
import PreviewPanel from "./PreviewPanel";
import EditorPanel from "./EditorPanel";
import { HomeWrapper } from "../../(marketing)/Home/HomeStyles";
import bg from "@/assets/images/placeholder/bg.png";
import { motion } from "framer-motion";
import {
  Megaphone,
  Calendar,
  Compass,
  Settings,
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
  ChevronLeftIcon,
} from "lucide-react";
import { PreviewToolbar } from "./PreviewToolbar";
import { useRouter } from "next/navigation";
import { useUpdateEventKey } from "../../../hooks/useEvents";
import MobileMenu from "./MobileMenu";
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
  | "motionSection"
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
      icon: <Heading className="h-4 w-4" strokeWidth={1} />,
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
      id: "wishes",
      title: "Wishes",
      desc: "Guest messages & congratulations",
      icon: <MessageSquare className="h-4 w-4" strokeWidth={1} />,
      visibilityCheck: true,
    },
    {
      id: "music",
      title: "Music",
      desc: "Background audio track",
      icon: <Music className="h-4 w-4" strokeWidth={1} />,
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
  // { id: "preview", label: "Preview", icon: <PlayCircle className="h-5 w-5" /> },
];
const ToolsMenuItems = [
  { id: "viewInvite", label: "View Invite", icon: <Megaphone className="h-5 w-5" /> },
  { id: "event", label: "Event", icon: <Calendar className="h-5 w-5" /> },
  { id: "shareInvite", label: "Share Invite", icon: <Compass className="h-5 w-5" /> },
  { id: "inviteLink", label: "Invite Link", icon: <Settings className="h-5 w-5" /> },
  { id: "qrCode", label: "QR Code", icon: <Settings className="h-5 w-5" /> },
  { id: "History", label: "history", icon: <Settings className="h-5 w-5" /> },
];

export default function EditorLayout({ eventKey, eventId }: EditorLayoutProps) {
  const [activeSection, setActiveSection] = useState<EditorSection>("overview");
  const [activeTab, setActiveTab] = useState<keyof typeof sectionTabMapping | "preview">("content");
  const [overviewScrollTop, setOverviewScrollTop] = useState(0);
  const [device, setDevice] = useState<DeviceType>("mobile");
  const [isMobile, setIsMobile] = useState(false);
  const [showMenuLayer, setShowMenuLayer] = useState(false);
  const FALLBACK_IMAGE = bg.src;
  const router = useRouter();
  const updateEventKeyMutation = useUpdateEventKey(eventId, eventKey);
  const handleInviteUrlChange = useCallback(
    async (value: string) => {
      try {
        const response = await updateEventKeyMutation.mutateAsync(value);
        if (!response?.success || !response?.event_key) {
          return;
        }
        router.replace(`/editor/${response.event_key}`);
      } catch (error) {
        console.error("Failed to update invite URL:", error);
      }
    },
    [router, updateEventKeyMutation],
  );

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
      <motion.div
        animate={{
          y: showMenuLayer ? -70 : 0,
          opacity: showMenuLayer ? 0 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 28,
        }}
      >
        <div className="fixed top-0 right-0 left-0 z-50 w-full bg-white">
          <div className="flex h-[70px] items-center gap-4 px-4">
            <button className="flex h-8 w-8 items-center justify-center rounded-md border">
              <ChevronLeftIcon strokeWidth={1} className="h-5 w-5" />
            </button>
            <div>
              <h6 className="font-bold">Momentsera Studio</h6>
              <p className="text-[0.7rem] tracking-wide">Everything you need to build invitations.</p>
            </div>
          </div>
        </div>
      </motion.div>
      <div className="max-w-8xl mx-auto bg-[#f3f4f6] md:mt-[64px]">
        <PreviewToolbar
          inviteUrl={eventKey}
          onInviteUrlChange={handleInviteUrlChange}
          device={device}
          onDeviceChange={setDevice}
          className="hidden md:block"
        />
        <div
          className={`${
            showMenuLayer ? "mt-0 h-[100dvh]" : "h-[calc(100dvh-45px)] md:h-[calc(100dvh-65px)]"
          } grid grid-cols-2 grid-rows-[1fr_1fr] overflow-hidden md:grid-cols-[200px_minmax(0,1fr)_400px] md:grid-rows-1`}
        >
          <div
            className={`${
              showMenuLayer ? "h-[calc(55dvh-60px)]" : "hidden"
            } menu-layer z-10 col-start-1 row-start-3 w-full flex-col bg-white p-4 text-zinc-400 md:col-start-1 md:row-start-1 md:flex md:h-full md:w-auto`}
          >
            <div className="flex w-full justify-start pb-5">
              <h3 className="text-left text-xs font-bold tracking-wide text-black uppercase">Editor</h3>
            </div>
            <nav className="flex w-full flex-col items-center justify-around">
              {sideMenuItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id as any);
                      setShowMenuLayer(true);
                    }}
                    className={`flex w-full cursor-pointer items-center gap-1 rounded-md px-3 py-2.5 text-[10px] font-medium text-black capitalize transition-all md:justify-start md:text-[10px] ${
                      isActive ? "text-green bg-[#ebf2ef]" : "text-black"
                    }`}
                  >
                    {item.icon}
                    <span className="max-w-full truncate">{item.label}</span>
                  </button>
                );
              })}
            </nav>
            <div className="flex w-full justify-start pb-5">
              <h3 className="text-left text-xs font-bold uppercase">Tools</h3>
            </div>
            <nav className="flex w-full flex-col items-center justify-around">
              {ToolsMenuItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id as any);
                      setActiveSection("overview");
                    }}
                    className={`flex w-full cursor-pointer items-center gap-1 rounded-md px-3 py-2.5 text-[10px] font-medium text-black capitalize transition-all md:justify-start md:text-[10px] ${
                      isActive ? "text-green bg-[#ebf2ef]" : "text-black"
                    }`}
                  >
                    {item.icon}
                    <span className="max-w-full truncate">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
          {/* LEFT – LIVE VIEW PREVIEW */}
          <div
            className={`${
              showMenuLayer ? "h-[45dvh]" : "h-[calc(100dvh-61px)] pt-[70px] md:h-[calc(100dvh-65px)] md:pt-0"
            } col-span-2 row-start-1 overflow-hidden md:col-span-1 md:col-start-2`}
          >
            <PreviewPanel device={device} splitScreen={splitScreen} eventKey={eventKey} />
          </div>
          <div className="col-span-2 row-start-2 flex h-[50px] items-center gap-4 bg-white px-4 md:hidden">
            <button className="flex h-8 w-8 items-center justify-center rounded-md border" onClick={() => setShowMenuLayer(false)}>
              <ChevronLeftIcon strokeWidth={1} className="h-5 w-5" />
            </button>
            <div>
              <h6 className="font-bold">Sections</h6>
            </div>
          </div>
          {/* RIGHT Persistent Workspace Panel Wrapper Container */}
          <div
            className={`${
              showMenuLayer ? "block h-[calc(55dvh-60px)]" : "hidden md:block md:h-[calc(100vh-65px)]"
            } menu-layer col-start-2 row-start-3 flex flex-col border-l bg-white md:relative md:col-start-3 md:row-start-1 md:h-full`}
          >
            {/* Config Form Action Switcher Layer */}
            <div className="h-auto w-full overflow-y-auto md:h-[calc(100%-64px)] md:flex-1 md:bg-white">
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
          </div>
        </div>
      </div>
      <motion.div
        initial={false}
        animate={{
          y: showMenuLayer ? 80 : 0,
          opacity: showMenuLayer ? 0 : 1,
        }}
        transition={{
          duration: 0.25,
          ease: "easeInOut",
        }}
        className="fixed inset-x-0 bottom-0 z-50 md:hidden"
      >
        <MobileMenu
          showMenuLayer={showMenuLayer}
          onSectionClick={() => setShowMenuLayer((prev) => !prev)}
          onOtherClick={() => setShowMenuLayer(false)}
          className=""
        />
      </motion.div>
    </HomeWrapper>
  );
}
