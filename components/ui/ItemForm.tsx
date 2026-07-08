interface Props {
  children: React.ReactNode;
}

export function ItemForm({ children }: Props) {
  return (
    <label className="grid gap-1">
      {children}
    </label>
  );
}