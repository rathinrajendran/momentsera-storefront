"use client";

import { LayoutGrid, Eye, Send, Share2, Link2 } from "lucide-react";

export type MobileMenuProps = {
  showMenuLayer: boolean;
  onSectionClick: () => void;
  onPreviewClick: () => void;
  onShareClick: () => void;
  onLinkClick: () => void;
  onPublishClick: () => void;
  className: string;
};

export default function MobileMenu({ showMenuLayer, onSectionClick, onPreviewClick,onShareClick,onLinkClick,onPublishClick, className }: MobileMenuProps) {
  const ToolsMenuItems = [
    {
      id: "sections",
      label: "Sections",
      icon: <LayoutGrid className="h-4 w-4" />,
      onClick: onSectionClick,
    },
    {
      id: "preview",
      label: "Preview",
      icon: <Eye className="h-4 w-4" />,
      onClick: onPreviewClick,
    },
    {
      id: "publish",
      label: "",
      icon: (
        <div className="-mt-5 flex h-15 w-15 items-center justify-center rounded-full bg-white">
          <Send className="h-8 w-8" width={15} strokeWidth={1.5} fill="#84a59d" />
        </div>
      ),
      onClick: onPublishClick,
    },
    {
      id: "share",
      label: "Share",
      icon: <Share2 className="h-4 w-4" />,
      onClick: onShareClick,
    },
    {
      id: "link",
      label: "Link",
      icon: <Link2 className="h-4 w-4" />,
      onClick: onLinkClick,
    },
  ];

  return (
    <div className={`${className} fixed right-0 bottom-0 left-0 z-20 flex`}>
      <nav className="flex h-[60px] w-full items-center justify-around rounded-t-3xl bg-[#84a59d] px-2">
        {ToolsMenuItems.map((item) => {
          // "sections" toggles the menu-layer open/closed; every other
          // button just makes sure the menu-layer is closed.
          const isActive = item.id === "sections" && showMenuLayer;
          return (
            <button
              key={item.id}
              type="button"
              onClick={item.onClick}
              className={`flex w-22 cursor-pointer flex-col items-center justify-center gap-1 rounded-md px-3 py-2.5 text-[10px] font-medium capitalize transition-all md:w-full md:justify-start md:text-[10px] ${
                isActive ? "text-green-700" : "text-white"
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
