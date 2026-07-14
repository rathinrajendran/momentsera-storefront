"use client";

import { Megaphone, Calendar, Compass, Settings, LayoutGrid, Eye, Send, Share2, Link2 } from "lucide-react";

export type MobileMenuProps = {
  showMenuLayer: boolean;
  onSectionClick: () => void;
  onOtherClick: () => void;
  className: string;
};

export default function MobileMenu({ showMenuLayer, onSectionClick, onOtherClick, className }: MobileMenuProps) {
const ToolsMenuItems = [
  {
    id: "sections",
    label: "Sections",
    icon: <LayoutGrid className="h-4 w-4" strokeWidth={1} />,
    onClick: onSectionClick,
  },
  {
    id: "preview",
    label: "Preview",
    icon: <Eye className="h-4 w-4" strokeWidth={1} />,
    onClick: onOtherClick,
  },
  {
    id: "publish",
    label: "",
    icon: (
      <div className="flex items-center justify-center bg-white rounded-full w-15 h-15 -mt-5">
        <Send className="h-4 w-4" strokeWidth={1} />
      </div>
    ),
    onClick: onOtherClick,
  },
  {
    id: "share",
    label: "Share",
    icon: <Share2 className="h-4 w-4" strokeWidth={1} />,
    onClick: onOtherClick,
  },
  {
    id: "link",
    label: "Link",
    icon: <Link2 className="h-4 w-4" strokeWidth={1} />,
    onClick: onOtherClick,
  },
];

  return (
    <div className={`${className} fixed flex right-0 bottom-0 left-0 z-20`}>
      <nav className="flex h-[60px] w-full items-center justify-around rounded-t-3xl bg-amber-200 px-2">
        {ToolsMenuItems.map((item) => {
          // "sections" toggles the menu-layer open/closed; every other
          // button just makes sure the menu-layer is closed.
          const isActive = item.id === "sections" && showMenuLayer;
          return (
            <button
              key={item.id}
              type="button"
              onClick={item.onClick}
              className={`flex flex-col w-22 cursor-pointer items-center justify-center gap-1 rounded-md px-3 py-2.5 text-[10px] font-medium capitalize transition-all md:w-full md:justify-start md:text-[10px] ${
                isActive ? "text-green-700" : ""
              }`}
            >
              {item.icon}
              <span className="max-w-full truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
