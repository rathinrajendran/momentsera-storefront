"use client";

import { ReactNode, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import { useCreateAccount, useCheckAccountExists } from "../../../hooks/useAccounts";

import GridMotion from "../../../components/ui/GridMotion";
import { Header } from "../../(marketing)/components/header/Header";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../../components/ui/form";

import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";

import { ChevronLeft, Sparkles } from "lucide-react";
import Link from "next/link";

/* ---------------- GRID DATA ---------------- */

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

/* ---------------- SCHEMA ---------------- */

const schema = z.object({
  full_name: z.string().min(1, "Full name is required"),

  email: z.string().email("Please enter a valid email address"),

  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof schema>;

/* ---------------- PAGE ---------------- */

export default function RegisterPage() {
  const router = useRouter();

  const createAccount = useCreateAccount();
  const checkAccountExists = useCheckAccountExists();

  const [emailError, setEmailError] = useState<string | null>(null);

  const [checkingEmail, setCheckingEmail] = useState(false);

  const emailLock = useRef(false);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onBlur",

    defaultValues: {
      full_name: "",
      email: "",
      password: "",
    },
  });

  /* ---------------- SUBMIT ---------------- */

  const onSubmit = (values: FormData) => {
    if (emailError) return;

    createAccount.mutate(values, {
      onSuccess: () => {
        router.replace("/account/login");
      },

      onError: (err: any) => {
        const msg = err?.response?.data?.error?.toLowerCase();

        if (msg?.includes("email")) {
          setEmailError("Email already exists");
        }
      },
    });
  };

  /* ---------------- VALIDATIONS ---------------- */

  const validateEmail = async (email: string) => {
    if (!email || emailLock.current) return;

    emailLock.current = true;

    setCheckingEmail(true);

    try {
      const res = await checkAccountExists({ email });

      setEmailError(res.exists ? "Email already exists" : null);
    } finally {
      setCheckingEmail(false);
      emailLock.current = false;
    }
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[var(--background)] text-[var(--text-primary)]">
      <Header />

      {/* Background Glow */}
      <div
        className="pointer-events-none absolute top-[-10%] left-[-10%] h-[600px] w-[600px] rounded-full blur-[140px]"
        style={{
          background: "rgba(132,165,157,0.12)",
        }}
      />

      <div className="relative z-10 grid h-screen w-full grid-cols-1 pt-[64px] md:grid-cols-12">
        {/* LEFT SIDE */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 1.2,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="relative hidden h-full border-r border-[var(--border-color)] md:col-span-7 md:block lg:col-span-8"
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.2,
          }}
          className="glass-card col-span-12 flex h-full flex-col justify-between border-l border-[var(--border-color)] px-10 py-5 md:col-span-5 lg:col-span-4"
        >
          <div className="space-y-10 overflow-y-auto pr-1">
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
              <div className="mb-4 flex items-center gap-2">
                <Sparkles size={14} className="text-[var(--accent-primary)]" />

                <span className="text-[10px] font-bold tracking-[0.2em] text-[var(--text-muted)] uppercase">Create Your Account</span>
              </div>

              <h1 className="mb-3 text-4xl font-bold tracking-tight text-[var(--text-primary)]">Join the Experience</h1>

              <p className="max-w-[320px] text-sm leading-relaxed text-[var(--text-secondary)]">
                Create your account to start building elegant and memorable invitation experiences.
              </p>
            </div>

            {/* FORM */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="mb-0 space-y-5" autoComplete="off">
                {/* Full Name */}
                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="mb-0 text-[0.6rem] tracking-wider text-[var(--text-secondary)] uppercase">Full Name</FormLabel>

                      <FormControl>
                        <Input
                          {...field}
                          placeholder="John Doe"
                          className="h-[42px] border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus-visible:ring-[var(--accent-primary)]"
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="mb-0 text-[0.6rem] tracking-wider text-[var(--text-secondary)] uppercase">
                        Email Address
                      </FormLabel>

                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="name@example.com"
                          onBlur={(e) => {
                            field.onBlur();
                            validateEmail(e.target.value);
                          }}
                          className="h-[42px] border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus-visible:ring-[var(--accent-primary)]"
                        />
                      </FormControl>

                      {checkingEmail && <p className="text-xs text-[var(--text-muted)]">Checking email...</p>}

                      {emailError && <p className="text-sm text-red-500">{emailError}</p>}

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="mb-0 text-[0.6rem] tracking-wider text-[var(--text-secondary)] uppercase">Password</FormLabel>

                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="••••••••"
                          className="h-[42px] border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus-visible:ring-[var(--accent-primary)]"
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={createAccount.isPending || checkingEmail || !!emailError}
                  className="premium-button h-[42px] w-full rounded-md text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {createAccount.isPending ? "Creating account..." : "Create Account"}
                </Button>
              </form>
            </Form>

            {/* Login */}
            <p className="text-sm text-[var(--text-secondary)]">
              Already have an account?
              <button
                onClick={() => router.push("/account/login")}
                className="font-medium text-[var(--accent-primary)] transition-colors hover:opacity-80"
              >
                Sign in
              </button>
            </p>

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
  );
}
