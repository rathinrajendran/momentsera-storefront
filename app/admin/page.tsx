"use client";

import { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronLeft, Sparkles } from "lucide-react";
import { useLogin } from "../../hooks/useAuth";
import { Header } from "../(marketing)/components/header/Header";
import GridMotion from "../../components/ui/GridMotion";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

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
  email: z.string().email("Please enter a valid email address"),

  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof schema>;

/* ---------------- PAGE ---------------- */

export default function LoginPage() {
  const router = useRouter();

  const loginMutation = useLogin();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),

    mode: "onBlur",

    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { setError } = form;

  const onSubmit = (values: FormData) => {
    debugger;
    loginMutation.mutate(values, {
      onSuccess: (data: any) => {
        localStorage.setItem("token", data.token);
        localStorage.setItem("uId", String(data.user.id));
        localStorage.setItem("role", data.user.role);
        if (data.user.role === "admin") {
          router.replace("/dashboard");
          return;
        }
      },

      onError: () => {
        setError("password", {
          type: "manual",
          message: "Invalid email or password",
        });
      },
    });
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
          className="glass-card col-span-12 flex h-full flex-col justify-between p-10 md:col-span-5 lg:col-span-4"
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
              <div className="mb-4 flex items-center gap-2">
                <Sparkles size={14} className="text-[var(--accent-primary)]" />

                <span className="text-[10px] font-bold tracking-[0.2em] text-[var(--text-muted)] uppercase">Secure Access</span>
              </div>

              <h1 className="mb-3 text-4xl font-bold tracking-tight text-[var(--text-primary)]">Welcome Back</h1>

              <p className="max-w-[320px] text-sm leading-relaxed text-[var(--text-secondary)]">
                Sign in to continue managing your beautifully crafted invitation experiences.
              </p>
            </div>

            {/* FORM */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="mb-5 space-y-5">
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
                          autoComplete="email"
                          className="h-[42px] border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus-visible:ring-[var(--accent-primary)]"
                        />
                      </FormControl>

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
                          autoComplete="current-password"
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
                  disabled={loginMutation.isPending}
                  className="premium-button h-[42px] w-full rounded-md text-sm font-medium text-white"
                >
                  {loginMutation.isPending ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </Form>

            {/* Register */}
            <p className="text-sm text-[var(--text-secondary)]">
              Don’t have an account?
              <button
                onClick={() => router.push("/account/register")}
                className="font-medium text-[var(--accent-primary)] transition-colors hover:opacity-80"
              >
                Create account
              </button>
            </p>

            {/* Footer */}
            <div className="border-t border-[var(--border-color)] pt-8">
              <p className="text-[9px] tracking-widest text-[var(--text-muted)] uppercase">© 2026 themomentsby. Studio Selection.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
