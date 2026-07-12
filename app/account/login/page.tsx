"use client";

import { useRouter } from "next/navigation";
import React, { ReactNode, useState } from "react";
import AuthLayout from "../../components/auth/AuthLayout";
import Link from "next/link";
import PasswordInput from "../../components/auth/PasswordInput";
import GoogleButton from "../../components/auth/GoogleButton";
import { motion } from "framer-motion";
import GridMotion from "../../../components/ui/GridMotion";
import { ChevronLeft, Sparkles } from "lucide-react";
import { useLogin } from "../../../hooks/useLogin";
import { Header } from "../../(marketing)/components/header/Header";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const loginMutation = useLogin();

  const isLoading = loginMutation.isPending;
  const dummyImages: string[] = Array.from({ length: 12 }, (_, i) => `https://picsum.photos/seed/${i + 40}/800/800`);

  const items: (string | ReactNode)[] = [
    "Planning",
    <div key="jsx-1" className="font-bold tracking-tighter text-[var(--accent-primary)] uppercase italic">
      Event Setup
    </div>,
    dummyImages[0],
    "Guests",
    <div key="jsx-2" className="font-bold tracking-tighter uppercase italic">
      Invitations
    </div>,
    dummyImages[1],
    "Schedule",
    <div key="jsx-3" className="font-bold tracking-tighter uppercase italic">
      Timeline
    </div>,
    dummyImages[2],
    "Design",
    <div key="jsx-4" className="font-bold tracking-tighter text-[var(--accent-primary)] uppercase italic">
      Theme
    </div>,
    dummyImages[3],
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await loginMutation.mutateAsync({
        email,
        password,
      });
      const pending = sessionStorage.getItem("pending_event");
      if (pending) {
        const invite = JSON.parse(pending);
        sessionStorage.removeItem("pending_event");
        router.replace(`/invites/${invite.event_type}/${invite.invite_key}/onboarding`);
      } else {
        router.replace("/invites");
      }
    } catch (err: any) {
      setError(err.message ?? "Login failed");
    }
  };

  return (
    <AuthLayout title="Sign In to Your Account">
      <main className="relative min-h-screen w-full overflow-hidden bg-[var(--background)] text-[var(--text-primary)]">
        <Header />

        <div className="relative z-10 grid h-screen w-full grid-cols-1 pt-[64px] md:grid-cols-12">
          {/* LEFT SIDE */}
          <motion.div
            initial={{
              opacity: 0,
              x: -20,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 1.2,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="relative hidden h-[calc(100vh-93px)] mt-[8px] md:col-span-7 md:block lg:col-span-8 pl-5"
          >
            {/* <div
            className="
              absolute
              inset-0
              z-20
              bg-gradient-to-r
              from-transparent
              via-transparent
              to-[var(--background)]
            "
          /> */}

            <GridMotion items={items} gradientColor="var(--background)" />

            <div className="absolute bottom-12 left-12 z-30 flex items-center gap-4">
              <div className="h-px w-12 bg-[var(--accent-primary)]" />

              <span className="text-[10px] font-bold tracking-[0.4em] text-[var(--text-muted)] uppercase">Curating Your Moment</span>
            </div>
          </motion.div>

          {/* RIGHT SIDE */}
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              delay: 0.2,
            }}
            className="col-span-12 flex h-full flex-col justify-between px-10 py-4 md:col-span-5 lg:col-span-4"
          >
            <div className="space-y-12">
              {/* Back */}
              <button
                onClick={() => router.push("/invites")}
                className="group flex items-center gap-3 text-[10px] font-bold tracking-widest text-[var(--text-muted)] uppercase transition-colors hover:text-[var(--accent-primary)]"
              >
                <ChevronLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                Return to Studio
              </button>

              {/* Header */}
              <div>
                {/* <div className="mb-4 flex items-center gap-2">
                  <Sparkles size={14} className="text-[var(--accent-primary)]" />
                  <span className="text-[10px] font-bold tracking-[0.2em] text-[var(--text-muted)] uppercase">Secure Access</span>
                </div> */}
                <h1 className="mb-3 text-4xl font-bold tracking-tight text-[var(--text-primary)]">Welcome Back</h1>
                {/* <p className="max-w-[320px] text-sm leading-relaxed text-[var(--text-secondary)]">
                  Sign in to continue managing your beautifully crafted invitation experiences.
                </p> */}
              </div>
              <div>
                {/* FORM */}
                <form onSubmit={handleSubmit} className="w-full space-y-4">
                  {error && <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</div>}

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <label className="block text-sm font-medium text-gray-700">Password</label>
                      <Link href="/account/forgot-password" id="forgot-password" className="text-xs text-blue-600 hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} />
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing In..." : "Sign In"}
                  </button>
                </form>

                <div className="relative my-6 flex w-full items-center justify-center">
                  <div className="absolute w-full border-t border-gray-300"></div>
                  <span className="relative z-10 bg-white px-3 text-xs text-gray-500">OR CONTINUE WITH</span>
                </div>

                <GoogleButton />

                <p className="text-sm text-[var(--text-secondary)]">
                  Don't have an account?{" "}
                  <Link href="/account/register" className="font-medium text-[var(--accent-primary)] transition-colors hover:opacity-80">
                    Create account
                  </Link>
                </p>
              </div>
              {/* Footer */}
              <div className="border-t border-[var(--border-color)] pt-2">
                <nav className="flex gap-4">
                  {[
                    {
                      label: "Privacy Policy",
                      href: "/privacy-policy",
                    },
                    {
                      label: "Terms and Conditions",
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
            </div>
          </motion.div>
        </div>
      </main>
    </AuthLayout>
  );
}
