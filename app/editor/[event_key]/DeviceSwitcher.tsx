import { Monitor, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  device: "desktop" | "mobile";
  onChange: (device: "desktop" | "mobile") => void;
  className?: string;
};

export function DeviceSwitcher({ device, onChange, className }: Props) {
  return (
    <div className={cn("flex items-center gap-1 rounded-md border border-slate-200 p-0.5", className)}>
      <button
        onClick={() => onChange("mobile")}
        className={`${device === "mobile" ? "bg-slate-200" : ""} flex h-7 cursor-pointer items-center justify-center gap-1 rounded-sm px-2 transition-all duration-200`}
      >
        <Smartphone size={18} strokeWidth={1.8} /> <span className="text-[0.7rem] font-semibold">Mobile</span>
      </button>
      <button
        onClick={() => onChange("desktop")}
        className={`${device === "desktop" ? "bg-slate-200" : ""} flex h-7 cursor-pointer items-center justify-center gap-1 rounded-sm px-2 transition-all duration-200`}
      >
        <Monitor size={18} strokeWidth={1.8} />
        <span className="text-[0.7rem] font-semibold">Desktop</span>
      </button>
    </div>
  );
}
