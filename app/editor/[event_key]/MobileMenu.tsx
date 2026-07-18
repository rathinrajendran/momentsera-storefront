"use client";

import { LayoutGrid, Eye, Send, Share2, Link2, Rocket } from "lucide-react";

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
      icon: <LayoutGrid className="h-4 w-4" strokeWidth={1} />,
      onClick: onSectionClick,
    },
    {
      id: "preview",
      label: "Preview",
      icon: <Eye className="h-4 w-4" strokeWidth={1} />,
      onClick: onPreviewClick,
    },
    {
      id: "publish",
      icon: (
        <div className="flex flex-col items-center justify-center rounded-lg bg-[#84a59d] px-3 py-2">
          <Rocket className="h-5 w-5" width={15} strokeWidth={1} fill="#ffffff" stroke="#ffffff" />
          <h1 className="font-medium tracking-wider text-white">Publish</h1>
        </div>
      ),
      onClick: onPublishClick,
    },
    {
      id: "share",
      label: "Share",
      icon: <Share2 className="h-4 w-4" strokeWidth={1} />,
      onClick: onShareClick,
    },
    {
      id: "link",
      label: "Link",
      icon: <Link2 className="h-4 w-4" strokeWidth={1} />,
      onClick: onLinkClick,
    },
  ];

  return (
    <div className={`${className} fixed right-0 bottom-0 left-0 z-20 flex px-3 pb-3`}>
      <nav className="flex h-[60px] w-full items-center justify-around rounded-t-3xl rounded-b-2xl bg-white px-2">
        {ToolsMenuItems.map((item) => {
          // "sections" toggles the menu-layer open/closed; every other
          // button just makes sure the menu-layer is closed.
          const isActive = item.id === "sections" && showMenuLayer;
          return (
            <button
              key={item.id}
              type="button"
              onClick={item.onClick}
              className={`flex w-22 cursor-pointer flex-col items-center justify-center gap-1 rounded-md text-[10px] font-medium capitalize transition-all md:w-full md:justify-start md:text-[10px] ${
                isActive ? "text-green-700" : "text-gray-700"
              }`}
            >
              {item.icon}
              {item.label && <span className="max-w-full truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
