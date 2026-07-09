"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import AuthLayout from "../../components/auth/AuthLayout";
import PasswordInput from "../../components/auth/PasswordInput";
import PasswordStrength from "../../components/auth/PasswordStrength";

// 1. Move the form logic into its own inner component
function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update password.");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/account/login");
      }, 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {success ? (
        <div className="w-full space-y-2 text-center">
          <div className="rounded-md border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-600">
            Password updated successfully!
          </div>
          <p className="text-xs text-gray-500">Redirecting to login portal context...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          {error && <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</div>}

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">New Password</label>
            <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} />
            <PasswordStrength password={password} />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Confirm New Password</label>
            <PasswordInput value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={isLoading} />
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
            disabled={isLoading || !token}
          >
            {isLoading ? "Saving Password..." : "Reset Password"}
          </button>
        </form>
      )}
    </>
  );
}

// 2. The main page component wraps everything in Suspense
export default function ResetPasswordPage() {
  return (
    <AuthLayout title="Choose New Password">
      <Suspense fallback={<div className="text-center text-sm text-gray-500">Loading form...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </AuthLayout>
  );
}
