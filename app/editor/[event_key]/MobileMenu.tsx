"use client";

import { LayoutGrid, Share2, Link2, Rocket, Smartphone } from "lucide-react";
import { PublishButton } from "./components/publish/PublishButton";

export type MobileMenuProps = {
  showMenuLayer: boolean;
  onSectionClick: () => void;
  onPreviewClick: () => void;
  onShareClick: () => void;
  onLinkClick: () => void;
  onPublishClick: () => void;
  className: string;
};

export default function MobileMenu({
  showMenuLayer,
  onSectionClick,
  onPreviewClick,
  onShareClick,
  onLinkClick,
  onPublishClick,
  className,
}: MobileMenuProps) {
  const ToolsMenuItems = [
    {
      id: "sections",
      label: "Customize",
      icon: <LayoutGrid className="h-4 w-4" strokeWidth={1.5} />,
      onClick: onSectionClick,
    },
    {
      id: "preview",
      label: "Preview",
      icon: <Smartphone className="h-4 w-4" strokeWidth={1.5} />,
      onClick: onPreviewClick,
    },
    {
      id: "publish",
      icon: <PublishButton type="mobile" />,
    },
    {
      id: "share",
      label: "Share",
      icon: <Share2 className="h-4 w-4" strokeWidth={1.5} />,
      onClick: onShareClick,
    },
    {
      id: "link",
      label: "Link",
      icon: <Link2 className="h-4 w-4" strokeWidth={1.5} />,
      onClick: onLinkClick,
    },
  ];

  return (
    <div className={`${className} fixed right-0 bottom-0 left-0 z-20 flex px-3 pb-3`}>
      <nav className="flex h-[60px] w-full items-center justify-around rounded-t-3xl rounded-b-2xl bg-white px-2">
        {ToolsMenuItems.map((item) => {
          if (item.id === "publish") {
            return (
              <div key={item.id} className="flex items-center justify-center">
                {item.icon}
              </div>
            );
          }

          const isActive = item.id === "sections" && showMenuLayer;

          return (
            <button
              key={item.id}
              type="button"
              onClick={item.onClick}
              className={`flex w-22 cursor-pointer flex-col items-center justify-center gap-1 rounded-md text-[10px] font-medium capitalize transition-all ${
                isActive ? "text-green-700" : "text-gray-700"
              }`}
            >
              {item.icon}
              {item.label && <span className="max-w-full truncate text-[0.6rem] font-semibold">{item.label}</span>}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
