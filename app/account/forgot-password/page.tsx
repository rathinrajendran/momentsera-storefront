"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import AuthLayout from "../../components/auth/AuthLayout";
import Link from "next/link";

// 1. Isolate the form logic into an inner component
function ForgotPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Optional: Grab an email from the URL if it was passed from a previous screen
  const defaultEmail = searchParams.get("email") || "";

  const [email, setEmail] = useState(defaultEmail);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setStatus("error");
      setMessage("Please enter your email address.");
      return;
    }

    setStatus("loading");
    setMessage("Sending password reset link...");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong. Please try again.");
      }

      setStatus("success");
      // Redirect to your "Check Email" page, passing the email along
      setTimeout(() => {
        router.push(`/account/check-email?email=${encodeURIComponent(email)}`);
      }, 1500);
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message);
    }
  };

  return (
    <div className="w-full space-y-4">
      {status === "success" ? (
        <div className="text-center">
          <div className="mb-4 rounded-md border border-green-200 bg-green-50 p-4 text-sm text-green-600">
            Reset reference link generated successfully!
          </div>
          <p className="text-xs text-gray-500">Redirecting to confirmation screen...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-center text-sm text-gray-600">
            Enter your account email address below, and we'll send you a link to reset your credentials securely.
          </p>

          {status === "error" && <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">{message}</div>}

          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === "loading"}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none disabled:bg-gray-50 disabled:text-gray-400"
              required
            />
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {status === "loading" ? "Sending Link..." : "Send Reset Link"}
          </button>

          <div className="pt-2 text-center">
            <Link href="/account/login" className="text-sm font-medium text-blue-600 hover:underline">
              &larr; Return to Login
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}

// 2. Wrap everything in a Suspense boundary for build safety
export default function ForgotPasswordPage() {
  return (
    <AuthLayout title="Forgot Password">
      <Suspense
        fallback={
          <div className="flex flex-col items-center text-center">
            <div className="mb-2 h-10 w-10 animate-spin rounded-full border-b-2 border-gray-300"></div>
            <p className="text-sm text-gray-500">Loading form configuration...</p>
          </div>
        }
      >
        <ForgotPasswordContent />
      </Suspense>
    </AuthLayout>
  );
}
