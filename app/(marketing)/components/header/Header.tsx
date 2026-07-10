"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Bell, ChevronDown, LayoutDashboard, User, Settings, Heart, LogOut, Sparkles } from "lucide-react";
import { NavMenu } from "./NavMenu";
import { useRouter } from "next/navigation";
import { H2 } from "../../../../components/ui/H2";
import { H6 } from "../../../../components/ui/H6";
import { FullScreenMenu } from "./FullScreenMenu";
import { useLogout } from "../../../../hooks/useLogout";
import { useSession } from "../../../../hooks/useSession";
type headerProps = {
  className?: string;
};

export function Header({ className }: headerProps) {
  const router = useRouter();
  const [hide, setHide] = React.useState(false);
  const [profileOpen, setProfileOpen] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const lastScrollY = React.useRef(0);
  const { user, isAuthenticated: isLoggedIn, loading, refresh } = useSession();
  const { logout } = useLogout();
  console.log("isLoggedIn", isLoggedIn);

  /* ─────────────────────────────
     SCROLL HIDE
  ───────────────────────────── */

  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        setHide(true);
      } else {
        setHide(false);
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ─────────────────────────────
     LOGOUT
  ───────────────────────────── */

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <FullScreenMenu open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      <nav
        className={`fixed top-0 z-[999] h-[45px] w-full bg-[rgba(255,255,255,0.95)] backdrop-blur-md transition-transform duration-300 ease-in-out md:h-[72px] ${className} ${hide ? "-translate-y-full" : "translate-y-0"} `}
      >
        <div className="mx-auto max-w-[1800px] px-[5vw]">
          <div className="flex h-[45px] items-center justify-between md:h-[72px]">
            {/* ─────────────────────
             LOGO
          ───────────────────── */}
            <div className="flex items-center gap-1">
              <Link href="/" style={{ fontFamily: "Plus Jakarta Sans Variable" }} className="tracking-[0.2rem]">
                {/* <LogoBy
              width={150}
              height={30}
              textColor="#d1ae35"
              byColor="#94a397"
              dotColor="#e9a2a3"
            /> */}
                <span className="font-bold uppercase">M</span>
                <span className="font-bold uppercase">o</span>
                <span className="font-semibold uppercase">m</span>
                <span className="font-semibold uppercase">e</span>
                <span className="font-medium uppercase">n</span>
                <span className="font-medium uppercase">t</span>
                <span className="font-regular uppercase">s</span>
                <span className="font-regular uppercase">e</span>
                <span className="font-light uppercase">r</span>
                <span className="font-light uppercase">a</span>
              </Link>
              <button onClick={() => setMobileMenuOpen(true)} className="group flex cursor-pointer items-center p-4">
                <div className="flex flex-col gap-[5px]">
                  <span className="h-[2px] w-5 bg-black transition-all duration-300 group-hover:w-7" />
                  <span className="ml-auto h-[2px] w-3 bg-black transition-all duration-300 group-hover:w-7" />
                </div>
              </button>
            </div>
            {/* ─────────────────────
             MENU
          ───────────────────── */}

            {/* ─────────────────────
             RIGHT SIDE
          ───────────────────── */}

            <div className="flex min-w-[180px] items-center justify-end gap-3">
              {/* GUEST */}

              {!isLoggedIn && (
                <button
                  onClick={() => router.push("/account/login")}
                  className="cursor-pointer bg-transparent text-[10px] font-bold tracking-[0.25em] text-[var(--text-primary)] uppercase transition-all hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)]"
                >
                  Login
                </button>
              )}
              {/* {!isLoggedIn && (
              <button
                onClick={() => router.push("/account/login")}
                className="
                  rounded-full
                  border
                  border-[var(--border-color)]
                  bg-white
                  px-6
                  py-3
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.25em]
                  text-[var(--text-primary)]
                  transition-all
                  hover:border-[var(--accent-primary)]
                  hover:bg-[var(--accent-primary)]
                  hover:text-white
                "
              >
                Invite now
              </button>
            )} */}

              {/* LOGGED USER */}

              {isLoggedIn && (
                <>
                  {/* Notifications */}

                  <button
                    onClick={() => router.push("/account/notifications")}
                    className="relative flex h-12 w-12 cursor-pointer items-center justify-center bg-white text-[var(--text-secondary)] transition-all"
                  >
                    <Bell className="h-5 w-5" />

                    {/* Dot */}

                    <span className="absolute top-3 right-3 h-2 w-2 rounded-full bg-[var(--accent-primary)]" />
                  </button>

                  {/* Profile */}

                  <div className="relative">
                    <button
                      onClick={() => setProfileOpen(!profileOpen)}
                      className="flex cursor-pointer items-center bg-white transition-all"
                    >
                      {/* Avatar */}

                      <div className="relative h-8 w-8 overflow-hidden rounded-full bg-[var(--bg-secondary)]">
                        <Image src="https://picsum.photos/200" alt="Profile" fill className="object-cover" />
                      </div>

                      <ChevronDown className="hidden h-4 w-4 text-[var(--text-muted)]" />
                    </button>

                    {/* Dropdown */}

                    {profileOpen && (
                      <div className="absolute top-[55px] right-0 w-[260px] overflow-hidden rounded-3xl border border-[var(--border-color)] bg-white shadow-xs">
                        {/* Header */}

                        <div className="border-b border-[var(--border-color)] px-6 py-5">
                          <H6>Creative Studio</H6>

                          <H2 variant="small" className="text-lg font-bold tracking-tight">
                            Welcome Back
                          </H2>
                        </div>

                        {/* Menu */}

                        <div className="p-3">
                          {[
                            {
                              label: "Profile",
                              icon: User,
                              href: "/account/profile",
                            },
                            {
                              label: "Dashboard",
                              icon: LayoutDashboard,
                              href: "/account",
                            },
                            {
                              label: "My Invites",
                              icon: Sparkles,
                              href: "/account/invites",
                            },
                            {
                              label: "Favorites",
                              icon: Heart,
                              href: "/account/favorites",
                            },
                            {
                              label: "Settings",
                              icon: Settings,
                              href: "/settings",
                            },
                          ].map((item) => {
                            const Icon = item.icon;

                            return (
                              <Link
                                key={item.label}
                                href={item.href}
                                className="flex items-center gap-4 rounded-md px-4 py-3 text-xs font-medium text-[var(--text-secondary)] transition-all hover:bg-[var(--bg-secondary)] hover:text-[var(--accent-primary)]"
                              >
                                <Icon className="h-4 w-4" strokeWidth={1.5} />

                                {item.label}
                              </Link>
                            );
                          })}

                          {/* Divider */}

                          <div className="my-2 h-px bg-[var(--border-color)]" />

                          {/* Logout */}

                          <button
                            onClick={handleLogout}
                            className="flex w-full cursor-pointer items-center gap-4 rounded-md px-4 py-3 text-xs font-medium text-red-500 transition-all hover:bg-red-50"
                          >
                            <LogOut className="h-4 w-4" strokeWidth={1.5} />
                            Logout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
