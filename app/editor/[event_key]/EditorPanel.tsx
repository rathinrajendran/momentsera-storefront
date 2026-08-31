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
  onHandleChangeBack: (section: EditorSection) => void;
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
  onHandleChangeBack,
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
  const onHandleBack = (currentSection: EditorSection) => {
    onHandleChangeBack(currentSection);
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

      {activeSection === "announcement" && <AnnouncementEditor eventKey={eventKey} handleBack={() => onHandleBack("overview")} onBack={() => handleNextSection("announcement")} />}

      {activeSection === "schedule" && <ScheduleEditor eventKey={eventKey} handleBack={() => onHandleBack("overview")} onBack={() => handleNextSection("schedule")} />}
      {activeSection === "ourStory" && <OurStoryEditor eventKey={eventKey} handleBack={() => onHandleBack("overview")} onBack={() => handleNextSection("ourStory")} />}
      {activeSection === "timeline" && <TimelineEditor eventKey={eventKey} handleBack={() => onHandleBack("overview")} onBack={() => handleNextSection("timeline")} />}
      {activeSection === "gallery" && <GalleryEditor eventKey={eventKey} handleBack={() => onHandleBack("overview")} onBack={() => handleNextSection("gallery")} />}
      {activeSection === "dressCode" && <DressCodeEditor eventKey={eventKey} handleBack={() => onHandleBack("overview")} onBack={() => handleNextSection("dressCode")} />}
      {activeSection === "wishes" && <WishesEditor eventKey={eventKey} handleBack={() => onHandleBack("overview")} onBack={() => handleNextSection("wishes")} />}
      {activeSection === "rsvp" && <RSVPEditor eventKey={eventKey} handleBack={() => onHandleBack("overview")} onBack={() => handleNextSection("rsvp")} />}
      {activeSection === "music" && <MusicEditor eventKey={eventKey} handleBack={() => onHandleBack("overview")} onBack={() => handleNextSection("music")} />}
      {activeSection === "color" && <ColorEditor eventKey={eventKey} handleBack={() => onHandleBack("overview")} onBack={() => handleNextSection("color")} />}
      {activeSection === "font" && <FontEditor eventKey={eventKey} handleBack={() => onHandleBack("overview")} onBack={() => handleNextSection("font")} />}
      {activeSection === "shape" && <ShapeEditor eventKey={eventKey} handleBack={() => onHandleBack("overview")} onBack={() => handleNextSection("shape")} />}
      {activeSection === "motionSection" && <MotionEditor eventKey={eventKey} handleBack={() => onHandleBack("overview")} onBack={() => handleNextSection("motionSection")} />}
      {activeSection === "privacy" && <PrivacyEditor eventKey={eventKey} handleBack={() => onHandleBack("overview")} onBack={() => handleNextSection("privacy")} />}
      {activeSection === "sharing" && <SharingEditor eventKey={eventKey} handleBack={() => onHandleBack("overview")} onBack={() => handleNextSection("sharing")} />}
      {activeSection === "print" && <PrintEditor eventKey={eventKey} handleBack={() => onHandleBack("overview")} onBack={() => handleNextSection("print")} />}
      {activeSection === "settings" && <SettingsEditor eventKey={eventKey} handleBack={() => onHandleBack("overview")} onBack={() => handleNextSection("settings")} />}
    </>
  );
}
