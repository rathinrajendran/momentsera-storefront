"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import AuthLayout from "../../components/auth/AuthLayout";
import Link from "next/link";

export default function CheckEmailPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "your email inbox";

  return (
    <AuthLayout title="Check Your Email">
      <div className="space-y-4 text-center">
        <div className="mb-2 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600">
          <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 19v-8.93a2 2 0 01.89-1.664l8-5.333a2 2 0 012.22 0l8 5.333A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-2.25-1.5a2 2 0 00-2.22 0l-2.25 1.5"
            />
          </svg>
        </div>
        <p className="text-sm text-gray-600">
          We have sent a verification or recovery reference link to secure credentials at:
          <br />
          <strong className="break-all text-gray-900">{email}</strong>
        </p>
        <p className="text-xs text-gray-500">
          Be sure to check your spam filter folders if the confirmation code doesn't arrive within a few minutes.
        </p>
        <div className="pt-4">
          <Link href="/account/login" className="text-sm font-medium text-blue-600 hover:underline">
            &larr; Return to Login
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
