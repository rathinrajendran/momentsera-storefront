"use client";

import { usePathname } from "next/navigation";
import { useIdleLogout } from "../hooks/useIdleLogout";
import "./globals.css";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isPublicRoute = pathname.startsWith("/account/login");

  useIdleLogout({ enabled: !isPublicRoute });

  return <>{children}</>;
}
