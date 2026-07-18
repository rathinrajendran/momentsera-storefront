"use client";

import { useCallback, useEffect, useState, useMemo } from "react";
import PreviewPanel from "./PreviewPanel";
import EditorPanel from "./EditorPanel";
import { HomeWrapper } from "../../(marketing)/Home/HomeStyles";
import bg from "@/assets/images/placeholder/bg.png";
import { motion } from "framer-motion";
import {
  Calendar,
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
  Eye,
  Link2,
  SquareLibrary,
  Minimize2,
  Maximize2,
  X,
} from "lucide-react";
import { PreviewToolbar, safeDecode } from "./PreviewToolbar";
import { useRouter } from "next/navigation";
import { useUpdateEventKey } from "../../../hooks/useEvents";
import MobileMenu from "./MobileMenu";
import { ShareDialog } from "./components/publish/ShareDialog";
import { CustomizeDialog } from "./components/publish/CustomizeDialog";
import { usePreviewDraft } from "./PreviewDraftContext";

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
  KeyInvite: string;
  typeEvent: string;
};

export const sectionTabMapping = {
  content: [
    {
      id: "announcement",
      title: "Announcement",
      desc: "Names & greeting",
      icon: <Heading className="h-4 w-4" strokeWidth={1} />,
      iconClass: "bg-rose-50 text-rose-500",
      visibilityCheck: false,
    },
    {
      id: "gallery",
      title: "Gallery",
      desc: "Photos & videos",
      icon: <ImageIcon className="h-4 w-4" strokeWidth={1} />,
      iconClass: "bg-pink-50 text-pink-500",
      visibilityCheck: true,
    },
    {
      id: "wishes",
      title: "Wishes",
      desc: "Guest messages & congratulations",
      icon: <MessageSquare className="h-4 w-4" strokeWidth={1} />,
      iconClass: "bg-violet-50 text-violet-500",
      visibilityCheck: true,
    },
    {
      id: "music",
      title: "Music",
      desc: "Background audio track",
      icon: <Music className="h-4 w-4" strokeWidth={1} />,
      iconClass: "bg-fuchsia-50 text-fuchsia-500",
      visibilityCheck: true,
    },
  ],

  event: [
    {
      id: "schedule",
      title: "Schedule",
      desc: "Events, venues & timings",
      icon: <Calendar className="h-4 w-4" strokeWidth={1.5} />,
      iconClass: "bg-red-50 text-red-500",
      visibilityCheck: false,
    },
    {
      id: "timeline",
      title: "Timeline",
      desc: "Sequential itinerary breakdown",
      icon: <Clock className="h-4 w-4" strokeWidth={1.5} />,
      iconClass: "bg-amber-50 text-amber-500",
      visibilityCheck: false,
    },
    {
      id: "dressCode",
      title: "Dress Code",
      desc: "Attire rules & color palette",
      icon: <Shirt className="h-4 w-4" strokeWidth={1.5} />,
      iconClass: "bg-orange-50 text-orange-500",
      visibilityCheck: false,
    },
    {
      id: "rsvp",
      title: "RSVP",
      desc: "Attendance tracking",
      icon: <CheckCircle className="h-4 w-4" strokeWidth={1.5} />,
      iconClass: "bg-emerald-50 text-emerald-500",
      visibilityCheck: true,
    },
  ],

  design: [
    {
      id: "background",
      title: "Background",
      desc: "Background image & texture",
      icon: <Palette className="h-4 w-4" strokeWidth={1.5} />,
      iconClass: "bg-sky-50 text-sky-500",
      visibilityCheck: false,
    },
    {
      id: "color",
      title: "Color",
      desc: "Primary & accent colors",
      icon: <Palette className="h-4 w-4" strokeWidth={1.5} />,
      iconClass: "bg-cyan-50 text-cyan-500",
      visibilityCheck: false,
    },
    {
      id: "font",
      title: "Font",
      desc: "Typography selection",
      icon: <Palette className="h-4 w-4" strokeWidth={1.5} />,
      iconClass: "bg-indigo-50 text-indigo-500",
      visibilityCheck: false,
    },
    {
      id: "shape",
      title: "Shape",
      desc: "Corners & decorative elements",
      icon: <Palette className="h-4 w-4" strokeWidth={1.5} />,
      iconClass: "bg-purple-50 text-purple-500",
      visibilityCheck: false,
    },
    {
      id: "motion",
      title: "Motion",
      desc: "Animations & transitions",
      icon: <Sparkles className="h-4 w-4" strokeWidth={1.5} />,
      iconClass: "bg-yellow-50 text-yellow-500",
      visibilityCheck: false,
    },
  ],

  settings: [
    {
      id: "sharing",
      title: "Sharing",
      desc: "Invite link & QR code",
      icon: <Share2 className="h-4 w-4" strokeWidth={1.5} />,
      iconClass: "bg-blue-50 text-blue-500",
      visibilityCheck: false,
    },
    {
      id: "privacy",
      title: "Privacy",
      desc: "Password & visibility controls",
      icon: <Lock className="h-4 w-4" strokeWidth={1.5} />,
      iconClass: "bg-slate-100 text-slate-600",
      visibilityCheck: false,
    },
    {
      id: "print",
      title: "Print",
      desc: "Printable invitation layout",
      icon: <Printer className="h-4 w-4" strokeWidth={1.5} />,
      iconClass: "bg-teal-50 text-teal-500",
      visibilityCheck: false,
    },
    {
      id: "settings",
      title: "Settings",
      desc: "Preferences, locale & analytics",
      icon: <Settings className="h-4 w-4" strokeWidth={1.5} />,
      iconClass: "bg-zinc-100 text-zinc-600",
      visibilityCheck: false,
    },
  ],
} as const;

