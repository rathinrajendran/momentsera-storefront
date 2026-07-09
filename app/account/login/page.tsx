"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import AuthLayout from "../../components/auth/AuthLayout";
import Link from "next/link";
import PasswordInput from "../../components/auth/PasswordInput";
import GoogleButton from "../../components/auth/GoogleButton";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid credentials");
      }

      // Backend already created HttpOnly cookie.

      const pending = sessionStorage.getItem("pending_event");

      if (pending) {
        const invite = JSON.parse(pending);

        sessionStorage.removeItem("pending_event");

        router.replace(`/invites/${invite.event_type}/${invite.invite_key}/onboarding`);
      } else {
        router.replace("/dashboard");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Sign In to Your Account">
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

      <p className="mt-6 text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <Link href="/account/register" className="font-medium text-blue-600 hover:underline">
          Register
        </Link>
      </p>
    </AuthLayout>
  );
}
