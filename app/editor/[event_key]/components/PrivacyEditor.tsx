"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Globe, LockKeyhole, X, Eye, Save, ChevronRight, EyeOff, RefreshCw } from "lucide-react";
import { usePreviewDraft } from "../PreviewDraftContext";
import { useSaveEventSection } from "../../../../hooks/useEvents";
import { Button } from "../../../../components/ui/button";
import { Switch } from "../../../../components/ui/switch";
import { Input } from "../../../../components/ui/input";
import { FormLabel } from "../../../../components/ui/form";
import { cn } from "../../../../utils/utils";
import { HorizontalScroll } from "../../../../components/ui/HorizontalScroll";
import { Separator } from "../../../../components/ui/separator";

import { generatePassword, isValidPassword, sanitizePassword } from "../../../../utils/password";
import EditorHeader from "./EditorHeader";
import { SectionHeader } from "./MotionEditor";
import { PasswordModeType, SectionVisibilityDialog, VisibilityType } from "../SectionVisibilityDialog";

/* -------------------------------------------------------------------------- */
/* TYPES                                   */
/* -------------------------------------------------------------------------- */

type SectionPrivacyConfig = {
  id: string;
  visibility: "visible" | "hidden" | "protected";
  passwordMode: "inherit" | "custom";
  password: string;
  hint?: string;
};

type PrivacyForm = {
  privacy: "public" | "protected";
  password: string;
  allowSectionProtection: boolean;
  sections: Record<string, SectionPrivacyConfig>;
};

type ProtectedSection = {
  id: string;
  label: string;
  allowPassword: boolean;
};

/* -------------------------------------------------------------------------- */
/* STATIC CONFIG                                */
/* -------------------------------------------------------------------------- */

const PROTECTED_SECTIONS: ProtectedSection[] = [
  { id: "announcement", label: "Announcement", allowPassword: false },
  { id: "schedule", label: "Schedule", allowPassword: false },
  { id: "timeline", label: "Timeline", allowPassword: true },
  { id: "dresscode", label: "Dresscode", allowPassword: true },
  { id: "gallery", label: "Gallery", allowPassword: true },
  { id: "music", label: "Music", allowPassword: true },
  { id: "wishes", label: "Wishes", allowPassword: true },
  { id: "rsvp", label: "RSVP", allowPassword: true },
];

