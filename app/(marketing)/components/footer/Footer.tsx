"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { Button } from "../../../../components/ui/button";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 600);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <footer className="relative overflow-hidden border-t border-[var(--border-color)] bg-[var(--background)] px-6 pt-20 pb-10 md:px-20">
      {/* Background Typography */}

      <div className="pointer-events-none absolute right-[-5%] bottom-[-20%] opacity-[0.03] select-none">
        <h2 className="text-[18vw] font-black tracking-[-0.1em] whitespace-nowrap text-[var(--text-primary)] uppercase">Studio.</h2>
      </div>

      <div className="relative z-10 mx-auto max-w-[1440px]">
        {/* TOP */}

        <div className="grid grid-cols-2 gap-16 border-b border-[var(--border-color)] pb-20 md:grid-cols-[minmax(290px,1fr)_1fr_1fr] md:gap-8">
          {/* Column 1 */}

          <div className="col-span-2 space-y-6 md:col-span-1">
            <div className="flex tracking-[0.2rem] text-[var(--accent-primary)]">
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
            </div>
            <p className="font-regular max-w-[260px] text-xs leading-7 tracking-normal text-[var(--text-secondary)] transition-colors hover:text-[var(--accent-primary)]">
              A premium digital invitation studio crafting immersive experiences for the GCC market.
            </p>

            <p className="text-[10px] font-bold tracking-widest text-[var(--text-primary)] uppercase">Kerala</p>
          </div>

          {/* Column 2 */}

          <div className="space-y-6 md:col-span-1">
            <h4 className="text-xs font-bold tracking-[0.2rem] text-[var(--text-muted)] uppercase">Studio</h4>

            <nav className="flex flex-col gap-4">
              {[
                {
                  label: "Invitations",
                  href: "/invites",
                },

                {
                  label: "Support",
                  href: "/support",
                },

                {
                  label: "Privacy",
                  href: "/privacy-policy",
                },

                {
                  label: "Terms",
                  href: "/terms-and-conditions",
                },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="font-regular w-fit text-xs leading-7 tracking-normal text-[var(--text-secondary)] transition-colors hover:text-[var(--accent-primary)]"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 3 */}

          <div className="space-y-6 md:col-span-1">
            <h4 className="text-xs font-bold tracking-[0.2rem] text-[var(--text-muted)] uppercase">Connect</h4>

            <div className="flex flex-col gap-4">
              {[
                {
                  label: "Instagram",
                  href: "https://instagram.com",
                },

                {
                  label: "Behance",
                  href: "https://behance.net",
                },

                {
                  label: "LinkedIn",
                  href: "https://linkedin.com",
                },

                {
                  label: "WhatsApp",
                  href: "https://wa.me/971566955389",
                },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-regular w-fit text-xs leading-7 tracking-normal text-[var(--text-secondary)] transition-colors hover:text-[var(--accent-primary)]"
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* BOTTOM */}

        <div className="flex flex-col items-center justify-between gap-6 pt-10 md:flex-row">
          <p className="text-[9px] font-bold tracking-[0.3em] text-[var(--text-muted)] uppercase">
            © {currentYear} THE MOMENTS BY. ALL RIGHTS RESERVED.
          </p>

          <div className="flex gap-8">
            {[
              {
                label: "Privacy",
                href: "/privacy-policy",
              },

              {
                label: "Terms",
                href: "/terms-and-conditions",
              },

              {
                label: "Support",
                href: "/support",
              },
            ].map((legal) => (
              <Link
                key={legal.label}
                href={legal.href}
                className="text-[9px] font-bold tracking-widest text-[var(--text-light)] uppercase transition-colors hover:text-[var(--accent-primary)]"
              >
                {legal.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Button
        type="button"
        onClick={scrollToTop}
        aria-label="Back to top"
        className={`fixed right-6 bottom-6 z-50 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-[var(--border-color)] bg-[var(--background)] text-[var(--text-primary)] shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[var(--accent-primary)] hover:bg-[var(--accent-primary)] hover:text-white md:right-8 md:bottom-8 ${
          showScrollTop ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
        } `}
      >
        <ArrowUp size={18} className="transition-transform duration-300 group-hover:-translate-y-0.5" />
      </Button>
    </footer>
  );
}
