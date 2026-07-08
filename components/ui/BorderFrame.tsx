
export const BorderFrame = () => {
  return (
    <div className="fixed inset-0 z-0">
      <div className="absolute top-0 left-1/4 h-full w-px bg-[var(--border-color)]" />
      <div className="absolute top-0 left-2/4 h-full w-px bg-[var(--border-color)]" />
      <div className="absolute top-0 left-3/4 h-full w-px bg-[var(--border-color)]" />
    </div>
  );
};

