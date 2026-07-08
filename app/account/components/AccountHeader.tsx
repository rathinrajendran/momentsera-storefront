"use client";

import { BrickWallIcon, Heart, LayoutDashboard, Sparkles, User } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

import Dock from "../../../components/bits/Dock";

export default function AccountHeader() {
  const router = useRouter();
  const pathname = usePathname();

  const items = [
    {
      icon: <LayoutDashboard size={18} strokeWidth={1} />,
      label: "Home",
      href: "/account",
      onClick: () => router.push("/account"),
    },
    {
      icon: <Sparkles size={18} strokeWidth={1} />,
      label: "Invites",
      href: "/account/invites",
      onClick: () => router.push("/account/invites"),
    },
    {
      icon: <Heart size={18} strokeWidth={1} />,
      label: "Wishes",
      href: "/account/wishes",
      onClick: () => router.push("/account/wishes"),
    },
    {
      icon: <User size={18} strokeWidth={1} />,
      label: "Account",
      href: "/account/profile",
      onClick: () => router.push("/account/profile"),
    },
    {
      icon: <BrickWallIcon size={18} strokeWidth={1} />,
      label: "Billing",
      href: "/account/billing",
      onClick: () => router.push("/account/billing"),
    },
  ];

  return <Dock items={items} panelHeight={68} baseItemSize={50} magnification={70} activePath={pathname} />;
}
