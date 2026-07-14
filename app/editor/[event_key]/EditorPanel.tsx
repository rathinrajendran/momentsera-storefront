"use client";

import { EditorSection } from "./EditorLayout";
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
import RSVPEditor from "./components/RSVPEditor";
import FontEditor from "./components/FontEditor";
import ColorEditor from "./components/ColorEditor";
import ShapeEditor from "./components/ShapeEditor";
import BackgroundEditor from "./components/BackgroundEditor";

type SectionItem = {
  id: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
  visibilityCheck: boolean;
};

export default function EditorPanel({
  eventKey,
  activeSection,
  onSectionChange,
  overviewScrollTop,
  onOverviewScrollChange,
  activeTab, // Added parameter from layout
  currentSections, // Added parameter from layout
}: {
  activeSection: EditorSection;
  onSectionChange: (s: EditorSection) => void;
  eventKey: string;
  overviewScrollTop: number;
  onOverviewScrollChange: (value: number) => void;
  activeTab: string; // Added type rule
  currentSections: readonly SectionItem[]; // Added type rule
}) {
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
      {activeSection === "announcement" && <AnnouncementEditor eventKey={eventKey} onBack={() => onSectionChange("overview")} />}
      {activeSection === "schedule" && <ScheduleEditor eventKey={eventKey} onBack={() => onSectionChange("overview")} />}
      {activeSection === "timeline" && <TimelineEditor eventKey={eventKey} onBack={() => onSectionChange("overview")} />}
      {activeSection === "gallery" && <GalleryEditor eventKey={eventKey} onBack={() => onSectionChange("overview")} />}
      {activeSection === "dressCode" && <DressCodeEditor eventKey={eventKey} onBack={() => onSectionChange("overview")} />}
      {activeSection === "wishes" && <WishesEditor eventKey={eventKey} onBack={() => onSectionChange("overview")} />}
      {activeSection === "rsvp" && <RSVPEditor eventKey={eventKey} onBack={() => onSectionChange("overview")} />}
      {activeSection === "music" && <MusicEditor eventKey={eventKey} onBack={() => onSectionChange("overview")} />}
      {activeSection === "settings" && <SettingsEditor eventKey={eventKey} onBack={() => onSectionChange("overview")} />}
      {activeSection === "background" && <BackgroundEditor eventKey={eventKey} onBack={() => onSectionChange("overview")} />}
      {activeSection === "font" && <FontEditor eventKey={eventKey} onBack={() => onSectionChange("overview")} />}
      {activeSection === "color" && <ColorEditor eventKey={eventKey} onBack={() => onSectionChange("overview")} />}
      {activeSection === "shape" && <ShapeEditor eventKey={eventKey} onBack={() => onSectionChange("overview")} />}
      {activeSection === "privacy" && <PrivacyEditor eventKey={eventKey} onBack={() => onSectionChange("overview")} />}
      {activeSection === "sharing" && <SharingEditor eventKey={eventKey} onBack={() => onSectionChange("overview")} />}
      {activeSection === "motionSection" && <MotionEditor eventKey={eventKey} onBack={() => onSectionChange("overview")} />}
      {activeSection === "print" && <PrintEditor eventKey={eventKey} onBack={() => onSectionChange("overview")} />}
    </>
  );
}
