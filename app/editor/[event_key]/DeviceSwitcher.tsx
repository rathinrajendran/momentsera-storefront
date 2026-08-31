import { Monitor, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  device: "desktop" | "mobile";
  onChange: (device: "desktop" | "mobile") => void;
  className?: string;
};

export function DeviceSwitcher({ device, onChange, className }: Props) {
  return (
    <div className={cn("", className)}>
      <button
        onClick={() => onChange("mobile")}
        className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-md hover:bg-[#eaeef2] ${device === "mobile" ? "bg-[#eaeef2]" : ""}`}
      >
        <Smartphone className="w-[15px]" strokeWidth={0.9} stroke="#000000" />
      </button>
      <button
        onClick={() => onChange("desktop")}
        className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-md hover:bg-[#eaeef2] ${device === "desktop" ? "bg-[#eaeef2]" : ""}`}
      >
        <Monitor className="w-[15px]" strokeWidth={0.9} stroke="#000000" />
      </button>
    </div>
  );
}
