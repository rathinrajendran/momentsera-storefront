interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageLayout({ children, className = "" }: PageLayoutProps) {
  return (
    <main className={`relative min-h-screen overflow-hidden bg-[var(--background)] text-[var(--text-primary)] ${className}`}>
      {children}
    </main>
  );
}
