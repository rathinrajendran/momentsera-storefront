"use client";

import { useState } from "react";

import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

type Props = {
  value: string;
  onChange: (value: string) => void;
  suggestions: string[];
};

export function UrlSearch({ value, onChange, suggestions }: Props) {
  const [open, setOpen] = useState(true);

  const filteredSuggestions = suggestions.filter((item) => item.toLowerCase().includes(value.toLowerCase()) && item !== value);

  const showSuggestions = open && value.length > 0 && filteredSuggestions.length > 0;

  return (
    <div className="relative space-y-3">
      <div className="text-xs text-slate-500">Invitation URL</div>

      <div className="relative">
        <Command className="command-block overflow-visible">
          <CommandInput
            className="command-input h-[38px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-medium tracking-normal text-[#171717] shadow-[inset_0_80px_0_0_#ffffff] transition-colors outline-none placeholder:text-[#cccccc] focus-visible:border-slate-400 focus-visible:ring-0 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:h-[42px]"
            placeholder="Search or create URL..."
            value={value}
            onValueChange={onChange}
          />

          {showSuggestions && (
            <CommandList className="absolute top-[calc(100%+8px)] right-0 left-0 z-[100] overflow-hidden rounded-md border border-slate-200 bg-white py-2 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
              <CommandEmpty>No suggestions found</CommandEmpty>

              {filteredSuggestions.map((slug) => (
                <CommandItem
                  className="cursor-pointer px-4 py-2 text-[0.75rem] font-light text-gray-900"
                  key={slug}
                  value={slug}
                  onSelect={() => {
                    onChange(slug);
                    setOpen(false);
                  }}
                >
                  {slug}
                </CommandItem>
              ))}
            </CommandList>
          )}
        </Command>
      </div>
    </div>
  );
}
