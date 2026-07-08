"use client";

import { useState } from "react";
import { Eye, EyeOff, LockKeyhole, RefreshCw, ShieldAlert } from "lucide-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { HorizontalScroll } from "../../../components/ui/HorizontalScroll";
import { generatePassword, isValidPassword, sanitizePassword } from "../../../utils/password";
import { cn } from "../../../utils/utils";

export type VisibilityType = "visible" | "hidden" | "protected";
export type PasswordModeType = "inherit" | "custom";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  sectionId: string;
  sectionTitle: string;

  value: VisibilityType;
  password?: string;
  hint?: string;

  // Added globalPrivacy context to determine if inheritance resolution is available
  globalPrivacy?: "public" | "protected";
  passwordMode?: PasswordModeType;

  onSave: (data: {
    id: string;
    title: string;
    visibility: VisibilityType;
    passwordMode: PasswordModeType;
    password?: string;
    hint?: string;
  }) => void;
};

export function SectionVisibilityDialog({
  open,
  onOpenChange,
  sectionId,
  sectionTitle,
  value,
  password = "",
  hint = "",
  globalPrivacy = "public",
  passwordMode = "custom",
  onSave,
}: Props) {
  const [visibility, setVisibility] = useState<VisibilityType>(value);
  const [resolutionStrategy, setResolutionStrategy] = useState<PasswordModeType>(globalPrivacy === "protected" ? passwordMode : "custom");
  const [sectionPassword, setSectionPassword] = useState(password);
  const [passwordHint, setPasswordHint] = useState(hint);

  const isCustomMode = globalPrivacy !== "protected" || resolutionStrategy === "custom";
  const passwordValid = !isCustomMode || isValidPassword(sectionPassword);
  const isInvalid = visibility === "protected" && !passwordValid;

  function handleGeneratePassword() {
    setSectionPassword(generatePassword());
  }

  /* ---------------- CARD OPTION MODEL DATA ---------------- */
  const VISIBILITY_PRESETS = [
    {
      id: "visible",
      title: "Always Visible",
      description: "Accessible by all layout visitors",
      icon: Eye,
    },
    {
      id: "hidden",
      title: "Hidden / Disabled",
      description: "Skipped completely from display",
      icon: EyeOff,
    },
    {
      id: "protected",
      title: "Passcode Gated",
      description: "Requires explicit numeric access key",
      icon: LockKeyhole,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "animate-in fade-in zoom-in-95 border border-slate-100 bg-white p-5 shadow-xl duration-200 outline-none",
          "mx-auto w-[calc(100%-2rem)] max-w-[420px] rounded-2xl md:w-full",
        )}
      >
        <DialogHeader className="flex flex-row items-center justify-between border-b border-slate-50 pb-2">
          <div className="max-w-[90%] space-y-0.5">
            <DialogTitle className="truncate text-sm font-bold text-slate-900">{sectionTitle} Visibility</DialogTitle>
            <p className="line-clamp-1 text-[10px] font-medium text-slate-400">Configure layout runtime presence parameters</p>
          </div>
        </DialogHeader>

        <div className="mt-4 space-y-5">
          {/* HORIZONTAL PRESET CARDS LIST */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Scope Parameters</span>
            <HorizontalScroll>
              <div className="-mx-1 flex gap-2.5 px-1 pb-1">
                {VISIBILITY_PRESETS.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = visibility === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setVisibility(opt.id as VisibilityType)}
                      className={cn(
                        "flex h-24 w-32 shrink-0 touch-manipulation flex-col justify-between rounded-xl border p-3 text-left transition-all select-none active:scale-98 sm:w-36",
                        isSelected
                          ? "border-slate-900 bg-slate-900 text-white shadow-md shadow-slate-200"
                          : "border-slate-100 bg-slate-50/50 text-slate-700 hover:border-slate-200 hover:bg-white",
                      )}
                    >
                      <Icon size={14} className={isSelected ? "text-white" : "text-slate-400"} />
                      <div className="space-y-0.5">
                        <p className="text-xs font-semibold">{opt.title}</p>
                        <p className={cn("line-clamp-2 text-[9px] leading-normal", isSelected ? "text-slate-300" : "text-slate-400")}>
                          {opt.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </HorizontalScroll>
          </div>

          {/* CONDITIONAL PASSCODE CONTROLS */}
          {visibility === "protected" && (
            <div className="animate-in slide-in-from-top-2 space-y-4 rounded-xl border border-slate-100 bg-slate-50/30 p-4 duration-200">
              {/* Passcode Resolution Strategy mapping logic synced with reference parameters */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">Resolution Strategy</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "inherit", title: "Inherit Key", disabled: globalPrivacy !== "protected" },
                    { id: "custom", title: "Custom Passcode", disabled: false },
                  ].map((strat) => {
                    const isSelected = resolutionStrategy === strat.id;
                    return (
                      <button
                        key={strat.id}
                        type="button"
                        disabled={strat.disabled}
                        onClick={() => setResolutionStrategy(strat.id as PasswordModeType)}
                        className={cn(
                          "touch-manipulation rounded-lg border p-2 text-center text-[11px] font-semibold transition-all disabled:pointer-events-none disabled:opacity-30",
                          isSelected
                            ? "border-slate-900 bg-slate-900 text-white"
                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
                        )}
                      >
                        {strat.title}
                      </button>
                    );
                  })}
                </div>
              </div>

              {isCustomMode && (
                <div className="animate-in fade-in space-y-3 duration-200">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <label className="truncate text-[11px] font-semibold text-slate-700">Dedicated Segment Passcode</label>
                      <button
                        type="button"
                        onClick={handleGeneratePassword}
                        className="inline-flex shrink-0 touch-manipulation items-center gap-1 text-[11px] font-medium text-slate-500 transition-colors hover:text-slate-900"
                      >
                        <RefreshCw size={10} /> Generate Key
                      </button>
                    </div>
                    <Input
                      type="text"
                      maxLength={6}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="6 digit numeric code"
                      value={sectionPassword}
                      className="h-9 border-slate-200 bg-white font-mono text-base text-sm tracking-widest focus:border-slate-400 focus:ring-0 sm:text-sm"
                      onChange={(e) => setSectionPassword(sanitizePassword(e.target.value))}
                    />
                    {sectionPassword.length > 0 && !passwordValid && (
                      <p className="flex animate-pulse items-center gap-1 text-[10px] font-medium text-red-500">
                        <ShieldAlert size={10} className="shrink-0" /> Passcode must contain exactly 6 numeric elements.
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <label className="text-[11px] font-semibold text-slate-700">Optional Context Hint</label>
                    <Input
                      type="text"
                      placeholder="e.g. Groom's sister last name"
                      value={passwordHint}
                      maxLength={50}
                      className="h-9 border-slate-200 bg-white text-base focus:border-slate-400 focus:ring-0 sm:text-sm"
                      onChange={(e) => setPasswordHint(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SAVE TRIGGER FOOTER ACTION */}
          <button
            type="button"
            disabled={isInvalid}
            onClick={() => {
              onSave({
                id: sectionId,
                title: sectionTitle,
                visibility,
                passwordMode: resolutionStrategy,
                password: visibility === "protected" && resolutionStrategy === "custom" ? sectionPassword : "",
                hint: visibility === "protected" && resolutionStrategy === "custom" ? passwordHint : "",
              });
              onOpenChange(false);
            }}
            className="h-10 w-full touch-manipulation rounded-lg bg-slate-900 text-xs font-semibold text-white shadow-md shadow-slate-100 transition-all hover:bg-slate-800 active:scale-98 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
          >
            Apply Configurations
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
