"use client";

import { EditorSection, DynamicSection } from "./EditorLayout";
import EditorOverview from "./EditorOverview";
import GalleryEditor from "./components/GalleryEditor";
import WishesEditor from "./components/WishesEditor";
import SettingsEditor from "./components/SettingsEditor";
import MusicEditor from "./components/MusicEditor";
import PrivacyEditor from "./components/PrivacyEditor";
import AnnouncementEditor from "./components/AnnouncementEditor";
import ScheduleEditor from "./components/ScheduleEditor";
import MotionEditor from "./components/MotionEditor";
import PrintEditor from "./components/PrintEditor";
import SharingEditor from "./components/SharingEditor";
import TimelineEditor from "./components/TimelineEditor";
import DressCodeEditor from "./components/DressCodeEditor";
import FontEditor from "./components/FontEditor";
import ColorEditor from "./components/ColorEditor";
import ShapeEditor from "./components/ShapeEditor";
import RSVPEditor from "./components/RSVPEditor";
import OurStoryEditor from "./components/OurStoryEditor";

type SectionItem = DynamicSection;

type EditorPanelProps = {
  activeSection: EditorSection;
  onSectionChange: (section: EditorSection) => void;
  eventKey: string;
  overviewScrollTop: number;
  onOverviewScrollChange: (value: number) => void;
  activeTab: string;
  currentSections: readonly SectionItem[];
  sections?: any;
};

export default function EditorPanel({
  eventKey,
  activeSection,
  onSectionChange,
  overviewScrollTop,
  onOverviewScrollChange,
  activeTab,
  currentSections,
  sections,
}: EditorPanelProps) {
  console.log("sections data", sections);

  /**
   * ---------------------------------------------------------------
   * GET NEXT SECTION
   * ---------------------------------------------------------------
   *
   * currentSections is already dynamically generated from
   * privacy.sections in EditorLayout.
   *
   * Example:
   *
   * announcement
   * schedule
   * ourStory
   * timeline
   * gallery
   *
   * Therefore navigation automatically follows that order.
   */
  const getNextSection = (currentSection: EditorSection): EditorSection => {
    const currentIndex = currentSections.findIndex((section) => section.id === currentSection);

    /**
     * If current section isn't present in the dynamic list,
     * safely return to overview.
     */
    if (currentIndex === -1) {
      return "overview";
    }

    const nextSection = currentSections[currentIndex + 1];

    /**
     * Last section → back to overview.
     */
    if (!nextSection) {
      return "overview";
    }

    return nextSection.id;
  };

  /**
   * ---------------------------------------------------------------
   * BACK / NEXT NAVIGATION
   * ---------------------------------------------------------------
   */
  const handleNextSection = (currentSection: EditorSection) => {
    onSectionChange(getNextSection(currentSection));
  };

  return (
    <>
      {/* ------------------------------------------------------------- */}
      {/* OVERVIEW */}
      {/* ------------------------------------------------------------- */}

      {activeSection === "overview" && (
        <EditorOverview
          activeTab={activeTab}
          currentSections={currentSections}
          onSelect={onSectionChange}
          scrollTop={overviewScrollTop}
          onScrollChange={onOverviewScrollChange}
          eventKey={eventKey}
        />
      )}

      {/* ------------------------------------------------------------- */}
      {/* ANNOUNCEMENT */}
      {/* ------------------------------------------------------------- */}

      {activeSection === "announcement" && <AnnouncementEditor eventKey={eventKey} onBack={() => handleNextSection("announcement")} />}

      {/* ------------------------------------------------------------- */}
      {/* SCHEDULE */}
      {/* ------------------------------------------------------------- */}

      {activeSection === "schedule" && <ScheduleEditor eventKey={eventKey} onBack={() => handleNextSection("schedule")} />}

      {/* ------------------------------------------------------------- */}
      {/* OUR STORY */}
      {/* ------------------------------------------------------------- */}

      {activeSection === "ourStory" && <OurStoryEditor eventKey={eventKey} onBack={() => handleNextSection("ourStory")} />}

      {/* ------------------------------------------------------------- */}
      {/* TIMELINE */}
      {/* ------------------------------------------------------------- */}

      {activeSection === "timeline" && <TimelineEditor eventKey={eventKey} onBack={() => handleNextSection("timeline")} />}

      {/* ------------------------------------------------------------- */}
      {/* GALLERY */}
      {/* ------------------------------------------------------------- */}

      {activeSection === "gallery" && <GalleryEditor eventKey={eventKey} onBack={() => handleNextSection("gallery")} />}

      {/* ------------------------------------------------------------- */}
      {/* DRESS CODE */}
      {/* ------------------------------------------------------------- */}

      {activeSection === "dressCode" && <DressCodeEditor eventKey={eventKey} onBack={() => handleNextSection("dressCode")} />}

      {/* ------------------------------------------------------------- */}
      {/* WISHES */}
      {/* ------------------------------------------------------------- */}

      {activeSection === "wishes" && <WishesEditor eventKey={eventKey} onBack={() => handleNextSection("wishes")} />}

      {/* ------------------------------------------------------------- */}
      {/* RSVP */}
      {/* ------------------------------------------------------------- */}

      {activeSection === "rsvp" && <RSVPEditor eventKey={eventKey} onBack={() => handleNextSection("rsvp")} />}

      {/* ------------------------------------------------------------- */}
      {/* MUSIC */}
      {/* ------------------------------------------------------------- */}

      {activeSection === "music" && <MusicEditor eventKey={eventKey} onBack={() => handleNextSection("music")} />}
      {/* ------------------------------------------------------------- */}
      {/* COLOR */}
      {/* ------------------------------------------------------------- */}

      {activeSection === "color" && <ColorEditor eventKey={eventKey} onBack={() => handleNextSection("color")} />}

      {/* ------------------------------------------------------------- */}
      {/* FONT */}
      {/* ------------------------------------------------------------- */}

      {activeSection === "font" && <FontEditor eventKey={eventKey} onBack={() => handleNextSection("font")} />}

      {/* ------------------------------------------------------------- */}
      {/* SHAPE */}
      {/* ------------------------------------------------------------- */}

      {activeSection === "shape" && <ShapeEditor eventKey={eventKey} onBack={() => handleNextSection("shape")} />}
      {/* ------------------------------------------------------------- */}
      {/* MOTION */}
      {/* ------------------------------------------------------------- */}

      {activeSection === "motionSection" && <MotionEditor eventKey={eventKey} onBack={() => handleNextSection("motionSection")} />}
      {/* ------------------------------------------------------------- */}
      {/* PRIVACY */}
      {/* ------------------------------------------------------------- */}

      {activeSection === "privacy" && <PrivacyEditor eventKey={eventKey} onBack={() => handleNextSection("privacy")} />}

      {/* ------------------------------------------------------------- */}
      {/* SHARING */}
      {/* ------------------------------------------------------------- */}

      {activeSection === "sharing" && <SharingEditor eventKey={eventKey} onBack={() => handleNextSection("sharing")} />}

      {/* ------------------------------------------------------------- */}
      {/* PRINT */}
      {/* ------------------------------------------------------------- */}

      {activeSection === "print" && <PrintEditor eventKey={eventKey} onBack={() => handleNextSection("print")} />}

      {/* ------------------------------------------------------------- */}
      {/* SETTINGS */}
      {/* ------------------------------------------------------------- */}

      {activeSection === "settings" && <SettingsEditor eventKey={eventKey} onBack={() => handleNextSection("settings")} />}
    </>
  );
}
