import { Monitor, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  device: "desktop" | "mobile";
  onChange: (device: "desktop" | "mobile") => void;
  className?: string;
};

export function DeviceSwitcher({ device, onChange, className }: Props) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <button
        onClick={() => onChange("mobile")}
        className={cn("flex h-6 w-7 cursor-pointer items-center justify-center rounded-sm transition-all duration-200")}
      >
        <Smartphone
          size={18}
          strokeWidth={1.8}
          fill={device === "mobile" ? "#84a59d" : "#ffffff"}
          className={device === "mobile" ? "#1B5E20" : "#1B5E20"}
        />
      </button>
      <button
        onClick={() => onChange("desktop")}
        className={cn("flex h-6 w-7 cursor-pointer items-center justify-center rounded-sm transition-all duration-200")}
      >
        <Monitor
          size={18}
          strokeWidth={1.8}
          fill={device === "desktop" ? "#fafafa" : "#ffffff"}
          className={device === "desktop" ? "text-green-500" : "#ffffff"}
        />
      </button>
    </div>
  );
}
