type CircularPercentageProps = {
  percentage: number;
  size?: number;
  strokeWidth?: number;
};

export function CircularPercentage({ percentage, size = 13, strokeWidth = 1.2 }: CircularPercentageProps) {
  const value = Math.min(100, Math.max(0, percentage));

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex items-center gap-1">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        {/* Background circle */}
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#D9DDE0" strokeWidth={strokeWidth} />

        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#202124"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500 ease-out"
        />
      </svg>

      <span className="text-[0.6rem] font-regular text-[#62666C]">{value}%</span>
    </div>
  );
}
