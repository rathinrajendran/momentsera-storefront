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
  Clock,
  Shirt,
  Palette,
  Sparkles,
  CheckCircle,
  Share2,
  Lock,
  Printer,
  ChevronLeftIcon,
  Eye,
  Link2,
  SquareLibrary,
  Minimize2,
  Maximize2,
  X,
  Image,
  Droplets,
  Type,
  Shapes,
  Music4,
  MessagesSquare,
  Images,
  ScrollText,
  Heart,
  EyeOff,
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
  | "ourStory"
  | "gallery"
  | "dressCode"
  | "wishes"
  | "rsvp"
  | "music"
  | "privacy"
  | "shape"
  | "color"
  | "font"
  | "sharing"
  | "motionSection"
  | "print"
  | "settings";

export type DeviceType = "desktop" | "mobile";
export type SectionVisibility = "visible" | "hidden" | "protected";

export type SectionPasswordMode = "inherit" | "custom";

export type PrivacySection = {
  id: string;
  visibility: SectionVisibility;
  passwordMode?: SectionPasswordMode;
  password?: string;
  hint?: string;
};

export type DynamicSection = {
  id: EditorSection;
  title: string;
  desc: string;

  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;

  visibilityCheck: boolean;

  visibilityLabel: "Visible" | "Hidden" | "Protected";

  visibilityIcon: React.ReactNode;

  visibility: SectionVisibility;
  passwordMode: SectionPasswordMode;
  password: string;
  hint: string;
};
export type EditorLayoutProps = {
  eventKey: string;
  eventId: number;
  KeyInvite: string;
  typeEvent: string;
  privacyData: {
    sections?: PrivacySection[];
    [key: string]: any;
  };
};

export const sectionTabMetadata = {
  invitation: [
    {
      id: "announcement",
      title: "Announcement",
      desc: "Names & greeting",
      icon: <ScrollText className="h-4 w-4" strokeWidth={1.5} />,
      iconBg: "bg-rose-50",
      iconColor: "text-rose-500",
    },
    {
      id: "schedule",
      title: "Schedule",
      desc: "Events, venues & timings",
      icon: <Calendar className="h-4 w-4" strokeWidth={1.5} />,
      iconBg: "bg-sky-50",
      iconColor: "text-sky-500",
    },

    {
      id: "ourStory",
      title: "Our Story",
      desc: "Our journey together",
      icon: <Heart className="h-4 w-4" strokeWidth={1.5} />,
      iconBg: "bg-pink-50",
      iconColor: "text-pink-500",
    },
    {
      id: "timeline",
      title: "Timeline",
      desc: "Sequential itinerary breakdown",
      icon: <Clock className="h-4 w-4" strokeWidth={1.5} />,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-500",
    },
    {
      id: "gallery",
      title: "Gallery",
      desc: "Photos & videos",
      icon: <Images className="h-4 w-4" strokeWidth={1.5} />,
      iconBg: "bg-violet-50",
      iconColor: "text-violet-500",
    },
    {
      id: "dressCode",
      title: "Dress Code",
      desc: "Attire rules & color palette",
      icon: <Shirt className="h-4 w-4" strokeWidth={1.5} />,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-500",
    },

    {
      id: "wishes",
      title: "Wishes",
      desc: "Guest messages & congratulations",
      icon: <MessagesSquare className="h-4 w-4" strokeWidth={1.5} />,
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-500",
    },
    {
      id: "rsvp",
      title: "RSVP",
      desc: "Attendance tracking",
      icon: <CheckCircle className="h-4 w-4" strokeWidth={1.5} />,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-500",
    },

    {
      id: "music",
      title: "Music",
      desc: "Background audio track",
      icon: <Music4 className="h-4 w-4" strokeWidth={1.5} />,
      iconBg: "bg-fuchsia-50",
      iconColor: "text-fuchsia-500",
    },
  ],

  design: [
    {
      id: "color",
      title: "Color",
      desc: "Primary & accent colors",
      icon: <Droplets className="h-4 w-4" strokeWidth={1.5} />,
      iconBg: "bg-cyan-50",
      iconColor: "text-cyan-500",
    },
    {
      id: "font",
      title: "Font",
      desc: "Typography selection",
      icon: <Type className="h-4 w-4" strokeWidth={1.5} />,
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-500",
    },
    {
      id: "shape",
      title: "Shape",
      desc: "Corners & decorative elements",
      icon: <Shapes className="h-4 w-4" strokeWidth={1.5} />,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-500",
    },
    {
      id: "motionSection",
      title: "Motion",
      desc: "Animations & transitions",
      icon: <Sparkles className="h-4 w-4" strokeWidth={1.5} />,
      iconBg: "bg-yellow-50",
      iconColor: "text-yellow-500",
    },
  ],

  settings: [
    {
      id: "sharing",
      title: "Sharing",
      desc: "Invite link & QR code",
      icon: <Share2 className="h-4 w-4" strokeWidth={1.5} />,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-500",
    },
    {
      id: "privacy",
      title: "Privacy",
      desc: "Password & visibility controls",
      icon: <Lock className="h-4 w-4" strokeWidth={1.5} />,
      iconBg: "bg-slate-100",
      iconColor: "text-slate-600",
    },
    {
      id: "print",
      title: "Print",
      desc: "Printable invitation layout",
      icon: <Printer className="h-4 w-4" strokeWidth={1.5} />,
      iconBg: "bg-teal-50",
      iconColor: "text-teal-500",
    },
    {
      id: "settings",
      title: "Settings",
      desc: "Preferences, locale & analytics",
      icon: <Settings className="h-4 w-4" strokeWidth={1.5} />,
      iconBg: "bg-zinc-100",
      iconColor: "text-zinc-600",
    },
  ],
} as const;

