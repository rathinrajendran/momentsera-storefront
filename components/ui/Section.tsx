interface SectionProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
}

export default function Section({ children, className = "", containerClassName = "" }: SectionProps) {
  return (
    <section className={`relative z-10 py-30 ${className}`}>
      <div className={`mx-auto w-full max-w-[1800px] px-[5vw] ${containerClassName}`}>{children}</div>
    </section>
  );
}
