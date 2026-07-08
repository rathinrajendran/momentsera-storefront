interface Props {
  children: React.ReactNode;
}

function FormLabel({ children }: Props) {
  return (
    <label className="flex items-center gap-2 text-sm font-medium">
      {children}
    </label>
  );
}