export default function PrivacyEditor({ onBack, eventKey }: { onBack: () => void; eventKey: string }) {
  const { draft, updateSection, resetDraft, refreshEvent } = usePreviewDraft();
  const settings = draft.settings ?? {};
  const eventId = draft.invite.id;
  const mutation = useSaveEventSection(eventKey, eventId);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<ProtectedSection | null>(null);

  // Unified data source extraction from settings.section_visibility array
  const currentVisibilityArray = Array.isArray(settings.section_visibility) ? settings.section_visibility : [];

  const defaultSectionsConfig = PROTECTED_SECTIONS.reduce<Record<string, SectionPrivacyConfig>>((acc, sec) => {
    const matchedVisibility = currentVisibilityArray.find((item: any) => item.id === sec.id);

    acc[sec.id] = {
      id: sec.id,
      visibility: matchedVisibility?.visibility ?? "visible",
      passwordMode: matchedVisibility?.passwordMode ?? "inherit",
      password: matchedVisibility?.password ?? "",
      hint: matchedVisibility?.hint ?? "",
    };
    return acc;
  }, {});

  const methods = useForm<PrivacyForm>({
    mode: "onChange",
    defaultValues: {
      privacy: settings.privacy ?? "public",
      password: settings.password ?? "",
      allowSectionProtection: settings.allowSectionProtection ?? false,
      sections: defaultSectionsConfig,
    },
  });

  const { watch, setValue, handleSubmit } = methods;
  const globalPrivacy = watch("privacy");
  const globalPassword = watch("password");
  const globalPasswordValid = isValidPassword(globalPassword);
  const allowSectionProtection = watch("allowSectionProtection");

  function handleLiveChange(updatedFields: Partial<PrivacyForm>) {
    const freshValues = methods.getValues();

    // Transform flat map back into uniform visibility array layout to mirror Overview's mutation path
    const sectionVisibilityPayload = Object.values(freshValues.sections).map((sec) => ({
      id: sec.id,
      visibility: sec.visibility,
      passwordMode: sec.passwordMode,
      password: sec.visibility === "protected" && sec.passwordMode === "custom" ? sec.password : "",
      hint: sec.visibility === "protected" && sec.passwordMode === "custom" ? sec.hint : "",
    }));

    updateSection("settings", {
      ...settings,
      ...freshValues,
      ...updatedFields,
      section_visibility: sectionVisibilityPayload,
    });
  }

  function getVisibilityBadge(secId: string) {
    const config = watch(`sections.${secId}`);
    if (!config) return { label: "Visible", icon: Eye, color: "text-emerald-600 bg-emerald-50" };

    switch (config.visibility) {
      case "protected":
        return { label: "Protected", icon: LockKeyhole, color: "text-amber-600 bg-amber-50" };
      case "hidden":
        return { label: "Hidden", icon: EyeOff, color: "text-slate-500 bg-slate-50" };
      default:
        return { label: "Visible", icon: Eye, color: "text-emerald-600 bg-emerald-50" };
    }
  }

  async function handleSaveSuccess() {
    await refreshEvent(eventKey);
    onBack();
  }

  function handleCancel() {
    resetDraft();
    onBack();
  }

  function onSubmit(values: PrivacyForm) {
    const sectionVisibilityPayload = Object.values(values.sections).map((sec) => ({
      id: sec.id,
      visibility: sec.visibility,
      passwordMode: sec.passwordMode,
      password: sec.visibility === "protected" && sec.passwordMode === "custom" ? sec.password : "",
      hint: sec.visibility === "protected" && sec.passwordMode === "custom" ? sec.hint : "",
    }));

    const cleanValues = {
      privacy: values.privacy,
      password: values.privacy === "protected" ? values.password : "",
      allowSectionProtection: values.allowSectionProtection,
      section_visibility: sectionVisibilityPayload,
    };

    mutation.mutate({ path: "settings", stage: "settings", data: cleanValues }, { onSuccess: handleSaveSuccess });
  }

  const isGlobalPasswordInvalid = globalPrivacy === "protected" && !globalPasswordValid;

  const rolesInvalid =
    allowSectionProtection &&
    PROTECTED_SECTIONS.some((sec) => {
      const secConfig = watch(`sections.${sec.id}`);
      if (!secConfig || secConfig.visibility !== "protected") return false;
      if (globalPrivacy === "protected" && secConfig.passwordMode === "inherit") return false;
      return !isValidPassword(secConfig.password);
    });

  const isFormInvalid = isGlobalPasswordInvalid || rolesInvalid;

  const handleDialogSave = (data: {
    id: string;
    title: string;
    visibility: VisibilityType;
    passwordMode: PasswordModeType;
    password?: string;
    hint?: string;
  }) => {
    setValue(`sections.${data.id}.visibility`, data.visibility);
    setValue(`sections.${data.id}.passwordMode`, data.passwordMode);
    setValue(`sections.${data.id}.password`, data.password || "");
    setValue(`sections.${data.id}.hint`, data.hint || "");
    handleLiveChange({});
  };

  return (
    <div className="animate-in fade-in flex h-full flex-col rounded-lg duration-500 md:rounded-none">
      <EditorHeader title="Privacy" handleCancel={handleCancel} />

      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-1 flex-col justify-between space-y-6 p-5 pb-0 md:min-h-[calc(100dvh-115px)] md:rounded-none [&::-webkit-scrollbar]:h-0 [&::-webkit-scrollbar]:w-[2px] [&::-webkit-scrollbar-thumb]:rounded-[10px] [&::-webkit-scrollbar-thumb]:bg-[#c1c1c1] [&::-webkit-scrollbar-track]:rounded-[10px] [&::-webkit-scrollbar-track]:bg-[#78909C]"
        >
          <section className="space-y-6 [&>*:last-child]:mb-6">
            {/* Access Scope Options */}
            <div className="space-y-2">
              <SectionHeader icon={Globe} label="Invitation Access Scope" />
              <HorizontalScroll>
                <div className="-mx-1 flex gap-3 px-1 pb-2">
                  {[
                    { id: "public", label: "Public Link", description: "Anyone with the link can access", icon: Globe },
                    { id: "protected", label: "Password Gated", description: "Guests must enter a pass code", icon: LockKeyhole },
                  ].map((opt) => {
                    const Icon = opt.icon;
                    const isSelected = globalPrivacy === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          setValue("privacy", opt.id as "public" | "protected");
                          handleLiveChange({ privacy: opt.id as "public" | "protected" });
                        }}
                        className={cn(
                          "flex h-24 w-40 shrink-0 touch-manipulation flex-col justify-between rounded-xl border p-4 text-left transition-all active:scale-98 sm:w-44",
                          isSelected
                            ? "border-slate-900 bg-slate-900 text-white shadow-md shadow-slate-200"
                            : "border-slate-200 bg-slate-50/50 text-slate-700 hover:border-slate-300 hover:bg-white",
                        )}
                      >
                        <Icon size={16} strokeWidth={1.5} className={isSelected ? "text-white" : "text-slate-500"} />
                        <div className="space-y-0.5">
                          <p className="truncate text-xs font-semibold">{opt.label}</p>
                          <p className={cn("line-clamp-2 text-[10px] leading-normal", isSelected ? "text-slate-300" : "text-slate-400")}>
                            {opt.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </HorizontalScroll>
            </div>

            {/* Passcode Input Field */}
            {globalPrivacy === "protected" && (
              <div className="animate-in slide-in-from-top-2 space-y-2 rounded-xl border border-slate-100 bg-slate-50/30 p-4 duration-200">
                <div className="flex items-center justify-between gap-2">
                  <FormLabel className="truncate text-[11px] font-medium text-slate-700">Invitation Passcode</FormLabel>
                  <button
                    type="button"
                    onClick={() => {
                      const pass = generatePassword();
                      setValue("password", pass);
                      handleLiveChange({ password: pass });
                    }}
                    className="inline-flex shrink-0 touch-manipulation items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-slate-900"
                  >
                    <RefreshCw size={10} /> Generate
                  </button>
                </div>
                <Input
                  type="text"
                  maxLength={6}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="6 digit numeric key"
                  className="h-9 font-mono text-base tracking-widest focus:border-slate-400 focus:ring-0 sm:text-sm"
                  value={globalPassword}
                  onChange={(e) => {
                    const clean = sanitizePassword(e.target.value);
                    setValue("password", clean);
                    handleLiveChange({ password: clean });
                  }}
                />
                {globalPassword.length > 0 && !globalPasswordValid && (
                  <p className="text-[10px] font-medium text-red-500">Passcode must equal exactly 6 numeric characters.</p>
                )}
              </div>
            )}

            <Separator className="bg-slate-100" />

            {/* Advanced Permission Rules Switch */}
            <div className="flex items-center justify-between space-x-4">
              <div className="max-w-[calc(100%-60px)] space-y-0.5">
                <FormLabel className="text-[12px] font-medium text-slate-800">Advanced Section Controls</FormLabel>
                <p className="text-[11px] leading-normal text-slate-400">
                  Configure independent access parameters for distinct layout modules.
                </p>
              </div>
              <Switch
                className="origin-right scale-75"
                checked={allowSectionProtection}
                onCheckedChange={(checked) => {
                  setValue("allowSectionProtection", checked);
                  handleLiveChange({ allowSectionProtection: checked });
                }}
              />
            </div>

            {/* Section Buttons Matrix */}
            {allowSectionProtection && (
              <div className="animate-in fade-in space-y-2 pt-2 duration-300">
                <SectionHeader icon={LockKeyhole} label="Module Authorization Registry" />
                <div className="grid grid-cols-1 gap-1.5">
                  {PROTECTED_SECTIONS.map((sec) => {
                    const badge = getVisibilityBadge(sec.id);
                    const BadgeIcon = badge.icon;
                    return (
                      <button
                        key={sec.id}
                        type="button"
                        onClick={() => {
                          setSelectedSection(sec);
                          setDialogOpen(true);
                        }}
                        className="flex w-full touch-manipulation items-center justify-between rounded-lg border border-slate-100 bg-white p-3 transition-all hover:border-slate-200 hover:bg-slate-50/50 active:scale-[0.99] cursor-pointer"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div className={cn("shrink-0 rounded-lg p-2", badge.color)}>
                            <BadgeIcon size={14} />
                          </div>
                          <div className="min-w-0 text-left">
                            <p className="truncate text-xs font-semibold text-slate-800">{sec.label}</p>
                            <p className="truncate text-[10px] font-medium text-slate-400">Manage rules & gating</p>
                          </div>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          <span className={cn("rounded-full px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase", badge.color)}>
                            {badge.label}
                          </span>
                          <ChevronRight size={14} className="text-slate-400" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </section>

          {/* Sticky Actions Bar */}
          <div className="sticky bottom-0 z-[99] -m-5 flex h-[60px] items-center justify-end gap-3 border-slate-100 bg-white/90 px-5 md:border-t md:backdrop-blur-md">
            <Button
              type="button"
              variant="ghost"
              onClick={handleCancel}
              className="touch-manipulation text-xs font-semibold text-slate-400 transition-colors hover:text-slate-900"
            >
              <X strokeWidth={1} size={14} className="mr-1" />
              <span>Discard</span>
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending || isFormInvalid}
              className="flex h-8 touch-manipulation items-center gap-1.5 rounded-md bg-slate-900 px-8 py-2 text-xs text-white shadow-md shadow-slate-100 transition-all hover:bg-slate-800 active:scale-95 disabled:opacity-50 sm:px-10"
            >
              <Save strokeWidth={1.5} size={14} />
              {mutation.isPending ? <span>Saving...</span> : <span>Save Controls</span>}
            </Button>
          </div>
        </form>
      </FormProvider>

      {/* RENDER POPUP DIALOG WITH THE CORRECT VALUES */}
      {selectedSection && dialogOpen && (
        <SectionVisibilityDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          sectionId={selectedSection.id}
          sectionTitle={selectedSection.label}
          value={watch(`sections.${selectedSection.id}.visibility`)}
          passwordMode={watch(`sections.${selectedSection.id}.passwordMode`)}
          password={watch(`sections.${selectedSection.id}.password`)}
          hint={watch(`sections.${selectedSection.id}.hint`)}
          globalPrivacy={globalPrivacy}
          onSave={handleDialogSave}
        />
      )}
    </div>
  );
}
