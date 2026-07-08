interface Props {
  children: React.ReactNode;
}

export function ControlForm({ children }: Props) {
  return (
    <div className="">
      {children}
    </div>
  );
}