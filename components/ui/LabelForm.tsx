interface Props {
  children: React.ReactNode;
  className?: string;
}

export function LabelForm({ children, className }: Props) {
  return (
    <label
      className={`text-[0.7rem] capitalize font-normal tracking-normal text-slate-900 data-[error=true]:text-destructive ${className}`}
    >
      {children}
    </label>
  );
}
export function SubLabelForm({ children, className }: Props) {
  return (
    <label
      className={`text-[0.65rem] capitalize font-normal tracking-normal text-slate-400 data-[error=true]:text-destructive ${className}`}
    >
      {children}
    </label>
  );
}