const sideMenuItems = [
  {
    id: "content",
    label: "Content",
    icon: <SquareLibrary className="h-5 w-5" strokeWidth={1.75} />,
  },
  {
    id: "event",
    label: "Event",
    icon: <Calendar className="h-5 w-5" strokeWidth={1.75} />,
  },
  {
    id: "design",
    label: "Design",
    icon: <Palette className="h-5 w-5" strokeWidth={1.75} />,
  },
  {
    id: "settings",
    label: "Settings",
    icon: <Settings className="h-5 w-5" strokeWidth={1.75} />,
  },
];

export default function EditorLayout({ eventKey, eventId, KeyInvite, typeEvent }: EditorLayoutProps) {
  // -----------------------------------------------------------------------------
  // Constants
  // -----------------------------------------------------------------------------

  const FALLBACK_IMAGE = bg.src;

  // -----------------------------------------------------------------------------
  // Router & Context
  // -----------------------------------------------------------------------------

  const router = useRouter();
  const { draft } = usePreviewDraft();

  // -----------------------------------------------------------------------------
  // State
  // -----------------------------------------------------------------------------

  const [activeSection, setActiveSection] = useState<EditorSection>("overview");
  const [activeTab, setActiveTab] = useState<keyof typeof sectionTabMapping | "preview">("content");

  const [device, setDevice] = useState<DeviceType>("mobile");
  const [isMobile, setIsMobile] = useState(false);

  const [overviewScrollTop, setOverviewScrollTop] = useState(0);

  const [showMenuLayer, setShowMenuLayer] = useState(false);

  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [customizeDialogOpen, setCustomizeDialogOpen] = useState(false);

  const [isFullscreen, setIsFullscreen] = useState(false);

  // -----------------------------------------------------------------------------
  // Draft Data
  // -----------------------------------------------------------------------------

  const previewData = useMemo(
    () => ({
      invite: draft?.invite ?? {},
      announcement: draft?.announcement ?? {},
      schedule: draft?.schedule ?? [],
    }),
    [draft],
  );

  const { invite, announcement, schedule } = previewData;

  // -----------------------------------------------------------------------------
  // Memoized Values
  // -----------------------------------------------------------------------------

  const displayInviteUrl = useMemo(() => safeDecode(eventKey), [eventKey]);

  const primaryFunction = useMemo(() => schedule.find((item: any) => item.isPrimary), [schedule]);

  const coupleOrder = useMemo(() => announcement.coupleOrder ?? "bride_first", [announcement]);

  const firstName = useMemo(
    () => (coupleOrder === "groom_first" ? announcement.groom?.name : announcement.bride?.name),
    [announcement, coupleOrder],
  );

  const secondName = useMemo(
    () => (coupleOrder === "groom_first" ? announcement.bride?.name : announcement.groom?.name),
    [announcement, coupleOrder],
  );

  const inviteData = useMemo(
    () => ({
      id: invite.id,
      eventKey: invite.event_key,
      eventType: invite.event_type,
      year: primaryFunction?.date ? new Date(primaryFunction.date).getFullYear() : undefined,
      firstName,
      secondName,
    }),
    [invite, primaryFunction, firstName, secondName],
  );

  // -----------------------------------------------------------------------------
  // Mutations
  // -----------------------------------------------------------------------------

  const updateEventKeyMutation = useUpdateEventKey(eventId, eventKey);

  // -----------------------------------------------------------------------------
  // Callbacks
  // -----------------------------------------------------------------------------

  const handleInviteUrlChange = useCallback(
    async (value: string) => {
      try {
        const response = await updateEventKeyMutation.mutateAsync(value);

        if (!response?.success || !response.event_key) return;

        router.replace(`/editor/${response.event_key}`);
      } catch (error) {
        console.error("Failed to update invite URL:", error);
      }
    },
    [router, updateEventKeyMutation],
  );

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handlePreview = useCallback(() => {
    setShowMenuLayer(false);
  }, []);

  const handleShare = useCallback(() => {
    setShowMenuLayer(false);
    setShareDialogOpen(true);
  }, []);

  const handleInviteLink = useCallback(() => {
    setShowMenuLayer(false);
    setCustomizeDialogOpen(true);
  }, []);

  // -----------------------------------------------------------------------------
  // Effects
  // -----------------------------------------------------------------------------

  useEffect(() => {
    const updateMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    updateMobile();

    window.addEventListener("resize", updateMobile);

    return () => window.removeEventListener("resize", updateMobile);
  }, []);

  // -----------------------------------------------------------------------------
  // Derived Values
  // -----------------------------------------------------------------------------

  const splitScreen = activeSection !== "overview" && isMobile;

  const currentSections = activeTab === "preview" ? [] : sectionTabMapping[activeTab];

  // -----------------------------------------------------------------------------
  // Menu Items
  // -----------------------------------------------------------------------------

  const ToolsMenuItems = useMemo(
    () => [
      {
        id: "preview",
        label: "Preview",
        icon: <Eye className="h-5 w-5" strokeWidth={1.75} />,
        onClick: handlePreview,
      },
      {
        id: "share",
        label: "Share",
        icon: <Share2 className="h-5 w-5" strokeWidth={1.75} />,
        onClick: handleShare,
      },
      {
        id: "link",
        label: "Invite Link",
        icon: <Link2 className="h-5 w-5" strokeWidth={1.75} />,
        onClick: handleInviteLink,
      },
    ],
    [handlePreview, handleShare, handleInviteLink],
  );

  const panelHeight = `h-[calc(${isFullscreen ? "100dvh" : "55dvh"}-50px)]`;

  const menuHeight = showMenuLayer ? panelHeight : "md:h-[calc(100dvh-65px)]";

  const menuLayerHeight = showMenuLayer ? `flex ${panelHeight}` : "hidden";

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
          y: showMenuLayer && isMobile ? -70 : 0,
          opacity: showMenuLayer && isMobile ? 0 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 28,
        }}
      >
        <div className="fixed top-0 right-0 left-0 z-50 w-full rounded-b-2xl bg-white">
          <div className="flex h-[70px] items-center gap-4 px-4">
            <button
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border"
              onClick={() => router.push(`/invites/${typeEvent}/${KeyInvite}`)}
            >
              <ChevronLeftIcon strokeWidth={1} className="h-5 w-5" />
            </button>
            <div>
              <h6 className="font-bold">Invite Studio</h6>
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
          shareDialogOpen={shareDialogOpen}
          onShareDialogOpenChange={setShareDialogOpen}
          customizeDialogOpen={customizeDialogOpen}
          onCustomizeDialogOpenChange={setCustomizeDialogOpen}
          className="hidden md:flex"
        />
        <div
          className={`${showMenuLayer && isMobile ? "mt-0 h-[100dvh]" : "h-[calc(100dvh-45px)] md:h-[calc(100dvh-115px)]"} justify-between overflow-hidden md:flex`}
        >
          <div
            className={`hidden w-[200px] flex-col overflow-auto bg-white p-4 text-zinc-400 md:flex md:h-full [&::-webkit-scrollbar]:h-[0px] [&::-webkit-scrollbar]:w-0 [&::-webkit-scrollbar-thumb]:rounded-md [&::-webkit-scrollbar-thumb]:bg-[#c1c1c1] [&::-webkit-scrollbar-track]:rounded-md [&::-webkit-scrollbar-track]:bg-[#78909C]`}
          >
            <div className="flex w-full justify-start pb-3">
              <h3 className="text-left text-xs font-bold tracking-wide text-black uppercase">Editor</h3>
            </div>
            <nav className="flex w-full flex-col items-center justify-around">
              {sideMenuItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id as keyof typeof sectionTabMapping);
                      setActiveSection("overview");
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
            <div className="flex w-full justify-start pt-4 pb-3">
              <h3 className="text-left text-xs font-bold tracking-wide text-black uppercase">Tools</h3>
            </div>
            <nav className="flex w-full flex-col items-center justify-around">
              {ToolsMenuItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection("overview");
                      item.onClick();
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
              showMenuLayer
                ? "h-[45dvh] md:h-[calc(100dvh-65px)]"
                : "h-[calc(100dvh-0px)] py-0 md:h-[calc(100dvh-65px)] md:py-0"
            } overflow-hidden`}
          >
            <PreviewPanel device={device} splitScreen={showMenuLayer && isMobile} eventKey={eventKey} />
          </div>
          <div className={`${isFullscreen ? "fixed top-0 h-full" : ""} mob-view flex w-full flex-col md:w-[380px]`}>
            {isMobile && !splitScreen ? (
              <div className="flex h-[50px] items-center justify-between rounded-t-3xl border-b bg-white px-4 md:hidden">
                <div className="flex items-center gap-4">
                  <h6 className="font-bold">Invitation Studio</h6>
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border" onClick={toggleFullscreen}>
                    {isFullscreen ? (
                      <Minimize2 className="h-5 w-5" strokeWidth={1.5} />
                    ) : (
                      <Maximize2 className="h-5 w-5" strokeWidth={1.5} />
                    )}
                  </button>
                  <button
                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border"
                    onClick={() => setShowMenuLayer(false)}
                  >
                    <X strokeWidth={1.5} className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ) : (
              <></>
            )}
            {isMobile && splitScreen ? (
              <div className="flex h-[50px] items-center justify-between rounded-t-3xl border-b bg-white px-4 md:hidden">
                <div className="flex items-center gap-4">
                  <h6 className="font-bold capitalize">{activeSection}</h6>
                </div>
                <button
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border"
                  onClick={() => setActiveSection("overview")}
                >
                  <ChevronLeftIcon strokeWidth={1.5} className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <></>
            )}
            <div className="flex h-full w-full">
              <div
                className={`${isFullscreen ? "h-[calc(100dvh-50px)]" : "h-[calc(55dvh-50px)] md:h-auto"} ${showMenuLayer && !splitScreen ? "block" : "hidden md:block"} mob-160px z-10 flex w-[160px] flex-col overflow-auto bg-white p-4 text-zinc-400 md:hidden md:h-full [&::-webkit-scrollbar]:h-[0px] [&::-webkit-scrollbar]:w-0 [&::-webkit-scrollbar-thumb]:rounded-md [&::-webkit-scrollbar-thumb]:bg-[#c1c1c1] [&::-webkit-scrollbar-track]:rounded-md [&::-webkit-scrollbar-track]:bg-[#78909C]`}
              >
                <div className="flex w-full justify-start pb-3">
                  <h3 className="text-left text-xs font-bold tracking-wide text-black uppercase">Editor</h3>
                </div>
                <nav className="flex w-full flex-col items-center justify-around">
                  {sideMenuItems.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id as keyof typeof sectionTabMapping);
                          setActiveSection("overview");
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
                <div className="flex w-full justify-start pt-4 pb-3">
                  <h3 className="text-left text-xs font-bold tracking-wide text-black uppercase">Tools</h3>
                </div>
                <nav className="flex w-full flex-col items-center justify-around">
                  {ToolsMenuItems.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveSection("overview");
                          item.onClick();
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

              {/* RIGHT Persistent Workspace Panel Wrapper Container */}
              <div
                className={`${isFullscreen ? "h-[calc(100dvh-50px)]" : "h-[calc(55dvh-50px)] md:h-auto"} ${showMenuLayer ? "block" : "hidden md:block"} ${menuHeight} ${splitScreen ? "w-full" : ""} menu-layer flex w-[calc(100%-160px)] flex-col overflow-auto border-l bg-white md:relative md:h-full md:w-full`}
              >
                <div className="h-auto w-full overflow-y-auto md:h-[calc(100dvh-115px)] md:bg-white [&::-webkit-scrollbar]:h-[0px] [&::-webkit-scrollbar]:w-0 [&::-webkit-scrollbar-thumb]:rounded-md [&::-webkit-scrollbar-thumb]:bg-[#c1c1c1] [&::-webkit-scrollbar-track]:rounded-md [&::-webkit-scrollbar-track]:bg-[#78909C]">
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
              </div>
            </div>
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
          onPreviewClick={handlePreview}
          onShareClick={handleShare}
          onLinkClick={handleInviteLink}
          onPublishClick={() => {
            // publish dialog
          }}
          className=""
        />
      </motion.div>

      {/* Single Dialog Instances Controlled by layout-level state */}
      <CustomizeDialog
        open={customizeDialogOpen}
        onOpenChange={setCustomizeDialogOpen}
        inviteUrl={eventKey}
        onInviteUrlChange={handleInviteUrlChange}
        inviteData={inviteData}
      />
      <ShareDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        url={displayInviteUrl}
        status={invite?.status}
        paymentStatus={invite?.payment_status}
        displayInviteUrl={displayInviteUrl}
      />
    </HomeWrapper>
  );
}
