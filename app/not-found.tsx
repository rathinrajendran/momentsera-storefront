import Link from "next/link";
import { ArrowLeft, Home, Sparkles } from "lucide-react";
import logo from "@/assets/images/logo/logo.svg";
import Image from "next/image";

export default function NotFound() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#faf9f7] text-[#171717]">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-32 h-80 w-80 rounded-full bg-[#eee8df] blur-3xl" />
        <div className="absolute -right-32 -bottom-32 h-96 w-96 rounded-full bg-[#f0e7e5] blur-3xl" />
      </div>

      <div className="relative flex min-h-screen items-center justify-center px-6 py-16">
        <div className="w-full max-w-xl text-center">
          {/* Brand */}
          <Link
            href="/"
            className="mb-12 inline-flex items-center gap-2 text-sm font-semibold tracking-[0.18em] text-neutral-700 uppercase"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 text-white">M</span>
            Momentsera
          </Link>

          {/* 404 */}
          <div className="relative mx-auto mb-8 w-fit">
            <span className="text-[clamp(8rem,25vw,13rem)] leading-none font-semibold tracking-[-0.08em] text-neutral-200 select-none">
              404
            </span>

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/80 bg-white/80 shadow-xl backdrop-blur">
                <Sparkles className="h-6 w-6 text-neutral-700" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="mx-auto max-w-md">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Invitation not found</h1>

            <p className="mt-4 text-sm leading-6 text-neutral-500 sm:text-base">
              The invitation you're looking for doesn't exist, may have been removed, or the link may no longer be valid.
            </p>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-neutral-900 px-6 text-sm font-medium text-white shadow-sm transition hover:bg-neutral-800"
            >
              <Home className="h-4 w-4" />
              Back to Home
            </Link>

            <button
              type="button"
              // onClick={() => window.history.back()}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-6 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </button>
          </div>

          {/* Footer */}
          <p className="mt-12 text-xs text-neutral-400">
            Create beautiful moments with <span className="font-medium text-neutral-600">Momentsera</span>
          </p>
          <Image src={logo} alt="Logo" />
        </div>
      </div>
    </main>
  );
}
