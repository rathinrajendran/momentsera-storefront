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
  const [activeSection, setActiveSection] = useState<EditorSection>("overview");
  const [activeTab, setActiveTab] = useState<keyof typeof sectionTabMapping | "preview">("content");
  const [overviewScrollTop, setOverviewScrollTop] = useState(0);
  const [device, setDevice] = useState<DeviceType>("mobile");
  const [isMobile, setIsMobile] = useState(false);
  const [showMenuLayer, setShowMenuLayer] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [customizeDialogOpen, setCustomizeDialogOpen] = useState(false);

  const FALLBACK_IMAGE = bg.src;
  const router = useRouter();

  // Load preview context variables locally to resolve the missing scope definitions
  const { draft } = usePreviewDraft();
  const invite = draft?.invite ?? {};
  const announcement = draft?.announcement ?? {};
  const schedule = draft?.schedule ?? [];

  const displayInviteUrl = useMemo(() => safeDecode(eventKey), [eventKey]);
  const primaryFunction = useMemo(() => schedule?.find((item: any) => item.isPrimary), [schedule]);
  const coupleOrder = announcement?.coupleOrder ?? "bride_first";
  const firstName = coupleOrder === "groom_first" ? announcement?.groom?.name : announcement?.bride?.name;
  const secondName = coupleOrder === "groom_first" ? announcement?.bride?.name : announcement?.groom?.name;

  const inviteData = useMemo(
    () => ({
      id: invite?.id,
      eventKey: invite?.event_key,
      eventType: invite?.event_type,
      year: primaryFunction?.date ? new Date(primaryFunction.date).getFullYear() : undefined,
      firstName,
      secondName,
    }),
    [invite, firstName, secondName, primaryFunction],
  );

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


  const handlePreview = () => {
    setShowMenuLayer(false);
  };

  const handleShare = () => {
    setShowMenuLayer(false);
    setShareDialogOpen(true);
  };

  const handleInviteLink = () => {
    setShowMenuLayer(false);
    setCustomizeDialogOpen(true);
  };

  const ToolsMenuItems = [
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
  ];

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
          className="hidden md:block"
        />
        <div
          className={`${
            showMenuLayer ? "mt-0 h-[100dvh]" : "h-[calc(100dvh-45px)] md:h-[calc(100dvh-65px)]"
          } grid grid-cols-[140px_minmax(0,1fr)_auto] grid-rows-[1fr_1fr] overflow-hidden sm:grid-cols-[180px_minmax(0,1fr)_auto] md:grid-cols-[220px_minmax(0,1fr)_400px] md:grid-rows-1`}
        >
          {!splitScreen ? (
            <div
              className={`${
                showMenuLayer ? "h-[calc(55dvh-50px)]" : "hidden"
              } menu-layer z-10 col-start-1 row-start-3 w-full flex-col overflow-auto bg-white p-4 text-zinc-400 md:col-start-1 md:row-start-1 md:flex md:h-full md:w-auto [&::-webkit-scrollbar]:h-[0px] [&::-webkit-scrollbar]:w-0 [&::-webkit-scrollbar-thumb]:rounded-md [&::-webkit-scrollbar-thumb]:bg-[#c1c1c1] [&::-webkit-scrollbar-track]:rounded-md [&::-webkit-scrollbar-track]:bg-[#78909C]`}
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
          ) : (
            <></>
          )}
          {/* LEFT – LIVE VIEW PREVIEW */}
          <div
            className={`${
              showMenuLayer ? "h-[45dvh] md:h-[calc(100dvh-65px)]" : "h-[calc(100dvh-61px)] pt-[70px] md:h-[calc(100dvh-65px)] md:pt-0"
            } col-span-2 row-start-1 overflow-hidden md:col-span-1 md:col-start-2`}
          >
            <PreviewPanel device={device} splitScreen={showMenuLayer} eventKey={eventKey} />
          </div>
          {!splitScreen ? (
            <div className="col-span-2 row-start-2 flex h-[50px] items-center gap-4 rounded-t-3xl border border-b bg-white px-4 md:hidden">
              <button
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border"
                onClick={() => setShowMenuLayer(false)}
              >
                <ChevronLeftIcon strokeWidth={1} className="h-5 w-5" />
              </button>
              <div>
                <h6 className="font-bold">Invitation Studio</h6>
              </div>
            </div>
          ) : (
            <div className="col-span-2 row-start-2 flex h-[50px] items-center gap-4 rounded-t-3xl border border-b bg-white px-4 md:hidden">
              <button
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-b"
                onClick={() => setActiveSection("overview")}
              >
                <ChevronLeftIcon strokeWidth={1} className="h-5 w-5" />
              </button>
              <div>
                <h6 className="font-bold capitalize">{activeSection}</h6>
              </div>
            </div>
          )}
          {/* RIGHT Persistent Workspace Panel Wrapper Container */}
          <div
            className={`${
              showMenuLayer ? "block h-[calc(55dvh-50px)]" : "hidden md:block md:h-[calc(100vh-65px)]"
            } ${splitScreen ? "col-span-2 col-start-1" : "col-span-1 col-start-2"} menu-layer row-start-3 flex flex-col overflow-auto border-l bg-white md:relative md:col-start-3 md:row-start-1 md:h-full`}
          >
            <div className="h-auto w-full overflow-y-auto md:h-[calc(100%-64px)] md:flex-1 md:bg-white [&::-webkit-scrollbar]:h-[0px] [&::-webkit-scrollbar]:w-0 [&::-webkit-scrollbar-thumb]:rounded-md [&::-webkit-scrollbar-thumb]:bg-[#c1c1c1] [&::-webkit-scrollbar-track]:rounded-md [&::-webkit-scrollbar-track]:bg-[#78909C]">
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
