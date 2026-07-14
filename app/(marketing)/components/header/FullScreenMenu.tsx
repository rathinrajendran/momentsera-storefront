"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Para } from "../../../../components/ui/Para";

type Props = {
  open: boolean;
  onClose: () => void;
};

const menuItems = [
  {
    number: "01",
    label: "Home",
    href: "/",
  },
  {
    number: "02",
    label: "Invites",
    href: "/invites",
  },
  {
    number: "04",
    label: "About",
    href: "/about-us",
  },
  {
    number: "05",
    label: "Contact",
    href: "/contact-us",
  },
];

export function FullScreenMenu({ open, onClose }: Props) {
  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{
            opacity: 0,
            clipPath: "circle(0% at 60px 60px)",
          }}
          animate={{
            opacity: 1,
            clipPath: "circle(150% at 60px 60px)",
          }}
          exit={{
            opacity: 0,
            clipPath: "circle(0% at 60px 60px)",
          }}
          transition={{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="fixed inset-0 z-[9999999] overflow-hidden bg-[#08090a] text-white"
        >
          {/* Background Letter */}

          <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.03]">
            <span className="text-[35vw] leading-none font-black">E</span>
          </div>

          {/* Top Bar */}

          <div className="relative z-10 mx-auto flex h-[45px] max-w-[1800px] items-center gap-1 px-[5vw] md:h-[72px]">
            <Link href="/" onClick={onClose} className="font-regular tracking-[0.2rem]">
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

            <button onClick={onClose} className="group relative cursor-pointer p-4">
              {/* <span className="absolute top-1/2 left-1/2 h-[1.5px] w-4 -translate-x-1/2 rotate-45 bg-white" />
              <span className="absolute top-1/2 left-1/2 h-[1.5px] w-4 -translate-x-1/2 -rotate-45 bg-white" /> */}
              <div className="flex flex-col gap-[5px]">
                <span className="h-[1.5px] w-7 bg-white transition-all duration-300 group-hover:w-5" />
                <span className="ml-auto h-[1.5px] w-7 bg-white transition-all duration-300 group-hover:w-3" />
              </div>
            </button>
          </div>

          {/* Navigation */}

          {/* Navigation */}

          <div className="relative z-10 h-[calc(100vh-100px)] overflow-y-auto px-[5vw] pt-10 pb-12 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="mx-auto flex min-h-full w-full max-w-[1600px] flex-col">
              <div className="flex-1">
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{
                      opacity: 0,
                      y: 80,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: 0.1 + index * 0.08,
                      duration: 0.8,
                    }}
                  >
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className="group flex items-center justify-between border-b border-white/10 py-5"
                    >
                      <div className="flex items-center gap-8">
                        <span className="text-xs tracking-[0.3em] opacity-40">{item.number}</span>

                        <span className="text-[clamp(38px,9vw,120px)] leading-none font-black tracking-[-0.06em] transition-all duration-500 group-hover:translate-x-4 group-hover:text-[#84a59d]">
                          {item.label}
                        </span>
                      </div>

                      <span className="hidden text-sm opacity-0 transition-all duration-500 group-hover:opacity-100 md:block">→</span>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Footer */}

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="mt-15">
                <div className="grid gap-8 md:grid-cols-3">
                  <div>
                    <p className="text-[10px] tracking-[0.3em] text-white/40 uppercase">Studio</p>

                    <Para className="mt-3 text-white/70" variant={"small"}>
                      Kerala, India · UAE
                    </Para>
                  </div>

                  <div>
                    <p className="text-[10px] tracking-[0.3em] text-white/40 uppercase">Expertise</p>

                    <Para className="mt-3 text-white/70" variant={"small"}>
                      Digital Invitations
                      <br />
                      Web Experiences
                    </Para>
                  </div>

                  <div>
                    <p className="text-[10px] tracking-[0.3em] text-white/40 uppercase">About</p>

                    <Para className="mt-3 max-w-sm text-white/50" variant={"small"}>
                      Digital invitations and web experiences crafted to transform celebrations into memorable online journeys.
                    </Para>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
