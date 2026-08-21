"use client";

import { DynamicSection, EditorSection } from "./EditorLayout";
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

      {activeSection === "announcement" && <AnnouncementEditor eventKey={eventKey} onBack={() => handleNextSection("announcement")} />}

      {activeSection === "schedule" && <ScheduleEditor eventKey={eventKey} onBack={() => handleNextSection("schedule")} />}
      {activeSection === "ourStory" && <OurStoryEditor eventKey={eventKey} onBack={() => handleNextSection("ourStory")} />}
      {activeSection === "timeline" && <TimelineEditor eventKey={eventKey} onBack={() => handleNextSection("timeline")} />}
      {activeSection === "gallery" && <GalleryEditor eventKey={eventKey} onBack={() => handleNextSection("gallery")} />}
      {activeSection === "dressCode" && <DressCodeEditor eventKey={eventKey} onBack={() => handleNextSection("dressCode")} />}
      {activeSection === "wishes" && <WishesEditor eventKey={eventKey} onBack={() => handleNextSection("wishes")} />}
      {activeSection === "rsvp" && <RSVPEditor eventKey={eventKey} onBack={() => handleNextSection("rsvp")} />}
      {activeSection === "music" && <MusicEditor eventKey={eventKey} onBack={() => handleNextSection("music")} />}
      {activeSection === "color" && <ColorEditor eventKey={eventKey} onBack={() => handleNextSection("color")} />}
      {activeSection === "font" && <FontEditor eventKey={eventKey} onBack={() => handleNextSection("font")} />}
      {activeSection === "shape" && <ShapeEditor eventKey={eventKey} onBack={() => handleNextSection("shape")} />}
      {activeSection === "motionSection" && <MotionEditor eventKey={eventKey} onBack={() => handleNextSection("motionSection")} />}
      {activeSection === "privacy" && <PrivacyEditor eventKey={eventKey} onBack={() => handleNextSection("privacy")} />}
      {activeSection === "sharing" && <SharingEditor eventKey={eventKey} onBack={() => handleNextSection("sharing")} />}
      {activeSection === "print" && <PrintEditor eventKey={eventKey} onBack={() => handleNextSection("print")} />}
      {activeSection === "settings" && <SettingsEditor eventKey={eventKey} onBack={() => handleNextSection("settings")} />}
    </>
  );
}
