import { RadioGroupItem } from "../../../../../components/ui/radio-group";
import { cn } from "../../../../../utils/utils";
import { TYPOGRAPHY_COLORS, TypographyColorKey } from "../../../../[event_key]/invites/core/config/themeConfigs";

type TypographyPaletteCardProps = {
  paletteKey: TypographyColorKey;
  active: boolean;
};

export function TypographyPaletteCard({ paletteKey, active }: TypographyPaletteCardProps) {
  const colors = TYPOGRAPHY_COLORS[paletteKey];

  return (
    <label
      htmlFor={`palette-${paletteKey}`}
      className={cn(
        "shrink-0 cursor-pointer rounded-md border px-3 py-3 transition-all",
        active ? "border-slate-900 bg-slate-900 text-white shadow-lg shadow-slate-200" : "border-slate-200 bg-white",
      )}
    >
      <RadioGroupItem value={paletteKey} id={`palette-${paletteKey}`} className="hidden" />

      <div className="mb-2 flex items-center gap-1.5 md:mb-6">
        {[colors.heading, colors.primary, colors.secondary].map((color) => (
          <div key={color} className="h-4 w-4 rounded-full border border-white/20 md:h-5 md:w-5" style={{ backgroundColor: color }} />
        ))}
      </div>

      <p className={cn("truncate text-[0.6rem] tracking-wide capitalize md:text-[0.7rem]", active ? "text-white/90" : "text-slate-500")}>
        {paletteKey}
      </p>
    </label>
  );
}
