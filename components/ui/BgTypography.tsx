interface SectionProps {
  title?: string;
}

export default function BgTypography({ title}: SectionProps) {
  return (
    <div className="pointer-events-none fixed bottom-[-5%] left-1/2 z-0 -translate-x-1/2 opacity-[0.03] select-none">
      <h2 className="text-[24vw] font-black tracking-[-0.1em] whitespace-nowrap text-[var(--text-primary)] uppercase">{title}</h2>
    </div>
  );
}
