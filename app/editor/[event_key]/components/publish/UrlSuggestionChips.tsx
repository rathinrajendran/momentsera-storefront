"use client";

type Props = {
  suggestions: string[];
  onSelect: (value: string) => void;
};

export function UrlSuggestionChips({ suggestions, onSelect }: Props) {
  if (!suggestions.length) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="max-h-18 overflow-x-auto [&::-webkit-scrollbar]:h-[2px] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-md [&::-webkit-scrollbar-thumb]:bg-[#c1c1c1] [&::-webkit-scrollbar-track]:rounded-md [&::-webkit-scrollbar-track]:bg-[#78909C]">
        <div className="flex flex-wrap gap-2">
          {suggestions.map((slug) => (
            <button
              key={slug}
              type="button"
              onClick={() => onSelect(slug)}
              className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50"
            >
              {slug}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
