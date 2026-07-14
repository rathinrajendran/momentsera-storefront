"use client";

import { useMemo, useState } from "react";
import { Check, Loader2 } from "lucide-react";

import { UrlSearch } from "./UrlSearch";
import { UrlAvailability } from "./UrlAvailability";
import { UrlSuggestionChips } from "./UrlSuggestionChips";
import { useUrlSuggestions } from "./useUrlSuggestions";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../../../../components/ui/dialog";

import { useCheckEventKey } from "../../../../../hooks/useEvents";
import { useDebounce } from "../../../../../hooks/useDebounce";
import { safeDecode } from "../../PreviewToolbar";
import { cn } from "../../../../../utils/utils";

type Props = {
  children?: React.ReactNode; // Made optional

  open?: boolean;
  onOpenChange?: (open: boolean) => void;

  inviteUrl: string;
  onInviteUrlChange: (value: string) => void;
  inviteData: {
    id?: number;
    eventKey?: string;
    eventType?: string;
    year?: number;
    firstName?: string;
    secondName?: string;
  };
};

export function CustomizeDialog({
  children,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  inviteUrl,
  onInviteUrlChange,
  inviteData,
}: Props) {
  // Support both controlled and uncontrolled states
  const [localOpen, setLocalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : localOpen;
  const setOpen = isControlled ? controlledOnOpenChange : setLocalOpen;

  const decodedInviteUrl = useMemo(() => safeDecode(inviteUrl), [inviteUrl]);
  const [query, setQuery] = useState(decodedInviteUrl);
  const [hasEdited, setHasEdited] = useState(false);
  const suggestions = useUrlSuggestions(inviteData.firstName ?? "", inviteData.secondName ?? "", inviteData.year);
  const debouncedQuery = useDebounce(query.trim(), 500);
  const normalizedQuery = query.trim();
  const shouldCheck = open && hasEdited && normalizedQuery.length > 2 && normalizedQuery !== decodedInviteUrl;
  const { data, isLoading } = useCheckEventKey(shouldCheck ? debouncedQuery : "");
  const canSave = !hasEdited || normalizedQuery === decodedInviteUrl || (!!normalizedQuery && !isLoading && data?.available);

  const reset = () => {
    setQuery(decodedInviteUrl);
    setHasEdited(false);
  };

  const handleOpenChange = (value: boolean) => {
    setOpen?.(value);
    if (value) {
      setQuery(decodedInviteUrl);
      setHasEdited(false);
      return;
    }
    reset();
  };

  const handleSave = () => {
    if (!canSave) return;
    onInviteUrlChange(normalizedQuery);
    setOpen?.(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}

      <DialogContent
        className={cn(
          "animate-in fade-in zoom-in-95 border border-slate-100 bg-white p-5 shadow-xl duration-200 outline-none",
          "mx-auto w-[calc(100%-2rem)] max-w-[420px] rounded-2xl md:w-full",
        )}
      >
        <DialogHeader className="flex flex-row items-center justify-between border-b border-slate-50 pb-2">
          <div className="max-w-[90%] space-y-0.5">
            <DialogTitle className="truncate text-sm font-bold text-slate-900">Customize invite link</DialogTitle>
            <p className="line-clamp-1 text-[10px] font-medium text-slate-400">
              Choose a unique and memorable link that guests can use to access your invitation
            </p>
          </div>
        </DialogHeader>

        <div className="mt-4 space-y-5">
          <div className="relative space-y-1.5">
            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Link Configuration</span>

            <UrlSearch
              value={query}
              suggestions={suggestions}
              onChange={(value) => {
                setHasEdited(true);
                setQuery(value);
              }}
            />

            {hasEdited && (
              <div className="min-h-[20px] transition-all duration-150">
                <UrlAvailability available={data?.available} isLoading={isLoading} />
              </div>
            )}
          </div>

          {suggestions && suggestions.length > 0 && (
            <div className="space-y-2 rounded-xl border border-slate-100 bg-slate-50/30 p-4 duration-200">
              <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">Suggested Invitation URLs</p>
              <UrlSuggestionChips
                suggestions={suggestions}
                onSelect={(value) => {
                  setHasEdited(true);
                  setQuery(value);
                }}
              />
            </div>
          )}

          <button
            type="button"
            disabled={!canSave || isLoading}
            onClick={handleSave}
            className="flex h-10 w-full cursor-pointer touch-manipulation items-center justify-center gap-2 rounded-lg bg-slate-900 text-xs font-semibold text-white shadow-md shadow-slate-100 transition-all hover:bg-slate-800 active:scale-98 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isLoading ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
            Apply Link Customization
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
