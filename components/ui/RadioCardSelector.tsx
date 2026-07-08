import { HorizontalScroll } from "./HorizontalScroll";
import { RadioGroup } from "./radio-group";

// RadioCardSelector.tsx
type RadioCardSelectorProps<T extends string> = {
  value: T;
  onChange: (value: T) => void;
  options: T[];
  renderCard: (option: T, active: boolean) => React.ReactNode;
};

export function RadioCardSelector<T extends string>({
  value,
  onChange,
  options,
  renderCard,
}: RadioCardSelectorProps<T>) {
  return (
    <RadioGroup
      value={value}
      onValueChange={(val) => onChange(val as T)}
      className="grid grid-cols-1"
    >
      <HorizontalScroll>
        {options.map((option) => (
          <div key={option}>{renderCard(option, value === option)}</div>
        ))}
      </HorizontalScroll>
    </RadioGroup>
  );
}
