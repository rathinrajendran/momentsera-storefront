"use client";

import { useEffect, useRef } from "react";
import { EditorSection } from "./EditorLayout";
import { ChevronRight } from "lucide-react";

type SectionItem = {
  id: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
  visibilityCheck: boolean;
};

type Props = {
  activeTab: string;
  currentSections: readonly SectionItem[];
  onSelect: (section: EditorSection) => void;
  scrollTop: number;
  onScrollChange: (value: number) => void;
};

export default function EditorOverview({ activeTab, currentSections = [], onSelect, scrollTop, onScrollChange }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleCardSelect = (id: EditorSection) => {
    if (scrollRef.current) {
      onScrollChange(scrollRef.current.scrollTop);
    }
    onSelect(id);
  };

  useEffect(() => {
    if (scrollRef.current && scrollTop > 0) {
      scrollRef.current.scrollTop = scrollTop;
    }
  }, [scrollTop]);

  return (
    <div className="flex h-full flex-col overflow-hidden bg-white px-4 pt-6 md:px-6 md:pt-8">
      <div className="mb-5">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 capitalize">{activeTab}</h2>
      </div>

      <div className="flex-1 overflow-hidden">
        <div ref={scrollRef} className="h-full space-y-3 overflow-y-auto pb-24 md:space-y-3.5 md:pb-10">
          {activeTab === "preview" ? (
            <div className="flex h-40 flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 p-6 text-center text-sm text-zinc-400">
              <p>Opening live interactive preview overlay...</p>
            </div>
          ) : (
            currentSections.map(({ id, title, desc, icon }) => (
              <EditorCard key={id} title={title} desc={desc} icon={icon} onClick={() => handleCardSelect(id as EditorSection)} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function EditorCard({ title, desc, icon, onClick }: { title: string; desc: string; icon: React.ReactNode; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="flex cursor-pointer items-center justify-between rounded-xl border border-zinc-100 bg-white p-4 shadow-sm transition-all duration-200 hover:border-zinc-200/80 hover:shadow-md md:rounded-2xl md:p-5"
    >
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-zinc-100/50 bg-zinc-50 text-zinc-500">
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold text-zinc-800">{title}</h3>
          <p className="mt-0.5 truncate text-xs font-medium text-zinc-400">{desc}</p>
        </div>
      </div>
      <ChevronRight size={16} className="ml-2 shrink-0 text-zinc-300" />
    </div>
  );
}