/**
 * ---------------------------------------------------------------------------
 * SECTION ID NORMALIZATION
 * ---------------------------------------------------------------------------
 *
 * Privacy configuration and editor configuration use slightly different
 * IDs for some sections.
 */
const normalizeSectionId = (id: string): EditorSection => {
  switch (id) {
    case "dresscode":
      return "dressCode";

    case "motion":
      return "motionSection";

    default:
      return id as EditorSection;
  }
};

/**
 * ---------------------------------------------------------------------------
 * SIDE MENU
 * ---------------------------------------------------------------------------
 */

const sideMenuItems = [
  {
    id: "invitation",
    label: "Invitation",
    icon: <SquareLibrary className="h-5 w-5" strokeWidth={1.75} />,
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
] as const;

export default function EditorLayout({ eventKey, eventId, KeyInvite, typeEvent, privacyData }: EditorLayoutProps) {
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
  const [activeTab, setActiveTab] = useState<keyof typeof sectionTabMetadata | "preview">("invitation");
  const [device, setDevice] = useState<DeviceType>("mobile");
  const [isMobile, setIsMobile] = useState(false);
  const [overviewScrollTop, setOverviewScrollTop] = useState(0);
  const [showMenuLayer, setShowMenuLayer] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [customizeDialogOpen, setCustomizeDialogOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const privacySections = useMemo<PrivacySection[]>(() => privacyData?.sections ?? [], [privacyData?.sections]);

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
        if (!response?.success || !response.event_key) {
          return;
        }
        router.replace(`/editor/${response.event_key}`);
      } catch (error) {
        console.error("Failed to update invite URL:", error);
      }
    },
    [router, updateEventKeyMutation],
  );

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
  }, []);

  const handlePreview = useCallback(() => {
    window.open(`/preview/${eventKey}`, "_blank");
  }, [eventKey]);

  const handleShare = useCallback(() => {
    setShareDialogOpen(true);
  }, []);

  const handleInviteLink = useCallback(() => {
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

    return () => {
      window.removeEventListener("resize", updateMobile);
    };
  }, []);

  // -----------------------------------------------------------------------------
  // Derived Values
  // -----------------------------------------------------------------------------

  const splitScreen = activeSection !== "overview" && isMobile;
  const currentSections = useMemo<DynamicSection[]>(() => {
    if (activeTab === "preview") {
      return [];
    }

    const metadata = sectionTabMetadata[activeTab];

    if (!metadata) {
      return [];
    }

    const metadataMap = new Map(metadata.map((section) => [normalizeSectionId(section.id), section]));

    return privacySections.reduce<DynamicSection[]>((result, privacySection) => {
      const sectionId = normalizeSectionId(privacySection.id);

      const sectionMetadata = metadataMap.get(sectionId);

      if (!sectionMetadata) {
        return result;
      }

      const visibility = privacySection.visibility ?? "visible";

      /**
       * Visibility controls are only available for sections
       * that have privacy/password configuration in
       * privacy.sections.
       *
       * Example:
       * announcement -> passwordMode/password/hint -> show control
       * color        -> no password fields              -> hide control
       */
      const hasPasswordConfiguration =
        privacySection.passwordMode !== undefined || privacySection.password !== undefined || privacySection.hint !== undefined;

      const visibilityLabel: DynamicSection["visibilityLabel"] =
        visibility === "visible" ? "Visible" : visibility === "hidden" ? "Hidden" : "Protected";

      const visibilityIcon: React.ReactNode =
        visibility === "visible" ? (
          <Eye className="h-3.5 w-3.5 text-emerald-500" strokeWidth={1.75} />
        ) : visibility === "hidden" ? (
          <EyeOff className="h-3.5 w-3.5 text-slate-400" strokeWidth={1.75} />
        ) : (
          <Lock className="h-3.5 w-3.5 text-amber-500" strokeWidth={1.75} />
        );

      result.push({
        ...sectionMetadata,

        id: sectionId,

        // Dynamic visibility state.
        visibility,

        // Dynamic password configuration.
        passwordMode: privacySection.passwordMode ?? "inherit",

        password: privacySection.password ?? "",

        hint: privacySection.hint ?? "",

        // Controls whether the visibility button is rendered.
        // It is based on field availability, not visibility state.
        visibilityCheck: hasPasswordConfiguration,

        visibilityLabel,
        visibilityIcon,
      });

      return result;
    }, []);
  }, [activeTab, privacySections]);

  /**
   * -------------------------------------------------------------------------
   * MENU HEIGHT
   * -------------------------------------------------------------------------
   */
  const panelHeight = `h-[calc(${isFullscreen ? "100dvh" : "55dvh"}-50px)`;

  const menuHeight = showMenuLayer ? panelHeight : "md:h-[calc(100dvh-115px)]";

  // ---------------------------------------------------------------------------
  // Tools Menu
  // ---------------------------------------------------------------------------

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
          className={`${
            showMenuLayer && isMobile ? "mt-0 h-[100dvh]" : "h-[calc(100dvh-0px)] md:h-[calc(100dvh-115px)]"
          } justify-between overflow-hidden md:flex`}
        >
          <div className="flex">
            <div className="hidden flex-col overflow-auto bg-white p-4 text-zinc-400 md:flex md:h-full md:w-[80px] lg:w-[80px] [&::-webkit-scrollbar]:h-[0px] [&::-webkit-scrollbar]:w-0 [&::-webkit-scrollbar-thumb]:rounded-md [&::-webkit-scrollbar-thumb]:bg-[#c1c1c1] [&::-webkit-scrollbar-track]:rounded-md [&::-webkit-scrollbar-track]:bg-[#78909C]">
              <div className="flex w-full md:justify-center lg:justify-start">
                <h3 className="text-center text-[0.6rem] font-bold tracking-wide text-black uppercase lg:text-left">Editor</h3>
              </div>

              <nav className="flex w-full flex-col items-center justify-around">
                {sideMenuItems.map((item) => {
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setActiveTab(item.id as keyof typeof sectionTabMetadata);

                        setActiveSection("overview");

                        setShowMenuLayer(true);
                      }}
                      className={`my-3 flex cursor-pointer items-center gap-1 rounded-md text-[10px] font-medium text-black capitalize transition-all md:w-11 md:justify-center lg:w-full lg:justify-start ${
                        isActive ? "text-green bg-[#ebf2ef]" : "text-black"
                      }`}
                    >
                      {item.icon}

                      <span className="hidden max-w-full truncate">{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              <div className="flex w-full pt-4 pb-3 md:justify-center lg:justify-start">
                <h3 className="text-center text-xs font-bold tracking-wide text-black uppercase lg:text-left">Tools</h3>
              </div>

              <nav className="flex w-full flex-col items-center justify-around">
                {ToolsMenuItems.map((item) => {
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setActiveSection("overview");
                        item.onClick();
                      }}
                      className={`flex w-full cursor-pointer items-center gap-1 rounded-md px-3 py-2.5 text-[10px] font-medium text-black capitalize transition-all md:justify-center md:text-[10px] lg:justify-start ${
                        isActive ? "text-green bg-[#ebf2ef]" : "text-black"
                      }`}
                    >
                      {item.icon}

                      <span className="hidden max-w-full truncate">{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
          {/* LEFT – LIVE VIEW PREVIEW */}
          <div
            className={`w-full ${
              showMenuLayer ? "h-[45dvh] md:h-[calc(100dvh-115px)]" : "h-[calc(100dvh-0px)] py-0 md:h-[calc(100dvh-115px)] md:py-0"
            } overflow-hidden`}
          >
            <PreviewPanel device={device} splitScreen={showMenuLayer && isMobile} eventKey={eventKey} />
          </div>
          <div
            className={`${isFullscreen ? "fixed top-0 h-full" : ""} mob-view flex w-full flex-col md:w-[320px] md:min-w-[320px] lg:w-[380px] lg:min-w-[380px]`}
          >
            {isMobile && !splitScreen ? (
              <div className="flex h-[50px] items-center justify-between rounded-t-3xl border border-slate-100 bg-white px-4 md:hidden">
                <div className="flex items-center gap-4">
                  <h6 className="font-bold">Invite Studio</h6>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-slate-100"
                    onClick={toggleFullscreen}
                  >
                    {isFullscreen ? (
                      <Minimize2 className="h-5 w-5" strokeWidth={1.5} />
                    ) : (
                      <Maximize2 className="h-5 w-5" strokeWidth={1.5} />
                    )}
                  </button>
                  <button
                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-slate-100"
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
                <div className="flex items-center gap-2">
                  <button
                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-slate-100"
                    onClick={toggleFullscreen}
                  >
                    {isFullscreen ? (
                      <Minimize2 className="h-5 w-5" strokeWidth={1.5} />
                    ) : (
                      <Maximize2 className="h-5 w-5" strokeWidth={1.5} />
                    )}
                  </button>
                  <button
                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-slate-100"
                    onClick={() => setActiveSection("overview")}
                  >
                    <ChevronLeftIcon strokeWidth={1.5} className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ) : (
              <></>
            )}
            <div className="flex h-full w-full">
              <div
                className={`${isFullscreen ? "h-[calc(100dvh-50px)]" : "h-[calc(55dvh-50px)] md:h-auto"} ${
                  showMenuLayer && !splitScreen ? "block w-[130px] sm:w-[180px]" : "hidden md:block"
                } mob-160px z-10 flex flex-col overflow-auto border-r border-slate-100 bg-white p-4 text-zinc-400 md:hidden md:h-full [&::-webkit-scrollbar]:h-[0px] [&::-webkit-scrollbar]:w-0 [&::-webkit-scrollbar-thumb]:rounded-md [&::-webkit-scrollbar-thumb]:bg-[#c1c1c1] [&::-webkit-scrollbar-track]:rounded-md [&::-webkit-scrollbar-track]:bg-[#78909C]`}
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
                          setActiveTab(item.id as keyof typeof sectionTabMetadata);
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
                className={`${isFullscreen ? "h-[calc(100dvh-50px)]" : "h-[calc(55dvh-50px)] md:h-auto"} ${
                  showMenuLayer ? "block" : "hidden md:block"
                } ${menuHeight} ${
                  splitScreen ? "w-full" : "w-[calc(100%-130px)] sm:w-[calc(100%-180px)]"
                } menu-layer flex flex-col overflow-auto bg-white md:relative md:w-full`}
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
